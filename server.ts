import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Resilient helper to handle temporary capacity spikes gracefully
async function generateContentWithFallback(ai: GoogleGenAI, params: any) {
  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.6-flash', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      console.log(`Attempting generation with model: ${model}`);
      const result = await ai.models.generateContent({
        ...params,
        model,
      });
      console.log(`Generation succeeded with model: ${model}`);
      return result;
    } catch (err: any) {
      console.warn(`Model ${model} generation attempt failed:`, err?.message || err);
      lastError = err;
      // Brief pause if temporary capacity spike
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }

  throw lastError;
}

// server.ts

function buildHouseholdSystemPrompt(params?: any): string {
  const diners = params?.diners || [];
  const customAiNotes = params?.customAiNotes || '';
  const cookingRules = params?.cookingRules || {};
  const dietaryRules = params?.dietaryRules || {};
  const childProtocol = params?.childProtocol;

  // 1. Dynamic portion calculation
  const totalPortions = diners.length > 0 
    ? diners.reduce((sum: number, d: any) => sum + (d.portionWeight ?? 1), 0)
    : (params?.defaultServings || 2);

  // 2. Dynamic diner list
  let dinersList = 'No individual diners specified. Cook standard balanced meals.';
  if (diners.length > 0) {
    dinersList = diners.map((d: any, idx: number) => {
      const details = [
        d.role ? `Role: ${d.role}` : '',
        d.allergens?.length ? `Allergens to avoid: ${d.allergens.join(', ')}` : '',
        d.foodPreferences?.length ? `Preferences: ${d.foodPreferences.join(', ')}` : '',
        d.dietaryNotes ? `Notes: ${d.dietaryNotes}` : ''
      ].filter(Boolean).join(' | ');
      return `${idx + 1}. ${d.name || 'Member'}: ${details || 'Standard dietary requirements'}`;
    }).join('\n');
  }

  // 3. Conditional cooking and rhythm rules
  const cookingDirectives = [
    cookingRules.maxActivePrepMinutes ? `- Active Prep Time Limit: Max ${cookingRules.maxActivePrepMinutes} minutes active prep/cooking.` : '',
    cookingRules.freshDinnersCount ? `- Dinners: ${cookingRules.freshDinnersCount} fresh cooked dinners.` : '',
    cookingRules.leftoversCount ? `- Leftovers: ${cookingRules.leftoversCount} designated leftover nights.` : '',
    cookingRules.batchLunchPrepDays?.length ? `- Batch Lunches: Prepped on ${cookingRules.batchLunchPrepDays.join(' & ')}.` : '',
    cookingRules.modularToppings ? `- Modular Elements: Serve polarizing spices or toppings in separate ramekins.` : '',
    cookingRules.crossUtilizeProduce !== false ? `- Ingredient Efficiency: Cross-utilize fresh produce across recipes to avoid waste.` : ''
  ].filter(Boolean).join('\n');

  // 4. Conditional dietary rules (only injected if set)
  const dietaryDirectives = [
    dietaryRules.strictlyDairyFree ? '- STRICTLY 100% DAIRY-FREE: No butter, cheese, cow milk, whey, or cream.' : '',
    dietaryRules.glutenFree ? '- STRICTLY GLUTEN-FREE: No wheat, barley, rye, or gluten-containing sauces.' : '',
    dietaryRules.vegetarian ? '- VEGETARIAN: No meat, poultry, or seafood.' : '',
    dietaryRules.vegan ? '- VEGAN: Strictly plant-based ingredients only.' : '',
    dietaryRules.dislikedIngredients?.length ? `- Disliked / Excluded Items: ${dietaryRules.dislikedIngredients.join(', ')}` : '',
    dietaryRules.preferredProteins?.length ? `- Preferred Proteins: ${dietaryRules.preferredProteins.join(', ')}` : '',
    dietaryRules.additionalNotes ? `- Custom Dietary Directives: ${dietaryRules.additionalNotes}` : ''
  ].filter(Boolean).join('\n');

  // 5. Conditional child / toddler rules
  let childDirectives = '';
  if (childProtocol?.enabled) {
    childDirectives = `
CHILD / SENSORY MODIFICATIONS:
- Child Name/Target: ${childProtocol.targetNames || 'Children'}
${childProtocol.deconstruct ? '- Presentation: Serve ingredients deconstructed side-by-side rather than mixed casseroles.' : ''}
${childProtocol.textureNotes ? `- Texture/Safety: ${childProtocol.textureNotes}` : ''}
${childProtocol.mildSpicing ? '- Seasoning: Keep child portions mild; provide seasonings/spices on the side for adults.' : ''}
`;
  }

  return `
You are a personalized culinary planning assistant.

HOUSEHOLD PROFILE (${totalPortions} Target Portions):
${dinersList}

COOKING & SCHEDULE CONSTRAINTS:
${cookingDirectives || '- Standard balanced home cooking schedule.'}

DIETARY & ALLERGEN REQUIREMENTS:
${dietaryDirectives || '- No special dietary exclusions; standard balanced cuisine.'}

${childDirectives}

${customAiNotes ? `USER CUSTOM INSTRUCTIONS:\n"""\n${customAiNotes}\n"""` : ''}
`.trim();
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Favicon handler to avoid 404 console errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Generate Weekly Meal Plan
app.post('/api/generate-plan', async (req, res) => {
  try {
    const {
      dinnersCount = 4,
      leftoversCount = 3,
      specialOccasions = '',
      cravingsOrPriorities = '',
      avoidIngredients = '',
      preferredStore = 'H-E-B',
      householdParameters
    } = req.body;

    const ai = getGenAI();
    const systemPrompt = buildHouseholdSystemPrompt(householdParameters);

    const userPrompt = `
Generate a complete, highly detailed, personalized, 7-day weekly meal plan and categorized grocery list based on these preferences:
- Requested Fresh Dinners: ${dinnersCount}
- Designated Leftover Nights: ${leftoversCount}
- Special Occasions or Guests: ${specialOccasions || 'None'}
- Cravings / Priorities: ${cravingsOrPriorities || 'Varied fresh high-flavor meals'}
- Ingredients to Avoid: ${avoidIngredients || 'None additional'}
- Preferred Retailer: ${preferredStore} (for categorized grocery list)

RECIPE DETAIL LEVEL GUIDELINE (CULINARY-GRADE PRECISION):
- All recipes MUST be formatted with high culinary detail matching this standard:
  * Title: Appetizing, specific dish name (e.g., "Pan-Seared Honey-Soy Atlantic Salmon with Garlic Bok Choy & Jasmine Rice").
  * Timing: Separate prepMinutes (e.g. 5) and cookMinutes (e.g. 15), totalTimeMinutes (e.g. 20).
  * Ingredients: Every ingredient must have precise measurements, packaging/cut specifications, and preparation states (e.g., "4 Atlantic Salmon Fillets (6 oz each, skin-on)", "1 lb Baby Bok Choy, halved lengthwise", "1 tbsp Fresh Ginger, grated", "3 cloves Garlic, minced"). Include any Modular Side items at the end of the ingredients list if applicable.
  * Instructions: Highly specific culinary steps detailing pan heat levels, exact sear/sauté minutes, doneness cues or internal temperatures (e.g., 145°F for salmon), sauce glazing timing, and plating instructions.
  * Toddler Modification: Specific plate modification for younger children or toddlers if present in the household (e.g., deconstructing ingredients, mild spices, soft textures, finger food portions).

Generate JSON matching this TypeScript schema:
{
  "title": string,
  "summary": string,
  "dinnersCount": number,
  "leftoverCount": number,
  "dinners": [
    {
      "id": string,
      "title": string,
      "cuisine": string,
      "flavorProfile": string,
      "day": string (e.g. "Monday (Fresh Cook)", "Tuesday (Leftover Night)"),
      "isLeftoverNight": boolean,
      "leftoverSource"?: string,
      "prepMinutes": number,
      "cookMinutes": number,
      "activePrepMinutes": number (<= 30 if fresh, or 5-10 if leftover),
      "totalTimeMinutes": number,
      "isSlowCooker": boolean,
      "servings": ${householdParameters?.servings || 4},
      "dairyFreeNotes": string (how dietary compliance and allergen safety are strictly enforced),
      "toddlerModification": {
        "title": string,
        "instructions": string,
        "fingerFoodTips": string
      },
      "modularToppings": string[] (e.g. Feta, Tzatziki, Olives on the side),
      "ingredients": [
        {
          "item": string,
          "amount": string,
          "category": "Produce" | "Meat, Poultry & Seafood" | "Pantry & Condiments" | "Refrigerated & Dairy-Free" | "Bakery & Grains" | "Spices & Seasonings" | "Household & Snacks",
          "pantryStaple"?: boolean
        }
      ],
      "instructions": string[]
    }
  ],
  "batchLunches": [
    {
      "id": string,
      "title": string,
      "prepDay": "Sunday" | "Tuesday",
      "servings": 4,
      "prepMinutes": number,
      "cookMinutes": number,
      "flavorProfile": string,
      "distinctFromDinnersReason": string,
      "workPackagingTips": string,
      "homeReheatTips": string,
      "dairyFreeNotes": string,
      "toddlerModification": {
        "title": string,
        "instructions": string,
        "fingerFoodTips": string
      },
      "ingredients": [
        {
          "item": string,
          "amount": string,
          "category": "Produce" | "Meat, Poultry & Seafood" | "Pantry & Condiments" | "Refrigerated & Dairy-Free" | "Bakery & Grains" | "Spices & Seasonings" | "Household & Snacks",
          "pantryStaple"?: boolean
        }
      ],
      "instructions": string[]
    }
  ],
  "groceryItems": [
    {
      "id": string,
      "name": string,
      "amount": string,
      "category": "Produce" | "Meat, Poultry & Seafood" | "Pantry & Condiments" | "Refrigerated & Dairy-Free" | "Bakery & Grains" | "Spices & Seasonings" | "Household & Snacks",
      "completed": false,
      "sourceRecipe": string,
      "isPantryStaple"?: boolean
    }
  ]
}

Ensure all 7 days of the week are covered in "dinners" (combining fresh cooks and leftover nights).
`;

    const response = await generateContentWithFallback(ai, {
      contents: [
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.3,
      }
    });

    const text = response.text || '';
    // Strip markdown formatting if it exists
    const cleanText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsedData = JSON.parse(cleanText);

    parsedData.id = 'plan-' + Date.now();
    parsedData.weekOf = 'Week of ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    res.json(parsedData);
  } catch (err: any) {
    console.error('Plan generation error:', err);
    res.status(500).json({
      error: 'Failed to generate plan with AI',
      details: err.message
    });
  }
});

// Swap or regenerate a single recipe
app.post('/api/swap-recipe', async (req, res) => {
  try {
    const { recipeId, currentTitle, cuisine, reason = 'Want a different flavor profile', householdParameters } = req.body;
    const ai = getGenAI();
    const systemPrompt = buildHouseholdSystemPrompt(householdParameters);

    const swapPrompt = `
Generate a replacement dinner recipe for a family meal with high culinary detail.
Current recipe being replaced: "${currentTitle}" (${cuisine}).
User request/reason: "${reason}".

Must adhere strictly to:
- All household dietary rules, allergen constraints, and custom AI directives specified in system instructions.
- Active prep <= 30 mins or hands-off slow cooker.
- Include deconstructed child/toddler plate modification if applicable.
- Modular toppings on side if polarizing flavors or dairy/cheeses are used.
- High culinary detail: exact ingredient measurements and prep states, detailed step-by-step instructions with heat levels, sear times, doneness cues, and plating tips.

Respond with JSON for a single Recipe object:
{
  "id": "${recipeId || 'swapped-' + Date.now()}",
  "title": string,
  "cuisine": string,
  "flavorProfile": string,
  "day": string,
  "isLeftoverNight": false,
  "prepMinutes": number,
  "cookMinutes": number,
  "activePrepMinutes": number,
  "totalTimeMinutes": number,
  "isSlowCooker": boolean,
  "servings": 4,
  "dairyFreeNotes": string,
  "toddlerModification": {
    "title": string,
    "instructions": string,
    "fingerFoodTips": string
  },
  "modularToppings": string[],
  "ingredients": [
    {
      "item": string,
      "amount": string,
      "category": "Produce" | "Meat, Poultry & Seafood" | "Pantry & Condiments" | "Refrigerated & Dairy-Free" | "Bakery & Grains" | "Spices & Seasonings" | "Household & Snacks",
      "pantryStaple"?: boolean
    }
  ],
  "instructions": string[]
}
`;

    const response = await generateContentWithFallback(ai, {
      contents: [{ role: 'user', parts: [{ text: swapPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.4
      }
    });

    const cleanText = (response.text || '{}').replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleanText);
    res.json(parsed);
  } catch (err: any) {
    console.error('Swap recipe error:', err);
    res.status(500).json({ error: 'Failed to swap recipe', details: err.message });
  }
});

// Vite middleware setup
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Culinary Grocery Assistant server listening on http://0.0.0.0:${PORT}`);
  });

  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

setupVite();
