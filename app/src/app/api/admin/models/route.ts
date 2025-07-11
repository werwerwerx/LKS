import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { models, model_photos, Model } from "@/lib/db/schema"
import { eq, inArray } from "drizzle-orm"
import { verifyAdminToken } from "@/lib/auth-middleware"
import { ModelSchema } from "@/lib/validations"
import { z } from "zod"
import { revalidatePath, revalidateTag } from "next/cache"

export const GET = async (req: NextRequest) => {
  try {
    await verifyAdminToken(req)
    
    const allModels = await db
      .select({
        id: models.id,
        name: models.name,
        age: models.age,
        description: models.description,
        price: models.price,
        is_active: models.is_active,
        created_at: models.created_at,
        updated_at: models.updated_at,
        photos: model_photos.photo_url
      })
      .from(models)
      .leftJoin(model_photos, eq(models.id, model_photos.model_id))

    const modelsMap = new Map()
    
    allModels.forEach(model => {
      if (!modelsMap.has(model.id)) {
        modelsMap.set(model.id, {
          id: model.id,
          name: model.name,
          age: model.age,
          description: model.description,
          price: model.price,
          is_active: model.is_active,
          created_at: model.created_at,
          updated_at: model.updated_at,
          photos: []
        })
      }
      
      if (model.photos) {
        modelsMap.get(model.id).photos.push(model.photos)
      }
    })

    return NextResponse.json({
      models: Array.from(modelsMap.values())
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error fetching models:", error)
    return NextResponse.json(
      { error: "Ошибка получения моделей" },
      { status: 500 }
    )
  }
}

export const POST = async (req: NextRequest) => {
  try {
    await verifyAdminToken(req)
    
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

      // Используем транзакцию для атомарности операций

        const [createdModel] = await db.insert(models).values({
          name: validatedData.name.trim(),
          age: validatedData.age,
          description: validatedData.description?.trim() || null,
          price: validatedData.price ? validatedData.price.toString() : null,
          is_active: validatedData.is_active
        }).returning()


        if (validatedData.photos.length > 0) {
          await db.insert(model_photos).values(
            validatedData.photos.map((photoUrl: string) => ({
              model_id: createdModel.id,
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
      revalidatePath(`/models/${createdModel.id}`)

      return NextResponse.json({
        message: "Модель успешно создана",
        model: createdModel
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
    console.error("Error creating model:", error)
    return NextResponse.json(
      { error: "Ошибка создания модели" },
      { status: 500 }
    )
  }
}

export const DELETE = async (req: NextRequest) => {
  try {
    await verifyAdminToken(req)
    
    const body = await req.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Необходимо указать ID моделей для удаления" },
        { status: 400 }
      )
    }

    // Проверяем, что все ID являются числами
    const validIds = ids.filter(id => typeof id === 'number' && !isNaN(id))
    if (validIds.length !== ids.length) {
      return NextResponse.json(
        { error: "Все ID должны быть числами" },
        { status: 400 }
      )
    }

    // Используем транзакцию для атомарности операций
    await db.transaction(async (tx) => {
      // Сначала удаляем все фотографии
      await tx.delete(model_photos).where(inArray(model_photos.model_id, validIds))
      // Затем удаляем модели
      await tx.delete(models).where(inArray(models.id, validIds))
    })

    // Инвалидируем кеш с помощью тегов
    revalidateTag('models')
    revalidateTag('public-models')
    revalidateTag('model-ids')
    
    // Также инвалидируем страницы для надежности
    revalidatePath('/')
    revalidatePath('/models')
    validIds.forEach(id => {
      revalidatePath(`/models/${id}`)
    })

    return NextResponse.json({
      message: `Удалено моделей: ${validIds.length}`
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Error deleting models:", error)
    return NextResponse.json(
      { error: "Ошибка удаления моделей" },
      { status: 500 }
    )
  }
} 