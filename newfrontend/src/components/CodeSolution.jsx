import React, { useEffect, useState } from 'react';
import Split from 'react-split';
import Navbar from './Navbar';
import '../App.css';
import { Editor, useMonaco } from '@monaco-editor/react';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import paths from '../paths';
import axios from 'axios';
import ProblemSubmissionHistory from './ProblemSubmissionHistory';


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

const CodeSolution = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(localStorage.getItem(`pb${id}-${language}`) || '// Write your knight path algorithm here...');
  const [themeReady, setThemeReady] = useState(false);
  const [problem, setProblem] = useState(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('Output will appear here after running...');
  const [verdict, setVerdict] = useState('---');
  const [runtime, setRuntime] = useState('---');
  const [isRunning, setIsRunning] = useState(false);
  const [showSubmissionHistory,setShowSubmissionHistory] = useState(false);

  useEffect(() => {
  const controller = new AbortController();

  const getProblem = async () => {
    try {
      const token = await getValidAccessToken();
      if (!token) {
        localStorage.setItem('fall_back_page', location.pathname);
        navigate(paths.LOGIN);
        return;
      }

      const response = await axios.get(paths.BASE+`problems/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      setProblem(response.data);
      setInput(response.data.sample_testcase_INP || '');
    } catch (err) {
      if (axios.isCancel(err) || err.code === 'ERR_CANCELED' || err?.type === 'cancelation') {
        return;
      }
      console.error("Error fetching problem:", err);
    }
  };
    getProblem();
    return () => {
      controller.abort();
    };
  }, [id, location.pathname, navigate]);

  const handleSolutionHistory = async () => {
    const token = await getValidAccessToken();
    if (!token) {
      localStorage.setItem('fall_back_page',location.pathname);
      navigate(paths.LOGIN);
    }
    setShowSubmissionHistory(true);
  }

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    setIsRunning(true);
    const token = await getValidAccessToken();
    if (!token) {
      localStorage.setItem('fall_back_page', location.pathname);
      navigate(paths.LOGIN);
      return;
    }
    try {
      const submitResponse = await axios.post(
        paths.BASE+`problems/submit/${id}/`,
        {
          language,
          code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setOutput(submitResponse.data.output_data ?? '');
      setVerdict(submitResponse.data.verdict ?? '---');
      setRuntime(submitResponse.data.runtime ?? '---');
    } catch (err) {
      console.error("Execution error:", err);
      if (err.response) {
        const data = err.response.data;
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
      setVerdict("Error occurred");
      setRuntime("N/A");
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    const savedCode = localStorage.getItem(`pb${id}-${language}`);
    if (savedCode !== null) {
      setCode(savedCode);
    } else {
      setCode('// Write your knight path algorithm here...');
    }
  }, [id, language]);

  useEffect(() => {
    localStorage.setItem(`pb${id}-${language}`, code);
  }, [code, id, language]);

  const monaco = useMonaco();

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
        },
      });
      monaco.editor.setTheme('batman-dark');
      setThemeReady(true);
    }
  }, [monaco]);

  return (
    <>
    <Navbar />
    <div className="relative h-11/12 bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-400 text-white font-mono">
      
      <style>
        {`
          .gutter {
            background-color: transparent;
            transition: background-color 0.2s ease;
            cursor: col-resize;
            width: 4px;
          }

          .gutter:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }
        `}
      </style>

      <Split
        className="flex h-[calc(100vh-60px)]"
        minSize={320}
        gutterSize={8}
        gutterAlign="center"
        gutter={(index, direction) => {
          const gutter = document.createElement('div');
          gutter.className = `gutter gutter-${direction}`;
          return gutter;
        }}
      >

        {/* LEFT: Problem Section */}
        <div className="overflow-y-auto p-6 border-r border-gray-800 bg-gray-900 h-full scrollbar-thin scrollbar-thumb-indigo-900 scrollbar-track-gray-800 hover:scrollbar-thumb-yellow-500">
          {!problem ? (
            <div className="text-yellow-400 text-xl">Loading problem...</div>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold text-yellow-400 mb-6 flex items-center gap-2">
                🧩 <span>{problem?.problemTitle}</span>
              </h1>

              <section className="mb-6">
                <h2 className="text-xl font-bold text-indigo-300 mb-2 underline underline-offset-4 decoration-yellow-400">
                  📜 Statement
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {problem.problemStatement}
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-bold text-indigo-300 mb-2 underline underline-offset-4 decoration-yellow-400">
                  ⚠️ Constraints
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {problem.constraints}
                </p>
              </section>

              <section className="space-y-4">
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                    <span className="text-yellow-400 font-bold">📥 Sample Input</span>
                  </div>
                  <div className="bg-gray-900 text-indigo-200 p-3 text-sm font-mono whitespace-pre">
                    {problem.sample_testcase_INP}
                  </div>
                </div>

                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                    <span className="text-yellow-400 font-bold">📤 Sample Output</span>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-3 text-sm font-mono whitespace-pre">
                    {problem.sample_testcase_OUT}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>

        {/* RIGHT: Code Editor Section */}
        <div className="p-6 flex flex-col bg-[#0a0f2c] h-full overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-900 scrollbar-track-gray-800 hover:scrollbar-thumb-yellow-500">
          <div className="flex-1 flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-yellow-300 font-semibold text-lg">💻 Code Editor</h2>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-yellow-300 px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:text-blue-400 hover:border-blue-500 transition-colors duration-200"
              >
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="py">Python</option>
                {/* <option value="java">Java</option> */}
                {/* <option value="js">Javascript</option> */}
              </select>
            </div>

            {themeReady && (
              <Editor
                height="500px"
                language={getMonacoLanguage(language)}
                value={code}
                onChange={(value) => setCode(value)}
                theme="batman-dark"
                className="rounded-md border border-gray-700 overflow-hidden"
                options={{
                  fontSize: 16,
                  minimap: { enabled: false },
                  fontFamily: 'Fira Code',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  scrollbar: {
                    verticalScrollbarSize: 6,
                    horizontalScrollbarSize: 6,
                  },
                }}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-yellow-300 font-semibold text-lg mb-2">📥 input.txt</h2>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full min-h-30 bg-gray-800 text-indigo-200 p-3 text-sm rounded-md font-mono resize-y overflow-auto"
                />
              </div>

              <div className="flex-1">
                  <h2 className="text-yellow-300 font-semibold text-lg mb-2">📤 output.txt</h2>
                  <textarea
                    value={output}
                    readOnly
                    className="w-full min-h-30 bg-gray-800 text-green-400 p-3 text-sm rounded-md font-mono resize-y overflow-auto"
                  />
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

            <div className="text-center mt-4 space-x-4">
              <button
                onClick={handleRunCode}
                className="bg-red-400 text-black font-semibold px-4 py-2 rounded-md shadow hover:bg-indigo-900 hover:text-white hover:shadow-yellow-500/40 transition duration-300 ease-in-out text-sm"
              >
                ▶️ Run
              </button>
              <button
                onClick={handleSubmitCode}
                className="bg-green-400 text-black font-semibold px-4 py-2 rounded-md shadow hover:bg-indigo-900 hover:text-white hover:shadow-yellow-500/40 transition duration-300 ease-in-out text-sm"
              >
                📤 Submit
              </button>
              <button
                onClick={handleSolutionHistory}
                className="bg-orange-400 text-black font-semibold px-4 py-2 rounded-md shadow hover:bg-indigo-900 hover:text-white hover:shadow-yellow-500/40 transition duration-300 ease-in-out text-sm"
              >
                Check Solution History ⬇
              </button>
            </div>
          </div>
        </div>
      </Split>
    </div>
        {showSubmissionHistory && (
      <ProblemSubmissionHistory
        problemId={id}
        onClose={() => setShowSubmissionHistory(false)}
      />
    )}

    </>
  );
};

export default CodeSolution;
