"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModelCard } from "@/components/model-card/model-card"
import { Loader2, Users, ArrowRight } from "lucide-react"
import { usePublicModels } from "@/hooks/use-public-models"

interface OtherModelsSectionProps {
  currentModelId: number
  maxModels?: number
}

export default function OtherModelsSection({ 
  currentModelId, 
  maxModels = 8 
}: OtherModelsSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { data, isLoading } = usePublicModels()

  const otherModels = useMemo(() => {
    if (!data?.models) return []
    
    return data.models
      .filter(model => model.id !== currentModelId)
      .slice(0, maxModels)
  }, [data?.models, currentModelId, maxModels])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    const element = document.getElementById('other-models-section')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [isVisible])

  return (
    <section id="other-models-section" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Другие модели</h2>
          <p className="text-muted-foreground text-lg">
            Посмотрите на других моделей из нашего агентства
          </p>
        </div>

        {!isVisible ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Прокрутите, чтобы загрузить другие модели</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Загружаем другие модели...</span>
          </div>
        ) : otherModels.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <CardTitle>Других моделей пока нет</CardTitle>
            </CardHeader>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {otherModels.map((model) => (
                <div key={model.id} className="animate-in fade-in-50 duration-500">
                  <ModelCard
                    imgSrc={model.photos}
                    name={model.name}
                    age={model.age}
                    goToModelButton={
                      <Link href={`/models/${model.id}`}>
                        <Button className="w-full">
                          Подробнее
                        </Button>
                      </Link>
                    }
                  />
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/models">
                <Button size="lg" variant="outline">
                  Посмотреть весь каталог
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
} 