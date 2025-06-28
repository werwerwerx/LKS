import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModelCard } from "@/components/model-card/model-card"
import { Users } from "lucide-react"
import { getPublicModels } from "@/lib/get-models"
import { getSiteSettings } from "@/lib/get-site-settings"
import { ModelsPageClient } from "@/components/models-page-client"

export const revalidate = 1800 // Ревалидация каждые 30 минут

export async function generateMetadata() {
  const settings = await getSiteSettings()
  
  return {
    title: settings.models_title,
    description: "Каталог профессиональных моделей в Москве. Выберите модель из нашего эксклюзивного каталога L.K.S.",
    keywords: "каталог моделей, профессиональные модели, премиум модели, Москва, L.K.S.",
    openGraph: {
      title: settings.models_title,
      description: "Выберите модель из нашего эксклюзивного каталога профессиональных моделей в Москве",
      type: "website",
    },
  }
}

export default async function ModelsPage() {
  const models = await getPublicModels()

  if (models.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Каталог моделей</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Выберите модель из нашего эксклюзивного каталога
            </p>
          </div>
          
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <CardTitle>Моделей пока нет</CardTitle>
              <CardDescription>
                В данный момент каталог пуст. Пожалуйста, зайдите позже.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Каталог моделей</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Выберите модель из нашего эксклюзивного каталога
          </p>
        </div>

        <ModelsPageClient models={models} />
      </div>
    </div>
  )
}