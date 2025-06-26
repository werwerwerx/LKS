"use client"

import { Shield, Diamond, Crown } from "lucide-react"

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
    <section className="bg-background text-foreground py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 leading-tight">
          ПРЕИМУЩЕСТВА ВЫБОРА TOUCH-MODELS
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {advantages.map((advantage, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border-2 border-yellow-600 rounded-lg">
                <advantage.icon className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-yellow-600">{advantage.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
