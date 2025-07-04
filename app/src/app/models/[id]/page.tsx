import { notFound } from "next/navigation"
import { ModelPageContent } from "@/components/model-card/model-page.content"
import { getModelById, getModelIds } from "@/lib/get-models"
import { getSiteSettings } from "@/lib/get-site-settings"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export const revalidate = 120 // Ревалидация каждые 2 минуты
export const dynamicParams = true // Позволяет создавать новые страницы on-demand

export async function generateStaticParams() {
  const modelIds = await getModelIds()
  
  return modelIds.map((id) => ({
    id: id.toString(),
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params
  const modelId = parseInt(resolvedParams.id)
  
  if (isNaN(modelId)) {
    return {
      title: "Модель не найдена",
    }
  }
  
  const [model, settings] = await Promise.all([
    getModelById(modelId),
    getSiteSettings()
  ])
  
  if (!model || !model.is_active) {
    return {
      title: "Модель не найдена",
    }
  }
  
  const title = settings.model_title_template
    .replace("{name}", model.name)
    .replace("{age}", model.age.toString())
  
  return {
    title,
    description: model.description || `Профессиональная модель ${model.name}, Возраст: ${model.age}. Модельное агентство К.Л.С. в Москве.`,
  }
}

export default async function ModelPage({ params }: PageProps) {
  const resolvedParams = await params
  const modelId = parseInt(resolvedParams.id)
  
  if (isNaN(modelId)) {
    notFound()
  }
  
  const [model, settings] = await Promise.all([
    getModelById(modelId),
    getSiteSettings()
  ])
  
  if (!model || !model.is_active) {
    notFound()
  }
  
  return <ModelPageContent model={model} settings={settings} />
}
