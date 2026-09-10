const DB_KEY = 'forge_tracker_v1';

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function defaultDB() {
  return {
    version: 1,
    profile: { name: '', units: 'lbs' },
    goals: { calories: 2200, protein: 150, carbs: 220, fat: 70, water: 2000 },
    theme: 'auto',
    exercises: DEFAULT_EXERCISES.map(e => ({ id: uid(), custom: false, ...e })),
    foods: DEFAULT_FOODS.map(f => ({ id: uid(), custom: false, ...f })),
    routines: [],
    workouts: [],
    activeWorkout: null,
    foodLogs: [],
    weightLogs: [],
    waterLogs: []
  };
}

const DB = {
  data: null,
  load() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      this.data = raw ? JSON.parse(raw) : defaultDB();
    } catch (e) {
      this.data = defaultDB();
    }
    if (!this.data.exercises || !this.data.exercises.length) {
      this.data.exercises = DEFAULT_EXERCISES.map(e => ({ id: uid(), custom: false, ...e }));
    }
    if (!this.data.foods || !this.data.foods.length) {
      this.data.foods = DEFAULT_FOODS.map(f => ({ id: uid(), custom: false, ...f }));
    }
    if (!('activeWorkout' in this.data)) this.data.activeWorkout = null;
    if (!this.data.routines) this.data.routines = [];
    if (!this.data.weightLogs) this.data.weightLogs = [];
    if (!this.data.waterLogs) this.data.waterLogs = [];
    this.syncDefaults();
    return this.data;
  },
  syncDefaults() {
    const byName = name => this.data.exercises.find(e => e.name === name);
    let changed = false;

    DEFAULT_EXERCISES.forEach(def => {
      if (!byName(def.name)) { this.data.exercises.push({ id: uid(), custom: false, ...def }); changed = true; }
    });

    this.data.routines.forEach(r => {
      if (r.exerciseIds && !r.exercises) {
        r.exercises = r.exerciseIds.map(id => ({ exerciseId: id, sets: 3, reps: '' }));
        delete r.exerciseIds;
        changed = true;
      }
      if (!r.exercises) r.exercises = [];
    });

    DEFAULT_ROUTINES.forEach(def => {
      if (this.data.routines.some(r => r.name === def.name)) return;
      const exercises = def.exercises
        .map(e => { const ex = byName(e.name); return ex ? { exerciseId: ex.id, sets: e.sets, reps: e.reps } : null; })
        .filter(Boolean);
      if (exercises.length) {
        this.data.routines.push({ id: uid(), name: def.name, exercises });
        changed = true;
      }
    });
    if (changed) this.save();
  },
  save() {
    localStorage.setItem(DB_KEY, JSON.stringify(this.data));
  },
  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  },
  importJSON(json) {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') throw new Error('Invalid file');
    this.data = Object.assign(defaultDB(), parsed);
    this.save();
  },
  reset() {
    this.data = defaultDB();
    this.save();
  }
};
