import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LessonPage from './pages/LessonPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/lesson/:lessonId" element={<LessonPage />} />
    </Routes>
  )
}
