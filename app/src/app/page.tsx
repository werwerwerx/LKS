import Header from "@/components/header"
import HeroSectionContainer from "@/components/hero-section"
import HowToOrder from "@/components/how-to-order"
import WhatIsModeling from "@/components/what-is-modeling"
import PerfectChoice from "@/components/perfect-choice"
import OurServices from "@/components/our-services"
import Advantages from "@/components/advantages"
import EliteChoice from "@/components/elite-choice"
import ServicesDescription from "@/components/services-description"
import ContactForm from "@/components/contact-form"
import Footer from "@/components/footer"
import Image from "next/image"
import { getSiteSettings } from "@/lib/get-site-settings"

export const revalidate = 300 // Ревалидация каждые 5 минут вместо часа

export async function generateMetadata() {
  const settings = await getSiteSettings()

  return {
    title: settings.home_title,
    description: settings.hero_description,
    keywords: "модельное агентство, премиум модели, профессиональные модели, К.Л.С.",
    openGraph: {
      title: settings.home_title,
      description: settings.hero_description,
      type: "website",
    },
  }
}

export default async function Home() {
  const settings = await getSiteSettings()
  return (
    <main>

      <div className="bg-background">
        <HeroSectionContainer settings={settings} />
      </div>
      <div className="bg-muted/20 py-8 md:py-16 lg:py-20">
        <WhatIsModeling />
      </div>
      <div className="bg-background py-8 md:py-16 lg:py-20">
        <HowToOrder />
      </div>

        {/* <div className="absolute top-5/12 md:top-4/12 lg:top-1/4 -translate-y-1/2 right-0  opacity-50 lg:opacity-100 lg:right-[15vw] w-[292px] h-[488px] md:w-[392px] md:h-[588px] pointer-events-none ">
        <Image 
          src="/imgs/goddamn-girl.png" 
          alt="Our Services" 
          fill
          quality={100}
          loading="lazy"
          className="object-cover object-center lg:z-30"
        />
      </div> */}

        <div className="bg-muted/20 py-8 md:py-16 lg:py-20">
          <PerfectChoice settings={settings} />
        </div>
                 <div id="services" className="bg-background py-8 md:py-16 lg:py-20">
            <OurServices />
          </div>

      <div className="bg-muted/20 py-8 md:py-16 lg:py-20">
        <Advantages />
      </div>
      <div className="bg-background py-8 md:py-16 lg:py-20">
        <EliteChoice />
      </div>
             <div id="contacts" className="bg-muted/20 py-8 md:py-16 lg:py-20">
          <ContactForm settings={settings} />
        </div>
      <Footer settings={settings} />
    </main>
  )
}

