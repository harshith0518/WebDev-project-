import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Split from 'react-split';
import Navbar from './Navbar';
import '../App.css';
import { Editor, useMonaco } from '@monaco-editor/react';
import paths from '../paths';
import axios from 'axios';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';

const getMonacoLanguage = (lang) => {
  switch (lang) {
    case 'cpp': return 'cpp';
    case 'py': return 'python';
    // case 'java': return 'java';
    // case 'js': return 'javascript';
    case 'c': return 'c';
    default: return 'plaintext';
  }
};

const CodeIDE = () => {
  const navigate = useNavigate();
  const monaco = useMonaco();

  const [themeReady, setThemeReady] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('CodeIDE-language') || 'cpp');
  const [code, setCode] = useState(localStorage.getItem('CodeIDE-code') || '// Write your code here...');
  const [input, setInput] = useState(localStorage.getItem('CodeIDE-input') || 'Type input here...');
  const [expectedOutput, setExpectedOutput] = useState(localStorage.getItem('CodeIDE-expectedOutput') || '');
  const [output, setOutput] = useState('Output will appear here after running...');
  const [runtime, setRuntime] = useState('---');
  const [verdict, setVerdict] = useState('---');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem('CodeIDE-code', code);
  }, [code]);

  useEffect(() => {
    localStorage.setItem('CodeIDE-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('CodeIDE-input', input);
  }, [input]);

  useEffect(() => {
    localStorage.setItem('CodeIDE-expectedOutput', expectedOutput);
  }, [expectedOutput]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getValidAccessToken();
      if (!token) {
        localStorage.setItem('fall_back_page', paths.CODEIDE);
        navigate(paths.LOGIN);
      }
    };   
    checkAuth();
  }, []);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('batman-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: '', foreground: 'F8F8F2' },
          { token: 'keyword', foreground: '5665C4', fontStyle: 'italic' },
          { token: 'delimiter', foreground: 'FFD700' },
          { token: 'number', foreground: 'B5CEA8' },
          { token: 'string', foreground: 'D69D85' },
          { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
          { token: 'variable', foreground: '46A4DA' },
          { token: 'type', foreground: '4EC9B0' },
          { token: 'function', foreground: 'DCDCAA' },
        ],
        colors: {
          'editor.background': '#1E1E1E',
          'editorLineNumber.foreground': '#5A5A5A',
          'editorCursor.foreground': '#FFD700',
          'editorIndentGuide.background': '#404040',
          'editor.selectionBackground': '#264F78',
          'editor.inactiveSelectionBackground': '#3A3D41',
        }
      });
      monaco.editor.setTheme('batman-dark');
      setThemeReady(true);
    }
  }, [monaco]);

  const handleRunCode = async (e) => {
    e.preventDefault();
    setIsRunning(true);
    const token = await getValidAccessToken();
    if (!token) {
      localStorage.setItem('fall_back_page', location.pathname);
      navigate(paths.LOGIN);
      return;
    }
    try {
      const runResponse = await axios.post(
        paths.BASE+'problems/run/',
        {
          language,
          code,
          input_data: input
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setOutput(runResponse.data.output_data ?? '');
      setVerdict(runResponse.data.verdict ?? '---');
      setRuntime(runResponse.data.runtime ?? '---');
    } catch (err) {
      console.error("Execution error:", err);
      if (err.response) {
        const data = err.response.data;
        console.log(data);
        setOutput(data.output_data ?? '');
        setVerdict(data.verdict ?? 'Error occurred');
        setRuntime(data.runtime ?? 'N/A');
      } else {
        setVerdict("Unknown error occurred");
        setRuntime("N/A");
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-400 text-white font-mono">
        <Split
          className="flex h-[calc(100vh-60px)]"
          minSize={320}
          gutterSize={8}
          cursor="col-resize"
        >
          {/* LEFT SIDE: Code Editor */}
          <div className="p-6 h-full flex justify-center items-start overflow-y-auto">
            <div className="w-full max-w-4xl space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <h2 className="text-yellow-300 font-semibold text-xl">💻 Code Editor</h2>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-yellow-300 px-4 py-2 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="cpp">C++</option>
                  {/* <option value="java">Java</option>
                  <option value="js">JavaScript</option> */}
                  <option value="c">C</option>
                  <option value="py">Python</option>
                </select>
              </div>

              {themeReady && (
                <Editor
                  height="70vh"
                  theme="batman-dark"
                  language={getMonacoLanguage(language)}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  className="rounded-md border border-gray-700 overflow-hidden"
                  options={{
                    fontSize: 16,
                    minimap: { enabled: false },
                    fontFamily: 'Fira Code',
                    automaticLayout: true,
                    wordWrap: 'on',
                    scrollbar: {
                      verticalScrollbarSize: 6,
                      horizontalScrollbarSize: 6,
                    },
                  }}
                />
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Input/Output */}
          <div className="p-6 h-full flex flex-col justify-between overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-900 scrollbar-track-gray-800 hover:scrollbar-thumb-yellow-500">
            <div className="flex flex-col space-y-6">
              <div>
                <h2 className="text-yellow-300 font-semibold text-lg mb-2">📥 input.txt</h2>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full min-h-40 bg-gray-800 text-indigo-200 p-3 text-sm rounded-md font-mono resize-y overflow-auto"
                />
              </div>

              <div className="flex flex-col lg:flex-row gap-6 w-full">
                <div className="flex-1">
                  <h2 className="text-yellow-300 font-semibold text-lg mb-0.5">📥 expected output</h2>
                  <textarea
                    value={expectedOutput}
                    onChange={(e) => setExpectedOutput(e.target.value)}
                    className="w-full min-h-40 bg-gray-800 text-indigo-200 p-3 text-sm rounded-md font-mono resize-y overflow-auto"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-yellow-300 font-semibold text-lg mb-0.5">📤 output.txt</h2>
                  <textarea
                    value={output}
                    readOnly
                    className="w-full min-h-40 bg-gray-800 text-green-400 p-3 text-sm rounded-md font-mono resize-y overflow-auto"
                  />
                </div>
              </div>
            </div>
            <div className="text-center py-4 bg-black/40 text-yellow-300 font-semibold text-lg shadow-inner rounded-md">
              {isRunning ? (
                <span className="animate-pulse">⏳ Running code... Please wait</span>
              ) : (
                <>
                  <span className="mr-6">Verdict: <span className="text-green-400">{verdict}</span></span>
                  <span>⏱ Runtime: <span className="text-blue-300">{runtime} sec</span></span>
                </>
              )}
            </div>

            <div className="text-center py-3">  
              <button
                onClick={handleRunCode}
                className="bg-green-400 text-black font-semibold px-10 py-4 rounded-md shadow hover:bg-indigo-900 hover:text-white hover:shadow-yellow-500/40 transition duration-300 ease-in-out text-2xl"
              >
                ▶️ Run Code
              </button>
            </div>
          </div>
        </Split>
      </div>
    </>
  );
};

export default CodeIDE;
