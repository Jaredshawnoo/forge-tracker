const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const RECIPE_CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
let dietDate = null;
let foodPickerMeal = 'Breakfast';
let dietView = 'log';
let recipeCategory = 'All';
let recipeLogMeal = 'Breakfast';

function setDietView(v) {
  dietView = v;
  renderApp();
}

function getDietDate() {
  if (!dietDate) dietDate = todayISO();
  return dietDate;
}

function changeDietDate(delta) {
  const d = new Date(getDietDate() + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  dietDate = d.toISOString().slice(0, 10);
  renderApp();
}

function jumpToToday() {
  dietDate = todayISO();
  renderApp();
}

function renderDiet() {
  return `
    <div class="segmented">
      <button class="${dietView === 'log' ? 'active' : ''}" onclick="setDietView('log')" type="button">Log</button>
      <button class="${dietView === 'recipes' ? 'active' : ''}" onclick="setDietView('recipes')" type="button">Recipes</button>
    </div>
    ${dietView === 'log' ? renderDietLog() : renderRecipesView()}
  `;
}

function renderDietLog() {
  const date = getDietDate();
  const goals = DB.data.goals;
  const dayLogs = logsForDate(DB.data.foodLogs, date);
  const macros = sumFoodMacros(dayLogs);
  const remaining = Math.round(goals.calories - macros.calories);
  const water = waterTotalForDate(date);
  const waterGoalCups = Math.max(1, Math.round(goals.water / 250));
  const filledCups = Math.round(water / 250);
  let cupsHtml = '';
  for (let i = 0; i < waterGoalCups; i++) {
    cupsHtml += `<button class="cup ${i < filledCups ? 'filled' : ''}" onclick="setWaterCupsForDate(${i + 1}, ${i < filledCups})" aria-label="cup"></button>`;
  }

  return `
    <div class="day-nav">
      <button class="icon-btn" onclick="changeDietDate(-1)" aria-label="Previous day">
        <svg viewBox="0 0 24 24" class="icon"><path d="M15 6 9 12l6 6"/></svg>
      </button>
      <div class="day-nav-label" style="text-align:center;cursor:pointer" onclick="jumpToToday()">
        ${formatDateLabel(date)}
        <small>${new Date(date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</small>
      </div>
      <button class="icon-btn" onclick="changeDietDate(1)" aria-label="Next day">
        <svg viewBox="0 0 24 24" class="icon"><path d="M9 6l6 6-6 6"/></svg>
      </button>
    </div>

    <div class="card">
      <div class="card-row" style="margin-bottom:12px;">
        <div>
          <b style="font-size:24px;">${Math.round(macros.calories)}</b>
          <span class="settings-item-sub"> / ${goals.calories} kcal</span>
        </div>
        <div class="badge">${remaining >= 0 ? remaining + ' left' : Math.abs(remaining) + ' over'}</div>
      </div>
      <div class="macro-list">
        ${macroRow('Protein', macros.protein, goals.protein, 'var(--protein)')}
        ${macroRow('Carbs', macros.carbs, goals.carbs, 'var(--carbs)')}
        ${macroRow('Fat', macros.fat, goals.fat, 'var(--fat)')}
      </div>
    </div>

    <div class="section-title">Water</div>
    <div class="card">
      <div class="water-row">
        <div class="water-cups">${cupsHtml}</div>
        <div class="list-item-val">${(water / 1000).toFixed(2)} L</div>
      </div>
    </div>

    <div class="section-title">Meals</div>
    ${MEALS.map(meal => renderMealCard(meal, dayLogs.filter(l => l.meal === meal))).join('')}
  `;
}

function mountDiet() {}

function renderMealCard(meal, logs) {
  const kcal = Math.round(logs.reduce((a, l) => a + l.calories, 0));
  return `
    <div class="card meal-card">
      <div class="meal-header">
        <h3>${meal}</h3>
        <span class="kcal">${kcal} kcal</span>
      </div>
      ${logs.map(l => `
        <div class="food-row">
          <div>
            <div class="food-name">${escapeHtml(l.name)}</div>
            <div class="food-sub">${l.qty !== 1 ? round1(l.qty) + '× · ' : ''}${Math.round(l.calories)} kcal · P${round1(l.protein)} C${round1(l.carbs)} F${round1(l.fat)}</div>
          </div>
          <button class="food-del" onclick="deleteFoodLog('${l.id}')" aria-label="Remove">
            <svg viewBox="0 0 24 24" class="icon" style="width:16px;height:16px"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z"/></svg>
          </button>
        </div>
      `).join('')}
      <button class="meal-add" onclick="openFoodPicker('${meal}')">
        <svg viewBox="0 0 24 24" class="icon" style="width:16px;height:16px"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z"/></svg>
        Add food
      </button>
    </div>
  `;
}

function deleteFoodLog(id) {
  DB.data.foodLogs = DB.data.foodLogs.filter(l => l.id !== id);
  DB.save();
  renderApp();
}

function setWaterCupsForDate(count, wasFilled) {
  const desired = wasFilled ? count - 1 : count;
  const date = getDietDate();
  DB.data.waterLogs = DB.data.waterLogs.filter(l => l.date !== date);
  for (let i = 0; i < desired; i++) DB.data.waterLogs.push({ id: uid(), date, ml: 250 });
  DB.save();
  renderApp();
}

/* ---------- Food picker ---------- */

function openFoodPicker(meal) {
  foodPickerMeal = meal;
  openModal(foodPickerHtml(''));
  setTimeout(() => $('#foodSearch') && $('#foodSearch').focus(), 50);
}

function recentFoodIds() {
  const seen = [];
  [...DB.data.foodLogs].sort((a, b) => (a.id < b.id ? 1 : -1)).forEach(l => {
    if (l.foodId && !seen.includes(l.foodId)) seen.push(l.foodId);
  });
  return seen.slice(0, 6);
}

function foodPickerHtml(query) {
  const q = (query || '').toLowerCase();
  const list = DB.data.foods.filter(f => f.name.toLowerCase().includes(q));
  const recent = q ? [] : recentFoodIds().map(id => DB.data.foods.find(f => f.id === id)).filter(Boolean);
  return `
    <div class="modal-title">Add to ${foodPickerMeal}</div>
    <div class="search-box">
      <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z"/></svg>
      <input id="foodSearch" class="form-input" placeholder="Search foods..." value="${escapeHtml(query || '')}" oninput="filterFoodPicker(this.value)">
    </div>
    ${recent.length ? `<div class="form-label">Recent</div><div class="chip-row">${recent.map(f => `<button class="chip" onclick="openFoodQty('${f.id}')">${escapeHtml(f.name)}</button>`).join('')}</div>` : ''}
    <div class="form-label" style="margin-top:${recent.length ? '10px' : '0'}">All Foods</div>
    <div class="list" id="foodPickerList" style="max-height:38vh;overflow-y:auto;">
      ${foodListRows(list)}
    </div>
    <button class="btn btn-ghost btn-block" style="margin-top:12px;" onclick="openCustomFoodForm('${escapeHtml(query || '')}')">+ Create Custom Food</button>
  `;
}

function foodListRows(list) {
  return list.map(f => `
    <div class="list-item">
      <div class="list-item-main">
        <div class="list-item-title">${escapeHtml(f.name)}</div>
        <div class="list-item-sub">${f.serving} · ${f.calories} kcal</div>
      </div>
      <button class="btn btn-sm btn-primary" onclick="openFoodQty('${f.id}')">Add</button>
    </div>
  `).join('') || '<div class="empty-state"><p>No foods found.</p></div>';
}

function filterFoodPicker(value) {
  const q = value.toLowerCase();
  $('#foodPickerList').innerHTML = foodListRows(DB.data.foods.filter(f => f.name.toLowerCase().includes(q)));
}

function openFoodQty(foodId) {
  const f = DB.data.foods.find(x => x.id === foodId);
  if (!f) return;
  openModal(`
    <div class="modal-title">${escapeHtml(f.name)}</div>
    <div class="settings-item-sub" style="margin-bottom:14px;">${f.serving} · ${f.calories} kcal · P${f.protein} C${f.carbs} F${f.fat}</div>
    <div class="form-group">
      <label class="form-label">Servings</label>
      <input id="foodQtyInput" class="form-input" type="number" inputmode="decimal" step="0.25" value="1" oninput="updateQtyPreview('${f.id}')">
    </div>
    <div class="settings-item-sub" id="qtyPreview" style="margin-bottom:14px;">= ${f.calories} kcal</div>
    <button class="btn btn-primary btn-block" onclick="confirmAddFood('${f.id}')">Add to ${foodPickerMeal}</button>
  `);
  setTimeout(() => { const el = $('#foodQtyInput'); if (el) { el.focus(); el.select(); } }, 50);
}

function updateQtyPreview(foodId) {
  const f = DB.data.foods.find(x => x.id === foodId);
  const qty = parseFloat($('#foodQtyInput').value) || 0;
  $('#qtyPreview').textContent = `= ${Math.round(f.calories * qty)} kcal · P${round1(f.protein * qty)} C${round1(f.carbs * qty)} F${round1(f.fat * qty)}`;
}

function confirmAddFood(foodId) {
  const f = DB.data.foods.find(x => x.id === foodId);
  const qty = parseFloat($('#foodQtyInput').value);
  if (!qty || qty <= 0) { showToast('Enter a valid amount'); return; }
  DB.data.foodLogs.push({
    id: uid(), date: getDietDate(), meal: foodPickerMeal, foodId: f.id, name: f.name, qty,
    calories: round1(f.calories * qty), protein: round1(f.protein * qty), carbs: round1(f.carbs * qty), fat: round1(f.fat * qty)
  });
  DB.save();
  closeModal();
  showToast('Added to ' + foodPickerMeal);
  renderApp();
}

function openCustomFoodForm(name) {
  openModal(`
    <div class="modal-title">Custom Food</div>
    <div class="form-group">
      <label class="form-label">Name</label>
      <input id="cfName" class="form-input" value="${escapeHtml(name || '')}" placeholder="e.g. Homemade Chili">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Serving Label</label>
        <input id="cfServing" class="form-input" value="1 serving">
      </div>
      <div class="form-group">
        <label class="form-label">Calories</label>
        <input id="cfCal" class="form-input" type="number" inputmode="decimal" placeholder="0">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Protein (g)</label>
        <input id="cfProtein" class="form-input" type="number" inputmode="decimal" placeholder="0">
      </div>
      <div class="form-group">
        <label class="form-label">Carbs (g)</label>
        <input id="cfCarbs" class="form-input" type="number" inputmode="decimal" placeholder="0">
      </div>
      <div class="form-group">
        <label class="form-label">Fat (g)</label>
        <input id="cfFat" class="form-input" type="number" inputmode="decimal" placeholder="0">
      </div>
    </div>
    <button class="btn btn-primary btn-block" onclick="saveCustomFood()">Save &amp; Add to ${foodPickerMeal}</button>
  `);
}

function saveCustomFood() {
  const name = $('#cfName').value.trim();
  if (!name) { showToast('Enter a name'); return; }
  const f = {
    id: uid(), custom: true, name,
    serving: $('#cfServing').value.trim() || '1 serving',
    calories: parseFloat($('#cfCal').value) || 0,
    protein: parseFloat($('#cfProtein').value) || 0,
    carbs: parseFloat($('#cfCarbs').value) || 0,
    fat: parseFloat($('#cfFat').value) || 0
  };
  DB.data.foods.push(f);
  DB.save();
  openFoodQty(f.id);
}

/* ---------- Recipes ---------- */

function renderRecipesView() {
  return `
    <div class="search-box">
      <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z"/></svg>
      <input id="recipeSearch" class="form-input" placeholder="Search recipes..." oninput="filterRecipeList(this.value)">
    </div>
    <div class="chip-row">
      ${RECIPE_CATEGORIES.map(c => `<button class="chip ${recipeCategory === c ? 'active' : ''}" onclick="setRecipeCategory('${c}')">${c}</button>`).join('')}
    </div>
    <div class="list" id="recipeList">
      ${recipeListRows(DB.data.recipes, '')}
    </div>
    <button class="btn btn-ghost btn-block" style="margin-top:12px;" onclick="openCustomRecipeForm()">+ Add Your Own Recipe</button>
  `;
}

function recipeListRows(recipes, query) {
  const q = (query || '').toLowerCase();
  const list = recipes.filter(r =>
    (recipeCategory === 'All' || r.category === recipeCategory) &&
    r.name.toLowerCase().includes(q)
  );
  return list.map(r => `
    <div class="list-item" onclick="openRecipeDetail('${r.id}')" style="cursor:pointer;">
      <div class="list-item-main">
        <div class="list-item-title">${escapeHtml(r.name)}</div>
        <div class="list-item-sub">${r.category} · ${r.calories} kcal/serving · ${r.servings} servings${r.timeMinutes ? ' · ' + r.timeMinutes + ' min' : ''}</div>
      </div>
      <svg viewBox="0 0 24 24" class="icon" style="width:18px;height:18px;fill:var(--text-faint);flex:none"><path d="M9 6 8 7l5 5-5 5 1 1 6-6-6-6Z"/></svg>
    </div>
  `).join('') || '<div class="empty-state"><p>No recipes found.</p></div>';
}

function filterRecipeList(value) {
  $('#recipeList').innerHTML = recipeListRows(DB.data.recipes, value);
}

function setRecipeCategory(cat) {
  recipeCategory = cat;
  renderApp();
}

function openRecipeDetail(recipeId) {
  const r = DB.data.recipes.find(x => x.id === recipeId);
  if (!r) return;
  openModal(`
    <div class="modal-title">${escapeHtml(r.name)}</div>
    <div class="settings-item-sub" style="margin-bottom:12px;">${r.category} · ${r.servings} servings${r.timeMinutes ? ' · ' + r.timeMinutes + ' min' : ''}</div>
    <div class="card" style="margin-bottom:14px;">
      <div class="macro-row"><span class="macro-label">Per serving</span><span class="food-kcal">${r.calories} kcal</span></div>
      <div class="badge-row">
        <span class="badge">P ${round1(r.protein)}g</span>
        <span class="badge">C ${round1(r.carbs)}g</span>
        <span class="badge">F ${round1(r.fat)}g</span>
      </div>
    </div>
    <div class="form-label">Ingredients</div>
    <div class="list" style="margin-bottom:14px;">
      ${r.ingredients.map(i => `<div class="food-row"><span class="food-name">${escapeHtml(i)}</span></div>`).join('')}
    </div>
    <div class="form-label">Steps</div>
    <div class="list" style="margin-bottom:16px;">
      ${r.steps.map((s, i) => `<div class="food-row"><span class="food-name">${i + 1}. ${escapeHtml(s)}</span></div>`).join('')}
    </div>
    <button class="btn btn-primary btn-block" style="margin-bottom:8px;" onclick="openRecipeLogModal('${r.id}')">Log to Diary</button>
    ${r.custom ? `<button class="btn btn-danger btn-block" onclick="deleteRecipe('${r.id}')">Delete Recipe</button>` : ''}
  `);
}

function openRecipeLogModal(recipeId) {
  const r = DB.data.recipes.find(x => x.id === recipeId);
  if (!r) return;
  recipeLogMeal = MEALS.includes(r.category) ? r.category : 'Breakfast';
  openModal(`
    <div class="modal-title">Log ${escapeHtml(r.name)}</div>
    <div class="form-label">Meal</div>
    <div class="chip-row" id="recipeMealChips">
      ${MEALS.map(m => `<button class="chip ${recipeLogMeal === m ? 'active' : ''}" onclick="setRecipeLogMeal('${m}')">${m}</button>`).join('')}
    </div>
    <div class="form-group">
      <label class="form-label">Servings</label>
      <input id="recipeQtyInput" class="form-input" type="number" inputmode="decimal" step="0.5" value="1" oninput="updateRecipeQtyPreview('${r.id}')">
    </div>
    <div class="settings-item-sub" id="recipeQtyPreview" style="margin-bottom:14px;">= ${r.calories} kcal · P${round1(r.protein)} C${round1(r.carbs)} F${round1(r.fat)}</div>
    <button class="btn btn-primary btn-block" onclick="confirmLogRecipe('${r.id}')">Add to Diary</button>
  `);
}

function setRecipeLogMeal(meal) {
  recipeLogMeal = meal;
  $('#recipeMealChips').innerHTML = MEALS.map(m => `<button class="chip ${recipeLogMeal === m ? 'active' : ''}" onclick="setRecipeLogMeal('${m}')">${m}</button>`).join('');
}

function updateRecipeQtyPreview(recipeId) {
  const r = DB.data.recipes.find(x => x.id === recipeId);
  const qty = parseFloat($('#recipeQtyInput').value) || 0;
  $('#recipeQtyPreview').textContent = `= ${Math.round(r.calories * qty)} kcal · P${round1(r.protein * qty)} C${round1(r.carbs * qty)} F${round1(r.fat * qty)}`;
}

function confirmLogRecipe(recipeId) {
  const r = DB.data.recipes.find(x => x.id === recipeId);
  const qty = parseFloat($('#recipeQtyInput').value);
  if (!qty || qty <= 0) { showToast('Enter a valid amount'); return; }
  DB.data.foodLogs.push({
    id: uid(), date: getDietDate(), meal: recipeLogMeal, foodId: null, recipeId: r.id, name: r.name, qty,
    calories: round1(r.calories * qty), protein: round1(r.protein * qty), carbs: round1(r.carbs * qty), fat: round1(r.fat * qty)
  });
  DB.save();
  closeModal();
  showToast('Added to ' + recipeLogMeal);
  dietView = 'log';
  renderApp();
}

function openCustomRecipeForm() {
  openModal(`
    <div class="modal-title">New Recipe</div>
    <div class="form-group">
      <label class="form-label">Name</label>
      <input id="crName" class="form-input" placeholder="e.g. Meal Prep Burrito Bowls">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Category</label>
        <select id="crCategory" class="form-select">
          ${RECIPE_CATEGORIES.filter(c => c !== 'All').map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Servings</label>
        <input id="crServings" class="form-input" type="number" inputmode="numeric" value="4">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Ingredients (one per line)</label>
      <textarea id="crIngredients" class="form-textarea" placeholder="2 chicken breasts&#10;1 cup rice&#10;..."></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Steps (one per line)</label>
      <textarea id="crSteps" class="form-textarea" placeholder="Season and cook chicken...&#10;Cook rice...&#10;..."></textarea>
    </div>
    <div class="form-label">Nutrition per serving</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Calories</label>
        <input id="crCal" class="form-input" type="number" inputmode="decimal" placeholder="0">
      </div>
      <div class="form-group">
        <label class="form-label">Protein (g)</label>
        <input id="crProtein" class="form-input" type="number" inputmode="decimal" placeholder="0">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Carbs (g)</label>
        <input id="crCarbs" class="form-input" type="number" inputmode="decimal" placeholder="0">
      </div>
      <div class="form-group">
        <label class="form-label">Fat (g)</label>
        <input id="crFat" class="form-input" type="number" inputmode="decimal" placeholder="0">
      </div>
    </div>
    <button class="btn btn-primary btn-block" onclick="saveCustomRecipe()">Save Recipe</button>
  `);
}

function saveCustomRecipe() {
  const name = $('#crName').value.trim();
  if (!name) { showToast('Enter a name'); return; }
  const ingredients = $('#crIngredients').value.split('\n').map(s => s.trim()).filter(Boolean);
  const steps = $('#crSteps').value.split('\n').map(s => s.trim()).filter(Boolean);
  const recipe = {
    id: uid(), custom: true, name,
    category: $('#crCategory').value,
    servings: parseInt($('#crServings').value) || 1,
    timeMinutes: null,
    ingredients, steps,
    calories: parseFloat($('#crCal').value) || 0,
    protein: parseFloat($('#crProtein').value) || 0,
    carbs: parseFloat($('#crCarbs').value) || 0,
    fat: parseFloat($('#crFat').value) || 0
  };
  DB.data.recipes.push(recipe);
  DB.save();
  closeModal();
  showToast('Recipe saved');
  renderApp();
}

function deleteRecipe(id) {
  if (!confirm('Delete this recipe?')) return;
  DB.data.recipes = DB.data.recipes.filter(r => r.id !== id);
  DB.save();
  closeModal();
  renderApp();
}
