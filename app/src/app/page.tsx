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

export default function Home() {
  return (
    <main>
      <Header />
      <div className="bg-background">
        <HeroSectionContainer />
      </div>
      <div className="bg-muted/20">
        <WhatIsModeling />
      </div>
      <div className="bg-background">
        <HowToOrder />
      </div>
      <div className="relative">

      {/* Background Image */}
      <div className="absolute top-5/12 md:top-4/12 lg:top-1/4 -translate-y-1/2 right-0  opacity-50 lg:opacity-100 lg:right-[15vw] w-[292px] h-[488px] md:w-[392px] md:h-[588px] pointer-events-none ">
        <Image 
          src="/imgs/goddamn-girl.png" 
          alt="Our Services" 
          fill
          quality={100}
          loading="lazy"
          className="object-cover object-center lg:z-30"
        />
      </div>

      <div className="bg-muted/20 mb-60 md:mb-40 lg:mb-20">
        <PerfectChoice />
      </div>
      <div className="bg-background">
        <OurServices />
      </div>

      </div>
      <div className="bg-muted/20">
        <Advantages />
      </div>
      <div className="bg-background">
        <EliteChoice />
      </div>
      {/* <div className="bg-muted/20">
        <ServicesDescription />
      </div> */}
      <div className="bg-background">
        <ContactForm />
      </div>
      <Footer />
    </main>
  )
}

