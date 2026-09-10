const DEFAULT_EXERCISES = [
  { name: 'Barbell Bench Press', category: 'Chest' },
  { name: 'Incline Dumbbell Press', category: 'Chest' },
  { name: 'Push Up', category: 'Chest' },
  { name: 'Cable Fly', category: 'Chest' },
  { name: 'Dumbbell Fly', category: 'Chest' },
  { name: 'Pull Up', category: 'Back' },
  { name: 'Lat Pulldown', category: 'Back' },
  { name: 'Barbell Row', category: 'Back' },
  { name: 'Seated Cable Row', category: 'Back' },
  { name: 'Deadlift', category: 'Back' },
  { name: 'Dumbbell Row', category: 'Back' },
  { name: 'Overhead Press', category: 'Shoulders' },
  { name: 'Lateral Raise', category: 'Shoulders' },
  { name: 'Front Raise', category: 'Shoulders' },
  { name: 'Face Pull', category: 'Shoulders' },
  { name: 'Arnold Press', category: 'Shoulders' },
  { name: 'Barbell Curl', category: 'Arms' },
  { name: 'Dumbbell Curl', category: 'Arms' },
  { name: 'Hammer Curl', category: 'Arms' },
  { name: 'Tricep Pushdown', category: 'Arms' },
  { name: 'Skull Crusher', category: 'Arms' },
  { name: 'Dips', category: 'Arms' },
  { name: 'Barbell Squat', category: 'Legs' },
  { name: 'Front Squat', category: 'Legs' },
  { name: 'Leg Press', category: 'Legs' },
  { name: 'Romanian Deadlift', category: 'Legs' },
  { name: 'Walking Lunge', category: 'Legs' },
  { name: 'Leg Extension', category: 'Legs' },
  { name: 'Leg Curl', category: 'Legs' },
  { name: 'Calf Raise', category: 'Legs' },
  { name: 'Hip Thrust', category: 'Legs' },
  { name: 'Plank', category: 'Core' },
  { name: 'Hanging Leg Raise', category: 'Core' },
  { name: 'Cable Crunch', category: 'Core' },
  { name: 'Russian Twist', category: 'Core' },
  { name: 'Ab Wheel Rollout', category: 'Core' },
  { name: 'Treadmill Run', category: 'Cardio' },
  { name: 'Cycling', category: 'Cardio' },
  { name: 'Rowing Machine', category: 'Cardio' },
  { name: 'Jump Rope', category: 'Cardio' },
  { name: 'Stair Climber', category: 'Cardio' },
  { name: 'Close-Grip Barbell Bench Press', category: 'Arms' },
  { name: 'Barbell Upright Row', category: 'Shoulders' },
  { name: 'Fixed Barbell Curl', category: 'Arms' },
  { name: 'Barbell Shrug', category: 'Back' },
  { name: 'Barbell Floor Press', category: 'Chest' },
  { name: 'Seated Barbell Press (Light)', category: 'Shoulders' },
  { name: 'Wide-Grip Bench Press', category: 'Chest' },
  { name: 'Fixed Barbell Overhead Tricep Extension', category: 'Arms' },
  { name: 'Pendlay Row', category: 'Back' },
  { name: 'Underhand-Grip Barbell Row (Yates Row)', category: 'Back' },
  { name: 'Fixed Barbell 21s', category: 'Arms' },
  { name: 'Barbell Rear Delt Row', category: 'Shoulders' },
  { name: 'Barbell Good Morning', category: 'Legs' },
  { name: 'Barbell Lunge', category: 'Legs' }
];

const DEFAULT_FOODS = [
  { name: 'Chicken Breast (cooked)', serving: '100 g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Ground Beef 90/10 (cooked)', serving: '100 g', calories: 176, protein: 20, carbs: 0, fat: 10 },
  { name: 'Salmon (cooked)', serving: '100 g', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Egg, whole', serving: '1 large', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8 },
  { name: 'Egg White', serving: '1 large', calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1 },
  { name: 'Greek Yogurt, plain nonfat', serving: '170 g', calories: 100, protein: 17, carbs: 6, fat: 0.7 },
  { name: 'Whey Protein Powder', serving: '1 scoop', calories: 120, protein: 24, carbs: 3, fat: 1.5 },
  { name: 'Cottage Cheese', serving: '100 g', calories: 98, protein: 11, carbs: 3.4, fat: 4.3 },
  { name: 'Tuna (canned in water)', serving: '100 g', calories: 116, protein: 26, carbs: 0, fat: 1 },
  { name: 'Tofu, firm', serving: '100 g', calories: 144, protein: 15, carbs: 3, fat: 8 },
  { name: 'White Rice (cooked)', serving: '100 g', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Brown Rice (cooked)', serving: '100 g', calories: 123, protein: 2.7, carbs: 26, fat: 1 },
  { name: 'Oats, dry', serving: '40 g', calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: 'Whole Wheat Bread', serving: '1 slice', calories: 81, protein: 4, carbs: 14, fat: 1.1 },
  { name: 'Sweet Potato (baked)', serving: '100 g', calories: 90, protein: 2, carbs: 21, fat: 0.1 },
  { name: 'Potato (baked)', serving: '100 g', calories: 93, protein: 2.5, carbs: 21, fat: 0.1 },
  { name: 'Pasta (cooked)', serving: '100 g', calories: 131, protein: 5, carbs: 25, fat: 1.1 },
  { name: 'Banana', serving: '1 medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Apple', serving: '1 medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Blueberries', serving: '100 g', calories: 57, protein: 0.7, carbs: 14, fat: 0.3 },
  { name: 'Broccoli (steamed)', serving: '100 g', calories: 35, protein: 2.4, carbs: 7, fat: 0.4 },
  { name: 'Spinach, raw', serving: '100 g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { name: 'Mixed Salad Greens', serving: '100 g', calories: 20, protein: 1.5, carbs: 3.5, fat: 0.2 },
  { name: 'Avocado', serving: '1/2 fruit', calories: 120, protein: 1.5, carbs: 6, fat: 11 },
  { name: 'Almonds', serving: '28 g (~23)', calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: 'Peanut Butter', serving: '2 tbsp', calories: 190, protein: 8, carbs: 7, fat: 16 },
  { name: 'Olive Oil', serving: '1 tbsp', calories: 119, protein: 0, carbs: 0, fat: 14 },
  { name: 'Whole Milk', serving: '250 ml', calories: 150, protein: 8, carbs: 12, fat: 8 },
  { name: 'Almond Milk, unsweetened', serving: '250 ml', calories: 30, protein: 1, carbs: 1, fat: 2.5 },
  { name: 'Cheddar Cheese', serving: '28 g', calories: 113, protein: 7, carbs: 0.4, fat: 9 }
];

const DEFAULT_ROUTINES = [
  {
    name: 'Push A (Heavy Focus)',
    exercises: [
      { name: 'Barbell Bench Press', sets: 3, reps: '5-7' },
      { name: 'Overhead Press', sets: 3, reps: '6-8' },
      { name: 'Close-Grip Barbell Bench Press', sets: 3, reps: '8-10' },
      { name: 'Barbell Upright Row', sets: 3, reps: '10-12' }
    ]
  },
  {
    name: 'Pull A (Heavy Focus)',
    exercises: [
      { name: 'Deadlift', sets: 3, reps: '5' },
      { name: 'Barbell Row', sets: 3, reps: '6-8' },
      { name: 'Fixed Barbell Curl', sets: 3, reps: '8-10' },
      { name: 'Barbell Shrug', sets: 3, reps: '10-12' }
    ]
  },
  {
    name: 'Legs A (Heavy Focus)',
    exercises: [
      { name: 'Barbell Squat', sets: 3, reps: '5-7' },
      { name: 'Romanian Deadlift', sets: 3, reps: '8-10' },
      { name: 'Calf Raise', sets: 3, reps: '10-12' }
    ]
  },
  {
    name: 'Push B (Volume & Variation)',
    exercises: [
      { name: 'Barbell Floor Press', sets: 3, reps: '8-10' },
      { name: 'Seated Barbell Press (Light)', sets: 3, reps: '8-10' },
      { name: 'Wide-Grip Bench Press', sets: 3, reps: '8-10' },
      { name: 'Fixed Barbell Overhead Tricep Extension', sets: 3, reps: '10-12' }
    ]
  },
  {
    name: 'Pull B (Volume & Variation)',
    exercises: [
      { name: 'Pendlay Row', sets: 3, reps: '6-8' },
      { name: 'Underhand-Grip Barbell Row (Yates Row)', sets: 3, reps: '8-10' },
      { name: 'Fixed Barbell 21s', sets: 3, reps: '10-12' },
      { name: 'Barbell Rear Delt Row', sets: 3, reps: '10-12' }
    ]
  },
  {
    name: 'Legs B (Volume & Variation)',
    exercises: [
      { name: 'Front Squat', sets: 3, reps: '6-8' },
      { name: 'Barbell Good Morning', sets: 3, reps: '10-12' },
      { name: 'Barbell Lunge', sets: 3, reps: '8-10/leg' },
      { name: 'Calf Raise', sets: 3, reps: '12-15' }
    ]
  }
];

const DEFAULT_RECIPES = [
  {
    name: 'Chicken & Rice Meal Prep Bowls',
    category: 'Lunch',
    servings: 4,
    timeMinutes: 35,
    ingredients: [
      '4 boneless chicken breasts (~6 oz each)',
      '2 cups uncooked white rice',
      '2 cups broccoli florets',
      '2 tbsp olive oil',
      '1 tsp garlic powder',
      '1 tsp paprika',
      'Salt & pepper to taste'
    ],
    steps: [
      'Cook rice according to package directions.',
      'Pat chicken dry, season both sides with garlic powder, paprika, salt, and pepper.',
      'Heat 1 tbsp olive oil in a pan over medium-high heat; cook chicken 6-7 min per side until internal temp hits 165°F. Rest 5 min, then slice.',
      'Steam or microwave broccoli with a splash of water for 4-5 min until tender.',
      'Divide rice, chicken, and broccoli evenly across 4 containers. Drizzle remaining olive oil over each.'
    ],
    calories: 520, protein: 45, carbs: 55, fat: 12
  },
  {
    name: 'Turkey Chili',
    category: 'Dinner',
    servings: 6,
    timeMinutes: 45,
    ingredients: [
      '2 lb ground turkey (93/7)',
      '2 cans kidney beans, drained',
      '1 can (28 oz) diced tomatoes',
      '1 yellow onion, diced',
      '2 cloves garlic, minced',
      '2 tbsp chili powder',
      '1 tbsp cumin',
      'Salt & pepper to taste'
    ],
    steps: [
      'Brown turkey in a large pot over medium-high heat, breaking it apart, 6-8 min.',
      'Add onion and garlic, cook until softened, about 4 min.',
      'Stir in chili powder and cumin, cook 1 min until fragrant.',
      'Add beans and diced tomatoes with their juice. Bring to a simmer.',
      'Simmer uncovered 25-30 min, stirring occasionally, until thickened. Season to taste.'
    ],
    calories: 320, protein: 32, carbs: 28, fat: 9
  },
  {
    name: 'Overnight Protein Oats',
    category: 'Breakfast',
    servings: 1,
    timeMinutes: 5,
    ingredients: [
      '1/2 cup rolled oats',
      '1 scoop whey protein powder',
      '3/4 cup almond milk',
      '1 tbsp chia seeds',
      '1/2 banana, sliced'
    ],
    steps: [
      'Combine oats, protein powder, almond milk, and chia seeds in a jar. Stir well.',
      'Top with sliced banana.',
      'Cover and refrigerate at least 4 hours or overnight.',
      'Stir before eating; add a splash of milk if too thick.'
    ],
    calories: 380, protein: 30, carbs: 48, fat: 8
  },
  {
    name: 'Egg White & Veggie Muffins',
    category: 'Breakfast',
    servings: 6,
    timeMinutes: 30,
    ingredients: [
      '12 egg whites',
      '4 whole eggs',
      '1 cup spinach, chopped',
      '1/2 bell pepper, diced',
      '1/4 onion, diced',
      '1/3 cup feta cheese',
      'Salt & pepper to taste'
    ],
    steps: [
      'Preheat oven to 350°F. Grease a 12-cup muffin tin.',
      'Whisk egg whites and whole eggs together in a large bowl.',
      'Stir in spinach, bell pepper, onion, feta, salt, and pepper.',
      'Pour mixture evenly into muffin cups, about 3/4 full.',
      'Bake 18-20 min until set and lightly golden. Cool 5 min before removing (2 muffins = 1 serving).'
    ],
    calories: 140, protein: 16, carbs: 4, fat: 6
  },
  {
    name: 'Salmon & Sweet Potato Sheet Pan',
    category: 'Dinner',
    servings: 4,
    timeMinutes: 35,
    ingredients: [
      '4 salmon fillets (~5 oz each)',
      '2 medium sweet potatoes, cubed',
      '1 bunch asparagus, trimmed',
      '2 tbsp olive oil',
      '1 lemon, sliced',
      'Salt & pepper to taste'
    ],
    steps: [
      'Preheat oven to 400°F. Toss sweet potato cubes with 1 tbsp olive oil, salt, and pepper on a sheet pan.',
      'Roast sweet potatoes 15 min.',
      'Push potatoes aside, add salmon and asparagus to the pan. Drizzle with remaining oil, top salmon with lemon slices.',
      'Roast 12-15 min more until salmon flakes easily and potatoes are tender.'
    ],
    calories: 430, protein: 34, carbs: 30, fat: 18
  },
  {
    name: 'Greek Yogurt Protein Bowl',
    category: 'Breakfast',
    servings: 1,
    timeMinutes: 5,
    ingredients: [
      '1 cup plain Greek yogurt',
      '1/4 cup granola',
      '1/2 cup mixed berries',
      '1 tsp honey'
    ],
    steps: [
      'Spoon yogurt into a bowl.',
      'Top with granola and mixed berries.',
      'Drizzle with honey and serve immediately.'
    ],
    calories: 310, protein: 24, carbs: 40, fat: 5
  },
  {
    name: 'Beef & Broccoli Stir Fry',
    category: 'Dinner',
    servings: 4,
    timeMinutes: 30,
    ingredients: [
      '1.5 lb lean beef strips (sirloin or flank)',
      '4 cups broccoli florets',
      '1/3 cup soy sauce (low sodium)',
      '2 cloves garlic, minced',
      '1 tsp fresh ginger, minced',
      '1 tbsp cornstarch',
      '2 cups cooked rice'
    ],
    steps: [
      'Whisk soy sauce, cornstarch, garlic, and ginger together to make the sauce.',
      'Sear beef strips in a hot pan/wok 2-3 min until browned. Remove and set aside.',
      'Stir fry broccoli 3-4 min until bright green and just tender.',
      'Return beef to the pan, pour in sauce, and toss until glossy and thickened, 1-2 min.',
      'Serve over cooked rice.'
    ],
    calories: 480, protein: 38, carbs: 45, fat: 14
  },
  {
    name: 'Tuna Salad Lettuce Wraps',
    category: 'Lunch',
    servings: 2,
    timeMinutes: 10,
    ingredients: [
      '2 cans tuna in water, drained',
      '1/4 cup plain Greek yogurt',
      '1 celery stalk, diced',
      '1 tbsp Dijon mustard',
      '6-8 large lettuce leaves'
    ],
    steps: [
      'Combine tuna, Greek yogurt, celery, and mustard in a bowl. Mix well.',
      'Season with salt and pepper to taste.',
      'Spoon tuna salad into lettuce leaves and wrap to serve.'
    ],
    calories: 220, protein: 32, carbs: 6, fat: 6
  },
  {
    name: 'Protein Pancakes',
    category: 'Breakfast',
    servings: 1,
    timeMinutes: 15,
    ingredients: [
      '1 scoop whey protein powder',
      '2 eggs',
      '1/2 banana',
      '1/4 cup rolled oats',
      '1/2 tsp cinnamon'
    ],
    steps: [
      'Blend all ingredients together until smooth.',
      'Heat a non-stick griddle or pan over medium heat.',
      'Pour batter into 3 small pancakes, cook 2-3 min per side until golden.',
      'Serve warm, optionally topped with berries.'
    ],
    calories: 340, protein: 32, carbs: 30, fat: 9
  },
  {
    name: 'Shrimp & Quinoa Power Bowl',
    category: 'Dinner',
    servings: 4,
    timeMinutes: 25,
    ingredients: [
      '1 lb shrimp, peeled & deveined',
      '2 cups cooked quinoa',
      '1 can black beans, drained',
      '1 cup corn kernels',
      '1 avocado, sliced',
      '1 lime, juiced',
      '1 tbsp olive oil'
    ],
    steps: [
      'Toss shrimp with olive oil, salt, and pepper.',
      'Sauté shrimp in a hot pan 2 min per side until pink and opaque. Remove from heat.',
      'Divide quinoa into bowls, top with black beans, corn, shrimp, and avocado.',
      'Squeeze fresh lime juice over each bowl before serving.'
    ],
    calories: 400, protein: 30, carbs: 42, fat: 11
  }
];
