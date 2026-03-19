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

export const LESSONS = [
  {
    id: 'lesson-1',
    title: 'ا ب پ ت ث',
    description: 'Alef · Be · Pe · Te · Se',
    letterKeys: ['ا', 'ب', 'پ', 'ت', 'ث'],
  },
  {
    id: 'lesson-2',
    title: 'ج چ ح خ',
    description: 'Jim · Che · He · Khe',
    letterKeys: ['ج', 'چ', 'ح', 'خ'],
  },
  {
    id: 'lesson-3',
    title: 'د ذ ر ز ژ',
    description: 'Dal · Zal · Re · Ze · Zhe',
    letterKeys: ['د', 'ذ', 'ر', 'ز', 'ژ'],
  },
  {
    id: 'lesson-4',
    title: 'س ش ص ض',
    description: 'Sin · Shin · Sad · Zad',
    letterKeys: ['س', 'ش', 'ص', 'ض'],
  },
  {
    id: 'lesson-5',
    title: 'ط ظ ع غ',
    description: 'Ta · Za · Eyn · Gheyn',
    letterKeys: ['ط', 'ظ', 'ع', 'غ'],
  },
  {
    id: 'lesson-6',
    title: 'ف ق ک گ',
    description: 'Fe · Qaf · Kaf · Gaf',
    letterKeys: ['ف', 'ق', 'ک', 'گ'],
  },
  {
    id: 'lesson-7',
    title: 'ل م ن و ه ی',
    description: 'Lam · Mim · Nun · Vav · He · Ye',
    letterKeys: ['ل', 'م', 'ن', 'و', 'ه', 'ی'],
  },
]

/** Return the full letter object for a given Persian character. */
export function getLetter(persian) {
  return ALPHABET.find((l) => l.persian === persian)
}

/** Return the letters for a given lesson. */
export function getLessonLetters(lesson) {
  return lesson.letterKeys.map(getLetter)
}
