import { Award } from "lucide-react"
import { CircularShadow } from "@/components/ui/circular-shadow"
import type { SiteSettings } from "@/lib/get-site-settings"

interface PerfectChoiceProps {
  settings: SiteSettings
}

export default function PerfectChoice({ settings }: PerfectChoiceProps) {

  return (
    <section className="py-20 lg:py-24 relative overflow-hidden">
      <CircularShadow position="left" size="md" />
      
      <div className="container mx-auto px-6 max-w-7xl relative" style={{ zIndex: 2 }}>
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="w-full lg:w-2/3 order-2 lg:order-1">
            <div className="max-w-4xl text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <div className="bg-primary rounded-lg p-3 lg:p-4">
                  <Award className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8 leading-tight">
                {settings.perfect_choice_title}
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed font-normal">
                {settings.perfect_choice_description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
