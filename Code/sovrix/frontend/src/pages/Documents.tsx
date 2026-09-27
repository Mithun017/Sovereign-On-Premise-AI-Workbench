import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Scan, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentItem } from '../types';

export const Documents: React.FC = () => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScanned, setFilterScanned] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await api.getDocuments();
      setDocs(data);
      if (data.length > 0 && !selectedDoc) {
        setSelectedDoc(data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const newDoc = await api.uploadDocument(file, 'Refinery Operations', file.name.endsWith('.pdf'));
      setDocs(prev => [newDoc, ...prev]);
      setSelectedDoc(newDoc);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunOcr = async (docId: string) => {
    setIsProcessingOcr(true);
    try {
      const ocrRes = await api.runOcr(docId);
      setDocs(prev => prev.map(d => d.id === docId ? { ...d, ocr_processed: true, extracted_text: ocrRes.extracted_text } : d));
      if (selectedDoc?.id === docId) {
        setSelectedDoc(prev => prev ? { ...prev, ocr_processed: true, extracted_text: ocrRes.extracted_text } : null);
      }
    } catch (err: any) {
      alert(`OCR failed: ${err.message}`);
    } finally {
      setIsProcessingOcr(false);
    }
  };

  const filteredDocs = docs.filter(d => {
    const matchesSearch = d.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.department.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterScanned) return matchesSearch && d.is_scanned;
    return matchesSearch;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>CONFIDENTIAL DOCUMENT PIPELINE & LOCAL OCR</span>
          </h1>
          <p className="text-xs text-slate-400">
            Air-gapped document ingestion, page decomposition, and local neural OCR text extraction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-cyan-600/20 transition-all font-mono">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload Document'}</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search documents or departments..."
                className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none w-full"
              />
            </div>
            <button
              onClick={() => setFilterScanned(!filterScanned)}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                filterScanned 
                  ? 'bg-purple-950 text-purple-300 border-purple-500/50' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Scanned
            </button>
          </div>

          {/* Document Cards */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
            {filteredDocs.map(doc => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-100 shadow-panel'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-100 truncate text-xs">{doc.original_name}</h4>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{doc.department}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 shrink-0">
                      {doc.file_type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                    <span>{doc.page_count} Pages</span>
                    <span className={doc.ocr_processed ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                      {doc.ocr_processed ? '✓ OCR Extracted' : 'Pending OCR'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail / Text Viewer (7 cols) */}
        <div className="lg:col-span-7">
          {selectedDoc ? (
            <div className="p-6 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl space-y-5">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-100">{selectedDoc.original_name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                    <span>Type: {selectedDoc.file_type}</span>
                    <span>•</span>
                    <span>Dept: {selectedDoc.department}</span>
                    <span>•</span>
                    <span>Pages: {selectedDoc.page_count}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!selectedDoc.ocr_processed ? (
                    <button
                      onClick={() => handleRunOcr(selectedDoc.id)}
                      disabled={isProcessingOcr}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-purple-600/20"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>{isProcessingOcr ? 'Running Neural OCR...' : 'Execute Local OCR'}</span>
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>OCR Complete (Local)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Extracted Text Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="font-bold uppercase tracking-wider">Page-by-Page Extracted Content:</span>
                  <span className="text-emerald-400">0 Remote Telemetry</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 text-xs font-mono text-slate-200 leading-relaxed max-h-[420px] overflow-y-auto whitespace-pre-wrap">
                  {selectedDoc.extracted_text || (
                    <div className="text-center py-12 text-slate-500">
                      No text extracted yet. Click "Execute Local OCR" above to process page scans.
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>LOCAL ENGINE: Sovrix Air-Gapped Neural Pipeline</span>
                <span className="text-cyan-400">Zero Cloud Ingress/Egress</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-center text-xs font-mono text-slate-500 rounded-2xl border border-slate-800">
              Select a document on the left to inspect metadata and OCR output.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
