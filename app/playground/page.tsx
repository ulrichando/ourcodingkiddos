export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Code Playground</h1>
            <p className="text-slate-300 text-sm">Experiment with HTML, CSS, JavaScript, and Python.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <span className="px-3 py-1 rounded-full bg-slate-800">HTML</span>
            <span className="px-3 py-1 rounded-full bg-slate-800">CSS</span>
            <span className="px-3 py-1 rounded-full bg-slate-800">JavaScript</span>
            <span className="px-3 py-1 rounded-full bg-slate-800">Python</span>
          </div>
        </header>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-2xl">
          <div className="flex justify-between items-center mb-3 text-sm text-slate-300">
            <div>HTML</div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs">
                Run
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <pre className="bg-slate-950 rounded-xl p-4 text-sm leading-6 overflow-auto border border-slate-800">
{`<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, World! 🚀</h1>
    <p>Welcome to coding!</p>
    <button onclick="alert('You clicked me!')">Click Me!</button>
  </body>
</html>`}
            </pre>
            <div className="bg-white text-slate-900 rounded-xl p-4 flex items-center justify-center border border-slate-200">
              <p className="text-slate-500 text-sm">Preview area</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex gap-2 text-xs text-slate-200 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-slate-800">HTML Tips</span>
            <span className="px-3 py-1 rounded-full bg-slate-800">CSS Tips</span>
            <span className="px-3 py-1 rounded-full bg-slate-800">JS Tips</span>
          </div>
          <div className="grid md:grid-cols-4 gap-3">
            {[
              { title: "My First Website", tag: "HTML" },
              { title: "Rainbow Buttons", tag: "CSS" },
              { title: "Number Guessing Game", tag: "JavaScript" },
              { title: "Hello Python", tag: "Python" },
            ].map((item) => (
              <div key={item.title} className="bg-slate-800 rounded-xl p-3">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-slate-400">{item.tag}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
