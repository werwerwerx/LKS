"use client"

import { Phone, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { resoureces } from "@/lib/resources"

export default function Footer() {
  return (
    <footer className="py-16 lg:py-20 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 lg:gap-12 items-start">
          <div className="space-y-5">
            <div className="flex items-center space-x-4">
              <span className="text-xl lg:text-2xl font-medium">+79966794478</span>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full border border-border text-foreground hover:bg-muted w-10 h-10 lg:w-12 lg:h-12"
              >
                <Phone className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full border border-border text-foreground hover:bg-muted w-10 h-10 lg:w-12 lg:h-12"
              >
                <Send className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>
            </div>

            <div className="text-red-400 space-y-1 text-sm lg:text-base leading-relaxed">
              <p>Модельное агентство Touch-Models не</p>
              <p>предоставляет услуги интимного</p>
              <p>характера. Все услуги</p>
              <p>сопровождения осуществляются с</p>
              <p>обоюдного согласия сторон.</p>
              <p>Ограничение возраста для</p>
              <p>использования сайта - 18 лет.</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-foreground rounded-full flex items-center justify-center">
                <span className="text-background font-bold text-xl lg:text-2xl">TM</span>
              </div>
              <div className="text-foreground">
                <div className="font-serif text-2xl lg:text-3xl">Touch</div>
                <div className="font-serif text-lg lg:text-xl">Models</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <nav className="grid grid-cols-2 gap-4 text-sm lg:text-base">
              <Link href="#community" className="text-foreground hover:text-muted-foreground transition-colors">
                Сотрудничество
              </Link>
              <Link href="#models" className="text-foreground hover:text-muted-foreground transition-colors">
                Модели
              </Link>
              <Link href="#blog" className="text-foreground hover:text-muted-foreground transition-colors">
                Блог
              </Link>
              <Link href="#services" className="text-foreground hover:text-muted-foreground transition-colors">
                Услуги
              </Link>
              <Link href="#contacts" className="text-foreground hover:text-muted-foreground transition-colors">
                Контакты
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 lg:mt-16 pt-6 lg:pt-8 border-t border-border text-sm text-muted-foreground">
          <p className="mb-2">{resoureces.companyInn}</p>
          <p className="mb-4">{resoureces.fullAdress}</p>
          <div className="flex space-x-4">
            <Link href="#privacy" className="underline hover:text-foreground transition-colors">
              Пользовательское соглашение
            </Link>
            <span>/</span>
            <Link href="#policy" className="underline hover:text-foreground transition-colors">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
