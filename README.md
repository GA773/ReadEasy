# ReadEasy – Readability Checker & Chapter Analyzer

> A modern, free, and privacy-first web application designed for authors, bloggers, students, and writers to evaluate sentence friction, calculate Flesch Reading Ease scores, and identify their manuscript's hardest sentences with actionable suggestions.

---

## Features

1. **Large Text Editor & Heatmap:** Paste an entire book chapter, blog article, essay, or draft without character limits.
2. **Real Flesch Reading Ease Formula (0–100):** Mathematically calculated in real-time with zero hardcoded values or paid APIs.
3. **Top 5 Hardest Sentences Identification:** Ranks the 5 most challenging sentences based on word count, multisyllabic complexity, and syllable density.
4. **Actionable Rewrite Suggestions:** Provides concrete advice (splitting long clauses, replacing complex words with simpler alternatives, eliminating filler phrases).
5. **Interactive Live Rewrite Scratchpad:** Test revisions directly under each difficult sentence to immediately see word count and syllable reductions.
6. **Manuscript Heatmap Mode:** Visually inspects your text with color-coded badges (`#1` through `#5`) highlighting the most difficult sentences.
7. **Comprehensive Statistics:**
   - Total Words & Characters
   - Total Sentences & Paragraphs
   - Average Sentence Length (words/sentence) with benchmark targets
   - Estimated Silent Reading Time (~225 wpm) & Speaking Time (~135 wpm)
   - Complex Words Count & Percentage (3+ syllables)
   - Syllable Density & Secondary Indices (Flesch-Kincaid Grade Level, Gunning Fog, Coleman-Liau)
8. **Test Presets / Sample Texts:** 1-click loading of diverse samples:
   - *Literary Fiction* (Classic chapter opening)
   - *Academic Paper* (Dense neuroscience excerpt)
   - *Modern Blog Post* (Crisp, conversational web copy)
9. **Export & Share:** Export clean Markdown readability audit reports or copy instant summaries.
10. **100% Free & Client-Side Privacy:** All computation happens locally in your browser. No signups, no paywalls, and no text ever leaves your machine.

---

## Readability Formula Explained

### Mathematical Definition
ReadEasy implements the standard **Flesch Reading Ease** formula created by Rudolf Flesch in 1948:

$$\text{Score} = 206.835 - 1.015 \times \left(\frac{\text{Total Words}}{\text{Total Sentences}}\right) - 84.6 \times \left(\frac{\text{Total Syllables}}{\text{Total Words}}\right)$$

Where:
- $\frac{\text{Total Words}}{\text{Total Sentences}}$ is the **Average Sentence Length (ASL)**
- $\frac{\text{Total Syllables}}{\text{Total Words}}$ is the **Average Number of Syllables per Word (ASW)**

### Score Interpretation Scale

| Score Range | Reading Ease | US Grade Equivalent | Typical Style / Audience |
| :--- | :--- | :--- | :--- |
| **90.0 – 100.0** | Very Easy | 5th Grade (Age 10–11) | Pulp fiction, comic books, children's literature |
| **80.0 – 89.9** | Easy | 6th Grade (Age 11–12) | Conversational novels, casual blogs, light fiction |
| **70.0 – 79.9** | Fairly Easy | 7th Grade (Age 12–13) | Consumer magazines, engaging newsletters |
| **60.0 – 69.9** | Standard (Plain English) | 8th–9th Grade (Age 13–15) | *Reader's Digest*, *Time*, mainstream journalism |
| **50.0 – 59.9** | Fairly Difficult | 10th–12th Grade (High School) | High school textbooks, technical documentation |
| **30.0 – 49.9** | Difficult | College Undergraduate | Academic essays, *Harvard Business Review* |
| **0.0 – 29.9** | Very Confusing / Dense | College Graduate / Postgrad | Legal contracts, dense scientific research papers |

### Limitations of Readability Formulas
While mathematical formulas provide valuable objective baselines, they have inherent limitations:
1. **No Semantic or Conceptual Understanding:** The formula only measures syllables and sentence lengths. A nonsensical sentence composed of short words can score 100, while a clear thought containing technical vocabulary will score lower.
2. **Specialized & Domain Terminology:** Technical terms like *photosynthesis*, *asynchronous*, or *cardiovascular* inherently lower the score due to syllable counts, even when writing for an expert audience.
3. **Artistic Voice & Narrative Cadence:** Great literature deliberately alternates between short, punchy sentences and long, rhythmic passages. A lower score does not mean "bad writing"—it simply reflects higher cognitive density.

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4 + Vanilla CSS accents
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti

---

## Local Development Instructions

### Prerequisites
- Node.js (version 18 or newer)
- npm, pnpm, or yarn

### Steps to Run Locally

1. **Clone or navigate to the project directory:**
   ```bash
   cd /Users/gauravkumar/Desktop/Readeasy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal).

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## Free Deployment Instructions

### Deploying Free on Vercel

1. **Push your code to GitHub, GitLab, or Bitbucket:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit of ReadEasy"
   # Push to your repository
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in (free Hobby plan).
   - Click **"Add New..."** → **"Project"**.
   - Select your ReadEasy repository.
   - Framework preset will automatically detect **Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click **"Deploy"**.

3. Your application will be live on a free `*.vercel.app` domain with automated SSL.

---

### Deploying Free on Netlify

1. **Via Netlify Web UI:**
   - Go to [netlify.com](https://netlify.com) and log in.
   - Click **"Add new site"** → **"Import an existing project"**.
   - Connect your GitHub repository.
   - Set Build command to: `npm run build`
   - Set Publish directory to: `dist`
   - Click **"Deploy ReadEasy"**.

2. **Via Netlify CLI (Optional):**
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod --dir=dist
   ```

---

## License

MIT License. Free to use for personal, academic, and commercial writing.
