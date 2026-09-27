import React from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  Download, 
  ExternalLink,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { DeliverableItem } from '../types';

interface DeliverableCardProps {
  deliverable: DeliverableItem;
}

export const DeliverableCard: React.FC<DeliverableCardProps> = ({ deliverable }) => {
  const getFormatBadge = (type: string) => {
    switch (type.toUpperCase()) {
      case 'DOCX':
        return {
          icon: <FileText className="w-5 h-5 text-blue-400" />,
          color: 'border-blue-500/40 bg-blue-950/40 text-blue-300',
          label: 'Microsoft Word Document'
        };
      case 'XLSX':
        return {
          icon: <FileSpreadsheet className="w-5 h-5 text-emerald-400" />,
          color: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300',
          label: 'Microsoft Excel Analytics'
        };
      case 'PPTX':
        return {
          icon: <Presentation className="w-5 h-5 text-amber-400" />,
          color: 'border-amber-500/40 bg-amber-950/40 text-amber-300',
          label: 'PowerPoint Briefing'
        };
      default:
        return {
          icon: <FileText className="w-5 h-5 text-rose-400" />,
          color: 'border-rose-500/40 bg-rose-950/40 text-rose-300',
          label: 'Technical PDF'
        };
    }
  };

  const badge = getFormatBadge(deliverable.file_type);
  const sizeFormatted = deliverable.file_size_bytes 
    ? `${(deliverable.file_size_bytes / 1024).toFixed(1)} KB` 
    : 'Binary Package';

  return (
    <div className={`p-4 rounded-xl border ${badge.color} transition-all hover:shadow-lg flex flex-col justify-between gap-3 font-sans`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
            {badge.icon}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-100 truncate">{deliverable.title}</h4>
            <span className="text-[10px] font-mono text-slate-400 block">{deliverable.filename}</span>
            <span className="text-[10px] text-slate-500">{badge.label}</span>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-900 text-cyan-400 border border-slate-700 shrink-0">
          {deliverable.file_type}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] font-mono">
        <div className="flex items-center gap-1 text-slate-400">
          <HardDrive className="w-3.5 h-3.5 text-slate-500" />
          <span>{sizeFormatted}</span>
        </div>

        <a
          href={deliverable.download_url}
          download={deliverable.filename}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-600/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Real File</span>
        </a>
      </div>
    </div>
  );
};
