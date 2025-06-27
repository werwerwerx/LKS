"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModelCard } from "@/components/model-card/model-card"
import { Loader2, ChevronLeft, ChevronRight, Users } from "lucide-react"
import { usePublicModels } from "@/hooks/use-public-models"
import { cn } from "@/lib/utils"

const MODELS_PER_PAGE = 12

export default function ModelsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, isLoading, error } = usePublicModels()
  
  const models = data?.models || []
  const totalPages = Math.ceil(models.length / MODELS_PER_PAGE)
  const startIndex = (currentPage - 1) * MODELS_PER_PAGE
  const endIndex = startIndex + MODELS_PER_PAGE
  const currentModels = models.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Ошибка загрузки</h1>
            <p className="text-muted-foreground">{error.message}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Попробовать снова
            </Button>
          </div>
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

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Загрузка моделей...</span>
          </div>
        ) : models.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <CardTitle>Моделей пока нет</CardTitle>
              <CardDescription>
                В данный момент каталог пуст. Пожалуйста, зайдите позже.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentModels.map((model) => (
                <ModelCard
                  key={model.id}
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
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={cn(
                    "flex items-center space-x-2",
                    currentPage === 1 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Назад</span>
                </Button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => goToPage(page)}
                      className="w-10 h-10 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "flex items-center space-x-2",
                    currentPage === totalPages && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span>Вперёд</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="text-center mt-8 text-sm text-muted-foreground">
              Показано {startIndex + 1}-{Math.min(endIndex, models.length)} из {models.length} моделей
            </div>
          </>
        )}
      </div>
    </div>
  )
}