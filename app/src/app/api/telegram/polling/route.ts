import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { telegram_settings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { verifyAdminToken } from "@/lib/auth-middleware"

interface PollingState {
  isActive: boolean
  lastUpdate: number
  instanceId: string
}

const POLLING_LOCK_KEY = 'telegram_polling_lock'
const POLLING_TIMEOUT = 120000 // 120 секунд
const INSTANCE_ID = `polling_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

class PollingManager {
  private abortController: AbortController | null = null
  private pollingPromise: Promise<void> | null = null
  
  async getTelegramSettings() {
    try {
      const settings = await db.select().from(telegram_settings).limit(1)
      return settings[0] || null
    } catch (error) {
      console.error("❌ Ошибка получения настроек Telegram:", error)
      throw new Error("Не удалось получить настройки из базы данных")
    }
  }

  async updateTelegramSettings(updates: {
    subscriber_chat_id?: string | null
    is_active?: boolean
  }) {
    try {
      const settings = await this.getTelegramSettings()
      if (settings) {
        await db
          .update(telegram_settings)
          .set({ ...updates, updated_at: new Date() })
          .where(eq(telegram_settings.id, settings.id))
      }
    } catch (error) {
      console.error("❌ Ошибка обновления настроек Telegram:", error)
      throw new Error("Не удалось обновить настройки в базе данных")
    }
  }

  async sendMessage(botToken: string, chatId: string, text: string, replyMarkup?: {
    inline_keyboard?: Array<Array<{ text: string; callback_data: string }>>
  }) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          reply_markup: replyMarkup,
          parse_mode: "HTML"
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Telegram API error: ${response.status} - ${errorData.description || 'Unknown error'}`)
      }
      
      return await response.json()
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('📤 Отправка сообщения прервана по таймауту')
        return null
      }
      console.error("❌ Ошибка отправки сообщения:", error)
      throw error
    }
  }

  async processUpdate(update: {
    message?: {
      chat: { id: number }
      text?: string
    }
    callback_query?: {
      message: { chat: { id: number } }
      data?: string
      id: string
    }
  }, botToken: string) {
    try {
      if (update.message) {
        const chatId = update.message.chat.id.toString()
        const text = update.message.text

        if (text === "/start") {
          const settings = await this.getTelegramSettings()
          if (settings?.subscriber_chat_id) {
            await this.sendMessage(botToken, chatId, "❌ Уведомления уже настроены для другого пользователя.")
          } else {
            await this.sendMessage(botToken, chatId, 
              "👋 Добро пожаловать!\n\n" +
              "Я помогу вам получать уведомления о новых заявках с сайта.\n\n" +
              "Нажмите кнопку ниже, чтобы начать получать уведомления:",
              {
                inline_keyboard: [[
                  { text: "🔔 Начать получать уведомления", callback_data: "subscribe" }
                ]]
              }
            )
          }
        }
      }

      if (update.callback_query) {
        const chatId = update.callback_query.message.chat.id.toString()
        const data = update.callback_query.data

        if (data === "subscribe") {
          const settings = await this.getTelegramSettings()
          if (settings?.subscriber_chat_id) {
            await this.sendMessage(botToken, chatId, "❌ Уведомления уже настроены для другого пользователя.")
          } else {
            await this.updateTelegramSettings({ 
              subscriber_chat_id: chatId,
              is_active: true 
            })
            await this.sendMessage(botToken, chatId, 
              "✅ Отлично! Настройка завершена!\n\n" +
              "🔔 Теперь вы будете получать уведомления о всех новых заявках с сайта.\n\n" +
              "📱 Система активна и готова к работе!"
            )
          }

          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)
          
          await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              callback_query_id: update.callback_query.id
            }),
            signal: controller.signal
          }).finally(() => clearTimeout(timeoutId))
        }
      }
    } catch (error) {
      console.error("❌ Ошибка обработки обновления:", error)
    }
  }

  async startPolling() {
    if (this.pollingPromise) {
      console.log('🔄 Polling уже запущен')
      return
    }

    this.abortController = new AbortController()
    let offset = 0
    const signal = this.abortController.signal

    console.log(`🚀 Запуск Telegram polling [${INSTANCE_ID}]`)

    this.pollingPromise = (async () => {
      try {
        while (!signal.aborted) {
          const settings = await this.getTelegramSettings()
          
          if (!settings?.bot_token) {
            console.log("⚠️ Токен бота не найден, ожидание...")
            await this.sleep(10000, signal)
            continue
          }

          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), POLLING_TIMEOUT + 5000)
          
          signal.addEventListener('abort', () => controller.abort())

          try {
            const response = await fetch(
              `https://api.telegram.org/bot${settings.bot_token}/getUpdates?offset=${offset}&timeout=${POLLING_TIMEOUT / 1000}`,
              { 
                method: "GET",
                signal: controller.signal
              }
            )

            clearTimeout(timeoutId)

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            if (data.ok && data.result.length > 0) {
              for (const update of data.result) {
                if (signal.aborted) break
                
                await this.processUpdate(update, settings.bot_token)
                offset = update.update_id + 1
              }
            }
          } catch (fetchError) {
            clearTimeout(timeoutId)
            
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
              if (signal.aborted) {
                console.log('🛑 Polling остановлен по сигналу')
                break
              }
            } else {
              console.error("❌ Polling fetch error:", fetchError)
              await this.sleep(5000, signal)
            }
          }
        }
      } catch (error) {
        console.error("❌ Polling error:", error)
      } finally {
        console.log(`⏹️ Telegram polling остановлен [${INSTANCE_ID}]`)
        this.pollingPromise = null
        this.abortController = null
      }
    })()

    return this.pollingPromise
  }

  private async sleep(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(resolve, ms)
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId)
        resolve()
      })
    })
  }

  stopPolling() {
    if (this.abortController) {
      this.abortController.abort()
    }
  }

  isActive(): boolean {
    return this.pollingPromise !== null && this.abortController !== null
  }
}

const pollingManager = new PollingManager()

export const GET = async (req: NextRequest) => {
  try {
    await verifyAdminToken(req)
    
    const settings = await pollingManager.getTelegramSettings()
    
    if (!settings?.bot_token) {
      return NextResponse.json({ 
        error: "Токен бота не настроен. Пожалуйста, добавьте токен в настройках." 
      }, { status: 400 })
    }

    if (!pollingManager.isActive()) {
      await pollingManager.startPolling()
      return NextResponse.json({ 
        message: "Система уведомлений запущена", 
        subscribedChatId: settings.subscriber_chat_id,
        isActive: true,
        instanceId: INSTANCE_ID
      })
    }

    return NextResponse.json({ 
      message: "Система уведомлений уже работает", 
      subscribedChatId: settings.subscriber_chat_id,
      isActive: true,
      instanceId: INSTANCE_ID
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("❌ GET /api/telegram/polling error:", error)
    return NextResponse.json({ 
      error: "Ошибка подключения к базе данных. Проверьте настройки подключения." 
    }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const { action } = await req.json()
    
    if (action !== "restart") {
      await verifyAdminToken(req)
    }

    if (action === "stop") {
      pollingManager.stopPolling()
      await pollingManager.updateTelegramSettings({ is_active: false })
      return NextResponse.json({ message: "Система уведомлений остановлена" })
    }

    if (action === "restart") {
      console.log("🔄 Restarting Telegram polling due to token change...")
      pollingManager.stopPolling()
      
      while (pollingManager.isActive()) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      try {
        await pollingManager.startPolling()
        console.log("✅ Telegram polling restarted successfully")
        return NextResponse.json({ message: "Polling успешно перезапущен с новым токеном" })
      } catch (error) {
        console.error("❌ Failed to restart polling:", error)
        return NextResponse.json({ error: "Ошибка перезапуска polling" }, { status: 500 })
      }
    }

    if (action === "reset") {
      await pollingManager.updateTelegramSettings({ 
        subscriber_chat_id: null,
        is_active: false 
      })
      return NextResponse.json({ message: "Настройки сброшены" })
    }

    if (action === "status") {
      try {
        const settings = await pollingManager.getTelegramSettings()
        return NextResponse.json({ 
          subscribedChatId: settings?.subscriber_chat_id || null,
          isPolling: pollingManager.isActive(),
          isActive: settings?.is_active || false,
          hasToken: !!settings?.bot_token,
          instanceId: INSTANCE_ID
        })
      } catch (error) {
        console.error("❌ Status check error:", error)
        return NextResponse.json({ 
          subscribedChatId: null,
          isPolling: false,
          isActive: false,
          hasToken: false,
          instanceId: INSTANCE_ID
        })
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("❌ POST /api/telegram/polling error:", error)
    return NextResponse.json({ 
      error: "Ошибка обработки запроса. Проверьте настройки подключения к базе данных." 
    }, { status: 500 })
  }
} 