import Image from "next/image"
import { Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SiteSettings } from "@/lib/get-site-settings"
import Link from "next/link"

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  settings: SiteSettings
}

export default function HeroSection({ settings, className, ...props }: HeroSectionProps) {

  return (
    <HeroSectionContainer>

      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-start relative" style={{ zIndex: 2 }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-primary rounded-lg p-3 lg:p-4">
            <Crown className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
        К.Л.С. - зона вашего комфорта.
        </h1>

        <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground font-normal mb-8">
          Исполним любое желание.
        </p>

        <Link
          href="/models"
          className="text-base lg:text-lg px-8 py-4 lg:px-10 lg:py-5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300 bg-primary text-primary-foreground"
        >
          ВЫБРАТЬ МОДЕЛЬ
        </Link>

        <p className="mt-12 text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl font-normal">
          {settings.hero_description}
        </p>
      </div>

      <HeroSectionBgImage />
    </HeroSectionContainer>
  )
}

function HeroSectionBgImage() {
  return (
    <div className="w-full lg:w-2/3 relative aspect-[4/3] lg:aspect-[3/4] max-h-[600px]" style={{ zIndex: 2 }}>
      <Image
        src="/imgs/hot-background.png"
        alt="Professional Model"
        fill
        className="object-cover rounded-2xl shadow-xl"
        priority
        quality={100}
      />
    </div>
  )
}

function HeroSectionContainer({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "w-full pt-32 pb-20 lg:pt-40 lg:pb-24",
        className
      )}
      {...props}
    >
      <div className="flex w-full flex-col lg:flex-row items-start gap-12 lg:gap-16 container px-6 mx-auto relative">
        {children}
      </div>
    </section>
  )
}
