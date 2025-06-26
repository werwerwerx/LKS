import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
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
      <HeroSection className="mt-10"/>
      <HowToOrder />
      <WhatIsModeling />
      <PerfectChoice />
      <OurServices />
      <Advantages />
      <EliteChoice />
      <ServicesDescription />
      <ContactForm />
      <Footer />
    </main>
  )
}

