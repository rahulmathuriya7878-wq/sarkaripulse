import React, { useState, useEffect } from 'react';
import { QuizQuestion, NewsItem } from '../types';
import { X, Sparkles, CheckCircle2, XCircle, Trophy, RefreshCw, ArrowRight } from 'lucide-react';

interface DailyQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsItems: NewsItem[];
}

export const DailyQuizModal: React.FC<DailyQuizModalProps> = ({ isOpen, onClose, newsItems }) => {
  if (!isOpen) return null;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const fetchQuiz = async () => {
    setLoading(true);
    setQuizCompleted(false);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);

    try {
      const res = await fetch('/api/gemini/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsItems }),
      });
      const data = await res.json();
      setQuestions(data.quiz || []);
    } catch (e) {
      console.error('Quiz fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [isOpen]);

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing after selection
    setSelectedOption(index);
    setShowExplanation(true);

    if (index === questions[currentIndex].correctOptionIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-extrabold text-base text-white">Daily AI GK & Current Affairs Quiz</h3>
              <p className="text-xs text-slate-400">High-yield MCQs for UPSC, SSC & Bank Exams</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-800">Generating Daily Competitive Exam MCQs...</p>
              <p className="text-xs text-slate-500">Formulating 5 targeted questions based on latest news & cabinet policy.</p>
            </div>
          ) : quizCompleted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Quiz Completed!</h3>
              <p className="text-sm font-bold text-slate-700">
                You scored <span className="text-emerald-600 text-lg">{score}</span> out of {questions.length}
              </p>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                {score >= 4
                  ? '🌟 Excellent performance! Your current affairs readiness for UPSC & SSC is strong.'
                  : score >= 2
                  ? '👍 Good attempt! Review the daily news digest to sharpen your static GK score.'
                  : '📚 Keep practicing! Consistent daily quiz practice improves accuracy.'}
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={fetchQuiz}
                  className="px-4 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
                >
                  Close Quiz
                </button>
              </div>
            </div>
          ) : currentQ ? (
            <div className="space-y-5">
              {/* Question Index Bar */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-2">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span className="text-emerald-700 font-extrabold">{currentQ.examRelevance}</span>
              </div>

              {/* Question Text */}
              <h4 className="text-sm font-bold text-slate-900 leading-snug">{currentQ.question}</h4>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((opt, i) => {
                  let btnStyle = 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50';
                  if (selectedOption !== null) {
                    if (i === currentQ.correctOptionIndex) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                    } else if (i === selectedOption) {
                      btnStyle = 'border-red-500 bg-red-50 text-red-950 font-bold';
                    } else {
                      btnStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      disabled={selectedOption !== null}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {selectedOption !== null && i === currentQ.correctOptionIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {selectedOption !== null && i === selectedOption && i !== currentQ.correctOptionIndex && (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {showExplanation && (
                <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-1 animate-in fade-in">
                  <span className="font-extrabold text-emerald-950 block">Explanation:</span>
                  <p className="text-slate-800 font-normal leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              {/* Next Button */}
              {selectedOption !== null && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>{currentIndex + 1 === questions.length ? 'See Results' : 'Next Question'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">Failed to load quiz. Please try again.</div>
          )}
        </div>
      </div>
    </div>
  );
};
