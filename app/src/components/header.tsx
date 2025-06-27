"use client"

import { Button } from "@/components/ui/button"
import { Menu, Phone, Send, ChevronDown } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { resoureces } from "@/lib/resources"

export default function Header({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50", 
      "bg-background/95 backdrop-blur-md border-b border-border/50",
      "shadow-sm",
      className
    )} {...props}>
      <div className="container h-20 mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-lg lg:text-xl">
                  {resoureces.companyName}
                </span>
              </div>
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-xl lg:text-2xl text-foreground">
                {resoureces.companyName}
              </div>
              <div className="text-xs lg:text-sm text-muted-foreground font-medium">
                Elite Models Agency
              </div>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink href="#models">Модели</NavLink>
            <NavLink href="#services">Услуги</NavLink>
            <NavLink href="#about">О нас</NavLink>
            <NavLink href="#contacts">Контакты</NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-lg">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">+7 996 679 44 78</span>
            </div>
            
            <Button
              size="sm"
              variant="default"
              className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Send className="w-4 h-4 mr-2" />
              Связаться
            </Button>

            {/* Mobile menu button */}
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden w-10 h-10 rounded-lg hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-foreground/80 hover:text-foreground font-medium text-sm lg:text-base transition-colors duration-200 relative group"
    >
      {children}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></div>
    </Link>
  )
}
