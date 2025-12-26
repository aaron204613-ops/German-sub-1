import React from 'react';
import { VerbData } from '../types';

interface FlashcardProps {
  verb: VerbData;
  isFlipped: boolean;
  onFlip: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ verb, isFlipped, onFlip }) => {
  return (
    <div 
      className="w-full max-w-md h-80 cursor-pointer perspective-1000 group mx-auto"
      onClick={onFlip}
    >
      <div 
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center backface-hidden border-2 border-slate-100 p-8">
          <span className="text-sm uppercase tracking-widest text-slate-400 mb-4 font-semibold">Infinitive</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 break-words text-center">{verb.infinitive}</h2>
          <p className="mt-8 text-slate-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">Click or Space to flip</p>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full bg-slate-900 rounded-2xl shadow-xl flex flex-col items-center justify-center backface-hidden rotate-y-180 p-8 text-white">
          <span className="text-sm uppercase tracking-widest text-slate-400 mb-4 font-semibold">Partizip II</span>
          <div className="flex flex-col items-center gap-2">
            <span className={`text-xl font-medium ${verb.auxiliary === 'ist' ? 'text-blue-400' : 'text-green-400'}`}>
              {verb.auxiliary}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold break-words text-center">{verb.participle}</h2>
            <p className="text-xl text-slate-400 mt-2 font-medium tracking-wide">
              {verb.chinese}
            </p>
          </div>
          <div className="mt-6 flex gap-8 text-sm text-slate-500">
            <div className="flex flex-col items-center">
              <span className="font-mono bg-slate-800 px-2 py-1 rounded border border-slate-700">N</span>
              <span className="mt-1 text-xs">Forgot</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-mono bg-slate-800 px-2 py-1 rounded border border-slate-700">Y</span>
              <span className="mt-1 text-xs">Know</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};