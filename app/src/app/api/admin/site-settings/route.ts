import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { site_settings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const DEFAULT_SETTINGS = {
  phone: "+7 996 679 44 78",
  telegram: "@lks_models",
  email: "",
  address: "Офис в Москве: Пресненская наб., 8 стр 1, Москва, Россия",
  inn: "ООО Л.К.С. ИНН 205414867О КПП 658202759 ОГРН 725666120З132",
  hero_description: "Наше эскорт агентство предлагает премиальные услуги в Москве. С нами заказать профессиональную модель стало гораздо проще. Мы гарантируем полную конфиденциальность каждому клиенту, обеспечивая индивидуальный подбор модели под ваши требования. Наши девушки умеют создавать идеальную атмосферу для любого мероприятия: от деловых встреч до романтических встреч."
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
    
    const settingsData = {
      phone: body.phone,
      telegram: body.telegram,
      email: body.email,
      address: body.address,
      inn: body.inn,
      hero_description: body.hero_description,
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