import React from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  Download, 
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
          icon: <FileText className="w-5 h-5 text-blue-600" />,
          color: 'border-blue-200 bg-blue-50/50 text-blue-800',
          label: 'Microsoft Word Document'
        };
      case 'XLSX':
        return {
          icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
          color: 'border-emerald-200 bg-emerald-50/50 text-emerald-800',
          label: 'Microsoft Excel Analytics'
        };
      case 'PPTX':
        return {
          icon: <Presentation className="w-5 h-5 text-amber-600" />,
          color: 'border-amber-200 bg-amber-50/50 text-amber-800',
          label: 'PowerPoint Briefing'
        };
      default:
        return {
          icon: <FileText className="w-5 h-5 text-rose-600" />,
          color: 'border-rose-200 bg-rose-50/50 text-rose-800',
          label: 'Technical PDF'
        };
    }
  };

  const badge = getFormatBadge(deliverable.file_type);
  const sizeFormatted = deliverable.file_size_bytes 
    ? `${(deliverable.file_size_bytes / 1024).toFixed(1)} KB` 
    : 'Binary Package';

  return (
    <div className={`p-4 rounded-xl border ${badge.color} bg-[#FFFFFF] transition-all hover:shadow-md flex flex-col justify-between gap-3 font-sans`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-lg bg-[#ECE1F3] border border-[#E1D9F0] shrink-0">
            {badge.icon}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[#121334] truncate">{deliverable.title}</h4>
            <span className="text-[10px] font-mono text-[#4B506C] block">{deliverable.filename}</span>
            <span className="text-[10px] text-[#8F92C0]">{badge.label}</span>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#ECE1F3] text-[#5B4EB1] border border-[#E1D9F0] shrink-0">
          {deliverable.file_type}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#E1D9F0] text-[11px] font-mono">
        <div className="flex items-center gap-1 text-[#4B506C]">
          <HardDrive className="w-3.5 h-3.5 text-[#8F92C0]" />
          <span>{sizeFormatted}</span>
        </div>

        <a
          href={deliverable.download_url}
          download={deliverable.filename}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5B4EB1] hover:bg-[#4F46E5] text-white font-semibold text-xs transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Real File</span>
        </a>
      </div>
    </div>
  );
};
