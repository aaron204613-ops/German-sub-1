import React from 'react';
import { StudySessionResult } from '../types';

interface SummaryProps {
  results: StudySessionResult[];
  onRestart: () => void;
  onRetryMistakes: () => void;
}

export const Summary: React.FC<SummaryProps> = ({ results, onRestart, onRetryMistakes }) => {
  const mistakes = results.filter(r => !r.known);
  const correct = results.filter(r => r.known);
  const score = Math.round((correct.length / results.length) * 100) || 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Session Complete!</h2>
        <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 min-w-[120px]">
                <div className="text-3xl font-bold text-green-600">{correct.length}</div>
                <div className="text-xs text-slate-500 uppercase font-bold">Known</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 min-w-[120px]">
                <div className="text-3xl font-bold text-red-500">{mistakes.length}</div>
                <div className="text-xs text-slate-500 uppercase font-bold">To Review</div>
            </div>
        </div>
        
        <div className="flex justify-center gap-4">
            <button 
                onClick={onRestart}
                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-full font-medium transition-colors"
            >
                Restart All
            </button>
            {mistakes.length > 0 && (
                <button 
                    onClick={onRetryMistakes}
                    className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium transition-colors shadow-lg shadow-slate-900/20"
                >
                    Review Mistakes ({mistakes.length})
                </button>
            )}
        </div>
      </div>

      {mistakes.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="font-bold text-red-800">Mistakes Book (错题本)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">Infinitive</th>
                  <th className="px-6 py-3 font-semibold">Meaning</th>
                  <th className="px-6 py-3 font-semibold">Auxiliary</th>
                  <th className="px-6 py-3 font-semibold">Partizip II</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mistakes.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.verb.infinitive}</td>
                    <td className="px-6 py-4 text-slate-500">{item.verb.chinese}</td>
                    <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${item.verb.auxiliary === 'ist' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {item.verb.auxiliary}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{item.verb.participle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};