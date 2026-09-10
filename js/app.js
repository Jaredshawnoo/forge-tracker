let currentTab = 'home';
let restTimerInterval = null;
let restTimerEnd = null;

function $(sel, root) { return (root || document).querySelector(sel); }
function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

function escapeHtml(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function round1(n) { return Math.round(n * 10) / 10; }

function units() { return DB.data.profile.units || 'lbs'; }

function formatDateLabel(iso) {
  const today = todayISO();
  const yesterday = isoDaysAgo(1);
  const tomorrow = (() => {
    const d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  })();
  if (iso === today) return 'Today';
  if (iso === yesterday) return 'Yesterday';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 1800);
}

function openModal(html) {
  const root = $('#modalRoot');
  root.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        ${html}
      </div>
    </div>`;
}

function closeModal() {
  $('#modalRoot').innerHTML = '';
}

function applyTheme() {
  const theme = DB.data.theme || 'auto';
  if (theme === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

function toggleTheme() {
  const order = ['auto', 'dark', 'light'];
  const cur = DB.data.theme || 'auto';
  const next = order[(order.indexOf(cur) + 1) % order.length];
  DB.data.theme = next;
  DB.save();
  applyTheme();
  showToast('Theme: ' + next.charAt(0).toUpperCase() + next.slice(1));
}

function switchTab(name) {
  currentTab = name;
  $all('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  renderApp();
  $('.app').scrollTo(0, 0);
  window.scrollTo(0, 0);
}

function renderApp() {
  const app = $('#app');
  if (currentTab === 'home') { app.innerHTML = renderHome(); mountHome(); }
  else if (currentTab === 'workout') { app.innerHTML = renderWorkout(); mountWorkout(); }
  else if (currentTab === 'diet') { app.innerHTML = renderDiet(); mountDiet(); }
  else if (currentTab === 'settings') { app.innerHTML = renderSettings(); mountSettings(); }
}

function refreshTab() { renderApp(); }

function startRestTimer(seconds) {
  clearInterval(restTimerInterval);
  restTimerEnd = Date.now() + seconds * 1000;
  renderRestFab();
  restTimerInterval = setInterval(renderRestFab, 250);
}

function cancelRestTimer() {
  clearInterval(restTimerInterval);
  restTimerInterval = null;
  restTimerEnd = null;
  const fab = $('#restFab');
  if (fab) fab.remove();
}

function renderRestFab() {
  let fab = $('#restFab');
  const remaining = Math.max(0, Math.round((restTimerEnd - Date.now()) / 1000));
  if (!fab) {
    fab = document.createElement('button');
    fab.id = 'restFab';
    fab.className = 'timer-fab';
    fab.type = 'button';
    fab.onclick = cancelRestTimer;
    document.body.appendChild(fab);
  }
  const m = Math.floor(remaining / 60), s = remaining % 60;
  fab.innerHTML = `<svg viewBox="0 0 24 24" class="icon" style="width:18px;height:18px"><path d="M12 2a1 1 0 0 1 1 1v1.06A9 9 0 1 1 6.34 6.34l-.7-.7a1 1 0 1 1 1.42-1.42l.7.71A8.94 8.94 0 0 1 11 4.06V3a1 1 0 0 1 1-1Zm0 5a1 1 0 0 1 1 1v4.59l2.7 2.7a1 1 0 0 1-1.4 1.42l-3-3A1 1 0 0 1 11 13V8a1 1 0 0 1 1-1Z"/></svg> Rest ${m}:${String(s).padStart(2, '0')}`;
  if (remaining <= 0) {
    if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
    showToast('Rest complete');
    cancelRestTimer();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  DB.load();
  applyTheme();
  $all('.tab-btn').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
  $('#themeToggle').addEventListener('click', toggleTheme);
  renderApp();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
});
