"use client"
import Image from "next/image"
import { Sparkles } from "lucide-react"

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
    <section className="py-20 lg:py-24 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute top-1/2 -translate-y-1/2 right-8 lg:right-1/5 w-[392px] h-[588px] opacity-10 lg:opacity-25 pointer-events-none">
        <Image 
          src="/imgs/goddamn-girl.png" 
          alt="Our Services" 
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="bg-primary rounded-lg p-3 lg:p-4">
            <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 lg:mb-12">
          НАШИ УСЛУГИ
        </h2>
        <p className="text-lg lg:text-xl text-muted-foreground text-center mb-16 lg:mb-20 max-w-4xl mx-auto leading-relaxed font-normal">
          Мы предоставляем широкий спектр услуг, специально подобранных для самых взыскательных клиентов:
        </p>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div key={index} className="border rounded-md bg-card p-5 lg:p-6 transition-all duration-300 hover:shadow-md hover:bg-card/80">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-primary font-semibold text-base lg:text-lg mb-2 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
