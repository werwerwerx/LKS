"use client"

import { FileText } from "lucide-react"
import { CircularShadow } from "@/components/ui/circular-shadow"

export default function ServicesDescription() {
  return (
    <section className="py-20 lg:py-24 relative overflow-hidden">
      <CircularShadow position="left" size="md" />
      <div className="container mx-auto px-6 relative" style={{ zIndex: 2 }}>
        <div className="flex items-center justify-end gap-4 mb-6">
          <div className="bg-primary rounded-lg p-3 lg:p-4">
            <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 lg:mb-20">
          УСЛУГИ
        </h2>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed font-normal">
            Модели этого элитного агентства предоставляют возможность ощутить высокий уровень сервиса, утонченность и
            исключительную красоту. Каждая съемка с нашими моделями способна превратиться в незабываемое событие, будь
            то деловой ужин, личный вечер или романтическая фотосессия. Мы предлагаем эксклюзивный выбор элитных
            моделей, включая элитных личностей, спортсменок и победительниц конкурсов красоты. Добавьте в свою жизнь
            незабываемые моменты вместе с девушками нашего модельного агентства уже сегодня! Наши профессионалы помогут
            воплотить ваши желания в реальность, а каждая наша модель станет ярким дополнением любого важного события.
          </p>
        </div>
      </div>
    </section>
  )
}
