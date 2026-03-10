import { AnalysisResult } from '../App';
import { CheckCircle2, XCircle, ExternalLink, BookOpen } from 'lucide-react';
import SkillChart from './SkillChart';

interface ResultsDashboardProps {
  results: AnalysisResult[];
}

export default function ResultsDashboard({ results }: ResultsDashboardProps) {
  return (
    <div className="space-y-8">
      {results.map((result, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">{result.job_title}</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Match Score</span>
              <div className={`px-4 py-1.5 rounded-full font-bold text-lg ${
                result.match_score >= 70 ? 'bg-emerald-100 text-emerald-700' :
                result.match_score >= 40 ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {result.match_score}%
              </div>
            </div>
          </div>

          <div className="p-6 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
                  <h4 className="text-emerald-800 font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Matched Skills ({result.matched_skills.length})
                  </h4>
                  {result.matched_skills.length > 0 ? (
                    <ul className="space-y-2">
                      {result.matched_skills.map((skill, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-emerald-600/70 italic">No matched skills found.</p>
                  )}
                </div>

                <div className="bg-red-50/50 rounded-xl p-5 border border-red-100">
                  <h4 className="text-red-800 font-semibold mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Missing Skills ({result.missing_skills.length})
                  </h4>
                  {result.missing_skills.length > 0 ? (
                    <ul className="space-y-2">
                      {result.missing_skills.map((skill, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-red-700 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-red-600/70 italic">No missing skills! Perfect match.</p>
                  )}
                </div>
              </div>

              {result.missing_skills.length > 0 && (
                <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
                  <h4 className="text-indigo-900 font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Recommended Learning
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(result.recommendations).map(([skill, resources], i) => (
                      <div key={i} className="bg-white rounded-lg p-3 border border-indigo-100 shadow-sm">
                        <span className="text-sm font-bold text-slate-800 block mb-2">{skill}</span>
                        <ul className="space-y-1.5">
                          {resources.map((res, j) => (
                            <li key={j} className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              <a href={`https://www.google.com/search?q=${encodeURIComponent(res)}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                                {res}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col">
              <h4 className="text-slate-800 font-semibold mb-4 text-center">Skill Gap Chart</h4>
              <div className="flex-1 flex items-center justify-center min-h-[250px]">
                <SkillChart 
                  matched={result.matched_skills.length} 
                  missing={result.missing_skills.length} 
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
