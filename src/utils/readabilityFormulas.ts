import { countSyllables, countTotalSyllables } from './syllableCounter';
import { extractWords, splitIntoSentences, countParagraphs } from './textParser';
import { analyzeSentence, getTopHardestSentences } from './sentenceAnalyzer';
import type { ReadabilityMetrics } from '../types/readability';

/**
 * Returns descriptive qualitative data and color styles for a Flesch score.
 */
export function getFleschInterpretation(score: number): ReadabilityMetrics['fleschInterpretation'] {
  if (score >= 90) {
    return {
      label: 'Very Easy',
      description: 'Effortless to read. Conversational, pulp fiction, and comics level.',
      gradeLevel: '5th Grade (Age 10–11)',
      color: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeBorder: 'border-emerald-500',
      ringColor: '#10b981',
    };
  }
  if (score >= 80) {
    return {
      label: 'Easy',
      description: 'Clear and accessible. Conversational English and light fiction.',
      gradeLevel: '6th Grade (Age 11–12)',
      color: 'text-teal-600',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      badgeBorder: 'border-teal-500',
      ringColor: '#14b8a6',
    };
  }
  if (score >= 70) {
    return {
      label: 'Fairly Easy',
      description: 'Engaging and friendly. Ideal for newsletters and popular nonfiction.',
      gradeLevel: '7th Grade (Age 12–13)',
      color: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeBorder: 'border-blue-500',
      ringColor: '#3b82f6',
    };
  }
  if (score >= 60) {
    return {
      label: 'Standard (Plain English)',
      description: 'Recommended sweet spot for mass-market blogs, novels, and journalism.',
      gradeLevel: '8th–9th Grade (Age 13–15)',
      color: 'text-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badgeBorder: 'border-indigo-500',
      ringColor: '#6366f1',
    };
  }
  if (score >= 50) {
    return {
      label: 'Fairly Difficult',
      description: 'Requires attention. High school textbooks and technical documentation.',
      gradeLevel: '10th–12th Grade (High School)',
      color: 'text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeBorder: 'border-amber-500',
      ringColor: '#f59e0b',
    };
  }
  if (score >= 30) {
    return {
      label: 'Difficult',
      description: 'Dense and demanding. Academic papers and specialized essays.',
      gradeLevel: 'College Undergraduate',
      color: 'text-orange-600',
      badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
      badgeBorder: 'border-orange-500',
      ringColor: '#ea580c',
    };
  }
  return {
    label: 'Very Confusing / Academic',
    description: 'Extremely dense. Typical of legal contracts and doctoral theses.',
    gradeLevel: 'College Graduate & Professional',
    color: 'text-rose-600',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeBorder: 'border-rose-500',
    ringColor: '#e11d48',
  };
}

/**
 * Format minutes into readable strings like "1 min 30 sec" or "45 sec"
 */
function formatMinutes(minutes: number): string {
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${Math.max(1, seconds)} sec`;
  }
  const fullMin = Math.floor(minutes);
  const remSec = Math.round((minutes - fullMin) * 60);
  if (remSec === 0) return `${fullMin} min`;
  return `${fullMin} min ${remSec} sec`;
}

/**
 * Computes full readability analysis on raw text.
 */
export function calculateReadability(rawText: string): ReadabilityMetrics | null {
  if (!rawText || !rawText.trim()) {
    return null;
  }

  const rawSentences = splitIntoSentences(rawText);
  const words = extractWords(rawText);

  const totalWords = words.length;
  const totalSentences = Math.max(1, rawSentences.length);

  if (totalWords === 0) {
    return null;
  }

  // Count syllables
  const totalSyllables = countTotalSyllables(words);
  const avgSentenceLength = totalWords / totalSentences;
  const avgSyllablesPerWord = totalSyllables / totalWords;

  // Characters count
  const totalCharactersWithSpaces = rawText.length;
  const totalCharacters = rawText.replace(/\s/g, '').length;
  const avgWordLength = totalWords > 0 ? totalCharacters / totalWords : 0;

  // Complex words: words with >= 3 syllables
  let complexWordsCount = 0;
  for (const w of words) {
    if (countSyllables(w) >= 3) {
      complexWordsCount++;
    }
  }
  const complexWordsPercentage = totalWords > 0
    ? (complexWordsCount / totalWords) * 100
    : 0;

  // 1. Flesch Reading Ease Formula:
  // 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords)
  const rawFlesch = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  // Clamped between 0 and 100 for clean visualization, rounded to 1 decimal place
  const fleschReadingEase = Math.round(Math.min(100, Math.max(0, rawFlesch)) * 10) / 10;

  // 2. Flesch-Kincaid Grade Level:
  // 0.39 * (totalWords / totalSentences) + 11.8 * (totalSyllables / totalWords) - 15.59
  const rawFKGL = (0.39 * avgSentenceLength) + (11.8 * avgSyllablesPerWord) - 15.59;
  const fleschKincaidGradeLevel = Math.round(Math.max(1, rawFKGL) * 10) / 10;

  // 3. Gunning Fog Index:
  // 0.4 * [ (totalWords / totalSentences) + 100 * (complexWords / totalWords) ]
  const rawFog = 0.4 * (avgSentenceLength + complexWordsPercentage);
  const gunningFogIndex = Math.round(Math.max(1, rawFog) * 10) / 10;

  // 4. Coleman-Liau Index:
  // 0.0588 * L - 0.296 * S - 15.8
  // L = avg letters per 100 words, S = avg sentences per 100 words
  const lettersPer100Words = (totalCharacters / totalWords) * 100;
  const sentencesPer100Words = (totalSentences / totalWords) * 100;
  const rawCL = (0.0588 * lettersPer100Words) - (0.296 * sentencesPer100Words) - 15.8;
  const colemanLiauIndex = Math.round(Math.max(1, rawCL) * 10) / 10;

  // Paragraphs
  const totalParagraphs = countParagraphs(rawText);

  // Reading time (standard silent reading speed is ~225 WPM)
  const readingTimeMinutes = totalWords / 225;
  const readingTimeFormatted = formatMinutes(readingTimeMinutes);

  // Speaking time (standard speaking speed is ~135 WPM)
  const speakingTimeMinutes = totalWords / 135;
  const speakingTimeFormatted = formatMinutes(speakingTimeMinutes);

  // Analyze all sentences individually
  const allSentences = rawSentences.map((s, idx) => analyzeSentence(s, idx));

  // Get the top 5 most difficult sentences
  const hardestSentences = getTopHardestSentences(allSentences, 5);

  const fleschInterpretation = getFleschInterpretation(fleschReadingEase);

  return {
    fleschReadingEase,
    fleschInterpretation,
    fleschKincaidGradeLevel,
    gunningFogIndex,
    colemanLiauIndex,
    totalWords,
    totalSentences,
    totalSyllables,
    totalCharacters,
    totalCharactersWithSpaces,
    totalParagraphs,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    complexWordsCount,
    complexWordsPercentage: Math.round(complexWordsPercentage * 10) / 10,
    readingTimeMinutes,
    readingTimeFormatted,
    speakingTimeFormatted,
    hardestSentences,
    allSentences,
  };
}
