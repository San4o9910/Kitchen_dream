import { Home, Snowflake, CalendarDays, BookOpen, Package } from 'lucide-react';

const items = [
  ['Главная', Home],
  ['Морозилка', Snowflake],
  ['Меню', CalendarDays],
  ['Рецепты', BookOpen],
  ['Заготовки', Package]
];

export default function BottomNavigation() {
  return (
    <nav className="bottom-nav">
      {items.map(([label, Icon]) => (
        <button key={label}>
          <Icon size={22} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
