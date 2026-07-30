import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChefHat, Snowflake, CalendarDays } from 'lucide-react';
import './style.css';

function App() {
  return (
    <main className="dashboard">
      <header>
        <h1>🍳 Kitchen Dream</h1>
        <p>Семейная система питания</p>
      </header>

      <section className="card today">
        <ChefHat />
        <div>
          <h2>Сегодня</h2>
          <p>Куриные котлеты с гречкой</p>
          <small>Достать пакет №024 из морозилки</small>
        </div>
      </section>

      <section className="card">
        <Snowflake />
        <div>
          <h2>Морозилка</h2>
          <p>32 заготовки · 18 полуфабрикатов</p>
        </div>
      </section>

      <section className="card">
        <CalendarDays />
        <div>
          <h2>Следующая заготовка</h2>
          <p>Через 14 дней</p>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
