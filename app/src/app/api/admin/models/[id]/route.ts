import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { models, model_photos } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const modelId = parseInt(params.id)
    
    if (isNaN(modelId)) {
      return NextResponse.json(
        { error: "Неверный ID модели" },
        { status: 400 }
      )
    }

    const model = await db.select().from(models).where(eq(models.id, modelId)).limit(1)
    
    if (model.length === 0) {
      return NextResponse.json(
        { error: "Модель не найдена" },
        { status: 404 }
      )
    }

    const photos = await db.select().from(model_photos).where(eq(model_photos.model_id, modelId))

    return NextResponse.json({
      model: {
        ...model[0],
        photos: photos.map(p => p.photo_url)
      }
    })
  } catch (error) {
    console.error("Error fetching model:", error)
    return NextResponse.json(
      { error: "Ошибка получения модели" },
      { status: 500 }
    )
  }
}

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const modelId = parseInt(params.id)
    
    if (isNaN(modelId)) {
      return NextResponse.json(
        { error: "Неверный ID модели" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { name, age, description, photos = [], is_active } = body

    if (!name || !age) {
      return NextResponse.json(
        { error: "Имя и возраст обязательны" },
        { status: 400 }
      )
    }

    if (typeof age !== 'number' || age < 16 || age > 99) {
      return NextResponse.json(
        { error: "Возраст должен быть числом от 16 до 99" },
        { status: 400 }
      )
    }

    const existingModel = await db.select().from(models).where(eq(models.id, modelId)).limit(1)
    
    if (existingModel.length === 0) {
      return NextResponse.json(
        { error: "Модель не найдена" },
        { status: 404 }
      )
    }

    await db.update(models).set({
      name: name.trim(),
      age,
      description: description?.trim() || null,
      is_active: is_active ?? true,
      updated_at: new Date()
    }).where(eq(models.id, modelId))

    await db.delete(model_photos).where(eq(model_photos.model_id, modelId))

    if (photos.length > 0) {
      await db.insert(model_photos).values(
        photos.map((photoUrl: string) => ({
          model_id: modelId,
          photo_url: photoUrl
        }))
      )
    }

    return NextResponse.json({
      message: "Модель успешно обновлена"
    })
  } catch (error) {
    console.error("Error updating model:", error)
    return NextResponse.json(
      { error: "Ошибка обновления модели" },
      { status: 500 }
    )
  }
}

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const modelId = parseInt(params.id)
    
    if (isNaN(modelId)) {
      return NextResponse.json(
        { error: "Неверный ID модели" },
        { status: 400 }
      )
    }

    const existingModel = await db.select().from(models).where(eq(models.id, modelId)).limit(1)
    
    if (existingModel.length === 0) {
      return NextResponse.json(
        { error: "Модель не найдена" },
        { status: 404 }
      )
    }

    await db.delete(model_photos).where(eq(model_photos.model_id, modelId))
    await db.delete(models).where(eq(models.id, modelId))

    return NextResponse.json({
      message: "Модель успешно удалена"
    })
  } catch (error) {
    console.error("Error deleting model:", error)
    return NextResponse.json(
      { error: "Ошибка удаления модели" },
      { status: 500 }
    )
  }
} 