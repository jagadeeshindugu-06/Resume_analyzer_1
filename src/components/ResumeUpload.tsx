import React, { useState, useRef } from 'react';
import { UploadCloud, File, X } from 'lucide-react';

interface ResumeUploadProps {
  onUploadSuccess: (text: string) => void;
}

export default function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && selectedFile.type !== 'text/plain') {
      setError('Please upload a PDF or TXT file.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    await uploadFile(selectedFile);
  };

  const uploadFile = async (fileToUpload: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('resume', fileToUpload);

    try {
      const response = await fetch('/api/upload_resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.resume_text) {
        onUploadSuccess(data.resume_text);
      } else {
        throw new Error('No text extracted');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to process the resume. Please try again.');
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    onUploadSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {!file ? (
        <div 
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700 mb-1">Click to upload resume</p>
          <p className="text-xs text-slate-500">PDF or TXT up to 5MB</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".pdf,.txt" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
              <File className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
              <p className="text-xs text-slate-500">
                {uploading ? 'Processing...' : `${(file.size / 1024).toFixed(1)} KB`}
              </p>
            </div>
          </div>
          {!uploading && (
            <button 
              onClick={clearFile}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}
