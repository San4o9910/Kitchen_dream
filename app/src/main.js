import './style.css';
import { recipes, mealPlan, freezerSeed, prepTasks, shoppingGroups } from './data.js';

const STORAGE_KEY = 'kitchen-dream-state-v1';
const app = document.querySelector('#app');

const defaultState = {
  activeScreen: new URLSearchParams(location.search).get('screen') || 'home',
  recipeMode: 'library',
  freezer: freezerSeed,
  prepDone: {},
  prepBatchesDone: {},
  shoppingDone: {},
  mealsDone: {},
  thawed: {},
  recipeCategory: 'Все',
  freezerCategory: 'Все',
  recipeQuery: '',
  freezerQuery: '',
  constructorProtein: 'Любой',
  constructorTime: 60,
  installDismissed: false
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...defaultState, ...saved, activeScreen: defaultState.activeScreen } : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

let state = loadState();
let activeModal = null;
let deferredInstallPrompt = null;

function saveState() {
  const serializable = { ...state, activeScreen: 'home' };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}

function recipeById(id) {
  return recipes.find((recipe) => recipe.id === id);
}

function currentPlanDay() {
  return ((new Date().getDate() - 1) % 30) + 1;
}

function currentMealType() {
  const hour = new Date().getHours();
  return hour < 16 ? 'lunch' : 'dinner';
}

function getTodayMeal() {
  const plan = mealPlan.find((day) => day.day === currentPlanDay()) || mealPlan[0];
  const type = currentMealType();
  return { plan, type, recipe: recipeById(plan[type]) };
}

function statusForItem(item) {
  if (item.quantity <= 0) return { label: 'Закончился', tone: 'danger' };
  if (item.quantity === 1 || item.daysLeft <= 14) return { label: 'Внимание', tone: 'warning' };
  return { label: 'В запасе', tone: 'success' };
}

function formatCount(item) {
  return `${item.quantity} ${item.unit}`;
}

function icon(name, size = 22) {
  const paths = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    snow: '<path d="M12 2v20M4.93 6l14.14 12M4.93 18 19.07 6M2 12h20"/><path d="m8 4 4 2 4-2M8 20l4-2 4 2M4 8l2 4-2 4M20 8l-2 4 2 4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5z"/><path d="M4 6.5v13"/>',
    box: '<path d="m21 8-9 5-9-5 9-5z"/><path d="m3 8 9 5 9-5v8l-9 5-9-5z"/><path d="M12 13v8"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    chef: '<path d="M6 13.87A4 4 0 0 1 7.1 6 5 5 0 0 1 17 6a4 4 0 0 1 1 7.87V21H6z"/><path d="M6 17h12"/>',
    cart: '<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    package: '<path d="M21 8 12 3 3 8l9 5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>',
    alert: '<path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    install: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>'
  };
  return `<svg class="ui-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.info}</svg>`;
}

function progressRing(value, label, caption) {
  const safe = Math.max(0, Math.min(100, value));
  return `<div class="ring" style="--progress:${safe * 3.6}deg"><div class="ring__inner"><strong>${label}</strong><span>${caption}</span></div></div>`;
}

function navItem(screen, label, iconName) {
  const active = state.activeScreen === screen ? 'is-active' : '';
  return `<button class="nav-item ${active}" data-screen="${screen}" aria-label="${label}">${icon(iconName, 21)}<span>${label}</span></button>`;
}

function renderShell(content) {
  const checkedShopping = Object.values(state.shoppingDone).filter(Boolean).length;
  app.innerHTML = `
    <div class="app-shell">
      <aside class="desktop-sidebar">
        <div class="brand brand--sidebar"><span class="brand-mark">KD</span><div><strong>Kitchen Dream</strong><small>Домашняя кухня без хаоса</small></div></div>
        <nav class="desktop-nav">
          ${navItem('home','Главная','home')}
          ${navItem('freezer','Морозильник','snow')}
          ${navItem('plan','Меню','calendar')}
          ${navItem('recipes','Рецепты','book')}
          ${navItem('prep','Заготовка','box')}
        </nav>
        <button class="sidebar-shopping" data-action="open-shopping">${icon('cart')}<span>Список покупок</span><b>${checkedShopping}</b></button>
        <div class="sidebar-note"><span>❄️</span><p>Месячные мясные заготовки храним в морозильнике, а не в холодильнике.</p></div>
      </aside>
      <main class="main-view">
        ${content}
      </main>
      <nav class="bottom-nav" aria-label="Основная навигация">
        ${navItem('home','Главная','home')}
        ${navItem('freezer','Морозилка','snow')}
        ${navItem('plan','Меню','calendar')}
        ${navItem('recipes','Рецепты','book')}
        ${navItem('prep','Заготовка','box')}
      </nav>
      <div id="toast-region" class="toast-region" aria-live="polite"></div>
      <div id="modal-root"></div>
    </div>`;
  if (activeModal) renderModal();
}

function pageHeader(eyebrow, title, subtitle, action = '') {
  return `<header class="page-header">
    <div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${subtitle}</p></div>
    ${action}
  </header>`;
}

function dashboardScreen() {
  const { plan, type, recipe } = getTodayMeal();
  const freezerPackages = state.freezer.reduce((sum, item) => sum + Math.max(0, item.quantity), 0);
  const availableItems = state.freezer.filter((item) => item.quantity > 0).length;
  const prepCompleted = prepTasks.filter((task) => state.prepDone[task.id]).length;
  const prepProgress = Math.round((prepCompleted / prepTasks.length) * 100);
  const todayKey = `${plan.day}-${type}`;
  const relatedItem = state.freezer.find((item) => item.id === recipe.freezerItemId);
  const suggestions = recipes.filter((candidate) => state.freezer.some((item) => item.recipeId === candidate.id && item.quantity > 0)).slice(0, 4);

  return `<div class="page page--home">
    ${pageHeader('Семейная кухня','Добрый вечер 👋','Сегодня всё уже спланировано.', `<div class="header-actions">${deferredInstallPrompt ? `<button class="icon-button" data-action="install-app" aria-label="Установить приложение">${icon('install')}</button>` : ''}<button class="icon-button" data-action="open-shopping" aria-label="Список покупок">${icon('cart')}<span class="notification-dot"></span></button></div>`)}

    <section class="today-hero">
      <div class="today-hero__content">
        <div class="today-meta"><span>День ${plan.day}</span><span>${type === 'lunch' ? 'Обед' : 'Ужин'}</span><span>${recipe.time} мин</span></div>
        <div class="meal-visual"><span>${recipe.emoji}</span></div>
        <div class="today-copy"><p class="overline">Сегодня готовим</p><h2>${recipe.name}</h2><p>${recipe.prep.title}. ${relatedItem && relatedItem.quantity > 0 ? `В морозильнике: ${formatCount(relatedItem)}.` : 'Нужно пополнить запас.'}</p></div>
        <div class="today-actions">
          <button class="button button--primary" data-action="open-recipe" data-id="${recipe.id}">${icon('chef')} Открыть рецепт</button>
          <button class="button button--soft ${state.thawed[todayKey] ? 'is-done' : ''}" data-action="toggle-thawed" data-key="${todayKey}">${state.thawed[todayKey] ? icon('check') + ' Уже достали' : icon('snow') + ' Достать пакет'}</button>
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="section-title"><div><span class="eyebrow">Состояние кухни</span><h2>Всё под контролем</h2></div></div>
      <div class="stats-grid">
        <button class="stat-card" data-screen="freezer">
          ${progressRing(Math.min(100, freezerPackages / 30 * 100), freezerPackages, 'пакетов')}
          <div><span class="stat-label">Морозильник</span><strong>${availableItems} видов заготовок</strong><small>Нажмите, чтобы открыть склад</small></div>
        </button>
        <button class="stat-card" data-screen="prep">
          ${progressRing(prepProgress, `${prepProgress}%`, 'готово')}
          <div><span class="stat-label">День заготовки</span><strong>${prepCompleted} из ${prepTasks.length} задач</strong><small>${prepProgress === 100 ? 'Партия полностью готова' : 'Продолжить чек-лист'}</small></div>
        </button>
      </div>
    </section>

    <section class="section-block">
      <div class="section-title"><div><span class="eyebrow">Кулинарный конструктор</span><h2>Что можно приготовить</h2></div><button class="text-button" data-screen="recipes" data-mode="constructor">Подобрать ${icon('arrow',17)}</button></div>
      <div class="horizontal-cards">
        ${suggestions.map((item) => `<button class="mini-recipe" data-action="open-recipe" data-id="${item.id}"><span class="mini-recipe__emoji">${item.emoji}</span><span><strong>${item.name}</strong><small>${item.time} мин · ${item.category}</small></span></button>`).join('')}
      </div>
    </section>

    <section class="safety-banner">
      <div class="safety-banner__icon">${icon('alert')}</div>
      <div><strong>Важное правило хранения</strong><p>Вакуум не делает сырое мясо безопасным на месяц в холодильнике. Долгие запасы замораживаем; холодильник используем только для безопасной разморозки.</p></div>
      <button class="text-button" data-action="open-safety">Подробнее</button>
    </section>
  </div>`;
}

function freezerCard(item) {
  const status = statusForItem(item);
  const ratio = Math.min(100, item.quantity / 6 * 100);
  const recipeAction = item.recipeId ? `data-action="open-recipe" data-id="${item.recipeId}"` : '';
  return `<article class="freezer-card" data-category="${item.category}">
    <button class="freezer-card__main" ${recipeAction}>
      <div class="freezer-emoji">${item.emoji}</div>
      <div class="freezer-copy"><div class="card-topline"><span class="status-pill status-pill--${status.tone}">${status.label}</span><small>${item.zone}</small></div><h3>${item.name}</h3><p>${formatCount(item)} · ${item.portions} порций</p></div>
    </button>
    <div class="stock-line"><span style="width:${ratio}%"></span></div>
    <div class="freezer-card__footer"><span>${icon('timer',17)} качество: ещё ${item.daysLeft} дн.</span><div class="stepper"><button data-action="freezer-minus" data-id="${item.id}" aria-label="Уменьшить">${icon('minus',17)}</button><b>${item.quantity}</b><button data-action="freezer-plus" data-id="${item.id}" aria-label="Увеличить">${icon('plus',17)}</button></div></div>
  </article>`;
}

function freezerScreen() {
  const categories = ['Все', ...new Set(state.freezer.map((item) => item.category))];
  const filtered = state.freezer.filter((item) => {
    const categoryOk = state.freezerCategory === 'Все' || item.category === state.freezerCategory;
    const query = state.freezerQuery.toLowerCase();
    return categoryOk && (!query || item.name.toLowerCase().includes(query));
  }).sort((a,b) => a.daysLeft - b.daysLeft);
  const total = state.freezer.reduce((sum,item) => sum + item.quantity,0);

  return `<div class="page">
    ${pageHeader('Домашний склад','Морозильник',`${total} упаковок в четырёх зонах.`, `<button class="button button--primary button--compact" data-action="open-add-freezer">${icon('plus')} Добавить</button>`)}
    <div class="toolbar">
      <label class="search-field">${icon('search',19)}<input id="freezer-search" value="${state.freezerQuery}" placeholder="Найти заготовку" autocomplete="off"></label>
      <div class="chips">${categories.map((category) => `<button class="chip ${state.freezerCategory === category ? 'is-active' : ''}" data-action="freezer-filter" data-value="${category}">${category}</button>`).join('')}</div>
    </div>
    <div class="freezer-summary">
      <div><span>Использовать раньше</span><strong>${state.freezer.filter((item)=>item.daysLeft <= 30 && item.quantity > 0).length}</strong><small>позиций</small></div>
      <div><span>Заканчивается</span><strong>${state.freezer.filter((item)=>item.quantity === 1).length}</strong><small>позиций</small></div>
      <div><span>Пусто</span><strong>${state.freezer.filter((item)=>item.quantity === 0).length}</strong><small>позиций</small></div>
    </div>
    <section class="freezer-grid">${filtered.length ? filtered.map(freezerCard).join('') : '<div class="empty-state"><span>🔎</span><h3>Ничего не найдено</h3><p>Попробуйте другой фильтр или добавьте новую заготовку.</p></div>'}</section>
  </div>`;
}

function planScreen() {
  const today = currentPlanDay();
  return `<div class="page">
    ${pageHeader('30 дней без ежедневной готовки','Меню месяца','Каждое основное блюдо рассчитано примерно на три дня.', `<button class="button button--soft button--compact" data-action="open-shopping">${icon('cart')} Покупки</button>`)}
    <div class="plan-legend"><span><i class="legend-dot legend-dot--today"></i>Сегодня</span><span><i class="legend-dot legend-dot--done"></i>Отмечено</span><button class="text-button" data-action="reset-meals">${icon('reset',16)} Сбросить отметки</button></div>
    <section class="month-list">
      ${mealPlan.map((day) => {
        const lunch = recipeById(day.lunch); const dinner = recipeById(day.dinner);
        const lunchKey = `${day.day}-lunch`; const dinnerKey = `${day.day}-dinner`;
        return `<article class="day-card ${day.day === today ? 'is-today' : ''}">
          <div class="day-number"><span>${day.day}</span><small>день</small></div>
          <div class="day-meals">
            <button class="meal-row ${state.mealsDone[lunchKey] ? 'is-done' : ''}" data-action="open-recipe" data-id="${lunch.id}"><span>${lunch.emoji}</span><div><small>Обед</small><strong>${lunch.name}</strong></div><i>${lunch.time} мин</i></button>
            <button class="meal-row ${state.mealsDone[dinnerKey] ? 'is-done' : ''}" data-action="open-recipe" data-id="${dinner.id}"><span>${dinner.emoji}</span><div><small>Ужин</small><strong>${dinner.name}</strong></div><i>${dinner.time} мин</i></button>
          </div>
          <div class="day-checks"><button class="check-button ${state.mealsDone[lunchKey] ? 'is-checked' : ''}" data-action="toggle-meal" data-key="${lunchKey}" aria-label="Отметить обед">${icon('check',16)}</button><button class="check-button ${state.mealsDone[dinnerKey] ? 'is-checked' : ''}" data-action="toggle-meal" data-key="${dinnerKey}" aria-label="Отметить ужин">${icon('check',16)}</button></div>
        </article>`;
      }).join('')}
    </section>
  </div>`;
}

function recipeCard(recipe) {
  const available = state.freezer.find((item) => item.recipeId === recipe.id && item.quantity > 0);
  return `<button class="recipe-card" data-action="open-recipe" data-id="${recipe.id}">
    <div class="recipe-card__visual"><span>${recipe.emoji}</span><i>${recipe.category}</i></div>
    <div class="recipe-card__body"><h3>${recipe.name}</h3><p>${recipe.prep.title}</p><div class="recipe-facts"><span>${icon('timer',16)} ${recipe.time} мин</span><span>${icon('users',16)} ${recipe.portions}</span></div></div>
    <div class="availability ${available ? 'is-available' : ''}">${available ? `${icon('snow',15)} Есть` : 'Нет пакета'}</div>
  </button>`;
}

function constructorPanel() {
  const proteins = ['Любой','Курица','Свинина','Рыба','Фарш'];
  const matches = recipes.filter((recipe) => {
    const proteinOk = state.constructorProtein === 'Любой' || recipe.category === state.constructorProtein || (state.constructorProtein === 'Фарш' && ['Фарш','Котлеты'].includes(recipe.category));
    const timeOk = recipe.time <= state.constructorTime;
    const stockOk = state.freezer.some((item) => item.recipeId === recipe.id && item.quantity > 0);
    return proteinOk && timeOk && stockOk;
  });
  return `<section class="constructor-panel">
    <div class="constructor-hero"><div><span class="eyebrow">Готовим из запасов</span><h2>Кулинарный конструктор</h2><p>Выберите основу, и приложение покажет блюда, для которых уже есть заготовка.</p></div><span class="constructor-emoji">🧩</span></div>
    <div class="constructor-controls"><div><label>Белковая основа</label><div class="chips">${proteins.map((protein)=>`<button class="chip ${state.constructorProtein === protein ? 'is-active' : ''}" data-action="constructor-protein" data-value="${protein}">${protein}</button>`).join('')}</div></div><div class="range-control"><label for="time-range">Максимум времени: <b>${state.constructorTime} минут</b></label><input id="time-range" type="range" min="25" max="60" step="5" value="${state.constructorTime}"></div></div>
    <div class="match-count"><strong>${matches.length}</strong><span>подходящих блюд</span></div>
    <div class="recipe-grid">${matches.length ? matches.map(recipeCard).join('') : '<div class="empty-state"><span>🧺</span><h3>Подходящих запасов нет</h3><p>Измените фильтры или пополните морозильник.</p></div>'}</div>
  </section>`;
}

function recipesScreen() {
  const categories = ['Все', ...new Set(recipes.map((recipe) => recipe.category))];
  const filtered = recipes.filter((recipe) => {
    const catOk = state.recipeCategory === 'Все' || recipe.category === state.recipeCategory;
    const query = state.recipeQuery.toLowerCase();
    return catOk && (!query || `${recipe.name} ${recipe.tags.join(' ')}`.toLowerCase().includes(query));
  });
  return `<div class="page">
    ${pageHeader('Связано с морозильником','Рецепты и конструктор','В каждой карточке отдельно показано, что заготовить и что добавить свежим.')}
    <div class="segmented"><button class="${state.recipeMode === 'library' ? 'is-active' : ''}" data-action="recipe-mode" data-value="library">${icon('book',18)} Рецепты</button><button class="${state.recipeMode === 'constructor' ? 'is-active' : ''}" data-action="recipe-mode" data-value="constructor">${icon('chef',18)} Конструктор</button></div>
    ${state.recipeMode === 'constructor' ? constructorPanel() : `<div class="toolbar"><label class="search-field">${icon('search',19)}<input id="recipe-search" value="${state.recipeQuery}" placeholder="Название или ингредиент" autocomplete="off"></label><div class="chips">${categories.map((category)=>`<button class="chip ${state.recipeCategory === category ? 'is-active' : ''}" data-action="recipe-filter" data-value="${category}">${category}</button>`).join('')}</div></div><section class="recipe-grid">${filtered.map(recipeCard).join('')}</section>`}
  </div>`;
}

function prepBatchCards() {
  return recipes.filter((recipe) => recipe.prep.packageCount).map((recipe) => {
    const done = state.prepBatchesDone[recipe.id];
    return `<button class="batch-row ${done ? 'is-done' : ''}" data-action="toggle-batch" data-id="${recipe.id}"><span class="batch-icon">${recipe.emoji}</span><div><strong>${recipe.prep.title}</strong><small>${recipe.prep.packageCount} ${recipe.prep.packageCount === 1 ? 'упаковка' : 'упаковки'} · ${recipe.prep.label}</small></div><span class="batch-check">${done ? icon('check',18) : ''}</span></button>`;
  }).join('');
}

function prepScreen() {
  const doneCount = prepTasks.filter((task) => state.prepDone[task.id]).length;
  const batchCount = recipes.filter((recipe) => state.prepBatchesDone[recipe.id]).length;
  const totalBatches = recipes.filter((recipe)=>recipe.prep.packageCount).length;
  const progress = Math.round(((doneCount + batchCount) / (prepTasks.length + totalBatches)) * 100);
  const phases = [...new Set(prepTasks.map((task)=>task.phase))];
  return `<div class="page">
    ${pageHeader('Один день — месяц спокойствия','День большой заготовки','Идите по этапам сверху вниз. Все отметки сохраняются на телефоне.', `<button class="icon-button" data-action="reset-prep" aria-label="Сбросить чек-лист">${icon('reset')}</button>`)}
    <section class="prep-progress-card"><div>${progressRing(progress, `${progress}%`, 'готово')}</div><div><span class="eyebrow">Общий прогресс</span><h2>${doneCount + batchCount} из ${prepTasks.length + totalBatches} пунктов</h2><p>${progress === 100 ? 'Большая партия полностью готова.' : 'Не торопитесь: качество упаковки важнее скорости.'}</p></div></section>
    <section class="safety-banner safety-banner--strong"><div class="safety-banner__icon">${icon('snow')}</div><div><strong>Холодильник — только на короткий срок</strong><p>Сырые вакуумированные наборы на месяц сразу замораживаем. В холодильник переносим только пакет на ближайшую готовку.</p></div></section>
    <section class="prep-layout">
      <div class="prep-steps">
        ${phases.map((phase)=>`<div class="phase-block"><div class="phase-title"><span>${phase}</span><small>${prepTasks.filter((task)=>task.phase === phase && state.prepDone[task.id]).length}/${prepTasks.filter((task)=>task.phase === phase).length}</small></div>${prepTasks.filter((task)=>task.phase === phase).map((task)=>`<button class="task-row ${state.prepDone[task.id] ? 'is-done' : ''}" data-action="toggle-prep" data-id="${task.id}"><span class="task-check">${state.prepDone[task.id] ? icon('check',18) : ''}</span><div><strong>${task.title}</strong><small>${task.detail}</small></div></button>`).join('')}</div>`).join('')}
      </div>
      <div class="batch-panel"><div class="section-title"><div><span class="eyebrow">Производство</span><h2>Пакеты и контейнеры</h2></div><span class="count-badge">${batchCount}/${totalBatches}</span></div>${prepBatchCards()}</div>
    </section>
  </div>`;
}

function screenContent() {
  switch(state.activeScreen) {
    case 'freezer': return freezerScreen();
    case 'plan': return planScreen();
    case 'recipes': return recipesScreen();
    case 'prep': return prepScreen();
    default: return dashboardScreen();
  }
}

function render() {
  renderShell(screenContent());
}

function modalFrame(content, wide = false) {
  return `<div class="modal-backdrop" data-action="close-modal"><section class="modal-sheet ${wide ? 'modal-sheet--wide' : ''}" role="dialog" aria-modal="true" onclick="event.stopPropagation()"><button class="modal-close" data-action="close-modal" aria-label="Закрыть">${icon('close')}</button>${content}</section></div>`;
}

function recipeModal(recipe) {
  const packIngredients = recipe.ingredients.filter((item)=>item[2] !== 'cook');
  const cookIngredients = recipe.ingredients.filter((item)=>item[2] === 'cook');
  const freezerItem = state.freezer.find((item)=>item.recipeId === recipe.id);
  return modalFrame(`<div class="recipe-modal-head"><div class="recipe-modal-emoji">${recipe.emoji}</div><div><span class="eyebrow">${recipe.category} · ${recipe.difficulty}</span><h2>${recipe.name}</h2><div class="recipe-facts recipe-facts--large"><span>${icon('timer',17)} ${recipe.time} минут</span><span>${icon('users',17)} ${recipe.portions} порций</span></div></div></div>
    <div class="modal-stock ${freezerItem && freezerItem.quantity > 0 ? 'is-available' : ''}">${icon('snow',18)}<span>${freezerItem && freezerItem.quantity > 0 ? `В морозильнике: ${formatCount(freezerItem)}` : 'Готовой заготовки нет'}</span></div>
    <div class="recipe-modal-grid">
      <section><h3>В вакуумный пакет</h3><div class="ingredient-list">${packIngredients.map(([name,amount])=>`<div><span>${name}</span><b>${amount}</b></div>`).join('')}</div></section>
      <section><h3>Добавить при готовке</h3><div class="ingredient-list">${cookIngredients.length ? cookIngredients.map(([name,amount])=>`<div><span>${name}</span><b>${amount}</b></div>`).join('') : '<p class="muted">Всё уже входит в заготовку.</p>'}</div></section>
    </div>
    <section class="prep-instruction"><span class="prep-number">01</span><div><span class="eyebrow">День заготовки</span><h3>${recipe.prep.title}</h3><p>${recipe.prep.pack}</p><div class="label-preview"><small>Надпись на пакете</small><strong>${recipe.prep.label}</strong></div><p class="storage-line">${icon('snow',18)} ${recipe.prep.freezer}</p></div></section>
    <section class="cooking-steps"><span class="eyebrow">В день приготовления</span><h3>Как приготовить</h3><ol>${recipe.steps.map((step)=>`<li><span>${step}</span></li>`).join('')}</ol></section>
    <section class="modal-safety">${icon('info',19)}<p><strong>Хранение:</strong> ${recipe.storage}</p></section>
    <div class="modal-actions"><button class="button button--primary" data-action="close-modal">Понятно</button>${freezerItem ? `<button class="button button--soft" data-action="freezer-minus" data-id="${freezerItem.id}">Списать 1 пакет</button>` : ''}</div>`, true);
}

function shoppingModal() {
  const allKeys = shoppingGroups.flatMap((group)=>group.items.map(([name])=>name));
  const done = allKeys.filter((key)=>state.shoppingDone[key]).length;
  return modalFrame(`<div class="modal-heading"><span class="eyebrow">Закупка на месяц</span><h2>Список продуктов</h2><p>${done} из ${allKeys.length} позиций отмечено</p></div><div class="shopping-progress"><span style="width:${done/allKeys.length*100}%"></span></div><div class="shopping-groups">${shoppingGroups.map((group)=>`<section class="shopping-group"><h3><span>${group.icon}</span>${group.name}</h3>${group.items.map(([name,amount])=>`<button class="shopping-row ${state.shoppingDone[name] ? 'is-done' : ''}" data-action="toggle-shopping" data-key="${name}"><span class="shopping-check">${state.shoppingDone[name] ? icon('check',16) : ''}</span><span>${name}</span><b>${amount}</b></button>`).join('')}</section>`).join('')}</div><div class="modal-actions sticky-actions"><button class="button button--soft" data-action="reset-shopping">${icon('reset',17)} Сбросить</button><button class="button button--primary" data-action="close-modal">Готово</button></div>`, true);
}

function safetyModal() {
  return modalFrame(`<div class="modal-heading"><span class="eyebrow">Безопасность</span><h2>Как хранить вакуумные заготовки</h2><p>Вакуум уменьшает контакт с воздухом, но не стерилизует продукт.</p></div><div class="safety-rules"><article><span>❄️</span><div><strong>Для месяца — морозильник</strong><p>Сырые котлеты, мясные наборы, рыбу и готовые порции замораживайте сразу после подготовки.</p></div></article><article><span>🧊</span><div><strong>Холодильник — для разморозки</strong><p>Переносите туда один пакет накануне. Сырые птицу, рыбу и фарш после размораживания готовьте без долгого ожидания.</p></div></article><article><span>🧼</span><div><strong>Разделяйте сырое и готовое</strong><p>Отдельные доски, чистые руки, герметичные пакеты и нижняя полка холодильника для сырого мяса.</p></div></article><article><span>🌡️</span><div><strong>Температура важнее вакуума</strong><p>Ориентир: холодильник не выше +4 °C, морозильник около −18 °C.</p></div></article></div><div class="modal-actions"><button class="button button--primary" data-action="close-modal">Понятно</button></div>`);
}

function addFreezerModal() {
  return modalFrame(`<div class="modal-heading"><span class="eyebrow">Новая упаковка</span><h2>Добавить в морозильник</h2><p>Можно добавить собственную заготовку, которой нет в месячном плане.</p></div><form id="freezer-form" class="form-grid"><label><span>Название</span><input name="name" required placeholder="Например, сырники"></label><label><span>Категория</span><select name="category"><option>Курица</option><option>Свинина</option><option>Рыба</option><option>Фарш</option><option>Готовое</option><option>Другое</option></select></label><label><span>Количество пакетов</span><input name="quantity" type="number" min="1" value="1" required></label><label><span>Порций всего</span><input name="portions" type="number" min="1" value="2" required></label><label><span>Зона</span><select name="zone"><option>Ящик 1</option><option>Ящик 2</option><option>Ящик 3</option><option>Ящик 4</option></select></label><label><span>Срок качества, дней</span><input name="daysLeft" type="number" min="1" value="60" required></label><div class="modal-actions form-actions"><button type="button" class="button button--soft" data-action="close-modal">Отмена</button><button class="button button--primary" type="submit">Добавить</button></div></form>`);
}

function renderModal() {
  const root = document.querySelector('#modal-root');
  if (!root) return;
  if (activeModal?.type === 'recipe') root.innerHTML = recipeModal(recipeById(activeModal.id));
  if (activeModal?.type === 'shopping') root.innerHTML = shoppingModal();
  if (activeModal?.type === 'safety') root.innerHTML = safetyModal();
  if (activeModal?.type === 'add-freezer') root.innerHTML = addFreezerModal();
  document.body.classList.toggle('modal-open', Boolean(activeModal));
}

function closeModal() {
  activeModal = null;
  document.body.classList.remove('modal-open');
  const root = document.querySelector('#modal-root');
  if (root) root.innerHTML = '';
}

function toast(message) {
  const region = document.querySelector('#toast-region');
  if (!region) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  region.append(el);
  setTimeout(()=>el.remove(),2500);
}

function switchScreen(screen, mode) {
  state.activeScreen = screen;
  if (mode) state.recipeMode = mode;
  history.replaceState(null,'',`${location.pathname}?screen=${screen}`);
  saveState();
  render();
  scrollTo({top:0,behavior:'smooth'});
}

function updateFreezer(id, delta) {
  state.freezer = state.freezer.map((item)=>item.id === id ? {...item, quantity:Math.max(0,item.quantity + delta)} : item);
  saveState();
  render();
  toast(delta < 0 ? 'Один пакет списан' : 'Запас увеличен');
}

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-screen],[data-action]');
  if (!target) return;
  const screen = target.dataset.screen;
  if (screen) return switchScreen(screen, target.dataset.mode);
  const action = target.dataset.action;

  if (action === 'open-recipe') { activeModal = {type:'recipe',id:target.dataset.id}; renderModal(); }
  if (action === 'close-modal') closeModal();
  if (action === 'open-shopping') { activeModal = {type:'shopping'}; renderModal(); }
  if (action === 'open-safety') { activeModal = {type:'safety'}; renderModal(); }
  if (action === 'open-add-freezer') { activeModal = {type:'add-freezer'}; renderModal(); }
  if (action === 'freezer-minus') updateFreezer(target.dataset.id,-1);
  if (action === 'freezer-plus') updateFreezer(target.dataset.id,1);
  if (action === 'freezer-filter') { state.freezerCategory = target.dataset.value; saveState(); render(); }
  if (action === 'recipe-filter') { state.recipeCategory = target.dataset.value; saveState(); render(); }
  if (action === 'recipe-mode') { state.recipeMode = target.dataset.value; saveState(); render(); }
  if (action === 'constructor-protein') { state.constructorProtein = target.dataset.value; saveState(); render(); }
  if (action === 'toggle-prep') { state.prepDone[target.dataset.id] = !state.prepDone[target.dataset.id]; saveState(); render(); }
  if (action === 'toggle-batch') { state.prepBatchesDone[target.dataset.id] = !state.prepBatchesDone[target.dataset.id]; saveState(); render(); }
  if (action === 'toggle-shopping') { state.shoppingDone[target.dataset.key] = !state.shoppingDone[target.dataset.key]; saveState(); renderModal(); }
  if (action === 'toggle-meal') { state.mealsDone[target.dataset.key] = !state.mealsDone[target.dataset.key]; saveState(); render(); }
  if (action === 'toggle-thawed') { state.thawed[target.dataset.key] = !state.thawed[target.dataset.key]; saveState(); render(); }
  if (action === 'reset-prep') { state.prepDone = {}; state.prepBatchesDone = {}; saveState(); render(); toast('Чек-лист сброшен'); }
  if (action === 'reset-shopping') { state.shoppingDone = {}; saveState(); renderModal(); }
  if (action === 'reset-meals') { state.mealsDone = {}; saveState(); render(); toast('Отметки меню сброшены'); }
  if (action === 'install-app' && deferredInstallPrompt) { deferredInstallPrompt.prompt(); deferredInstallPrompt.userChoice.finally(()=>{deferredInstallPrompt=null;render();}); }
});

app.addEventListener('input', (event) => {
  if (event.target.id === 'freezer-search') { state.freezerQuery = event.target.value; saveState(); render(); setTimeout(()=>document.querySelector('#freezer-search')?.focus(),0); }
  if (event.target.id === 'recipe-search') { state.recipeQuery = event.target.value; saveState(); render(); setTimeout(()=>document.querySelector('#recipe-search')?.focus(),0); }
  if (event.target.id === 'time-range') { state.constructorTime = Number(event.target.value); saveState(); render(); }
});

app.addEventListener('submit', (event) => {
  if (event.target.id !== 'freezer-form') return;
  event.preventDefault();
  const form = new FormData(event.target);
  const id = `custom-${Date.now()}`;
  state.freezer.push({
    id,
    name:String(form.get('name')),
    emoji:'📦',
    category:String(form.get('category')),
    quantity:Number(form.get('quantity')),
    unit:'пакетов',
    portions:Number(form.get('portions')),
    zone:String(form.get('zone')),
    daysLeft:Number(form.get('daysLeft')),
    recipeId:null
  });
  saveState();
  closeModal();
  render();
  toast('Заготовка добавлена');
});

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  render();
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  toast('Kitchen Dream установлено');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(()=>{});
  });
}

render();
