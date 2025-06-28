import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { models } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lks-models.ru'
  if(baseUrl !== "https://lks-models.ru") {
    console.warn("NEXT_PUBLIC_BASE_URL is not set, bad for seo")
  }
  // Получаем активные модели из базы данных
  const activeModels = await db
    .select({ id: models.id, updated_at: models.updated_at })
    .from(models)
    .where(eq(models.is_active, true))

  // Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/models`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Динамические страницы моделей
  const modelPages: MetadataRoute.Sitemap = activeModels.map((model) => ({
    url: `${baseUrl}/models/${model.id}`,
    lastModified: model.updated_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...modelPages]
} 