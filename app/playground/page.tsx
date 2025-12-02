"use client";

import { useState } from "react";
import { Code2, Palette, FileCode, Terminal, Download, Save, FolderOpen, Sun, Moon } from "lucide-react";
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
  const [theme, setTheme] = useState<"dark" | "light">("light");

  const isDark = theme === "dark";

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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? "bg-gradient-to-b from-[#080d18] via-[#0a1020] to-[#050812] text-white"
        : "bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900"
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${
        isDark
          ? "bg-[#080d18] border-slate-900/60"
          : "bg-white border-slate-200 shadow-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
              CK
            </div>
            <div className="min-w-0 flex-1">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={`bg-transparent text-sm sm:text-lg font-semibold border-none outline-none focus:ring-2 focus:ring-purple-500 rounded px-1 sm:px-2 py-1 w-full max-w-xs transition-colors ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              />
              <p className={`text-xs sm:text-sm hidden sm:block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Code Playground
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 ${isDark ? "text-slate-200 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`hidden md:flex ${isDark ? "text-slate-200 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              <span className="hidden lg:inline">Open</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`p-2 ${isDark ? "text-slate-200 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
              onClick={handleDownload}
              title="Download"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Download</span>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2">
              <Save className="w-4 h-4" />
              <span className="hidden md:inline ml-2">Save</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className={`border-b overflow-x-auto transition-colors duration-300 ${
        isDark
          ? "bg-[#121a2f] border-slate-800"
          : "bg-slate-50 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex">
          {languageTabs.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveLanguage(lang.id as any)}
              className={`px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap transition-colors ${
                activeLanguage === lang.id
                  ? isDark
                    ? "border-purple-400 text-white bg-slate-800/70"
                    : "border-purple-500 text-purple-700 bg-white"
                  : isDark
                    ? "border-transparent text-slate-400 hover:text-white"
                    : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <lang.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${lang.color}`} />
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <CodeEditor
          initialCode={code[activeLanguage]}
          language={activeLanguage}
          onCodeChange={(val) => setCode((prev) => ({ ...prev, [activeLanguage]: val }))}
          showPreview={activeLanguage !== "python"}
          theme={theme}
        />

        {/* Tips */}
        <Card className={`mt-2 transition-colors duration-300 ${
          isDark
            ? "bg-[#111a2e] border-slate-800"
            : "bg-white border-slate-200 shadow-sm"
        }`}>
          <CardContent className="p-6">
            <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              💡 {activeLanguage.toUpperCase()} Tips
            </h3>
            <div className={`grid md:grid-cols-3 gap-4 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {activeLanguage === "html" && (
                <>
                  <div className={`p-3 rounded-lg ${isDark ? "bg-[#1b2438]" : "bg-orange-50 border border-orange-100"}`}>
                    <code className="text-orange-500">&lt;h1&gt;</code> makes big headings
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? "bg-[#1b2438]" : "bg-orange-50 border border-orange-100"}`}>
                    <code className="text-orange-500">&lt;p&gt;</code> creates paragraphs
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? "bg-[#1b2438]" : "bg-orange-50 border border-orange-100"}`}>
                    <code className="text-orange-500">&lt;img&gt;</code> adds pictures
                  </div>
                </>
              )}
              {activeLanguage === "css" && (
                <>
                  <div className={`p-3 rounded-lg ${isDark ? "bg-[#1b2438]" : "bg-blue-50 border border-blue-100"}`}>
                    <code className="text-blue-500">color:</code> changes text color
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? "bg-[#1b2438]" : "bg-blue-50 border border-blue-100"}`}>
                    <code className="text-blue-500">background:</code> sets backgrounds
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? "bg-[#1b2438]" : "bg-blue-50 border border-blue-100"}`}>
                    <code className="text-blue-500">font-size:</code> changes text size
                  </div>
                </>
              )}
              {activeLanguage === "javascript" && (
                <>
                  <div className={`p-3 rounded-lg ${isDark ? "bg-[#1b2438]" : "bg-yellow-50 border border-yellow-100"}`}>
                    <code className="text-yellow-600">console.log()</code> prints messages
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? "bg-[#1b2438]" : "bg-yellow-50 border border-yellow-100"}`}>
                    <code className="text-yellow-600">let x = 5</code> creates variables
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? "bg-[#1b2438]" : "bg-yellow-50 border border-yellow-100"}`}>
                    <code className="text-yellow-600">function</code> creates reusable code
                  </div>
                </>
              )}
              {activeLanguage === "python" && (
                <>
                  <div className={`p-3 rounded-lg ${isDark ? "bg-[#1b2438]" : "bg-green-50 border border-green-100"}`}>
                    <code className="text-green-600">print()</code> shows output
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? "bg-[#1b2438]" : "bg-green-50 border border-green-100"}`}>
                    <code className="text-green-600">x = 5</code> creates variables
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? "bg-[#1b2438]" : "bg-green-50 border border-green-100"}`}>
                    <code className="text-green-600">def</code> creates functions
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <div className="space-y-3">
          <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
            🚀 Try These Examples
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "My First Website", lang: "html", emoji: "🌐" },
              { name: "Rainbow Buttons", lang: "css", emoji: "🌈" },
              { name: "Number Guessing Game", lang: "javascript", emoji: "🎲" },
              { name: "Hello Python", lang: "python", emoji: "🐍" },
            ].map((example) => (
              <Card
                key={example.name}
                className={`hover:border-purple-500 transition-colors cursor-pointer ${
                  isDark
                    ? "bg-[#111a2e] border-slate-800"
                    : "bg-white border-slate-200 shadow-sm hover:shadow-md"
                }`}
                onClick={() => {
                  setActiveLanguage(example.lang as any);
                  setProjectName(example.name);
                }}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{example.emoji}</div>
                  <p className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{example.name}</p>
                  <p className={`text-xs uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>{example.lang}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
