
import React, { useState } from 'react';
import type { DailyReport } from '../types';
import { getAIInsights } from '../services/geminiService';
import { InputField } from './InputField';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';

interface AIFeatureProps {
  reports: DailyReport[];
}

export const AIFeature: React.FC<AIFeatureProps> = ({ reports }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAskAI = async () => {
    if (!question.trim() || reports.length === 0) {
        setError("Please enter a question and ensure there is data to analyze.");
        return;
    }
    
    setIsLoading(true);
    setError('');
    setAnswer('');

    try {
      const result = await getAIInsights(reports, question);
      setAnswer(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 space-y-4">
      <p className="text-slate-400">Ask a question about the current report data. For example: "Who made the most calls?" or "Summarize performance for this week."</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
            <InputField 
                id="ai-question"
                label="Your Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Who has the best call connection rate?"
                disabled={isLoading}
            />
        </div>
        <Button onClick={handleAskAI} disabled={isLoading || !question.trim()} className="self-end h-[50px]">
            {isLoading ? 'Analyzing...' : 'Ask AI'}
        </Button>
      </div>

      {(isLoading || error || answer) && (
        <div className="mt-4 p-4 bg-slate-800/50 rounded-md min-h-[100px] flex items-center justify-center">
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-red-400 text-center">{error}</p>}
            {answer && <p className="text-slate-300 whitespace-pre-wrap">{answer}</p>}
        </div>
      )}
    </div>
  );
};
