function logsForDate(list, iso) {
  return list.filter(x => x.date === iso);
}

function sumFoodMacros(logs) {
  return logs.reduce((a, l) => ({
    calories: a.calories + l.calories,
    protein: a.protein + l.protein,
    carbs: a.carbs + l.carbs,
    fat: a.fat + l.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

function waterTotalForDate(iso) {
  return logsForDate(DB.data.waterLogs, iso).reduce((a, l) => a + l.ml, 0);
}

function computeWorkoutStreak() {
  const dates = new Set(DB.data.workouts.filter(w => w.finishedAt).map(w => w.date));
  let streak = 0;
  let cursor = todayISO();
  if (!dates.has(cursor)) cursor = isoDaysAgo(1);
  while (dates.has(cursor)) {
    streak++;
    const d = new Date(cursor + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    cursor = d.toISOString().slice(0, 10);
  }
  return streak;
}

function weekWorkoutCount() {
  const set = new Set();
  for (let i = 0; i < 7; i++) set.add(isoDaysAgo(i));
  return DB.data.workouts.filter(w => w.finishedAt && set.has(w.date)).length;
}

function renderHome() {
  const today = todayISO();
  const goals = DB.data.goals;
  const macros = sumFoodMacros(logsForDate(DB.data.foodLogs, today));
  const pct = goals.calories ? macros.calories / goals.calories : 0;
  const remaining = Math.max(0, Math.round(goals.calories - macros.calories));

  const todaysWorkout = DB.data.workouts.find(w => w.date === today && w.finishedAt);
  const streak = computeWorkoutStreak();
  const weekCount = weekWorkoutCount();

  const water = waterTotalForDate(today);
  const waterGoalCups = Math.max(1, Math.round(goals.water / 250));
  const filledCups = Math.round(water / 250);
  let cupsHtml = '';
  for (let i = 0; i < waterGoalCups; i++) {
    cupsHtml += `<button class="cup ${i < filledCups ? 'filled' : ''}" onclick="setWaterCups(${i + 1}, ${i < filledCups})" aria-label="cup"></button>`;
  }

  const weights = [...DB.data.weightLogs].sort((a, b) => a.date < b.date ? -1 : 1).slice(-7);
  const lastWeight = weights.length ? weights[weights.length - 1].weight : null;
  let trendHtml = '';
  if (weights.length) {
    const vals = weights.map(w => w.weight);
    const min = Math.min(...vals), max = Math.max(...vals);
    const range = max - min || 1;
    trendHtml = weights.map(w => {
      const h = 14 + ((w.weight - min) / range) * 76;
      const d = new Date(w.date + 'T00:00:00');
      return `<div class="trend-bar-wrap"><div class="trend-bar" style="height:${h}px"></div><span class="trend-bar-label">${d.toLocaleDateString(undefined,{day:'numeric'})}</span></div>`;
    }).join('');
  }

  const dateStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return `
    <div class="greeting-title">${greetingWord()}${DB.data.profile.name ? ', ' + escapeHtml(DB.data.profile.name) : ''}</div>
    <div class="greeting-date">${dateStr}</div>

    <div class="section-title">Today's Nutrition</div>
    <div class="card ring-card">
      <div class="ring-wrap">
        <canvas id="calRing"></canvas>
        <div class="ring-center"><b>${remaining}</b><span>kcal left</span></div>
      </div>
      <div class="macro-list">
        ${macroRow('Protein', macros.protein, goals.protein, 'var(--protein)')}
        ${macroRow('Carbs', macros.carbs, goals.carbs, 'var(--carbs)')}
        ${macroRow('Fat', macros.fat, goals.fat, 'var(--fat)')}
      </div>
    </div>

    <div class="section-title">Activity</div>
    <div class="stat-grid">
      <div class="stat-card"><b>${streak}</b><span>Day streak</span></div>
      <div class="stat-card"><b>${weekCount}</b><span>Workouts / wk</span></div>
      <div class="stat-card"><b>${todaysWorkout ? '✓' : '—'}</b><span>${todaysWorkout ? 'Trained today' : 'No workout yet'}</span></div>
    </div>

    <div class="section-title">Water</div>
    <div class="card">
      <div class="water-row">
        <div class="water-cups">${cupsHtml}</div>
        <div class="list-item-val">${(water / 1000).toFixed(2)} L</div>
      </div>
    </div>

    <div class="section-title">Body Weight</div>
    <div class="card">
      <div class="card-row" style="margin-bottom:${weights.length ? '10px' : '0'}">
        <div>
          <b style="font-size:20px">${lastWeight != null ? lastWeight + ' ' + units() : '—'}</b>
          <div class="settings-item-sub">${weights.length ? 'Last logged ' + formatDateLabel(weights[weights.length - 1].date).toLowerCase() : 'No entries yet'}</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openLogWeightModal()">+ Log</button>
      </div>
      ${weights.length ? `<div class="trend-bars">${trendHtml}</div>` : ''}
    </div>
  `;
}

function greetingWord() {
  const h = new Date().getHours();
  if (h < 5) return 'Late night';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function macroRow(label, val, goal, color) {
  const pct = goal ? Math.min(1, val / goal) : 0;
  return `
    <div class="macro-row">
      <span class="macro-dot" style="background:${color}"></span>
      <span class="macro-label">${label}</span>
      <div class="macro-bar-track"><div class="macro-bar-fill" style="width:${pct * 100}%;background:${color}"></div></div>
      <span class="macro-val">${Math.round(val)}/${goal}g</span>
    </div>`;
}

function mountHome() {
  const today = todayISO();
  const goals = DB.data.goals;
  const macros = sumFoodMacros(logsForDate(DB.data.foodLogs, today));
  const canvas = $('#calRing');
  if (canvas) {
    const isDark = getComputedStyle(document.documentElement).colorScheme === 'dark';
    drawRing(canvas, goals.calories ? macros.calories / goals.calories : 0, getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(), isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)');
  }
}

function setWaterCups(count, wasFilled) {
  const desired = wasFilled ? count - 1 : count;
  const today = todayISO();
  DB.data.waterLogs = DB.data.waterLogs.filter(l => l.date !== today);
  for (let i = 0; i < desired; i++) {
    DB.data.waterLogs.push({ id: uid(), date: today, ml: 250 });
  }
  DB.save();
  renderApp();
}

function openLogWeightModal() {
  const last = DB.data.weightLogs.length ? DB.data.weightLogs[DB.data.weightLogs.length - 1].weight : '';
  openModal(`
    <div class="modal-title">Log Body Weight</div>
    <div class="form-group">
      <label class="form-label">Weight (${units()})</label>
      <input id="weightInput" class="form-input" type="number" inputmode="decimal" step="0.1" value="${last}" placeholder="e.g. 175">
    </div>
    <button class="btn btn-primary btn-block" onclick="saveWeight()">Save</button>
  `);
  setTimeout(() => $('#weightInput') && $('#weightInput').focus(), 50);
}

function saveWeight() {
  const val = parseFloat($('#weightInput').value);
  if (!val || val <= 0) { showToast('Enter a valid weight'); return; }
  const today = todayISO();
  DB.data.weightLogs = DB.data.weightLogs.filter(w => w.date !== today);
  DB.data.weightLogs.push({ id: uid(), date: today, weight: val });
  DB.data.weightLogs.sort((a, b) => a.date < b.date ? -1 : 1);
  DB.save();
  closeModal();
  showToast('Weight logged');
  renderApp();
}
