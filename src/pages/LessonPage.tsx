import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  LESSONS, Lesson, LessonItem, TranslationLessonItem,
  getLessonLetters, isTranslationLesson,
} from '../data/lessons'
import './LessonPage.css'

// -- helpers -----------------------------------------------------------------

type Direction = 'en-to-fa' | 'fa-to-en'

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** The value used to determine correctness for a given direction. */
function answerKey(item: LessonItem, direction: Direction): string {
  if (direction === 'fa-to-en' && 'english' in item)
    return (item as TranslationLessonItem).english
  if (direction === 'en-to-fa')
    return item.persian
  return item.roman
}

function buildChoices(lessons: Lesson[], correct: LessonItem, direction: Direction) {
  const allItems = lessons.flatMap((l) => getLessonLetters(l))
  const correctKey = answerKey(correct, direction)
  const distractors = shuffle(
    allItems.filter((l) => answerKey(l, direction) !== correctKey),
  ).slice(0, 3)
  return shuffle([correct, ...distractors])
}

function buildQueue(lessons: Lesson[], direction: Direction) {
  return shuffle(lessons.flatMap((l) => getLessonLetters(l))).map((letter) => ({
    letter,
    choices: buildChoices(lessons, letter, direction),
  }))
}

// -- component ----------------------------------------------------------------

const STATUS = { IDLE: 'idle', CORRECT: 'correct', WRONG: 'wrong' }

export default function LessonPage() {
  const { lessonIds } = useParams()
  const navigate = useNavigate()

  const ids = lessonIds ? lessonIds.split(',') : []
  const lessons = LESSONS.filter((l) => ids.includes(l.id))
  const isTranslationMode = lessons.length > 0 && lessons.every(isTranslationLesson)

  const [direction, setDirection] = useState<Direction>('en-to-fa')
  const [queue, setQueue] = useState(() =>
    lessons.length > 0 ? buildQueue(lessons, 'en-to-fa') : [],
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

      const isCorrect = answerKey(choice, direction) === answerKey(current.letter, direction)
      setSelected(choice)
      setStatus(isCorrect ? STATUS.CORRECT : STATUS.WRONG)
      if (isCorrect) {
        setScore((s) => s + 1)
      } else {
        setFailedOn((f) => [...f, current.letter])
      }
    },
    [status, current, direction],
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
      choices: buildChoices(lessons, letter, direction),
    })))
    setIndex(0)
    setScore(0)
    setStatus(STATUS.IDLE)
    setSelected(null)
    setDone(false)
    setFailedOn([])
  }, [lessons, direction, selected, status])

  const handleRestart = useCallback(() => {
    setQueue(buildQueue(lessons, direction))
    setIndex(0)
    setScore(0)
    setStatus(STATUS.IDLE)
    setSelected(null)
    setDone(false)
    setFailedOn([])
  }, [lessons, direction])

  // Rebuild queue when direction changes -------------------------------------
  useEffect(() => {
    if (lessons.length === 0) return
    setQueue(buildQueue(lessons, direction))
    setIndex(0)
    setScore(0)
    setStatus(STATUS.IDLE)
    setSelected(null)
    setDone(false)
    setFailedOn([])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction])
  // -------------------------------------------------------------------------

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

      {/* direction toggle (TranslationLesson only) */}
      {isTranslationMode && (
        <div className="direction-toggle">
          <button
            className={direction === 'en-to-fa' ? 'active' : ''}
            onClick={() => setDirection('en-to-fa')}
          >
            English → فارسی
          </button>
          <button
            className={direction === 'fa-to-en' ? 'active' : ''}
            onClick={() => setDirection('fa-to-en')}
          >
            فارسی → English
          </button>
        </div>
      )}

      {/* card */}
      <div className="card">
        {direction === 'fa-to-en' ? (
          <>
            <div className="persian-letter">{current.letter.persian}</div>
            <div className="card-roman">{current.letter.roman}</div>
          </>
        ) : isTranslationMode ? (
          <div className="card-english">
            {'english' in current.letter
              ? (current.letter as TranslationLessonItem).english
              : current.letter.persian}
          </div>
        ) : (
          <div className="persian-letter">{current.letter.persian}</div>
        )}
        <p className="card-prompt">{lessons[0].question_prompt}</p>
      </div>

      {/* choices */}
      <div className="choices">
        {current.choices.map((choice) => {
          const choiceKey = answerKey(choice, direction)
          const correctKey = answerKey(current.letter, direction)
          let cls = 'choice-btn'
          if (status !== STATUS.IDLE) {
            if (choiceKey === correctKey) cls += ' correct'
            else if (choice === selected) cls += ' wrong'
          }
          const label = direction === 'fa-to-en' && 'english' in choice
            ? (choice as TranslationLessonItem).english
            : direction === 'en-to-fa' && isTranslationMode
              ? <><span className="choice-persian">{choice.persian}</span><span className="choice-roman">{choice.roman}</span></>
              : choice.roman
          return (
            <button
              key={choice.persian + choice.roman}
              className={cls}
              onClick={() => handleChoice(choice)}
              disabled={status !== STATUS.IDLE}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* feedback + next */}
      {status !== STATUS.IDLE && (() => {
        const correctItem = current.letter
        const correctLabel = direction === 'fa-to-en' && 'english' in correctItem
          ? (correctItem as TranslationLessonItem).english
          : direction === 'en-to-fa' && isTranslationMode
            ? `${correctItem.persian} (${correctItem.roman})`
            : correctItem.roman
        return (
          <div className={`feedback ${status}`}>
            <span>{status === STATUS.CORRECT ? '✓ Correct!' : `✗ It was "${correctLabel}"`}</span>
            <button className="btn btn-primary next-btn" onClick={handleNext}>
              {index + 1 < queue.length ? 'Skip →' : 'See results'}
            </button>
            <div className="auto-advance-bar" />
          </div>
        )
      })()}
    </div>
  )
}
