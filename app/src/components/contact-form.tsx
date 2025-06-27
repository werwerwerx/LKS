"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageCircle } from "lucide-react"
import Image from "next/image"

export default function ContactForm() {
  return (
    <section className="py-20 lg:py-24 relative overflow-hidden">
      <div className="absolute left-0 top-0 w-1/2 h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80 z-10" />
        <Image
          src="/placeholder.svg?height=600&width=400"
          alt="Professional Manager"
          width={400}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-20 container mx-auto px-6 max-w-7xl">
        <div className="flex justify-end">
          <div className="w-full md:w-1/2 max-w-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary rounded-lg p-3 lg:p-4">
                <MessageCircle className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8 leading-tight text-start">
              ОСТАЛИСЬ ВОПРОСЫ?
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 lg:mb-12 font-normal text-start">
                              Наши менеджеры с <span className="text-primary font-medium">удовольствием</span> ответят на них
            </p>

            <form className="space-y-6">
              <Input
                placeholder="Ваше имя"
                className="h-12 text-base bg-transparent border-muted text-foreground placeholder:text-muted-foreground rounded-lg"
              />
              <Input
                placeholder="Номер телефона"
                className="h-12 text-base bg-transparent border-muted text-foreground placeholder:text-muted-foreground rounded-lg"
              />

              <div className="flex items-center space-x-3 pt-3">
                <Checkbox id="privacy" className="border-muted w-5 h-5" />
                <label htmlFor="privacy" className="text-primary text-base cursor-pointer">
                  Соглашаюсь с политикой обработки данных
                </label>
              </div>

              <Button className="w-full h-12 bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background text-base font-semibold rounded-lg transition-colors duration-300">
                ОТПРАВИТЬ
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
