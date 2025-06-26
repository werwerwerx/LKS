"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function HeroSection({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section className={cn("min-h-screen bg-background text-foreground relative overflow-hidden w-full flex items-center justify-center", className)} {...props}>
      <div className="inset-0 bg-gradient-to-r from-background/80 to-transparent z-10" />
      <div className="right-0 top-0 w-1/2 h-full relative">
        <Image
          src="/placeholder.svg?height=800&width=600"
          alt="Professional Model"
          className="w-full h-full object-cover"
          fill
        />
      </div>

      <div className="relative z-20 container mx-auto px-6 pt-32 pb-16">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">МОДЕЛЬНОЕ АГЕНТСТВО МОСКВА</h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Зона вашего успеха. 24/7. Исполним любой запрос для фотосессий, показов и мероприятий.
          </p>
          <Button
            size="lg"
            className="bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background px-8 py-4 text-lg"
          >
            ВЫБРАТЬ МОДЕЛЬ
          </Button>
        </div>

        <div className="mt-16 max-w-4xl">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Наше модельное агентство предлагает премиальные услуги в Москве. С нами заказать профессиональную модель
            стало гораздо проще. Мы гарантируем полную конфиденциальность каждому клиенту, обеспечивая индивидуальный
            подбор модели под ваши требования. Наши девушки умеют создавать идеальную атмосферу для любого мероприятия:
            от деловых встреч до романтических фотосессий.
          </p>
        </div>
      </div>
    </section>
  )
}
