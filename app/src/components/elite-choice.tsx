"use client"

import { Gem } from "lucide-react"
import { CircularShadow } from "@/components/ui/circular-shadow"

export default function EliteChoice() {
  return (
    <section className="py-20 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative" style={{ zIndex: 2 }}>
      <CircularShadow position="left" size="md" />
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-primary rounded-lg p-3 lg:p-4">
            <Gem className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground"  />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 lg:mb-10 leading-tight max-w-5xl">
          ЭЛИТНЫЙ ЭСКОРТ - ИДЕАЛЬНЫЙ ВЫБОР ДЛЯ ДОСУГА
        </h2>
        <div className="max-w-4xl text-start">
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed font-normal">
            Мы оказываем услуги профессиональных моделей, демонстрируя уровень, который нельзя сравнить с
            обычными услугами сопровождения. Каждая наша модель обладает красотой, интеллектом и шармом, чтобы сделать
            ваши вечеринки незабываемыми. Если вы хотите провести вечер с очаровательной девушкой, которая понимает
            все нюансы профессиональной работы и способна создать нужную атмосферу, наше премиальное эскорт агентство поможет вам
            найти идеальный вариант.
          </p>
        </div>
      </div>
    </section>
  )
}
