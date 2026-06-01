import { HeroSection } from '@/components/sections/HeroSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { Footer } from '@/components/sections/Footer'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <FeaturesSection />
      <Footer />
    </>
  )
}
