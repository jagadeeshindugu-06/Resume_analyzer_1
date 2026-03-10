import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Job } from '../App';

interface JobInputProps {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

export default function JobInput({ jobs, setJobs }: JobInputProps) {
  const handleAddJob = () => {
    setJobs([...jobs, { title: '', description: '' }]);
  };

  const handleRemoveJob = (index: number) => {
    setJobs(jobs.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Job, value: string) => {
    const newJobs = [...jobs];
    newJobs[index][field] = value;
    setJobs(newJobs);
  };

  return (
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative">
          {jobs.length > 1 && (
            <button
              onClick={() => handleRemoveJob(index)}
              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={job.title}
                onChange={(e) => handleChange(index, 'title', e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Job Description
              </label>
              <textarea
                value={job.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                placeholder="Paste the job description here..."
                rows={4}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow resize-none"
              />
            </div>
          </div>
        </div>
      ))}
      
      <button
        onClick={handleAddJob}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Another Job
      </button>
    </div>
  );
}
