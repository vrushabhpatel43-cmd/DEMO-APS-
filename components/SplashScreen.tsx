import React, { useState, useEffect } from 'react';
import { getRandomQuote } from '../services/quoteService';

export const SplashScreen: React.FC = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50 animate-fade-in-out">
        <style>
            {`
                @keyframes fade-in-out {
                    0% { opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { opacity: 0; }
                }
                .animate-fade-in-out {
                    animation: fade-in-out 3s ease-in-out forwards;
                }
            `}
        </style>
      <div className="text-center">
        <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
          E<span className="text-5xl">A</span>V
        </h1>
        <p className="text-sm text-slate-400 tracking-widest">ESTO ARKIS VERSOVA</p>
      </div>
      <p className="text-slate-500 mt-8 text-center px-4 italic">
        "{quote}"
      </p>
    </div>
  );
};
