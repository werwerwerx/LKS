"use client"

export default function OurServices() {
  const services = [
    {
      title: "VIP-модели",
      description: "эксклюзивное сопровождение для особо важных мероприятий.",
    },
    {
      title: "Элитные модели",
      description: "высококлассные модели для подчеркивания вашего статуса.",
    },
    {
      title: "Модели для выездных съемок",
      description: "возможность пригласить девушек для съемок в любую точку мира.",
    },
    {
      title: "Фотомодели",
      description: "долгосрочные отношения с гарантией комфорта.",
    },
    {
      title: "Модели для показов",
      description: "профессиональное модельное сопровождение для деловых встреч, мероприятий и показов.",
    },
    {
      title: "Романтические фотосессии",
      description: "идеальный вариант для особенного вечера.",
    },
    {
      title: "Модели для мероприятий",
      description: "возможность провести время с очаровательной спутницей.",
    },
  ]

  return (
    <section className="bg-background text-foreground py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-8">НАШИ УСЛУГИ</h2>
        <p className="text-base md:text-lg text-muted-foreground text-center mb-16 max-w-4xl mx-auto leading-relaxed">
          Мы предоставляем широкий спектр услуг, специально подобранных для самых взыскательных клиентов:
        </p>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div key={index} className="flex items-start space-x-4 p-4">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <span className="text-yellow-600 font-semibold text-sm md:text-base">{service.title}</span>
                  <span className="text-muted-foreground text-sm md:text-base"> : {service.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
