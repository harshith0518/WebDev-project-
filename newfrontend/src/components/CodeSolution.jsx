import React, { useEffect, useState } from 'react';
import Split from 'react-split';
import Navbar from './Navbar';
import '../App.css';
import { Editor, useMonaco } from '@monaco-editor/react';
import { getValidAccessToken } from '../authUtils/getValidAccessToken';
import { useNavigate, useParams,useLocation } from 'react-router-dom';
import paths from '../paths';
import { resolveConfig } from 'vite';



const getMonacoLanguage = (lang) => {
  switch (lang) {
    case 'cpp': return 'cpp';
    case 'py': return 'python';
    case 'java': return 'java';
    case 'js': return 'javascript';
    case 'c': return 'c';
    default: return 'plaintext';
  }
};

const CodeSolution = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {id} = useParams();
  const [language, setLanguage] = useState('cpp');  // default language
  const [code, setCode] = useState('// Write your knight path algorithm here...');
  const [themeReady, setThemeReady] = useState(false);
  const [problem,setProblem] = useState(null);

  useEffect(() => {
    const getProblem = async () => {
      try {
        const token = await getValidAccessToken();
        if(!token) {
          localStorage.setItem('fall_back_page',location.pathname);
          navigate(paths.LOGIN);
        }
        const response = await axios.get(`http://localhost:8000/problems/${id}/`,
          {
            headers:{ Authorization:`Bearer`}
          }
        )
        console.log(response.data);
        setProblem(response.data);
      } catch (err) {
        console.error("Error Triggered :",err);
        return 
      }
    };
    getProblem();
  },[location.pathname, navigate]);


  const handleSubmit = async () => {
    const token = await getValidAccessToken();
    if (!token) {
      navigate(paths.LOGIN);
      return;
    }
    console.log('📤 Submit triggered with valid token:', token);
    // TODO: call /submit/ API with code, input, lang
  };

  const handleRun = async () => {
    const token = await getValidAccessToken();
    if (!token) {
      navigate(paths.LOGIN);
      return;
    }
    console.log('▶️ Run triggered with valid token:', token);
    // TODO: call /run/ API with code, input, lang
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "'") {
        e.preventDefault();
        handleRun();
      }
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-yellow-400 text-white font-mono">
      <Navbar />
      <Split
        className="flex h-[calc(100vh-60px)]"
        minSize={320}
        cursor="col-resize"
      >
        {/* LEFT: Problem Section */}
        <div className="overflow-y-auto p-6 border-r border-gray-800 bg-gray-900 h-full scrollbar-thin scrollbar-thumb-indigo-900 scrollbar-track-gray-800 hover:scrollbar-thumb-yellow-500">
          <h1 className="text-3xl font-extrabold text-yellow-400 mb-6 flex items-center gap-2">
            🧩 <span>{problem.problemTitle}</span>
          </h1>

          <section className="mb-6">
            <h2 className="text-xl font-bold text-indigo-300 mb-2 underline underline-offset-4 decoration-yellow-400">
              📜 Statement
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Batman is stuck in a grid-shaped dungeon. He can only move like a knight in chess (L-shaped moves).
              Help him reach the destination cell from the starting cell in the minimum number of knight moves.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-bold text-indigo-300 mb-2 underline underline-offset-4 decoration-yellow-400">
              ⚠️ Constraints
            </h2>
            <ul className="text-sm text-gray-300 list-disc ml-5 space-y-1">
              <li>1 ≤ N ≤ 1000</li>
              <li>0 ≤ start_x, start_y, end_x, end_y &lt; N</li>
              <li>Grid is square with no blocked cells</li>
              <li>Use BFS for optimal performance</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                <span className="text-yellow-400 font-bold">📥 Sample Input</span>
              </div>
              <div className="bg-gray-900 text-indigo-200 p-3 text-sm font-mono whitespace-pre">
                2<br />0 0 7 7<br />3 3 4 3
              </div>
            </div>

            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                <span className="text-yellow-400 font-bold">📤 Sample Output</span>
              </div>
              <div className="bg-gray-900 text-green-400 p-3 text-sm font-mono whitespace-pre">
                6<br />1
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT: Code Editor Section */}
        <div className="p-6 flex flex-col bg-[#0a0f2c] h-full overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-900 scrollbar-track-gray-800 hover:scrollbar-thumb-yellow-500">
          <div className="flex-1 flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-yellow-300 font-semibold text-lg">💻 Code Editor</h2>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-yellow-300 px-3 py-1 rounded text-sm 
                  focus:outline-none focus:ring-2 focus:ring-yellow-400 
                  hover:text-blue-400 hover:border-blue-500 transition-colors duration-200"
              >
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="py">Python</option>
                <option value="java">Java</option>
                <option value="js">Javascript</option>
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
              <div className="border border-gray-700 rounded-md overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                  <span className="text-yellow-400 font-bold">📥 input.txt</span>
                </div>
                <textarea
                  className="w-full h-28 bg-gray-900 text-indigo-200 p-3 outline-none text-sm resize-none font-mono"
                  defaultValue={'2\n0 0 7 7\n3 3 4 3'}
                />
              </div>

              <div className="border border-gray-700 rounded-md overflow-hidden">
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                  <span className="text-yellow-400 font-bold">📤 output.txt</span>
                </div>
                <div className="bg-gray-900 text-green-400 p-3 h-28 text-sm overflow-y-auto whitespace-pre-wrap font-mono">
                  // Output will appear here after compilation...
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 space-x-4">
            <button
              onClick={handleRun}
              className="bg-red-400 text-black font-semibold px-4 py-2 rounded-md shadow hover:bg-indigo-900 hover:text-white hover:shadow-yellow-500/40 transition duration-300 ease-in-out text-sm"
            >
              ▶️ Run
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-400 text-black font-semibold px-4 py-2 rounded-md shadow hover:bg-indigo-900 hover:text-white hover:shadow-yellow-500/40 transition duration-300 ease-in-out text-sm"
            >
              📤 Submit
            </button>
            <button
              className="bg-orange-400 text-black font-semibold px-4 py-2 rounded-md shadow hover:bg-indigo-900 hover:text-white hover:shadow-yellow-500/40 transition duration-300 ease-in-out text-sm"
            >
              Check Solution History ⬇
            </button>
          </div>
        </div>
      </Split>
    </div>
  );
};

export default CodeSolution;
