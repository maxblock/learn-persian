import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LESSONS } from '../data/lessons.ts'
import './LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()
  const [selectedIds, setSelectedIds] = useState(new Set())

  function toggleLesson(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleStart() {
    if (selectedIds.size === 0) return
    navigate(`/lesson/${[...selectedIds].join(',')}`)
  }

  return (
    <div className="landing">
      <header className="landing-header">
        <h1>یاد بگیر فارسی</h1>
        <p className="landing-subtitle">Learn Persian</p>
      </header>

      <main>
        <h2 className="lessons-heading">Choose one or more lessons</h2>
        <ul className="lesson-list">
          {LESSONS.map((lesson) => {
            const isSelected = selectedIds.has(lesson.id)
            return (
              <li key={lesson.id}>
                <button
                  className={`lesson-card${isSelected ? ' selected' : ''}`}
                  onClick={() => toggleLesson(lesson.id)}
                  aria-pressed={isSelected}
                >
                  <span className="lesson-title">{lesson.title}</span>
                  <span className="lesson-description">{lesson.description}</span>
                </button>
              </li>
            )
          })}
        </ul>

        {selectedIds.size > 0 && (
          <div className="start-bar">
            <button className="start-btn" onClick={handleStart}>
              Start ({selectedIds.size} lesson{selectedIds.size > 1 ? 's' : ''})
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
