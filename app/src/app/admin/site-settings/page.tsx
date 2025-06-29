"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import type { SiteSettings } from "@/lib/get-site-settings"
import { apiGet, apiPut, apiPost } from "@/lib/api-client"
import { SiteSettingsSchema } from "@/lib/validations"

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await apiGet("/api/admin/site-settings", { requireAuth: true })
      const data = await response.json()
      setSettings(data.settings)
      setErrors({})
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Ошибка загрузки настроек")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    setErrors({})
    
    try {
      // Валидация на клиенте
      const validatedSettings = SiteSettingsSchema.parse(settings)
      
      const response = await apiPut("/api/admin/site-settings", validatedSettings, { requireAuth: true })
      const data = await response.json()
      setSettings(data.settings)
      toast.success("Настройки успешно сохранены")
    } catch (error) {
      console.error("Error saving settings:", error)
      
      // Обработка ошибок валидации
      if (error?.issues) {
        const validationErrors: Record<string, string> = {}
        error.issues.forEach((issue: any) => {
          if (issue.path?.[0]) {
            validationErrors[issue.path[0]] = issue.message
          }
        })
        setErrors(validationErrors)
        toast.error("Проверьте правильность заполнения полей")
      } else {
        toast.error("Ошибка сохранения настроек")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    setResetting(true)
    try {
      const response = await apiPost("/api/admin/site-settings", undefined, { requireAuth: true })
      const data = await response.json()
      setSettings(data.settings)
      setErrors({})
      toast.success("Настройки сброшены к значениям по умолчанию")
    } catch (error) {
      console.error("Error resetting settings:", error)
      toast.error("Ошибка сброса настроек")
    } finally {
      setResetting(false)
    }
  }

  const updateSetting = (key: keyof SiteSettings, value: string) => {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
    // Очищаем ошибку поля при изменении
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" })
    }
  }

  const isAnyLoading = loading || saving || resetting

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Настройки сайта</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" disabled className="w-full sm:w-auto">
              <RotateCcw className="h-4 w-4 mr-2" />
              Сбросить
            </Button>
            <Button disabled className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              Сохранить
            </Button>
          </div>
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

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive mb-4">Ошибка загрузки настроек</p>
          <Button onClick={fetchSettings}>
            Попробовать снова
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Настройки сайта</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isAnyLoading}
            className="w-full sm:w-auto"
          >
            {resetting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4 mr-2" />
            )}
            {resetting ? "Сброс..." : "Сбросить"}
          </Button>
          <Button onClick={handleSave} disabled={isAnyLoading} className="w-full sm:w-auto">
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className={isAnyLoading ? "opacity-60 pointer-events-none" : ""}>
          <CardHeader>
            <CardTitle>Контактная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => updateSetting("phone", e.target.value)}
                  placeholder="+7 996 679 44 78"
                  disabled={isAnyLoading}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  value={settings.telegram}
                  onChange={(e) => updateSetting("telegram", e.target.value)}
                  placeholder="@lks_models"
                  disabled={isAnyLoading}
                  className={errors.telegram ? "border-destructive" : ""}
                />
                {errors.telegram && (
                  <p className="text-sm text-destructive mt-1">{errors.telegram}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="city">Город</Label>
              <Input
                id="city"
                value={settings.city}
                onChange={(e) => updateSetting("city", e.target.value)}
                placeholder="Москва"
                disabled={isAnyLoading}
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && (
                <p className="text-sm text-destructive mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email (необязательно)</Label>
              <Input
                id="email"
                type="email"
                value={settings.email || ""}
                onChange={(e) => updateSetting("email", e.target.value)}
                placeholder="info@lks-models.ru"
                disabled={isAnyLoading}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={isAnyLoading ? "opacity-60 pointer-events-none" : ""}>
          <CardHeader>
            <CardTitle>Адрес и реквизиты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Адрес</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => updateSetting("address", e.target.value)}
                placeholder="Офис в Москве: Пресненская наб., 8 стр 1, Москва, Россия"
                rows={2}
                disabled={isAnyLoading}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-sm text-destructive mt-1">{errors.address}</p>
              )}
            </div>
            <div>
              <Label htmlFor="inn">ИНН и реквизиты</Label>
              <Textarea
                id="inn"
                value={settings.inn}
                onChange={(e) => updateSetting("inn", e.target.value)}
                placeholder="ООО К.Л.С. ИНН 205414867О КПП 658202759 ОГРН 725666120З132"
                rows={2}
                disabled={isAnyLoading}
                className={errors.inn ? "border-destructive" : ""}
              />
              {errors.inn && (
                <p className="text-sm text-destructive mt-1">{errors.inn}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={isAnyLoading ? "opacity-60 pointer-events-none" : ""}>
          <CardHeader>
            <CardTitle>Заголовки страниц (Title)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="home_title">Заголовок главной страницы</Label>
              <Input
                id="home_title"
                value={settings.home_title}
                onChange={(e) => updateSetting("home_title", e.target.value)}
                placeholder="К.Л.С. - Модельное агентство премиум класса в Москве"
                disabled={isAnyLoading}
                className={errors.home_title ? "border-destructive" : ""}
              />
              {errors.home_title && (
                <p className="text-sm text-destructive mt-1">{errors.home_title}</p>
              )}
            </div>
            <div>
              <Label htmlFor="models_title">Заголовок каталога моделей</Label>
              <Input
                id="models_title"
                value={settings.models_title}
                onChange={(e) => updateSetting("models_title", e.target.value)}
                placeholder="Каталог моделей К.Л.С. - Профессиональные модели Москвы"
                disabled={isAnyLoading}
                className={errors.models_title ? "border-destructive" : ""}
              />
              {errors.models_title && (
                <p className="text-sm text-destructive mt-1">{errors.models_title}</p>
              )}
            </div>
            <div>
              <Label htmlFor="model_title_template">Шаблон заголовка страницы модели</Label>
              <Input
                id="model_title_template"
                value={settings.model_title_template}
                onChange={(e) => updateSetting("model_title_template", e.target.value)}
                placeholder="{name}, Возраст: {age} - Профессиональная модель К.Л.С."
                disabled={isAnyLoading}
                className={errors.model_title_template ? "border-destructive" : ""}
              />
              {errors.model_title_template && (
                <p className="text-sm text-destructive mt-1">{errors.model_title_template}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Используйте {"{name}"} и {"{age}"} для подстановки имени и возраста модели
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={isAnyLoading ? "opacity-60 pointer-events-none" : ""}>
          <CardHeader>
            <CardTitle>Описание на главной</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="hero_description">Основной текст с описанием услуг</Label>
              <Textarea
                id="hero_description"
                value={settings.hero_description}
                onChange={(e) => updateSetting("hero_description", e.target.value)}
                placeholder="Наше модельное агентство предлагает премиальные услуги профессиональных моделей..."
                rows={4}
                disabled={isAnyLoading}
                className={errors.hero_description ? "border-destructive" : ""}
              />
              {errors.hero_description && (
                <p className="text-sm text-destructive mt-1">{errors.hero_description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {settings.hero_description.length} символов
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-6">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isAnyLoading}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          {resetting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4 mr-2" />
          )}
          {resetting ? "Сброс..." : "Сбросить к умолчанию"}
        </Button>
        <Button onClick={handleSave} disabled={isAnyLoading} className="w-full sm:w-auto order-1 sm:order-2">
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? "Сохранение..." : "Сохранить настройки"}
        </Button>
      </div>
    </div>
  )
} 