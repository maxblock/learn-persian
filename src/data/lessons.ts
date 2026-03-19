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

export type LessonType = 'letter' | 'word' | 'translation'

export interface LessonItem {
  persian: string
  roman: string
  name?: string
}

export interface TranslationLessonItem extends LessonItem {
  english: string
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
  lesson_type: LessonType
}

export class LetterLesson implements Lesson {
  id: string
  title: string
  description: string
  items: LessonItem[]
  question_prompt: string
  lesson_type: LessonType = 'letter'

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
  lesson_type: LessonType = 'word'

  constructor({ id, title, description, items, question_prompt }: { id: string; title: string; description: string; items: LessonItem[]; question_prompt?: string }) {
    this.id = id
    this.title = title
    this.description = description
    this.items = items
    this.question_prompt = question_prompt ?? 'What is this word?'
  }
}

export class TranslationLesson implements Lesson {
  id: string
  title: string
  description: string
  items: TranslationLessonItem[]
  question_prompt: string
  lesson_type: LessonType = 'translation'

  constructor({ id, title, description, items, question_prompt }: { id: string; title: string; description: string; items: TranslationLessonItem[]; question_prompt?: string }) {
    this.id = id
    this.title = title
    this.description = description
    this.items = items
    this.question_prompt = question_prompt ?? 'Translate'
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
    title: 'Numbers 0–10',
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
      { persian: '9', roman: 'noh', name: 'nine' },
      { persian: '10', roman: 'dah', name: 'ten' },
    ],
  }),

  new WordLesson({
    id: 'numbers2',
    title: 'Numbers 11–20',
    description: 'yāzdah · dāzdah · ...',
    question_prompt: 'What is the romanisation of this number?',
    items: [
      { persian: '11', roman: 'yāzdah', name: 'eleven' },
      { persian: '12', roman: 'dāzdah', name: 'twelve' },
      { persian: '13', roman: 'sizdah', name: 'thirteen' },
      { persian: '14', roman: 'chahārdah', name: 'fourteen' },
      { persian: '15', roman: 'pānzdah', name: 'fifteen' },
      { persian: '16', roman: 'shānzdah', name: 'sixteen' },
      { persian: '17', roman: 'hēfdah', name: 'seventeen' },
      { persian: '18', roman: 'hējdah', name: 'eighteen' },
      { persian: '19', roman: 'nūzdah', name: 'nineteen' },
      { persian: '20', roman: 'bist', name: 'twenty' },
    ],
  }),

  new WordLesson({
    id: 'numbers3',
    title: 'Numbers 21–30',
    description: 'bist o yek · bist o do · ...',
    question_prompt: 'What is the romanisation of this number?',
    items: [
      { persian: '21', roman: 'bist o yek', name: 'twenty-one' },
      { persian: '22', roman: 'bist o do', name: 'twenty-two' },
      { persian: '23', roman: 'bist o se', name: 'twenty-three' },
      { persian: '24', roman: 'bist o chahār', name: 'twenty-four' },
      { persian: '25', roman: 'bist o pān', name: 'twenty-five' },
      { persian: '26', roman: 'bist o shesh', name: 'twenty-six' },
      { persian: '27', roman: 'bist o haft', name: 'twenty-seven' },
      { persian: '28', roman: 'bist o hasht', name: 'twenty-eight' },
      { persian: '29', roman: 'bist o noh', name: 'twenty-nine' },
      { persian: '30', roman: 'sī', name: 'thirty' },
    ],
  }),

  new TranslationLesson({
    id: 'greetings',
    title: 'Basic Greetings',
    description: 'Common phrases for saying hello and goodbye.',
    items: [
      { persian: 'سلام', roman: 'salām', english: 'Hello' },
      { persian: 'خداحافظ', roman: 'khodāhāfez', english: 'Goodbye' },
      { persian: 'صبح بخیر', roman: 'sobh bekheir', english: 'Good morning' },
      { persian: 'شب بخیر', roman: 'shab bekheir', english: 'Good night' },
      { persian: 'خوش آمدید', roman: 'khosh āmadid', english: 'Welcome' },
      { persian: 'حال شما چطور است؟', roman: 'hāl-e shomā chetor ast?', english: 'How are you?' },
      { persian: 'خوبم، ممنون', roman: 'khobam, mamnoon', english: 'I\'m good, thanks' },
      { persian: 'اسم شما چیست؟', roman: 'esm-e shomā chist?', english: 'What is your name?' },
      { persian: 'اسم من ... است', roman: 'esm-e man ... ast', english: 'My name is ...' },
    ],
  }),

  new TranslationLesson({
    id: 'colors',
    title: 'Colors',
    description: 'Common phrases for colors.',
    items: [
      { persian: 'قرمز', roman: 'ghermez', english: 'Red' },
      { persian: 'آبی', roman: 'ābi', english: 'Blue' },
      { persian: 'سبز', roman: 'sabz', english: 'Green' },
      { persian: 'زرد', roman: 'zard', english: 'Yellow' },
      { persian: 'نارنجی', roman: 'nārenji', english: 'Orange' },
      { persian: 'بنفش', roman: 'banafsh', english: 'Purple' },
      { persian: 'صورتی', roman: 'surati', english: 'Pink' },
      { persian: 'قهوه‌ای', roman: 'qahvei', english: 'Brown' },
      { persian: 'سیاه', roman: 'siyah', english: 'Black' },
      { persian: 'سفید', roman: 'sefid', english: 'White' },
    ],
  }),

  new TranslationLesson({
    id: 'food',
    title: 'Food',
    description: 'Common phrases for food.',
    items: [
      { persian: 'سیب', roman: 'sib', english: 'Apple' },
      { persian: 'نان', roman: 'nān', english: 'Bread' },
      { persian: 'پنیر', roman: 'panir', english: 'Cheese' },
      { persian: 'گوشت', roman: 'gusht', english: 'Meat' },
      { persian: 'ماست', roman: 'māst', english: 'Yogurt' },
      { persian: 'برنج', roman: 'berenj', english: 'Rice' },
      { persian: 'سیب‌زمینی', roman: 'sibzamini', english: 'Potato' },
      { persian: 'هویج', roman: 'havij', english: 'Carrot' },
      { persian: 'گوجه‌فرنگی', roman: 'goje farangi', english: 'Tomato' },
      { persian: 'سفید', roman: 'sefid', english: 'White' },
      { persian: 'ماهی', roman: 'māhi', english: 'Fish' },
      { persian: 'مرغ', roman: 'morgh', english: 'Chicken' },
      { persian: 'تخم‌مرغ', roman: 'tokhm-e morgh', english: 'Egg' },
    ],
  }),

  new TranslationLesson({
    id: 'body-parts',
    title: 'Body Parts',
    description: 'Common phrases for body parts.',
    items: [
     { persian: 'سر', roman: 'sar', english: 'Head' },
      { persian: 'مو', roman: 'mu', english: 'Hair' },
      { persian: 'چشم', roman: 'cheshm', english: 'Eye' },
      { persian: 'چشمان', roman: 'cheshmān', english: 'Eyes' },
      { persian: 'ابرو', roman: 'abru', english: 'Eyebrow' },
      { persian: 'مژه', roman: 'mozhe', english: 'Eyelash' },
      { persian: 'لب', roman: 'lab', english: 'Lip' },
      { persian: 'لب‌ها', roman: 'labhā', english: 'Lips' },
      { persian: 'دهان', roman: 'dahān', english: 'Mouth' },
      { persian: 'دندان', roman: 'dandān', english: 'Tooth' },
      { persian: 'زبان', roman: 'zabān', english: 'Tongue' },
      { persian: 'گونه', roman: 'guneh', english: 'Cheek' },
      { persian: 'بینی', roman: 'bini', english: 'Nose' },
      { persian: 'گوش', roman: 'gush', english: 'Ear' },
      { persian: 'گردن', roman: 'gardan', english: 'Neck' },
      { persian: 'قلب', roman: 'qalb', english: 'Heart' },
      { persian: 'دست', roman: 'dast', english: 'Hand' },
      { persian: 'انگشت', roman: 'angosht', english: 'Finger' },
      { persian: 'پا', roman: 'pā', english: 'Foot' },
      { persian: 'زانو', roman: 'zānu', english: 'Knee' },
      { persian: 'شانه', roman: 'shāneh', english: 'Shoulder' },
      { persian: 'بازو', roman: 'bāzu', english: 'Arm' },
      { persian: 'سینه', roman: 'sineh', english: 'Chest' },
      { persian: 'پشت', roman: 'posht', english: 'Back' },
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

/** Type guard: is this a TranslationLesson? */
export function isTranslationLesson(lesson: Lesson): lesson is TranslationLesson {
  return lesson instanceof TranslationLesson
}
