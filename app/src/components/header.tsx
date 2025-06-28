"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Menu, Phone, Send, ChevronDown, Home, Users, Briefcase, MessageSquare, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { SiteSettings } from "@/lib/get-site-settings"

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  settings: SiteSettings
}

export default function Header({ settings, className, ...props }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50", 
        "bg-background/95 backdrop-blur-md border-b border-border/50",
        "shadow-sm",
        className
      )} {...props}>
        <div className="container h-20 mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="h-10 w-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-bold text-lg lg:text-xl">
                    ЛКС
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-xl lg:text-2xl text-foreground">
                  Л.К.С
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground font-medium">
                  Элитное модельное агентство
                </div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              <NavLink href="/" icon={Home}>Главная</NavLink>
              <NavLink href="/models" icon={Users}>Каталог</NavLink>
            </nav>

            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-lg">
                <Phone className="w-4 h-4 text-primary" />
                <a href={`tel:${settings.phone}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {settings.phone}
                </a>
              </div>
              
              <Button asChild
                size="sm"
                variant="default"
                className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                <a href={`https://t.me/${settings.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                  <Send className="w-4 h-4 mr-2" />
                  Связаться
                </a>
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="lg:hidden w-12 h-12 rounded-lg hover:bg-muted"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <Card className="fixed top-20 right-4 left-4 mx-auto max-w-sm bg-background border shadow-lg">
            <CardContent className="p-6">
              <nav className="space-y-4">
                <MobileNavLink href="/" icon={Home} onClick={() => setMobileMenuOpen(false)}>
                  Главная
                </MobileNavLink>
                <MobileNavLink href="/models" icon={Users} onClick={() => setMobileMenuOpen(false)}>
                  Каталог
                </MobileNavLink>
                <MobileNavLink href="#services" icon={Briefcase} onClick={() => setMobileMenuOpen(false)}>
                  Услуги
                </MobileNavLink>
                <MobileNavLink href="#contacts" icon={MessageSquare} onClick={() => setMobileMenuOpen(false)}>
                  Контакты
                </MobileNavLink>
              </nav>
              
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <a href={`tel:${settings.phone}`} className="font-medium text-foreground hover:text-primary transition-colors">
                      {settings.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <a href={`https://t.me/${settings.telegram.replace('@', '')}`} className="font-medium text-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                      {settings.telegram}
                    </a>
                  </div>
                </div>
                
                <Button asChild
                  className="w-full mt-4" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <a href={`https://t.me/${settings.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                    <Send className="w-4 h-4 mr-2" />
                    Связаться
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

function NavLink({ href, children, icon: Icon }: { 
  href: string; 
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <Link 
      href={href} 
      onClick={handleClick}
      className="flex items-center gap-2 text-foreground/80 hover:text-foreground font-medium text-sm lg:text-base transition-colors duration-200 relative group"
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></div>
    </Link>
  )
}

function MobileNavLink({ href, children, icon: Icon, onClick }: { 
  href: string; 
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    onClick()
  }

  return (
    <Link 
      href={href} 
      onClick={handleClick}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
    >
      {Icon && <Icon className="w-5 h-5 text-primary" />}
      <span className="font-medium">{children}</span>
    </Link>
  )
}
