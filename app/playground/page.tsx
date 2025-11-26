"use client";

import { useMemo, useState } from "react";
import { Code2, Palette, FileCode, Terminal, Download, Save, FolderOpen } from "lucide-react";

const tabs = [
  { id: "html", label: "HTML", icon: Code2, color: "text-orange-400" },
  { id: "css", label: "CSS", icon: Palette, color: "text-blue-400" },
  { id: "javascript", label: "JavaScript", icon: FileCode, color: "text-yellow-400" },
  { id: "python", label: "Python", icon: Terminal, color: "text-green-400" },
];

const starterCode: Record<string, string> = {
  html: `<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Hello, World! 🚀</h1>
  <p>Welcome to coding!</p>
  <button onclick="alert('You clicked me!')">Click Me!</button>
</body>
</html>`,
  css: `body { font-family: 'Comic Sans MS', cursive; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; }
h1 { color: #667eea; font-size: 2.5em; }`,
  javascript: `console.log("Hello, coder!");\nlet score = 100;\nlet bonus = 50;\nconsole.log("Total score: " + (score + bonus));`,
  python: `print("Hello, Python coder!")\nscore = 100\nbonus = 50\nprint(f"Total score: {score + bonus}")`,
};

export default function PlaygroundPage() {
  const [projectName, setProjectName] = useState("Untitled Project");
  const [active, setActive] = useState<"html" | "css" | "javascript" | "python">("html");
  const [code, setCode] = useState<Record<string, string>>(starterCode);

  const downloadCode = () => {
    const content = code[active];
    const ext = active === "javascript" ? "js" : active === "python" ? "py" : active;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewHtml = useMemo(() => {
    if (active === "python") return "";
    const html = code.html || "";
    const css = `<style>${code.css || ""}</style>`;
    const js = active === "javascript" ? `<script>${code.javascript || ""}</script>` : "";
    return html.replace("</head>", `${css}</head>`).replace("</body>", `${js}</body>`);
  }, [active, code]);

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">
              CK
            </div>
            <div>
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-transparent text-lg font-semibold outline-none border-b border-transparent focus:border-purple-400"
              />
              <p className="text-xs text-slate-400">Code Playground</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <button className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 flex items-center gap-2">
              <FolderOpen className="h-4 w-4" /> Open
            </button>
            <button
              className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 flex items-center gap-2"
              onClick={downloadCode}
            >
              <Download className="h-4 w-4" /> Download
            </button>
            <button className="px-3 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 flex items-center gap-2">
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        </div>
      </header>

      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id as any)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 ${
                active === tab.id
                  ? "border-purple-500 text-white bg-slate-700/50"
                  : "border-transparent text-slate-400 hover:text-white"
              } flex items-center gap-2`}
            >
              <tab.icon className={`h-4 w-4 ${tab.color}`} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              value={code[active]}
              onChange={(e) => setCode((prev) => ({ ...prev, [active]: e.target.value }))}
              className="w-full h-[320px] bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-mono outline-none focus:border-purple-500"
            />
            <div className="bg-white text-slate-900 rounded-xl p-4 border border-slate-200 overflow-auto">
              {active === "python" ? (
                <p className="text-slate-500 text-sm">Preview not available for Python.</p>
              ) : (
                <iframe
                  className="w-full h-[320px] rounded-lg border border-slate-200"
                  srcDoc={previewHtml}
                  title="Preview"
                />
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex gap-2 text-xs text-slate-200 flex-wrap mb-3">
            <span className="px-3 py-1 rounded-full bg-slate-800">HTML Tips</span>
            <span className="px-3 py-1 rounded-full bg-slate-800">CSS Tips</span>
            <span className="px-3 py-1 rounded-full bg-slate-800">JS Tips</span>
          </div>
          <div className="grid md:grid-cols-4 gap-3 text-sm">
            {[
              { title: "My First Website", tag: "HTML" },
              { title: "Rainbow Buttons", tag: "CSS" },
              { title: "Number Guessing Game", tag: "JavaScript" },
              { title: "Hello Python", tag: "Python" },
            ].map((item) => (
              <div key={item.title} className="bg-slate-800 rounded-xl p-3 cursor-pointer hover:border-purple-400 border border-transparent">
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-slate-400">{item.tag}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
