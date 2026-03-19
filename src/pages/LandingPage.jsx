import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LESSONS } from '../data/lessons.ts'
import './LandingPage.css'

const TAB_LABELS = {
  letter: 'Letters',
  word: 'Words',
  translation: 'Vocabulary',
}

export default function LandingPage() {
  const navigate = useNavigate()

  // Derive available tabs in the order they first appear in LESSONS
  const availableTabs = [...new Set(LESSONS.map((l) => l.lesson_type))]

  const [activeTab, setActiveTab] = useState(availableTabs[0])
  const [selectedByTab, setSelectedByTab] = useState({})

  const selectedIds = new Set(selectedByTab[activeTab] ?? [])
  const visibleLessons = LESSONS.filter((l) => l.lesson_type === activeTab)

  function toggleLesson(id) {
    setSelectedByTab((prev) => {
      const current = new Set(prev[activeTab] ?? [])
      current.has(id) ? current.delete(id) : current.add(id)
      return { ...prev, [activeTab]: [...current] }
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
        {/* tabs */}
        {availableTabs.length > 1 && (
          <div className="lesson-tabs" role="tablist">
            {availableTabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={tab === activeTab}
                className={`lesson-tab${tab === activeTab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
        )}

        <h2 className="lessons-heading">Choose one or more lessons</h2>
        <ul className="lesson-list">
          {visibleLessons.map((lesson) => {
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
