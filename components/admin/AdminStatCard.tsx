type StatCardProps = {
  label: string;
  value: string | number;
  sublabel?: string;
  accent?: "purple" | "orange" | "green" | "blue";
};

const accentMap = {
  purple: "from-purple-500 to-pink-500 text-white",
  orange: "from-orange-400 to-amber-500 text-white",
  green: "from-emerald-400 to-green-500 text-white",
  blue: "from-sky-400 to-blue-500 text-white",
};

export function AdminStatCard({ label, value, sublabel, accent = "purple" }: StatCardProps) {
  const gradient = accentMap[accent] ?? accentMap.purple;
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 space-y-2">
      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${gradient}`}>
        {label}
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {sublabel && <p className="text-sm text-slate-600">{sublabel}</p>}
    </div>
  );
}

export default AdminStatCard;
