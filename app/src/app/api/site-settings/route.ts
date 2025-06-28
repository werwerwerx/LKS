import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { site_settings } from "@/lib/db/schema"

export async function GET() {
  try {
    const settings = await db.select().from(site_settings).limit(1)
    
    if (settings.length === 0) {
      return NextResponse.json(
        { error: "Настройки не найдены" },
        { status: 404 }
      )
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