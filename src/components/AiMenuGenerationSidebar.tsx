import React, { useState, useEffect } from 'react';
import { Sparkles, X, Minus, Plus, Users, Calendar, ShoppingCart, AlertCircle, Utensils } from 'lucide-react';
import { QuestionnaireAnswers, HouseholdParameters } from '../types';

interface AiMenuGenerationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (answers: QuestionnaireAnswers) => void;
  isLoading: boolean;
  householdParameters?: HouseholdParameters;
}

export const AiMenuGenerationSidebar: React.FC<AiMenuGenerationSidebarProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  householdParameters,
}) => {
  // Derive default portion count from configured diners if available
  const defaultCalculatedPortions = householdParameters?.diners && householdParameters.diners.length > 0
    ? Math.max(1, Math.round(householdParameters.diners.reduce((sum, d) => sum + (d.portionMultiplier ?? (d.requiresAdultPortion ? 1 : 0.5)), 0)))
    : 4;

  const [portions, setPortions] = useState<number>(defaultCalculatedPortions);
  const [dinnerDays, setDinnerDays] = useState<number>(householdParameters?.cookingRules?.freshDinnersCount ?? 4);
  const [leftoverDays, setLeftoverDays] = useState<number>(householdParameters?.cookingRules?.leftoversCount ?? 3);
  const [batchLunches, setBatchLunches] = useState<number>(2);
  const [specialOccasions, setSpecialOccasions] = useState<string>('');
  const [cravings, setCravings] = useState<string>('');
  const [avoid, setAvoid] = useState<string>('');
  const [preferredStore, setPreferredStore] = useState<'H-E-B' | 'Walmart' | 'Kroger'>(
    (householdParameters as any)?.preferredStore || 'H-E-B'
  );

  // Sync state whenever sidebar is opened or parameters change
  useEffect(() => {
    if (isOpen && householdParameters) {
      if (householdParameters.diners && householdParameters.diners.length > 0) {
        const calculated = Math.max(1, Math.round(
          householdParameters.diners.reduce((sum, d) => sum + (d.portionMultiplier ?? (d.requiresAdultPortion ? 1 : 0.5)), 0)
        ));
        setPortions(calculated);
      }
      if (householdParameters.cookingRules?.freshDinnersCount) {
        setDinnerDays(householdParameters.cookingRules.freshDinnersCount);
      }
      if (householdParameters.cookingRules?.leftoversCount !== undefined) {
        setLeftoverDays(householdParameters.cookingRules.leftoversCount);
      }
      if ((householdParameters as any)?.preferredStore) {
        setPreferredStore((householdParameters as any).preferredStore);
      }
    }
  }, [isOpen, householdParameters]);

  if (!isOpen) return null;

  // Handle auto-adjustment: Leftover days counter auto-adjusts based on Dinner Days
  const handleDinnerDaysChange = (newDinnerDays: number) => {
    const clamped = Math.max(1, Math.min(7, newDinnerDays));
    setDinnerDays(clamped);
    setLeftoverDays(Math.max(0, 7 - clamped));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      dinnersCount: dinnerDays,
      leftoversCount: leftoverDays,
      portions,
      batchLunchesCount: batchLunches,
      specialOccasions,
      cravingsOrPriorities: cravings,
      avoidIngredients: avoid,
      preferredStore,
      householdParameters,
    });
  };

  const hasChildren = householdParameters?.diners?.some(
    (d) => d.relativeAge === 'Toddler (1-3)' || d.relativeAge === 'Child (4-12)'
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#2D2A26]/40 backdrop-blur-xs flex justify-end">
      {/* Sidebar Panel sliding from right */}
      <div className="w-full max-w-lg bg-[#FFFFFF] border-l border-[#EADBCE] shadow-[0_20px_40px_-8px_rgba(45,42,38,0.2)] flex flex-col h-full overflow-hidden text-[#2D2A26] animate-in slide-in-from-right duration-200">
        
        {/* Sidebar Header */}
        <div className="px-6 py-4 border-b border-[#EADBCE] bg-[#F8F5EE]/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-[#F4C95D]/25 text-[#2D2A26] flex items-center justify-center border border-[#F4C95D]/40 shadow-xs">
              <Sparkles className="h-5 w-5 text-[#2D2A26]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#2D2A26] tracking-tight">
                AI Menu Generation
              </h2>
              <p className="text-xs text-[#706B63]">
                Configure Next Week's Culinary Plan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-[#706B63] hover:text-[#2D2A26] rounded-full hover:bg-[#FFFFFF] border border-transparent hover:border-[#EADBCE] transition shadow-xs"
            title="Close panel"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar">
          
          {/* Quick Preset Rhythms */}
          <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#EADBCE] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block">
              Quick Weekly Presets
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setDinnerDays(4);
                  setLeftoverDays(3);
                }}
                className={`py-2 px-1 rounded-xl text-center font-bold border transition ${
                  dinnerDays === 4 && leftoverDays === 3
                    ? 'bg-[#697A53] border-[#697A53] text-[#FFFFFF] shadow-xs'
                    : 'bg-[#FFFFFF] border-[#EADBCE] text-[#2D2A26] hover:bg-[#F8F5EE]'
                }`}
              >
                Standard (4+3)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDinnerDays(5);
                  setLeftoverDays(2);
                }}
                className={`py-2 px-1 rounded-xl text-center font-bold border transition ${
                  dinnerDays === 5 && leftoverDays === 2
                    ? 'bg-[#697A53] border-[#697A53] text-[#FFFFFF] shadow-xs'
                    : 'bg-[#FFFFFF] border-[#EADBCE] text-[#2D2A26] hover:bg-[#F8F5EE]'
                }`}
              >
                Active (5+2)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDinnerDays(3);
                  setLeftoverDays(4);
                }}
                className={`py-2 px-1 rounded-xl text-center font-bold border transition ${
                  dinnerDays === 3 && leftoverDays === 4
                    ? 'bg-[#697A53] border-[#697A53] text-[#FFFFFF] shadow-xs'
                    : 'bg-[#FFFFFF] border-[#EADBCE] text-[#2D2A26] hover:bg-[#F8F5EE]'
                }`}
              >
                Easy (3+4)
              </button>
            </div>
          </div>

          {/* Portions Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#2D2A26] flex items-center justify-between">
              <span>Portions per Meal</span>
              <span className="text-[#706B63] font-normal normal-case">
                {hasChildren ? 'Adults + Child Modifications' : 'Standard Servings'}
              </span>
            </label>
            <select
              value={portions}
              onChange={(e) => setPortions(parseInt(e.target.value) || 4)}
              className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-4 py-2.5 text-sm font-medium text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
            >
              <option value={1}>1 Portion (Solo)</option>
              <option value={2}>2 Portions (Couples)</option>
              <option value={4}>4 Portions (Standard Household + Leftovers)</option>
              <option value={6}>6 Portions (Larger Family + Extra Lunch Reheats)</option>
              <option value={8}>8 Portions (Batch Prep / Entertaining)</option>
            </select>
          </div>

          {/* Dinner Days Counter & Leftover days counter */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2D2A26] block">
                Dinner Days
              </label>
              <div className="flex items-center justify-between bg-[#FFFFFF] border border-[#EADBCE] rounded-xl p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => handleDinnerDaysChange(dinnerDays - 1)}
                  className="h-8 w-8 rounded-lg bg-[#F8F5EE] hover:bg-[#EADBCE] text-[#2D2A26] flex items-center justify-center transition border border-[#EADBCE]"
                  aria-label="Decrease dinner days"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-sm font-bold text-[#2D2A26]">
                  {dinnerDays} days
                </span>
                <button
                  type="button"
                  onClick={() => handleDinnerDaysChange(dinnerDays + 1)}
                  className="h-8 w-8 rounded-lg bg-[#F8F5EE] hover:bg-[#EADBCE] text-[#2D2A26] flex items-center justify-center transition border border-[#EADBCE]"
                  aria-label="Increase dinner days"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-[#706B63] block text-center">
                Fresh Cook (&le;{householdParameters?.cookingRules?.maxActivePrepMinutes || 30}m / Slow Cook)
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2D2A26] block">
                Leftover Days
              </label>
              <div className="flex items-center justify-between bg-[#FFFFFF] border border-[#EADBCE] rounded-xl p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setLeftoverDays(Math.max(0, leftoverDays - 1))}
                  className="h-8 w-8 rounded-lg bg-[#F8F5EE] hover:bg-[#EADBCE] text-[#2D2A26] flex items-center justify-center transition border border-[#EADBCE]"
                  aria-label="Decrease leftover days"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-sm font-bold text-[#2D2A26]">
                  {leftoverDays} nights
                </span>
                <button
                  type="button"
                  onClick={() => setLeftoverDays(Math.min(7, leftoverDays + 1))}
                  className="h-8 w-8 rounded-lg bg-[#F8F5EE] hover:bg-[#EADBCE] text-[#2D2A26] flex items-center justify-center transition border border-[#EADBCE]"
                  aria-label="Increase leftover days"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-[#697A53] font-medium block text-center">
                Auto-synced to 7 days
              </span>
            </div>
          </div>

          {/* Batch Lunch Counter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#2D2A26] flex items-center justify-between">
              <span>Batch Lunch Counter</span>
              <span className="text-[11px] text-[#706B63] font-medium">
                {householdParameters?.cookingRules?.batchLunchDays 
                  ? `${householdParameters.cookingRules.batchLunchDays} preps` 
                  : 'Prepped ahead'}
              </span>
            </label>
            <div className="flex items-center justify-between bg-[#FFFFFF] border border-[#EADBCE] rounded-xl p-1.5 shadow-xs">
              <button
                type="button"
                onClick={() => setBatchLunches(Math.max(0, batchLunches - 1))}
                className="h-9 w-9 rounded-lg bg-[#F8F5EE] hover:bg-[#EADBCE] text-[#2D2A26] flex items-center justify-center transition border border-[#EADBCE]"
                aria-label="Decrease batch lunch count"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="text-center">
                <span className="text-sm font-bold text-[#2D2A26]">
                  {batchLunches} Distinct Batch Lunches
                </span>
                <span className="block text-[10px] text-[#706B63]">
                  Separate flavor profile from dinners
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBatchLunches(Math.min(5, batchLunches + 1))}
                className="h-9 w-9 rounded-lg bg-[#F8F5EE] hover:bg-[#EADBCE] text-[#2D2A26] flex items-center justify-center transition border border-[#EADBCE]"
                aria-label="Increase batch lunch count"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Special Occasions Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#2D2A26] block">
              Special Occasions & Guests
            </label>
            <input
              type="text"
              placeholder="e.g. Birthday dinner Friday, friends over Saturday, quick meal before sports..."
              value={specialOccasions}
              onChange={(e) => setSpecialOccasions(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#2D2A26] placeholder-[#706B63] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
            />
          </div>

          {/* Cravings Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#2D2A26] block">
              Cravings & Proteins to Prioritize
            </label>
            <input
              type="text"
              placeholder="e.g. Salmon, lean ground turkey, Mediterranean flavors, hearty salads..."
              value={cravings}
              onChange={(e) => setCravings(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#2D2A26] placeholder-[#706B63] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
            />
          </div>

          {/* Avoid Fields */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#2D2A26] block">
              Ingredients to Avoid
            </label>
            <input
              type="text"
              placeholder="e.g. Cilantro, bell peppers, spicy chilis..."
              value={avoid}
              onChange={(e) => setAvoid(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#2D2A26] placeholder-[#706B63] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
            />
          </div>

          {/* Preferred Store Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#2D2A26] block">
              Grocery Store for Shopping List
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['H-E-B', 'Walmart', 'Kroger'] as const).map((store) => (
                <button
                  key={store}
                  type="button"
                  onClick={() => setPreferredStore(store)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                    preferredStore === store
                      ? 'bg-[#697A53] border-[#697A53] text-[#FFFFFF] shadow-xs'
                      : 'bg-[#FFFFFF] border-[#EADBCE] text-[#2D2A26] hover:bg-[#F8F5EE]'
                  }`}
                >
                  {store}
                </button>
              ))}
            </div>
          </div>

          {/* Enforced Safety Rules Banner */}
          <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#EADBCE] flex items-start space-x-2.5 text-xs text-[#2D2A26]">
            <AlertCircle className="h-4 w-4 text-[#697A53] shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-[#706B63] space-y-1">
              <div>
                <strong className="text-[#2D2A26]">Household Dietary Safeguards:</strong>{' '}
                {householdParameters && householdParameters.diners && householdParameters.diners.length > 0
                  ? householdParameters.diners.map(d => {
                      const tags = [d.dietaryBadge, ...(d.allergens || []).map(a => `No ${a}`)].filter(Boolean);
                      return `${d.name} (${tags.length > 0 ? tags.slice(0, 2).join(', ') : 'Standard'})`;
                    }).join(' • ')
                  : 'Tailored recipes accommodating all household members and allergies.'}
              </div>
              {householdParameters?.customAiNotes && (
                <div className="text-[#697A53] font-medium truncate">
                  AI Directives: {householdParameters.customAiNotes.slice(0, 90)}...
                </div>
              )}
            </div>
          </div>

        </form>

        {/* Footer with Full-width Mustard Gold Button */}
        <div className="p-6 border-t border-[#EADBCE] bg-[#F8F5EE]/80">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-full text-sm font-bold bg-[#F4C95D] hover:bg-[#ebbd4d] text-[#2D2A26] shadow-[0_8px_20px_-4px_rgba(244,201,93,0.4)] flex items-center justify-center space-x-2 transition disabled:opacity-50 active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-[#2D2A26] border-t-transparent rounded-full animate-spin mr-2" />
                <span>Generating Menu & Groceries...</span>
              </>
            ) : (
              <span>GENERATE NEXT WEEK'S MENU ✦</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};