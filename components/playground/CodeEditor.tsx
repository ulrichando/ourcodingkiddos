import React, { useEffect, useState } from "react";
import Button from "../ui/button";
import { Play, RotateCcw, Copy, Check, Loader2 } from "lucide-react";

type Props = {
  initialCode?: string;
  language?: "html" | "css" | "javascript" | "python" | "roblox" | "engineering" | "ai_ml" | "robotics" | "web_development" | "mobile_development" | "game_development" | "career_prep";
  onRun?: (code: string) => void;
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
  showPreview?: boolean;
  theme?: "dark" | "light";
};

const languageColors: Record<NonNullable<Props["language"]>, string> = {
  html: "from-orange-500 to-red-500",
  css: "from-blue-500 to-cyan-500",
  javascript: "from-yellow-500 to-amber-500",
  python: "from-green-500 to-emerald-500",
  roblox: "from-red-500 to-pink-500",
  engineering: "from-slate-500 to-zinc-600",
  ai_ml: "from-purple-500 to-fuchsia-600",
  robotics: "from-cyan-500 to-teal-600",
  web_development: "from-indigo-500 to-blue-600",
  mobile_development: "from-pink-500 to-rose-600",
  game_development: "from-emerald-500 to-green-600",
  career_prep: "from-amber-500 to-orange-600",
};

// Pyodide instance cache
let pyodideInstance: any = null;
let pyodideLoading = false;
let pyodideLoadPromise: Promise<any> | null = null;

async function loadPyodideInternal(): Promise<any> {
  // Load Pyodide script if not already loaded
  if (!(window as any).loadPyodide) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
    script.async = true;
    await new Promise<void>((res, rej) => {
      script.onload = () => res();
      script.onerror = () => rej(new Error("Failed to load Pyodide"));
      document.head.appendChild(script);
    });
  }

  // Initialize Pyodide
  return (window as any).loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
  });
}

async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoadPromise) return pyodideLoadPromise;

  pyodideLoading = true;
  pyodideLoadPromise = loadPyodideInternal()
    .then((instance) => {
      pyodideInstance = instance;
      pyodideLoading = false;
      return instance;
    })
    .catch((error) => {
      pyodideLoading = false;
      throw error;
    });

  return pyodideLoadPromise;
}

export default function CodeEditor({
  initialCode = "",
  language = "html",
  onRun,
  onCodeChange,
  readOnly = false,
  showPreview = true,
  theme = "light",
}: Props) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [pythonOutput, setPythonOutput] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);
  const [pythonError, setPythonError] = useState<string | null>(null);

  const isDark = theme === "dark";

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  // Preload Pyodide when Python tab is selected
  useEffect(() => {
    if (language === "python" && !pyodideInstance && !pyodideLoading) {
      setIsPyodideLoading(true);
      loadPyodide()
        .then(() => setIsPyodideLoading(false))
        .catch(() => setIsPyodideLoading(false));
    }
  }, [language]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const runPython = async () => {
    setIsRunning(true);
    setPythonOutput([]);
    setPythonError(null);

    try {
      if (!pyodideInstance) {
        setIsPyodideLoading(true);
        await loadPyodide();
        setIsPyodideLoading(false);
      }

      // Capture print output
      const outputs: string[] = [];
      pyodideInstance.setStdout({
        batched: (text: string) => {
          outputs.push(text);
        },
      });
      pyodideInstance.setStderr({
        batched: (text: string) => {
          outputs.push(`Error: ${text}`);
        },
      });

      // Run the Python code
      await pyodideInstance.runPythonAsync(code);

      setPythonOutput(outputs);
    } catch (error: any) {
      setPythonError(error.message || "An error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  const runCode = () => {
    if (language === "python") {
      runPython();
      onRun?.(code);
      return;
    }

    setIsRunning(true);

    if (language === "html" || language === "css" || language === "javascript") {
      let html = code;

      if (language === "css") {
        html = `<style>${code}</style><div class="preview">Preview Area</div>`;
      } else if (language === "javascript") {
        html = `
          <div id="output" style="font-family: monospace; padding: 16px;"></div>
          <script>
            const originalLog = console.log;
            console.log = function(...args) {
              const output = document.getElementById('output');
              output.innerHTML += args.map(a =>
                typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
              ).join(' ') + '<br>';
              originalLog.apply(console, args);
            };
            try {
              ${code}
            } catch(e) {
              document.getElementById('output').innerHTML += '<span style="color:red">Error: ' + e.message + '</span>';
            }
          </script>
        `;
      }

      setOutput(html);
    }

    setTimeout(() => setIsRunning(false), 500);
    onRun?.(code);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput("");
    setPythonOutput([]);
    setPythonError(null);
  };

  return (
    <div className={`rounded-xl sm:rounded-2xl overflow-hidden border shadow-xl transition-colors duration-300 ${
      isDark
        ? "border-slate-900 bg-[#0a1326]"
        : "border-slate-200 bg-white"
    }`}>
      {/* Header with language color gradient */}
      <div className={`flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r ${languageColors[language]}`}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 sm:gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-white/90 font-medium ml-1 sm:ml-2 uppercase text-xs sm:text-sm">{language}</span>
          {language === "python" && isPyodideLoading && (
            <span className="text-white/70 text-xs flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading Python...
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 p-1.5 sm:p-2" onClick={copyCode} title="Copy">
            {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 p-1.5 sm:p-2" onClick={resetCode} title="Reset">
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
          <Button
            size="sm"
            className="bg-white text-slate-900 hover:bg-slate-100 px-2 sm:px-3"
            onClick={runCode}
            disabled={isRunning || (language === "python" && isPyodideLoading)}
          >
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1" />
            )}
            <span className="hidden sm:inline">Run</span>
          </Button>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className={`grid grid-cols-1 md:grid-cols-2 md:divide-x transition-colors duration-300 ${
        isDark ? "divide-slate-700" : "divide-slate-200"
      }`}>
        {/* Code Editor */}
        <div className={`relative border-b md:border-b-0 transition-colors duration-300 ${
          isDark ? "border-slate-700" : "border-slate-200"
        }`}>
          {/* Line Numbers */}
          <div className={`absolute left-0 top-0 bottom-0 w-8 sm:w-12 flex flex-col items-center pt-3 sm:pt-4 text-[10px] sm:text-xs font-mono transition-colors duration-300 ${
            isDark
              ? "bg-slate-800 text-slate-500"
              : "bg-slate-100 text-slate-400"
          }`}>
            {code.split("\n").map((_, i) => (
              <div key={i} className="h-5 sm:h-6 flex items-center">
                {i + 1}
              </div>
            ))}
          </div>
          {/* Textarea */}
          <textarea
            value={code}
            onChange={handleCodeChange}
            readOnly={readOnly}
            className={`w-full h-64 sm:h-80 md:h-96 pl-10 sm:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 font-mono text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors duration-300 ${
              isDark
                ? "bg-slate-900 text-slate-100"
                : "bg-white text-slate-800"
            }`}
            spellCheck={false}
            placeholder="Write your code here..."
          />
        </div>

        {/* Preview Panel */}
        {showPreview && language !== "python" && (
          <div className="bg-white h-64 sm:h-80 md:h-96 overflow-auto">
            <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-100 border-b border-slate-200 text-[10px] sm:text-xs font-medium text-slate-500">
              Preview
            </div>
            {output ? (
              <iframe
                srcDoc={output}
                className="w-full h-[calc(100%-2rem)] sm:h-[calc(100%-2.5rem)] border-0"
                sandbox="allow-scripts"
                title="Code Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-[calc(100%-2rem)] sm:h-[calc(100%-2.5rem)] text-slate-400 text-xs sm:text-sm px-4 text-center">
                Click &quot;Run&quot; to see the output
              </div>
            )}
          </div>
        )}

        {/* Python Output Panel */}
        {language === "python" && (
          <div className={`h-64 sm:h-80 md:h-96 overflow-auto ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
            <div className={`px-2 sm:px-3 py-1.5 sm:py-2 border-b text-[10px] sm:text-xs font-medium sticky top-0 ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-400"
                : "bg-slate-100 border-slate-200 text-slate-500"
            }`}>
              Python Output
            </div>
            <div className="p-3 sm:p-4 font-mono text-xs sm:text-sm">
              {isPyodideLoading && !pythonOutput.length && !pythonError && (
                <div className={`flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading Python environment...
                </div>
              )}
              {!isPyodideLoading && !pythonOutput.length && !pythonError && (
                <div className={isDark ? "text-slate-500" : "text-slate-400"}>
                  Click &quot;Run&quot; to execute your Python code
                </div>
              )}
              {pythonOutput.map((line, i) => (
                <div key={i} className={`${isDark ? "text-green-400" : "text-green-600"}`}>
                  {line}
                </div>
              ))}
              {pythonError && (
                <div className="text-red-500 whitespace-pre-wrap">
                  {pythonError}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
