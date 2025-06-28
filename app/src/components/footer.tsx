import { Phone, Send } from "lucide-react"
import type { SiteSettings } from "@/lib/get-site-settings"

interface FooterProps {
  settings: SiteSettings
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="py-8 lg:py-12 border-t border-border bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          
          {/* Контакты */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <a 
              href={`tel:${settings.phone}`}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm sm:text-base font-medium">{settings.phone}</span>
            </a>
            
            <a 
              href={`https://t.me/${settings.telegram.replace('@', '')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Send className="w-4 h-4" />
              <span className="text-sm sm:text-base font-medium">{settings.telegram}</span>
            </a>
          </div>
          
          {/* Копирайт */}
          <div className="text-center lg:text-right">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} L.K.S. Все права защищены
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  )
}
