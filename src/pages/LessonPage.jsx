import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LESSONS, ALPHABET, getLessonLetters } from '../data/lessons'
import './LessonPage.css'

// -- helpers -----------------------------------------------------------------

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Build a set of 4 choices for a letter:
 *   - 1 correct answer
 *   - 3 distractors drawn from the full alphabet (different roman value)
 */
function buildChoices(lesson, correct) {
  const distractors = shuffle(
    getLessonLetters(lesson).filter((l) => l.roman !== correct.roman),
  ).slice(0, 3)

  return shuffle([correct, ...distractors])
}

function buildQueue(lesson) {
  return shuffle(getLessonLetters(lesson)).map((letter) => ({
    letter,
    choices: buildChoices(lesson, letter),
  }))
}

// -- component ----------------------------------------------------------------

const STATUS = { IDLE: 'idle', CORRECT: 'correct', WRONG: 'wrong' }

export default function LessonPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()

  const lesson = LESSONS.find((l) => l.id === lessonId)

  const [queue, setQueue] = useState(() => (lesson ? buildQueue(lesson) : []))
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState(STATUS.IDLE)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const current = queue[index]

  const handleChoice = useCallback(
    (choice) => {
      if (status !== STATUS.IDLE) return

      const isCorrect = choice.roman === current.letter.roman
      setSelected(choice)
      setStatus(isCorrect ? STATUS.CORRECT : STATUS.WRONG)
      if (isCorrect) setScore((s) => s + 1)
    },
    [status, current],
  )

  const handleNext = useCallback(() => {
    if (index + 1 >= queue.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
      setStatus(STATUS.IDLE)
      setSelected(null)
    }
  }, [index, queue.length])

  const handleRestart = useCallback(() => {
    setQueue(buildQueue(lesson))
    setIndex(0)
    setScore(0)
    setStatus(STATUS.IDLE)
    setSelected(null)
    setDone(false)
  }, [lesson])

  if (!lesson) {
    return (
      <div className="lesson-page">
        <p>Lesson not found.</p>
        <button onClick={() => navigate('/')}>← Back</button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="lesson-page lesson-done">
        <h2>Lesson complete!</h2>
        <p className="final-score">
          {score} / {queue.length} correct
        </p>
        <div className="done-actions">
          <button className="btn btn-primary" onClick={handleRestart}>
            Try again
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            ← All lessons
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="lesson-page">
      {/* top bar */}
      <div className="lesson-topbar">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Lessons
        </button>
        <span className="progress-label">
          {index + 1} / {queue.length}
        </span>
        <span className="score-label">Score: {score}</span>
      </div>

      {/* progress bar */}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${(index / queue.length) * 100}%` }}
        />
      </div>

      {/* card */}
      <div className="card">
        <div className="persian-letter">{current.letter.persian}</div>
        <p className="card-prompt">What is the romanisation of this letter?</p>
      </div>

      {/* choices */}
      <div className="choices">
        {current.choices.map((choice) => {
          let cls = 'choice-btn'
          if (status !== STATUS.IDLE) {
            if (choice.roman === current.letter.roman) cls += ' correct'
            else if (choice === selected) cls += ' wrong'
          }
          return (
            <button
              key={choice.persian + choice.roman}
              className={cls}
              onClick={() => handleChoice(choice)}
              disabled={status !== STATUS.IDLE}
            >
              {choice.roman}
            </button>
          )
        })}
      </div>

      {/* feedback + next */}
      {status !== STATUS.IDLE && (
        <div className={`feedback ${status}`}>
          {status === STATUS.CORRECT ? '✓ Correct!' : `✗ It was "${current.letter.roman}"`}
          <button className="btn btn-primary next-btn" onClick={handleNext}>
            {index + 1 < queue.length ? 'Next →' : 'See results'}
          </button>
        </div>
      )}
    </div>
  )
}
