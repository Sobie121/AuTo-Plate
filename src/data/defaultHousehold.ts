import { HouseholdParameters, RelativeAge } from '../types';

export const COMMON_ALLERGENS = [
  'Milk / Dairy',
  'Eggs',
  'Peanuts',
  'Tree Nuts',
  'Fish',
  'Shellfish',
  'Wheat / Gluten',
  'Soy',
  'Sesame',
  'Mustard',
  'Sulfites',
] as const;

export const COMMON_FOOD_PREFERENCES = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Keto / Low-Carb',
  'Paleo / Whole30',
  'High Protein',
  'Low Sodium',
  'Dairy-Free',
  'Gluten-Free',
  'Halal',
  'Kosher',
  'Kid-Friendly (Mild)',
  'Bold & Spicy Flavors',
  'Lean Meats (Poultry & Fish)',
  'Whole Foods (No processed fake cheeses)',
] as const;

export const RELATIVE_AGE_OPTIONS: RelativeAge[] = [
  'Adult',
  'Teen',
  'Child (4-12)',
  'Toddler (1-3)',
  'Infant (0-1)',
  'Senior',
];

export const FAMILY_ROLES = [
  'Self',
  'Partner',
  'Father',
  'Mother',
  'Son',
  'Daughter',
  'Child',
  'Toddler',
  'Infant',
  'Grandparent',
  'Roommate',
  'Other',
] as const;

export const emptyHouseholdParameters: HouseholdParameters = {
  householdName: 'My Family',
  hasCompletedOnboarding: false,
  diners: [],
  cookingRules: {
    maxActivePrepMinutes: 30,
    freshDinnersCount: 4,
    leftoversCount: 3,
    batchLunchDays: 'Sundays & Tuesdays',
    modularToppingsRequired: true,
    produceCrossUtilization: true,
  },
  dietaryRules: {
    strictlyDairyFree: false,
    soyAllowed: true,
    allowedSeafood: 'All seafood allowed',
    redMeatPreference: 'Balanced variety',
    dislikeFakeCheese: false,
    additionalRules: '',
  },
  customAiNotes: '',
};

export const defaultHouseholdParameters: HouseholdParameters = emptyHouseholdParameters;
