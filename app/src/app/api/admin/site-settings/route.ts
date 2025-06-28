import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { site_settings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { verifyAdminToken } from "@/lib/auth-middleware"
import { SiteSettingsSchema } from "@/lib/validations"
import { z } from "zod"

const DEFAULT_SETTINGS = {
  phone: "+7 996 679 44 78",
  telegram: "@lks_models",
  email: "",
  address: "Офис в Москве: Пресненская наб., 8 стр 1, Москва, Россия",
  inn: "ООО Л.К.С. ИНН 205414867О КПП 658202759 ОГРН 725666120З132",
  hero_description: "Модельное агентство L.K.S. предлагает премиальные услуги профессиональных моделей в Москве. С нами заказать профессиональную модель для мероприятий стало гораздо проще. Мы гарантируем полную конфиденциальность каждому клиенту, обеспечивая индивидуальный подбор модели под ваши требования. Наши модели умеют создавать идеальную атмосферу для любого мероприятия: от деловых встреч до светских событий.",
  home_title: "L.K.S. - Модельное агентство премиум класса в Москве",
  models_title: "Каталог моделей L.K.S. - Профессиональные модели Москвы",
  model_title_template: "{name}, {age} лет - Профессиональная модель L.K.S."
}

export async function GET(req: NextRequest) {
  try {
    await verifyAdminToken(req)
    
    const settings = await db.select().from(site_settings).limit(1)
    
    if (settings.length === 0) {
      await db.insert(site_settings).values(DEFAULT_SETTINGS)
      const newSettings = await db.select().from(site_settings).limit(1)
      return NextResponse.json({ settings: newSettings[0] })
    }
    
    return NextResponse.json({ settings: settings[0] })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error fetching site settings:", error)
    return NextResponse.json(
      { error: "Ошибка получения настроек" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    await verifyAdminToken(req)
    
    const body = await req.json()
    
    try {
      const validatedData = SiteSettingsSchema.parse(body)
      
      const settingsData = {
        phone: validatedData.phone,
        telegram: validatedData.telegram,
        email: validatedData.email || null,
        address: validatedData.address,
        inn: validatedData.inn,
        hero_description: validatedData.hero_description,
        home_title: validatedData.home_title,
        models_title: validatedData.models_title,
        model_title_template: validatedData.model_title_template,
        updated_at: new Date()
      }
    
    const existingSettings = await db.select().from(site_settings).limit(1)
    
    if (existingSettings.length === 0) {
      const newSettings = await db.insert(site_settings).values({
        ...DEFAULT_SETTINGS,
        ...settingsData
      }).returning()
      
      return NextResponse.json({
        message: "Настройки успешно созданы",
        settings: newSettings[0]
      })
    }
    
    const updatedSettings = await db
      .update(site_settings)
      .set(settingsData)
      .where(eq(site_settings.id, existingSettings[0].id))
      .returning()
    
      return NextResponse.json({
        message: "Настройки успешно обновлены",
        settings: updatedSettings[0]
      })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const firstError = validationError.errors[0]
        return NextResponse.json(
          { error: firstError.message },
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error updating site settings:", error)
    return NextResponse.json(
      { error: "Ошибка обновления настроек" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await verifyAdminToken(req)
    
    await db.delete(site_settings)
    await db.insert(site_settings).values(DEFAULT_SETTINGS)
    
    const newSettings = await db.select().from(site_settings).limit(1)
    
    return NextResponse.json({
      message: "Настройки сброшены к значениям по умолчанию",
      settings: newSettings[0]
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error resetting site settings:", error)
    return NextResponse.json(
      { error: "Ошибка сброса настроек" },
      { status: 500 }
    )
  }
} 