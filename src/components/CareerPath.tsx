import React from 'react';
import { ChevronRight, Target, Briefcase, GraduationCap, Award } from 'lucide-react';

interface CareerStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface CareerRoadmap {
  role: string;
  steps: CareerStep[];
}

const roadmaps: CareerRoadmap[] = [
  {
    role: "UPSC Civil Services",
    steps: [
      { title: "Graduation", description: "Any recognized degree", icon: <GraduationCap size={20} /> },
      { title: "Prelims", description: "General Studies & CSAT", icon: <Target size={20} /> },
      { title: "Mains", description: "Subjective Exams", icon: <Briefcase size={20} /> },
      { title: "Interview", description: "Personality Test", icon: <Award size={20} /> },
    ],
  },
  {
    role: "SSC CGL",
    steps: [
      { title: "Eligibility", description: "Bachelor's Degree", icon: <GraduationCap size={20} /> },
      { title: "Tier I", description: "Objective MCQs", icon: <Target size={20} /> },
      { title: "Tier II", description: "Quantitative & English", icon: <Briefcase size={20} /> },
      { title: "Document Verification", description: "Final Selection", icon: <Award size={20} /> },
    ],
  },
];

export const CareerPath: React.FC = () => {
  return (
    <div className="space-y-8 p-6 bg-white rounded-2xl border border-slate-200">
      <h2 className="text-2xl font-extrabold text-slate-900">Career Path Roadmaps</h2>
      {roadmaps.map((roadmap) => (
        <div key={roadmap.role} className="space-y-4">
          <h3 className="text-lg font-bold text-emerald-700">{roadmap.role}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {roadmap.steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full mb-3">
                  {step.icon}
                </div>
                <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{step.description}</p>
                {index < roadmap.steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute -right-2 top-1/2 text-slate-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
