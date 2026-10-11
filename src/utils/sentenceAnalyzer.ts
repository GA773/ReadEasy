import { countSyllables } from './syllableCounter';
import { extractWords } from './textParser';
import type { ComplexWordSuggestion, SentenceAnalysis } from '../types/readability';

/**
 * High-value dictionary of complex words and their plain English replacements.
 */
const COMPLEX_WORD_MAP: Record<string, string[]> = {
  accommodate: ['fit', 'hold', 'suit'],
  advantageous: ['helpful', 'useful'],
  alleviate: ['ease', 'lessen', 'relieve'],
  ameliorate: ['improve', 'help', 'better'],
  anticipate: ['expect', 'foresee'],
  approximately: ['about', 'roughly', 'around'],
  ascertain: ['find out', 'learn', 'discover'],
  commence: ['begin', 'start'],
  commenced: ['began', 'started'],
  commencement: ['beginning', 'start'],
  comprehend: ['understand', 'grasp'],
  comprehension: ['understanding'],
  consequently: ['so', 'therefore', 'as a result'],
  constitute: ['make up', 'form'],
  demonstrate: ['show', 'prove'],
  demonstrates: ['shows', 'proves'],
  demonstrated: ['showed', 'proved'],
  demonstration: ['display', 'show'],
  detrimental: ['harmful', 'damaging', 'bad'],
  disseminate: ['spread', 'share', 'circulate'],
  endeavor: ['try', 'attempt'],
  exacerbate: ['worsen', 'aggravate'],
  expedite: ['speed up', 'hurry', 'rush'],
  facilitate: ['help', 'ease', 'make easier'],
  facilitated: ['helped', 'eased'],
  facilitates: ['helps', 'eases'],
  fundamental: ['basic', 'key', 'main'],
  furthermore: ['also', 'besides', 'and'],
  implement: ['carry out', 'start', 'apply'],
  implementation: ['rollout', 'setup', 'launch'],
  inadvertently: ['by accident', 'mistakenly'],
  indicate: ['show', 'point to', 'suggest'],
  indication: ['sign', 'hint', 'clue'],
  initial: ['first', 'early'],
  initiate: ['start', 'begin', 'open'],
  modification: ['change', 'tweak'],
  modify: ['change', 'adjust'],
  necessitate: ['require', 'need'],
  nevertheless: ['still', 'yet', 'however'],
  notwithstanding: ['despite', 'in spite of'],
  numerous: ['many', 'several'],
  objective: ['goal', 'aim', 'target'],
  obligation: ['duty', 'debt', 'promise'],
  optimum: ['best', 'ideal'],
  paramount: ['top', 'chief', 'vital'],
  participate: ['join in', 'take part'],
  prioritize: ['rank', 'put first'],
  procure: ['get', 'buy', 'obtain'],
  prohibit: ['ban', 'forbid'],
  proliferation: ['rapid growth', 'spread'],
  remuneration: ['pay', 'salary', 'wage'],
  requirement: ['rule', 'need'],
  scrutinize: ['inspect', 'examine', 'check'],
  significance: ['meaning', 'importance'],
  substantially: ['greatly', 'much', 'largely'],
  substantial: ['large', 'great', 'solid'],
  subsequently: ['later', 'next', 'afterward'],
  sufficient: ['enough', 'plenty'],
  supplementary: ['extra', 'added'],
  terminate: ['end', 'stop', 'finish'],
  terminated: ['ended', 'stopped'],
  termination: ['end', 'stop'],
  transmit: ['send', 'pass on'],
  ubiquitous: ['everywhere', 'common'],
  unprecedented: ['new', 'novel', 'unheard of'],
  utilize: ['use'],
  utilized: ['used'],
  utilizes: ['uses'],
  utilizing: ['using'],
  utilization: ['use'],
  visualize: ['picture', 'imagine'],
};

/**
 * Wordy filler phrases and their concise alternatives.
 */
const WORDY_PHRASES: { pattern: RegExp; suggestion: string; original: string }[] = [
  { pattern: /\bin order to\b/gi, suggestion: 'to', original: 'in order to' },
  { pattern: /\bdue to the fact that\b/gi, suggestion: 'because', original: 'due to the fact that' },
  { pattern: /\bat this point in time\b/gi, suggestion: 'now', original: 'at this point in time' },
  { pattern: /\bfor the purpose of\b/gi, suggestion: 'to / for', original: 'for the purpose of' },
  { pattern: /\bin the event that\b/gi, suggestion: 'if', original: 'in the event that' },
  { pattern: /\bwith the exception of\b/gi, suggestion: 'except for', original: 'with the exception of' },
  { pattern: /\ba large number of\b/gi, suggestion: 'many', original: 'a large number of' },
  { pattern: /\bis able to\b/gi, suggestion: 'can', original: 'is able to' },
  { pattern: /\btake into consideration\b/gi, suggestion: 'consider', original: 'take into consideration' },
  { pattern: /\bmake a decision\b/gi, suggestion: 'decide', original: 'make a decision' },
  { pattern: /\breach a conclusion\b/gi, suggestion: 'conclude', original: 'reach a conclusion' },
  { pattern: /\bin close proximity to\b/gi, suggestion: 'near', original: 'in close proximity to' },
  { pattern: /\bas a consequence of\b/gi, suggestion: 'because of', original: 'as a consequence of' },
];

/**
 * Identifies complex words in a sentence.
 * Considers words with 3+ syllables or words in the complex word map.
 */
export function identifyComplexWords(words: string[]): ComplexWordSuggestion[] {
  const result: ComplexWordSuggestion[] = [];
  const seen = new Set<string>();

  for (const word of words) {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean || seen.has(clean)) continue;

    const syllables = countSyllables(clean);
    const hasMapMatch = Boolean(COMPLEX_WORD_MAP[clean]);

    // Check if it qualifies as complex (3+ syllables or in dictionary)
    if (syllables >= 3 || hasMapMatch) {
      // Exclude common easily-understood 3-syllable everyday words
      const commonEverydayWords = new Set([
        'tomorrow', 'yesterday', 'together', 'family', 'favorite', 'favourite',
        'holiday', 'beautiful', 'wonderful', 'computer', 'hospital', 'company',
        'different', 'important', 'interest', 'interesting', 'afternoon', 'exercise',
        'remember', 'understand', 'president', 'anything', 'everything', 'everyone',
        'somebody', 'anybody', 'nobody', 'another'
      ]);

      if (!hasMapMatch && commonEverydayWords.has(clean)) {
        continue;
      }

      seen.add(clean);
      const suggestions = COMPLEX_WORD_MAP[clean] || [
        `Consider a 1- or 2-syllable synonym for "${clean}"`,
      ];

      result.push({
        word: clean,
        syllables,
        suggestions,
      });
    }
  }

  return result;
}

/**
 * Analyzes a single sentence and computes difficulty metrics and suggestions.
 */
export function analyzeSentence(sentenceText: string, index: number): SentenceAnalysis {
  const words = extractWords(sentenceText);
  const wordCount = words.length;

  let totalSyllables = 0;
  for (const w of words) {
    totalSyllables += countSyllables(w);
  }

  const avgSyllablesPerWord = wordCount > 0 ? totalSyllables / wordCount : 0;
  const complexWords = identifyComplexWords(words);

  // Check for wordy filler phrases
  const detectedPhrases: { original: string; suggestion: string }[] = [];
  for (const item of WORDY_PHRASES) {
    if (item.pattern.test(sentenceText)) {
      detectedPhrases.push({
        original: item.original,
        suggestion: item.suggestion,
      });
    }
  }

  // Calculate difficulty score:
  // Balances sentence length, number of complex words, and average syllables
  const lengthPenalty = wordCount * 1.35;
  const complexWordsPenalty = complexWords.length * 5.0;
  const syllableDensityPenalty = avgSyllablesPerWord * 14.0;
  const phrasePenalty = detectedPhrases.length * 3.0;

  const difficultyScore = Math.round(
    (lengthPenalty + complexWordsPenalty + syllableDensityPenalty + phrasePenalty) * 10
  ) / 10;

  // Approximate grade level for this isolated sentence using Flesch-Kincaid formula
  const isolatedGrade = wordCount > 0
    ? Math.max(1, Math.round(0.39 * wordCount + 11.8 * avgSyllablesPerWord - 15.59))
    : 1;

  // Generate diagnosis reasons
  const reasons: string[] = [];
  if (wordCount > 30) {
    reasons.push(`Very long sentence (${wordCount} words; target is 14–20 words)`);
  } else if (wordCount > 22) {
    reasons.push(`Long sentence (${wordCount} words)`);
  }

  if (complexWords.length >= 3) {
    reasons.push(`${complexWords.length} multisyllabic or complex words`);
  } else if (complexWords.length > 0) {
    reasons.push(`${complexWords.length} complex ${complexWords.length === 1 ? 'word' : 'words'}`);
  }

  if (avgSyllablesPerWord >= 1.8) {
    reasons.push(`High syllable density (${avgSyllablesPerWord.toFixed(1)} syllables/word)`);
  }

  if (detectedPhrases.length > 0) {
    reasons.push(`Contains wordy filler expressions`);
  }

  if (reasons.length === 0) {
    reasons.push(`Normal sentence structure`);
  }

  // Generate actionable suggestions
  const suggestions: string[] = [];
  if (wordCount > 24) {
    suggestions.push(
      `Split this into 2 or 3 shorter sentences around coordinating words like "and", "but", "while", or "however".`
    );
  }

  if (complexWords.length > 0) {
    const wordList = complexWords
      .slice(0, 3)
      .map(cw => `"${cw.word}" → ${cw.suggestions.slice(0, 2).join(' or ')}`)
      .join('; ');
    suggestions.push(`Simplify vocabulary: ${wordList}`);
  }

  for (const phrase of detectedPhrases.slice(0, 2)) {
    suggestions.push(`Replace "${phrase.original}" with "${phrase.suggestion}".`);
  }

  if (suggestions.length === 0) {
    suggestions.push(`Keep the tone crisp and direct to preserve reader momentum.`);
  }

  return {
    id: `sentence-${index}-${Math.random().toString(36).substring(2, 7)}`,
    index,
    text: sentenceText,
    wordCount,
    syllableCount: totalSyllables,
    avgSyllablesPerWord,
    complexWords,
    difficultyScore,
    reasons,
    suggestions,
    gradeLevel: isolatedGrade,
  };
}

/**
 * Identifies the top 5 most difficult sentences from all analyzed sentences.
 */
export function getTopHardestSentences(allSentences: SentenceAnalysis[], limit = 5): SentenceAnalysis[] {
  if (allSentences.length === 0) return [];

  // Filter out tiny micro-sentences (e.g. 1-2 words like "Yes." or "He said.")
  // unless that's all we have
  const viable = allSentences.filter(s => s.wordCount >= 4);
  const candidates = viable.length > 0 ? viable : allSentences;

  // Sort descending by difficultyScore
  const sorted = [...candidates].sort((a, b) => b.difficultyScore - a.difficultyScore);

  const top = sorted.slice(0, Math.min(limit, sorted.length));

  // Assign 1-based ranks
  return top.map((s, idx) => ({
    ...s,
    difficultyRank: idx + 1,
  }));
}
