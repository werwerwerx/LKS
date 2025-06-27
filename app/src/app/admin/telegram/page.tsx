"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Settings, User } from "lucide-react"

const BotTokenSchema = z.object({
  bot_token: z
    .string()
    .min(1, "Токен не может быть пустым")
    .regex(/^\d{8,10}:[a-zA-Z0-9_-]{35}$/, "Неверный формат токена Telegram бота")
})

const TelegramStatusSchema = z.object({
  subscribedChatId: z.string().nullable(),
  isPolling: z.boolean(),
  isActive: z.boolean(),
  hasToken: z.boolean(),
  instanceId: z.string().optional()
})

const TelegramSettingsSchema = z.object({
  id: z.number(),
  bot_token: z.string().nullable(),
  subscriber_chat_id: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.date(),
  updated_at: z.date()
})

type TelegramStatus = z.infer<typeof TelegramStatusSchema>
type TelegramSettings = z.infer<typeof TelegramSettingsSchema>

interface Message {
  type: 'success' | 'error'
  text: string
}

export default function TelegramAdminPage() {
  const [status, setStatus] = useState<TelegramStatus | null>(null)
  const [settings, setSettings] = useState<TelegramSettings | null>(null)
  const [tokenInput, setTokenInput] = useState("")
  const [showTokenForm, setShowTokenForm] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState({
    saveToken: false,
    resetSubscriber: false,
    fetchData: false
  })
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const setLoadingState = (key: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }))
  }

  const isAnyLoading = Object.values(loading).some(Boolean)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
  }

  const validateToken = (token: string): boolean => {
    try {
      BotTokenSchema.parse({ bot_token: token })
      setValidationErrors([])
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(error.errors.map(e => e.message))
      }
      return false
    }
  }

  const fetchStatus = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch("/api/telegram/polling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status" }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const validatedData = TelegramStatusSchema.safeParse(data)
      
      if (validatedData.success) {
        setStatus(validatedData.data)
      } else {
        console.error("Invalid status data:", validatedData.error)
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Error fetching status:", error)
      }
    }
  }

  const fetchSettings = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch("/api/admin/telegram-settings", {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.settings) {
        setSettings(data.settings)
        if (data.settings.bot_token) {
          setTokenInput(data.settings.bot_token)
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("Error fetching settings:", error)
        showMessage('error', 'Ошибка получения настроек')
      }
    }
  }

  const fetchData = async () => {
    setLoadingState('fetchData', true)
    await Promise.all([fetchSettings(), fetchStatus()])
    setLoadingState('fetchData', false)
  }

  const saveToken = async () => {
    const trimmedToken = tokenInput.trim()
    
    if (!validateToken(trimmedToken)) {
      return
    }

    setLoadingState('saveToken', true)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch("/api/admin/telegram-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bot_token: trimmedToken }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Неизвестная ошибка' }))
        showMessage('error', errorData.error || 'Ошибка сохранения токена')
        return
      }
      
      showMessage('success', 'Токен успешно сохранен!')
      setShowTokenForm(false)
      await fetchData()
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        showMessage('error', 'Время ожидания истекло')
      } else {
        showMessage('error', 'Ошибка соединения')
      }
    } finally {
      setLoadingState('saveToken', false)
    }
  }

  const resetSubscriber = async () => {
    setLoadingState('resetSubscriber', true)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch("/api/telegram/polling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Неизвестная ошибка' }))
        showMessage('error', errorData.error || 'Ошибка сброса')
        return
      }
      
      showMessage('success', 'Получатель сброшен. Теперь кто-то другой может настроить уведомления.')
      await fetchData()
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        showMessage('error', 'Время ожидания истекло')
      } else {
        showMessage('error', 'Ошибка сброса настроек')
      }
    } finally {
      setLoadingState('resetSubscriber', false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Настройки Telegram</h1>
        <p className="text-muted-foreground">Управление токеном бота и получателем уведомлений</p>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Токен бота
            </CardTitle>
            <CardDescription>
              Настройка токена Telegram бота для уведомлений
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showTokenForm ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Статус токена:</span>
                  <span className={`text-sm ${settings?.bot_token ? 'text-green-600' : 'text-red-600'}`}>
                    {settings?.bot_token ? '✅ Настроен' : '❌ Не настроен'}
                  </span>
                </div>
                
                <Button 
                  onClick={() => setShowTokenForm(true)}
                  variant="outline"
                  className="w-full"
                  disabled={isAnyLoading}
                >
                  {settings?.bot_token ? 'Изменить токен' : 'Добавить токен'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="token">Токен Telegram бота</Label>
                  <Input
                    id="token"
                    type="password"
                    value={tokenInput}
                    onChange={(e) => {
                      setTokenInput(e.target.value)
                      if (validationErrors.length > 0) {
                        validateToken(e.target.value.trim())
                      }
                    }}
                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                    className={`mt-1 ${validationErrors.length > 0 ? 'border-red-500' : ''}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Получите токен у @BotFather в Telegram
                  </p>
                  {validationErrors.length > 0 && (
                    <div className="mt-2">
                      {validationErrors.map((error, index) => (
                        <p key={index} className="text-red-500 text-sm">{error}</p>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={saveToken} 
                    disabled={loading.saveToken || validationErrors.length > 0} 
                    className={`flex-1 ${loading.saveToken ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Сохранить
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowTokenForm(false)
                      setValidationErrors([])
                    }} 
                    variant="outline"
                    disabled={loading.saveToken}
                    className={loading.saveToken ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Получатель уведомлений
            </CardTitle>
            <CardDescription>
              Информация о текущем получателе уведомлений
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading.fetchData ? (
              <p className="text-muted-foreground">Загрузка...</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Статус:</span>
                  <span className={`text-sm ${status?.subscribedChatId ? 'text-green-600' : 'text-gray-600'}`}>
                    {status?.subscribedChatId ? "✅ Настроен" : "⏳ Не настроен"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Уведомления:</span>
                  <span className={`text-sm ${status?.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                    {status?.isActive ? "🔔 Активны" : "🔕 Неактивны"}
                  </span>
                </div>

                <Button 
                  onClick={resetSubscriber} 
                  disabled={loading.resetSubscriber || !status?.subscribedChatId}
                  variant="outline"
                  className={`w-full ${
                    (loading.resetSubscriber || !status?.subscribedChatId)
                      ? 'opacity-50 cursor-not-allowed border-muted text-muted-foreground'
                      : ''
                  }`}
                >
                  🔄 Сбросить получателя
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Инструкция по настройке</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><strong>Создайте бота:</strong> Напишите @BotFather в Telegram и выполните команду /newbot</li>
            <li><strong>Получите токен:</strong> Скопируйте токен бота и вставьте его в поле выше</li>
            <li><strong>Настройте получателя:</strong> Напишите боту /start в Telegram и нажмите кнопку подписки</li>
            <li><strong>Убедитесь что сделали всё правильно:</strong> Обновите страницу 🔃</li>
            <li><strong>Готово!</strong> Теперь все заявки с сайта будут приходить в Telegram</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
} 