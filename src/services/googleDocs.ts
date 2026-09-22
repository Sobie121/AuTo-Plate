import { PERMANENT_GOOGLE_DOC_ID, WeeklyPlan, HouseholdParameters } from '../types';

export interface DocUpdateResult {
  success: boolean;
  message: string;
  docUrl: string;
  updatedAt?: string;
  error?: string;
}

export function generateDocPlainText(plan: WeeklyPlan, householdParameters?: HouseholdParameters): string {
  const lines: string[] = [];

  lines.push('================================================================================');
  lines.push(' LIVE WEEKLY MEAL PLANNER');
  lines.push(` Plan: ${plan.title}`);
  lines.push(` Week Of: ${plan.weekOf}`);
  lines.push(` Last Updated: ${new Date().toLocaleString()}`);
  lines.push('================================================================================');
  lines.push('');
  lines.push('HOUSEHOLD DIETARY COMPLIANCE:');

  if (householdParameters && householdParameters.diners && householdParameters.diners.length > 0) {
    householdParameters.diners.forEach(diner => {
      const parts = [
        diner.relativeAge ? `Age: ${diner.relativeAge}` : '',
        diner.dietaryBadge,
        diner.allergens && diner.allergens.length > 0 ? `Avoids: ${diner.allergens.join(', ')}` : '',
        diner.foodPreferences && diner.foodPreferences.length > 0 ? `Preferences: ${diner.foodPreferences.join(', ')}` : '',
        diner.dietaryDescription,
      ].filter(Boolean);
      lines.push(`• ${diner.name} (${diner.role}): ${parts.join(' | ')}`);
    });
  } else {
    lines.push('• Standard household dietary rules and balanced family portions.');
  }

  if (householdParameters?.customAiNotes) {
    lines.push('');
    lines.push('AI DIRECTIVES:');
    lines.push(householdParameters.customAiNotes);
  }

  lines.push('');
  lines.push('SUMMARY:');
  lines.push(plan.summary);
  lines.push('');
  lines.push('-------------------------------- PAGE BREAK --------------------------------');
  lines.push('');
  lines.push('SECTION 1: WEEKLY DINNER SCHEDULE');
  lines.push('');

  plan.dinners.forEach((dinner, idx) => {
    lines.push(`[Day ${idx + 1}] ${dinner.day}: ${dinner.title}`);
    lines.push(`  • Cuisine & Flavor: ${dinner.cuisine} — ${dinner.flavorProfile}`);
    lines.push(`  • Prep & Cook Time: ${dinner.activePrepMinutes} mins active | ${dinner.totalTimeMinutes} mins total`);
    if (dinner.isLeftoverNight) {
      lines.push(`  • Leftover Source: ${dinner.leftoverSource || 'Previous fresh cook'}`);
    }
    if (dinner.isSlowCooker) {
      lines.push('  • Cooking Style: Hands-off Crockpot / Slow Cooker');
    }
    lines.push(`  • Modular Toppings (Side): ${dinner.modularToppings.join(', ')}`);
    lines.push('');
  });

  lines.push('-------------------------------- PAGE BREAK --------------------------------');
  lines.push('');
  lines.push('SECTION 2: DETAILED RECIPE CARDS');
  lines.push('');

  plan.dinners.forEach((dinner, idx) => {
    lines.push(`RECIPE #${idx + 1}: ${dinner.title.toUpperCase()}`);
    lines.push(`Day: ${dinner.day} | Servings: ${dinner.servings} portions`);
    lines.push(`Active Prep Time: ${dinner.activePrepMinutes} mins (Max 30m rule) | Total: ${dinner.totalTimeMinutes} mins`);
    lines.push(`Dairy-Free Compliance: ${dinner.dairyFreeNotes}`);
    lines.push('');
    lines.push(`TODDLER MODIFICATION (${dinner.toddlerModification.title}):`);
    lines.push(`Instructions: ${dinner.toddlerModification.instructions}`);
    lines.push(`Finger-Food Safety: ${dinner.toddlerModification.fingerFoodTips}`);
    lines.push('');
    lines.push(`MODULAR TOPPINGS (SERVED ON THE SIDE):`);
    dinner.modularToppings.forEach(top => lines.push(`  [ ] ${top}`));
    lines.push('');
    lines.push('INGREDIENTS:');
    dinner.ingredients.forEach(ing => {
      lines.push(`  - ${ing.amount} ${ing.item} (${ing.category})${ing.pantryStaple ? ' [Pantry Staple]' : ''}`);
    });
    lines.push('');
    lines.push('STEP-BY-STEP INSTRUCTIONS:');
    dinner.instructions.forEach((step, sIdx) => {
      lines.push(`  ${sIdx + 1}. ${step}`);
    });
    lines.push('');
    lines.push('-------------------------------- PAGE BREAK --------------------------------');
    lines.push('');
  });

  lines.push('SECTION 3: DISTINCT BATCH LUNCHES (PREPPED OFF-DAYS)');
  lines.push('');

  plan.batchLunches.forEach((lunch, idx) => {
    lines.push(`BATCH LUNCH #${idx + 1}: ${lunch.title.toUpperCase()} (Prep: ${lunch.prepDay})`);
    lines.push(`Servings: ${lunch.servings} | Flavor: ${lunch.flavorProfile}`);
    lines.push(`Why Distinct from Dinners: ${lunch.distinctFromDinnersReason}`);
    lines.push(`Work Packaging (Stephen & Taryn): ${lunch.workPackagingTips}`);
    lines.push(`Home Reheat (Sara & Logan): ${lunch.homeReheatTips}`);
    lines.push(`Toddler Modification: ${lunch.toddlerModification.instructions}`);
    lines.push('');
    lines.push('Ingredients:');
    lunch.ingredients.forEach(ing => lines.push(`  - ${ing.amount} ${ing.item}`));
    lines.push('');
    lines.push('Prep Instructions:');
    lunch.instructions.forEach((step, sIdx) => lines.push(`  ${sIdx + 1}. ${step}`));
    lines.push('');
    lines.push('-------------------------------- PAGE BREAK --------------------------------');
    lines.push('');
  });

  lines.push('SECTION 4: CATEGORIZED GROCERY LIST (FOR KEEP & INSTACART)');
  lines.push('');

  // Group by category
  const categories: string[] = [
    'Produce',
    'Meat, Poultry & Seafood',
    'Refrigerated & Dairy-Free',
    'Bakery & Grains',
    'Pantry & Condiments',
    'Spices & Seasonings',
    'Household & Snacks'
  ];

  categories.forEach(cat => {
    const items = plan.groceryItems.filter(i => i.category === cat);
    if (items.length > 0) {
      lines.push(`[${cat.toUpperCase()}]`);
      items.forEach(item => {
        lines.push(`  [${item.completed ? 'x' : ' '}] ${item.amount} ${item.name}${item.sourceRecipe ? ` (${item.sourceRecipe})` : ''}`);
      });
      lines.push('');
    }
  });

  return lines.join('\n');
}

export async function updatePermanentGoogleDoc(
  accessToken: string,
  plan: WeeklyPlan,
  householdParameters?: HouseholdParameters
): Promise<DocUpdateResult> {
  const docId = PERMANENT_GOOGLE_DOC_ID;
  const docUrl = `https://docs.google.com/document/d/${docId}/edit`;

  try {
    // 1. Fetch current document metadata to find end index
    const getRes = await fetch(`https://docs.googleapis.com/v1/documents/${docId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!getRes.ok) {
      const errData = await getRes.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Failed to fetch document: HTTP ${getRes.status}`);
    }

    const docData = await getRes.json();
    const content = docData.body?.content || [];
    let endIndex = 1;
    if (content.length > 0) {
      const lastElem = content[content.length - 1];
      endIndex = lastElem.endIndex || 1;
    }

    // 2. Prepare batchUpdate requests
    // First clear existing content if endIndex > 2
    const requests: any[] = [];
    if (endIndex > 2) {
      requests.push({
        deleteContentRange: {
          range: {
            startIndex: 1,
            endIndex: endIndex - 1,
          },
        },
      });
    }

    // Insert new formatted text at index 1
    const textToInsert = generateDocPlainText(plan, householdParameters);
    requests.push({
      insertText: {
        location: {
          index: 1,
        },
        text: textToInsert,
      },
    });

    const updateRes = await fetch(
      `https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests }),
      }
    );

    if (!updateRes.ok) {
      const updateErr = await updateRes.json().catch(() => ({}));
      throw new Error(updateErr.error?.message || `Google Docs update failed with HTTP ${updateRes.status}`);
    }

    return {
      success: true,
      message: 'Successfully updated Live Weekly Meal Planner Google Doc with latest recipes and grocery list!',
      docUrl,
      updatedAt: new Date().toLocaleTimeString(),
    };
  } catch (err: any) {
    console.error('Google Docs update error:', err);
    return {
      success: false,
      message: err.message || 'Error communicating with Google Docs API',
      docUrl,
      error: err.message,
    };
  }
}
