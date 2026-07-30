export default function FreezerCard({ item }) {
  return (
    <div className="card freezer-card">
      <div className="icon">❄️</div>
      <div>
        <h3>{item.name}</h3>
        <p>{item.quantity} {item.unit}</p>
        <span className="status">{item.status}</span>
      </div>
    </div>
  );
}
