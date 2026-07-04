export default function StatCard({ title, value, valueColor = "text-gray-800" }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-gray-500 text-sm font-semibold uppercase">{title}</h3>
      {/* We use template literals to dynamically inject the color prop */}
      <p className={`text-5xl font-black mt-2 ${valueColor}`}>{value}</p>
    </div>
  );
}