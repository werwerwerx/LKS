import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { telegram_settings, contact_requests } from "@/lib/db/schema"

const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 минут
const RATE_LIMIT_MAX_REQUESTS = 3 // максимум 3 заявки за 15 минут

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIP = req.headers.get('x-real-ip')
  const cfConnectingIP = req.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) return realIP
  if (cfConnectingIP) return cfConnectingIP
  
  return 'unknown'
}

function isRateLimited(clientIP: string): boolean {
  const now = Date.now()
  const clientData = rateLimitMap.get(clientIP)
  
  if (!clientData || now - clientData.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(clientIP, { count: 1, lastReset: now })
    return false
  }
  
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }
  
  clientData.count++
  return false
}

function cleanupRateLimit() {
  const now = Date.now()
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.lastReset > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip)
    }
  }
}

function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10 && cleanPhone.length <= 15
}

function validateName(name: string): boolean {
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s]{2,50}$/
  return nameRegex.test(name.trim())
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

async function getTelegramSettings() {
  const settings = await db.select().from(telegram_settings).limit(1)
  return settings[0] || null
}

export const POST = async (req: NextRequest) => {
  try {
    cleanupRateLimit()
    
    const clientIP = getClientIP(req)
    
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { message: "Слишком много запросов. Попробуйте позже через 15 минут." },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const { name: rawName, phone: rawPhone } = body

    if (!rawName || !rawPhone) {
      return NextResponse.json(
        { message: "Имя и номер телефона обязательны" },
        { status: 400 }
      )
    }

    const name = sanitizeInput(rawName)
    const phone = sanitizeInput(rawPhone)

    if (!validateName(name)) {
      return NextResponse.json(
        { message: "Имя должно содержать только буквы и быть длиной от 2 до 50 символов" },
        { status: 400 }
      )
    }

    if (!validatePhoneNumber(phone)) {
      return NextResponse.json(
        { message: "Введите корректный номер телефона" },
        { status: 400 }
      )
    }

    await db.insert(contact_requests).values({
      name,
      phone,
      status: 'new'
    })

    const settings = await getTelegramSettings()
    
    if (!settings?.bot_token || !settings?.subscriber_chat_id || !settings?.is_active) {
      console.log("Telegram notifications not configured or inactive")
      return NextResponse.json({ 
        message: "Заявка принята! Мы свяжемся с вами в ближайшее время." 
      })
    }

    const message = `🔔 Новая заявка с сайта!\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n\n⏰ Время: ${new Date().toLocaleString('ru-RU')}`

    try {
      const telegramResponse = await fetch(`https://api.telegram.org/bot${settings.bot_token}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: settings.subscriber_chat_id,
          text: message,
          parse_mode: "HTML",
        }),
        signal: AbortSignal.timeout(10000)
      })

      if (!telegramResponse.ok) {
        const errorData = await telegramResponse.json().catch(() => ({}))
        console.error("Telegram API error:", { 
          status: telegramResponse.status, 
          error: errorData.description || 'Unknown error' 
        })
      }
    } catch (telegramError) {
      console.error("Telegram request failed:", telegramError instanceof Error ? telegramError.message : 'Unknown error')
    }

    return NextResponse.json({ 
      message: "Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время." 
    })

  } catch (error) {
    console.error("API error:", error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
