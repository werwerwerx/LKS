"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { resoureces } from "@/lib/resources"

export default function HeroSection({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section 
      className={cn(
        "min-h-[40vh] w-full relative",
        className
      )} 
      {...props}
    >
      <div className="container px-10 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Текстовый контент */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-4xl text-start sm:text-5xl lg:text-6xl font-bold leading-tight">
              {resoureces.companyName} - зона вашего комфорта.
            </h1>
            
            <p className="mt-4 text-lg text-start sm:text-xl text-muted-foreground">
              {resoureces.companyName} - зона вашего комфорта. 24/7.
            </p>
            
            <Button
              size="lg"
              variant="default"
              className="mt-8 px-8 py-3 text-lg"
            >
              ВЫБРАТЬ МОДЕЛЬ
            </Button>

            <p className="mt-12 text-base text-start sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Наше модельное агентство предлагает премиальные услуги в Москве. С нами заказать профессиональную модель
              стало гораздо проще. Мы гарантируем полную конфиденциальность каждому клиенту, обеспечивая индивидуальный
              подбор модели под ваши требования. Наши девушки умеют создавать идеальную атмосферу для любого мероприятия:
              от деловых встреч до романтических фотосессий.
            </p>
          </div>

          {/* Изображение */}
          <div className="w-full lg:w-1/2 relative aspect-[3/4]">
            <Image
              src="/imgs/hot-background.jpg"
              alt="Professional Model"
              fill
              className="object-cover rounded-2xl shadow-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              quality={100}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
