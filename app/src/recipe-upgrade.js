import { recipes } from './data.js';
import { bookSources, mediaLibrary } from './recipe-library.js';

let lastRecipeId = null;

function recipeById(id) {
  return recipes.find((recipe) => recipe.id === id);
}

function photoFor(recipe, index = 0) {
  return mediaLibrary[recipe?.photos?.[index]] || null;
}

function decorateRecipeCards(root = document) {
  root.querySelectorAll('.recipe-card[data-id]').forEach((card) => {
    if (card.dataset.realPhoto === '1') return;
    const recipe = recipeById(card.dataset.id);
    const photo = photoFor(recipe);
    const visual = card.querySelector('.recipe-card__visual');
    if (!recipe || !photo || !visual) return;

    card.dataset.realPhoto = '1';
    visual.classList.add('recipe-card__visual--photo');
    visual.style.backgroundImage = `linear-gradient(180deg, rgba(25,31,25,.04), rgba(25,31,25,.55)), url("${photo.url}")`;
    visual.setAttribute('aria-label', `Реальное фото: ${photo.caption}`);
  });

  root.querySelectorAll('.mini-recipe[data-id]').forEach((card) => {
    if (card.dataset.realPhoto === '1') return;
    const recipe = recipeById(card.dataset.id);
    const photo = photoFor(recipe);
    if (!recipe || !photo) return;

    card.dataset.realPhoto = '1';
    const image = document.createElement('img');
    image.className = 'mini-recipe__photo';
    image.src = photo.url;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    card.prepend(image);
  });

  const hero = root.querySelector('.today-hero');
  if (hero && hero.dataset.realPhoto !== '1') {
    const trigger = hero.querySelector('[data-action="open-recipe"][data-id]');
    const recipe = recipeById(trigger?.dataset.id);
    const photo = photoFor(recipe);
    const visual = hero.querySelector('.meal-visual');
    if (recipe && photo && visual) {
      hero.dataset.realPhoto = '1';
      visual.classList.add('meal-visual--photo');
      visual.style.backgroundImage = `linear-gradient(180deg, rgba(24,29,24,.02), rgba(24,29,24,.48)), url("${photo.url}")`;
    }
  }
}

function photoFigure(media, index) {
  return `<figure class="process-photo">
    <div class="process-photo__frame">
      <img src="${media.url}" alt="${media.caption}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
      <span class="process-photo__number">${String(index + 1).padStart(2, '0')}</span>
    </div>
    <figcaption>
      <strong>${media.caption}</strong>
      <small>Фото: ${media.author} · ${media.license} · <a href="${media.source}" target="_blank" rel="noopener noreferrer">источник</a></small>
    </figcaption>
  </figure>`;
}

function sourceCard(recipe) {
  const primary = bookSources[recipe.source?.book];
  const technique = bookSources[recipe.source?.technique];
  if (!primary) return '';

  return `<section class="recipe-source-card">
    <div class="recipe-source-card__icon">📚</div>
    <div class="recipe-source-card__content">
      <span class="eyebrow">Проверенная основа рецепта</span>
      <h3>${primary.title}</h3>
      <p>${primary.authors}</p>
      <div class="source-meta">
        <a href="${primary.url}" target="_blank" rel="noopener noreferrer">★ ${primary.rating} на Goodreads</a>
        ${technique ? `<span>Техника: ${technique.title}</span>` : ''}
        <span>Рейтинг проверен ${primary.ratingDate}</span>
      </div>
      <p class="adaptation-note">${recipe.source.note}</p>
      <p class="copyright-note">Это самостоятельная домашняя адаптация и пересчёт под вашу систему заготовок, а не дословная копия текста книги.</p>
    </div>
  </section>`;
}

function temperatureCard(recipe) {
  if (!recipe.safeTemperature) return '';
  return `<section class="temperature-card">
    <span class="temperature-card__icon">🌡️</span>
    <div><span class="eyebrow">Проверка готовности</span><strong>${recipe.safeTemperature}</strong><p>Проверяйте термометром в самой толстой части продукта.</p></div>
  </section>`;
}

function decorateRecipeModal(root = document) {
  const modal = root.querySelector('.modal-sheet .recipe-modal-head');
  if (!modal || modal.closest('.modal-sheet')?.dataset.recipeUpgrade === '1') return;

  const recipe = recipeById(lastRecipeId);
  if (!recipe?.source || !recipe?.photos?.length) return;

  const sheet = modal.closest('.modal-sheet');
  sheet.dataset.recipeUpgrade = '1';
  sheet.dataset.recipeId = recipe.id;

  const mediaItems = recipe.photos.map((key) => mediaLibrary[key]).filter(Boolean);
  if (mediaItems.length) {
    const gallery = document.createElement('section');
    gallery.className = 'recipe-process-section';
    gallery.innerHTML = `<div class="recipe-process-heading"><div><span class="eyebrow">Реальный процесс</span><h3>Как выглядит приготовление</h3></div><span>${mediaItems.length} фото</span></div><div class="recipe-photo-gallery">${mediaItems.map(photoFigure).join('')}</div>`;
    modal.insertAdjacentElement('afterend', gallery);
  }

  const stock = sheet.querySelector('.modal-stock');
  if (stock) stock.insertAdjacentHTML('afterend', sourceCard(recipe));

  const safety = sheet.querySelector('.modal-safety');
  if (safety) safety.insertAdjacentHTML('beforebegin', temperatureCard(recipe));
}

function upgrade(root = document) {
  decorateRecipeCards(root);
  decorateRecipeModal(root);
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-action="open-recipe"][data-id]');
  if (trigger) lastRecipeId = trigger.dataset.id;
}, true);

const observer = new MutationObserver(() => upgrade());
observer.observe(document.documentElement, { childList:true, subtree:true });
upgrade();
