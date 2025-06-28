"use client"

import Image from "next/image"
import { lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Camera } from "lucide-react"
import { usePublicModels } from "@/hooks/use-public-models"
import Link from "next/link"

const ModelCard = lazy(() => import("@/components/model-card/model-card").then(module => ({ default: module.ModelCard })))

function ModelCardSkeleton() {
  return (
    <div className="w-full h-[500px] rounded-2xl bg-muted animate-pulse">
      <div className="w-full h-full rounded-2xl bg-gradient-to-t from-muted-foreground/20 to-muted" />
    </div>
  )
}

export default function WhatIsModeling() {
  const { data: modelsData, isLoading } = usePublicModels()
  
  const activeModels = modelsData?.models
    ?.filter(model => model.photos.length > 0)
    ?.slice(0, 3) || []

  return (
    <section>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-primary rounded-lg p-3 lg:p-4">
              <Camera className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8 leading-tight">
            ЧТО ТАКОЕ МОДЕЛЬНЫЕ УСЛУГИ?
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed font-normal">
            Модельные услуги — это профессиональные услуги сопровождения для фотосессий, показов мод и мероприятий,
            которые позволяют не только насладиться обществом красивой девушки, но и подчеркнуть ваш статус на важных
            мероприятиях. Модельные услуги предоставляют возможность добавить в вашу жизнь вдохновляющие моменты,
            разделенные с девушками, обладающими безупречным вкусом, презентабельной внешностью и умением поддержать
            разговор. Это идеальный выбор для тех, кто ценит высокий уровень сервиса, конфиденциальность и
            индивидуальный подход.
          </p>
        </div>

        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12 lg:mb-16">
          ВЫБЕРИ СВОЮ МОДЕЛЬ
        </h3>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-20">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <ModelCardSkeleton key={index} />
            ))
          ) : activeModels.length > 0 ? (
            activeModels.map((model) => (
              <Suspense key={model.id} fallback={<ModelCardSkeleton />}>
                <ModelCard
                  modelId={model.id}
                  imgSrc={model.photos}
                  name={model.name}
                  age={model.age}
                />
              </Suspense>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-lg text-muted-foreground">
                Модели временно недоступны. Скоро здесь появятся новые анкеты!
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 lg:px-12 lg:py-5 text-base lg:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/models">
              Смотреть весь каталог моделей
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <p className="mt-4 text-sm lg:text-base text-muted-foreground font-medium">
            В нашем каталоге только самые профессиональные модели
          </p>
        </div>
      </div>
    </section>
  )
}
