"use client";

import { useMemo, useState } from "react";
import { Code2, Palette, FileCode, Terminal, Download, Save, FolderOpen } from "lucide-react";
import CodeEditor from "../../components/playground/CodeEditor";
import Button from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

const languageTabs = [
  { id: "html", label: "HTML", icon: Code2, color: "text-orange-500" },
  { id: "css", label: "CSS", icon: Palette, color: "text-blue-500" },
  { id: "javascript", label: "JavaScript", icon: FileCode, color: "text-yellow-500" },
  { id: "python", label: "Python", icon: Terminal, color: "text-green-500" },
];

const starterCode: Record<string, string> = {
  html: `<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Hello, World! 🌍</h1>
  <p>Welcome to coding!</p>
  
  <button onclick="alert('You clicked me!')">
    Click Me!
  </button>
</body>
</html>`,
  css: `/* Style your page! */
body {
  font-family: 'Comic Sans MS', cursive;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center;
}

h1 {
  color: #667eea;
  font-size: 2.5em;
}`,
  javascript: `// JavaScript is fun! 🎉

console.log("Hello, coder!");
let myName = "Super Coder";
console.log("My name is: " + myName);

let score = 100;
let bonus = 50;
let total = score + bonus;
console.log("Total score: " + total);

function celebrate() {
  console.log("🎉 You're doing great! 🎉");
}

celebrate();`,
  python: `# Python is awesome! 🐍

print("Hello, Python coder!")

name = "Super Coder"
age = 10
print(f"I'm {name} and I'm {age} years old!")

score = 100
bonus = 50
total = score + bonus
print(f"Total score: {total}")

def celebrate():
    print("🎉 You're doing great! 🎉")

celebrate()`,
};

export default function PlaygroundPage() {
  const [projectName, setProjectName] = useState("Untitled Project");
  const [activeLanguage, setActiveLanguage] = useState<"html" | "css" | "javascript" | "python">("html");
  const [code, setCode] = useState<Record<string, string>>(starterCode);

  const previewHtml = useMemo(() => {
    if (activeLanguage === "python") return "";
    const html = code.html || "";
    const css = `<style>${code.css || ""}</style>`;
    const js = activeLanguage === "javascript" ? `<script>${code.javascript || ""}</script>` : "";
    return html.replace("</head>", `${css}</head>`).replace("</body>", `${js}</body>`);
  }, [activeLanguage, code]);

  const handleDownload = () => {
    const ext = activeLanguage === "javascript" ? "js" : activeLanguage === "python" ? "py" : activeLanguage;
    const blob = new Blob([code[activeLanguage]], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#080d18] via-[#0a1020] to-[#050812] text-white">
      {/* Header */}
      <header className="bg-[#080d18] border-b border-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              CK
            </div>
            <div>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-transparent text-white text-lg font-semibold border-none outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
              />
              <p className="text-slate-400 text-sm">Code Playground</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white">
              <FolderOpen className="w-4 h-4 mr-2" />
              Open
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-[#121a2f] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap">
          {languageTabs.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveLanguage(lang.id as any)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 ${
                activeLanguage === lang.id
                  ? "border-purple-400 text-white bg-slate-800/70"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <lang.icon className={`w-4 h-4 ${lang.color}`} />
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <CodeEditor
          initialCode={code[activeLanguage]}
          language={activeLanguage}
          onCodeChange={(val) => setCode((prev) => ({ ...prev, [activeLanguage]: val }))}
          showPreview={activeLanguage !== "python"}
        />

        {/* Tips */}
        <Card className="mt-2 bg-[#111a2e] border-slate-800">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-3">💡 {activeLanguage.toUpperCase()} Tips</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
              {activeLanguage === "html" && (
                <>
                  <div className="p-3 rounded-lg bg-[#1b2438]">
                    <code className="text-orange-400">&lt;h1&gt;</code> makes big headings
                  </div>
                  <div className="p-3 rounded-lg bg-[#1b2438]">
                    <code className="text-orange-400">&lt;p&gt;</code> creates paragraphs
                  </div>
                  <div className="p-3 rounded-lg bg-[#1b2438]">
                    <code className="text-orange-400">&lt;img&gt;</code> adds pictures
                  </div>
                </>
              )}
              {activeLanguage === "css" && (
                <>
                  <div className="p-3 rounded-lg bg-[#1b2438]">
                    <code className="text-blue-400">color:</code> changes text color
                  </div>
                  <div className="p-3 rounded-lg bg-[#1b2438]">
                    <code className="text-blue-400">background:</code> sets backgrounds
                  </div>
                  <div className="p-3 rounded-lg bg-[#1b2438]">
                    <code className="text-blue-400">font-size:</code> changes text size
                  </div>
                </>
              )}
              {activeLanguage === "javascript" && (
                <>
                  <div className="p-3 rounded-lg bg-[#1b2438]">
                    <code className="text-yellow-400">console.log()</code> prints messages
                  </div>
                  <div className="p-3 rounded-lg bg-[#1b2438]">
                    <code className="text-yellow-400">let x = 5</code> creates variables
                  </div>
                  <div className="p-3 rounded-lg bg-[#1b2438]">
                    <code className="text-yellow-400">function</code> creates reusable code
                  </div>
                </>
              )}
              {activeLanguage === "python" && (
                <>
                  <div className="p-3 rounded-lg bg-[#1b2438]">
                    <code className="text-green-400">print()</code> shows output
                  </div>
                  <div className="p-3 rounded-lg bg-[#1b2438]">
                    <code className="text-green-400">x = 5</code> creates variables
                  </div>
                  <div className="p-3 rounded-lg bg-[#1b2438]">
                    <code className="text-green-400">def</code> creates functions
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">🚀 Try These Examples</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "My First Website", lang: "html", emoji: "🌐" },
              { name: "Rainbow Buttons", lang: "css", emoji: "🌈" },
              { name: "Number Guessing Game", lang: "javascript", emoji: "🎲" },
              { name: "Hello Python", lang: "python", emoji: "🐍" },
            ].map((example) => (
              <Card
                key={example.name}
                className="bg-[#111a2e] border-slate-800 hover:border-purple-500 transition-colors cursor-pointer"
                onClick={() => {
                  setActiveLanguage(example.lang as any);
                  setProjectName(example.name);
                }}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{example.emoji}</div>
                  <p className="font-medium text-white">{example.name}</p>
                  <p className="text-xs text-slate-400 uppercase">{example.lang}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
