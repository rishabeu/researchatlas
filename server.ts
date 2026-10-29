import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Maximum payload size for paper uploads
app.use(express.json({ limit: '25mb' }));

// Shared Gemini client utility on the server
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Read system instructions
let systemInstruction = '';
try {
  const promptPath = path.resolve(process.cwd(), 'system_prompt.txt');
  if (fs.existsSync(promptPath)) {
    systemInstruction = fs.readFileSync(promptPath, 'utf-8');
  }
} catch (err) {
  console.warn('Could not read system_prompt.txt:', err);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    model: 'gemini-3.8-flash',
  });
});

// JSON Schema for structured analysis
const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    paperMeta: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        authors: { type: Type.STRING },
        year: { type: Type.STRING },
        field: { type: Type.STRING },
        doiOrSource: { type: Type.STRING },
        readingTimeMinutes: { type: Type.NUMBER },
      },
      required: ['title', 'authors', 'year', 'field', 'readingTimeMinutes'],
    },
    overview: {
      type: Type.OBJECT,
      properties: {
        plainLanguageSummary: { type: Type.STRING },
        coreProblem: { type: Type.STRING },
        keyContribution: { type: Type.STRING },
        keyFindings: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        practicalRelevance: { type: Type.STRING },
        publicationReadiness: {
          type: Type.OBJECT,
          properties: {
            rigorScore: { type: Type.STRING },
            reproducibilityStatus: { type: Type.STRING },
            statisticalReporting: { type: Type.STRING },
          },
          required: ['rigorScore', 'reproducibilityStatus', 'statisticalReporting'],
        },
      },
      required: ['plainLanguageSummary', 'coreProblem', 'keyContribution', 'keyFindings', 'practicalRelevance', 'publicationReadiness'],
    },
    methods: {
      type: Type.OBJECT,
      properties: {
        methodologicalBreakdown: { type: Type.STRING },
        datasetsAndBenchmarks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              sampleCount: { type: Type.STRING },
              description: { type: Type.STRING },
              accessType: { type: Type.STRING },
            },
            required: ['name'],
          },
        },
        architectureAndAlgorithms: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        mathematicalFormulation: { type: Type.STRING },
        pipelineSteps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              stepNumber: { type: Type.INTEGER },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              inputOutput: { type: Type.STRING },
            },
            required: ['stepNumber', 'title', 'description', 'inputOutput'],
          },
        },
      },
      required: ['methodologicalBreakdown', 'datasetsAndBenchmarks', 'architectureAndAlgorithms', 'mathematicalFormulation', 'pipelineSteps'],
    },
    results: {
      type: Type.OBJECT,
      properties: {
        supportedFindings: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              metric: { type: Type.STRING },
              datasetOrCondition: { type: Type.STRING },
              score: { type: Type.STRING },
              baselineComparison: { type: Type.STRING },
              quoteEvidence: { type: Type.STRING },
            },
            required: ['metric', 'datasetOrCondition', 'score'],
          },
        },
        statisticalSignificance: { type: Type.STRING },
        benchmarkSummary: { type: Type.STRING },
        ablationStudyFindings: { type: Type.STRING },
        authorQuotes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              claim: { type: Type.STRING },
              verbatimQuote: { type: Type.STRING },
              sectionOrPage: { type: Type.STRING },
            },
            required: ['claim', 'verbatimQuote'],
          },
        },
      },
      required: ['supportedFindings', 'statisticalSignificance', 'benchmarkSummary', 'ablationStudyFindings', 'authorQuotes'],
    },
    researchGaps: {
      type: Type.OBJECT,
      properties: {
        statedLimitations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        unaddressedQuestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        assumptionsAndBiases: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        threatsToValidity: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        missingSourceSections: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ['statedLimitations', 'unaddressedQuestions', 'assumptionsAndBiases', 'threatsToValidity', 'missingSourceSections'],
    },
    projectIdeas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          durationWeeks: { type: Type.STRING },
          problemStatement: { type: Type.STRING },
          prerequisiteStack: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          implementationPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                description: { type: Type.STRING },
                weekRange: { type: Type.STRING },
              },
              required: ['phase', 'description', 'weekRange'],
            },
          },
          expectedOutcome: { type: Type.STRING },
          potentialPitfalls: { type: Type.STRING },
        },
        required: ['id', 'title', 'difficulty', 'durationWeeks', 'problemStatement', 'prerequisiteStack', 'implementationPlan', 'expectedOutcome', 'potentialPitfalls'],
      },
    },
    architectureDiagram: {
      type: Type.OBJECT,
      properties: {
        mermaidGraph: { type: Type.STRING },
        diagramExplanation: { type: Type.STRING },
      },
      required: ['mermaidGraph', 'diagramExplanation'],
    },
  },
  required: ['paperMeta', 'overview', 'methods', 'results', 'researchGaps', 'projectIdeas', 'architectureDiagram'],
};

// API: Analyze Paper
app.post('/api/analyze', async (req, res) => {
  try {
    const { paperText, paperTitle } = req.body;

    if (!paperText || typeof paperText !== 'string' || paperText.trim().length < 50) {
      return res.status(400).json({
        error: 'Invalid request: Please provide valid research paper text with at least 50 characters.',
      });
    }

    if (paperText.length > 300000) {
      return res.status(400).json({
        error: 'Paper text exceeds maximum analysis capacity (300,000 characters). Please provide a concise excerpt or section.',
      });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in the server environment. Please configure GEMINI_API_KEY in the Secrets panel, or use the pre-loaded Demo Papers to explore the interface.',
      });
    }

    const prompt = `Analyze the following academic paper with strict empirical fidelity.
Paper Title (if provided): ${paperTitle || 'Not explicitly provided'}

[PAPER CONTENT START]
${paperText}
[PAPER CONTENT END]

Follow all instructions and few-shot paradigms in your system prompt. Ensure the Mermaid flowchart starts with 'graph TD' and has valid syntax with double-quoted node labels. Return the response formatted strictly according to the specified JSON schema.`;

    async function generateWithRetry(params: any, retries = 2, delayMs = 1500): Promise<any> {
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          return await ai!.models.generateContent(params);
        } catch (err: any) {
          const errMsg = err?.message || '';
          const isTransient = errMsg.includes('503') || errMsg.includes('429') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE');
          if (isTransient && attempt < retries) {
            console.warn(`Transient Gemini error (attempt ${attempt + 1}/${retries + 1}), retrying in ${delayMs}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
            continue;
          }
          throw err;
        }
      }
    }

    const response = await generateWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature for high factual reproducibility
        responseMimeType: 'application/json',
        responseSchema: analysisResponseSchema,
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Model returned an empty response.');
    }

    let parsed;
    try {
      parsed = JSON.parse(textOutput);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output:', textOutput);
      return res.status(502).json({
        error: 'Failed to parse model response into valid analysis format. Please try again.',
      });
    }

    // Attach raw text excerpt for follow-up Q&A grounding
    parsed.rawTextExcerpt = paperText.slice(0, 15000);
    parsed.isDemo = false;

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error during paper analysis:', error);
    return res.status(500).json({
      error: error?.message || 'An unexpected error occurred while analyzing the paper.',
    });
  }
});

// API: Ask the Paper (Grounded Follow-up Q&A)
app.post('/api/ask', async (req, res) => {
  try {
    const { question, paperText, paperTitle, chatHistory } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Please provide a valid question.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in server environment.',
      });
    }

    const docContext = paperText ? paperText.slice(0, 40000) : '';

    const systemPromptQnA = `You are a strict, grounded academic question-answering assistant for research papers.
You must answer questions strictly based on the text of the provided paper.
Rules:
1. Ground every claim directly in the paper content.
2. If the user asks about an experimental baseline, author opinion, dataset, parameter, or detail that is NOT explicitly stated in the paper text, you MUST clearly state: "This detail is [NOT REPORTED IN PAPER]." Do not extrapolate or guess.
3. Provide verbatim quotes where helpful.
4. Format your answer clearly with markdown formatting.`;

    const userPrompt = `Context Document (Title: ${paperTitle || 'Supplied Paper'}):
"""
${docContext}
"""

User Question: ${question}

Provide an accurate, evidence-backed answer based solely on the paper text.`;

    async function generateQnAWithRetry(params: any, retries = 2, delayMs = 1500): Promise<any> {
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          return await ai!.models.generateContent(params);
        } catch (err: any) {
          const errMsg = err?.message || '';
          const isTransient = errMsg.includes('503') || errMsg.includes('429') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE');
          if (isTransient && attempt < retries) {
            console.warn(`Transient Gemini error during Q&A (attempt ${attempt + 1}/${retries + 1}), retrying in ${delayMs}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
            continue;
          }
          throw err;
        }
      }
    }

    const response = await generateQnAWithRetry({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPromptQnA,
        temperature: 0.2,
      },
    });

    const answer = response.text || 'No response generated.';

    // Extract potential verbatim quotes or detect unstated facts
    const isUnreported = answer.includes('[NOT REPORTED IN PAPER]') || answer.toLowerCase().includes('not mentioned in the paper') || answer.toLowerCase().includes('not reported');

    return res.json({
      answer,
      isUnreported,
    });
  } catch (error: any) {
    console.error('Error during paper Q&A:', error);
    let userMsg = error?.message || 'An error occurred while answering your question.';
    if (userMsg.includes('503') || userMsg.includes('high demand')) {
      userMsg = 'The AI model is currently handling elevated traffic. Please retry in a few moments.';
    }
    return res.status(500).json({ error: userMsg });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ResearchAtlas AI server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
