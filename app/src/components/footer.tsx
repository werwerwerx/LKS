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
                <span className="text-background font-bold text-xl lg:text-2xl">{settings.logo_short}</span>
              </div>
              <div className="text-foreground">
                <div className="font-serif text-2xl lg:text-3xl">{settings.logo_full_line1}</div>
                <div className="font-serif text-lg lg:text-xl">{settings.logo_full_line2}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <nav className="grid grid-cols-2 gap-4 text-sm lg:text-base">
              <Link href="#community" className="text-foreground hover:text-muted-foreground transition-colors">
                {settings.nav_cooperation}
              </Link>
              <Link href="#models" className="text-foreground hover:text-muted-foreground transition-colors">
                {settings.nav_catalog}
              </Link>
              <Link href="#blog" className="text-foreground hover:text-muted-foreground transition-colors">
                {settings.nav_blog}
              </Link>
              <Link href="#services" className="text-foreground hover:text-muted-foreground transition-colors">
                {settings.nav_services}
              </Link>
              <Link href="#contacts" className="text-foreground hover:text-muted-foreground transition-colors">
                {settings.nav_contacts}
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 lg:mt-16 pt-6 lg:pt-8 border-t border-border text-sm text-muted-foreground">
          <p className="mb-2">{settings.inn}</p>
          <p className="mb-4">{settings.address}</p>
          <div className="flex space-x-4">
            <Link href="#privacy" className="underline hover:text-foreground transition-colors">
              {settings.footer_user_agreement}
            </Link>
            <span>/</span>
            <Link href="#policy" className="underline hover:text-foreground transition-colors">
              {settings.footer_privacy_policy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
