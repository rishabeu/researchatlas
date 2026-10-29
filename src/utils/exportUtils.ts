import { PaperAnalysis } from '../types';

/**
 * Downloads a string as a file in the browser
 */
function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function sanitizeFileName(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 50);
}

/**
 * Export analysis as structured JSON
 */
export function exportAnalysisAsJson(analysis: PaperAnalysis) {
  const baseName = sanitizeFileName(analysis.paperMeta.title || 'research_analysis');
  const jsonString = JSON.stringify(analysis, null, 2);
  triggerDownload(jsonString, `${baseName}_atlas_analysis.json`, 'application/json');
}

/**
 * Export analysis as cleanly formatted academic TXT briefing
 */
export function exportAnalysisAsTxt(analysis: PaperAnalysis) {
  const meta = analysis.paperMeta;
  const overview = analysis.overview;
  const methods = analysis.methods;
  const results = analysis.results;
  const gaps = analysis.researchGaps;
  const projects = analysis.projectIdeas;
  const arch = analysis.architectureDiagram;

  const lines: string[] = [
    '================================================================================',
    'RESEARCHATLAS AI - EVIDENCE-BASED PAPER ANALYSIS REPORT',
    '================================================================================',
    '',
    `TITLE: ${meta.title}`,
    `AUTHORS: ${meta.authors}`,
    `YEAR / VENUE: ${meta.year} | ${meta.doiOrSource || 'Not specified'}`,
    `RESEARCH FIELD: ${meta.field}`,
    `ESTIMATED READING TIME: ${meta.readingTimeMinutes} minutes`,
    `REPORT GENERATED: ${new Date().toISOString()}`,
    analysis.isDemo ? '[NOTE: Generated from verified sample demonstration excerpt]' : '',
    '',
    '--------------------------------------------------------------------------------',
    '1. EXECUTIVE OVERVIEW & PLAIN-LANGUAGE SYNTHESIS',
    '--------------------------------------------------------------------------------',
    `SUMMARY:`,
    `${overview.plainLanguageSummary}`,
    '',
    `CORE PROBLEM:`,
    `${overview.coreProblem}`,
    '',
    `KEY CONTRIBUTION:`,
    `${overview.keyContribution}`,
    '',
    `PRACTICAL RELEVANCE:`,
    `${overview.practicalRelevance}`,
    '',
    `PUBLICATION READINESS:`,
    `  - Empirical Rigor: ${overview.publicationReadiness.rigorScore}`,
    `  - Reproducibility: ${overview.publicationReadiness.reproducibilityStatus}`,
    `  - Statistical Reporting: ${overview.publicationReadiness.statisticalReporting}`,
    '',
    `KEY FINDINGS:`,
    ...overview.keyFindings.map((f, i) => `  [${i + 1}] ${f}`),
    '',
    '--------------------------------------------------------------------------------',
    '2. METHODOLOGICAL BREAKDOWN & PIPELINE',
    '--------------------------------------------------------------------------------',
    `${methods.methodologicalBreakdown}`,
    '',
    `MATHEMATICAL FORMULATION:`,
    `${methods.mathematicalFormulation}`,
    '',
    `CORE ARCHITECTURE & ALGORITHMS:`,
    ...methods.architectureAndAlgorithms.map((a) => `  • ${a}`),
    '',
    `DATASETS & BENCHMARKS:`,
    ...methods.datasetsAndBenchmarks.map(
      (d) => `  • ${d.name} (${d.sampleCount || 'N/A'}) - ${d.accessType || 'Access unspecified'}\n    ${d.description || ''}`
    ),
    '',
    `PIPELINE STEPS:`,
    ...methods.pipelineSteps.map(
      (s) => `  Step ${s.stepNumber}: ${s.title}\n    ${s.description}\n    Input/Output: ${s.inputOutput}`
    ),
    '',
    '--------------------------------------------------------------------------------',
    '3. SUPPORTED FINDINGS & BENCHMARK RESULTS (EVIDENCE-GROUNDED)',
    '--------------------------------------------------------------------------------',
    `BENCHMARK SUMMARY:`,
    `${results.benchmarkSummary}`,
    '',
    `ABLATION STUDIES:`,
    `${results.ablationStudyFindings}`,
    '',
    `STATISTICAL SIGNIFICANCE:`,
    `${results.statisticalSignificance}`,
    '',
    `EMPIRICAL METRICS RECORD:`,
    ...results.supportedFindings.map(
      (f) =>
        `  • Metric: ${f.metric} = ${f.score} (${f.datasetOrCondition})\n    Comparison: ${f.baselineComparison || 'N/A'}\n    Evidence: "${f.quoteEvidence || 'Reported in text'}"`
    ),
    '',
    `VERBATIM AUTHOR QUOTES:`,
    ...results.authorQuotes.map(
      (q) => `  • Claim: ${q.claim}\n    Quote: "${q.verbatimQuote}" [${q.sectionOrPage || 'Section not indexed'}]`
    ),
    '',
    '--------------------------------------------------------------------------------',
    '4. RESEARCH Gaps, LIMITATIONS & MISSING SECTIONS',
    '--------------------------------------------------------------------------------',
    `STATEMENTS OF LIMITATION:`,
    ...gaps.statedLimitations.map((l) => `  • ${l}`),
    '',
    `UNADDRESSED QUESTIONS & ASSUMPTIONS:`,
    ...gaps.unaddressedQuestions.map((q) => `  • ${q}`),
    ...gaps.assumptionsAndBiases.map((a) => `  • Bias/Assumption: ${a}`),
    '',
    `THREATS TO VALIDITY:`,
    ...gaps.threatsToValidity.map((t) => `  • ${t}`),
    '',
    `MISSING SOURCE SECTIONS IN EXCERPT/PAPER:`,
    ...gaps.missingSourceSections.map((m) => `  [MISSING] ${m}`),
    '',
    '--------------------------------------------------------------------------------',
    '5. STUDENT PROJECT EXTENSION BLUEPRINTS',
    '--------------------------------------------------------------------------------',
    ...projects.map(
      (p, idx) => `PROJECT ${idx + 1} [${p.difficulty.toUpperCase()}]: ${p.title}
Duration: ${p.durationWeeks}
Problem: ${p.problemStatement}
Prerequisite Stack: ${p.prerequisiteStack.join(', ')}
Implementation Roadmap:
${p.implementationPlan.map((step) => `  - ${step.weekRange} (${step.phase}): ${step.description}`).join('\n')}
Expected Outcome: ${p.expectedOutcome}
Potential Pitfalls: ${p.potentialPitfalls}
`
    ),
    '--------------------------------------------------------------------------------',
    '6. ARCHITECTURE FLOWCHART (MERMAID SPECIFICATION)',
    '--------------------------------------------------------------------------------',
    `${arch.diagramExplanation}`,
    '',
    'MERMAID SOURCE CODE:',
    '```mermaid',
    arch.mermaidGraph,
    '```',
    '',
    '================================================================================',
    'END OF REPORT - Generated by ResearchAtlas AI',
    '================================================================================',
  ];

  const content = lines.join('\n');
  const baseName = sanitizeFileName(analysis.paperMeta.title || 'research_analysis');
  triggerDownload(content, `${baseName}_atlas_briefing.txt`, 'text/plain;charset=utf-8');
}
