export interface ComplexWordSuggestion {
  word: string;
  syllables: number;
  suggestions: string[];
}

export interface SentenceAnalysis {
  id: string;
  index: number;
  text: string;
  wordCount: number;
  syllableCount: number;
  avgSyllablesPerWord: number;
  complexWords: ComplexWordSuggestion[];
  difficultyScore: number;
  difficultyRank?: number; // 1 to 5 for top hardest
  reasons: string[];
  suggestions: string[];
  gradeLevel: number;
}

export interface ReadabilityMetrics {
  // Core Flesch Reading Ease (0 - 100)
  fleschReadingEase: number;
  fleschInterpretation: {
    label: string;
    description: string;
    gradeLevel: string;
    color: string;
    badgeBg: string;
    badgeBorder: string;
    ringColor: string;
  };

  // Additional educational indices
  fleschKincaidGradeLevel: number;
  gunningFogIndex: number;
  colemanLiauIndex: number;

  // Text statistics
  totalWords: number;
  totalSentences: number;
  totalSyllables: number;
  totalCharacters: number; // excluding whitespace
  totalCharactersWithSpaces: number;
  totalParagraphs: number;

  // Averages & Rates
  avgSentenceLength: number; // words per sentence
  avgSyllablesPerWord: number;
  avgWordLength: number; // characters per word
  complexWordsCount: number; // words with >= 3 syllables
  complexWordsPercentage: number;
  readingTimeMinutes: number;
  readingTimeFormatted: string;
  speakingTimeFormatted: string;

  // Difficult sentences
  hardestSentences: SentenceAnalysis[];
  allSentences: SentenceAnalysis[];
}

export interface SampleText {
  id: string;
  title: string;
  category: string;
  difficulty: 'Difficult' | 'Standard' | 'Easy';
  description: string;
  content: string;
}
