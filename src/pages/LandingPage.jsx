import { useNavigate } from 'react-router-dom'
import { LESSONS } from '../data/lessons'
import './LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <header className="landing-header">
        <h1>یاد بگیر فارسی</h1>
        <p className="landing-subtitle">Learn Persian</p>
      </header>

      <main>
        <h2 className="lessons-heading">Choose a lesson</h2>
        <ul className="lesson-list">
          {LESSONS.map((lesson) => (
            <li key={lesson.id}>
              <button
                className="lesson-card"
                onClick={() => navigate(`/lesson/${lesson.id}`)}
              >
                <span className="lesson-title">{lesson.title}</span>
                <span className="lesson-description">{lesson.description}</span>
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
