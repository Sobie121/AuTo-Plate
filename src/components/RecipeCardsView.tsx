import React, { useState } from 'react';
import {
  Clock,
  Baby,
  ShieldCheck,
  Layers,
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle2,
  RefreshCw,
  Utensils,
  FileDown,
  FileText
} from 'lucide-react';
import { Recipe } from '../types';
import { exportRecipeToPdf } from '../utils/pdfExport';

interface RecipeCardsViewProps {
  dinners: Recipe[];
  selectedRecipeId: string;
  onSelectRecipe: (id: string) => void;
  onSwapRecipe: (recipe: Recipe, reason: string) => void;
  isSwapping: boolean;
  onExportBatchPdf?: () => void;
}

export const RecipeCardsView: React.FC<RecipeCardsViewProps> = ({
  dinners,
  selectedRecipeId,
  onSelectRecipe,
  onSwapRecipe,
  isSwapping,
  onExportBatchPdf,
}) => {
  const currentRecipe = dinners.find((d) => d.id === selectedRecipeId) || dinners[0];
  const [swapReason, setSwapReason] = useState('');
  const [showSwapPrompt, setShowSwapPrompt] = useState(false);

  if (!currentRecipe) return null;

  const handleSwapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSwapRecipe(currentRecipe, swapReason || 'Different flavor or protein');
    setShowSwapPrompt(false);
    setSwapReason('');
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl overflow-hidden shadow-[0_8px_20px_-4px_rgba(45,42,38,0.06),0_4px_8px_-2px_rgba(45,42,38,0.04)]">
      {/* Recipe Header Bar */}
      <div className="bg-[#F8F5EE]/80 border-b border-[#EADBCE] px-6 py-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs text-[#706B63] font-medium">
          <span className="h-2 w-2 rounded-full bg-[#697A53]" />
          <span className="font-semibold text-[#2D2A26]">{currentRecipe.day.split(' ')[0]} Dinner Recipe</span>
          <span className="text-[#EADBCE]">•</span>
          <span>{currentRecipe.servings || 4} Portions</span>
        </div>

        {onExportBatchPdf && (
          <button
            onClick={onExportBatchPdf}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#5D6A74] border border-[#EADBCE] transition flex items-center space-x-1.5 shrink-0 shadow-xs"
            title="Download full weekly meal guide PDF with all recipes & batch lunches"
          >
            <FileText className="h-3.5 w-3.5 text-[#5D6A74]" />
            <span>Export All (PDF)</span>
          </button>
        )}
      </div>

      <div className="p-6 sm:p-8">
        {/* Title and Top Badges */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-6 border-b border-[#EADBCE]">
          <div>
            <div className="flex items-center space-x-2 mb-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#697A53] bg-[#697A53]/10 px-2.5 py-0.5 rounded-full border border-[#697A53]/20">
                {currentRecipe.isSlowCooker
                  ? 'SLOW COOKER DINNER'
                  : currentRecipe.isLeftoverNight
                  ? 'LEFTOVER ENCORE'
                  : 'FRESH DINNER'}
              </span>
              <span className="text-[#EADBCE]">•</span>
              <span className="text-xs text-[#2D2A26] font-medium">{currentRecipe.cuisine}</span>
              <span className="text-[#EADBCE]">•</span>
              <span className="text-xs text-[#706B63]">{currentRecipe.day}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] tracking-tight">
              {currentRecipe.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#706B63]">
              {currentRecipe.prepMinutes !== undefined && currentRecipe.cookMinutes !== undefined ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F8F5EE] text-[#2D2A26] font-medium text-xs border border-[#EADBCE]">
                  Prep {currentRecipe.prepMinutes} min • Cook {currentRecipe.cookMinutes} min • {currentRecipe.servings || 4} Portions
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F8F5EE] text-[#2D2A26] font-medium text-xs border border-[#EADBCE]">
                  Active Prep {currentRecipe.activePrepMinutes} min • Total {currentRecipe.totalTimeMinutes} min • {currentRecipe.servings || 4} Portions
                </span>
              )}
              <span className="text-[#EADBCE]">•</span>
              <span className="text-[#706B63] italic">Flavor: {currentRecipe.flavorProfile}</span>
            </div>
          </div>

          {/* Quick Metrics, Export PDF & Swap Button */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => exportRecipeToPdf(currentRecipe)}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#5D6A74] border border-[#EADBCE] transition flex items-center space-x-1.5 shadow-xs"
              title="Download PDF for this individual recipe"
            >
              <FileDown className="h-3.5 w-3.5 text-[#5D6A74]" />
              <span>Export Recipe PDF</span>
            </button>

            {!currentRecipe.isLeftoverNight && (
              <button
                onClick={() => setShowSwapPrompt(!showSwapPrompt)}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#F4C95D]/20 hover:bg-[#F4C95D]/30 text-[#2D2A26] border border-[#F4C95D]/40 transition flex items-center space-x-1.5"
                title="Swap this recipe with a compliant alternative"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-[#697A53] ${isSwapping ? 'animate-spin' : ''}`} />
                <span>Swap Recipe</span>
              </button>
            )}
          </div>
        </div>

        {/* Swap Prompt Accordion */}
        {showSwapPrompt && (
          <form onSubmit={handleSwapSubmit} className="my-5 p-5 rounded-2xl bg-[#F8F5EE] border border-[#EADBCE] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2D2A26] flex items-center">
                <Sparkles className="h-4 w-4 mr-1.5 text-[#697A53]" />
                Swap "{currentRecipe.title}" with Gemini AI
              </span>
              <button
                type="button"
                onClick={() => setShowSwapPrompt(false)}
                className="text-xs text-[#706B63] hover:text-[#2D2A26]"
              >
                Cancel
              </button>
            </div>
            <input
              type="text"
              placeholder="What would you prefer instead? (e.g. Hawaiian BBQ Chicken, Sheet pan salmon, Greek lemon potatoes...)"
              value={swapReason}
              onChange={(e) => setSwapReason(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-3.5 py-2 text-xs text-[#2D2A26] placeholder-[#706B63]/60 focus:outline-none focus:ring-2 focus:ring-[#697A53]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSwapping}
                className="px-4 py-2 rounded-full text-xs font-bold bg-[#F4C95D] hover:bg-[#ebbd4d] text-[#2D2A26] flex items-center space-x-1.5 transition disabled:opacity-50 shadow-xs"
              >
                {isSwapping ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Finding Compliant Alternative...</span>
                  </>
                ) : (
                  <span>Generate Alternative</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Primary Culinary Layout: Ingredients & Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-7">
          {/* Left Column: INGREDIENTS (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2A26] border-b border-[#EADBCE] pb-2.5 flex items-center justify-between">
              <span className="flex items-center">
                <Utensils className="h-3.5 w-3.5 mr-2 text-[#697A53]" />
                INGREDIENTS
              </span>
              <span className="text-[11px] font-medium text-[#706B63]">4 Portions</span>
            </h3>

            <ul className="space-y-2.5 text-xs">
              {currentRecipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-[#2D2A26] leading-relaxed">
                  <span className="text-[#697A53] text-sm leading-none mt-0.5">•</span>
                  <div className="flex-1 flex items-baseline justify-between gap-2">
                    <span className="text-[#2D2A26] font-medium">{ing.item}</span>
                    <span className="text-[#706B63] font-mono text-[11px] shrink-0 font-medium">{ing.amount}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: STEPS (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2A26] border-b border-[#EADBCE] pb-2.5 flex items-center">
              <Clock className="h-3.5 w-3.5 mr-2 text-[#697A53]" />
              STEPS
            </h3>

            <ol className="space-y-3.5 text-xs">
              {currentRecipe.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-[#2D2A26] leading-relaxed">
                  <span className="h-5 w-5 rounded-full bg-[#697A53]/15 text-[#697A53] flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="flex-1 text-[#2D2A26]">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Highlight Callout Box: Child / Toddler Plate Modification */}
        {currentRecipe.toddlerModification && (
          <div className="my-6 p-4 sm:p-5 rounded-2xl bg-[#F8F5EE] border border-[#EADBCE] shadow-xs">
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-[#697A53]/15 text-[#697A53] flex items-center justify-center shrink-0 mt-0.5">
                <Baby className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#2D2A26] block mb-1">
                  {currentRecipe.toddlerModification.title || 'Child / Toddler Plate Modification:'}
                </span>
                <p className="text-xs text-[#706B63] leading-relaxed">
                  {currentRecipe.toddlerModification.instructions}
                </p>
                {currentRecipe.toddlerModification.fingerFoodTips && (
                  <p className="text-[11px] text-[#697A53] mt-1.5 font-medium italic">
                    Tip: {currentRecipe.toddlerModification.fingerFoodTips}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dietary & Modular Side Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#EADBCE]">
          {/* Dietary Compliance */}
          <div className="p-4 rounded-2xl bg-[#697A53]/10 border border-[#697A53]/25">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#697A53] mb-1.5">
              <ShieldCheck className="h-4 w-4 text-[#697A53]" />
              <span>Dietary & Allergen Protocol</span>
            </div>
            <p className="text-xs text-[#2D2A26] leading-relaxed">
              {currentRecipe.dairyFreeNotes}
            </p>
          </div>

          {/* Modular Toppings on the Side */}
          <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#EADBCE]">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#2D2A26] mb-1.5">
              <Layers className="h-4 w-4 text-[#697A53]" />
              <span>Modular Toppings (Served on the Side)</span>
            </div>
            <p className="text-xs text-[#706B63] leading-relaxed">
              {currentRecipe.modularToppings && currentRecipe.modularToppings.length > 0
                ? currentRecipe.modularToppings.join(' • ')
                : 'Serve high-heat sauces, cheeses, and olives strictly on the side in separate ramekins.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
