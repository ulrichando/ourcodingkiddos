type Props = {
  value: number; // 0-100
  label?: string;
};

export function ProgressBar({ value, label }: Props) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1">
      {label && <p className="text-xs text-slate-600">{label}</p>}
      <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-blue-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>
      <p className="text-xs font-semibold text-slate-700">{safeValue}%</p>
    </div>
  );
}

export default ProgressBar;
