import { freezerSeed } from './data.js';

const STORAGE_KEY = 'kitchen-dream-state-v1';
const TARGET_SCHEMA = '1.1.0';

try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const saved = JSON.parse(raw);
    if (saved.schemaVersion !== TARGET_SCHEMA && Array.isArray(saved.freezer)) {
      const defaults = new Map(freezerSeed.map((item) => [item.id, item]));
      saved.freezer = saved.freezer.map((item) => {
        const current = defaults.get(item.id);
        if (!current) return item;
        return {
          ...item,
          name: current.name,
          emoji: current.emoji,
          category: current.category,
          unit: current.unit,
          portions: current.portions,
          recipeId: current.recipeId
        };
      });
      saved.schemaVersion = TARGET_SCHEMA;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }
  }
} catch (error) {
  console.warn('Kitchen Dream: migration skipped', error);
}
