export default function MealCard({ meal }) {
  return (
    <div className="card meal-card">
      <h3>{meal.title}</h3>
      <p>{meal.time}</p>
      <p>❄️ {meal.freezer}</p>
    </div>
  );
}
