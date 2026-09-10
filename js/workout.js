let workoutView = 'today';
let exercisePickerTarget = 'active';
let exercisePickerCategory = 'All';
let routineDraft = null;

const EXERCISE_CATEGORIES = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio'];

function setWorkoutView(v) {
  workoutView = v;
  renderApp();
}

function renderWorkout() {
  return `
    <div class="segmented">
      <button class="${workoutView === 'today' ? 'active' : ''}" onclick="setWorkoutView('today')" type="button">Today</button>
      <button class="${workoutView === 'routines' ? 'active' : ''}" onclick="setWorkoutView('routines')" type="button">Routines</button>
      <button class="${workoutView === 'history' ? 'active' : ''}" onclick="setWorkoutView('history')" type="button">History</button>
    </div>
    <div id="workoutContent">
      ${workoutView === 'today' ? renderTodayWorkout() : workoutView === 'routines' ? renderRoutinesView() : renderHistoryView()}
    </div>
  `;
}

function mountWorkout() {
  if (DB.data.activeWorkout && restTimerEnd === null) {
    // no-op, timer state persists independently
  }
}

/* ---------- Today / Active workout ---------- */

function renderTodayWorkout() {
  if (DB.data.activeWorkout) return renderActiveWorkout();

  const recent = [...DB.data.workouts].filter(w => w.finishedAt).sort((a, b) => (a.finishedAt < b.finishedAt ? 1 : -1)).slice(0, 3);
  const routines = DB.data.routines;

  return `
    <div class="card" style="text-align:center;padding:26px 16px;">
      <div style="font-size:17px;font-weight:800;margin-bottom:4px;">Ready to train?</div>
      <div class="settings-item-sub" style="margin-bottom:16px;">Start a blank workout or pick a routine</div>
      <button class="btn btn-primary btn-block" onclick="startWorkout()">+ Start Blank Workout</button>
    </div>

    ${routines.length ? `
      <div class="section-title">Your Routines</div>
      <div class="list">
        ${routines.map(r => `
          <div class="list-item">
            <div class="list-item-main">
              <div class="list-item-title">${escapeHtml(r.name)}</div>
              <div class="list-item-sub">${r.exerciseIds.length} exercise${r.exerciseIds.length === 1 ? '' : 's'}</div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="startWorkout('${r.id}')">Start</button>
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${recent.length ? `
      <div class="section-title">Recent Workouts</div>
      <div class="list">
        ${recent.map(w => workoutListItem(w)).join('')}
      </div>
    ` : `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" class="icon"><path d="M20.57 14.86 22 13.43 20.57 12l-1.79 1.79-4.57-4.57L16 7.43 14.57 6l-1.43 1.43-1.71-1.72L9.71 7.43 4.57 12.57 3.14 11.14 1.71 12.57l1.43 1.43-1.7 1.71L2.86 17.14l1.71-1.71 4.57 4.57L7.71 21.43 9.14 22.86l1.43-1.43 1.72 1.71 1.71-1.71-1.72-1.72 4.58-4.57 1.71 1.72Z"/></svg>
        <p>No workouts logged yet. Start your first one above.</p>
      </div>
    `}
  `;
}

function startWorkout(routineId) {
  const routine = routineId ? DB.data.routines.find(r => r.id === routineId) : null;
  const exercises = (routine ? routine.exerciseIds : []).map(exId => {
    const ex = DB.data.exercises.find(e => e.id === exId);
    return { exerciseId: exId, name: ex ? ex.name : 'Exercise', sets: [{ reps: '', weight: '', completed: false }] };
  });
  DB.data.activeWorkout = {
    id: uid(),
    date: todayISO(),
    name: routine ? routine.name : 'Workout',
    startedAt: new Date().toISOString(),
    finishedAt: null,
    exercises
  };
  DB.save();
  renderApp();
}

function renameActiveWorkout(value) {
  if (!DB.data.activeWorkout) return;
  DB.data.activeWorkout.name = value;
  DB.save();
}

function renderActiveWorkout() {
  const w = DB.data.activeWorkout;
  const started = new Date(w.startedAt);

  return `
    <div class="card">
      <input class="form-input" style="font-size:17px;font-weight:800;padding:8px 10px;margin-bottom:2px;" value="${escapeHtml(w.name)}" oninput="renameActiveWorkout(this.value)">
      <div class="settings-item-sub" style="padding:4px 2px 0;">Started ${started.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</div>
    </div>

    ${w.exercises.map((ex, exIdx) => renderExerciseCard(ex, exIdx)).join('')}

    <button class="btn btn-ghost btn-block" style="margin-bottom:14px;" onclick="openExercisePicker('active')">+ Add Exercise</button>

    <div class="fab-row">
      <button class="btn btn-danger" onclick="cancelActiveWorkout()">Cancel</button>
      <button class="btn btn-primary" style="flex:2" onclick="finishActiveWorkout()">Finish Workout</button>
    </div>
  `;
}

function renderExerciseCard(ex, exIdx) {
  const prev = lastPerformanceText(ex.exerciseId);
  return `
    <div class="card exercise-card">
      <div class="exercise-card-head">
        <h3>${escapeHtml(ex.name)}</h3>
        <button class="list-item-btn" onclick="removeExerciseFromActive(${exIdx})" aria-label="Remove">
          <svg viewBox="0 0 24 24" class="icon" style="width:18px;height:18px"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z"/></svg>
        </button>
      </div>
      ${prev ? `<div class="settings-item-sub" style="margin-bottom:8px;">Last: ${prev}</div>` : ''}
      <div class="set-grid-header">
        <span>Set</span><span>${ex.name.match(/run|bike|row|cycl|jump|stair/i) ? 'Minutes' : 'Reps'}</span><span>${units()}</span><span></span>
      </div>
      ${ex.sets.map((s, sIdx) => `
        <div class="set-row">
          <div class="set-num">${sIdx + 1}</div>
          <input type="number" inputmode="decimal" placeholder="0" value="${s.reps}" oninput="updateSetField(${exIdx},${sIdx},'reps',this.value)">
          <input type="number" inputmode="decimal" placeholder="0" value="${s.weight}" oninput="updateSetField(${exIdx},${sIdx},'weight',this.value)">
          <button class="set-check ${s.completed ? 'done' : ''}" onclick="toggleSetComplete(${exIdx},${sIdx})" aria-label="Mark set complete">
            <svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z"/></svg>
          </button>
        </div>
      `).join('')}
      <div class="exercise-card-foot">
        <button class="link-btn" onclick="addSetRow(${exIdx})">+ Add Set</button>
        ${ex.sets.length > 1 ? `<button class="link-btn muted" onclick="removeSetRow(${exIdx})">Remove Set</button>` : '<span></span>'}
      </div>
    </div>
  `;
}

function addSetRow(exIdx) {
  const ex = DB.data.activeWorkout.exercises[exIdx];
  const last = ex.sets[ex.sets.length - 1];
  ex.sets.push({ reps: last ? last.reps : '', weight: last ? last.weight : '', completed: false });
  DB.save();
  renderApp();
}

function removeSetRow(exIdx) {
  const ex = DB.data.activeWorkout.exercises[exIdx];
  ex.sets.pop();
  DB.save();
  renderApp();
}

function updateSetField(exIdx, sIdx, field, value) {
  DB.data.activeWorkout.exercises[exIdx].sets[sIdx][field] = value;
  DB.save();
}

function toggleSetComplete(exIdx, sIdx) {
  const set = DB.data.activeWorkout.exercises[exIdx].sets[sIdx];
  set.completed = !set.completed;
  DB.save();
  if (set.completed) startRestTimer(90);
  else if (DB.data.activeWorkout.exercises.every(ex => ex.sets.every(s => !s.completed))) cancelRestTimer();
  renderApp();
}

function removeExerciseFromActive(exIdx) {
  DB.data.activeWorkout.exercises.splice(exIdx, 1);
  DB.save();
  renderApp();
}

function cancelActiveWorkout() {
  if (!confirm('Discard this workout? This cannot be undone.')) return;
  DB.data.activeWorkout = null;
  DB.save();
  cancelRestTimer();
  renderApp();
}

function finishActiveWorkout() {
  const w = DB.data.activeWorkout;
  if (!w.exercises.length) { showToast('Add at least one exercise'); return; }
  w.finishedAt = new Date().toISOString();
  DB.data.workouts.push(w);
  DB.data.activeWorkout = null;
  DB.save();
  cancelRestTimer();
  showToast('Workout saved 💪');
  workoutView = 'history';
  renderApp();
}

function lastPerformanceText(exerciseId) {
  const past = DB.data.workouts
    .filter(w => w.finishedAt && w.exercises.some(e => e.exerciseId === exerciseId))
    .sort((a, b) => (a.finishedAt < b.finishedAt ? 1 : -1));
  if (!past.length) return null;
  const ex = past[0].exercises.find(e => e.exerciseId === exerciseId);
  const sets = ex.sets.filter(s => s.reps !== '' && s.weight !== '').slice(0, 3);
  if (!sets.length) return null;
  return sets.map(s => `${s.reps}×${s.weight}`).join(', ');
}

/* ---------- Exercise picker ---------- */

function openExercisePicker(target) {
  exercisePickerTarget = target;
  exercisePickerCategory = 'All';
  openModal(exercisePickerHtml(''));
  setTimeout(() => $('#exSearch') && $('#exSearch').focus(), 50);
}

function exercisePickerHtml(query) {
  const q = (query || '').toLowerCase();
  const list = DB.data.exercises.filter(e =>
    (exercisePickerCategory === 'All' || e.category === exercisePickerCategory) &&
    e.name.toLowerCase().includes(q)
  );
  return `
    <div class="modal-title">Add Exercise</div>
    <div class="search-box">
      <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z"/></svg>
      <input id="exSearch" class="form-input" placeholder="Search exercises..." value="${escapeHtml(query || '')}" oninput="filterExercisePicker(this.value)">
    </div>
    <div class="chip-row">
      ${EXERCISE_CATEGORIES.map(c => `<button class="chip ${exercisePickerCategory === c ? 'active' : ''}" onclick="setExerciseCategory('${c}')">${c}</button>`).join('')}
    </div>
    <div class="list" id="exPickerList" style="max-height:44vh;overflow-y:auto;">
      ${list.map(e => `
        <div class="list-item">
          <div class="list-item-main">
            <div class="list-item-title">${escapeHtml(e.name)}</div>
            <div class="list-item-sub">${e.category}</div>
          </div>
          <button class="btn btn-sm btn-primary" onclick="pickExercise('${e.id}')">Add</button>
        </div>
      `).join('') || '<div class="empty-state"><p>No exercises found.</p></div>'}
    </div>
    <button class="btn btn-ghost btn-block" style="margin-top:12px;" onclick="openCustomExerciseForm('${escapeHtml(query || '')}')">+ Create Custom Exercise</button>
  `;
}

function filterExercisePicker(value) {
  const list = $('#exPickerList');
  const q = value.toLowerCase();
  const items = DB.data.exercises.filter(e =>
    (exercisePickerCategory === 'All' || e.category === exercisePickerCategory) &&
    e.name.toLowerCase().includes(q)
  );
  list.innerHTML = items.map(e => `
    <div class="list-item">
      <div class="list-item-main">
        <div class="list-item-title">${escapeHtml(e.name)}</div>
        <div class="list-item-sub">${e.category}</div>
      </div>
      <button class="btn btn-sm btn-primary" onclick="pickExercise('${e.id}')">Add</button>
    </div>
  `).join('') || '<div class="empty-state"><p>No exercises found.</p></div>';
}

function setExerciseCategory(cat) {
  exercisePickerCategory = cat;
  const q = $('#exSearch') ? $('#exSearch').value : '';
  openModal(exercisePickerHtml(q));
}

function openCustomExerciseForm(name) {
  openModal(`
    <div class="modal-title">New Exercise</div>
    <div class="form-group">
      <label class="form-label">Name</label>
      <input id="customExName" class="form-input" value="${escapeHtml(name || '')}" placeholder="e.g. Cable Crossover">
    </div>
    <div class="form-group">
      <label class="form-label">Category</label>
      <select id="customExCat" class="form-select">
        ${EXERCISE_CATEGORIES.filter(c => c !== 'All').map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
    </div>
    <button class="btn btn-primary btn-block" onclick="saveCustomExercise()">Add Exercise</button>
  `);
}

function saveCustomExercise() {
  const name = $('#customExName').value.trim();
  const category = $('#customExCat').value;
  if (!name) { showToast('Enter a name'); return; }
  const ex = { id: uid(), name, category, custom: true };
  DB.data.exercises.push(ex);
  DB.save();
  pickExercise(ex.id);
}

function pickExercise(exerciseId) {
  const ex = DB.data.exercises.find(e => e.id === exerciseId);
  if (!ex) return;
  if (exercisePickerTarget === 'active') {
    if (!DB.data.activeWorkout) startWorkout();
    DB.data.activeWorkout.exercises.push({ exerciseId: ex.id, name: ex.name, sets: [{ reps: '', weight: '', completed: false }] });
    DB.save();
  } else if (exercisePickerTarget === 'routineDraft' && routineDraft) {
    if (!routineDraft.exerciseIds.includes(ex.id)) routineDraft.exerciseIds.push(ex.id);
  }
  closeModal();
  if (exercisePickerTarget === 'routineDraft') openRoutineEditorModal();
  else renderApp();
}

/* ---------- Routines ---------- */

function renderRoutinesView() {
  const routines = DB.data.routines;
  return `
    <button class="btn btn-primary btn-block" style="margin-bottom:14px;" onclick="openRoutineEditor()">+ New Routine</button>
    ${routines.length ? `
      <div class="list">
        ${routines.map(r => `
          <div class="list-item">
            <div class="list-item-main">
              <div class="list-item-title">${escapeHtml(r.name)}</div>
              <div class="list-item-sub">${r.exerciseIds.map(id => { const e = DB.data.exercises.find(x => x.id === id); return e ? e.name : ''; }).filter(Boolean).join(', ')}</div>
            </div>
          </div>
          <div class="fab-row" style="margin:-4px 0 12px;">
            <button class="btn btn-sm" onclick="openRoutineEditor('${r.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteRoutine('${r.id}')">Delete</button>
            <button class="btn btn-sm btn-primary" style="flex:1" onclick="startWorkout('${r.id}')">Start</button>
          </div>
        `).join('')}
      </div>
    ` : `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" class="icon"><path d="M4 4h16v2H4V4Zm0 7h10v2H4v-2Zm0 7h16v2H4v-2Z"/></svg>
        <p>Save a routine to start workouts faster next time.</p>
      </div>
    `}
  `;
}

function openRoutineEditor(routineId) {
  const existing = routineId ? DB.data.routines.find(r => r.id === routineId) : null;
  routineDraft = existing ? { id: existing.id, name: existing.name, exerciseIds: [...existing.exerciseIds] } : { id: null, name: '', exerciseIds: [] };
  openRoutineEditorModal();
}

function openRoutineEditorModal() {
  const d = routineDraft;
  openModal(`
    <div class="modal-title">${d.id ? 'Edit Routine' : 'New Routine'}</div>
    <div class="form-group">
      <label class="form-label">Routine Name</label>
      <input id="routineNameInput" class="form-input" value="${escapeHtml(d.name)}" placeholder="e.g. Push Day" oninput="routineDraft.name=this.value">
    </div>
    <div class="form-label">Exercises</div>
    <div class="list" style="margin-bottom:12px;">
      ${d.exerciseIds.map(id => {
        const e = DB.data.exercises.find(x => x.id === id);
        return `<div class="list-item">
          <div class="list-item-title">${e ? escapeHtml(e.name) : 'Unknown'}</div>
          <button class="list-item-btn" onclick="removeFromRoutineDraft('${id}')">✕</button>
        </div>`;
      }).join('') || '<div class="settings-item-sub" style="padding:6px 2px;">No exercises added yet.</div>'}
    </div>
    <button class="btn btn-ghost btn-block" style="margin-bottom:14px;" onclick="openExercisePicker('routineDraft')">+ Add Exercise</button>
    <button class="btn btn-primary btn-block" onclick="saveRoutineDraft()">Save Routine</button>
  `);
}

function removeFromRoutineDraft(id) {
  routineDraft.exerciseIds = routineDraft.exerciseIds.filter(x => x !== id);
  openRoutineEditorModal();
}

function saveRoutineDraft() {
  const name = ($('#routineNameInput') ? $('#routineNameInput').value : routineDraft.name).trim();
  if (!name) { showToast('Enter a routine name'); return; }
  if (!routineDraft.exerciseIds.length) { showToast('Add at least one exercise'); return; }
  if (routineDraft.id) {
    const r = DB.data.routines.find(x => x.id === routineDraft.id);
    r.name = name;
    r.exerciseIds = routineDraft.exerciseIds;
  } else {
    DB.data.routines.push({ id: uid(), name, exerciseIds: routineDraft.exerciseIds });
  }
  DB.save();
  routineDraft = null;
  closeModal();
  showToast('Routine saved');
  renderApp();
}

function deleteRoutine(id) {
  if (!confirm('Delete this routine?')) return;
  DB.data.routines = DB.data.routines.filter(r => r.id !== id);
  DB.save();
  renderApp();
}

/* ---------- History ---------- */

function workoutListItem(w) {
  const totalSets = w.exercises.reduce((a, e) => a + e.sets.length, 0);
  return `
    <div class="list-item" onclick="openWorkoutDetail('${w.id}')" style="cursor:pointer;">
      <div class="list-item-main">
        <div class="list-item-title">${escapeHtml(w.name)}</div>
        <div class="list-item-sub">${formatDateLabel(w.date)} · ${w.exercises.length} exercises · ${totalSets} sets</div>
      </div>
      <svg viewBox="0 0 24 24" class="icon" style="width:18px;height:18px;fill:var(--text-faint);flex:none"><path d="M9 6 8 7l5 5-5 5 1 1 6-6-6-6Z"/></svg>
    </div>
  `;
}

function computeRecords() {
  const best = {};
  DB.data.workouts.filter(w => w.finishedAt).forEach(w => {
    w.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        const weight = parseFloat(s.weight);
        if (!weight) return;
        if (!best[ex.exerciseId] || weight > best[ex.exerciseId].weight) {
          best[ex.exerciseId] = { weight, reps: s.reps, name: ex.name, date: w.date };
        }
      });
    });
  });
  return Object.values(best).sort((a, b) => b.weight - a.weight).slice(0, 5);
}

function renderHistoryView() {
  const workouts = [...DB.data.workouts].filter(w => w.finishedAt).sort((a, b) => (a.finishedAt < b.finishedAt ? 1 : -1));
  const records = computeRecords();
  return `
    ${records.length ? `
      <div class="section-title">Personal Records</div>
      <div class="card">
        ${records.map(r => `
          <div class="food-row">
            <div>
              <div class="food-name">${escapeHtml(r.name)}</div>
              <div class="food-sub">${formatDateLabel(r.date)}</div>
            </div>
            <div class="food-kcal">${r.weight} ${units()} × ${r.reps}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}
    <div class="section-title">All Workouts</div>
    ${workouts.length ? `<div class="list">${workouts.map(w => workoutListItem(w)).join('')}</div>` : `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" class="icon"><path d="M12 2 2 7l10 5 10-5-10-5Zm0 7L2 14v3l10 5 10-5v-3l-10 5Z"/></svg>
        <p>Your finished workouts will show up here.</p>
      </div>
    `}
  `;
}

function openWorkoutDetail(id) {
  const w = DB.data.workouts.find(x => x.id === id);
  if (!w) return;
  openModal(`
    <div class="modal-title">${escapeHtml(w.name)}</div>
    <div class="settings-item-sub" style="margin-bottom:12px;">${formatDateLabel(w.date)}</div>
    ${w.exercises.map(ex => `
      <div class="card exercise-card">
        <div class="exercise-card-head"><h3>${escapeHtml(ex.name)}</h3></div>
        ${ex.sets.map((s, i) => `<div class="food-row"><span class="food-sub">Set ${i + 1}</span><span class="food-kcal">${s.reps || 0} × ${s.weight || 0} ${units()}</span></div>`).join('')}
      </div>
    `).join('')}
    <button class="btn btn-danger btn-block" onclick="deleteWorkoutHistory('${w.id}')">Delete Workout</button>
  `);
}

function deleteWorkoutHistory(id) {
  if (!confirm('Delete this workout from your history?')) return;
  DB.data.workouts = DB.data.workouts.filter(w => w.id !== id);
  DB.save();
  closeModal();
  renderApp();
}
