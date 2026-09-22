import React, { useState } from 'react';
import { Sparkles, X, Utensils, Calendar, Users, AlertCircle, ShoppingCart } from 'lucide-react';
import { QuestionnaireAnswers, HouseholdParameters } from '../types';

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (answers: QuestionnaireAnswers) => void;
  isLoading: boolean;
  householdParameters?: HouseholdParameters;
}

export const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  householdParameters,
}) => {
  const [dinnersCount, setDinnersCount] = useState<number>(4);
  const [leftoversCount, setLeftoversCount] = useState<number>(3);
  const [specialOccasions, setSpecialOccasions] = useState<string>('');
  const [cravingsOrPriorities, setCravingsOrPriorities] = useState<string>('');
  const [avoidIngredients, setAvoidIngredients] = useState<string>('');
  const [preferredStore, setPreferredStore] = useState<'H-E-B' | 'Walmart' | 'Kroger'>('H-E-B');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      dinnersCount,
      leftoversCount,
      specialOccasions,
      cravingsOrPriorities,
      avoidIngredients,
      preferredStore,
    });
  };

  const handlePresetSelect = (dinners: number, leftovers: number) => {
    setDinnersCount(dinners);
    setLeftoversCount(leftovers);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl shadow-2xl text-[#2D2A26] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EADBCE] flex items-center justify-between bg-[#F8F5EE]/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#697A53]/15 text-[#697A53]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2D2A26]">Weekly Culinary Check-In</h2>
              <p className="text-xs text-[#706B63]">Personalized for Stephen, Taryn, Sara & Logan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-[#706B63] hover:text-[#2D2A26] p-2 rounded-full hover:bg-[#F8F5EE] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Preset Quick Buttons */}
          <div className="bg-[#F8F5EE] p-4 rounded-xl border border-[#EADBCE]">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#706B63] block mb-2">
              Quick Weekly Rhythms
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePresetSelect(4, 3)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition ${
                  dinnersCount === 4 && leftoversCount === 3
                    ? 'bg-[#697A53] border-[#697A53] text-[#FFFFFF] shadow-xs'
                    : 'bg-[#FFFFFF] border-[#EADBCE] text-[#2D2A26] hover:bg-[#F8F5EE]'
                }`}
              >
                Standard (4 Fresh + 3 Leftovers)
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect(5, 2)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition ${
                  dinnersCount === 5 && leftoversCount === 2
                    ? 'bg-[#697A53] border-[#697A53] text-[#FFFFFF] shadow-xs'
                    : 'bg-[#FFFFFF] border-[#EADBCE] text-[#2D2A26] hover:bg-[#F8F5EE]'
                }`}
              >
                Busy Week (5 Fresh + 2 Leftovers)
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect(3, 4)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition ${
                  dinnersCount === 3 && leftoversCount === 4
                    ? 'bg-[#697A53] border-[#697A53] text-[#FFFFFF] shadow-xs'
                    : 'bg-[#FFFFFF] border-[#EADBCE] text-[#2D2A26] hover:bg-[#F8F5EE]'
                }`}
              >
                Low Effort (3 Fresh + 4 Leftovers)
              </button>
            </div>
          </div>

          {/* Question 1: Dinners & Leftover Breakdown */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#2D2A26] flex items-center justify-between">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-[#697A53]" />
                1. How many dinner recipes do you need for next week?
              </span>
              <span className="text-xs text-[#697A53] font-bold">
                {dinnersCount} Fresh + {leftoversCount} Leftover Days = 7 Total
              </span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-[#706B63] block mb-1">Fresh Cook Dinners (&le; 30m prep or slow-cooker)</span>
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={dinnersCount}
                  onChange={(e) => {
                    const d = Math.max(1, Math.min(7, parseInt(e.target.value) || 1));
                    setDinnersCount(d);
                    setLeftoversCount(Math.max(0, 7 - d));
                  }}
                  className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-3.5 py-2 text-sm text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
                />
              </div>
              <div>
                <span className="text-xs text-[#706B63] block mb-1">Designated Leftover Nights</span>
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={leftoversCount}
                  onChange={(e) => setLeftoversCount(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-3.5 py-2 text-sm text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
                />
              </div>
            </div>
          </div>

          {/* Question 2: Special Occasions or Guests */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#2D2A26] flex items-center">
              <Users className="h-4 w-4 mr-2 text-[#5D6A74]" />
              2. Are there any extra guests or special occasions to account for?
            </label>
            <input
              type="text"
              placeholder="e.g. Birthday dinner Friday, friends visiting Saturday, date night in..."
              value={specialOccasions}
              onChange={(e) => setSpecialOccasions(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-3.5 py-2 text-sm text-[#2D2A26] placeholder-[#706B63]/60 focus:outline-none focus:ring-2 focus:ring-[#697A53]"
            />
          </div>

          {/* Question 3: Cravings, Specific Proteins, or Ingredients to Prioritize */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#2D2A26] flex items-center">
              <Utensils className="h-4 w-4 mr-2 text-[#697A53]" />
              3. Any specific cravings, proteins, or ingredients to prioritize or avoid?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Prioritize: e.g. Salmon, ground turkey bowls, citrus herb..."
                value={cravingsOrPriorities}
                onChange={(e) => setCravingsOrPriorities(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-3.5 py-2 text-sm text-[#2D2A26] placeholder-[#706B63]/60 focus:outline-none focus:ring-2 focus:ring-[#697A53]"
              />
              <input
                type="text"
                placeholder="Avoid this week: e.g. Cilantro, spicy peppers, eggplant..."
                value={avoidIngredients}
                onChange={(e) => setAvoidIngredients(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-3.5 py-2 text-sm text-[#2D2A26] placeholder-[#706B63]/60 focus:outline-none focus:ring-2 focus:ring-[#697A53]"
              />
            </div>
          </div>

          {/* Question 4: Preferred Retailer */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#2D2A26] flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2 text-[#697A53]" />
              Preferred Grocery Retailer for Instacart / Shopping List
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['H-E-B', 'Walmart', 'Kroger'] as const).map((store) => (
                <button
                  key={store}
                  type="button"
                  onClick={() => setPreferredStore(store)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition ${
                    preferredStore === store
                      ? 'bg-[#697A53]/15 border-[#697A53] text-[#697A53] shadow-xs'
                      : 'bg-[#FFFFFF] border-[#EADBCE] text-[#706B63] hover:bg-[#F8F5EE]'
                  }`}
                >
                  {store}
                </button>
              ))}
            </div>
          </div>

          {/* Household Safeguards Notice */}
          <div className="p-3.5 bg-[#F8F5EE] rounded-xl border border-[#EADBCE] flex items-start space-x-2.5 text-xs text-[#2D2A26]">
            <AlertCircle className="h-4 w-4 text-[#697A53] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>
                <strong className="text-[#2D2A26]">Household Safeguards:</strong>{' '}
                {householdParameters && householdParameters.diners && householdParameters.diners.length > 0
                  ? householdParameters.diners.map(d => {
                      const tags = [d.dietaryBadge, ...(d.allergens || []).map(a => `No ${a}`)].filter(Boolean);
                      return `${d.name} (${tags.length > 0 ? tags.slice(0, 2).join(', ') : 'Standard'})`;
                    }).join(' • ')
                  : 'Tailored recipes accommodating all household members and allergies.'}
              </p>
              {householdParameters?.customAiNotes && (
                <p className="text-[#697A53] font-medium">
                  Custom AI Directives: {householdParameters.customAiNotes}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold rounded-full text-[#706B63] hover:text-[#2D2A26] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 text-sm font-bold rounded-full bg-[#697A53] hover:bg-[#596945] text-[#FFFFFF] flex items-center space-x-2 transition disabled:opacity-50 shadow-xs"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Compliant Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Meal Plan & Groceries</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
