"use client"

import { ClipboardList } from "lucide-react"

export default function HowToOrder() {
  const steps = [
    {
      number: "1",
      title: "СВЯЖИТЕСЬ С НАМИ",
      description: "Напишите в WhatsApp или Telegram. Связаться с агентством",
    },
    {
      number: "2",
      title: "ПОЛУЧИТЕ ДОСТУП К ЗАКРЫТОЙ БАЗЕ МОДЕЛЕЙ",
      description: "Доступ к каталогу элитных моделей выдается после оплаты услуг",
    },
    {
      number: "3",
      title: "ВЫБЕРЕТЕ ЖЕЛАЕМУЮ КАНДИДАТКУ",
      description:
        "В закрытой базе моделей находится более 1000 моделей для съемок, есть вероятность, вы выберете подходящую именно Вам",
    },
    {
      number: "4",
      title: "УТОЧНЯЕМ ДЕТАЛИ СЪЕМКИ: ФОРМАТ, ВРЕМЯ, МЕСТО",
      description: "Согласовываем условия съемки, формат работы, ваши пожелания",
    },
    {
      number: "5",
      title: "ОРГАНИЗОВЫВАЕМ ВСТРЕЧУ",
      description: "Радуем незабываемой профессиональной съемкой",
    },
  ]

  return (
    <section>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="bg-primary rounded-lg p-3 lg:p-4">
            <ClipboardList className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 lg:mb-20 max-w-4xl mx-auto leading-tight">
          КАК ЗАКАЗАТЬ МОДЕЛЬ ДЛЯ СЪЕМКИ?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`
                border rounded-md p-6 lg:p-7 transition-all duration-300 hover:shadow-md
                ${index === 2 
                  ? 'bg-primary text-primary-foreground border-primary-foreground' 
                  : 'bg-card hover:bg-card/80 text-primary-foreground'
                }
              `}
            >
              <div className="flex items-start space-x-5">
                <div className={`
                  text-5xl lg:text-6xl font-bold flex-shrink-0
                  ${index === 2 ? 'text-primary-foreground/70' : 'text-primary opacity-50'}
                `}>
                  {step.number}
                </div>
                <div className="pt-1">
                  <h3 className={`
                    text-base lg:text-lg font-bold mb-3 leading-tight
                    ${index === 2 ? 'text-primary-foreground' : 'text-primary'}
                  `}>
                    {step.title}
                  </h3>
                  <p className={`
                    leading-relaxed text-sm lg:text-base
                    ${index === 2 ? 'text-primary-foreground/90' : 'text-muted-foreground'}
                  `}>
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
