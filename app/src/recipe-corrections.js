import { recipes, freezerSeed, prepTasks, shoppingGroups } from './data.js';
import { recipePatchesA } from './recipe-patches-a.js';
import { recipePatchesB } from './recipe-patches-b.js';
import { recipePatchesC } from './recipe-patches-c.js';
import { recipePatchesD } from './recipe-patches-d.js';

const patches = [...recipePatchesA, ...recipePatchesB, ...recipePatchesC, ...recipePatchesD];
const recipeMap = new Map(recipes.map((recipe) => [recipe.id, recipe]));

for (const patch of patches) {
  const recipe = recipeMap.get(patch.id);
  if (!recipe) throw new Error(`Не найден рецепт для обновления: ${patch.id}`);
  Object.assign(recipe, patch);
}

const freezerCorrections = {
  'plov-base': { name:'Готовый зирвак для плова', category:'Готовое', quantity:1, portions:6, daysLeft:90 },
  'chicken-thighs-base': { name:'Подрумяненная куриная основа', category:'Готовое', quantity:1, portions:6, daysLeft:75 },
  'goulash-base': { name:'Готовая основа свиного гуляша', category:'Готовое', quantity:1, portions:6, daysLeft:90 },
  'chicken-cutlets': { name:'Куриные котлеты с панадой', category:'Котлеты', quantity:6, portions:24, daysLeft:90 },
  'tomato-chicken-base': { name:'Курино-томатный соус', category:'Готовое', quantity:3, unit:'пакета', portions:6, daysLeft:75 },
  'pollock-pack': { name:'Минтай + овощная основа', category:'Рыба', quantity:3, unit:'пакета', portions:6, daysLeft:60 },
  'lazy-cabbage-ready': { name:'Ленивые голубцы в соусе', category:'Готовое', quantity:3, unit:'контейнера', portions:6, daysLeft:60 },
  'liver-pack': { name:'Печень + карамелизованный лук', category:'Субпродукты', quantity:2, unit:'пакета', portions:6, daysLeft:45 },
  'soup-base': { name:'Концентрированный куриный бульон', category:'Готовое', quantity:3, unit:'контейнера', portions:10, daysLeft:75 },
  'pork-roast-base': { name:'Тушёная основа жаркого', category:'Готовое', quantity:1, portions:6, daysLeft:85 },
  'meatballs': { name:'Тефтели с панадой', category:'Фарш', quantity:3, unit:'пакета', portions:18, daysLeft:90 },
  'chicken-cabbage-base': { name:'Куриная томатная основа', category:'Готовое', quantity:1, portions:6, daysLeft:80 },
  'merchant-base': { name:'Курица с грибами для гречки', category:'Готовое', quantity:1, portions:6, daysLeft:80 },
  'pollock-sour-pack': { name:'Минтай + овощная основа для соуса', category:'Рыба', quantity:3, unit:'пакета', portions:6, daysLeft:60 },
  'chicken-rice-base': { name:'Подрумяненная курица для риса', category:'Готовое', quantity:1, portions:6, daysLeft:85 },
  'meat-cutlets': { name:'Домашние мясные котлеты', category:'Котлеты', quantity:3, unit:'пакета', portions:12, daysLeft:90 },
  'chicken-roast-base': { name:'Готовое чахохбили', category:'Готовое', quantity:3, unit:'контейнера', portions:6, daysLeft:70 },
  'navy-mince': { name:'Мясная основа по-флотски', category:'Готовое', quantity:3, unit:'пакета', portions:6, daysLeft:60 },
  'pork-cabbage-base': { name:'Тушёная свиная основа', category:'Готовое', quantity:1, portions:6, daysLeft:85 }
};

for (const item of freezerSeed) {
  Object.assign(item, freezerCorrections[item.id] || {});
}

const prepTaskCorrections = {
  vegetables: {
    title:'Подготовить овощи для соусов и основ',
    detail:'Нарезать лук, морковь, сельдерей и грибы; сначала работать только с овощами.'
  },
  cutlets: {
    title:'Сформировать котлеты и тефтели с панадой',
    detail:'Соблюдать точный вес, подморозить на подносе и только затем вакуумировать.'
  },
  'ready-meals': {
    title:'Приготовить готовые основы и блюда',
    detail:'Зирвак, гуляш, соусы, бульон, голубцы, чахохбили и мясные основы быстро охладить.'
  },
  vacuum: {
    title:'Упаковать охлаждённые основы и полуфабрикаты',
    detail:'Горячую еду не вакуумировать. Шов оставить сухим, пакеты сделать плоскими.'
  },
  freeze: {
    title:'Немедленно заморозить всю месячную партию',
    detail:'Сырые и готовые пакеты разнести по ящикам; холодильник использовать только для разморозки.'
  }
};

for (const task of prepTasks) {
  Object.assign(task, prepTaskCorrections[task.id] || {});
}

if (!prepTasks.some((task) => task.id === 'brown-bases')) {
  prepTasks.splice(4, 0, {
    id:'brown-bases',
    phase:'Тепловая подготовка',
    title:'Подрумянить мясо и приготовить ароматные основы',
    detail:'Работать небольшими партиями, затем быстро охлаждать в неглубоких ёмкостях.'
  });
}

const replacementShopping = [
  {name:'Мясо и рыба',icon:'🥩',items:[['Курица, бёдра и куриный фарш','около 11 кг'],['Свиная лопатка','3 кг'],['Смешанный фарш','2,7 кг'],['Куриная печень','1 кг'],['Минтай','2,4 кг']]},
  {name:'Крупы, хлеб и паста',icon:'🌾',items:[['Рис длиннозёрный','2,3 кг'],['Гречка','1,8 кг'],['Макароны и лапша','1,8 кг'],['Белый хлеб для панады','450 г']]},
  {name:'Овощи и зелень',icon:'🥕',items:[['Картофель','10–11 кг'],['Капуста','3,8 кг'],['Лук','6–7 кг'],['Морковь','4 кг'],['Шампиньоны','350 г'],['Сельдерей','300 г'],['Замороженные овощи','1,6 кг'],['Чеснок','5 головок'],['Укроп, петрушка и кинза','около 150 г'],['Лимоны','2 шт.']]},
  {name:'Молочное и яйца',icon:'🥚',items:[['Молоко','600 мл'],['Сметана','800 г'],['Сливочное масло','250 г'],['Яйца','4 шт.']]},
  {name:'Соусы, специи и упаковка',icon:'🫙',items:[['Протёртые томаты','3,5–4 кг'],['Томатная паста','400 г'],['Растительное масло','1 л'],['Зира, кориандр, паприка, хмели-сунели, тмин','по 1 упаковке'],['Бульон или продукты для бульона','около 5 л'],['Вакуумные пакеты и контейнеры','35–40 шт.'],['Этикетки или маркер','1 комплект'],['Кухонный термометр','1 шт.']]}
];

shoppingGroups.splice(0, shoppingGroups.length, ...replacementShopping);

export const appliedRecipePatchCount = patches.length;
