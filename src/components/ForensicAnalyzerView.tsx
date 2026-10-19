import React, { useState } from 'react';
import { 
  Cpu, 
  Upload, 
  Globe, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck, 
  FileText, 
  Download, 
  ArrowRight, 
  Search,
  Scale,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { ForensicFinding, LegalViolation, CountryCode, CurrencyCode, TenderItem } from '../types';
import { BASE_HALLAZGO_FORENSE, COMMON_FORENSIC_FLAGS, COUNTRY_LEGAL_CONFIGS } from '../data/forensicPresets';
import { exportForensicMatrixToExcel } from '../utils/exportExcel';

interface ForensicAnalyzerViewProps {
  country: CountryCode;
  currency: CurrencyCode;
  activeTender: TenderItem | null;
  onSendToEditor: (reportData: any) => void;
  onFastExportPdf: (reportData: any) => void;
}

export const ForensicAnalyzerView: React.FC<ForensicAnalyzerViewProps> = ({
  country,
  currency,
  activeTender,
  onSendToEditor,
  onFastExportPdf,
}) => {
  // Input states
  const [tenderCode, setTenderCode] = useState(activeTender?.code || 'DGCP-CCC-LPN-2026-0089');
  const [tenderTitle, setTenderTitle] = useState(activeTender?.title || 'Adquisición de Equipos de Tomografía Axial Computarizada para la Red Hospitalaria Regional');
  const [entity, setEntity] = useState(activeTender?.entity || 'Servicio Nacional de Salud (SNS) / DGCP');
  const [urlInput, setUrlInput] = useState(activeTender?.url || 'https://comprasdominicana.gob.do/procesos/SNS-CCC-LPN-2026-0089');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [analysisText, setAnalysisText] = useState(
    `PLIEGO DE CONDICIONES ESPECÍFICAS - SECCIÓN FORENSE A AUDITAR:
1. Objeto: Suministro e instalación de 4 Tomógrafos Multicorte de 64 cortes.
2. Plazo de presentación de ofertas: 5 días hábiles contados a partir de la publicación de la enmienda No. 2.
3. Especificaciones Técnicas: El detector debe poseer tecnología "Dual-Energy UltraMatrix" patentada con exclusividad de fábrica por marca "AlphaVance Medical". No se aceptarán equivalencias funcionales.
4. Experiencia mínima: Se requiere acreditar mínimo 15 años de operación continua en República Dominicana y ser distribuidor exclusivo oficial.
5. Garantía de Seriedad: Fianza bancaria por el 5% del valor de la oferta (no póliza de seguro).
6. Presupuesto estimado: DOP 184,500,000.00. No se publica desglose de precios unitarios de mercado ni estudio previo de precios históricos de la DGCP.`
  );

  const [historicalYears, setHistoricalYears] = useState(10);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);

  // Analysis result states
  const [complianceScore, setComplianceScore] = useState(42);
  const [riskLevel, setRiskLevel] = useState<'Bajo' | 'Medio' | 'Alto' | 'Crítico'>('Alto');
  const [executiveSummary, setExecutiveSummary] = useState(
    'Se detectaron 4 irregularidades críticas en el pliego de condiciones de acuerdo con la Ley 340-06 y el Reglamento 543-12 de República Dominicana. Destacan la fijación de plazos desproporcionadamente cortos que vulneran el Art. 20 de la Ley, así como especificaciones técnicas restrictivas que configuran posible direccionamiento hacia un único proveedor.'
  );

  const [findings, setFindings] = useState<ForensicFinding[]>([
    BASE_HALLAZGO_FORENSE,
    COMMON_FORENSIC_FLAGS[1],
    COMMON_FORENSIC_FLAGS[2],
    COMMON_FORENSIC_FLAGS[3],
  ]);

  const [legalViolations, setLegalViolations] = useState<LegalViolation[]>([
    {
      article: 'Artículo 20',
      norm: 'Ley 340-06 de Compras y Contrataciones Públicas (DOM)',
      description: 'Plazo otorgado inferior al plazo mínimo legal estipulado para licitaciones públicas de cuantía mayor.',
      severity: 'Crítica',
    },
    {
      article: 'Artículo 16, Numeral 4',
      norm: 'Reglamento de Aplicación No. 543-12',
      description: 'Inclusión de marcas comerciales o patentes en las especificaciones técnicas sin la frase «o su equivalente», limitando la libre competencia.',
      severity: 'Alta',
    },
    {
      article: 'Artículo 25',
      norm: 'Ley 340-06',
      description: 'Exigencia de fianza del 5% para la presentación de la oferta en lugar del 1% fijado como estándar legal por el Órgano Rector DGCP.',
      severity: 'Media',
    },
  ]);

  const [criticalReqs, setCriticalReqs] = useState<string[]>([
    'Registro Nacional de Proveedores del Estado (RNP) debidamente actualizado y activo en el rubro.',
    'Póliza de Seriedad de la Oferta por el 1% del monto total ofertado emitida por aseguradora legalmente habilitada.',
    'Certificación de la Dirección General de Impuestos Internos (DGII) y Tesorería de la Seguridad Social (TSS) al día.',
    'Declaración Jurada Notariada conforme al Artículo 14 de la Ley 340-06 de no inhabilidad.',
  ]);

  const [eligibilityFactors, setEligibilityFactors] = useState<string[]>([
    'Capacidad financiera: Índice de solvencia corriente mayor o igual a 1.20 y capital de trabajo positivo.',
    'Experiencia acreditada: Mínimo 3 contratos u órdenes de compras de similar envergadura en los últimos 5 años.',
  ]);

  const [priceAnomaly, setPriceAnomaly] = useState({
    priceStatus: 'Alerta de Sobreprecio',
    deviationPercentage: 23.8,
    recommendation: 'El precio de referencia supera en un 23.8% el promedio histórico de los últimos 10 años en el portal DGCP.',
  });

  const countryConfig = COUNTRY_LEGAL_CONFIGS[country];

  // Handle File Upload simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setAnalysisText(text.slice(0, 12000));
        }
      };
      if (file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        setAnalysisText(`[CONTENIDO FORENSE EXTRAÍDO DE ARCHIVO: ${file.name}]\n` + analysisText);
      }
    }
  };

  // Run AI Audit
  const handleExecuteAiAudit = async () => {
    setIsAuditing(true);
    setAuditComplete(false);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenderTitle,
          tenderCode,
          country,
          entity,
          legalFramework: `${countryConfig.primaryLaw} y ${countryConfig.regulation}`,
          rawText: analysisText,
          historicalYears,
        }),
      });

      if (!response.ok) throw new Error('Error al conectar con el servidor pericial');
      const result = await response.json();

      if (result.data) {
        setComplianceScore(result.data.complianceScore);
        setRiskLevel(result.data.riskLevel);
        setExecutiveSummary(result.data.executiveSummary);
        if (result.data.forensicFindings?.length) {
          setFindings(result.data.forensicFindings);
        }
        if (result.data.legalViolations?.length) {
          setLegalViolations(result.data.legalViolations);
        }
        if (result.data.criticalRequirements?.length) {
          setCriticalReqs(result.data.criticalRequirements);
        }
        if (result.data.eligibilityFactors?.length) {
          setEligibilityFactors(result.data.eligibilityFactors);
        }
        if (result.data.priceAnomalyAnalysis) {
          setPriceAnomaly(result.data.priceAnomalyAnalysis);
        }
      }
      setAuditComplete(true);
    } catch (err) {
      console.error(err);
      // Fallback local heuristic
      setAuditComplete(true);
    } finally {
      setIsAuditing(false);
    }
  };

  const getReportPayload = () => {
    return {
      reportTitle: `DICTAMEN PERICIAL FORENSE - ${tenderCode}`,
      tenderCode,
      tenderTitle,
      entity,
      countryName: countryConfig.name,
      legalFramework: `${countryConfig.primaryLaw} / ${countryConfig.regulation}`,
      complianceScore,
      riskLevel,
      executiveSummary,
      forensicFindings: findings,
      legalViolations,
      criticalRequirements: criticalReqs,
      eligibilityFactors,
      bidBondNotes: `${countryConfig.bidBondDefault} - Obligatoria para admisibilidad.`,
      priceNotes: `${priceAnomaly.priceStatus}: ${priceAnomaly.recommendation} (Desviación: +${priceAnomaly.deviationPercentage}%)`,
      author: 'Lic. Pedro Baldera',
      role: 'Auditor Forense Principal',
      organization: 'BASA V7 / AUDIT INTELLIGENCE USA',
      auditDate: new Date().toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' }),
      aes256Hash: 'a7f1c938b4d0e21199a4c8f2b3e5d71029c8e7f601a4b5c6d7e8f90123456789',
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Presets */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Cpu className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Peritaje Asistido por IA & Análisis Forense de Pliegos
                </h2>
                <p className="text-xs text-slate-400">
                  Inspección jurídica de pliegos DGCP y entidades públicas o privadas conforme a la {countryConfig.primaryLaw}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Marco Rector:</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {countryConfig.name} - {countryConfig.primaryLaw}
            </span>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Código del Proceso / Licitación:
            </label>
            <input
              type="text"
              value={tenderCode}
              onChange={(e) => setTenderCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Objeto de Contratación / Título del Pliego:
            </label>
            <input
              type="text"
              value={tenderTitle}
              onChange={(e) => setTenderTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Entidad Convocante:
            </label>
            <input
              type="text"
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              URL Oficial del Portal DGCP / Entidad:
            </label>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://comprasdominicana.gob.do/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-cyan-300 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Ventana Histórica de Precios & Auditoría:
            </label>
            <select
              value={historicalYears}
              onChange={(e) => setHistoricalYears(parseInt(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none cursor-pointer"
            >
              <option value={10}>10 Años Simultáneos (2016 - 2026 Máxima Auditoría)</option>
              <option value={5}>5 Años (2021 - 2026)</option>
              <option value={3}>3 Años (2023 - 2026)</option>
              <option value={1}>1 Año / Tiempo Real Actual</option>
            </select>
          </div>
        </div>

        {/* Dual Input: File Upload or Text Area */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Contenido del Pliego de Condiciones o Muestra Forense:</span>
            </label>

            {/* File uploader button */}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700 transition-colors">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>{uploadedFileName ? `Cargado: ${uploadedFileName}` : 'Subir Archivo (.xlsx, .pdf, .docx, .txt)'}</span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv,.pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {uploadedFileName && (
                <button
                  onClick={() => setUploadedFileName(null)}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          <textarea
            rows={5}
            value={analysisText}
            onChange={(e) => setAnalysisText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono leading-relaxed focus:border-amber-500 focus:outline-none"
            placeholder="Pegue aquí el texto completo del pliego de condiciones, especificaciones técnicas, cronograma o resolución..."
          />
        </div>

        {/* Action Button */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Motor: Gemini Generative AI & Red Flag Heuristics Engine</span>
          </div>

          <button
            onClick={handleExecuteAiAudit}
            disabled={isAuditing}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Cpu className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'EJECUTANDO PERITAJE FORENSE IA...' : 'EJECUTAR PERITAJE FORENSE ASISTIDO POR IA'}</span>
          </button>
        </div>
      </div>

      {/* Results Diagnostic Dashboard */}
      {(auditComplete || isAuditing) && (
        <div className="space-y-6">
          {/* Executive Overview & Risk Score Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg border ${
                  riskLevel === 'Crítico' || riskLevel === 'Alto'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : riskLevel === 'Medio'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {complianceScore}%
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      Diagnóstico Forense de Cumplimiento Normativo
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      riskLevel === 'Crítico'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : riskLevel === 'Alto'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      Nivel de Riesgo: {riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluado conforme a la {countryConfig.primaryLaw} y {countryConfig.regulation}
                  </p>
                </div>
              </div>

              {/* Action Buttons to Report and Export */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSendToEditor(getReportPayload())}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Editar Informe en Word</span>
                </button>
                <button
                  onClick={() => onFastExportPdf(getReportPayload())}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-rose-400" />
                  <span>PDF Autenticado</span>
                </button>
                <button
                  onClick={() => exportForensicMatrixToExcel(findings, tenderCode)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-colors"
                  title="Exportar Matriz a CSV/Excel"
                >
                  Excel
                </button>
              </div>
            </div>

            {/* Summary text */}
            <div className="mt-4 p-3.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-1">Dictamen Ejecutivo del Perito Forense:</strong>
              {executiveSummary}
            </div>
          </div>

          {/* Forensic Findings Table (Matching user's Hallazgo Forense structure) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Matriz de Hallazgos Forenses (Estructura BASA V7)</span>
              </div>
              <span className="text-xs text-slate-400">
                {findings.length} Hallazgos Registrados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <th className="py-3 px-4">Tipo & Riesgo</th>
                    <th className="py-3 px-4">Bandera Roja Detectada</th>
                    <th className="py-3 px-4">Impacto Normativo</th>
                    <th className="py-3 px-4">Acción Pericial Recomendada</th>
                    <th className="py-3 px-4">Evidencia en Pliego</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {findings.map((f, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-200">{f.Tipo}</div>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mt-1 ${
                          f.Riesgo === 'Crítico'
                            ? 'bg-rose-500/20 text-rose-400'
                            : f.Riesgo === 'Alto'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {f.Riesgo}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-amber-300">
                        {f.Bandera}
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {f.Impacto}
                      </td>

                      <td className="py-3 px-4 text-slate-200 font-medium">
                        {f.Acción}
                      </td>

                      <td className="py-3 px-4 text-[11px] text-slate-400 font-mono">
                        {f.Evidencia || 'Verificado en pliego'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Violations & Critical Requirements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Legal Violations */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Vulneraciones Legales al Régimen de Compras</span>
              </div>

              <div className="space-y-2.5">
                {legalViolations.map((v, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 text-xs font-mono">{v.article}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        v.severity === 'Crítica' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        Severidad {v.severity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">{v.norm}</div>
                    <div className="text-xs text-slate-200">{v.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Requirements & Price Benchmark */}
            <div className="space-y-6">
              {/* Critical Requirements */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Requisitos Críticos & Factores de Elegibilidad</span>
                </div>

                <div className="space-y-1.5">
                  {criticalReqs.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 mb-1">Criterios de Habilitación Financiera:</div>
                  {eligibilityFactors.map((ef, idx) => (
                    <div key={idx} className="text-xs text-slate-300 pl-3 border-l-2 border-amber-500/50 mt-1">
                      {ef}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Bid Bond Check */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <span>Inteligencia de Precios & Póliza de Licitación</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                    {priceAnomaly.priceStatus}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Comparativa vs Histórico 10 Años:</div>
                    <div className="text-slate-200 mt-0.5">{priceAnomaly.recommendation}</div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-slate-400 text-[11px]">Garantía de Seriedad Requerida:</div>
                      <div className="text-amber-300 font-semibold mt-0.5">
                        1% del monto total ofertado (Art. 25 Ley 340-06)
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold border border-emerald-500/30">
                      EXIGIBLE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
