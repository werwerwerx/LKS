"use client"

import { Phone, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-background text-foreground py-16 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-medium">+79966794478</span>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full border border-border text-foreground hover:bg-muted"
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full border border-border text-foreground hover:bg-muted"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-sm text-red-400 space-y-1">
              <p>Модельное агентство Touch-Models не</p>
              <p>предоставляет услуги интимного</p>
              <p>характера. Все услуги</p>
              <p>сопровождения осуществляются с</p>
              <p>обоюдного согласия сторон.</p>
              <p>Ограничение возраста для</p>
              <p>использования сайта - 18 лет.</p>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center">
                <span className="text-background font-bold text-xl">TM</span>
              </div>
              <div className="text-foreground">
                <div className="font-serif text-2xl">Touch</div>
                <div className="font-serif text-lg">Models</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end">
            <nav className="grid grid-cols-2 gap-4 text-sm">
              <Link href="#community" className="text-foreground hover:text-muted-foreground">
                Сотрудничество
              </Link>
              <Link href="#models" className="text-foreground hover:text-muted-foreground">
                Модели
              </Link>
              <Link href="#blog" className="text-foreground hover:text-muted-foreground">
                Блог
              </Link>
              <Link href="#services" className="text-foreground hover:text-muted-foreground">
                Услуги
              </Link>
              <Link href="#contacts" className="text-foreground hover:text-muted-foreground">
                Контакты
              </Link>
            </nav>
          </div>
        </div>

        {/* Legal Info */}
        <div className="mt-12 pt-8 border-t border-border text-xs text-muted-foreground">
          <p>ООО Тач Моделс ИНН 205414867О КПП 658202759 ОГРН 725666120З132</p>
          <p>Офис в Москве: Пресненская наб., 8 стр 1, Москва, Россия</p>
          <div className="mt-4 flex space-x-4">
            <Link href="#privacy" className="underline hover:text-foreground">
              Пользовательское соглашение
            </Link>
            <span>/</span>
            <Link href="#policy" className="underline hover:text-foreground">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
