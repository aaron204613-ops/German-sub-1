import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CLEAN_VERB_LIST } from './constants';
import { fetchVerbConjugations } from './services/geminiService';
import { VerbData, AppState, StudySessionResult } from './types';
import { Flashcard } from './components/Flashcard';
import { Summary } from './components/Summary';

// Utility to shuffle array (Fisher-Yates)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [allVerbs, setAllVerbs] = useState<VerbData[]>([]);
  const [sessionQueue, setSessionQueue] = useState<VerbData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [results, setResults] = useState<StudySessionResult[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Data
  useEffect(() => {
    const initData = async () => {
      try {
        // In a real production app we might cache this in localStorage to save API calls
        // For this demo, we fetch fresh to demonstrate the Gemini integration as requested
        const verbs = await fetchVerbConjugations(CLEAN_VERB_LIST);
        setAllVerbs(verbs);
        setAppState(AppState.READY);
      } catch (err) {
        setAppState(AppState.ERROR);
        setErrorMsg("Failed to load verb data. Please check your API key.");
      }
    };
    initData();
  }, []);

  const startSession = (verbs: VerbData[], shuffle: boolean) => {
    const queue = shuffle ? shuffleArray(verbs) : [...verbs];
    setSessionQueue(queue);
    setCurrentIndex(0);
    setResults([]);
    setIsCardFlipped(false);
    setAppState(AppState.STUDYING);
    // Focus container for keyboard events
    setTimeout(() => containerRef.current?.focus(), 100);
  };

  const handleAnswer = useCallback((known: boolean) => {
    if (appState !== AppState.STUDYING || !isCardFlipped) return;

    const currentVerb = sessionQueue[currentIndex];
    
    setResults(prev => [...prev, { verb: currentVerb, known }]);
    setIsCardFlipped(false);

    if (currentIndex < sessionQueue.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150); // Small delay for animation
    } else {
      setAppState(AppState.SUMMARY);
    }
  }, [appState, isCardFlipped, currentIndex, sessionQueue]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (appState !== AppState.STUDYING) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'enter':
          e.preventDefault();
          setIsCardFlipped(prev => !prev);
          break;
        case 'y':
          if (isCardFlipped) handleAnswer(true);
          break;
        case 'n':
          if (isCardFlipped) handleAnswer(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, isCardFlipped, handleAnswer]);

  // Renderers
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
      <p className="text-slate-600 font-medium animate-pulse">Consulting AI German Expert...</p>
    </div>
  );

  const renderReady = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">German Verb Mastery</h1>
        <p className="text-slate-500 mb-8">Partizip II & Hilfsverben (ist/hat)</p>
        
        <div className="grid gap-4 w-full max-w-xs mx-auto">
          <button 
            onClick={() => startSession(allVerbs, false)}
            className="w-full py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl transition-all active:scale-95"
          >
            Start (Ordered)
          </button>
          <button 
            onClick={() => startSession(allVerbs, true)}
            className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Start (Shuffle)
          </button>
        </div>
        <p className="mt-6 text-xs text-slate-400">Total Verbs: {allVerbs.length}</p>
      </div>
    </div>
  );

  const renderStudying = () => {
    const currentVerb = sessionQueue[currentIndex];
    const progress = ((currentIndex) / sessionQueue.length) * 100;

    return (
      <div className="min-h-screen flex flex-col items-center justify-between py-8 px-4 max-w-3xl mx-auto w-full" ref={containerRef} tabIndex={-1}>
        <div className="w-full">
            <div className="flex justify-between items-end mb-2">
                <h1 className="text-xl font-bold text-slate-900">Training</h1>
                <span className="text-sm font-mono text-slate-500">{currentIndex + 1} / {sessionQueue.length}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
                <div className="bg-slate-900 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <Flashcard 
            verb={currentVerb} 
            isFlipped={isCardFlipped} 
            onFlip={() => setIsCardFlipped(!isCardFlipped)} 
          />
          
          <div className="mt-12 flex gap-4 opacity-100 transition-opacity">
            <button 
                onClick={() => handleAnswer(false)}
                disabled={!isCardFlipped}
                className={`flex flex-col items-center gap-1 px-8 py-4 rounded-xl transition-all ${isCardFlipped ? 'bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer shadow-sm' : 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400'}`}
            >
                <span className="font-bold text-lg">Forgotten</span>
                <span className="text-xs font-mono border border-current px-1 rounded opacity-60">N</span>
            </button>

            <button 
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="px-6 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors"
            >
                {isCardFlipped ? 'Flip Back' : 'Flip Card (Space)'}
            </button>

            <button 
                onClick={() => handleAnswer(true)}
                disabled={!isCardFlipped}
                className={`flex flex-col items-center gap-1 px-8 py-4 rounded-xl transition-all ${isCardFlipped ? 'bg-green-50 hover:bg-green-100 text-green-600 cursor-pointer shadow-sm' : 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400'}`}
            >
                <span className="font-bold text-lg">I Know It</span>
                <span className="text-xs font-mono border border-current px-1 rounded opacity-60">Y</span>
            </button>
          </div>
        </div>

        <button 
            onClick={() => setAppState(AppState.SUMMARY)}
            className="text-slate-400 hover:text-red-500 text-sm mt-8 transition-colors"
        >
            End Session
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {appState === AppState.LOADING && renderLoading()}
      {appState === AppState.READY && renderReady()}
      {appState === AppState.STUDYING && renderStudying()}
      {appState === AppState.SUMMARY && (
        <Summary 
            results={results} 
            onRestart={() => setAppState(AppState.READY)}
            onRetryMistakes={() => {
                const mistakes = results.filter(r => !r.known).map(r => r.verb);
                startSession(mistakes, true);
            }}
        />
      )}
      {appState === AppState.ERROR && (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
                <h2 className="text-red-600 font-bold text-xl mb-2">Error</h2>
                <p>{errorMsg}</p>
                <button onClick={() => window.location.reload()} className="mt-4 underline">Reload</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;