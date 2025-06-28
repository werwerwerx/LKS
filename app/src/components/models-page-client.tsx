"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModelCard } from "@/components/model-card/model-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Model } from "@/lib/get-models"

const MODELS_PER_PAGE = 8

interface ModelsPageClientProps {
  models: Model[]
}

export function ModelsPageClient({ models }: ModelsPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  
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

  return (
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
  )
} 