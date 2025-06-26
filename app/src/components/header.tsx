"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, Phone, Send } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Header({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border  rounded-lg mx-4 mt-4", className)} {...props}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center">
              <span className="text-background font-bold text-lg">TM</span>
            </div>
            <div className="text-foreground">
              <div className="font-serif text-lg">Touch</div>
              <div className="font-serif text-sm">Models</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#community" className="text-foreground hover:text-gray-300 underline">
              Сотрудничество
            </Link>
            <div className="flex items-center space-x-1 text-foreground hover:text-gray-300 cursor-pointer">
              <span className="underline">Модели</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <Link href="#blog" className="text-foreground hover:text-gray-300 underline">
              Блог
            </Link>
            <div className="flex items-center space-x-1 text-foreground hover:text-gray-300 cursor-pointer">
              <span className="underline">Услуги</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <Link href="#contacts" className="text-foreground hover:text-gray-300 underline">
              Контакты
            </Link>
          </nav>

          {/* Contact Info */}
          <div className="flex items-center space-x-4">
            <span className="text-foreground font-medium">+79966794478</span>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full border border-foreground/30 text-foreground hover:bg-foreground/10"
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full border text-foreground hover:bg-foreground/10"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
