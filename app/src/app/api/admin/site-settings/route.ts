import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { site_settings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

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

export async function GET() {
  try {
    const settings = await db.select().from(site_settings).limit(1)
    
    if (settings.length === 0) {
      await db.insert(site_settings).values(DEFAULT_SETTINGS)
      const newSettings = await db.select().from(site_settings).limit(1)
      return NextResponse.json({ settings: newSettings[0] })
    }
    
    return NextResponse.json({ settings: settings[0] })
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json(
      { error: "Ошибка получения настроек" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    
    const existingSettings = await db.select().from(site_settings).limit(1)
    
    if (existingSettings.length === 0) {
      const newSettings = await db.insert(site_settings).values({
        ...DEFAULT_SETTINGS,
        ...body,
        updated_at: new Date()
      }).returning()
      
      return NextResponse.json({
        message: "Настройки успешно созданы",
        settings: newSettings[0]
      })
    }
    
    const updatedSettings = await db
      .update(site_settings)
      .set({
        ...body,
        updated_at: new Date()
      })
      .where(eq(site_settings.id, existingSettings[0].id))
      .returning()
    
    return NextResponse.json({
      message: "Настройки успешно обновлены",
      settings: updatedSettings[0]
    })
  } catch (error) {
    console.error("Error updating site settings:", error)
    return NextResponse.json(
      { error: "Ошибка обновления настроек" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await db.delete(site_settings)
    await db.insert(site_settings).values(DEFAULT_SETTINGS)
    
    const newSettings = await db.select().from(site_settings).limit(1)
    
    return NextResponse.json({
      message: "Настройки сброшены к значениям по умолчанию",
      settings: newSettings[0]
    })
  } catch (error) {
    console.error("Error resetting site settings:", error)
    return NextResponse.json(
      { error: "Ошибка сброса настроек" },
      { status: 500 }
    )
  }
} 