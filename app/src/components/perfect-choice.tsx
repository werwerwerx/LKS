"use client"

import { Award } from "lucide-react"
import { CircularShadow } from "@/components/ui/circular-shadow"

export default function PerfectChoice() {
  return (
    <section className="py-20 lg:py-24 relative overflow-hidden">
      <CircularShadow position="left" size="md" />
      
              <div className="container mx-auto px-6 max-w-7xl relative" style={{ zIndex: 2 }}>
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="w-full lg:w-2/3 order-2 lg:order-1">
            <div className="max-w-4xl text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <div className="bg-primary rounded-lg p-3 lg:p-4">
                  <Award className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8 leading-tight">
                ИДЕАЛЬНЫЙ ВЫБОР ДЛЯ СЪЕМОК
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed font-normal">
                Мы оказываем услуги профессиональных моделей в Москве, демонстрируя уровень, который нельзя сравнить с
                обычными услугами сопровождения. Каждая наша модель обладает красотой, интеллектом и шармом, чтобы сделать
                ваш отдых незабываемым. Если вы хотите провести время с очаровательной девушкой, которая понимает все нюансы
                светского общения и способна поддержать разговор на любую тему, наше модельное агентство поможет вам найти
                идеальный вариант.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
