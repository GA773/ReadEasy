/**
 * Robust English syllable counter based on standard phonetic heuristic algorithms
 * with exception dictionary for irregular English words.
 */

// Common irregular words where heuristic rules deviate
const IRREGULAR_WORDS: Record<string, number> = {
  // 1 syllable
  smile: 1,
  coupe: 1,
  queue: 1,
  aisle: 1,
  guile: 1,
  blues: 1,
  shoes: 1,
  rhythm: 2,
  prism: 2,
  chasm: 2,
  spasm: 2,

  // 2 syllables
  business: 2,
  every: 2,
  evening: 2,
  family: 2,
  camera: 2,
  chocolate: 2,
  wednesday: 2,
  general: 2,
  several: 2,
  natural: 2,
  average: 2,
  different: 2,
  memory: 2,
  miniature: 3,

  // 3 syllables
  interesting: 3,
  comfortable: 3,
  vegetable: 3,
  temperature: 3,
  literature: 3,
  history: 2,
  mystery: 2,
  favourite: 2,
  favorite: 2,
  separate: 3,
  generous: 2,
  dangerous: 3,

  // 4 syllables
  university: 5,
  simultaneously: 5,
  specifically: 4,
};

/**
 * Counts syllables in a single English word.
 */
export function countSyllables(rawWord: string): number {
  if (!rawWord) return 0;

  // Clean word: lowercase, remove non-alpha characters
  const word = rawWord.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;

  // Short words (1-2 characters) are almost always 1 syllable
  if (word.length <= 2) return 1;

  // Check irregular dictionary
  if (IRREGULAR_WORDS[word]) {
    return IRREGULAR_WORDS[word];
  }

  // Pre-process common prefixes and suffixes
  let processed = word;

  // Handle special consonant-le ending (e.g., table, little, apple, bottle)
  // If word ends in [consonant]le and has previous letters, it adds a syllable
  let endsWithCle = false;
  if (/[bcdfghjklmnpqrstvwxyz]le$/.test(processed) && processed.length > 3) {
    endsWithCle = true;
    processed = processed.slice(0, -2);
  }

  // Handle silent 'e' at end (e.g. tape, life, bike) - but avoid 'ee' like tree, free
  if (processed.endsWith('e') && !processed.endsWith('ee') && processed.length > 2) {
    // If preceded by vowel, could be part of diphthong or silent
    processed = processed.slice(0, -1);
  }

  // Handle regular past tense '-ed' (e.g. jumped, walked, played)
  // Usually silent unless preceded by 't' or 'd' (wanted, needed)
  if (processed.endsWith('ed') && processed.length > 3) {
    const charBeforeEd = processed.charAt(processed.length - 3);
    if (charBeforeEd !== 't' && charBeforeEd !== 'd') {
      processed = processed.slice(0, -2);
    }
  }

  // Handle plural '-es' (e.g. watches, boxes, classes vs likes, cakes)
  // Syllabic only after sibilants: s, z, x, ch, sh
  if (processed.endsWith('es') && processed.length > 3) {
    const charBeforeEs = processed.charAt(processed.length - 3);
    const twoCharsBefore = processed.slice(-4, -2);
    if (!['s', 'z', 'x'].includes(charBeforeEs) && twoCharsBefore !== 'ch' && twoCharsBefore !== 'sh') {
      processed = processed.slice(0, -1);
    }
  }

  // Count vowel groupings (a, e, i, o, u, y)
  // Treat consecutive vowels as single sounds, except diphthong separations
  const vowelMatches = processed.match(/[aeiouy]+/g);
  let count = vowelMatches ? vowelMatches.length : 0;

  // Handle diphthongs that split into two syllables (e.g., 'create', 'chaos', 'radio', 'diet', 'fluid')
  const hiatusMatches = processed.match(/(?:[aeo]u|[iaeo]o|[ae]i|io|ua|eo|ia)/g);
  if (hiatusMatches) {
    // Certain hiatus patterns like 'io' in 'radio' or 'ia' in 'media'
    const extraSyllables = (processed.match(/([bcdfghjklmnprstvwxyz][iaoe]o|[bcdfghjklmnprstvwxyz]ia)/g) || []).length;
    count += extraSyllables;
  }

  if (endsWithCle) {
    count += 1;
  }

  // Every spoken word has at least 1 syllable
  return Math.max(1, count);
}

/**
 * Counts total syllables across an array of words
 */
export function countTotalSyllables(words: string[]): number {
  return words.reduce((total, word) => total + countSyllables(word), 0);
}
