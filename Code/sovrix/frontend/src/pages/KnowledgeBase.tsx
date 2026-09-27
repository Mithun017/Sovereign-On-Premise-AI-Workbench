import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  ShieldCheck
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E1D9F0]">
        <div>
          <h1 className="text-xl font-extrabold text-[#121334] font-mono flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#5B4EB1]" />
            <span>SOVEREIGN ENTERPRISE KNOWLEDGE BASE</span>
          </h1>
          <p className="text-xs text-[#4B506C]">
            Local vector embeddings, pgvector store, hybrid BM25 + semantic retrieval, and citation verification.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 font-bold shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Local pgvector Array (Air-Gapped)</span>
        </div>
      </div>

      {/* Collections Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#121334] font-mono uppercase">
            Indexed Knowledge Collections
          </span>
          <span className="text-xs text-[#4B506C] font-mono">{collections.length} Collections</span>
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
                    ? 'bg-[#E9D1F1] border-[#5B4EB1] text-[#121334] shadow-sm'
                    : 'bg-[#FCFBFF] border-[#E1D9F0] text-[#1A1B3B] hover:border-[#8F92C0]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-sm text-[#121334]">{col.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECE1F3] text-[#5B4EB1] font-bold border border-[#E1D9F0]">
                    {col.chunk_count} Chunks
                  </span>
                </div>
                <p className="text-xs text-[#4B506C] mt-2 line-clamp-2">{col.description}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8F92C0] pt-3 mt-3 border-t border-[#E1D9F0]">
                  <span>Dept: {col.department}</span>
                  <span className="text-[#5B4EB1] font-semibold">{col.access_level}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hybrid Search Sandbox */}
      <div className="p-6 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm space-y-6">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#121334] font-mono uppercase flex items-center gap-2">
            <Search className="w-4 h-4 text-[#5B4EB1]" />
            <span>Hybrid Semantic & Lexical Vector Search Testbench</span>
          </h3>
          <p className="text-xs text-[#4B506C]">
            Query standard operating procedures, manuals, and statutory compliance documents with exact citations.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E1D9F0] focus-within:border-[#5B4EB1] transition-all shadow-sm">
            <Search className="w-4 h-4 text-[#8F92C0] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="e.g. Minimum allowable wall thickness crude transfer line SOP-INS-2025"
              className="bg-transparent text-xs text-[#121334] placeholder-[#8F92C0] focus:outline-none w-full font-sans font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-2.5 rounded-xl bg-[#5B4EB1] hover:bg-[#4F46E5] text-white font-bold text-xs font-mono transition-all shadow-sm shrink-0"
          >
            {isSearching ? 'Searching pgvector...' : 'Execute Vector Search'}
          </button>
        </form>

        {/* Results List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#4B506C] pb-2 border-b border-[#E1D9F0]">
            <span>Search Results ({searchResults.length} Grounded Excerpts Found)</span>
            <span className="text-emerald-700 font-bold">0 Remote Telemetry</span>
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
