import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Plus
} from 'lucide-react';
import { api } from '../services/api';
import { DeliverableItem } from '../types';
import { DeliverableCard } from '../components/DeliverableCard';

export const Deliverables: React.FC = () => {
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'DOCX' | 'XLSX' | 'PPTX' | 'PDF'>('ALL');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadDeliverables();
  }, []);

  const loadDeliverables = async () => {
    try {
      const data = await api.getDeliverables();
      setDeliverables(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateWordNote = async () => {
    setIsGenerating(true);
    try {
      const deliv = await api.generateWord({
        title: "Emergency Technical Approval Note - CDU Transfer Line",
        subject: "Sanction for Ultrasonic NDT Verification & Segment Replacement on Pipeline #PL-4820-A",
        background: "During turnaround inspection at CDU-101 Unit 04, ultrasonic wall thickness surveying identified localized thinning at elbow junction EB-04B.",
        references: ["[SOP-INS-2025, Page 18, Section 4.2]", "[IR-2026-8924 Dated 24-Sep-2026]", "API-570 Piping Inspection Code"],
        findings: [
          "Ultrasonic wall thickness measured at 3.42 mm (Nominal: 9.52 mm).",
          "Statutory MAWT is 4.50 mm. Calculated absolute deficit is 1.08 mm (24.0% below limit).",
          "Severe localized pitting corrosion observed on outer bend radius."
        ],
        technical_assessment: "The component has exceeded statutory safe operating life. Continued pressurized operation at 28.5 Bar poses imminent risk of hydrocarbon containment breach.",
        financial_impact: "Estimated repair, fabrication, NDT, and emergency mechanical overhaul cost: $35,500.",
        risk_matrix: "CRITICAL PRIORITY - Immediate bypass isolation and 48-hour mechanical replacement mandatory.",
        recommendation: "Approve Emergency Work Order WO-REF-9021 for Schedule 80 ASTM A106-B elbow spool fabrication.",
        approval_requested: "Chief General Manager (Inspection & Reliability)"
      });
      setDeliverables(prev => [deliv, ...prev]);
    } catch (e: any) {
      alert(`Generation failed: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateExcel = async () => {
    setIsGenerating(true);
    try {
      const deliv = await api.generateExcel({
        title: "Refinery Equipment Downtime & Availability Matrix",
        sheet_name: "Downtime_Metrics",
        columns: ["Incident ID", "Equipment Tag", "Unit", "Downtime (Hrs)", "Severity", "Failure Cause"],
        rows: [
          ["INC-801", "P-101A", "CDU-101", 4.0, "CRITICAL", "Mechanical Seal Leak"],
          ["INC-802", "E-104", "CDU-101", 2.0, "MEDIUM", "Fouling & Delta-P"],
          ["INC-803", "P-101B", "CDU-101", 1.5, "LOW", "Vibration Sensor Drift"],
          ["INC-804", "V-102", "CDU-101", 3.0, "HIGH", "Level Controller Trip"],
          ["INC-805", "P-101A", "CDU-101", 8.0, "CRITICAL", "Bearing Overheat"]
        ]
      });
      setDeliverables(prev => [deliv, ...prev]);
    } catch (e: any) {
      alert(`Generation failed: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreatePowerPoint = async () => {
    setIsGenerating(true);
    try {
      const deliv = await api.generatePowerPoint({
        title: "Refinery Asset Reliability Briefing",
        subtitle: "Unit Turnaround Integrity Audit & Equipment Availability Review",
        slides: [
          {
            title: "Executive Summary",
            bullets: [
              "Completed non-destructive ultrasonic testing on Crude Distillation Unit CDU-101.",
              "Identified localized thinning on elbow bend EB-04B below MAWT threshold.",
              "Recommended emergency replacement with Schedule 80 ASTM A106-B components."
            ]
          },
          {
            title: "Reliability Statistics",
            bullets: [
              "Overall unit availability calculated at 97.43% for current operating cycle.",
              "Total plant downtime logged across 5 incidents: 18.50 hours.",
              "Pumps P-101A/B accounted for 64% of total downtime."
            ]
          },
          {
            title: "Action Plan & Next Steps",
            bullets: [
              "Commission 48-hour mechanical overhaul during scheduled low-throughput window.",
              "Perform 100% radiographic weld testing prior to re-pressurization."
            ]
          }
        ]
      });
      setDeliverables(prev => [deliv, ...prev]);
    } catch (e: any) {
      alert(`Generation failed: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const filtered = deliverables.filter(d => activeTab === 'ALL' || d.file_type === activeTab);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E1D9F0]">
        <div>
          <h1 className="text-xl font-extrabold text-[#121334] font-mono flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#5B4EB1]" />
            <span>DOCUMENT FACTORY & GENERATED DELIVERABLES</span>
          </h1>
          <p className="text-xs text-[#4B506C]">
            Real binary file generation for enterprise approval notes (.DOCX), analytics (.XLSX), presentations (.PPTX), and reports (.PDF).
          </p>
        </div>

        {/* Instant Generator Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateWordNote}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-mono transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Word Note (.DOCX)</span>
          </button>
          <button
            onClick={handleCreateExcel}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Excel Sheet (.XLSX)</span>
          </button>
          <button
            onClick={handleCreatePowerPoint}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs font-mono transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>PowerPoint (.PPTX)</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-[#E1D9F0] pb-2 text-xs font-mono">
        {(['ALL', 'DOCX', 'XLSX', 'PPTX', 'PDF'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === tab
                ? 'bg-[#E9D1F1] text-[#121334] border border-[#5B4EB1]'
                : 'text-[#4B506C] hover:text-[#121334] hover:bg-[#ECE1F3]'
            }`}
          >
            {tab} Files
          </button>
        ))}
      </div>

      {/* Deliverables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(d => (
          <DeliverableCard key={d.id} deliverable={d} />
        ))}
      </div>
    </div>
  );
};
