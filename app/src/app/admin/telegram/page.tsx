"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Settings, User, Loader2, Save, RotateCcw, RefreshCw } from "lucide-react"
import { apiGet, apiPost } from "@/lib/api-client"

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
    fetchData: true,
    refreshStatus: false
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
      
      const response = await apiPost("/api/telegram/polling", { action: "status" }, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
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
      
      const response = await apiGet("/api/admin/telegram-settings", {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
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

  const refreshStatus = async () => {
    setLoadingState('refreshStatus', true)
    await fetchStatus()
    setLoadingState('refreshStatus', false)
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
      
      const response = await apiPost("/api/admin/telegram-settings", { bot_token: trimmedToken }, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      showMessage('success', 'Токен успешно сохранен! Система уведомлений перезапускается...')
      setShowTokenForm(false)
      
      setTimeout(async () => {
        await fetchData()
        showMessage('success', 'Система готова к работе с новым токеном. Настройте получателя уведомлений.')
      }, 2000)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        showMessage('error', 'Время ожидания истекло')
      } else {
        showMessage('error', error instanceof Error ? error.message : 'Ошибка соединения')
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
      
      const response = await apiPost("/api/telegram/polling", { action: "reset" }, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      showMessage('success', 'Получатель сброшен. Теперь кто-то другой может настроить уведомления.')
      await fetchData()
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        showMessage('error', 'Время ожидания истекло')
      } else {
        showMessage('error', error instanceof Error ? error.message : 'Ошибка сброса настроек')
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

  if (loading.fetchData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Настройки Telegram</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Управление токеном бота и получателем уведомлений</p>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Загрузка настроек...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Настройки Telegram</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Управление токеном бота и получателем уведомлений</p>
          </div>
          <Button
            variant="outline"
            onClick={refreshStatus}
            disabled={loading.refreshStatus}
            className="w-full sm:w-auto"
          >
            {loading.refreshStatus ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Обновить статус
          </Button>
        </div>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card className={isAnyLoading ? "opacity-60" : ""}>
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
                    disabled={loading.saveToken}
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
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={saveToken} 
                    disabled={loading.saveToken || validationErrors.length > 0} 
                    className="flex-1"
                  >
                    {loading.saveToken ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Сохранить
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowTokenForm(false)
                      setValidationErrors([])
                    }} 
                    variant="outline"
                    disabled={loading.saveToken}
                    className="flex-1 sm:flex-initial"
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={isAnyLoading ? "opacity-60" : ""}>
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

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Система:</span>
                <span className={`text-sm ${status?.isPolling ? 'text-green-600' : 'text-orange-600'}`}>
                  {status?.isPolling ? "🟢 Работает" : "🟡 Ожидание"}
                </span>
              </div>

              <Button 
                onClick={resetSubscriber} 
                disabled={loading.resetSubscriber || !status?.subscribedChatId}
                variant="outline"
                className="w-full"
              >
                {loading.resetSubscriber ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4 mr-2" />
                )}
                🔄 Сбросить получателя
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Инструкция по настройке</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm">
            <li><strong>Создайте бота:</strong> Напишите @BotFather в Telegram и выполните команду /newbot</li>
            <li><strong>Получите токен:</strong> Скопируйте токен бота и вставьте его в поле выше</li>
            <li><strong>Автоматический перезапуск:</strong> При смене токена система автоматически перезапустится</li>
            <li><strong>Настройте получателя:</strong> Напишите боту /start в Telegram и нажмите кнопку подписки</li>
            <li><strong>Проверьте статус:</strong> Используйте кнопку "Обновить статус" для проверки</li>
            <li><strong>Готово!</strong> Теперь все заявки с сайта будут приходить в Telegram</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1 text-sm">💡 Важно знать:</h4>
            <ul className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• При смене токена старые настройки сбрасываются</li>
              <li>• Нужно заново настроить получателя уведомлений</li>
              <li>• Система автоматически начнет работать с новым ботом</li>
              <li>• Используйте кнопку обновления статуса для проверки соединения</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 