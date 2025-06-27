"use client"

import Image from "next/image"
import { lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Camera } from "lucide-react"

const ModelCard = lazy(() => import("@/components/model-card/model-card").then(module => ({ default: module.ModelCard })))

const modelsData = [
  {
    name: "Олеся",
    age: 23,
    imgSrc: [
      "/imgs/OLESYA1.webp",
      "/imgs/OLESYA2.jpg", 
      "/imgs/OLESYA3.jpg"
    ]
  },
  {
    name: "Вероника", 
    age: 25,
    imgSrc: [
      "/imgs/veronika.webp",
      "/imgs/veronika2.webp",
      "/imgs/VERONIKA3.jpg",
      "/imgs/VERONIKA4.webp"
    ]
  },
  {
    name: "Катя",
    age: 22, 
    imgSrc: [
      "/imgs/KATYA1.webp",
      "/imgs/KATYA2.webp",
      "/imgs/KATYA3.jpg"
    ]
  }
]

function ModelCardSkeleton() {
  return (
    <div className="w-full h-[500px] rounded-2xl bg-muted animate-pulse">
      <div className="w-full h-full rounded-2xl bg-gradient-to-t from-muted-foreground/20 to-muted" />
    </div>
  )
}

export default function WhatIsModeling() {
  return (
    <section className="py-20 lg:py-24">
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
          {modelsData.map((model, index) => (
            <Suspense key={index} fallback={<ModelCardSkeleton />}>
              <ModelCard
                imgSrc={model.imgSrc}
                name={model.name}
                age={model.age}
              />
            </Suspense>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            variant="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 lg:px-12 lg:py-5 text-base lg:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Смотреть весь каталог моделей
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="mt-4 text-sm lg:text-base text-muted-foreground font-medium">
            В нашем каталоге только самые профессиональные модели
          </p>
        </div>
      </div>
    </section>
  )
}
