import Nav from './components/Nav'
import Hero from './components/Hero'
import BreachReport from './components/BreachReport'
import Token from './components/Token'
import Insurance from './components/Insurance'
import Merch from './components/Merch'
import Conspiracy from './components/Conspiracy'
import EmailCapture from './components/EmailCapture'
import Roadmap from './components/Roadmap'
import Footer from './components/Footer'
import { useDailyContent } from './hooks/useDailyContent'

export default function App() {
  const { content, loading } = useDailyContent()

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <Hero content={content} />
      <BreachReport content={content} />
      <Token />
      <Insurance />
      <Merch content={content} />
      <Conspiracy content={content} />
      <EmailCapture />
      <Roadmap />
      <Footer />
    </div>
  )
}
