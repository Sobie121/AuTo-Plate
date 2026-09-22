import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Utensils,
  Flame,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Save,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Heart,
  Baby
} from 'lucide-react';
import { HouseholdParameters, HouseholdDiner, RelativeAge } from '../types';
import {
  COMMON_ALLERGENS,
  COMMON_FOOD_PREFERENCES,
  RELATIVE_AGE_OPTIONS,
  FAMILY_ROLES,
  emptyHouseholdParameters,
} from '../data/defaultHousehold';

interface FamilyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  parameters: HouseholdParameters;
  onSaveParameters: (updated: HouseholdParameters) => void;
  onResetParameters: () => void;
  isOnboarding?: boolean;
}

export const FamilyProfileModal: React.FC<FamilyProfileModalProps> = ({
  isOpen,
  onClose,
  parameters,
  onSaveParameters,
  onResetParameters,
  isOnboarding = false,
}) => {
  const [draft, setDraft] = useState<HouseholdParameters>(parameters);
  const [activeTab, setActiveTab] = useState<'members' | 'ai' | 'cooking'>('members');
  const [expandedDinerId, setExpandedDinerId] = useState<string | null>(null);
  const [customAllergenInput, setCustomAllergenInput] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    setDraft(parameters);
    if (parameters.diners.length > 0) {
      setExpandedDinerId(parameters.diners[0].id);
    }
  }, [parameters, isOpen]);

  if (!isOpen) return null;

  // Add diner helper
  const handleAddDiner = (defaultRole: string = 'Family Member', defaultAge: RelativeAge = 'Adult') => {
    const isInfant = defaultAge === 'Infant (0-1)';
    const isToddler = defaultAge === 'Toddler (1-3)';
    const newId = `diner-${Date.now()}`;
    const newDiner: HouseholdDiner = {
      id: newId,
      name: '',
      role: defaultRole,
      relativeAge: defaultAge,
      allergens: [],
      foodPreferences: [],
      dietaryBadge: isToddler ? 'Kid-Friendly' : 'Standard Portions',
      dietaryDescription: '',
      requiresAdultPortion: !isInfant,
    };

    setDraft(prev => ({
      ...prev,
      diners: [...prev.diners, newDiner],
    }));
    setExpandedDinerId(newId);
  };

  const handleUpdateDiner = (id: string, updates: Partial<HouseholdDiner>) => {
    setDraft(prev => ({
      ...prev,
      diners: prev.diners.map(d => {
        if (d.id !== id) return d;
        const updated = { ...d, ...updates };
        // If age changed to infant, auto-set adult portion to false
        if (updates.relativeAge === 'Infant (0-1)' && updates.requiresAdultPortion === undefined) {
          updated.requiresAdultPortion = false;
        }
        return updated;
      }),
    }));
  };

  const handleRemoveDiner = (id: string) => {
    setDraft(prev => ({
      ...prev,
      diners: prev.diners.filter(d => d.id !== id),
    }));
    if (expandedDinerId === id) {
      setExpandedDinerId(null);
    }
  };

  const handleToggleAllergen = (dinerId: string, allergen: string) => {
    setDraft(prev => ({
      ...prev,
      diners: prev.diners.map(d => {
        if (d.id !== dinerId) return d;
        const currAllergens = d.allergens || [];
        const exists = currAllergens.includes(allergen);
        const nextAllergens = exists
          ? currAllergens.filter(a => a !== allergen)
          : [...currAllergens, allergen];

        // Auto update badge if needed
        let badge = d.dietaryBadge;
        if (!badge || badge === 'Standard Portions' || badge.includes('Free')) {
          if (nextAllergens.length > 0) {
            badge = nextAllergens.map(a => `${a.split('/')[0].trim()}-Free`).slice(0, 2).join(' & ');
          } else {
            badge = 'Standard Portions';
          }
        }

        return {
          ...d,
          allergens: nextAllergens,
          dietaryBadge: badge,
        };
      }),
    }));
  };

  const handleAddCustomAllergen = (dinerId: string) => {
    const text = customAllergenInput[dinerId]?.trim();
    if (!text) return;

    setDraft(prev => ({
      ...prev,
      diners: prev.diners.map(d => {
        if (d.id !== dinerId) return d;
        const curr = d.allergens || [];
        if (curr.includes(text)) return d;
        return {
          ...d,
          allergens: [...curr, text],
        };
      }),
    }));

    setCustomAllergenInput(prev => ({ ...prev, [dinerId]: '' }));
  };

  const handleTogglePreference = (dinerId: string, pref: string) => {
    setDraft(prev => ({
      ...prev,
      diners: prev.diners.map(d => {
        if (d.id !== dinerId) return d;
        const currPrefs = d.foodPreferences || [];
        const exists = currPrefs.includes(pref);
        const nextPrefs = exists
          ? currPrefs.filter(p => p !== pref)
          : [...currPrefs, pref];

        return {
          ...d,
          foodPreferences: nextPrefs,
        };
      }),
    }));
  };

  const handleSave = () => {
    const sanitizedDiners = draft.diners.map((d, idx) => ({
      ...d,
      name: d.name.trim() || `Member ${idx + 1}`,
      dietaryBadge: d.dietaryBadge.trim() || (d.allergens && d.allergens.length > 0 ? `${d.allergens[0].split('/')[0].trim()}-Free` : 'Standard Portions'),
    }));

    // Find any toddler to auto-generate toddler protocol if needed
    const toddler = sanitizedDiners.find(
      d => d.relativeAge === 'Toddler (1-3)' || /toddler/i.test(d.role)
    );

    const updated: HouseholdParameters = {
      ...draft,
      hasCompletedOnboarding: true,
      diners: sanitizedDiners,
      toddlerProtocol: toddler
        ? {
            childName: toddler.name,
            separationRule: draft.toddlerProtocol?.separationRule || 'Present ingredients side-by-side in divided plates rather than mixed casseroles or heavily sauced dishes.',
            safeTexturesRule: draft.toddlerProtocol?.safeTexturesRule || 'Potatoes, sweet potatoes, and carrots cooked fork-tender; meats crumbled finely or shredded; fish checked for pin bones.',
            chokingSafetyRule: draft.toddlerProtocol?.chokingSafetyRule || 'Grapes and cherry tomatoes quartered lengthwise; cucumbers cut in thin strips.',
          }
        : undefined,
    };

    onSaveParameters(updated);
    onClose();
  };

  const handleResetToBlank = () => {
    if (window.confirm('Reset all household parameters to a blank state? You can set up your family from scratch.')) {
      setDraft(emptyHouseholdParameters);
      onResetParameters();
    }
  };

  const totalPortions = draft.diners.filter(d => d.requiresAdultPortion !== false).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl shadow-2xl text-[#2D2A26] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#EADBCE] flex items-center justify-between bg-[#F8F5EE]/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#697A53]/15 text-[#697A53] border border-[#697A53]/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-[#2D2A26]">
                  {isOnboarding ? 'Set Up Your Household Profile' : 'Household & Dietary Profile'}
                </h2>
                {totalPortions > 0 && (
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#697A53]/15 text-[#697A53] border border-[#697A53]/25">
                    {totalPortions} {totalPortions === 1 ? 'Portion' : 'Portions'} Total
                  </span>
                )}
              </div>
              <p className="text-xs text-[#706B63]">
                {isOnboarding
                  ? 'Configure your family members, dietary restrictions, and AI meal-planning preferences'
                  : 'Manage dietary restrictions, relative ages, allergens, and Recipe AI instructions'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isOnboarding && (
              <button
                onClick={onClose}
                className="text-[#706B63] hover:text-[#2D2A26] p-2 rounded-full hover:bg-[#F8F5EE] transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Onboarding Welcome Callout */}
        {isOnboarding && (
          <div className="bg-[#F4C95D]/20 border-b border-[#F4C95D]/40 px-6 py-3 flex items-start space-x-3 text-xs text-[#2D2A26]">
            <Sparkles className="h-4 w-4 text-[#2D2A26] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Welcome to FamilyTable!</span>
              <p className="text-[#2D2A26]/80 text-[11px] mt-0.5">
                Start fresh by adding your household members below. Specify any allergens (dairy, gluten, nuts, etc.), food preferences, and custom instructions so the Recipe AI builds the perfect weekly menu for everyone.
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-[#F8F5EE]/60 border-b border-[#EADBCE] px-5 sm:px-6 py-2 flex items-center space-x-2 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'members'
                ? 'bg-[#697A53] text-[#FFFFFF] font-bold shadow-xs'
                : 'text-[#706B63] hover:text-[#2D2A26] hover:bg-[#FFFFFF]'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Family Members ({draft.diners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-[#697A53] text-[#FFFFFF] font-bold shadow-xs'
                : 'text-[#706B63] hover:text-[#2D2A26] hover:bg-[#FFFFFF]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Recipe AI Custom Instructions</span>
            {draft.customAiNotes?.trim() && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#F4C95D] inline-block ml-1" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('cooking')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'cooking'
                ? 'bg-[#697A53] text-[#FFFFFF] font-bold shadow-xs'
                : 'text-[#706B63] hover:text-[#2D2A26] hover:bg-[#FFFFFF]'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Cooking Rhythm & Rules</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-sm text-[#2D2A26] flex-1">

          {/* TAB 1: FAMILY MEMBERS */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#2D2A26] flex items-center">
                    <Heart className="h-4 w-4 mr-1.5 text-[#697A53]" />
                    Household Members & Individual Diets
                  </h3>
                  <p className="text-[11px] text-[#706B63]">
                    Add each person who eats at your table to tailor recipes and portion sizes
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleAddDiner('Self', 'Adult')}
                    className="px-3.5 py-1.5 rounded-full bg-[#F4C95D] hover:bg-[#ebbd4d] text-[#2D2A26] text-xs font-bold flex items-center space-x-1.5 transition shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Member</span>
                  </button>
                </div>
              </div>

              {/* Empty state if no members added yet */}
              {draft.diners.length === 0 ? (
                <div className="p-8 rounded-2xl border-2 border-dashed border-[#EADBCE] text-center bg-[#F8F5EE]/40 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-[#697A53]/10 text-[#697A53] flex items-center justify-center mx-auto">
                    <Users className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#2D2A26]">No family members added yet</h4>
                  <p className="text-xs text-[#706B63] max-w-md mx-auto">
                    Set up your family from scratch! Add who eats dinner, mark any allergies or preferred diets, and specify their age.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleAddDiner('Self', 'Adult')}
                      className="px-4 py-2 rounded-full bg-[#697A53] hover:bg-[#596945] text-[#FFFFFF] text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Myself (Adult)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddDiner('Partner', 'Adult')}
                      className="px-3 py-2 rounded-full bg-[#FFFFFF] hover:bg-[#F8F5EE] border border-[#EADBCE] text-[#2D2A26] text-xs font-semibold transition"
                    >
                      + Add Partner
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddDiner('Toddler', 'Toddler (1-3)')}
                      className="px-3 py-2 rounded-full bg-[#FFFFFF] hover:bg-[#F8F5EE] border border-[#EADBCE] text-[#2D2A26] text-xs font-semibold transition"
                    >
                      + Add Child / Toddler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {draft.diners.map((diner, index) => {
                    const isExpanded = expandedDinerId === diner.id;
                    const dinerAllergens = diner.allergens || [];
                    const dinerPrefs = diner.foodPreferences || [];

                    return (
                      <div
                        key={diner.id}
                        className="bg-[#F8F5EE] rounded-xl border border-[#EADBCE] overflow-hidden transition-all shadow-xs"
                      >
                        {/* Member Header Bar */}
                        <div
                          onClick={() => setExpandedDinerId(isExpanded ? null : diner.id)}
                          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#FFFFFF]/50 transition select-none"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <span className="h-7 w-7 rounded-full bg-[#FFFFFF] border border-[#EADBCE] text-[#697A53] text-xs font-bold flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                <span className="font-bold text-sm text-[#2D2A26] truncate">
                                  {diner.name || `Unnamed Member (${diner.role})`}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#706B63] border border-[#EADBCE] font-semibold">
                                  {diner.role}
                                </span>
                                {diner.relativeAge && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#697A53]/10 text-[#697A53] border border-[#697A53]/20 font-bold">
                                    {diner.relativeAge}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-[#706B63] truncate">
                                {dinerAllergens.length > 0 ? (
                                  <span className="text-rose-700 font-medium">
                                    Avoids: {dinerAllergens.slice(0, 3).join(', ')}{dinerAllergens.length > 3 ? '...' : ''}
                                  </span>
                                ) : (
                                  <span>No allergens</span>
                                )}
                                {dinerPrefs.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>{dinerPrefs.slice(0, 2).join(', ')}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {diner.requiresAdultPortion ? (
                              <span className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-[#697A53]/15 text-[#697A53] font-bold">
                                1 Portion
                              </span>
                            ) : (
                              <span className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600 font-medium">
                                No portion
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveDiner(diner.id);
                              }}
                              className="text-[#706B63] hover:text-rose-600 p-1.5 rounded-full hover:bg-[#FFFFFF] transition"
                              title="Remove family member"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <div className="text-[#706B63] p-1">
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </div>
                          </div>
                        </div>

                        {/* Member Expanded Editing Details */}
                        {isExpanded && (
                          <div className="p-4 sm:p-5 border-t border-[#EADBCE] bg-[#FFFFFF] space-y-4">
                            
                            {/* Basic Details: Name, Role, Relative Age */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="text-[10px] font-bold text-[#706B63] uppercase block mb-1">
                                  Name
                                </label>
                                <input
                                  type="text"
                                  value={diner.name}
                                  placeholder="e.g. Jordan"
                                  onChange={(e) => handleUpdateDiner(diner.id, { name: e.target.value })}
                                  className="w-full bg-[#F8F5EE] border border-[#EADBCE] rounded-xl px-3 py-2 text-xs text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-[#706B63] uppercase block mb-1">
                                  Family Role
                                </label>
                                <select
                                  value={diner.role}
                                  onChange={(e) => handleUpdateDiner(diner.id, { role: e.target.value })}
                                  className="w-full bg-[#F8F5EE] border border-[#EADBCE] rounded-xl px-3 py-2 text-xs text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
                                >
                                  {FAMILY_ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-[#706B63] uppercase block mb-1">
                                  Relative Age
                                </label>
                                <select
                                  value={diner.relativeAge || 'Adult'}
                                  onChange={(e) => handleUpdateDiner(diner.id, { relativeAge: e.target.value as RelativeAge })}
                                  className="w-full bg-[#F8F5EE] border border-[#EADBCE] rounded-xl px-3 py-2 text-xs text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
                                >
                                  {RELATIVE_AGE_OPTIONS.map(age => (
                                    <option key={age} value={age}>{age}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Portion sizing checkbox */}
                            <div className="flex items-center space-x-2 pt-1">
                              <input
                                type="checkbox"
                                id={`portion-${diner.id}`}
                                checked={diner.requiresAdultPortion !== false}
                                onChange={(e) => handleUpdateDiner(diner.id, { requiresAdultPortion: e.target.checked })}
                                className="h-4 w-4 rounded border-[#EADBCE] text-[#697A53] focus:ring-[#697A53]"
                              />
                              <label htmlFor={`portion-${diner.id}`} className="text-xs text-[#2D2A26] font-medium cursor-pointer">
                                Needs full meal portion (uncheck for nursing infants or separate eaters)
                              </label>
                            </div>

                            {/* COMMON ALLERGENS SELECTION */}
                            <div className="pt-2 border-t border-[#EADBCE]/60">
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-[11px] font-bold text-[#2D2A26] flex items-center">
                                  <ShieldAlert className="h-3.5 w-3.5 mr-1 text-rose-600" />
                                  <span>Common Allergens & Intolerances (Avoid)</span>
                                </label>
                                {dinerAllergens.length > 0 && (
                                  <span className="text-[10px] font-bold text-rose-700">
                                    {dinerAllergens.length} selected
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                {COMMON_ALLERGENS.map(allergen => {
                                  const isSelected = dinerAllergens.includes(allergen);
                                  return (
                                    <button
                                      key={allergen}
                                      type="button"
                                      onClick={() => handleToggleAllergen(diner.id, allergen)}
                                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition border flex items-center space-x-1 ${
                                        isSelected
                                          ? 'bg-rose-100/90 text-rose-800 border-rose-300 shadow-xs'
                                          : 'bg-[#F8F5EE] text-[#706B63] border-[#EADBCE] hover:border-rose-200'
                                      }`}
                                    >
                                      {isSelected && <Check className="h-3 w-3 text-rose-600" />}
                                      <span>{allergen}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Custom allergen input */}
                              <div className="flex items-center space-x-2 mt-2 max-w-sm">
                                <input
                                  type="text"
                                  placeholder="Add another allergy or item..."
                                  value={customAllergenInput[diner.id] || ''}
                                  onChange={(e) => setCustomAllergenInput(prev => ({ ...prev, [diner.id]: e.target.value }))}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddCustomAllergen(diner.id);
                                    }
                                  }}
                                  className="w-full bg-[#F8F5EE] border border-[#EADBCE] rounded-lg px-2.5 py-1 text-xs text-[#2D2A26] focus:outline-none focus:ring-1 focus:ring-[#697A53]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddCustomAllergen(diner.id)}
                                  className="px-3 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#F8F5EE] border border-[#EADBCE] text-xs font-semibold text-[#2D2A26] shrink-0"
                                >
                                  + Add
                                </button>
                              </div>
                            </div>

                            {/* COMMON FOOD PREFERENCES SELECTION */}
                            <div className="pt-2 border-t border-[#EADBCE]/60">
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-[11px] font-bold text-[#2D2A26] flex items-center">
                                  <Utensils className="h-3.5 w-3.5 mr-1 text-[#697A53]" />
                                  <span>Food Preferences & Eating Styles</span>
                                </label>
                                {dinerPrefs.length > 0 && (
                                  <span className="text-[10px] font-bold text-[#697A53]">
                                    {dinerPrefs.length} selected
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                {COMMON_FOOD_PREFERENCES.map(pref => {
                                  const isSelected = dinerPrefs.includes(pref);
                                  return (
                                    <button
                                      key={pref}
                                      type="button"
                                      onClick={() => handleTogglePreference(diner.id, pref)}
                                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition border flex items-center space-x-1 ${
                                        isSelected
                                          ? 'bg-[#697A53]/20 text-[#697A53] border-[#697A53]/40 shadow-xs'
                                          : 'bg-[#F8F5EE] text-[#706B63] border-[#EADBCE] hover:border-[#697A53]/30'
                                      }`}
                                    >
                                      {isSelected && <Check className="h-3 w-3 text-[#697A53]" />}
                                      <span>{pref}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Specific notes / quirks for this diner */}
                            <div className="pt-2 border-t border-[#EADBCE]/60">
                              <label className="text-[10px] font-bold text-[#706B63] uppercase block mb-1">
                                Individual Notes & Specifics (Optional)
                              </label>
                              <input
                                type="text"
                                value={diner.dietaryDescription}
                                placeholder="e.g. Loves olives, dislikes cilantro, prefers mild spice, wants sauce on the side"
                                onChange={(e) => handleUpdateDiner(diner.id, { dietaryDescription: e.target.value })}
                                className="w-full bg-[#F8F5EE] border border-[#EADBCE] rounded-xl px-3 py-1.5 text-xs text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
                              />
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RECIPE AI CUSTOM INSTRUCTIONS (THE REQUESTED CUSTOM TEXT BOX) */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-[#F8F5EE] p-4 sm:p-5 rounded-2xl border border-[#EADBCE] space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-xl bg-[#F4C95D]/25 text-[#2D2A26] flex items-center justify-center border border-[#F4C95D]/40">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2D2A26]">
                      Recipe AI Custom Directives & Preferences
                    </h3>
                    <p className="text-xs text-[#706B63]">
                      These details are directly fed to the AI engine whenever creating weekly plans or swapping recipes
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#2D2A26] leading-relaxed">
                  Enter any family-specific culinary preferences, favorite cuisines, texture rules, cooking equipment, or weekly guidelines that our AI should strictly honor:
                </p>

                {/* THE CUSTOM TEXT BOX */}
                <div className="space-y-1.5">
                  <textarea
                    rows={6}
                    value={draft.customAiNotes}
                    onChange={(e) => setDraft({ ...draft, customAiNotes: e.target.value })}
                    placeholder={`e.g.:
• We love Mediterranean, Mexican, and citrus-herb flavors.
• Keep fresh dinner prep strictly under 30 minutes active time.
• Minimize red meat (prefer chicken breast, ground turkey, and salmon).
• Toddler food must be deconstructed finger foods with vegetables fork-tender.
• Always serve spicy salsas, chili crisp, or feta on the side in separate ramekins.
• Cross-utilize fresh produce (cilantro, limes, spinach) to minimize grocery waste.`}
                    className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl p-3.5 text-xs text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#697A53] leading-relaxed resize-y font-mono placeholder:font-sans placeholder:text-[#706B63]/60 shadow-inner"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#706B63] px-1">
                    <span>Markdown or bullet points are supported.</span>
                    <span>{draft.customAiNotes?.length || 0} characters</span>
                  </div>
                </div>

                {/* Quick Presets / Suggestions */}
                <div className="pt-2 border-t border-[#EADBCE] space-y-1.5">
                  <span className="text-[10px] font-bold text-[#706B63] uppercase block">
                    Quick Suggestion Snippets (Click to insert):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Keep active prep under 30 minutes',
                      'Deconstruct plates into finger foods for toddlers',
                      'Serve dairy and spicy toppings in ramekins on the side',
                      'Substitute ground turkey for ground beef',
                      'Include 1 slow-cooker or Crockpot meal per week',
                      'Maximize cross-utilizing fresh herbs & citrus',
                    ].map(snippet => (
                      <button
                        key={snippet}
                        type="button"
                        onClick={() => {
                          const current = draft.customAiNotes?.trim() || '';
                          const next = current ? `${current}\n• ${snippet}` : `• ${snippet}`;
                          setDraft({ ...draft, customAiNotes: next });
                        }}
                        className="text-[10px] font-medium bg-[#FFFFFF] hover:bg-[#F8F5EE] border border-[#EADBCE] text-[#2D2A26] px-2.5 py-1 rounded-full transition shadow-2xs"
                      >
                        + {snippet}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: COOKING RHYTHM & RULES */}
          {activeTab === 'cooking' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#2D2A26] flex items-center">
                  <Flame className="h-4 w-4 mr-1.5 text-[#697A53]" />
                  Cooking Schedule & Kitchen Rhythm
                </h3>
                <p className="text-[11px] text-[#706B63]">
                  Configure your weekly fresh cook count, leftover nights, and prep timing
                </p>
              </div>

              <div className="bg-[#F8F5EE] p-5 rounded-2xl border border-[#EADBCE] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#706B63] uppercase block mb-1">
                      Max Active Prep Time
                    </label>
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="number"
                        min={15}
                        max={60}
                        value={draft.cookingRules.maxActivePrepMinutes}
                        onChange={(e) => setDraft({
                          ...draft,
                          cookingRules: {
                            ...draft.cookingRules,
                            maxActivePrepMinutes: parseInt(e.target.value) || 30
                          }
                        })}
                        className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-3 py-2 text-xs text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
                      />
                      <span className="text-xs text-[#706B63]">mins</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#706B63] uppercase block mb-1">
                      Fresh Dinner Nights
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={7}
                      value={draft.cookingRules.freshDinnersCount}
                      onChange={(e) => setDraft({
                        ...draft,
                        cookingRules: {
                          ...draft.cookingRules,
                          freshDinnersCount: parseInt(e.target.value) || 4
                        }
                      })}
                      className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-3 py-2 text-xs text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#706B63] uppercase block mb-1">
                      Leftover Nights
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={draft.cookingRules.leftoversCount}
                      onChange={(e) => setDraft({
                        ...draft,
                        cookingRules: {
                          ...draft.cookingRules,
                          leftoversCount: parseInt(e.target.value) || 3
                        }
                      })}
                      className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-3 py-2 text-xs text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#706B63] uppercase block mb-1">
                    Batch Lunch Prep Days
                  </label>
                  <input
                    type="text"
                    value={draft.cookingRules.batchLunchDays}
                    placeholder="e.g. Sundays & Tuesdays"
                    onChange={(e) => setDraft({
                      ...draft,
                      cookingRules: {
                        ...draft.cookingRules,
                        batchLunchDays: e.target.value
                      }
                    })}
                    className="w-full bg-[#FFFFFF] border border-[#EADBCE] rounded-xl px-3 py-2 text-xs text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#697A53]"
                  />
                </div>

                <div className="space-y-2.5 pt-2 border-t border-[#EADBCE]">
                  <label className="flex items-center space-x-2 text-xs text-[#2D2A26] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.cookingRules.modularToppingsRequired}
                      onChange={(e) => setDraft({
                        ...draft,
                        cookingRules: {
                          ...draft.cookingRules,
                          modularToppingsRequired: e.target.checked
                        }
                      })}
                      className="rounded border-[#EADBCE] text-[#697A53] focus:ring-[#697A53]"
                    />
                    <span>Enforce modular toppings (serve dairy, hot spices, and olives in side ramekins)</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs text-[#2D2A26] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.cookingRules.produceCrossUtilization}
                      onChange={(e) => setDraft({
                        ...draft,
                        cookingRules: {
                          ...draft.cookingRules,
                          produceCrossUtilization: e.target.checked
                        }
                      })}
                      className="rounded border-[#EADBCE] text-[#697A53] focus:ring-[#697A53]"
                    />
                    <span>Cross-utilize fresh produce to prevent grocery cart waste</span>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-[#EADBCE] bg-[#F8F5EE]/90 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleResetToBlank}
            className="text-[#706B63] hover:text-[#2D2A26] text-xs flex items-center space-x-1.5 transition font-medium"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset / Start Over</span>
          </button>

          <div className="flex items-center space-x-2">
            {!isOnboarding && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-[#FFFFFF] hover:bg-[#F8F5EE] border border-[#EADBCE] text-[#706B63] text-xs font-semibold transition"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-full bg-[#F4C95D] hover:bg-[#ebbd4d] text-[#2D2A26] text-xs font-bold flex items-center space-x-1.5 transition shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isOnboarding ? 'Complete Setup & Save' : 'Save Household Profile'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
