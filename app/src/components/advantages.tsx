"use client"

import { Shield, Diamond, Crown, Star } from "lucide-react"

export default function Advantages() {
  const advantages = [
    {
      icon: Shield,
      title: "ВЫСОКИЙ УРОВЕНЬ УСЛУГ",
      description:
        "Каждая модель проходит тщательный отбор, чтобы соответствовать высоким стандартам наших клиентов. Это гарантирует, что каждая встреча с моделью станет поистине уникальным и запоминающимся событием.",
    },
    {
      icon: Diamond,
      title: "ИНДИВИДУАЛЬНЫЙ ПОДХОД",
      description:
        "Мы учитываем ваши пожелания и готовы помочь подобрать девушку, идеально соответствующую вашим ожиданиям.",
    },
    {
      icon: Crown,
      title: "ШИРОКИЙ ВЫБОР МОДЕЛЕЙ",
      description:
        "Мы предлагаем эксклюзивный выбор моделей для любых событий: от корпоративов до отдыха за границей. В нашем каталоге представлены только топовые девушки, среди которых — стильные инста-модели, популярные спортсменки, фотомодели, гимнастки, фигуристки.",
    },
  ]

  return (
    <section className="py-20 lg:py-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="bg-primary rounded-lg p-3 lg:p-4">
            <Star className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 lg:mb-20 leading-tight max-w-4xl mx-auto">
          ПРЕИМУЩЕСТВА ВЫБОРА TOUCH-MODELS
        </h2>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {advantages.map((advantage, index) => (
            <div key={index} className="text-center bg-card/30 border p-6 lg:p-8 rounded-2xl hover:bg-card/50 transition-colors duration-300">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-6 flex items-center justify-center border-2 border-primary rounded-xl bg-primary">
                <advantage.icon className="w-8 h-8 lg:w-10 lg:h-10 text-primary-foreground" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold mb-4 text-primary-foreground leading-tight">
                {advantage.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base lg:text-lg font-normal">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
