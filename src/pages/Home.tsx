import { Hero } from '../sections/Hero'
import { usePageTitle } from '../lib/usePageTitle'

export default function Home() {
  usePageTitle()
  return (
    <>
      <Hero />
    </>
  )
}
