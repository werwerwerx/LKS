import { Phone, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { SiteSettings } from "@/lib/get-site-settings"

interface FooterProps {
  settings: SiteSettings
}

export default function Footer({ settings }: FooterProps) {

  return (
    <footer className="py-16 lg:py-20 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 lg:gap-12 items-start">
          <div className="space-y-5">
            <div className="flex items-center space-x-4">
              <span className="text-xl lg:text-2xl font-medium">{settings.phone}</span>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full border border-border text-foreground hover:bg-muted w-10 h-10 lg:w-12 lg:h-12"
                asChild
              >
                <a href={`tel:${settings.phone}`}>
                  <Phone className="w-4 h-4 lg:w-5 lg:h-5" />
                </a>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full border border-border text-foreground hover:bg-muted w-10 h-10 lg:w-12 lg:h-12"
                asChild
              >
                <a href={`https://t.me/${settings.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                  <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                </a>
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-foreground rounded-full flex items-center justify-center">
                <span className="text-background font-bold text-xl lg:text-2xl">ЛКС</span>
              </div>
              <div className="text-foreground">
                <div className="font-serif text-2xl lg:text-3xl">Л.К.С</div>
                <div className="font-serif text-lg lg:text-xl">Models</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <nav className="grid grid-cols-2 gap-4 text-sm lg:text-base">
              <Link href="/" className="text-foreground hover:text-muted-foreground transition-colors">
                Главная
              </Link>
              <Link href="/catalog" className="text-foreground hover:text-muted-foreground transition-colors">
                Каталог
              </Link>
            </nav>
          </div>
        </div>

      </div>
    </footer>
  )
}
