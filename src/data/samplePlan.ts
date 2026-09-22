import { WeeklyPlan } from '../types';

export const initialMealPlan: WeeklyPlan = {
  id: 'plan-2026-w39',
  weekOf: 'Current Week',
  title: 'Mediterranean & Asian Fusion Week',
  summary: 'Balanced 4 fresh dinners + 3 designated leftover nights, plus distinct Sunday and Tuesday batch lunches. 100% Dairy-Free core recipes with modular feta/tzatziki on the side for Stephen, ground turkey lean protein, pan-seared salmon, and gentle deconstructed toddler portions for Logan.',
  dinnersCount: 4,
  leftoverCount: 3,
  dinners: [
    {
      id: 'dinner-1',
      title: 'Greek Lemon-Herb Ground Turkey Gyro Bowls',
      cuisine: 'Greek / Mediterranean',
      flavorProfile: 'Bright lemon, oregano, garlic, punchy kalamata olives',
      day: 'Monday (Fresh Cook)',
      isLeftoverNight: false,
      prepMinutes: 10,
      cookMinutes: 15,
      activePrepMinutes: 20,
      totalTimeMinutes: 25,
      isSlowCooker: false,
      servings: 4,
      dairyFreeNotes: '100% dairy-free base. Turkey cooked in olive oil with garlic, oregano, and lemon juice. Traditional tzatziki and feta served strictly on the side in separate ramekins.',
      toddlerModification: {
        title: "Logan's Deconstructed Gyro Plate",
        instructions: 'Keep seasoned turkey, warm pita strips, diced seedless cucumbers, and avocado cubes in separate compartments on her plate.',
        fingerFoodTips: 'Cut cucumbers into thin half-moons and pita into easy-to-grasp finger strips without raw onions.'
      },
      modularToppings: [
        'Crumbled Feta Cheese (Stephen & Sara)',
        'Authentic Tzatziki (Stephen & Sara)',
        'Chopped Kalamata Olives (Stephen)'
      ],
      ingredients: [
        { item: 'Lean ground turkey (93/7)', amount: '1.25 lbs', category: 'Meat, Poultry & Seafood' },
        { item: 'English seedless cucumbers', amount: '2 large', category: 'Produce' },
        { item: 'Cherry tomatoes', amount: '1 pint', category: 'Produce' },
        { item: 'Red onion', amount: '1 medium', category: 'Produce' },
        { item: 'Fresh lemons', amount: '3', category: 'Produce' },
        { item: 'Fresh garlic', amount: '1 head', category: 'Produce' },
        { item: 'Pita flatbreads', amount: '1 package (4 ct)', category: 'Bakery & Grains' },
        { item: 'Jasmine or basmati rice', amount: '2 cups', category: 'Pantry & Condiments', pantryStaple: true },
        { item: 'Olive oil & dried oregano', amount: 'Staple', category: 'Spices & Seasonings', pantryStaple: true },
        { item: 'Kalamata olives (jarred)', amount: '1 jar', category: 'Pantry & Condiments' },
        { item: 'Greek feta cheese tub', amount: '1 tub', category: 'Refrigerated & Dairy-Free' },
        { item: 'Traditional Tzatziki dip', amount: '1 tub', category: 'Refrigerated & Dairy-Free' }
      ],
      instructions: [
        'Cook jasmine rice with a pinch of sea salt and lemon zest.',
        'Heat 1 tbsp olive oil in a skillet over medium-high heat. Brown ground turkey with minced garlic, dried oregano, salt, and black pepper (6–8 mins) until fully cooked.',
        'Dice cucumbers and halve cherry tomatoes. Thinly slice red onion.',
        'Assemble bowls: Warm rice base topped with seasoned turkey and fresh cucumber-tomato salad.',
        'Serve bowls for Taryn dairy-free with lemon juice and olive oil drizzle.',
        'Place feta, tzatziki, and kalamata olives on the side for Stephen and Sara to customize.'
      ]
    },
    {
      id: 'dinner-2',
      title: 'Encore Night: Gyro Bowls & Spiced Rice',
      cuisine: 'Greek / Mediterranean',
      flavorProfile: 'Reheated Greek gyro bowls with fresh warm pita and crisp greens',
      day: 'Tuesday (Leftover Night)',
      isLeftoverNight: true,
      leftoverSource: 'Monday Greek Turkey Gyro Bowls',
      activePrepMinutes: 10,
      totalTimeMinutes: 10,
      isSlowCooker: false,
      servings: 4,
      dairyFreeNotes: 'Zero new prep. Keep dairy toppings modular on the side.',
      toddlerModification: {
        title: "Logan's Warm Pita & Turkey Snacker",
        instructions: 'Gently warm turkey and rice; pair with freshly sliced cucumbers and a drizzle of olive oil.',
        fingerFoodTips: 'Toast pita lightly so it stays soft and pliable for toddler bites.'
      },
      modularToppings: [
        'Kalamata olives & Feta for Stephen'
      ],
      ingredients: [
        { item: 'Leftover turkey gyro & rice from Monday', amount: 'Portioned', category: 'Pantry & Condiments' },
        { item: 'Mixed baby greens', amount: '1 clamshell (5 oz)', category: 'Produce' }
      ],
      instructions: [
        'Reheat ground turkey and rice in skillet or microwave for quick zero-stress dinner.',
        'Warm remaining pita bread.',
        'Toss remaining fresh cucumbers and tomatoes with mixed baby greens and red wine vinegar.',
        'Serve family-style with optional side toppings.'
      ]
    },
    {
      id: 'dinner-3',
      title: 'Thai Coconut-Lime & Tamari Turkey Stir-Fry',
      cuisine: 'Thai / Asian',
      flavorProfile: 'Silky coconut cream, fresh lime, ginger, garlic, rich tamari/soy sauce',
      day: 'Wednesday (Fresh Cook)',
      isLeftoverNight: false,
      prepMinutes: 10,
      cookMinutes: 15,
      activePrepMinutes: 15,
      totalTimeMinutes: 25,
      isSlowCooker: false,
      servings: 4,
      dairyFreeNotes: 'Naturally 100% dairy-free. Uses full-fat unsweetened canned coconut milk for rich, velvety sauce. Soy/Tamari is allowed.',
      toddlerModification: {
        title: "Logan's Mild Coconut Rice & Soft Veggie Bowl",
        instructions: 'Before adding chili pepper or heavy lime, reserve a small scoop of ground turkey and soft bell pepper strips tossed with coconut rice.',
        fingerFoodTips: 'Bell peppers cooked until tender-soft; turkey crumbled finely.'
      },
      modularToppings: [
        'Fresh chopped red chilies or Sriracha (Stephen)',
        'Toasted crushed peanuts or cashews'
      ],
      ingredients: [
        { item: 'Lean ground turkey (93/7)', amount: '1.25 lbs', category: 'Meat, Poultry & Seafood' },
        { item: 'Full-fat canned coconut milk', amount: '1 can (13.5 oz)', category: 'Pantry & Condiments' },
        { item: 'Red bell peppers', amount: '2 large', category: 'Produce' },
        { item: 'Fresh broccoli florets', amount: '1 bag (12 oz)', category: 'Produce' },
        { item: 'Fresh ginger root', amount: '1 knob', category: 'Produce' },
        { item: 'Fresh limes', amount: '2', category: 'Produce' },
        { item: 'Soy sauce or Tamari', amount: '3 tbsp', category: 'Pantry & Condiments', pantryStaple: true },
        { item: 'Sesame oil & honey or maple', amount: '2 tbsp', category: 'Pantry & Condiments', pantryStaple: true },
        { item: 'Rice noodles or jasmine rice', amount: '8 oz', category: 'Bakery & Grains' }
      ],
      instructions: [
        'Cook rice noodles or jasmine rice according to package directions.',
        'Whisk coconut milk, tamari, 1 tbsp lime juice, minced ginger, and 1 tsp honey in a bowl.',
        'In a large skillet or wok, brown ground turkey in 1 tbsp oil until golden (6 mins).',
        'Add sliced red bell peppers and broccoli florets; stir-fry 4 minutes until vibrant and tender-crisp.',
        'Pour in coconut-tamari sauce and simmer 3 minutes until thickened and glossy.',
        'Reserve Logan’s mild portion. Spoon over rice noodles for Stephen, Taryn, and Sara; finish with lime wedges and optional chili flakes for Stephen.'
      ]
    },
    {
      id: 'dinner-4',
      title: 'Encore Night: Thai Coconut Turkey & Noodles',
      cuisine: 'Thai / Asian',
      flavorProfile: 'Rich coconut noodles with tender turkey and crisp broccoli',
      day: 'Thursday (Leftover Night)',
      isLeftoverNight: true,
      leftoverSource: 'Wednesday Thai Coconut Turkey Stir-Fry',
      activePrepMinutes: 5,
      totalTimeMinutes: 10,
      isSlowCooker: false,
      servings: 4,
      dairyFreeNotes: 'Naturally dairy-free reheated dinner. Squeeze fresh lime over bowls before serving.',
      toddlerModification: {
        title: "Logan's Warm Noodle Loops",
        instructions: 'Cut long noodles with kitchen shears into 1-inch lengths for easy spooning.',
        fingerFoodTips: 'Warm broccoli florets cut into tiny bite-size pieces.'
      },
      modularToppings: [
        'Sriracha or chili crisp (Stephen)'
      ],
      ingredients: [
        { item: 'Leftover coconut turkey & noodles', amount: 'Portioned', category: 'Pantry & Condiments' },
        { item: 'Fresh lime wedge', amount: '1 wedge', category: 'Produce' }
      ],
      instructions: [
        'Reheat coconut turkey and noodles in a covered skillet with 2 tbsp water to loosen the silky sauce.',
        'Serve with fresh lime squeeze and optional hot sauce for Stephen.'
      ]
    },
    {
      id: 'dinner-5',
      title: 'Pan-Seared Honey-Soy Atlantic Salmon with Garlic Bok Choy & Jasmine Rice',
      cuisine: 'Asian / Coastal Pacific',
      flavorProfile: 'Crispy skin, glossy honey-soy garlic glaze, nutty sesame bok choy, fragrant jasmine rice',
      day: 'Friday (Fresh Cook - Date Night In)',
      isLeftoverNight: false,
      prepMinutes: 5,
      cookMinutes: 15,
      activePrepMinutes: 5,
      totalTimeMinutes: 20,
      isSlowCooker: false,
      servings: 4,
      dairyFreeNotes: '100% dairy-free. Salmon seared in olive and sesame oil; glaze made with pure honey, soy sauce/tamari, ginger, and garlic (no butter).',
      toddlerModification: {
        title: "Logan's Flaked Salmon & Jasmine Rice",
        instructions: 'Flake cooked salmon fillet into small boneless pieces, mixed into soft jasmine rice with mild steamed bok choy stems.',
        fingerFoodTips: 'Check thoroughly for any pin bones; slice tender bok choy stems into bite-sized half moons.'
      },
      modularToppings: [
        'Sriracha chili crisp on the side (Stephen)',
        'Extra toasted sesame seeds & fresh scallions'
      ],
      ingredients: [
        { item: 'Atlantic Salmon Fillets (6 oz each, skin-on)', amount: '4 fillets', category: 'Meat, Poultry & Seafood' },
        { item: 'Olive Oil & Toasted Sesame Oil', amount: '1 tbsp olive oil & 1 tsp sesame oil', category: 'Pantry & Condiments', pantryStaple: true },
        { item: 'Soy Sauce or Tamari', amount: '3 tbsp', category: 'Pantry & Condiments', pantryStaple: true },
        { item: 'Pure Honey', amount: '2 tbsp', category: 'Pantry & Condiments', pantryStaple: true },
        { item: 'Fresh Ginger, grated', amount: '1 tbsp', category: 'Produce' },
        { item: 'Fresh Garlic, minced', amount: '3 cloves', category: 'Produce' },
        { item: 'Baby Bok Choy, halved lengthwise', amount: '1 lb', category: 'Produce' },
        { item: 'Steamed Jasmine Rice', amount: '2 cups', category: 'Pantry & Condiments', pantryStaple: true },
        { item: 'Toasted Sesame Seeds', amount: '1 tbsp', category: 'Spices & Seasonings', pantryStaple: true },
        { item: 'Modular Side for Stephen: Sriracha chili crisp on the side', amount: 'To taste', category: 'Pantry & Condiments' }
      ],
      instructions: [
        'Pat salmon fillets thoroughly dry with paper towels; season with salt and pepper.',
        'Whisk soy sauce, honey, minced garlic, and grated ginger in a small bowl.',
        'Heat olive oil in a large non-stick skillet over medium-high. Place salmon skin-side down; sear for 5-6 minutes until crisp. Flip and cook 3-4 minutes more until salmon reaches 145°F.',
        'Pour glaze over fillets for the final 60 seconds until bubbling and glossy. Transfer salmon to a plate.',
        'In the same skillet, add halved bok choy and sesame oil; sauté 3 minutes until tender-crisp.',
        'Plate salmon alongside jasmine rice and bok choy; drizzle remaining skillet pan juices.'
      ]
    },
    {
      id: 'dinner-6',
      title: 'Slow-Cooker Cuban Citrus-Mojo Shredded Pork Carnitas',
      cuisine: 'Cuban / Latin',
      flavorProfile: 'Zesty orange, lime, cumin, oregano, and garlic braised tender pork',
      day: 'Saturday (Hands-Off Crockpot)',
      isLeftoverNight: false,
      prepMinutes: 15,
      cookMinutes: 345,
      activePrepMinutes: 15,
      totalTimeMinutes: 360,
      isSlowCooker: true,
      servings: 4,
      dairyFreeNotes: '100% dairy-free. Braised in real orange juice, lime juice, garlic, and Mexican oregano. Serve with corn tortillas or black beans & rice.',
      toddlerModification: {
        title: "Logan's Shredded Carnitas Taco Plate",
        instructions: 'Tender shredded pork (very soft from slow cooker) with warm corn tortilla triangles, black beans, and diced avocado.',
        fingerFoodTips: 'Black beans slightly mashed with back of fork for easy eating.'
      },
      modularToppings: [
        'Pickled jalapeños or hot salsa (Stephen)',
        'Cotija cheese for Stephen & Sara (strictly on the side)',
        'Diced avocado & fresh cilantro'
      ],
      ingredients: [
        { item: 'Boneless pork shoulder or loin roast', amount: '3 lbs', category: 'Meat, Poultry & Seafood' },
        { item: 'Fresh navel oranges', amount: '2', category: 'Produce' },
        { item: 'Fresh limes', amount: '3', category: 'Produce' },
        { item: 'Yellow onions', amount: '2', category: 'Produce' },
        { item: 'Fresh cilantro', amount: '1 bunch', category: 'Produce' },
        { item: 'Avocados', amount: '3', category: 'Produce' },
        { item: 'Canned black beans', amount: '2 cans (15 oz)', category: 'Pantry & Condiments' },
        { item: 'Corn tortillas', amount: '1 pack (12 ct)', category: 'Bakery & Grains' },
        { item: 'Ground cumin & Mexican oregano', amount: '1 tbsp each', category: 'Spices & Seasonings', pantryStaple: true },
        { item: 'Cotija cheese block (side topping)', amount: '1 small wedge', category: 'Refrigerated & Dairy-Free' }
      ],
      instructions: [
        'Cut pork into large chunks. Season with cumin, oregano, salt, and pepper.',
        'Place pork in slow cooker with sliced yellow onions, 6 smashed garlic cloves, juice of 2 oranges, and juice of 2 limes.',
        'Cover and cook on LOW for 7–8 hours (or HIGH for 4–5 hours) until melt-in-your-mouth tender.',
        'Shred meat with two forks. (Optional: spread on a baking sheet and broil 4 minutes for crispy carnitas edges).',
        'Warm black beans and corn tortillas.',
        'Serve customizable taco spread with cilantro, diced avocado, lime wedges, and side cotija for Stephen.'
      ]
    },
    {
      id: 'dinner-7',
      title: 'Encore Night: Mojo Pork Rice Bowls & Black Beans',
      cuisine: 'Cuban / Latin',
      flavorProfile: 'Mojo pork juices spooned over warm rice, black beans, and fresh avocado',
      day: 'Sunday (Leftover Night)',
      isLeftoverNight: true,
      leftoverSource: 'Saturday Cuban Mojo Carnitas',
      activePrepMinutes: 5,
      totalTimeMinutes: 10,
      isSlowCooker: false,
      servings: 4,
      dairyFreeNotes: 'Reheated pork and beans. 100% dairy-free base.',
      toddlerModification: {
        title: "Logan's Fiesta Bowl",
        instructions: 'Layer rice, soft black beans, and juicy pork chunks with ripe avocado cubes.',
        fingerFoodTips: 'Soft and spoon-friendly for highchair dining.'
      },
      modularToppings: [
        'Side salsa, hot sauce & pickled onions'
      ],
      ingredients: [
        { item: 'Leftover Cuban Mojo Pork & Black Beans', amount: 'Portioned', category: 'Pantry & Condiments' },
        { item: 'Remaining ripe avocado', amount: '1', category: 'Produce' }
      ],
      instructions: [
        'Reheat shredded pork with its savory cooking juices in a pan.',
        'Warm remaining black beans and rice.',
        'Top with fresh cilantro and freshly sliced avocado.'
      ]
    }
  ],
  batchLunches: [
    {
      id: 'lunch-1',
      title: 'Chimichurri Roasted Turkey & Sweet Potato Grain Bowls',
      prepDay: 'Sunday',
      servings: 4,
      prepMinutes: 15,
      cookMinutes: 25,
      flavorProfile: 'Zesty Argentine chimichurri (parsley, red wine vinegar, garlic, olive oil) over roasted sweet potatoes and lean ground turkey',
      distinctFromDinnersReason: 'Different flavor profile (herbaceous tangy chimichurri vs Greek gyro/Asian coconut/Cuban mojo). Distinct format: cold or room-temp grain bowl that packs well for office.',
      workPackagingTips: 'Pack chimichurri sauce in a separate small dressing container; reheat sweet potatoes and turkey for 90 seconds, then drizzle fresh chimichurri over top.',
      homeReheatTips: 'Sara and Logan can heat bowls in 1 minute in microwave. Sweet potato cubes are naturally sweet and tender for Logan.',
      dairyFreeNotes: 'Naturally 100% dairy-free. Chimichurri is olive oil based.',
      toddlerModification: {
        title: "Logan's Sweet Potato & Turkey Coins",
        instructions: 'Sweet potatoes roasted soft until caramelized; ground turkey seasoned gently before tossing with chimichurri.',
        fingerFoodTips: 'Sweet potatoes cut into bite-sized half-inch cubes that smash softly between fingers.'
      },
      ingredients: [
        { item: 'Lean ground turkey (93/7)', amount: '1 lb', category: 'Meat, Poultry & Seafood' },
        { item: 'Sweet potatoes (garnet or jewel)', amount: '3 medium', category: 'Produce' },
        { item: 'Fresh Italian flat-leaf parsley', amount: '1 large bunch', category: 'Produce' },
        { item: 'Red wine vinegar', amount: '3 tbsp', category: 'Pantry & Condiments', pantryStaple: true },
        { item: 'Quinoa or brown rice', amount: '1.5 cups dry', category: 'Bakery & Grains' },
        { item: 'Olive oil, garlic, red pepper flakes', amount: 'Staple', category: 'Spices & Seasonings', pantryStaple: true }
      ],
      instructions: [
        'Preheat oven to 400°F. Peel and dice sweet potatoes into 1/2-inch cubes. Toss with olive oil and salt; roast 22 minutes until fork-tender.',
        'Cook quinoa in vegetable broth or water according to package directions.',
        'Brown ground turkey in a skillet with salt and pepper (6 minutes).',
        'Blend or finely chop parsley, 2 garlic cloves, 3 tbsp red wine vinegar, 1/3 cup olive oil, salt, and oregano for vibrant chimichurri.',
        'Divide into 4 meal-prep glass containers: quinoa base, roasted sweet potatoes, and turkey. Keep chimichurri dressing on the side for workdays.'
      ]
    },
    {
      id: 'lunch-2',
      title: 'Maple-Dijon Turkey & Apple Slaw Bento Wraps',
      prepDay: 'Tuesday',
      servings: 4,
      prepMinutes: 15,
      cookMinutes: 0,
      flavorProfile: 'Sweet & tangy maple-dijon vinaigrette with crisp Honeycrisp apples, shredded cabbage, and sliced roast turkey',
      distinctFromDinnersReason: 'Refreshing chilled bento wrap format (zero microwave required for work) with crisp fall apple-dijon flavor, totally separate from dinner cuisines.',
      workPackagingTips: 'Wrap tightly in parchment paper and slice on bias; pack apple-cabbage slaw separately or inside wrap day-of so tortilla remains crisp.',
      homeReheatTips: 'No reheating needed! Ready straight from fridge for Mom and Logan at lunchtime.',
      dairyFreeNotes: '100% dairy-free. Vinaigrette uses pure maple syrup and Dijon mustard with olive oil (no mayo, no cheese).',
      toddlerModification: {
        title: "Logan's Apple Matchsticks & Turkey Roll-Ups",
        instructions: 'Thinly slice Honeycrisp apple into safe matchsticks; roll turkey slices around avocado slices or cut wrap into mini pinwheels.',
        fingerFoodTips: 'Apple sticks cut thin to eliminate choking hazard; soft tortilla pinwheels.'
      },
      ingredients: [
        { item: 'Deli sliced roasted turkey breast (nitrate-free)', amount: '1 lb', category: 'Meat, Poultry & Seafood' },
        { item: 'Honeycrisp apples', amount: '2', category: 'Produce' },
        { item: 'Shredded cabbage slaw mix', amount: '1 bag (14 oz)', category: 'Produce' },
        { item: 'Whole wheat or spinach wraps', amount: '1 pack (4-6 ct)', category: 'Bakery & Grains' },
        { item: 'Dijon mustard', amount: '3 tbsp', category: 'Pantry & Condiments', pantryStaple: true },
        { item: 'Pure maple syrup', amount: '2 tbsp', category: 'Pantry & Condiments', pantryStaple: true },
        { item: 'Apple cider vinegar & olive oil', amount: 'Staple', category: 'Pantry & Condiments', pantryStaple: true }
      ],
      instructions: [
        'Whisk 3 tbsp Dijon mustard, 2 tbsp maple syrup, 1 tbsp cider vinegar, and 3 tbsp olive oil until emulsified.',
        'Thinly slice Honeycrisp apples and toss with shredded cabbage and half the maple-dijon dressing.',
        'Lay out tortillas, layer roasted turkey breast, crisp apple slaw, and a drizzle of dressing.',
        'Roll tightly into burritos and wrap in foil or wax paper for grab-and-go convenience.'
      ]
    }
  ],
  groceryItems: [
    // Produce
    { id: 'g-1', name: 'English seedless cucumbers', amount: '2 large', category: 'Produce', completed: false, sourceRecipe: 'Greek Turkey Gyro Bowls' },
    { id: 'g-2', name: 'Cherry tomatoes', amount: '1 pint', category: 'Produce', completed: false, sourceRecipe: 'Greek Turkey Gyro Bowls' },
    { id: 'g-3', name: 'Red onion', amount: '1 medium', category: 'Produce', completed: false, sourceRecipe: 'Greek Turkey Gyro Bowls' },
    { id: 'g-4', name: 'Fresh lemons', amount: '5 total', category: 'Produce', completed: false, sourceRecipe: 'Gyro Bowls & Salmon' },
    { id: 'g-5', name: 'Fresh garlic', amount: '2 heads', category: 'Produce', completed: false, sourceRecipe: 'Cross-recipe staple' },
    { id: 'g-6', name: 'Mixed baby greens', amount: '1 clamshell (5 oz)', category: 'Produce', completed: false, sourceRecipe: 'Encore Gyro Bowls' },
    { id: 'g-7', name: 'Red bell peppers', amount: '2 large', category: 'Produce', completed: false, sourceRecipe: 'Thai Coconut Turkey' },
    { id: 'g-8', name: 'Fresh broccoli florets', amount: '1 bag (12 oz)', category: 'Produce', completed: false, sourceRecipe: 'Thai Coconut Turkey' },
    { id: 'g-9', name: 'Fresh ginger root', amount: '1 knob', category: 'Produce', completed: false, sourceRecipe: 'Thai Coconut Turkey' },
    { id: 'g-10', name: 'Fresh limes', amount: '5 total', category: 'Produce', completed: false, sourceRecipe: 'Thai Turkey & Cuban Mojo' },
    { id: 'g-11', name: 'Baby gold potatoes', amount: '1.5 lbs bag', category: 'Produce', completed: false, sourceRecipe: 'Pan-Seared Salmon' },
    { id: 'g-12', name: 'Fresh green beans', amount: '1 lb bag', category: 'Produce', completed: false, sourceRecipe: 'Pan-Seared Salmon' },
    { id: 'g-13', name: 'Fresh dill', amount: '1 bunch', category: 'Produce', completed: false, sourceRecipe: 'Pan-Seared Salmon' },
    { id: 'g-14', name: 'Navel oranges', amount: '2', category: 'Produce', completed: false, sourceRecipe: 'Cuban Mojo Carnitas' },
    { id: 'g-15', name: 'Yellow onions', amount: '2', category: 'Produce', completed: false, sourceRecipe: 'Cuban Mojo Carnitas' },
    { id: 'g-16', name: 'Fresh cilantro', amount: '1 bunch', category: 'Produce', completed: false, sourceRecipe: 'Cuban Mojo Carnitas' },
    { id: 'g-17', name: 'Avocados', amount: '4 ripe', category: 'Produce', completed: false, sourceRecipe: 'Cuban Pork & Toddler plates' },
    { id: 'g-18', name: 'Sweet potatoes', amount: '3 medium', category: 'Produce', completed: false, sourceRecipe: 'Sunday Batch Lunch' },
    { id: 'g-19', name: 'Fresh Italian flat-leaf parsley', amount: '1 large bunch', category: 'Produce', completed: false, sourceRecipe: 'Sunday Chimichurri Lunch' },
    { id: 'g-20', name: 'Honeycrisp apples', amount: '2', category: 'Produce', completed: false, sourceRecipe: 'Tuesday Batch Lunch' },
    { id: 'g-21', name: 'Shredded cabbage slaw mix', amount: '1 bag (14 oz)', category: 'Produce', completed: false, sourceRecipe: 'Tuesday Batch Lunch' },

    // Meat, Poultry & Seafood
    { id: 'g-22', name: 'Lean ground turkey (93/7)', amount: '3.5 lbs total', category: 'Meat, Poultry & Seafood', completed: false, sourceRecipe: 'Gyro Bowls, Thai Stir-Fry & Chimichurri Lunch' },
    { id: 'g-23', name: 'Fresh Atlantic salmon fillets (skin-on)', amount: '1.5 lbs (4 fillets)', category: 'Meat, Poultry & Seafood', completed: false, sourceRecipe: 'Pan-Seared Salmon' },
    { id: 'g-24', name: 'Boneless pork shoulder roast', amount: '3 lbs', category: 'Meat, Poultry & Seafood', completed: false, sourceRecipe: 'Cuban Mojo Carnitas' },
    { id: 'g-25', name: 'Deli sliced roasted turkey breast (nitrate-free)', amount: '1 lb', category: 'Meat, Poultry & Seafood', completed: false, sourceRecipe: 'Tuesday Bento Wraps' },

    // Refrigerated & Dairy-Free
    { id: 'g-26', name: 'Greek feta cheese tub (side for Stephen/Sara)', amount: '1 tub (6 oz)', category: 'Refrigerated & Dairy-Free', completed: false, sourceRecipe: 'Gyro Bowls modular topping' },
    { id: 'g-27', name: 'Traditional Tzatziki dip (side for Stephen/Sara)', amount: '1 tub (8 oz)', category: 'Refrigerated & Dairy-Free', completed: false, sourceRecipe: 'Gyro Bowls modular topping' },
    { id: 'g-28', name: 'Cotija cheese block (side for Stephen/Sara)', amount: '1 small wedge', category: 'Refrigerated & Dairy-Free', completed: false, sourceRecipe: 'Cuban Mojo modular topping' },

    // Bakery & Grains
    { id: 'g-29', name: 'Pita flatbreads', amount: '1 package (4 ct)', category: 'Bakery & Grains', completed: false, sourceRecipe: 'Greek Gyro Bowls' },
    { id: 'g-30', name: 'Rice noodles or jasmine rice', amount: '8 oz package', category: 'Bakery & Grains', completed: false, sourceRecipe: 'Thai Stir-Fry' },
    { id: 'g-31', name: 'Corn tortillas', amount: '1 pack (12 ct)', category: 'Bakery & Grains', completed: false, sourceRecipe: 'Cuban Carnitas Tacos' },
    { id: 'g-32', name: 'Quinoa or brown rice', amount: '1 bag (16 oz)', category: 'Bakery & Grains', completed: false, sourceRecipe: 'Sunday Batch Lunch' },
    { id: 'g-33', name: 'Whole wheat or spinach wraps', amount: '1 pack (6 ct)', category: 'Bakery & Grains', completed: false, sourceRecipe: 'Tuesday Bento Wraps' },

    // Pantry & Condiments
    { id: 'g-34', name: 'Full-fat canned coconut milk', amount: '1 can (13.5 oz)', category: 'Pantry & Condiments', completed: false, sourceRecipe: 'Thai Coconut Turkey' },
    { id: 'g-35', name: 'Kalamata olives (jarred pitted)', amount: '1 jar (8 oz)', category: 'Pantry & Condiments', completed: false, sourceRecipe: 'Greek Gyro Bowls' },
    { id: 'g-36', name: 'Canned black beans', amount: '2 cans (15 oz)', category: 'Pantry & Condiments', completed: false, sourceRecipe: 'Cuban Carnitas' },

    // Household & Snacks (for Keep sync & Instacart)
    { id: 'g-37', name: 'Logan toddler fruit & veggie pouches', amount: '1 variety box', category: 'Household & Snacks', completed: false, isCustomItem: true },
    { id: 'g-38', name: 'Sparkling water (grapefruit or lime)', amount: '1 12-pack', category: 'Household & Snacks', completed: false, isCustomItem: true },
    { id: 'g-39', name: 'Paper towels & napkins', amount: '1 pack', category: 'Household & Snacks', completed: false, isCustomItem: true }
  ]
};
