import React, { useState } from 'react';
import { CandidateProfile, EligibilityResult, EligibilityRecommendation, JobCategory } from '../types';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, BookOpen, ShieldCheck, UserCheck } from 'lucide-react';

const QUALIFICATIONS = [
  'Graduation Degree in any stream (B.A, B.Sc, B.Com, BBA)',
  'B.E / B.Tech (Engineering - CS, ECE, Civil, Mech, EE)',
  'Matriculation (10th) + ITI Trade Certificate',
  'Senior Secondary (12th Pass)',
  'B.Ed / D.El.Ed / Teaching Degree',
  'B.Sc Nursing / GNM / MBBS',
  'Post Graduation (M.A, M.Sc, M.Tech, MBA)',
  'Chartered Accountant (CA) / CS / Cost Accountant',
];

const CATEGORIES: CandidateProfile['category'][] = ['General', 'OBC', 'SC', 'ST', 'EWS', 'PwBD'];

export const EligibilityChecker: React.FC = () => {
  const [profile, setProfile] = useState<CandidateProfile>({
    age: 24,
    qualification: QUALIFICATIONS[0],
    category: 'General',
    state: 'Delhi (All India)',
    preferredSectors: ['UPSC', 'SSC', 'Banking', 'Railways'],
  });

  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSector = (sector: JobCategory) => {
    const exists = profile.preferredSectors.includes(sector);
    const updated = exists
      ? profile.preferredSectors.filter((s) => s !== sector)
      : [...profile.preferredSectors, sector];
    setProfile({ ...profile, preferredSectors: updated });
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to evaluate');
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while assessing eligibility.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Sarkari Eligibility Evaluator</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Find Government Jobs You Qualify For</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Input your age, degree, and category to analyze active UPSC, SSC, RRB, and Banking openings.
          </p>
        </div>
      </div>

      <form onSubmit={handleCheck} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Age Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Your Current Age (Years)</label>
            <input
              type="number"
              min={17}
              max={60}
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              required
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Category (Relaxation Check)</label>
            <select
              value={profile.category}
              onChange={(e) => setProfile({ ...profile, category: e.target.value as any })}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Home State */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Home State / Domicile</label>
            <input
              type="text"
              value={profile.state}
              onChange={(e) => setProfile({ ...profile, state: e.target.value })}
              placeholder="e.g. Maharashtra, UP, Bihar, Delhi"
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              required
            />
          </div>
        </div>

        {/* Qualification Select */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Highest Educational Qualification</label>
          <select
            value={profile.qualification}
            onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
            className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            {QUALIFICATIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>

        {/* Preferred Sectors */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">Target Job Sectors</label>
          <div className="flex flex-wrap gap-2">
            {(['UPSC', 'SSC', 'Banking', 'Railways', 'Defense', 'State PSC', 'Teaching', 'PSU', 'Medical'] as JobCategory[]).map(
              (sector) => {
                const active = profile.preferredSectors.includes(sector);
                return (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => toggleSector(sector)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      active
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sector}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Job Vacancy Database with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Evaluate My Government Job Eligibility</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in duration-300">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <h3 className="font-extrabold text-emerald-950 text-sm mb-1">{result.eligibilityVerdict}</h3>
            <p className="text-xs text-emerald-800 font-medium mb-2">{result.ageRelaxationApplied}</p>
            <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-emerald-100">
              💡 <span className="font-bold">Advisor Tip:</span> {result.preparationAdvice}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Matched Job Vacancies</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.recommendations.map((rec: EligibilityRecommendation, i: number) => (
                <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase">{rec.organization}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-900">
                      {rec.matchPercentage}% Match
                    </span>
                  </div>

                  <h5 className="font-extrabold text-slate-900 text-xs line-clamp-1">{rec.jobTitle}</h5>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{rec.keyReason}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{rec.eligibilityStatus}</span>
                    <span className="text-emerald-700 font-bold hover:underline cursor-pointer">
                      {rec.nextAction} →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
