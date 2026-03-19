import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LESSONS, Lesson, LessonItem, getLessonLetters } from '../data/lessons'
import './LessonPage.css'

// -- helpers -----------------------------------------------------------------

function shuffle<T>(arr: T[]) {
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
 *   - 3 distractors drawn from all selected lessons (different roman value)
 */
function buildChoices(lessons: Lesson[], correct: LessonItem) {
  const allLetters = lessons.flatMap((l) => getLessonLetters(l))
  const distractors = shuffle(
    allLetters.filter((l) => l.roman !== correct.roman),
  ).slice(0, 3)

  return shuffle([correct, ...distractors])
}

// -- component ----------------------------------------------------------------

const STATUS = { IDLE: 'idle', CORRECT: 'correct', WRONG: 'wrong' }

export default function LessonPage() {
  const { lessonIds } = useParams()
  const navigate = useNavigate()

  const ids = lessonIds ? lessonIds.split(',') : []
  const lessons = LESSONS.filter((l) => ids.includes(l.id))

  const [queue, setQueue] = useState(() =>
    lessons.length > 0
      ? shuffle(lessons.flatMap((l) => getLessonLetters(l))).map((letter) => ({
          letter,
          choices: buildChoices(lessons, letter),
        }))
      : [],
  )
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState(STATUS.IDLE)
  const [selected, setSelected] = useState<LessonItem | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [failedOn, setFailedOn] = useState<LessonItem[]>([])

  const current = queue[index]

  const handleChoice = useCallback(
    (choice: LessonItem) => {
      if (status !== STATUS.IDLE) return

      const isCorrect = choice.roman === current.letter.roman
      setSelected(choice)
      setStatus(isCorrect ? STATUS.CORRECT : STATUS.WRONG)
      if (isCorrect) {
        setScore((s) => s + 1)
      } else {
        setFailedOn((f) => [...f, current.letter])
      }
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

  // Auto-advance after 1 s --------------------------------------------------
  const handleNextRef = useRef(handleNext)
  useEffect(() => { handleNextRef.current = handleNext }, [handleNext])

  useEffect(() => {
    if (status === STATUS.IDLE) return
    const id = setTimeout(() => handleNextRef.current(), 500)
    return () => clearTimeout(id)
  }, [status])
  // -------------------------------------------------------------------------

  const handleRetry = useCallback(() => {
    const failed = failedOn.length > 0 ? failedOn : lessons.flatMap((l) => getLessonLetters(l))
    setQueue(shuffle(failed).map((letter) => ({
      letter,
      choices: buildChoices(lessons, letter),
    })))
    setIndex(0)
    setScore(0)
    setStatus(STATUS.IDLE)
    setSelected(null)
    setDone(false)
    setFailedOn([])
  }, [lessons, selected, status])

  const handleRestart = useCallback(() => {
    setQueue(
      shuffle(lessons.flatMap((l) => getLessonLetters(l))).map((letter) => ({
        letter,
        choices: buildChoices(lessons, letter),
      }))
    )
    setIndex(0)
    setScore(0)
    setStatus(STATUS.IDLE)
    setSelected(null)
    setDone(false)
    setFailedOn([])
  }, [lessons])

  if (lessons.length === 0) {
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
          <button className="btn btn-primary" onClick={handleRetry} disabled={failedOn.length === 0}>
            Try failed ones again
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
        <p className="card-prompt">{lessons[0].question_prompt}</p>
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
          <span>{status === STATUS.CORRECT ? '✓ Correct!' : `✗ It was "${current.letter.roman}"`}</span>
          <button className="btn btn-primary next-btn" onClick={handleNext}>
            {index + 1 < queue.length ? 'Skip →' : 'See results'}
          </button>
          <div className="auto-advance-bar" />
        </div>
      )}
    </div>
  )
}
