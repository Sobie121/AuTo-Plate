import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  Calendar,
  Utensils,
  ShoppingCart,
  Sparkles,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Clock,
  Layers,
  Baby,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Store,
  FileDown,
  AlertCircle,
  X,
  Users,
  Plus,
  RotateCcw,
  MessageSquare,
  Heart,
  ShieldAlert
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DashboardHero } from './components/DashboardHero';
import { WeeklyCalendarStrip } from './components/WeeklyCalendarStrip';
import { RecipeQuickViewModal } from './components/RecipeQuickViewModal';
import { AiMenuGenerationSidebar } from './components/AiMenuGenerationSidebar';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { PlanScheduleView } from './components/PlanScheduleView';
import { RecipeCardsView } from './components/RecipeCardsView';
import { BatchLunchView } from './components/BatchLunchView';
import { RunningGroceryListView } from './components/RunningGroceryListView';
import { QuestionnaireModal } from './components/QuestionnaireModal';
import { HouseholdRulesModal } from './components/HouseholdRulesModal';
import { GoogleDocSyncModal } from './components/GoogleDocSyncModal';
import { GoogleKeepSyncModal } from './components/GoogleKeepSyncModal';
import { emptyHouseholdParameters } from './data/defaultHousehold';
import { exportBatchRecipesToPdf } from './utils/pdfExport';
import {
  WeeklyPlan,
  Recipe,
  GroceryCategory,
  GroceryItem,
  QuestionnaireAnswers,
  HouseholdParameters,
  PERMANENT_GOOGLE_DOC_ID
} from './types';
import { initAuth, googleSignIn, logout, getAccessToken } from './services/auth';
import { updatePermanentGoogleDoc, DocUpdateResult } from './services/googleDocs';

// Clean baseline meal plan for brand-new users
const emptyMealPlan: WeeklyPlan = {
  id: '',
  title: 'No Meal Plan Generated Yet',
  weekOf: 'Upcoming Week',
  summary: 'Configure your household profile and generate your first weekly plan using the AI panel.',
  dinnersCount: 0,
  leftoverCount: 0,
  dinners: [],
  batchLunches: [],
  groceryItems: []
};

export default function App() {
  // Household Parameters state: Defaults strictly to empty so new users start fresh
  const [householdParameters, setHouseholdParameters] = useState<HouseholdParameters>(() => {
    const saved = localStorage.getItem('family_household_parameters');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return emptyHouseholdParameters;
      }
    }
    return emptyHouseholdParameters;
  });

  // Plan state: Defaults to empty template if no local plan exists
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(() => {
    const saved = localStorage.getItem('family_weekly_plan');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return emptyMealPlan;
      }
    }
    return emptyMealPlan;
  });

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(
    weeklyPlan.dinners[0]?.id || ''
  );

  // Navigation tab state (home, week, generate, list, profile)
  const [navTab, setNavTab] = useState<TabType>('home');
  const [weekSubTab, setWeekSubTab] = useState<'dinners' | 'lunches'>('dinners');
  
  // Dynamic store selection based on user's saved household preferences
  const [preferredStore, setPreferredStore] = useState<'H-E-B' | 'Walmart' | 'Kroger'>(
    (householdParameters as any).preferredStore || 'H-E-B'
  );

  // Quick-view recipe popover modal state
  const [quickViewRecipe, setQuickViewRecipe] = useState<Recipe | null>(weeklyPlan.dinners[0] || null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // AI Menu Generation Sidebar state
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Other Modals state
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDocSyncModalOpen, setIsDocSyncModalOpen] = useState(false);
  const [isKeepSyncModalOpen, setIsKeepSyncModalOpen] = useState(false);

  // Loading & status states
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isSwappingRecipe, setIsSwappingRecipe] = useState(false);
  const [isSyncingDoc, setIsSyncingDoc] = useState(false);
  const [docSyncResult, setDocSyncResult] = useState<DocUpdateResult | null>(null);

  // High-level summary toggle
  const [showSummaryNotes, setShowSummaryNotes] = useState(false);

  // In-app notification toast state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // Check if onboarding is needed on initial application load
  useEffect(() => {
    const saved = localStorage.getItem('family_household_parameters');
    if (!saved || !householdParameters.hasCompletedOnboarding || !householdParameters.diners || householdParameters.diners.length === 0) {
      setIsOnboardingOpen(true);
      setIsRulesOpen(true);
    }
  }, []);

  // Sync preferred store if updated in householdParameters
  useEffect(() => {
    if ((householdParameters as any).preferredStore) {
      setPreferredStore((householdParameters as any).preferredStore);
    }
  }, [householdParameters]);

  // Initialize Auth listener on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (authedUser, token) => {
        setUser(authedUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Save plan changes to localStorage
  useEffect(() => {
    localStorage.setItem('family_weekly_plan', JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  // Save household parameters changes to localStorage
  useEffect(() => {
    localStorage.setItem('family_household_parameters', JSON.stringify(householdParameters));
  }, [householdParameters]);

  // Batch Export all recipes to PDF
  const handleExportBatchPdf = () => {
    if (weeklyPlan.dinners.length === 0) {
      showToast('Generate a meal plan first before exporting to PDF.', 'info');
      return;
    }
    showToast('Exporting weekly recipes guide to PDF...', 'info');
    exportBatchRecipesToPdf(weeklyPlan);
  };

  // Google Sign In handler
  const handleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        showToast('Successfully signed in with Google!', 'success');
      }
    } catch (err) {
      console.error('Sign in failed:', err);
      showToast('Sign in failed. Please try again.', 'error');
    }
  };

  // Sign Out handler
  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      showToast('Signed out of Google account.', 'info');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Generate Plan through backend AI (Gemini)
  const handleGeneratePlan = async (answers: QuestionnaireAnswers) => {
    setIsGeneratingPlan(true);
    setPreferredStore(answers.preferredStore);
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...answers,
          householdParameters,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const newPlan: WeeklyPlan = await response.json();
      setWeeklyPlan(newPlan);
      if (newPlan.dinners.length > 0) {
        setSelectedRecipeId(newPlan.dinners[0].id);
        setQuickViewRecipe(newPlan.dinners[0]);
      }
      setIsQuestionnaireOpen(false);
      setIsAiSidebarOpen(false);
      showToast('New customized weekly plan created!', 'success');
    } catch (err) {
      console.error('Error generating plan:', err);
      showToast('Could not connect to AI generation server. Please verify your GEMINI_API_KEY in settings or try again.', 'error');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Swap an individual recipe with compliant alternative
  const handleSwapRecipe = async (recipe: Recipe, reason: string) => {
    setIsSwappingRecipe(true);
    try {
      const res = await fetch('/api/swap-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeId: recipe.id,
          currentTitle: recipe.title,
          cuisine: recipe.cuisine,
          reason,
          householdParameters,
        }),
      });

      if (!res.ok) throw new Error('Swap failed');
      const swapped: Recipe = await res.json();
      swapped.day = recipe.day;

      setWeeklyPlan((prev) => {
        const updatedDinners = prev.dinners.map((d) => (d.id === recipe.id ? swapped : d));
        const newGroceryItems: GroceryItem[] = [...prev.groceryItems];
        swapped.ingredients.forEach((ing, i) => {
          newGroceryItems.push({
            id: `g-swap-${Date.now()}-${i}`,
            name: ing.item,
            amount: ing.amount,
            category: ing.category,
            completed: false,
            sourceRecipe: swapped.title,
            isPantryStaple: ing.pantryStaple,
          });
        });

        return {
          ...prev,
          dinners: updatedDinners,
          groceryItems: newGroceryItems,
        };
      });
      setSelectedRecipeId(swapped.id);
      setQuickViewRecipe(swapped);
      showToast(`Swapped with "${swapped.title}"!`, 'success');
    } catch (err) {
      console.error('Swap error:', err);
      showToast('Could not swap recipe right now. Please try again.', 'error');
    } finally {
      setIsSwappingRecipe(false);
    }
  };

  // Grocery item toggle
  const handleToggleGroceryItem = (id: string) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      groceryItems: prev.groceryItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  // Add custom grocery extra
  const handleAddGroceryItem = (name: string, amount: string, category: GroceryCategory) => {
    const newItem: GroceryItem = {
      id: `custom-${Date.now()}`,
      name,
      amount,
      category,
      completed: false,
      isCustomItem: true,
    };
    setWeeklyPlan((prev) => ({
      ...prev,
      groceryItems: [newItem, ...prev.groceryItems],
    }));
    showToast(`Added "${name}" to grocery list`, 'success');
  };

  // Delete custom grocery extra
  const handleDeleteGroceryItem = (id: string) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      groceryItems: prev.groceryItems.filter((i) => i.id !== id),
    }));
  };

  // Google Docs Update trigger
  const handleOpenDocSync = () => {
    setDocSyncResult(null);
    setIsDocSyncModalOpen(true);
  };

  // Confirm Google Doc Update
  const handleConfirmDocSync = async () => {
    let token = accessToken;
    if (!token) {
      token = await getAccessToken();
    }
    if (!token) {
      showToast('Please sign in with Google to update the shared Google Doc.', 'info');
      return;
    }

    setIsSyncingDoc(true);
    try {
      const result = await updatePermanentGoogleDoc(token, weeklyPlan, householdParameters);
      setDocSyncResult(result);
      if (result.success) {
        setWeeklyPlan((prev) => ({
          ...prev,
          googleDocSyncedAt: new Date().toLocaleTimeString(),
        }));
        showToast('Google Doc successfully updated with latest meal plan!', 'success');
      } else {
        showToast(result.message || 'Failed to update Google Doc', 'error');
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to update Google Doc';
      setDocSyncResult({
        success: false,
        message: msg,
        docUrl: `https://docs.google.com/document/d/${PERMANENT_GOOGLE_DOC_ID}/edit`,
      });
      showToast(msg, 'error');
    } finally {
      setIsSyncingDoc(false);
    }
  };

  const handleSelectRecipeAndOpenQuickView = (recipe: Recipe) => {
    setSelectedRecipeId(recipe.id);
    setQuickViewRecipe(recipe);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#2D2A26] flex flex-col font-sans selection:bg-[#F4C95D]/50 selection:text-[#2D2A26] pb-28 md:pb-16">
      
      {/* 1. Navigation: Top sticky bar with logo + personalized greeting */}
      <Navbar
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onOpenQuestionnaire={() => setIsAiSidebarOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onSyncDoc={handleOpenDocSync}
        isSyncingDoc={isSyncingDoc}
        onExportBatchPdf={handleExportBatchPdf}
        householdParameters={householdParameters}
      />

      {/* Main Content Area based on active navigation tab */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        
        {/* ================= HOME TAB ================= */}
        {navTab === 'home' && (
          <div className="space-y-6">
            {/* Onboarding Setup Banner (Shows when household is new or incomplete) */}
            {(!householdParameters.hasCompletedOnboarding || householdParameters.diners.length === 0) && (
              <div className="bg-[#FFFFFF] border-2 border-[#697A53]/40 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="h-10 w-10 rounded-xl bg-[#697A53] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-xs">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base font-bold text-[#2D2A26]">
                        Set Up Your Family Household Profile
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#697A53]/15 text-[#697A53]">
                        Step 1
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#706B63] mt-0.5 leading-relaxed">
                      Configure your household members with their roles, relative ages, allergens, food preferences, and custom AI notes so the Recipe AI can tailor every weekly meal and grocery list.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOnboardingOpen(true);
                    setIsRulesOpen(true);
                  }}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-bold bg-[#697A53] hover:bg-[#596945] text-[#FFFFFF] transition shadow-xs shrink-0"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  <span>Set Up Family</span>
                </button>
              </div>
            )}

            {/* 2. Dashboard Hero */}
            <DashboardHero
              weekOf={weeklyPlan.weekOf}
              onViewCurrentWeek={() => setNavTab('week')}
              onPlanNextWeek={() => setIsAiSidebarOpen(true)}
              dinnersCount={weeklyPlan.dinnersCount}
              leftoversCount={weeklyPlan.leftoverCount}
            />

            {/* Empty State / Call-to-action when no plan exists */}
            {weeklyPlan.dinners.length === 0 ? (
              <div className="bg-[#FFFFFF] border border-dashed border-[#EADBCE] rounded-2xl p-10 text-center space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#697A53]/10 text-[#697A53] flex items-center justify-center mx-auto">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2D2A26]">No Weekly Meal Plan Generated Yet</h3>
                  <p className="text-xs sm:text-sm text-[#706B63] max-w-md mx-auto mt-1">
                    Once your household profile is configured, generate a fresh 7-day culinary schedule tailored to your schedule and preferences.
                  </p>
                </div>
                <button
                  onClick={() => setIsAiSidebarOpen(true)}
                  className="inline-flex items-center px-5 py-2.5 rounded-full text-xs font-bold bg-[#F4C95D] hover:bg-[#ebbd4d] text-[#2D2A26] transition shadow-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  <span>Generate Next Week's Plan</span>
                </button>
              </div>
            ) : (
              <>
                {/* 3. Weekly Calendar Strip & Meal Columns */}
                <WeeklyCalendarStrip
                  dinners={weeklyPlan.dinners}
                  selectedRecipeId={selectedRecipeId}
                  onSelectRecipe={(id) => {
                    setSelectedRecipeId(id);
                    const match = weeklyPlan.dinners.find(d => d.id === id);
                    if (match) setQuickViewRecipe(match);
                  }}
                  onOpenQuickView={handleSelectRecipeAndOpenQuickView}
                />

                {/* Glanceable Weekly Rhythm Card with High-Level Summary */}
                <div className="bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl p-6 shadow-[0_8px_20px_-4px_rgba(45,42,38,0.06),0_4px_8px_-2px_rgba(45,42,38,0.04)]">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-bold text-[#697A53] mb-1">
                        <span className="p-1 rounded-md bg-[#697A53]/15 text-[#697A53]">
                          <Sparkles className="h-3.5 w-3.5" />
                        </span>
                        <span>{weeklyPlan.weekOf || 'Current Week'}</span>
                      </div>

                      <h3 className="text-xl font-bold text-[#2D2A26] tracking-tight">
                        Weekly Rhythm Overview
                      </h3>

                      {/* Dynamic summary badges based on active parameters */}
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 flex-wrap text-xs">
                        <span className="px-3 py-1 rounded-full bg-[#697A53]/15 text-[#697A53] font-bold border border-[#697A53]/25 text-[11px]">
                          {weeklyPlan.dinnersCount} Dinners (&le;{householdParameters.cookingRules?.maxActivePrepMinutes || 30}m / Slow)
                        </span>
                        <span className="px-3 py-1 rounded-full bg-[#F8F5EE] text-[#706B63] font-semibold border border-[#EADBCE] text-[11px]">
                          {weeklyPlan.leftoverCount} Leftover Nights
                        </span>
                        {weeklyPlan.batchLunches.length > 0 && (
                          <span className="px-3 py-1 rounded-full bg-[#F4C95D]/25 text-[#2D2A26] font-bold border border-[#F4C95D]/40 text-[11px]">
                            {weeklyPlan.batchLunches.length} Batch Lunches
                          </span>
                        )}
                        {householdParameters.diners.some(d => d.allergens?.some(a => /dairy/i.test(a)) || (d.dietaryBadge && /dairy-free/i.test(d.dietaryBadge))) && (
                          <span className="px-3 py-1 rounded-full bg-[#697A53]/15 text-[#697A53] font-bold border border-[#697A53]/25 text-[11px]">
                            Dairy-Free Safeguard
                          </span>
                        )}
                        {householdParameters.diners.some(d => d.relativeAge === 'Toddler (1-3)' || d.relativeAge === 'Child (4-12)') && (
                          <span className="px-3 py-1 rounded-full bg-[#F4C95D]/25 text-[#2D2A26] font-bold border border-[#F4C95D]/40 text-[11px]">
                            Kid & Toddler Mods
                          </span>
                        )}
                        {householdParameters.cookingRules?.modularToppingsRequired && (
                          <span className="px-3 py-1 rounded-full bg-[#5D6A74]/15 text-[#5D6A74] font-bold border border-[#5D6A74]/25 text-[11px]">
                            Modular Toppings
                          </span>
                        )}

                        <button
                          onClick={() => setShowSummaryNotes(!showSummaryNotes)}
                          className="text-[11px] font-semibold text-[#5D6A74] hover:text-[#2D2A26] ml-1 transition underline"
                        >
                          {showSummaryNotes ? 'Hide notes' : 'View notes'}
                        </button>
                      </div>

                      {showSummaryNotes && (
                        <p className="text-xs text-[#706B63] mt-2.5 pt-2.5 border-t border-[#EADBCE] max-w-3xl leading-relaxed">
                          {weeklyPlan.summary}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 flex-wrap">
                      <button
                        onClick={handleExportBatchPdf}
                        className="px-3.5 py-2 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#5D6A74] border border-[#EADBCE] transition flex items-center space-x-1.5 shadow-xs"
                        title="Download weekly meal plan PDF"
                      >
                        <FileDown className="h-3.5 w-3.5 text-[#5D6A74]" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Glance at Batch Lunches (if present) */}
                {weeklyPlan.batchLunches.length > 0 && (
                  <div className="bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl p-6 shadow-[0_8px_20px_-4px_rgba(45,42,38,0.06),0_4px_8px_-2px_rgba(45,42,38,0.04)]">
                    <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE] mb-4">
                      <div>
                        <h4 className="text-base font-bold text-[#2D2A26]">
                          Batch Work Lunches
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          setNavTab('week');
                          setWeekSubTab('lunches');
                        }}
                        className="text-xs font-bold text-[#697A53] hover:text-[#596945] flex items-center"
                      >
                        <span>View Details</span>
                        <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {weeklyPlan.batchLunches.map((lunch) => (
                        <div
                          key={lunch.id}
                          className="p-4 rounded-xl bg-[#F8F5EE] border border-[#EADBCE] space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#697A53] uppercase tracking-wider text-[10px]">
                              Prep on {lunch.prepDay}
                            </span>
                            <span className="text-[#706B63] font-medium text-[11px]">
                              {lunch.servings} Servings
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-[#2D2A26]">
                            {lunch.title}
                          </h5>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ================= WEEK TAB ================= */}
        {navTab === 'week' && (
          <div className="space-y-6">
            {weeklyPlan.dinners.length === 0 ? (
              <div className="bg-[#FFFFFF] border border-dashed border-[#EADBCE] rounded-2xl p-10 text-center space-y-4">
                <Calendar className="h-10 w-10 text-[#706B63] mx-auto opacity-50" />
                <h3 className="text-lg font-bold text-[#2D2A26]">Your Weekly Schedule is Empty</h3>
                <p className="text-xs text-[#706B63] max-w-sm mx-auto">
                  Click the Generate button below to build your first tailored meal plan.
                </p>
                <button
                  onClick={() => setIsAiSidebarOpen(true)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#F4C95D] text-[#2D2A26]"
                >
                  Create Plan
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="inline-flex bg-[#FFFFFF] p-1 rounded-full border border-[#EADBCE] shadow-xs">
                    <button
                      onClick={() => setWeekSubTab('dinners')}
                      className={`px-5 py-2 rounded-full text-xs font-bold transition flex items-center space-x-1.5 ${
                        weekSubTab === 'dinners'
                          ? 'bg-[#697A53] text-[#FFFFFF] shadow-xs'
                          : 'text-[#706B63] hover:text-[#2D2A26]'
                      }`}
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>7-Day Dinners ({weeklyPlan.dinners.length})</span>
                    </button>
                    <button
                      onClick={() => setWeekSubTab('lunches')}
                      className={`px-5 py-2 rounded-full text-xs font-bold transition flex items-center space-x-1.5 ${
                        weekSubTab === 'lunches'
                          ? 'bg-[#697A53] text-[#FFFFFF] shadow-xs'
                          : 'text-[#706B63] hover:text-[#2D2A26]'
                      }`}
                    >
                      <Utensils className="h-3.5 w-3.5" />
                      <span>Batch Lunches ({weeklyPlan.batchLunches.length})</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleExportBatchPdf}
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#5D6A74] border border-[#EADBCE] transition flex items-center space-x-1.5 shadow-xs"
                    >
                      <FileDown className="h-3.5 w-3.5 text-[#5D6A74]" />
                      <span>Export All Guide (PDF)</span>
                    </button>
                  </div>
                </div>

                {weekSubTab === 'dinners' ? (
                  <div className="space-y-6">
                    <WeeklyCalendarStrip
                      dinners={weeklyPlan.dinners}
                      selectedRecipeId={selectedRecipeId}
                      onSelectRecipe={(id) => {
                        setSelectedRecipeId(id);
                        const match = weeklyPlan.dinners.find(d => d.id === id);
                        if (match) setQuickViewRecipe(match);
                      }}
                      onOpenQuickView={handleSelectRecipeAndOpenQuickView}
                    />

                    <RecipeCardsView
                      dinners={weeklyPlan.dinners}
                      selectedRecipeId={selectedRecipeId}
                      onSelectRecipe={(id) => {
                        setSelectedRecipeId(id);
                        const match = weeklyPlan.dinners.find(d => d.id === id);
                        if (match) setQuickViewRecipe(match);
                      }}
                      onSwapRecipe={handleSwapRecipe}
                      isSwapping={isSwappingRecipe}
                      onExportBatchPdf={handleExportBatchPdf}
                    />
                  </div>
                ) : (
                  <BatchLunchView batchLunches={weeklyPlan.batchLunches} />
                )}
              </>
            )}
          </div>
        )}

        {/* ================= GENERATE TAB ================= */}
        {navTab === 'generate' && (
          <div className="space-y-6">
            <div className="bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl p-8 shadow-[0_8px_20px_-4px_rgba(45,42,38,0.06),0_4px_8px_-2px_rgba(45,42,38,0.04)] text-center max-w-xl mx-auto space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-[#F4C95D]/25 text-[#2D2A26] flex items-center justify-center mx-auto border border-[#F4C95D]/40 shadow-xs">
                <Sparkles className="h-8 w-8 text-[#2D2A26]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2D2A26]">
                AI Menu Generation
              </h3>
              <p className="text-xs sm:text-sm text-[#706B63] leading-relaxed">
                Open the AI configuration panel to set portion sizing, dinner and leftover counts, batch lunch preferences, cravings, and allergy safeguards.
              </p>
              <button
                onClick={() => setIsAiSidebarOpen(true)}
                className="inline-flex items-center px-6 py-3.5 rounded-full text-sm font-bold bg-[#F4C95D] hover:bg-[#ebbd4d] text-[#2D2A26] shadow-md transition"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Open Generation Panel</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= LIST TAB ================= */}
        {navTab === 'list' && (
          <div className="space-y-6">
            <RunningGroceryListView
              items={weeklyPlan.groceryItems}
              onToggleItem={handleToggleGroceryItem}
              onAddItem={handleAddGroceryItem}
              onDeleteItem={handleDeleteGroceryItem}
              onSyncKeep={() => setIsKeepSyncModalOpen(true)}
              preferredStore={preferredStore}
              onChangeStore={(s) => setPreferredStore(s)}
            />
          </div>
        )}

        {/* ================= PROFILE TAB ================= */}
        {navTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-[#FFFFFF] border border-[#EADBCE] rounded-2xl p-6 sm:p-8 shadow-[0_8px_20px_-4px_rgba(45,42,38,0.06),0_4px_8px_-2px_rgba(45,42,38,0.04)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-[#EADBCE] gap-4">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-lg bg-[#697A53]/15 text-[#697A53] flex items-center justify-center font-bold text-sm">
                      <Users className="h-4 w-4" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#2D2A26] tracking-tight">
                      {householdParameters.householdName || 'My Household'}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#706B63] mt-1">
                    {householdParameters.diners.length} Members •{' '}
                    {householdParameters.diners.reduce((s, d) => s + (d.portionMultiplier ?? (d.requiresAdultPortion ? 1 : 0.5)), 0)} Adult Portions • Max Prep &le;{householdParameters.cookingRules?.maxActivePrepMinutes || 30}m
                  </p>
                </div>
                
                <div className="flex items-center space-x-2.5 flex-wrap">
                  <button
                    onClick={() => {
                      setIsOnboardingOpen(false);
                      setIsRulesOpen(true);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-[#697A53] hover:bg-[#596945] text-[#FFFFFF] transition shadow-xs flex items-center space-x-1.5"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Edit Household Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reset the app? This clears all local preferences, meal plans, and grocery lists to begin fresh.')) {
                        localStorage.removeItem('family_household_parameters');
                        localStorage.removeItem('family_weekly_plan');
                        setHouseholdParameters(emptyHouseholdParameters);
                        setWeeklyPlan(emptyMealPlan);
                        setIsOnboardingOpen(true);
                        setIsRulesOpen(true);
                        showToast('Workspace reset to factory settings.', 'info');
                      }
                    }}
                    className="px-3.5 py-2 rounded-full text-xs font-medium text-[#706B63] hover:text-rose-700 hover:bg-rose-50 border border-[#EADBCE] transition flex items-center space-x-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset to Scratch</span>
                  </button>
                </div>
              </div>

              {/* Diners List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#2D2A26] uppercase tracking-wider">
                    Household Members & Dietary Restrictions
                  </h4>
                  <button
                    onClick={() => {
                      setIsOnboardingOpen(false);
                      setIsRulesOpen(true);
                    }}
                    className="text-xs font-bold text-[#697A53] hover:underline flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Manage Members</span>
                  </button>
                </div>

                {householdParameters.diners.length === 0 ? (
                  <div className="p-8 text-center bg-[#F8F5EE] border border-dashed border-[#EADBCE] rounded-xl space-y-3">
                    <Users className="h-8 w-8 text-[#706B63] mx-auto opacity-40" />
                    <div>
                      <p className="text-sm font-bold text-[#2D2A26]">No Members Configured</p>
                      <p className="text-xs text-[#706B63] max-w-sm mx-auto mt-0.5">
                        Set up your household with custom roles, relative ages, allergens, and food preferences.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsOnboardingOpen(true);
                        setIsRulesOpen(true);
                      }}
                      className="px-4 py-2 rounded-full text-xs font-bold bg-[#697A53] text-[#FFFFFF] hover:bg-[#596945] transition"
                    >
                      + Add First Member
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {householdParameters.diners.map((diner) => (
                      <div
                        key={diner.id}
                        className="p-4 rounded-xl bg-[#F8F5EE] border border-[#EADBCE] space-y-2.5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-[#2D2A26]">{diner.name}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFFFFF] text-[#5D6A74] border border-[#EADBCE]">
                                {diner.relativeAge || 'Adult'}
                              </span>
                            </div>
                            <p className="text-xs text-[#706B63]">{diner.role}</p>
                          </div>
                          {diner.dietaryBadge && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#697A53]/15 text-[#697A53] border border-[#697A53]/25 shrink-0">
                              {diner.dietaryBadge}
                            </span>
                          )}
                        </div>

                        {diner.allergens && diner.allergens.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">
                              Allergies & Intolerances
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {diner.allergens.map((alg) => (
                                <span
                                  key={alg}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200"
                                >
                                  Avoids {alg}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {diner.foodPreferences && diner.foodPreferences.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-[#697A53] tracking-wider">
                              Cuisine & Preferences
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {diner.foodPreferences.map((pref) => (
                                <span
                                  key={pref}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#697A53]/10 text-[#596945] border border-[#697A53]/20"
                                >
                                  {pref}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {diner.dietaryDescription && (
                          <p className="text-xs text-[#2D2A26] font-medium pt-1 border-t border-[#EADBCE]/60">
                            {diner.dietaryDescription}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom AI Directives */}
              <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#EADBCE] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-[#F4C95D]" />
                    <h4 className="text-xs font-bold text-[#2D2A26] uppercase tracking-wider">
                      Recipe AI Directives
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      setIsOnboardingOpen(false);
                      setIsRulesOpen(true);
                    }}
                    className="text-xs font-bold text-[#697A53] hover:underline"
                  >
                    Edit Directives
                  </button>
                </div>
                <p className="text-xs text-[#706B63] leading-relaxed">
                  These instructions guide Gemini during weekly plan generation, portions, and recipe replacements.
                </p>
                {householdParameters.customAiNotes ? (
                  <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#EADBCE] text-xs text-[#2D2A26] font-medium italic">
                    &ldquo;{householdParameters.customAiNotes}&rdquo;
                  </div>
                ) : (
                  <div className="p-3 bg-[#FFFFFF] rounded-lg border border-dashed border-[#EADBCE] text-xs text-[#706B63]">
                    No custom directives configured. Click &ldquo;Edit Directives&rdquo; to add preferred seasonings, portion guidelines, or cooking notes.
                  </div>
                )}
              </div>

              {/* Cooking Rhythm & Safeguards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#EADBCE]">
                  <p className="text-[10px] text-[#706B63] uppercase font-bold">Max Active Prep</p>
                  <p className="text-sm font-bold text-[#2D2A26] mt-0.5">&le;{householdParameters.cookingRules?.maxActivePrepMinutes || 30} mins</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#EADBCE]">
                  <p className="text-[10px] text-[#706B63] uppercase font-bold">Weekly Dinners</p>
                  <p className="text-sm font-bold text-[#2D2A26] mt-0.5">{householdParameters.cookingRules?.freshDinnersCount || 4} fresh cooks</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#EADBCE]">
                  <p className="text-[10px] text-[#706B63] uppercase font-bold">Leftover Nights</p>
                  <p className="text-sm font-bold text-[#2D2A26] mt-0.5">{householdParameters.cookingRules?.leftoversCount || 3} scheduled</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#EADBCE]">
                  <p className="text-[10px] text-[#706B63] uppercase font-bold">Modular Toppings</p>
                  <p className="text-sm font-bold text-[#2D2A26] mt-0.5">{householdParameters.cookingRules?.modularToppingsRequired ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>

              {/* Permanent Doc controls */}
              <div className="pt-4 border-t border-[#EADBCE] flex items-center justify-between flex-wrap gap-3">
                <div className="text-xs text-[#706B63]">
                  Connected Doc: <span className="font-mono text-[#2D2A26]">{PERMANENT_GOOGLE_DOC_ID}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleOpenDocSync}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F8F5EE] text-[#5D6A74] border border-[#EADBCE] transition shadow-xs flex items-center space-x-1.5"
                  >
                    <FileText className="h-3.5 w-3.5 text-[#697A53]" />
                    <span>Sync Live Doc</span>
                  </button>
                  <a
                    href={`https://docs.google.com/document/d/${PERMANENT_GOOGLE_DOC_ID}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-[#706B63] hover:text-[#2D2A26] rounded-full border border-[#EADBCE] hover:bg-[#F8F5EE] transition"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 4. Recipe Quick-View Modal */}
      <RecipeQuickViewModal
        recipe={quickViewRecipe}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onSwapRecipe={handleSwapRecipe}
        isSwapping={isSwappingRecipe}
      />

      {/* 5. AI Menu Generation Sidebar */}
      <AiMenuGenerationSidebar
        isOpen={isAiSidebarOpen}
        onClose={() => setIsAiSidebarOpen(false)}
        onSubmit={handleGeneratePlan}
        isLoading={isGeneratingPlan}
        householdParameters={householdParameters}
      />

      {/* Navigation: Fixed Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={navTab}
        onSelectTab={(tab) => {
          if (tab === 'generate') {
            setIsAiSidebarOpen(true);
          } else {
            setNavTab(tab);
          }
        }}
        groceryBadgeCount={weeklyPlan.groceryItems.filter(i => !i.completed).length}
      />

      {/* Footer */}
      <footer className="border-t border-[#EADBCE] bg-[#FFFFFF]/80 py-6 text-xs text-[#706B63] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#2D2A26]">FamilyTable</span>
            <span>•</span>
            <span>
              {householdParameters.diners.length > 0
                ? `${householdParameters.diners.map(d => d.name).slice(0, 3).join(', ')}${householdParameters.diners.length > 3 ? ' & family' : ''}'s Culinary Planner`
                : 'Personalized Family Table Planner'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setIsOnboardingOpen(false);
                setIsRulesOpen(true);
              }}
              className="text-[#706B63] hover:text-[#2D2A26] transition font-medium"
            >
              Household Rules
            </button>
            <a
              href={`https://docs.google.com/document/d/${PERMANENT_GOOGLE_DOC_ID}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#697A53] hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>Permanent Google Doc</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Dietary Rules / Onboarding modal */}
      <HouseholdRulesModal
        isOpen={isRulesOpen}
        onClose={() => {
          setIsRulesOpen(false);
          setIsOnboardingOpen(false);
        }}
        parameters={householdParameters}
        isOnboarding={isOnboardingOpen}
        onSaveParameters={(updated) => {
          setHouseholdParameters(updated);
          localStorage.setItem('family_household_parameters', JSON.stringify(updated));
          setIsOnboardingOpen(false);
          showToast('Household profile saved successfully!', 'success');
        }}
        onResetParameters={() => {
          setHouseholdParameters(emptyHouseholdParameters);
          localStorage.removeItem('family_household_parameters');
          setIsOnboardingOpen(true);
          showToast('Household cleared. Set up your family from scratch!', 'info');
        }}
      />

      {/* Questionnaire modal */}
      <QuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onSubmit={handleGeneratePlan}
        isLoading={isGeneratingPlan}
        householdParameters={householdParameters}
      />

      {/* Google Doc Sync modal */}
      <GoogleDocSyncModal
        isOpen={isDocSyncModalOpen}
        onClose={() => setIsDocSyncModalOpen(false)}
        onConfirm={handleConfirmDocSync}
        plan={weeklyPlan}
        isLoading={isSyncingDoc}
        result={docSyncResult}
        isAuthenticated={!!user || !!accessToken}
        onSignIn={handleSignIn}
      />

      {/* Google Keep Sync modal */}
      <GoogleKeepSyncModal
        isOpen={isKeepSyncModalOpen}
        onClose={() => setIsKeepSyncModalOpen(false)}
        items={weeklyPlan.groceryItems}
        onProceedToInstacart={() => {
          setNavTab('list');
        }}
        preferredStore={preferredStore}
      />

      {/* Floating In-App Toast Notification Banner */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-top-3 fade-in duration-200">
          <div className={`p-4 rounded-2xl border shadow-xl flex items-start space-x-3 ${
            notification.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : notification.type === 'success'
              ? 'bg-[#F8F5EE] border-[#697A53]/30 text-[#2D2A26]'
              : 'bg-[#FFFFFF] border-[#EADBCE] text-[#2D2A26]'
          }`}>
            {notification.type === 'error' ? (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            ) : notification.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-[#697A53] shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="h-5 w-5 text-[#F4C95D] shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs font-medium leading-relaxed">
              {notification.message}
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-[#706B63] hover:text-[#2D2A26] p-0.5 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}