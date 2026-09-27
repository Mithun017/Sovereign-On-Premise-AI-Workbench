import React from 'react';
import { BookOpen, ExternalLink, CheckCircle } from 'lucide-react';
import { KnowledgeCitation } from '../types';

interface CitationCardProps {
  citation: KnowledgeCitation;
}

export const CitationCard: React.FC<CitationCardProps> = ({ citation }) => {
  return (
    <div className="p-3 rounded-lg bg-slate-900/90 border border-indigo-500/30 text-xs font-sans space-y-2 hover:border-indigo-400 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-mono text-indigo-300 font-bold">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>{citation.citation}</span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
          Match: {(citation.score * 100).toFixed(1)}%
        </span>
      </div>

      <p className="text-slate-300 text-[11px] leading-relaxed italic line-clamp-3">
        "{citation.content}"
      </p>

      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
        <span className="truncate">{citation.document_name}</span>
        <span className="text-emerald-400 flex items-center gap-0.5">
          <CheckCircle className="w-3 h-3" />
          Local Grounded
        </span>
      </div>
    </div>
  );
};
