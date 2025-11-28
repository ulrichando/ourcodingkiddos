export default function LoadingCourse() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
        <div className="h-10 w-80 bg-slate-200 rounded animate-pulse" />
        <div className="h-6 w-2/3 bg-slate-200 rounded animate-pulse" />
        <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
        <div className="h-64 w-full bg-white border border-slate-100 rounded-2xl shadow-sm" />
      </div>
    </main>
  );
}
