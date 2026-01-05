import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  Route as RouteIcon,
  Server,
  Shield,
  Sparkles,
  Waves,
  Zap,
} from 'lucide-react'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/app/login' })
  },
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"></div>
  )
}
