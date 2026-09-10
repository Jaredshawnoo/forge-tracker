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
