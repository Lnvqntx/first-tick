import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollProgress } from './ScrollProgress'
import { useScrollReveal } from '../lib/useScrollReveal'
import { useCursorGlow } from '../lib/useCursorGlow'

/** Scrolls to #hash targets after route changes, otherwise to the top. */
function useScrollToHash() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
}

export function Layout() {
  useScrollToHash()
  const { pathname } = useLocation()
  useScrollReveal(pathname)
  useCursorGlow()
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <Header />
      <main id="main" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
