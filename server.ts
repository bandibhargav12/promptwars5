import express, { Request, Response } from 'express';
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

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/ai/generate-event-plan', async (req: Request, res: Response) => {
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

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const systemInstruction = `You are an elite, world-class celebration and event planning architect with 20+ years of expertise designing unforgettable weddings, milestone birthdays, and community gatherings.
You output strictly valid JSON matching the exact requested event planning structure without markdown fences or extraneous text.
Every budget item must have realistic numerical estimates adhering strictly to the user's total budget ($${totalBudget} ${currency}).
The run-of-show timeline must be chronological, realistic, and operationally rigorous.
Vendor checklists must provide actionable questions and deliverables.`;

    const prompt = `Plan a comprehensive celebration master blueprint with the following parameters:
- Event Title: "${title}"
- Event Type: ${eventType} (wedding, birthday, community, or custom)
- Date: ${date}
- Location / Setting: ${location}
- Expected Guest Count: ${guestCount} attendees
- Total Target Budget: ${totalBudget} ${currency}
- Stylistic Aesthetic & Vibe: ${styleVibe}
- Special Notes / Traditions / Requirements: ${specialRequirements || 'None specified'}

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
        "name": "Category Name (e.g., Venue & Rentals, Catering & Bar, Decor & Florals, Photo & Video, Music & Entertainment, Attire & Beauty, Stationery & Favors, Contingency Buffer)",
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
    "3 to 5 expert logistical tips specifically tailored to this ${eventType} with ${guestCount} guests in ${location}"
  ]
}

Ensure the sum of all category allocated amounts closely equals the total budget of ${totalBudget} ${currency}.`;

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
    const planData = JSON.parse(rawText);
    res.json({ success: true, plan: planData });
  } catch (err: any) {
    console.error('Error in /api/ai/generate-event-plan:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to generate event blueprint',
    });
  }
});

app.post('/api/ai/refine-section', async (req: Request, res: Response) => {
  const { eventContext, sectionName, instruction } = req.body;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const systemInstruction = `You are a specialist celebration consultant and event logistics advisor.
Provide clear, actionable, and elegant advice or structured suggestions based on the user's request.
Return your answer in concise, beautifully structured JSON with an array of suggestions or formatted recommendations.`;

    const prompt = `Context:
Event: "${eventContext?.title || 'Celebration'}" (${eventContext?.type || 'Event'}, ${eventContext?.guestCount || 100} guests, budget: ${eventContext?.totalBudget || 20000} ${eventContext?.currency || 'USD'})
Section: ${sectionName}
User Request: ${instruction}

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
    const parsed = JSON.parse(rawText);
    res.json({ success: true, result: parsed });
  } catch (err: any) {
    console.error('Error in /api/ai/refine-section:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to process AI refinement',
    });
  }
});

// Dev vs Prod Vite setup
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
  console.log(`Celebration planner server running at http://0.0.0.0:${port}`);
});
