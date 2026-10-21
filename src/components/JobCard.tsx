import React from 'react';
import { JobAlert } from '../types';
import { Bookmark, Calendar, ChevronRight, FileText, Sparkles, Building2, ExternalLink } from 'lucide-react';

interface JobCardProps {
  job: JobAlert;
  isBookmarked: boolean;
  onToggleBookmark: (jobId: string) => void;
  onSelectJob: (job: JobAlert) => void;
  onOpenAISummary: (job: JobAlert) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isBookmarked,
  onToggleBookmark,
  onSelectJob,
  onOpenAISummary,
}) => {
  const isExpired = new Date(job.importantDates.applicationEnd) < new Date('2026-10-19');

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Unboxed Metadata Header (Zero-Pill Discipline) */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500 mb-2.5 font-medium">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-emerald-700 font-bold">{job.category}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{job.organization}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-extrabold text-slate-800">{job.totalPosts}</span>
          </div>

          <button
            onClick={() => onToggleBookmark(job.id)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isBookmarked
                ? 'text-amber-500 bg-amber-50'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isBookmarked ? 'सेव की गई नौकरियों से हटाएं' : 'जॉब सेव करें'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Job Title */}
        <h3
          onClick={() => onSelectJob(job)}
          className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 cursor-pointer leading-snug mb-2"
        >
          {job.title}
        </h3>

        {/* Short Details List */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
          {job.description}
        </p>

        {/* Key Attributes Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/80 rounded-xl p-3 border border-slate-100 mb-4">
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">अनिवार्य योग्यता</span>
            <span className="font-bold text-slate-800 truncate block" title={job.qualification}>
              {job.qualification}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">वेतनमान (Pay Scale)</span>
            <span className="font-extrabold text-emerald-800 truncate block" title={job.salaryScale}>
              {job.salaryScale}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">आयु सीमा</span>
            <span className="font-bold text-slate-800 truncate block" title={job.ageLimit}>
              {job.ageLimit}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-bold uppercase">अंतिम तिथि (Last Date)</span>
            <span className={`font-extrabold truncate block ${isExpired ? 'text-red-600' : 'text-slate-800'}`}>
              {job.importantDates.applicationEnd}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <button
          onClick={() => onOpenAISummary(job)}
          className="inline-flex items-center gap-1.5 text-emerald-700 font-bold hover:text-emerald-800 transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>AI सारांश</span>
        </button>

        <button
          onClick={() => onSelectJob(job)}
          className="inline-flex items-center gap-1 text-slate-800 font-extrabold hover:text-slate-950 transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-100"
        >
          <span>पूरा विवरण देखें</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
