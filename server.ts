/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

// In-Memory Rate Limiter Map for Security & DoS Protection
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

const createRateLimiter = (maxRequests: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
    const now = Date.now();
    const clientRecord = rateLimitMap.get(ip);

    if (!clientRecord || now > clientRecord.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (clientRecord.count >= maxRequests) {
      const retryAfterSec = Math.ceil((clientRecord.resetTime - now) / 1000);
      res.setHeader('Retry-After', String(retryAfterSec));
      res.status(429).json({
        success: false,
        error: `Rate limit exceeded. Please retry in ${retryAfterSec} seconds.`,
      });
      return;
    }

    clientRecord.count += 1;
    next();
  };
};

const aiRateLimiter = createRateLimiter(20, 60 * 1000); // 20 AI requests per minute

// Security Middlewares & Headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(express.json({ limit: '2mb' }));

// Shared Gemini client initialized strictly on the server
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface GeneratePlanRequestBody {
  eventType?: string;
  title?: string;
  date?: string;
  location?: string;
  guestCount?: number;
  totalBudget?: number;
  currency?: string;
  styleVibe?: string;
  specialRequirements?: string;
}

interface RefineSectionRequestBody {
  eventContext?: {
    title?: string;
    type?: string;
    guestCount?: number;
    totalBudget?: number;
    currency?: string;
  };
  sectionName?: string;
  instruction?: string;
}

/**
 * Health check endpoint for uptime and configuration monitors.
 */
app.get('/api/health', (_req: Request, res: Response): void => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Master Event Blueprint Generator endpoint calling Gemini 3.8 Flash.
 */
app.post(
  '/api/ai/generate-event-plan',
  aiRateLimiter,
  async (
    req: Request<Record<string, never>, Record<string, unknown>, GeneratePlanRequestBody>,
    res: Response
  ): Promise<void> => {
    const {
      eventType = 'wedding',
      title = 'Celebration',
      date = '2026-11-15',
      location = 'Garden Estate',
      guestCount = 100,
      totalBudget = 25000,
      currency = 'USD',
      styleVibe = 'Elegant, romantic, warm amber glow with floral installations',
      specialRequirements = '',
    } = req.body;

    // Input sanitization and bounds enforcement
    const safeGuestCount = Math.min(Math.max(1, Number(guestCount) || 100), 10000);
    const safeTotalBudget = Math.min(Math.max(500, Number(totalBudget) || 25000), 100000000);
    const safeTitle = String(title).slice(0, 200).trim();
    const safeLocation = String(location).slice(0, 200).trim();
    const safeStyleVibe = String(styleVibe).slice(0, 1000).trim();
    const safeSpecialReqs = String(specialRequirements).slice(0, 1000).trim();

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured on the server environment.');
      }

      const systemInstruction = `You are an elite celebration and event planning architect with 20+ years of expertise designing unforgettable weddings, milestone birthdays, and community gatherings.
You output strictly valid JSON matching the exact requested event planning structure without markdown fences or conversational preambles.
Every budget item must have realistic numerical estimates adhering strictly to the user's total budget ($${safeTotalBudget} ${currency}).
The run-of-show timeline must be chronological, realistic, and operationally rigorous.
Vendor checklists must provide actionable due-diligence questions and deliverables.`;

      const prompt = `Plan a comprehensive celebration master blueprint with the following parameters:
- Event Title: "${safeTitle}"
- Event Type: ${eventType} (wedding, birthday, community, or custom)
- Date: ${date}
- Location / Setting: ${safeLocation}
- Expected Guest Count: ${safeGuestCount} attendees
- Total Target Budget: ${safeTotalBudget} ${currency}
- Stylistic Aesthetic & Vibe: ${safeStyleVibe}
- Special Notes / Traditions / Requirements: ${safeSpecialReqs || 'None specified'}

Output a single JSON object with these exact keys:
{
  "theme": {
    "title": "Creative concept title",
    "aesthetic": "Aesthetic style summary",
    "atmosphere": "Detailed description of sensory atmosphere, lighting, scents, and floral elements",
    "colorPalette": [
      { "name": "Color Name", "hex": "#hexcode" } // 4 to 5 harmonized colors
    ],
    "decorConcept": "Specific table decor, signage, linens, and floral arrangements",
    "musicStyle": "Acoustic, jazz, live band, or DJ mood trajectory",
    "invitationWording": "Polished invitation draft suitable for print or digital invite"
  },
  "budget": {
    "categories": [
      {
        "name": "Category Name (e.g. Venue & Rentals, Catering & Bar, Decor & Florals, Photo & Video, Music & Entertainment, Attire & Beauty, Stationery & Favors, Contingency Buffer)",
        "allocated": 0, // total estimated amount for this category in ${currency}
        "items": [
          {
            "name": "Specific item or line item",
            "estimatedCost": 0,
            "notes": "Short vendor recommendation or cost-saving tip"
          }
        ]
      }
    ]
  },
  "timeline": {
    "milestones": [
      {
        "timeframe": "e.g., 6 Months Out / 3 Months Out / 1 Month Out / 2 Weeks Out / 1 Day Before",
        "title": "Milestone title",
        "description": "Concrete action checklist item",
        "completed": false
      }
    ],
    "dayOfSchedule": [
      {
        "time": "e.g., 10:00 AM",
        "activity": "Activity name",
        "location": "Specific zone/room",
        "leadPerson": "Responsible coordinator, host, or vendor",
        "notes": "Key cues, equipment, or staging details"
      }
    ]
  },
  "vendors": [
    {
      "category": "e.g., Venue, Catering, Photography, Florals, DJ/Band, Rentals, Cake/Dessert",
      "name": "Sample or recommended vendor profile name",
      "contact": "Contact or booking channel guideline",
      "quoteAmount": 0,
      "status": "In Talks",
      "notes": "Key contract terms, overtime policy, or dietary accommodations",
      "checklist": [
        "Key question or deliverable 1",
        "Key question or deliverable 2",
        "Key question or deliverable 3"
      ]
    }
  ],
  "personalizedTips": [
    "3 to 5 expert logistical tips specifically tailored to this ${eventType} with ${safeGuestCount} guests in ${safeLocation}"
  ]
}

Ensure the sum of all category allocated amounts closely equals the total budget of ${safeTotalBudget} ${currency}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const rawText = response.text || '{}';
      const planData: unknown = JSON.parse(rawText);
      res.json({ success: true, plan: planData });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate event blueprint';
      console.error('Error in /api/ai/generate-event-plan:', errorMessage);
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }
);

/**
 * Dedicated Section Refinement & AI Consultant endpoint calling Gemini 3.8 Flash.
 */
app.post(
  '/api/ai/refine-section',
  aiRateLimiter,
  async (
    req: Request<Record<string, never>, Record<string, unknown>, RefineSectionRequestBody>,
    res: Response
  ): Promise<void> => {
    const { eventContext, sectionName = 'General', instruction = '' } = req.body;

    const safeInstruction = String(instruction).slice(0, 1000).trim();
    if (!safeInstruction) {
      res.status(400).json({ success: false, error: 'Instruction prompt is required.' });
      return;
    }

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured on the server environment.');
      }

      const systemInstruction = `You are a specialist celebration consultant and event logistics advisor.
Provide clear, actionable, and elegant advice or structured suggestions based on the user's request.
Return your answer in concise, beautifully structured JSON with an array of suggestions or formatted recommendations.`;

      const prompt = `Context:
Event: "${eventContext?.title || 'Celebration'}" (${eventContext?.type || 'Event'}, ${eventContext?.guestCount || 100} guests, budget: ${eventContext?.totalBudget || 20000} ${eventContext?.currency || 'USD'})
Section: ${sectionName}
User Request: ${safeInstruction}

Respond with a JSON object:
{
  "recommendations": [
    {
      "title": "Short descriptive title",
      "description": "Concrete actionable advice or proposed update",
      "impact": "Cost saving, time benefit, or guest experience highlight"
    }
  ],
  "summaryNotes": "A 1-2 sentence overall advisory takeaway"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const rawText = response.text || '{}';
      const parsed: unknown = JSON.parse(rawText);
      res.json({ success: true, result: parsed });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to process AI refinement';
      console.error('Error in /api/ai/refine-section:', errorMessage);
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }
);

// Dev vs Prod Vite Integration
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Celebration planner server running securely at http://0.0.0.0:${port}`);
});
