// src/types.ts

export const PERMANENT_GOOGLE_DOC_ID = '1sM_YourPermanentDocIdHere';
export const GOOGLE_KEEP_NOTE_TITLE = 'Running Grocery List';

export type GroceryCategory =
  | 'Produce'
  | 'Meat, Poultry & Seafood'
  | 'Pantry & Condiments'
  | 'Refrigerated & Dairy-Free'
  | 'Bakery & Grains'
  | 'Spices & Seasonings'
  | 'Household & Snacks';

export interface Ingredient {
  item: string;
  amount: string;
  category: GroceryCategory;
  pantryStaple?: boolean;
}

export interface ToddlerModification {
  title: string;
  instructions: string;
  fingerFoodTips: string;
}

export interface Recipe {
  id: string;
  title: string;
  cuisine: string;
  flavorProfile: string;
  day: string;
  isLeftoverNight: boolean;
  leftoverSource?: string;
  prepMinutes: number;
  cookMinutes: number;
  activePrepMinutes: number;
  totalTimeMinutes: number;
  isSlowCooker: boolean;
  servings: number;
  dairyFreeNotes?: string;
  toddlerModification?: ToddlerModification;
  modularToppings?: string[];
  ingredients: Ingredient[];
  instructions: string[];
}

export interface BatchLunch {
  id: string;
  title: string;
  prepDay: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  flavorProfile: string;
  distinctFromDinnersReason?: string;
  workPackagingTips?: string;
  homeReheatTips?: string;
  dairyFreeNotes?: string;
  toddlerModification?: ToddlerModification;
  ingredients: Ingredient[];
  instructions: string[];
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: string;
  category: GroceryCategory;
  completed: boolean;
  sourceRecipe?: string;
  isPantryStaple?: boolean;
  isCustomItem?: boolean;
}

export interface WeeklyPlan {
  id: string;
  title: string;
  weekOf: string;
  summary: string;
  dinnersCount: number;
  leftoverCount: number;
  dinners: Recipe[];
  batchLunches: BatchLunch[];
  groceryItems: GroceryItem[];
  googleDocSyncedAt?: string;
}

export interface Diner {
  id: string;
  name: string;
  role: string;
  relativeAge?: string;
  requiresAdultPortion?: boolean;
  portionMultiplier?: number;
  allergens: string[];
  foodPreferences: string[];
  dietaryBadge: string;
  dietaryDescription?: string;
}

export interface CookingRules {
  maxActivePrepMinutes: number;
  freshDinnersCount: number;
  leftoversCount: number;
  batchLunchDays?: string;
  batchLunchPrepDays?: string[];
  modularToppingsRequired?: boolean;
  crossUtilizeProduce?: boolean;
}

export interface DietaryRules {
  strictlyDairyFree?: boolean;
  soyAllowed?: boolean;
  allowedSeafood?: string;
  redMeatPreference?: string;
  additionalRules?: string;
  glutenFree?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  dislikedIngredients?: string[];
  preferredProteins?: string[];
  additionalNotes?: string;
}

export interface ToddlerProtocol {
  childName?: string;
  separationRule?: string;
  safeTexturesRule?: string;
  chokingSafetyRule?: string;
}

export interface ChildProtocol {
  enabled: boolean;
  targetNames?: string;
  deconstruct?: boolean;
  mildSpicing?: boolean;
  textureNotes?: string;
}

export interface HouseholdParameters {
  hasCompletedOnboarding: boolean;
  householdName: string;
  preferredStore?: 'H-E-B' | 'Walmart' | 'Kroger';
  diners: Diner[];
  cookingRules?: CookingRules;
  dietaryRules?: DietaryRules;
  toddlerProtocol?: ToddlerProtocol;
  childProtocol?: ChildProtocol;
  customAiNotes?: string;
}

export interface QuestionnaireAnswers {
  dinnersCount: number;
  leftoversCount: number;
  portions: number;
  batchLunchesCount: number;
  specialOccasions: string;
  cravingsOrPriorities: string;
  avoidIngredients: string;
  preferredStore: 'H-E-B' | 'Walmart' | 'Kroger';
  householdParameters?: HouseholdParameters;
}