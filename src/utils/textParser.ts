/**
 * Accurate text parser for sentences, words, and paragraphs.
 * Handles English abbreviations, dialog quotations, ellipses, and numbers.
 */

// Common abbreviations that shouldn't trigger sentence splitting
const ABBREVIATIONS = [
  'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'rev', 'gen', 'sen', 'rep',
  'st', 'ave', 'rd', 'blvd', 'dept', 'univ', 'approx', 'est',
  'vs', 'etc', 'eg', 'ie', 'al', 'inc', 'ltd', 'corp', 'co',
  'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec',
  'us', 'uk', 'eu', 'usa', 'un', 'am', 'pm'
];

/**
 * Splits text into sentences safely without breaking on common abbreviations,
 * decimals, or ellipses.
 */
export function splitIntoSentences(text: string): string[] {
  if (!text || !text.trim()) return [];

  // Protect decimals like 3.14 or $1.50
  let cleaned = text.replace(/(\d+)\.(\d+)/g, '$1___DECIMAL___$2');

  // Protect ellipses (both ... and …)
  cleaned = cleaned.replace(/\.{3,}/g, '___ELLIPSIS___');
  cleaned = cleaned.replace(/…/g, '___ELLIPSIS___');

  // Protect abbreviations: check each word followed by period
  const abbrRegex = new RegExp(`\\b(${ABBREVIATIONS.join('|')})\\.`, 'gi');
  cleaned = cleaned.replace(abbrRegex, (_, abbr) => `${abbr}___ABBR___`);

  // Protect single letter initials like "J. K. Rowling" or "U. S."
  cleaned = cleaned.replace(/\b([A-Za-z])\./g, '$1___INITIAL___');

  // Regex to split on sentence terminals (. ! ?) followed by whitespace, quote, or end of string
  // Also preserve dialogue endings: e.g. "Hello!" said Mary.
  const sentencePattern = /([^.!?\n]+(?:[.!?]+["'”’]?|(?:\n{2,}|\n(?=[A-Z"']))|$))/g;
  const matches = cleaned.match(sentencePattern) || [];

  const sentences: string[] = [];

  for (let s of matches) {
    // Restore protected tokens
    s = s
      .replace(/___DECIMAL___/g, '.')
      .replace(/___ELLIPSIS___/g, '...')
      .replace(/___ABBR___/g, '.')
      .replace(/___INITIAL___/g, '.');

    const trimmed = s.trim();
    if (trimmed.length > 0 && /[a-zA-Z0-9]/.test(trimmed)) {
      sentences.push(trimmed);
    }
  }

  // Fallback: if no sentences were matched but text has content
  if (sentences.length === 0 && text.trim().length > 0) {
    sentences.push(text.trim());
  }

  return sentences;
}

/**
 * Extracts words from text or a sentence.
 * Preserves contractions (e.g. "don't", "it's") while removing surrounding punctuation.
 */
export function extractWords(text: string): string[] {
  if (!text) return [];

  // Match sequences of alphanumeric characters and internal apostrophes/hyphens
  const matches = text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || [];
  return matches.map(w => w.trim()).filter(w => w.length > 0);
}

/**
 * Counts paragraphs in raw text.
 */
export function countParagraphs(text: string): number {
  if (!text || !text.trim()) return 0;
  const paras = text.split(/\n\s*\n+/).filter(p => p.trim().length > 0);
  return Math.max(1, paras.length);
}
