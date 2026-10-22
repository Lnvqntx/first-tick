import { Hero } from '../sections/Hero'
import { Schedule } from '../sections/Schedule'
import { About } from '../sections/About'
import { Faq } from '../sections/Faq'
import { usePageTitle } from '../lib/usePageTitle'

export default function Home() {
  usePageTitle()
  return (
    <>
      <Hero />
      <Schedule />
      <About />
      <Faq />
    </>
  )
}
