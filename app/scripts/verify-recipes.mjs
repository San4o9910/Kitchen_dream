import { recipes, mealPlan, freezerSeed } from '../src/data.js';
import { appliedRecipePatchCount } from '../src/recipe-corrections.js';
import { bookSources, mediaLibrary } from '../src/recipe-library.js';

const failures = [];
const fail = (message) => failures.push(message);

if (recipes.length !== 20) fail(`Ожидалось 20 рецептов, найдено ${recipes.length}`);
if (appliedRecipePatchCount !== 20) fail(`Применено ${appliedRecipePatchCount} источниковых обновлений вместо 20`);

const ids = recipes.map((recipe) => recipe.id);
if (new Set(ids).size !== ids.length) fail('Обнаружены повторяющиеся ID рецептов');

for (const recipe of recipes) {
  if (!recipe.source?.book || !bookSources[recipe.source.book]) {
    fail(`${recipe.id}: не указана основная книга`);
  }
  if (!recipe.source?.technique || !bookSources[recipe.source.technique]) {
    fail(`${recipe.id}: не указан источник техники`);
  }
  if (!recipe.source?.note || recipe.source.note.length < 40) {
    fail(`${recipe.id}: отсутствует понятное описание адаптации`);
  }
  if (!Array.isArray(recipe.photos) || recipe.photos.length < 2) {
    fail(`${recipe.id}: требуется минимум 2 реальных фото процесса`);
  } else {
    for (const photoKey of recipe.photos) {
      const media = mediaLibrary[photoKey];
      if (!media) {
        fail(`${recipe.id}: неизвестное фото ${photoKey}`);
        continue;
      }
      if (!media.url.includes('wikimedia.org')) fail(`${recipe.id}: фото ${photoKey} не из проверенной открытой медиатеки`);
      if (!media.author || !media.license || !media.source) fail(`${recipe.id}: у фото ${photoKey} неполная атрибуция`);
    }
  }
  if (!recipe.safeTemperature) fail(`${recipe.id}: не указана безопасная температура`);
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length < 5) fail(`${recipe.id}: неполный список ингредиентов`);
  if (!Array.isArray(recipe.steps) || recipe.steps.length < 5) fail(`${recipe.id}: рецепт должен содержать минимум 5 шагов`);
  if (!recipe.prep?.title || !recipe.prep?.pack || !recipe.prep?.label) fail(`${recipe.id}: неполная карточка заготовки`);
  if (!recipe.storage) fail(`${recipe.id}: отсутствует правило хранения`);
}

for (const [key, book] of Object.entries(bookSources)) {
  if (!/^4,[0-9]{2}\/5$/.test(book.rating)) fail(`Книга ${key}: некорректный формат рейтинга`);
  if (!book.url.includes('goodreads.com')) fail(`Книга ${key}: источник рейтинга должен вести на Goodreads`);
}

const recipeIdSet = new Set(ids);
for (const day of mealPlan) {
  if (!recipeIdSet.has(day.lunch)) fail(`День ${day.day}: неизвестный рецепт обеда ${day.lunch}`);
  if (!recipeIdSet.has(day.dinner)) fail(`День ${day.day}: неизвестный рецепт ужина ${day.dinner}`);
}

for (const item of freezerSeed) {
  if (item.recipeId && !recipeIdSet.has(item.recipeId)) fail(`Морозильник ${item.id}: неизвестный рецепт ${item.recipeId}`);
}

if (failures.length) {
  console.error('Recipe audit failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Recipe audit passed: ${recipes.length} рецептов, ${Object.keys(bookSources).length} книг и ${Object.keys(mediaLibrary).length} лицензированных фото проверено.`);
