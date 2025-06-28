"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModelCard } from "@/components/model-card/model-card"
import SimpleContactForm from "@/components/simple-contact-form"
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
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
            modelId={model.id}
            imgSrc={model.photos}
            name={model.name}
            age={model.age}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mb-16">
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

      <div className="text-center mt-8 text-sm text-muted-foreground mb-16">
        Показано {startIndex + 1}-{Math.min(endIndex, models.length)} из {models.length} моделей
      </div>

      {/* Contact Form Section */}
      <div className="py-16 bg-gradient-to-br from-primary/5 via-background to-muted/20 rounded-2xl">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-primary rounded-lg p-3 lg:p-4">
                <MessageCircle className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              ПОНРАВИЛАСЬ МОДЕЛЬ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 font-normal">
              Оставьте заявку и мы свяжемся с вами для обсуждения деталей встречи
            </p>
          </div>
          
          <Card className="shadow-xl border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Свяжитесь с нами</CardTitle>
              <CardDescription>
                Заполните форму и наш менеджер перезвонит вам в течение 15 минут
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleContactForm 
                buttonText="Связаться с менеджером"
                namePlaceholder="Как к вам обращаться?"
                phonePlaceholder="Ваш номер телефона"
                privacyText="Отправляя заявку, я соглашаюсь на обработку персональных данных и получение звонков"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
} 