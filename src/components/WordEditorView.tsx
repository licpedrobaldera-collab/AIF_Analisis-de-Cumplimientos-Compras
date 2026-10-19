import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  Trash2, 
  Save, 
  ShieldCheck, 
  KeyRound, 
  Sparkles, 
  RefreshCw, 
  Scale, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { AuditReportData, generateWordDocument } from '../utils/exportWord';
import { generateAuthenticatedPdf } from '../utils/exportPdf';
import { exportForensicMatrixToExcel } from '../utils/exportExcel';
import { ForensicFinding, LegalViolation } from '../types';

interface WordEditorViewProps {
  initialReportData: AuditReportData;
  isLinkedToUsa: boolean;
  onSyncWithUsa: () => void;
  syncing: boolean;
}

export const WordEditorView: React.FC<WordEditorViewProps> = ({
  initialReportData,
  isLinkedToUsa,
  onSyncWithUsa,
  syncing,
}) => {
  const [report, setReport] = useState<AuditReportData>(initialReportData);
  const [saveStatus, setSaveStatus] = useState<'Guardado' | 'Modificado' | 'Sincronizado'>('Guardado');
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Field updates
  const handleUpdateField = (field: keyof AuditReportData, value: any) => {
    setReport((prev) => ({ ...prev, [field]: value }));
    setSaveStatus('Modificado');
  };

  // Findings handlers
  const handleUpdateFinding = (index: number, key: keyof ForensicFinding, val: string) => {
    const updated = [...report.forensicFindings];
    updated[index] = { ...updated[index], [key]: val };
    setReport((prev) => ({ ...prev, forensicFindings: updated }));
    setSaveStatus('Modificado');
  };

  const handleAddFinding = () => {
    const newFinding: ForensicFinding = {
      Tipo: 'Forense',
      Riesgo: 'Alto',
      Bandera: 'Nueva Bandera Forense',
      Impacto: 'Riesgo de cumplimiento normativo',
      Acción: 'Investigación y solicitud de expediente íntegro',
      Evidencia: 'Observación documental en pliego de condiciones',
    };
    setReport((prev) => ({
      ...prev,
      forensicFindings: [...prev.forensicFindings, newFinding],
    }));
    setSaveStatus('Modificado');
  };

  const handleDeleteFinding = (index: number) => {
    setReport((prev) => ({
      ...prev,
      forensicFindings: prev.forensicFindings.filter((_, i) => i !== index),
    }));
    setSaveStatus('Modificado');
  };

  // Save draft
  const handleSaveDraft = () => {
    localStorage.setItem(`BASA_V7_REPORT_${report.tenderCode}`, JSON.stringify(report));
    setSaveStatus('Guardado');
  };

  // Export to authentic .docx
  const handleDownloadWord = async () => {
    try {
      setIsExportingWord(true);
      const blob = await generateWordDocument(report);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Dictamen_Forense_${report.tenderCode.replace(/[^a-zA-Z0-9_-]/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Word export error:', err);
    } finally {
      setIsExportingWord(false);
    }
  };

  // Export to authentic signed PDF
  const handleDownloadPdf = () => {
    setIsExportingPdf(true);
    try {
      generateAuthenticatedPdf(report);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Document Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 sticky top-24 z-40 shadow-xl backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">
                Editor Pericial de Informe Forense en Línea (Word & PDF)
              </h2>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                saveStatus === 'Guardado'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {saveStatus.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Modifique, añada o elimine hallazgos y genere el informe oficial editable con firma digital
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSaveDraft}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Guardar Borrador</span>
          </button>

          <button
            onClick={handleDownloadWord}
            disabled={isExportingWord}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isExportingWord ? 'Generando .docx...' : 'Exportar Word (.docx)'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar PDF Firmado</span>
          </button>

          <button
            onClick={() => exportForensicMatrixToExcel(report.forensicFindings, report.tenderCode)}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Matriz Excel</span>
          </button>

          {isLinkedToUsa && (
            <button
              onClick={onSyncWithUsa}
              disabled={syncing}
              className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              title="Sincronizar bidireccionalmente con Audit Intelligence USA"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>Sincronizar USA</span>
            </button>
          )}
        </div>
      </div>

      {/* Editable Document Canvas (Styled like official pericial paper) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-5xl mx-auto shadow-2xl space-y-6 text-slate-200">
        {/* Document Header Bar */}
        <div className="border-b-2 border-amber-500 pb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
              BASA V7 FORENSIC INTELLIGENCE PLATFORM
            </div>
            <div className="text-xs text-slate-400 font-mono">
              AUDIT INTELLIGENCE USA / DGCP DOMINICANA COMPLIANCE SUITE
            </div>
            <input
              type="text"
              value={report.reportTitle}
              onChange={(e) => handleUpdateField('reportTitle', e.target.value)}
              className="mt-2 text-lg font-bold text-white bg-transparent border-b border-dashed border-slate-700 focus:border-amber-400 focus:outline-none w-full"
            />
          </div>

          <div className="text-right space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">FIRMA DIGITAL AUTENTICADA</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Algoritmo: SHA-256 / AES-256-GCM
            </div>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 block">Código del Proceso:</span>
            <input
              type="text"
              value={report.tenderCode}
              onChange={(e) => handleUpdateField('tenderCode', e.target.value)}
              className="w-full bg-transparent text-amber-300 font-bold focus:outline-none border-b border-transparent focus:border-amber-500"
            />
          </div>

          <div>
            <span className="text-slate-500 block">Entidad Convocante:</span>
            <input
              type="text"
              value={report.entity}
              onChange={(e) => handleUpdateField('entity', e.target.value)}
              className="w-full bg-transparent text-slate-200 focus:outline-none border-b border-transparent focus:border-amber-500"
            />
          </div>

          <div>
            <span className="text-slate-500 block">Marco Legal Aplicable:</span>
            <input
              type="text"
              value={report.legalFramework}
              onChange={(e) => handleUpdateField('legalFramework', e.target.value)}
              className="w-full bg-transparent text-slate-300 focus:outline-none border-b border-transparent focus:border-amber-500"
            />
          </div>

          <div>
            <span className="text-slate-500 block">Jurisdicción / País:</span>
            <input
              type="text"
              value={report.countryName}
              onChange={(e) => handleUpdateField('countryName', e.target.value)}
              className="w-full bg-transparent text-slate-300 focus:outline-none border-b border-transparent focus:border-amber-500"
            />
          </div>

          <div className="md:col-span-2">
            <span className="text-slate-500 block">Objeto de Contratación:</span>
            <input
              type="text"
              value={report.tenderTitle}
              onChange={(e) => handleUpdateField('tenderTitle', e.target.value)}
              className="w-full bg-transparent text-slate-200 font-sans font-medium focus:outline-none border-b border-transparent focus:border-amber-500"
            />
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
            1. Resumen Ejecutivo y Dictamen Pericial:
          </label>
          <textarea
            rows={4}
            value={report.executiveSummary}
            onChange={(e) => handleUpdateField('executiveSummary', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-200 leading-relaxed focus:border-amber-500 focus:outline-none font-sans"
          />
        </div>

        {/* Section 2: Forensic Findings Matrix */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
              2. Matriz de Hallazgos Forenses (Editable en Línea):
            </label>
            <button
              onClick={handleAddFinding}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Hallazgo</span>
            </button>
          </div>

          <div className="space-y-3">
            {report.forensicFindings.map((finding, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3 text-xs relative group">
                <button
                  onClick={() => handleDeleteFinding(idx)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1"
                  title="Eliminar este hallazgo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pr-6">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase block mb-0.5">Tipo:</label>
                    <input
                      type="text"
                      value={finding.Tipo}
                      onChange={(e) => handleUpdateFinding(idx, 'Tipo', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 font-mono text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 uppercase block mb-0.5">Nivel de Riesgo:</label>
                    <select
                      value={finding.Riesgo}
                      onChange={(e) => handleUpdateFinding(idx, 'Riesgo', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-amber-400 font-bold text-xs focus:border-amber-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Crítico">Crítico</option>
                      <option value="Alto">Alto</option>
                      <option value="Medio">Medio</option>
                      <option value="Bajo">Bajo</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] text-slate-500 uppercase block mb-0.5">Bandera Roja:</label>
                    <input
                      type="text"
                      value={finding.Bandera}
                      onChange={(e) => handleUpdateFinding(idx, 'Bandera', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-amber-300 font-bold text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-0.5">Impacto Identificado:</label>
                  <input
                    type="text"
                    value={finding.Impacto}
                    onChange={(e) => handleUpdateFinding(idx, 'Impacto', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-300 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase block mb-0.5">Acción Requerida:</label>
                    <input
                      type="text"
                      value={finding.Acción}
                      onChange={(e) => handleUpdateFinding(idx, 'Acción', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-medium text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 uppercase block mb-0.5">Evidencia Sustentante:</label>
                    <input
                      type="text"
                      value={finding.Evidencia || ''}
                      onChange={(e) => handleUpdateFinding(idx, 'Evidencia', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-400 font-mono text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Legal Violations */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
            3. Vulneraciones Normativas y Artículos Violados:
          </label>
          <div className="space-y-2">
            {report.legalViolations.map((v, idx) => (
              <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-amber-400">{v.article}</span> - <span className="text-slate-400">{v.norm}</span>
                  <div className="text-slate-200 mt-0.5">{v.description}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold uppercase">
                  {v.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Signature Block */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div>
            <div className="text-slate-500">Perito Responsable:</div>
            <div className="font-bold text-white">{report.author} ({report.role})</div>
            <div className="text-slate-400">{report.organization}</div>
          </div>

          <div className="text-right">
            <div className="text-slate-500">Hash SHA-256 / AES-256:</div>
            <div className="text-amber-400 font-mono text-[11px] truncate max-w-xs">{report.aes256Hash}</div>
            <div className="text-emerald-400 text-[10px] flex items-center justify-end gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>Sello Criptográfico Inmutable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
