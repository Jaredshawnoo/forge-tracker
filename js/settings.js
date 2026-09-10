function renderSettings() {
  const p = DB.data.profile;
  const g = DB.data.goals;
  const theme = DB.data.theme || 'auto';

  return `
    <div class="section-title">Profile</div>
    <div class="card">
      <div class="settings-item">
        <div>
          <div class="settings-item-label">Name</div>
          <div class="settings-item-sub">Shown in your daily greeting</div>
        </div>
        <input class="form-input" style="width:140px" value="${escapeHtml(p.name)}" placeholder="Your name" oninput="updateProfile('name', this.value)">
      </div>
      <div class="settings-item">
        <div>
          <div class="settings-item-label">Units</div>
          <div class="settings-item-sub">Used for weight &amp; lifts</div>
        </div>
        <div class="segmented" style="width:140px;margin-bottom:0;">
          <button class="${p.units === 'lbs' ? 'active' : ''}" onclick="updateProfile('units','lbs')">lbs</button>
          <button class="${p.units === 'kg' ? 'active' : ''}" onclick="updateProfile('units','kg')">kg</button>
        </div>
      </div>
    </div>

    <div class="section-title">Daily Goals</div>
    <div class="card">
      <div class="settings-item">
        <div class="settings-item-label">Calories</div>
        <input class="form-input" type="number" inputmode="numeric" value="${g.calories}" oninput="updateGoal('calories', this.value)">
      </div>
      <div class="settings-item">
        <div class="settings-item-label">Protein (g)</div>
        <input class="form-input" type="number" inputmode="numeric" value="${g.protein}" oninput="updateGoal('protein', this.value)">
      </div>
      <div class="settings-item">
        <div class="settings-item-label">Carbs (g)</div>
        <input class="form-input" type="number" inputmode="numeric" value="${g.carbs}" oninput="updateGoal('carbs', this.value)">
      </div>
      <div class="settings-item">
        <div class="settings-item-label">Fat (g)</div>
        <input class="form-input" type="number" inputmode="numeric" value="${g.fat}" oninput="updateGoal('fat', this.value)">
      </div>
      <div class="settings-item">
        <div class="settings-item-label">Water (ml)</div>
        <input class="form-input" type="number" inputmode="numeric" value="${g.water}" oninput="updateGoal('water', this.value)">
      </div>
    </div>

    <div class="section-title">Appearance</div>
    <div class="card">
      <div class="segmented" style="margin-bottom:0;">
        <button class="${theme === 'auto' ? 'active' : ''}" onclick="setThemeSetting('auto')">Auto</button>
        <button class="${theme === 'light' ? 'active' : ''}" onclick="setThemeSetting('light')">Light</button>
        <button class="${theme === 'dark' ? 'active' : ''}" onclick="setThemeSetting('dark')">Dark</button>
      </div>
    </div>

    <div class="section-title">Your Data</div>
    <div class="card">
      <div class="settings-item">
        <div>
          <div class="settings-item-label">Export backup</div>
          <div class="settings-item-sub">Save a JSON file of all your data</div>
        </div>
        <button class="btn btn-sm" onclick="exportData()">Export</button>
      </div>
      <div class="settings-item">
        <div>
          <div class="settings-item-label">Import backup</div>
          <div class="settings-item-sub">Restore from a JSON file</div>
        </div>
        <button class="btn btn-sm" onclick="triggerImport()">Import</button>
      </div>
      <input id="importFile" type="file" accept="application/json" style="display:none" onchange="handleImportFile(event)">
      <div class="settings-item">
        <div>
          <div class="settings-item-label" style="color:var(--danger)">Reset all data</div>
          <div class="settings-item-sub">Erase workouts, foods &amp; logs</div>
        </div>
        <button class="btn btn-sm btn-danger" onclick="resetAllData()">Reset</button>
      </div>
    </div>

    <div class="section-title">Install on iPhone</div>
    <div class="card">
      <div class="settings-item-sub" style="line-height:1.5">
        Open this page in Safari, tap the <b>Share</b> icon, then <b>Add to Home Screen</b>. Forge works offline once installed.
      </div>
    </div>
  `;
}

function mountSettings() {}

function updateProfile(field, value) {
  DB.data.profile[field] = value;
  DB.save();
  if (field === 'units') renderApp();
}

function updateGoal(field, value) {
  const n = parseFloat(value);
  DB.data.goals[field] = isNaN(n) ? 0 : n;
  DB.save();
}

function setThemeSetting(theme) {
  DB.data.theme = theme;
  DB.save();
  applyTheme();
  renderApp();
}

function exportData() {
  const blob = new Blob([DB.exportJSON()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `forge-backup-${todayISO()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('Backup downloaded');
}

function triggerImport() {
  $('#importFile').click();
}

function handleImportFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (!confirm('Import this backup? Your current data will be replaced.')) return;
    try {
      DB.importJSON(reader.result);
      applyTheme();
      showToast('Data imported');
      renderApp();
    } catch (e) {
      showToast('Could not read that file');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function resetAllData() {
  if (!confirm('This will permanently erase all workouts, foods, and logs. Continue?')) return;
  if (!confirm('Are you absolutely sure? This cannot be undone.')) return;
  DB.reset();
  applyTheme();
  showToast('All data reset');
  renderApp();
}
