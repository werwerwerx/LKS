"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

export default function ContactForm() {
  return (
    <section className="bg-background text-foreground py-20 relative overflow-hidden">
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
          <div className="w-full md:w-1/2 max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">ОСТАЛИСЬ ВОПРОСЫ?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Наши менеджеры с <span className="text-yellow-600">удовольствием</span> ответят на них
            </p>

            <form className="space-y-6">
              <Input
                placeholder="Ваше имя"
                className="bg-transparent border-muted text-foreground placeholder:text-muted-foreground"
              />
              <Input
                placeholder="Номер телефона"
                className="bg-transparent border-muted text-foreground placeholder:text-muted-foreground"
              />

              <div className="flex items-center space-x-2">
                <Checkbox id="privacy" className="border-muted" />
                <label htmlFor="privacy" className="text-sm text-yellow-600">
                  Соглашаюсь с политикой обработки данных
                </label>
              </div>

              <Button className="w-full bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background py-3">
                ОТПРАВИТЬ
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
