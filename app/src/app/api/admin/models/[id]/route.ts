import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { models, model_photos } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { verifyAdminToken } from "@/lib/auth-middleware"
import { ModelSchema } from "@/lib/validations"
import { z } from "zod"
import { revalidatePath, revalidateTag } from "next/cache"

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await verifyAdminToken(req)
    
    const resolvedParams = await params
    const modelId = parseInt(resolvedParams.id)
    
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
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error fetching model:", error)
    return NextResponse.json(
      { error: "Ошибка получения модели" },
      { status: 500 }
    )
  }
}

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await verifyAdminToken(req)
    
    const resolvedParams = await params
    const modelId = parseInt(resolvedParams.id)
    
    if (isNaN(modelId)) {
      return NextResponse.json(
        { error: "Неверный ID модели" },
        { status: 400 }
      )
    }

    const body = await req.json()
    
    try {
      const validatedData = ModelSchema.parse({
        name: body.name,
        age: body.age,
        description: body.description,
        price: body.price,
        photos: body.photos || [],
        is_active: body.is_active ?? true
      })

    const existingModel = await db.select().from(models).where(eq(models.id, modelId)).limit(1)
    
    if (existingModel.length === 0) {
      return NextResponse.json(
        { error: "Модель не найдена" },
        { status: 404 }
      )
    }

      await db.update(models).set({
        name: validatedData.name.trim(),
        age: validatedData.age,
        description: validatedData.description?.trim() || null,
        price: validatedData.price ? validatedData.price.toString() : null,
        is_active: validatedData.is_active,
        updated_at: new Date()
      }).where(eq(models.id, modelId))

      await db.delete(model_photos).where(eq(model_photos.model_id, modelId))

      if (validatedData.photos.length > 0) {
        await db.insert(model_photos).values(
          validatedData.photos.map((photoUrl: string) => ({
            model_id: modelId,
            photo_url: photoUrl
          }))
        )
      }

      // Инвалидируем кеш с помощью тегов
      revalidateTag('models')
      revalidateTag('public-models')
      revalidateTag('model-ids')
      
      // Также инвалидируем страницы для надежности
      revalidatePath('/')
      revalidatePath('/models')
      revalidatePath(`/models/${modelId}`)

      return NextResponse.json({
        message: "Модель успешно обновлена"
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
    console.error("Error updating model:", error)
    return NextResponse.json(
      { error: "Ошибка обновления модели" },
      { status: 500 }
    )
  }
}

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await verifyAdminToken(req)
    
    const resolvedParams = await params
    const modelId = parseInt(resolvedParams.id)
    
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

    // Инвалидируем кеш с помощью тегов
    revalidateTag('models')
    revalidateTag('public-models')
    revalidateTag('model-ids')
    
    // Также инвалидируем страницы для надежности
    revalidatePath('/')
    revalidatePath('/models')
    revalidatePath(`/models/${modelId}`)

    return NextResponse.json({
      message: "Модель успешно удалена"
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error deleting model:", error)
    return NextResponse.json(
      { error: "Ошибка удаления модели" },
      { status: 500 }
    )
  }
} 