import React from 'react';

const cards = [
  {title:'Сегодня', text:'Куриные котлеты с гречкой', icon:'🍽'},
  {title:'Морозилка', text:'32 заготовки готовы', icon:'❄️'},
  {title:'Следующая заготовка', text:'Большая закупка через 14 дней', icon:'📦'}
];

export default function App(){
  return <main className="app">
    <h1>🍳 Kitchen Dream</h1>
    <p className="subtitle">Семейная система питания</p>
    <section className="grid">
      {cards.map(card => <article className="card" key={card.title}>
        <div className="icon">{card.icon}</div>
        <h2>{card.title}</h2>
        <p>{card.text}</p>
      </article>)}
    </section>
  </main>
}
