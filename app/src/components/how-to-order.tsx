"use client"

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
    <section className="bg-background text-foreground py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 max-w-4xl mx-auto leading-tight">
          КАК ЗАКАЗАТЬ МОДЕЛЬ ДЛЯ СЪЕМКИ?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="text-6xl font-bold text-yellow-600 opacity-50 flex-shrink-0">{step.number}</div>
              <div>
                <h3 className="text-lg font-bold mb-3 text-yellow-600">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
