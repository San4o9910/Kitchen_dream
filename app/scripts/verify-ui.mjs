import { readFileSync } from 'node:fs';

const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const hotfix = readFileSync(new URL('../src/ui-hotfix.js', import.meta.url), 'utf8');

const renderedActions = new Set([...main.matchAll(/data-action="([a-z0-9-]+)"/g)].map((match) => match[1]));
const handledActions = new Set([...main.matchAll(/action === '([a-z0-9-]+)'/g)].map((match) => match[1]));
const missingActions = [...renderedActions].filter((action) => !handledActions.has(action));

if (missingActions.length) {
  throw new Error(`Кнопки без обработчиков: ${missingActions.join(', ')}`);
}

const renderedScreens = new Set([...main.matchAll(/data-screen="([a-z0-9-]+)"/g)].map((match) => match[1]));
const supportedScreens = new Set(['home', 'freezer', 'plan', 'recipes', 'prep']);
const missingScreens = [...renderedScreens].filter((screen) => !supportedScreens.has(screen));

if (missingScreens.length) {
  throw new Error(`Неизвестные экраны: ${missingScreens.join(', ')}`);
}

if (!index.includes('/src/ui-hotfix.js')) {
  throw new Error('Модуль исправления UI не подключён в index.html');
}

if (!hotfix.includes("removeAttribute('onclick')") || !hotfix.includes("removeAttribute('data-action')")) {
  throw new Error('Защита интерактивности модальных окон неполная');
}

console.log(`UI audit passed: ${renderedActions.size} действий и ${renderedScreens.size} экранов проверено.`);
