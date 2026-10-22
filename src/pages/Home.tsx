import { Hero } from '../sections/Hero'
import { Schedule } from '../sections/Schedule'
import { Challenge } from '../sections/Challenge'
import { Steps } from '../sections/Steps'
import { Faq } from '../sections/Faq'
import { usePageTitle } from '../lib/usePageTitle'

export default function Home() {
  usePageTitle()
  return (
    <>
      <Hero />
      <Schedule />
      <Challenge />
      <Steps />
      <Faq />
    </>
  )
}
