"use client"

import { Gem } from "lucide-react"

export default function EliteChoice() {
  return (
    <section className="py-20 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-primary rounded-lg p-3 lg:p-4">
            <Gem className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 lg:mb-10 leading-tight max-w-5xl">
          ЭЛИТНОЕ МОДЕЛЬНОЕ АГЕНТСТВО В МОСКВЕ - ИДЕАЛЬНЫЙ ВЫБОР ДЛЯ СЪЕМОК
        </h2>
        <div className="max-w-4xl text-start">
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed font-normal">
            Мы оказываем услуги профессиональных моделей в Москве, демонстрируя уровень, который нельзя сравнить с
            обычными услугами сопровождения. Каждая наша модель обладает красотой, интеллектом и шармом, чтобы сделать
            ваши съемки незабываемыми. Если вы хотите провести фотосессию с очаровательной девушкой, которая понимает
            все нюансы профессиональной работы и способна создать нужную атмосферу, наше модельное агентство поможет вам
            найти идеальный вариант.
          </p>
        </div>
      </div>
    </section>
  )
}
