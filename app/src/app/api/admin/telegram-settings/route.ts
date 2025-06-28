import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { telegram_settings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { verifyAdminToken } from "@/lib/auth-middleware"
import { TelegramBotTokenSchema } from "@/lib/validations"
import { z } from "zod"

export const GET = async (req: NextRequest) => {
  try {
    await verifyAdminToken(req)
    
    const settings = await db.select().from(telegram_settings).limit(1)
    const result = settings[0] || null
    
    if (result?.bot_token) {
      result.bot_token = `${result.bot_token.substring(0, 8)}***`
    }
    
    return NextResponse.json({ 
      settings: result 
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error fetching Telegram settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export const POST = async (req: NextRequest) => {
  try {
    await verifyAdminToken(req)
    
    const body = await req.json().catch(() => ({}))
    const { bot_token } = body

    if (!bot_token) {
      return NextResponse.json(
        { error: "Bot token is required" },
        { status: 400 }
      )
    }

    try {
      const validatedData = TelegramBotTokenSchema.parse({ bot_token })
      const trimmedToken = validatedData.bot_token.trim()
      
      if (trimmedToken.length > 100) {
        return NextResponse.json(
          { error: "Bot token too long" },
          { status: 400 }
        )
      }

    const existingSettings = await db.select().from(telegram_settings).limit(1)

    if (existingSettings.length > 0) {
      await db
        .update(telegram_settings)
        .set({ 
          bot_token: trimmedToken,
          updated_at: new Date(),
          is_active: false,
          subscriber_chat_id: null
        })
        .where(eq(telegram_settings.id, existingSettings[0].id))
    } else {
      await db.insert(telegram_settings).values({
        bot_token: trimmedToken,
        is_active: false,
        subscriber_chat_id: null
      })
    }

    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/telegram/polling`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restart" }),
      }).catch(() => {})
    } catch (error) {
      console.log("Failed to restart polling, but token was saved")
    }
    
      return NextResponse.json({ 
        message: "Settings updated successfully. Telegram bot will restart automatically." 
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
    console.error("Error saving Telegram settings:", error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    )
  }
}

export const PATCH = async (req: NextRequest) => {
  try {
    await verifyAdminToken(req)
    
    const body = await req.json().catch(() => ({}))
    const { is_active, subscriber_chat_id } = body

    const existingSettings = await db.select().from(telegram_settings).limit(1)
    
    if (existingSettings.length === 0) {
      return NextResponse.json(
        { error: "No settings found" },
        { status: 404 }
      )
    }

    const updateData: {
      updated_at: Date
      is_active?: boolean
      subscriber_chat_id?: string | null
    } = { updated_at: new Date() }
    
    if (typeof is_active !== 'undefined') {
      updateData.is_active = Boolean(is_active)
    }
    
    if (typeof subscriber_chat_id !== 'undefined') {
      updateData.subscriber_chat_id = subscriber_chat_id ? String(subscriber_chat_id).trim() : null
    }

    await db
      .update(telegram_settings)
      .set(updateData)
      .where(eq(telegram_settings.id, existingSettings[0].id))

    return NextResponse.json({ 
      message: "Settings updated successfully" 
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error updating Telegram settings:", error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
} 