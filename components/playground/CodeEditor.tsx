import React, { useEffect, useState } from "react";
import Button from "../ui/button";
import { Play, RotateCcw, Copy, Check } from "lucide-react";

type Props = {
  initialCode?: string;
  language?: "html" | "css" | "javascript" | "python" | "roblox";
  onRun?: (code: string) => void;
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
  showPreview?: boolean;
};

const languageColors: Record<NonNullable<Props["language"]>, string> = {
  html: "from-orange-500 to-red-500",
  css: "from-blue-500 to-cyan-500",
  javascript: "from-yellow-500 to-amber-500",
  python: "from-green-500 to-emerald-500",
  roblox: "from-red-500 to-pink-500",
};

export default function CodeEditor({
  initialCode = "",
  language = "html",
  onRun,
  onCodeChange,
  readOnly = false,
  showPreview = true,
}: Props) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const runCode = () => {
    setIsRunning(true);

    if (language === "html" || language === "css" || language === "javascript") {
      let html = code;

      if (language === "css") {
        html = `<style>${code}</style><div class="preview">Preview Area</div>`;
      } else if (language === "javascript") {
        html = `
          <div id="output"></div>
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
    } else if (language === "python") {
      setOutput(`<div class="p-4 font-mono text-sm">
        <p class="text-slate-500 mb-2"># Python output simulation</p>
        <p class="text-green-600">Code ready to run!</p>
        <p class="text-slate-400 mt-2">Note: Full Python execution requires a backend service.</p>
      </div>`);
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
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-900 shadow-xl bg-[#0a1326]">
      <div className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${languageColors[language]}`}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-white/90 font-medium ml-2 uppercase text-sm">{language}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={copyCode}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={resetCode}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            className="bg-white text-slate-900 hover:bg-slate-100"
            onClick={runCode}
            disabled={isRunning}
          >
            <Play className={`w-4 h-4 mr-1 ${isRunning ? "animate-pulse" : ""}`} />
            Run
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 divide-x divide-slate-700">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800 flex flex-col items-center pt-4 text-slate-500 text-xs font-mono">
            {code.split("\n").map((_, i) => (
              <div key={i} className="h-6 flex items-center">
                {i + 1}
              </div>
            ))}
          </div>
          <textarea
            value={code}
            onChange={handleCodeChange}
            readOnly={readOnly}
            className="w-full h-80 pl-14 pr-4 py-4 bg-slate-900 text-slate-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            spellCheck={false}
            placeholder="Write your code here..."
          />
        </div>

        {showPreview && (
          <div className="bg-white h-80 overflow-auto">
            <div className="px-3 py-2 bg-slate-100 border-b text-xs font-medium text-slate-500">Preview</div>
            {output ? (
              <iframe
                srcDoc={output}
                className="w-full h-[calc(100%-2.5rem)] border-0"
                sandbox="allow-scripts"
                title="Code Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-[calc(100%-2.5rem)] text-slate-400">
                Click "Run" to see the output
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
