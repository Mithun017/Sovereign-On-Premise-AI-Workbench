import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Layers, 
  CheckCircle2, 
  FolderPlus, 
  FileCheck, 
  ShieldCheck,
  Tag,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { KnowledgeCollection, KnowledgeCitation } from '../types';
import { CitationCard } from '../components/CitationCard';

export const KnowledgeBase: React.FC = () => {
  const [collections, setCollections] = useState<KnowledgeCollection[]>([]);
  const [searchQuery, setSearchQuery] = useState('Minimum allowable wall thickness crude transfer line');
  const [searchResults, setSearchResults] = useState<KnowledgeCitation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');

  useEffect(() => {
    loadCollections();
    handleSearch();
  }, []);

  const loadCollections = async () => {
    try {
      const data = await api.getCollections();
      setCollections(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await api.searchKnowledge({
        query: searchQuery,
        collection_id: selectedCollectionId || undefined,
        top_k: 5
      });
      setSearchResults(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>SOVEREIGN ENTERPRISE KNOWLEDGE BASE</span>
          </h1>
          <p className="text-xs text-slate-400">
            Local vector embeddings, pgvector store, hybrid BM25 + semantic retrieval, and citation verification.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800">
          <ShieldCheck className="w-4 h-4" />
          <span>Local pgvector Array (Air-Gapped)</span>
        </div>
      </div>

      {/* Collections Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 font-mono uppercase">
            Indexed Knowledge Collections
          </span>
          <span className="text-xs text-slate-500 font-mono">{collections.length} Collections</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collections.map(col => {
            const isSelected = selectedCollectionId === col.id;
            return (
              <div
                key={col.id}
                onClick={() => setSelectedCollectionId(isSelected ? '' : col.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-950/70 border-indigo-500 text-indigo-100 shadow-panel'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-sm text-slate-100">{col.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-bold border border-slate-700">
                    {col.chunk_count} Chunks
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{col.description}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-3 mt-3 border-t border-slate-800/80">
                  <span>Dept: {col.department}</span>
                  <span className="text-cyan-400">{col.access_level}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hybrid Search Sandbox */}
      <div className="p-6 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-100 font-mono uppercase flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Hybrid Semantic & Lexical Vector Search Testbench</span>
          </h3>
          <p className="text-xs text-slate-400">
            Query standard operating procedures, manuals, and statutory compliance documents with exact citations.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus-within:border-cyan-500 transition-all">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="e.g. Minimum allowable wall thickness crude transfer line SOP-INS-2025"
              className="bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none w-full font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs font-mono transition-all shadow-md shrink-0"
          >
            {isSearching ? 'Searching pgvector...' : 'Execute Vector Search'}
          </button>
        </form>

        {/* Results List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
            <span>Search Results ({searchResults.length} Grounded Excerpts Found)</span>
            <span className="text-emerald-400">0 Remote Telemetry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((item, idx) => (
              <CitationCard key={item.chunk_id || idx} citation={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
