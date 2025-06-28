"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Settings, RefreshCw } from "lucide-react"
import { useAdminSiteSettings, useUpdateSiteSettings, useResetSiteSettings } from "@/hooks/use-site-settings"

interface Message {
  type: 'success' | 'error'
  text: string
}

export default function SiteSettingsPage() {
  const { data: settings, isLoading, error } = useAdminSiteSettings()
  const updateMutation = useUpdateSiteSettings()
  const resetMutation = useResetSiteSettings()
  
  const [formData, setFormData] = useState({
    company_name: "",
    company_tagline: "",
    city_name: "",
    city_locative: "",
    phone: "",
    telegram: "",
    email: "",
    address: "",
    inn: "",
    hero_title: "",
    hero_subtitle: "",
    hero_button_text: "",
    hero_description: "",
    perfect_choice_title: "",
    perfect_choice_description: "",
    contact_form_title: "",
    contact_form_subtitle: "",
    contact_form_subtitle_highlight: "",
    form_name_placeholder: "",
    form_phone_placeholder: "",
    form_privacy_text: "",
    form_submit_button: "",
    nav_home: "",
    nav_catalog: "",
    nav_services: "",
    nav_contacts: "",
    nav_blog: "",
    nav_cooperation: "",
    footer_privacy_policy: "",
    footer_user_agreement: "",
    header_connect_button: "",
    logo_short: "",
    logo_full_line1: "",
    logo_full_line2: ""
  })
  
  const [message, setMessage] = useState<Message | null>(null)

  useEffect(() => {
    if (settings) {
      setFormData({
        company_name: settings.company_name || "",
        company_tagline: settings.company_tagline || "",
        city_name: settings.city_name || "",
        city_locative: settings.city_locative || "",
        phone: settings.phone || "",
        telegram: settings.telegram || "",
        email: settings.email || "",
        address: settings.address || "",
        inn: settings.inn || "",
        hero_title: settings.hero_title || "",
        hero_subtitle: settings.hero_subtitle || "",
        hero_button_text: settings.hero_button_text || "",
        hero_description: settings.hero_description || "",
        perfect_choice_title: settings.perfect_choice_title || "",
        perfect_choice_description: settings.perfect_choice_description || "",
        contact_form_title: settings.contact_form_title || "",
        contact_form_subtitle: settings.contact_form_subtitle || "",
        contact_form_subtitle_highlight: settings.contact_form_subtitle_highlight || "",
        form_name_placeholder: settings.form_name_placeholder || "",
        form_phone_placeholder: settings.form_phone_placeholder || "",
        form_privacy_text: settings.form_privacy_text || "",
        form_submit_button: settings.form_submit_button || "",
        nav_home: settings.nav_home || "",
        nav_catalog: settings.nav_catalog || "",
        nav_services: settings.nav_services || "",
        nav_contacts: settings.nav_contacts || "",
        nav_blog: settings.nav_blog || "",
        nav_cooperation: settings.nav_cooperation || "",
        footer_privacy_policy: settings.footer_privacy_policy || "",
        footer_user_agreement: settings.footer_user_agreement || "",
        header_connect_button: settings.header_connect_button || "",
        logo_short: settings.logo_short || "",
        logo_full_line1: settings.logo_full_line1 || "",
        logo_full_line2: settings.logo_full_line2 || ""
      })
    }
  }, [settings])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await updateMutation.mutateAsync(formData)
      showMessage('success', 'Настройки успешно обновлены')
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Ошибка обновления настроек')
    }
  }

  const handleReset = async () => {
    if (!confirm('Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?')) {
      return
    }
    
    try {
      await resetMutation.mutateAsync()
      showMessage('success', 'Настройки сброшены к значениям по умолчанию')
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'Ошибка сброса настроек')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const isAnyLoading = isLoading || updateMutation.isPending || resetMutation.isPending

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert className="border-red-500">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Ошибка загрузки настроек: {error.message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Настройки сайта</h1>
        <p className="text-muted-foreground">Управление текстами и данными на сайте</p>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Основная информация
              </CardTitle>
              <CardDescription>
                Базовые данные о компании
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company_name">Название компании</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                  placeholder="Л.К.С"
                  disabled={isAnyLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="company_tagline">Слоган компании</Label>
                <Input
                  id="company_tagline"
                  value={formData.company_tagline}
                  onChange={(e) => handleInputChange("company_tagline", e.target.value)}
                  placeholder="Элитное модельное агентство"
                  disabled={isAnyLoading}
                />
              </div>

              <div>
                <Label htmlFor="city_name">Город (именительный падеж)</Label>
                <Input
                  id="city_name"
                  value={formData.city_name}
                  onChange={(e) => handleInputChange("city_name", e.target.value)}
                  placeholder="Москва"
                  disabled={isAnyLoading}
                />
              </div>

              <div>
                <Label htmlFor="city_locative">Город (предложный падеж)</Label>
                <Input
                  id="city_locative"
                  value={formData.city_locative}
                  onChange={(e) => handleInputChange("city_locative", e.target.value)}
                  placeholder="Москве"
                  disabled={isAnyLoading}
                />
              </div>

              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+7 996 679 44 78"
                  disabled={isAnyLoading}
                />
              </div>

              <div>
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  value={formData.telegram}
                  onChange={(e) => handleInputChange("telegram", e.target.value)}
                  placeholder="@lks_models"
                  disabled={isAnyLoading}
                />
              </div>

              <div>
                <Label htmlFor="email">Email (необязательно)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="info@example.com"
                  disabled={isAnyLoading}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Логотип и навигация</CardTitle>
              <CardDescription>
                Настройки логотипа и меню
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logo_short">Короткий логотип</Label>
                <Input
                  id="logo_short"
                  value={formData.logo_short}
                  onChange={(e) => handleInputChange("logo_short", e.target.value)}
                  placeholder="TM"
                  disabled={isAnyLoading}
                />
              </div>

              <div>
                <Label htmlFor="logo_full_line1">Логотип строка 1</Label>
                <Input
                  id="logo_full_line1"
                  value={formData.logo_full_line1}
                  onChange={(e) => handleInputChange("logo_full_line1", e.target.value)}
                  placeholder="Touch"
                  disabled={isAnyLoading}
                />
              </div>

              <div>
                <Label htmlFor="logo_full_line2">Логотип строка 2</Label>
                <Input
                  id="logo_full_line2"
                  value={formData.logo_full_line2}
                  onChange={(e) => handleInputChange("logo_full_line2", e.target.value)}
                  placeholder="Models"
                  disabled={isAnyLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nav_home">Меню: Главная</Label>
                  <Input
                    id="nav_home"
                    value={formData.nav_home}
                    onChange={(e) => handleInputChange("nav_home", e.target.value)}
                    placeholder="Главная"
                    disabled={isAnyLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="nav_catalog">Меню: Каталог</Label>
                  <Input
                    id="nav_catalog"
                    value={formData.nav_catalog}
                    onChange={(e) => handleInputChange("nav_catalog", e.target.value)}
                    placeholder="Каталог"
                    disabled={isAnyLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="nav_services">Меню: Услуги</Label>
                  <Input
                    id="nav_services"
                    value={formData.nav_services}
                    onChange={(e) => handleInputChange("nav_services", e.target.value)}
                    placeholder="Услуги"
                    disabled={isAnyLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="nav_contacts">Меню: Контакты</Label>
                  <Input
                    id="nav_contacts"
                    value={formData.nav_contacts}
                    onChange={(e) => handleInputChange("nav_contacts", e.target.value)}
                    placeholder="Контакты"
                    disabled={isAnyLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="nav_blog">Меню: Блог</Label>
                  <Input
                    id="nav_blog"
                    value={formData.nav_blog}
                    onChange={(e) => handleInputChange("nav_blog", e.target.value)}
                    placeholder="Блог"
                    disabled={isAnyLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="nav_cooperation">Меню: Сотрудничество</Label>
                  <Input
                    id="nav_cooperation"
                    value={formData.nav_cooperation}
                    onChange={(e) => handleInputChange("nav_cooperation", e.target.value)}
                    placeholder="Сотрудничество"
                    disabled={isAnyLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="header_connect_button">Кнопка связи</Label>
                <Input
                  id="header_connect_button"
                  value={formData.header_connect_button}
                  onChange={(e) => handleInputChange("header_connect_button", e.target.value)}
                  placeholder="Связаться"
                  disabled={isAnyLoading}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Главный экран (Hero Section)</CardTitle>
            <CardDescription>
              Настройки основного блока на главной странице. Можно использовать переменные: {"{company_name}"}, {"{city_locative}"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero_title">Заголовок</Label>
              <Input
                id="hero_title"
                value={formData.hero_title}
                onChange={(e) => handleInputChange("hero_title", e.target.value)}
                placeholder="{company_name} - зона вашего комфорта."
                disabled={isAnyLoading}
              />
            </div>

            <div>
              <Label htmlFor="hero_subtitle">Подзаголовок</Label>
              <Input
                id="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={(e) => handleInputChange("hero_subtitle", e.target.value)}
                placeholder="Исполним любое желание."
                disabled={isAnyLoading}
              />
            </div>

            <div>
              <Label htmlFor="hero_button_text">Текст кнопки</Label>
              <Input
                id="hero_button_text"
                value={formData.hero_button_text}
                onChange={(e) => handleInputChange("hero_button_text", e.target.value)}
                placeholder="ВЫБРАТЬ МОДЕЛЬ"
                disabled={isAnyLoading}
              />
            </div>

            <div>
              <Label htmlFor="hero_description">Описание</Label>
              <Textarea
                id="hero_description"
                value={formData.hero_description}
                onChange={(e) => handleInputChange("hero_description", e.target.value)}
                placeholder="Наше эскорт агентство предлагает премиальные услуги в {city_locative}..."
                rows={4}
                disabled={isAnyLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Блок "Идеальный выбор"</CardTitle>
            <CardDescription>
              Настройки блока с описанием услуг
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="perfect_choice_title">Заголовок</Label>
              <Input
                id="perfect_choice_title"
                value={formData.perfect_choice_title}
                onChange={(e) => handleInputChange("perfect_choice_title", e.target.value)}
                placeholder="ИДЕАЛЬНЫЙ ВЫБОР"
                disabled={isAnyLoading}
              />
            </div>

            <div>
              <Label htmlFor="perfect_choice_description">Описание</Label>
              <Textarea
                id="perfect_choice_description"
                value={formData.perfect_choice_description}
                onChange={(e) => handleInputChange("perfect_choice_description", e.target.value)}
                placeholder="Мы оказываем услуги профессиональных моделей..."
                rows={5}
                disabled={isAnyLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Форма обратной связи</CardTitle>
            <CardDescription>
              Настройки формы и её текстов. Можно использовать переменную {"{contact_form_subtitle_highlight}"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contact_form_title">Заголовок формы</Label>
              <Input
                id="contact_form_title"
                value={formData.contact_form_title}
                onChange={(e) => handleInputChange("contact_form_title", e.target.value)}
                placeholder="ОСТАЛИСЬ ВОПРОСЫ?"
                disabled={isAnyLoading}
              />
            </div>

            <div>
              <Label htmlFor="contact_form_subtitle">Подзаголовок формы</Label>
              <Input
                id="contact_form_subtitle"
                value={formData.contact_form_subtitle}
                onChange={(e) => handleInputChange("contact_form_subtitle", e.target.value)}
                placeholder="Наши менеджеры с {contact_form_subtitle_highlight} ответят на них"
                disabled={isAnyLoading}
              />
            </div>

            <div>
              <Label htmlFor="contact_form_subtitle_highlight">Выделенное слово</Label>
              <Input
                id="contact_form_subtitle_highlight"
                value={formData.contact_form_subtitle_highlight}
                onChange={(e) => handleInputChange("contact_form_subtitle_highlight", e.target.value)}
                placeholder="удовольствием"
                disabled={isAnyLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="form_name_placeholder">Плейсхолдер имени</Label>
                <Input
                  id="form_name_placeholder"
                  value={formData.form_name_placeholder}
                  onChange={(e) => handleInputChange("form_name_placeholder", e.target.value)}
                  placeholder="Ваше имя"
                  disabled={isAnyLoading}
                />
              </div>

              <div>
                <Label htmlFor="form_phone_placeholder">Плейсхолдер телефона</Label>
                <Input
                  id="form_phone_placeholder"
                  value={formData.form_phone_placeholder}
                  onChange={(e) => handleInputChange("form_phone_placeholder", e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  disabled={isAnyLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="form_privacy_text">Текст согласия</Label>
              <Input
                id="form_privacy_text"
                value={formData.form_privacy_text}
                onChange={(e) => handleInputChange("form_privacy_text", e.target.value)}
                placeholder="Соглашаюсь с политикой обработки данных"
                disabled={isAnyLoading}
              />
            </div>

            <div>
              <Label htmlFor="form_submit_button">Кнопка отправки</Label>
              <Input
                id="form_submit_button"
                value={formData.form_submit_button}
                onChange={(e) => handleInputChange("form_submit_button", e.target.value)}
                placeholder="ОТПРАВИТЬ"
                disabled={isAnyLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Футер и юридическая информация</CardTitle>
            <CardDescription>
              Настройки нижней части сайта
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Адрес</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Офис в Москве: Пресненская наб., 8 стр 1, Москва, Россия"
                disabled={isAnyLoading}
              />
            </div>

            <div>
              <Label htmlFor="inn">ИНН и реквизиты</Label>
              <Input
                id="inn"
                value={formData.inn}
                onChange={(e) => handleInputChange("inn", e.target.value)}
                placeholder="ООО Л.К.С. ИНН 205414867О КПП 658202759 ОГРН 725666120З132"
                disabled={isAnyLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="footer_user_agreement">Пользовательское соглашение</Label>
                <Input
                  id="footer_user_agreement"
                  value={formData.footer_user_agreement}
                  onChange={(e) => handleInputChange("footer_user_agreement", e.target.value)}
                  placeholder="Пользовательское соглашение"
                  disabled={isAnyLoading}
                />
              </div>

              <div>
                <Label htmlFor="footer_privacy_policy">Политика конфиденциальности</Label>
                <Input
                  id="footer_privacy_policy"
                  value={formData.footer_privacy_policy}
                  onChange={(e) => handleInputChange("footer_privacy_policy", e.target.value)}
                  placeholder="Политика конфиденциальности"
                  disabled={isAnyLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isAnyLoading} className="flex-1">
            {updateMutation.isPending && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
            Сохранить настройки
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
            disabled={isAnyLoading}
          >
            {resetMutation.isPending && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
            Сбросить к умолчанию
          </Button>
        </div>
      </form>
    </div>
  )
} 