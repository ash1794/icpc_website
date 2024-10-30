'use client'
import { useState, useRef, useEffect } from "react"
import Image from "next/image";

const COMMANDS = {
  'help' : `
Available commands:
- help: Show this help message
- about: About ICPC World Finals
- register: Get registration information
- clear: Clear terminal screen`,
  'clear': '',
  'about' : `
International Collegiate Programming Contest (ICPC)
World Finals 2024 @ Amrita University

The ICPC is the premier global programming competition conducted by and for the world's universities. 
The contest fosters creativity, teamwork, and innovation in building new software programs.`,
 'register' : `
To register your team, please visit the official ICPC registration website at https://icpc.global/registration.

Registration Deadline: November 9th, 2024
Registration Fee: 1100 INR per team

For more information, contact the ICPC World Finals 2024 Organizing Committee at icpc@amrita.edu.
`
};

export default function Terminal() {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState([0, 0]);
  const [position, setPosition] = useState({ left: 100, top: 100 });
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(['Welcome\nType help for available commands']);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  
  const ref = useRef(null);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    const commandArgs = args.slice(1);

    let output = '';
    
    if (command in COMMANDS) {
      if (typeof COMMANDS[command] === 'function') {
        output = COMMANDS[command](commandArgs);
      } else {
        output = COMMANDS[command];
      }
    } else if (command) {
      output = `Command not found: ${command}. Type help for available commands.`;
    }

    if (command === 'clear') {
      setHistory([]);
    } else {
      setHistory(prev => [...prev, `coder@amritaicpc$ ${cmd}`, output].filter(Boolean));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setCommandHistory(prev => [...prev, input]);
      setHistoryIndex(-1);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleMouseDown = (e) => {
    if (e.target === ref.current) {
      setIsDragging(true);
      setOffset([position.left - e.clientX, position.top - e.clientY]);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        left: e.clientX + offset[0],
        top: e.clientY + offset[1],
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  const toggleTerminal = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setPosition({ left: window.innerWidth / 4, top: scrollY+window.innerHeight / 4 });
    }
  };

  return (
    <>
      <button 
        onClick={toggleTerminal}
        className="fixed z-50 bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-[5vw] h-[5vw] flex justify-center items-center m-[1vw] hover:scale-110 transition-all duration-300 ease-in-out shadow-lg"
        aria-label="Toggle Terminal"
      >
        <Image src="/terminal_black.png" width={1} height={1} className="h-[4vw] w-auto" unoptimized></Image>
      </button>

      {isOpen && (
        <div 
          className="absolute z-20 bg-black w-[35vw] h-[20vw] rounded-[1vw] overflow-hidden flex flex-col shadow-lg animate-fade-in"
          style={{ 
            left: position.left + "px", 
            top: position.top + "px",
          }}
        >
          <div 
            ref={ref}
            className="h-[2vw] bg-gray-700 w-full flex justify-between items-center cursor-move"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center">
              <div className="rounded-full ml-[0.5vw] bg-red-500 h-[1vw] w-[1vw] cursor-pointer hover:bg-red-600" onClick={toggleTerminal} />
             
            </div>
            <div className="text-xs text-gray-300 mr-2">ICPC Help Terminal</div>
          </div>
          
          <div 
            ref={outputRef} 
            className="flex-1 overflow-y-auto p-2 font-mono text-green-400 text-[0.8vw] max-h-[calc(20vw-4vw)]"
          >
            {history.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap break-words">{line}</div>
            ))}
          </div>

          <div className="flex px-2 py-1 font-mono text-green-400 text-[0.8vw] border-t border-gray-700 h-[2vw]">
            <span>coder@amritaicpc$ </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none ml-1 min-w-0"
              autoFocus
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}