"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { toast } from "sonner"
import type { SiteSettings } from "@/lib/get-site-settings"
import { apiGet, apiPut, apiPost } from "@/lib/api-client"

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await apiGet("/api/admin/site-settings")
      const data = await response.json()
      setSettings(data.settings)
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
    try {
      const response = await apiPut("/api/admin/site-settings", settings)
      const data = await response.json()
      setSettings(data.settings)
      toast.success("Настройки успешно сохранены")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Ошибка сохранения настроек")
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    setResetting(true)
    try {
      const response = await apiPost("/api/admin/site-settings")
      const data = await response.json()
      setSettings(data.settings)
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
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Загрузка настроек...</div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Ошибка загрузки настроек</div>
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
            disabled={resetting}
            className="w-full sm:w-auto"
          >
            {resetting ? "Сброс..." : "Сбросить"}
          </Button>
          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
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
                />
              </div>
              <div>
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  value={settings.telegram}
                  onChange={(e) => updateSetting("telegram", e.target.value)}
                  placeholder="@lks_models"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email (необязательно)</Label>
              <Input
                id="email"
                type="email"
                value={settings.email || ""}
                onChange={(e) => updateSetting("email", e.target.value)}
                placeholder="info@lks-models.ru"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
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
              />
            </div>
            <div>
              <Label htmlFor="inn">ИНН и реквизиты</Label>
              <Textarea
                id="inn"
                value={settings.inn}
                onChange={(e) => updateSetting("inn", e.target.value)}
                placeholder="ООО N.N. ИНН 205414867О КПП 658202759 ОГРН 725666120З132"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
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
                placeholder="L.K.S. - Модельное агентство премиум класса в Москве"
              />
            </div>
            <div>
              <Label htmlFor="models_title">Заголовок каталога моделей</Label>
              <Input
                id="models_title"
                value={settings.models_title}
                onChange={(e) => updateSetting("models_title", e.target.value)}
                placeholder="Каталог моделей L.K.S. - Профессиональные модели Москвы"
              />
            </div>
            <div>
              <Label htmlFor="model_title_template">Шаблон заголовка страницы модели</Label>
              <Input
                id="model_title_template"
                value={settings.model_title_template}
                onChange={(e) => updateSetting("model_title_template", e.target.value)}
                placeholder="{name}, {age} лет - Профессиональная модель L.K.S."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Используйте {"{name}"} и {"{age}"} для подстановки имени и возраста модели
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
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
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-6">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={resetting}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          {resetting ? "Сброс..." : "Сбросить к умолчанию"}
        </Button>
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto order-1 sm:order-2">
          {saving ? "Сохранение..." : "Сохранить настройки"}
        </Button>
      </div>
    </div>
  )
} 