import { db } from "@/lib/db"
import { site_settings } from "@/lib/db/schema"
import { cache } from "react"

const DEFAULT_SETTINGS = {
  company_name: "Л.К.С",
  company_tagline: "Элитное модельное агентство",
  city_name: "Москва",
  city_locative: "Москве",
  phone: "+7 996 679 44 78",
  telegram: "@lks_models",
  email: "",
  address: "Офис в Москве: Пресненская наб., 8 стр 1, Москва, Россия",
  inn: "ООО Л.К.С. ИНН 205414867О КПП 658202759 ОГРН 725666120З132",
  hero_title: "{company_name} - зона вашего комфорта.",
  hero_subtitle: "Исполним любое желание.",
  hero_button_text: "ВЫБРАТЬ МОДЕЛЬ",
  hero_description: "Наше эскорт агентство предлагает премиальные услуги в {city_locative}. С нами заказать профессиональную модель стало гораздо проще. Мы гарантируем полную конфиденциальность каждому клиенту, обеспечивая индивидуальный подбор модели под ваши требования. Наши девушки умеют создавать идеальную атмосферу для любого мероприятия: от деловых встреч до романтических встреч.",
  perfect_choice_title: "ИДЕАЛЬНЫЙ ВЫБОР",
  perfect_choice_description: "Мы оказываем услуги профессиональных моделей в Москве, демонстрируя уровень, который нельзя сравнить с обычными услугами сопровождения. Каждая наша модель обладает красотой, интеллектом и шармом, чтобы сделать ваш отдых незабываемым. Если вы хотите провести время с очаровательной девушкой, которая понимает все нюансы светского общения и способна поддержать разговор на любую тему, наше модельное агентство поможет вам найти идеальный вариант.",
  contact_form_title: "ОСТАЛИСЬ ВОПРОСЫ?",
  contact_form_subtitle: "Наши менеджеры с {contact_form_subtitle_highlight} ответят на них",
  contact_form_subtitle_highlight: "удовольствием",
  form_name_placeholder: "Ваше имя",
  form_phone_placeholder: "+7 (999) 123-45-67",
  form_privacy_text: "Соглашаюсь с политикой обработки данных",
  form_submit_button: "ОТПРАВИТЬ",
  nav_home: "Главная",
  nav_catalog: "Каталог",
  nav_services: "Услуги",
  nav_contacts: "Контакты",
  nav_blog: "Блог",
  nav_cooperation: "Сотрудничество",
  footer_privacy_policy: "Политика конфиденциальности",
  footer_user_agreement: "Пользовательское соглашение",
  header_connect_button: "Связаться",
  logo_short: "TM",
  logo_full_line1: "Touch",
  logo_full_line2: "Models"
}

export interface SiteSettings {
  id: number
  company_name: string
  company_tagline: string
  city_name: string
  city_locative: string
  phone: string
  telegram: string
  email?: string
  address: string
  inn: string
  hero_title: string
  hero_subtitle: string
  hero_button_text: string
  hero_description: string
  perfect_choice_title: string
  perfect_choice_description: string
  contact_form_title: string
  contact_form_subtitle: string
  contact_form_subtitle_highlight: string
  form_name_placeholder: string
  form_phone_placeholder: string
  form_privacy_text: string
  form_submit_button: string
  nav_home: string
  nav_catalog: string
  nav_services: string
  nav_contacts: string
  nav_blog: string
  nav_cooperation: string
  footer_privacy_policy: string
  footer_user_agreement: string
  header_connect_button: string
  logo_short: string
  logo_full_line1: string
  logo_full_line2: string
  created_at: string
  updated_at: string
}

function replaceTemplateVariables(text: string, settings: any): string {
  return text
    .replace(/{company_name}/g, settings.company_name)
    .replace(/{city_name}/g, settings.city_name)
    .replace(/{city_locative}/g, settings.city_locative)
    .replace(/{contact_form_subtitle_highlight}/g, settings.contact_form_subtitle_highlight)
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const settings = await db.select().from(site_settings).limit(1)
    
    if (settings.length === 0) {
      await db.insert(site_settings).values(DEFAULT_SETTINGS)
      const newSettings = await db.select().from(site_settings).limit(1)
      return newSettings[0] as SiteSettings
    }
    
    const rawSettings = settings[0] as SiteSettings
    
    const processedSettings = {
      ...rawSettings,
      hero_title: replaceTemplateVariables(rawSettings.hero_title, rawSettings),
      hero_description: replaceTemplateVariables(rawSettings.hero_description, rawSettings),
      contact_form_subtitle: replaceTemplateVariables(rawSettings.contact_form_subtitle, rawSettings),
    }
    
    return processedSettings
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return {
      id: 0,
      ...DEFAULT_SETTINGS,
      hero_title: replaceTemplateVariables(DEFAULT_SETTINGS.hero_title, DEFAULT_SETTINGS),
      hero_description: replaceTemplateVariables(DEFAULT_SETTINGS.hero_description, DEFAULT_SETTINGS),
      contact_form_subtitle: replaceTemplateVariables(DEFAULT_SETTINGS.contact_form_subtitle, DEFAULT_SETTINGS),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as SiteSettings
  }
}) 