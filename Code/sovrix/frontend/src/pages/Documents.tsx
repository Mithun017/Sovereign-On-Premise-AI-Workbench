import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Scan, 
  CheckCircle2
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E1D9F0]">
        <div>
          <h1 className="text-xl font-extrabold text-[#121334] font-mono flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#5B4EB1]" />
            <span>CONFIDENTIAL DOCUMENT PIPELINE & LOCAL OCR</span>
          </h1>
          <p className="text-xs text-[#4B506C]">
            Air-gapped document ingestion, page decomposition, and local neural OCR text extraction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5B4EB1] hover:bg-[#4F46E5] text-white font-bold text-xs cursor-pointer shadow-sm transition-all font-mono">
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
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#E1D9F0] text-xs shadow-sm focus-within:border-[#5B4EB1]">
              <Search className="w-4 h-4 text-[#8F92C0]" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search documents or departments..."
                className="bg-transparent text-[#121334] placeholder-[#8F92C0] focus:outline-none w-full font-medium"
              />
            </div>
            <button
              onClick={() => setFilterScanned(!filterScanned)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                filterScanned 
                  ? 'bg-[#E9D1F1] text-[#121334] border-[#5B4EB1]' 
                  : 'bg-[#FFFFFF] text-[#4B506C] border-[#E1D9F0] hover:text-[#121334]'
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
                      ? 'bg-[#E9D1F1] border-[#5B4EB1] text-[#121334] shadow-sm'
                      : 'bg-[#FFFFFF] border-[#E1D9F0] text-[#1A1B3B] hover:border-[#8F92C0]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#121334] truncate text-xs">{doc.original_name}</h4>
                      <span className="text-[10px] font-mono text-[#4B506C] block mt-0.5">{doc.department}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#ECE1F3] text-[#5B4EB1] border border-[#E1D9F0] shrink-0">
                      {doc.file_type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E1D9F0] text-[10px] font-mono text-[#4B506C]">
                    <span>{doc.page_count} Pages</span>
                    <span className={doc.ocr_processed ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
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
            <div className="p-6 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm space-y-5">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E1D9F0]">
                <div>
                  <h3 className="text-base font-bold text-[#121334]">{selectedDoc.original_name}</h3>
                  <div className="flex items-center gap-3 text-xs text-[#4B506C] font-mono mt-1">
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
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5B4EB1] hover:bg-[#4F46E5] text-white font-mono text-xs font-bold transition-all shadow-sm"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>{isProcessingOcr ? 'Running Neural OCR...' : 'Execute Local OCR'}</span>
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-mono text-emerald-800 px-2.5 py-1 rounded bg-emerald-100 border border-emerald-300 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>OCR Complete (Local)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Extracted Text Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#4B506C]">
                  <span className="font-bold uppercase tracking-wider text-[#121334]">Page-by-Page Extracted Content:</span>
                  <span className="text-emerald-700 font-bold">0 Remote Telemetry</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E1D9F0] text-xs font-mono text-[#1A1B3B] leading-relaxed max-h-[420px] overflow-y-auto whitespace-pre-wrap shadow-inner">
                  {selectedDoc.extracted_text || (
                    <div className="text-center py-12 text-[#8F92C0]">
                      No text extracted yet. Click "Execute Local OCR" above to process page scans.
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#ECE1F3]/60 border border-[#E1D9F0] text-[11px] font-mono text-[#4B506C] flex items-center justify-between">
                <span>LOCAL ENGINE: Sovrix Air-Gapped Neural Pipeline</span>
                <span className="text-[#5B4EB1] font-bold">Zero Cloud Ingress/Egress</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-center text-xs font-mono text-[#8F92C0] rounded-2xl border border-[#E1D9F0] bg-[#FCFBFF]">
              Select a document on the left to inspect metadata and OCR output.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
