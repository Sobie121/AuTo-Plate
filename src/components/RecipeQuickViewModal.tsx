import React, { useState } from 'react';
import {
  X,
  Clock,
  Flame,
  UtensilsCrossed,
  Baby,
  ShieldCheck,
  FileDown,
  RefreshCw,
  Sparkles,
  Check,
  CheckSquare,
  Minus,
  Plus
} from 'lucide-react';
import { Recipe } from '../types';
import { exportRecipeToPdf } from '../utils/pdfExport';

interface RecipeQuickViewModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onSwapRecipe?: (recipe: Recipe, reason: string) => void;
  isSwapping?: boolean;
}

export const RecipeQuickViewModal: React.FC<RecipeQuickViewModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onSwapRecipe,
  isSwapping = false,
}) => {
  const [portions, setPortions] = useState<number>(recipe?.servings || 4);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [showSwapPrompt, setShowSwapPrompt] = useState(false);
  const [swapReason, setSwapReason] = useState('');

  if (!isOpen || !recipe) return null;

  // Scale ingredient quantities based on portions stepper
  const baseServings = recipe.servings || 4;
  const scaleRatio = portions / baseServings;

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleSwapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSwapRecipe) {
      onSwapRecipe(recipe, swapReason || 'Prefer different flavor profile or lean protein');
      setShowSwapPrompt(false);
      setSwapReason('');
    }
  };

  // Helper to visually adjust amounts if they have numbers
  const formatScaledAmount = (amountStr: string) => {
    if (scaleRatio === 1) return amountStr;
    const match = amountStr.match(/^([\d./]+)\s*(.*)$/);
    if (!match) return amountStr;
    const numPart = parseFloat(match[1]);
    if (isNaN(numPart)) return amountStr;
    const scaled = (numPart * scaleRatio);
    const rounded = Number.isInteger(scaled) ? scaled : scaled.toFixed(1);
    return `${rounded} ${match[2]}`.trim();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D2A26]/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      {/* Floating Quick-View Card positioned over the planner */}
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl sm:rounded-3xl shadow-[0_20px_40px_-8px_rgba(45,42,38,0.18)] text-[#2D2A26] overflow-hidden my-6">
        
        {/* Header with Recipe Title & Close Button (✕) */}
        <div className="px-6 py-4 border-b border-[#EADBCE] flex items-center justify-between bg-[#F8F5EE]/60">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-[#697A53]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#697A53]">
              {recipe.day} Recipe Quick-View
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#706B63] hover:text-[#2D2A26] rounded-full hover:bg-[#FFFFFF] border border-transparent hover:border-[#EADBCE] transition shadow-xs"
            title="Close Quick-View"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto no-scrollbar">
          
          {/* Centered Squircle Food Thumbnail & Header Details */}
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Squircle Food Thumbnail */}
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-[#F8F5EE] border-2 border-[#EADBCE] flex items-center justify-center text-[#697A53] shadow-[0_8px_20px_-4px_rgba(45,42,38,0.08)] relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-[#F4C95D]/15 via-transparent to-[#697A53]/10" />
              <UtensilsCrossed className="h-10 w-10 sm:h-12 sm:w-12 text-[#697A53] relative z-10" />
            </div>

            <div className="max-w-md">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2A26] tracking-tight leading-tight">
                {recipe.title}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-[#706B63] mt-1">
                {recipe.cuisine} • <span className="italic">{recipe.flavorProfile}</span>
              </p>
            </div>

            {/* Dietary Badges: Small circular/pill tags in soft yellow & olive */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#697A53]/15 text-[#697A53] border border-[#697A53]/30">
                100% Dairy-Free
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F4C95D]/25 text-[#2D2A26] border border-[#F4C95D]/40">
                GF / Soy Safe
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F4C95D]/25 text-[#2D2A26] border border-[#F4C95D]/40">
                Toddler Friendly
              </span>
              {recipe.isSlowCooker && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#697A53]/15 text-[#697A53] border border-[#697A53]/30 flex items-center">
                  <Flame className="h-3 w-3 mr-1 text-[#F4C95D]" /> Slow Cooker
                </span>
              )}
            </div>

            {/* Interactive Portion Stepper: [ - ] 4 [ + ] inside a rounded pill enclosure */}
            <div className="pt-2">
              <div className="inline-flex items-center bg-[#F8F5EE] border border-[#EADBCE] rounded-full p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setPortions(prev => Math.max(1, prev - 1))}
                  className="h-8 w-8 rounded-full bg-[#FFFFFF] text-[#2D2A26] hover:bg-[#EADBCE]/50 flex items-center justify-center transition border border-[#EADBCE] shadow-xs active:scale-95"
                  title="Decrease portions"
                  aria-label="Decrease portions"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <div className="px-4 text-xs font-bold text-[#2D2A26] min-w-[90px] text-center">
                  {portions} Portions
                </div>
                <button
                  type="button"
                  onClick={() => setPortions(prev => Math.min(12, prev + 1))}
                  className="h-8 w-8 rounded-full bg-[#FFFFFF] text-[#2D2A26] hover:bg-[#EADBCE]/50 flex items-center justify-center transition border border-[#EADBCE] shadow-xs active:scale-95"
                  title="Increase portions"
                  aria-label="Increase portions"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="block text-[11px] text-[#706B63] mt-1 font-medium">
                Ingredient amounts auto-scale to portion count
              </span>
            </div>
          </div>

          {/* Quick Metrics & Actions Bar */}
          <div className="flex items-center justify-between border-y border-[#EADBCE] py-3 text-xs text-[#706B63]">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center font-semibold text-[#2D2A26]">
                <Clock className="h-3.5 w-3.5 mr-1 text-[#697A53]" />
                {recipe.activePrepMinutes}m prep
              </span>
              <span>•</span>
              <span>{recipe.totalTimeMinutes}m total</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => exportRecipeToPdf(recipe)}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#5D6A74] border border-[#EADBCE] transition shadow-xs"
                title="Export this recipe as PDF"
              >
                <FileDown className="h-3.5 w-3.5 mr-1 text-[#5D6A74]" />
                PDF
              </button>

              {!recipe.isLeftoverNight && onSwapRecipe && (
                <button
                  onClick={() => setShowSwapPrompt(!showSwapPrompt)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#F4C95D] hover:bg-[#ebbd4d] text-[#2D2A26] transition shadow-xs"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isSwapping ? 'animate-spin' : ''}`} />
                  Swap
                </button>
              )}
            </div>
          </div>

          {/* Swap Recipe Accordion Form */}
          {showSwapPrompt && (
            <form onSubmit={handleSwapSubmit} className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#EADBCE] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2D2A26] flex items-center">
                  <Sparkles className="h-3.5 w-3.5 mr-1 text-[#697A53]" />
                  Swap Recipe with Gemini AI
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
                placeholder="What flavor, cuisine, or protein would you prefer? (e.g. Greek ground turkey bowl)"
                value={swapReason}
                onChange={(e) => setSwapReason(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-3.5 py-2 text-xs text-[#2D2A26] placeholder-[#706B63] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
              />
              <button
                type="submit"
                disabled={isSwapping}
                className="w-full py-2 text-xs font-bold rounded-full bg-[#F4C95D] hover:bg-[#ebbd4d] text-[#2D2A26] transition disabled:opacity-50"
              >
                {isSwapping ? 'Generating alternative...' : 'Find Safe Alternative'}
              </button>
            </form>
          )}

          {/* Ingredients Section: 2-column checklist with rounded checkbox squares */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2D2A26] flex items-center">
                <UtensilsCrossed className="h-4 w-4 mr-1.5 text-[#697A53]" />
                Ingredients Checklist ({recipe.ingredients.length})
              </h3>
              <span className="text-xs text-[#706B63] font-medium">
                Tap to check off while cooking
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = !!checkedIngredients[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className={`flex items-start space-x-2.5 p-2.5 rounded-xl border transition cursor-pointer select-none ${
                      isChecked
                        ? 'bg-[#F8F5EE]/80 border-[#EADBCE] opacity-60'
                        : 'bg-[#FFFFFF] border-[#EADBCE] hover:border-[#697A53]/50'
                    }`}
                  >
                    {/* Rounded checkbox square */}
                    <div
                      className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isChecked
                          ? 'bg-[#697A53] border-[#697A53] text-[#FFFFFF]'
                          : 'border-[#EADBCE] bg-[#FFFFFF]'
                      }`}
                    >
                      {isChecked && <Check className="h-3.5 w-3.5" />}
                    </div>

                    <div className="text-xs leading-snug">
                      <span className={`font-medium ${isChecked ? 'line-through text-[#706B63]' : 'text-[#2D2A26]'}`}>
                        {formatScaledAmount(ing.amount)} {ing.item}
                      </span>
                      {ing.pantryStaple && (
                        <span className="ml-1 text-[10px] text-[#706B63] font-normal">
                          (Pantry)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Cooking Instructions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#2D2A26]">
              Step-by-Step Instructions
            </h3>
            <ol className="space-y-2.5 text-xs text-[#2D2A26] leading-relaxed">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-[#F8F5EE]/60 border border-[#EADBCE]/80">
                  <span className="h-5 w-5 rounded-full bg-[#697A53] text-[#FFFFFF] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Household Customizations: Plate Modification & Modular Toppings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Child / Toddler Plate Modification */}
            <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#EADBCE] space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#2D2A26]">
                <Baby className="h-3.5 w-3.5 text-[#697A53]" />
                <span>{recipe.toddlerModification.title || 'Child / Toddler Modification'}</span>
              </div>
              <p className="text-xs text-[#706B63] leading-relaxed">
                {recipe.toddlerModification.instructions}
              </p>
              {recipe.toddlerModification.fingerFoodTips && (
                <p className="text-[11px] text-[#697A53] font-medium mt-1">
                  Tip: {recipe.toddlerModification.fingerFoodTips}
                </p>
              )}
            </div>

            {/* Modular Toppings */}
            <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#EADBCE] space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#2D2A26]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#697A53]" />
                <span>Modular Toppings (On the Side)</span>
              </div>
              <p className="text-xs text-[#706B63] leading-relaxed">
                {recipe.modularToppings && recipe.modularToppings.length > 0
                  ? recipe.modularToppings.join(' • ')
                  : 'Modular spices, cheeses & sauces served in side ramekins.'}
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EADBCE] bg-[#F8F5EE]/60 flex items-center justify-between">
          <span className="text-xs font-medium text-[#706B63]">
            {recipe.dairyFreeNotes || '100% Dairy-Free compliant for Taryn'}
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-bold bg-[#697A53] hover:bg-[#596945] text-[#FFFFFF] transition shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
