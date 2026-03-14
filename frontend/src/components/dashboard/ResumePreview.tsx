import React from 'react';
import { X } from 'lucide-react';

interface ResumePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  documentHtml: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ isOpen, onClose, documentHtml }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Resume Preview</h3>
            <p className="text-xs text-slate-500">This is the same layout used for PDF export.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <X className="h-3.5 w-3.5" />
            Close
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-slate-100 p-4 sm:p-6">
          <iframe
            title="Resume Preview"
            srcDoc={documentHtml}
            className="mx-auto h-full w-full max-w-[900px] rounded-xl border border-slate-300 bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
