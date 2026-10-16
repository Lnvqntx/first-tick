import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import Resources from './pages/Resources'
import Verify from './pages/Verify'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="resources" element={<Resources />} />
        <Route path="verify" element={<Verify />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
