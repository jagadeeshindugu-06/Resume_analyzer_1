/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import JobInput from './components/JobInput';
import ResultsDashboard from './components/ResultsDashboard';
import { FileText, Briefcase, BarChart } from 'lucide-react';

export type Job = { title: string; description: string };
export type AnalysisResult = {
  job_title: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  recommendations: Record<string, string[]>;
};

export default function App() {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobs, setJobs] = useState<Job[]>([{ title: '', description: '' }]);
  const [results, setResults] = useState<AnalysisResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText) {
      alert('Please upload a resume first.');
      return;
    }

    const validJobs = jobs.filter(j => j.title.trim() && j.description.trim());
    if (validJobs.length === 0) {
      alert('Please enter at least one valid job description.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: resumeText, jobs: validJobs })
      });

      if (!response.ok) throw new Error('Failed to analyze');

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error(error);
      alert('An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BarChart className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Resume Skill Gap Analyzer</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">1. Upload Resume</h2>
            </div>
            <ResumeUpload onUploadSuccess={setResumeText} />
            {resumeText && (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Resume successfully parsed
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">2. Job Descriptions</h2>
            </div>
            <JobInput jobs={jobs} setJobs={setJobs} />
          </section>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={loading || !resumeText || jobs.every(j => !j.title || !j.description)}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm"
          >
            {loading ? 'Analyzing...' : 'Analyze Skill Gap'}
          </button>
        </div>

        {results && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4">Analysis Results</h2>
            <ResultsDashboard results={results} />
          </section>
        )}
      </main>
    </div>
  );
}
