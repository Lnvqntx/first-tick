import { Hero } from '../sections/Hero'
import { About } from '../sections/About'
import { WhyJoin } from '../sections/WhyJoin'
import { Schedule } from '../sections/Schedule'
import { Certificates } from '../sections/Certificates'
import { Faq } from '../sections/Faq'
import { Closing } from '../sections/Closing'
import { usePageTitle } from '../lib/usePageTitle'

export default function Home() {
  usePageTitle()
  return (
    <>
      <Hero />
      <About />
      <WhyJoin />
      <Schedule />
      {/* Register section is added with the form */}
      <Certificates />
      <Faq />
      <Closing />
    </>
  )
}
