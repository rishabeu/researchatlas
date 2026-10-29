export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface DatasetItem {
  name: string;
  sampleCount?: string;
  description?: string;
  accessType?: string;
}

export interface PipelineStep {
  stepNumber: number;
  title: string;
  description: string;
  inputOutput: string;
}

export interface SupportedFinding {
  metric: string;
  datasetOrCondition: string;
  score: string;
  baselineComparison?: string;
  quoteEvidence?: string;
}

export interface AuthorQuote {
  claim: string;
  verbatimQuote: string;
  sectionOrPage?: string;
}

export interface ImplementationPhase {
  phase: string;
  description: string;
  weekRange: string;
}

export interface StudentProjectIdea {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  durationWeeks: string;
  problemStatement: string;
  prerequisiteStack: string[];
  implementationPlan: ImplementationPhase[];
  expectedOutcome: string;
  potentialPitfalls: string;
}

export interface PaperMeta {
  title: string;
  authors: string;
  year: string;
  field: string;
  doiOrSource: string;
  readingTimeMinutes: number;
}

export interface PublicationReadiness {
  rigorScore: string;
  reproducibilityStatus: string;
  statisticalReporting: string;
}

export interface PaperOverview {
  plainLanguageSummary: string;
  coreProblem: string;
  keyContribution: string;
  keyFindings: string[];
  practicalRelevance: string;
  publicationReadiness: PublicationReadiness;
}

export interface PaperMethods {
  methodologicalBreakdown: string;
  datasetsAndBenchmarks: DatasetItem[];
  architectureAndAlgorithms: string[];
  mathematicalFormulation: string;
  pipelineSteps: PipelineStep[];
}

export interface PaperResults {
  supportedFindings: SupportedFinding[];
  statisticalSignificance: string;
  benchmarkSummary: string;
  ablationStudyFindings: string;
  authorQuotes: AuthorQuote[];
}

export interface PaperResearchGaps {
  statedLimitations: string[];
  unaddressedQuestions: string[];
  assumptionsAndBiases: string[];
  threatsToValidity: string[];
  missingSourceSections: string[];
}

export interface PaperArchitecture {
  mermaidGraph: string;
  diagramExplanation: string;
}

export interface PaperAnalysis {
  paperMeta: PaperMeta;
  overview: PaperOverview;
  methods: PaperMethods;
  results: PaperResults;
  researchGaps: PaperResearchGaps;
  projectIdeas: StudentProjectIdea[];
  architectureDiagram: PaperArchitecture;
  rawTextExcerpt?: string;
  isDemo?: boolean;
}

export interface QnAMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  groundingQuotes?: string[];
  unsupportedClarification?: string;
}
