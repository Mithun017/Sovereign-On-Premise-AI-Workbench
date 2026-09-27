import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { KnowledgeCitation } from '../types';

interface CitationCardProps {
  citation: KnowledgeCitation;
}

export const CitationCard: React.FC<CitationCardProps> = ({ citation }) => {
  return (
    <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E1D9F0] text-xs font-sans space-y-2 hover:border-[#8F92C0] transition-all shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono text-[#5B4EB1] font-bold">
          <BookOpen className="w-3.5 h-3.5 text-[#5B4EB1]" />
          <span>{citation.citation}</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECE1F3] text-[#5B4EB1] font-bold border border-[#E1D9F0]">
          Match: {(citation.score * 100).toFixed(1)}%
        </span>
      </div>

      <p className="text-[#4B506C] text-[11px] leading-relaxed italic line-clamp-3">
        "{citation.content}"
      </p>

      <div className="flex items-center justify-between text-[10px] font-mono text-[#8F92C0] pt-1.5 border-t border-[#E1D9F0]">
        <span className="truncate">{citation.document_name}</span>
        <span className="text-emerald-700 font-bold flex items-center gap-0.5">
          <CheckCircle className="w-3 h-3" />
          Local Grounded
        </span>
      </div>
    </div>
  );
};
