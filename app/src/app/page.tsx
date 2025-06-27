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
      <div className="bg-muted/20">
        <PerfectChoice />
      </div>
      <div className="bg-background">
        <OurServices />
      </div>
      <div className="bg-muted/20">
        <Advantages />
      </div>
      <div className="bg-background">
        <EliteChoice />
      </div>
      <div className="bg-muted/20">
        <ServicesDescription />
      </div>
      <div className="bg-background">
        <ContactForm />
      </div>
      <Footer />
    </main>
  )
}

