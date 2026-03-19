/**
 * Persian alphabet lessons.
 *
 * Each letter has:
 *   persian  – the Persian character
 *   name     – the letter's name
 *   roman    – its standard romanisation (IPA-friendly)
 *
 * Transcriptions are approximate; replace them whenever you have
 * the authoritative values.
 */

export interface LessonItem {
  persian: string
  roman: string
  name?: string
}

export const ALPHABET = [
  { persian: 'ا', name: 'Alef',   roman: 'ā' },
  { persian: 'ب', name: 'Be',     roman: 'b' },
  { persian: 'پ', name: 'Pe',     roman: 'p' },
  { persian: 'ت', name: 'Te',     roman: 't' },
  { persian: 'ث', name: 'Se',     roman: 's' },
  { persian: 'ج', name: 'Jim',    roman: 'j' },
  { persian: 'چ', name: 'Če',    roman: 'tʃ' },
  { persian: 'ح', name: 'He',     roman: 'h' },
  { persian: 'خ', name: 'Xe',    roman: 'x' },
  { persian: 'د', name: 'Dâl',    roman: 'd' },
  { persian: 'ذ', name: 'Zâl',    roman: 'z' },
  { persian: 'ر', name: 'Re',     roman: 'r' },
  { persian: 'ز', name: 'Ze',     roman: 'z' },
  { persian: 'ژ', name: 'Že',    roman: 'ʒ' },
  { persian: 'س', name: 'Sin',    roman: 's' },
  { persian: 'ش', name: 'Šin',   roman: 'ʃ' },
  { persian: 'ص', name: 'Sad',    roman: 's' },
  { persian: 'ض', name: 'Zad',    roman: 'z' },
  { persian: 'ط', name: 'Tâ',     roman: 't' },
  { persian: 'ظ', name: 'Zâ',     roman: 'z' },
  { persian: 'ع', name: 'Eyn',    roman: '\'' },
  { persian: 'غ', name: 'Gheyn',  roman: 'ɣ' },
  { persian: 'ف', name: 'Fe',     roman: 'f' },
  { persian: 'ق', name: 'Qaf',    roman: 'q' },
  { persian: 'ک', name: 'Kaf',    roman: 'k' },
  { persian: 'گ', name: 'Gaf',    roman: 'g' },
  { persian: 'ل', name: 'Lam',    roman: 'l' },
  { persian: 'م', name: 'Mim',    roman: 'm' },
  { persian: 'ن', name: 'Nun',    roman: 'n' },
  { persian: 'و', name: 'Vâv',    roman: 'v' },
  { persian: 'ه', name: 'He',     roman: 'h' },
  { persian: 'ی', name: 'Ye',     roman: 'y' },
]

export interface Lesson {
  id: string
  title: string
  description: string
  items: LessonItem[]
  question_prompt: string
}

export class LetterLesson implements Lesson {
  id: string
  title: string
  description: string
  items: LessonItem[]
  question_prompt: string

  constructor({ id, letterKeys }: { id: string; letterKeys: string[] }) {
    this.id = id
    this.items = letterKeys
      .map(getLetter)
      .filter((l): l is NonNullable<ReturnType<typeof getLetter>> => l !== undefined)
    this.title = this.items.map((l) => l.persian).join(' · ')
    this.description = this.items.map((l) => l.roman).join(' ')
    this.question_prompt = 'What is the romanisation of this letter?'
  }
}

export class WordLesson implements Lesson {
  id: string
  title: string
  description: string
  items: LessonItem[]
  question_prompt: string

  constructor({ id, title, description, items, question_prompt }: { id: string; title: string; description: string; items: LessonItem[]; question_prompt?: string }) {
    this.id = id
    this.title = title
    this.description = description
    this.items = items
    this.question_prompt = question_prompt ?? 'What is this word?'
  }
}

export const LESSONS: Lesson[] = [
  new LetterLesson({
    id: 'lesson-1',
    letterKeys: ['ا', 'ب', 'پ', 'ت', 'ث'],
  }),
  new LetterLesson({
    id: 'lesson-2',
    letterKeys: ['ج', 'چ', 'ح', 'خ'],
  }),
  new LetterLesson({
    id: 'lesson-3',
    letterKeys: ['د', 'ذ', 'ر', 'ز', 'ژ'],
  }),
  new LetterLesson({
    id: 'lesson-4',
    letterKeys: ['س', 'ش', 'ص', 'ض'],
  }),
  new LetterLesson({
    id: 'lesson-5',
    letterKeys: ['ط', 'ظ', 'ع', 'غ'],
  }),
  new LetterLesson({
    id: 'lesson-6',
    letterKeys: ['ف', 'ق', 'ک', 'گ'],
  }),
  new LetterLesson({
    id: 'lesson-7',
    letterKeys: ['ل', 'م', 'ن', 'و', 'ه', 'ی'],
  }),

  new WordLesson({
    id: 'numbers',
    title: 'Numbers 0–9',
    description: 'sefr · yek · do · se · ...',
    question_prompt: 'What is the romanisation of this number?',
    items: [
      { persian: '0', roman: 'sefr', name: 'zero'  },
      { persian: '1', roman: 'yek', name: 'one'   },
      { persian: '2', roman: 'do', name: 'two'   },
      { persian: '3', roman: 'se', name: 'three' },
      { persian: '4', roman: 'chahār', name: 'four'  },
      { persian: '5', roman: 'panj',  name: 'five'  },
      { persian: '6', roman: 'shesh', name: 'six'   },
      { persian: '7', roman: 'haft', name: 'seven' },
      { persian: '8', roman: 'hasht', name: 'eight' },
      { persian: '9', roman: 'noh', name: 'nine'  },
    ],
  }),
]

/** Return the full letter object for a given Persian character. */
export function getLetter(persian: string) {
  return ALPHABET.find((l) => l.persian === persian)
}

/** Return the romanisation alternatives for a given set of lessons. */
export function getRomanAlternativesFromLessons(...lessons: Lesson[]) {
  const letters = lessons.flatMap((lesson) => getLessonLetters(lesson))
  const romanSet = new Set(letters.map((l) => l!.roman))
  return Array.from(romanSet)
}

/** Return the items for a given lesson. */
export function getLessonLetters(lesson: Lesson): LessonItem[] {
  return lesson.items
}
