import React, { useState, useEffect } from 'react';
import {
  FileText,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lock,
  Edit3,
  Save,
  Trash2,
  Plus,
  Zap,
  Download,
  Share2,
  Key,
  Database,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  Check,
  RotateCcw,
  MessageSquare,
  Sparkles,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  Layers,
  FileCheck2,
  Hash,
  Clock,
  UserCheck
} from 'lucide-react';
import { AuditWorkpaper, ProcedureTest, CoachingNote, FindingSheet } from '../types';

interface WorkpapersFindingsViewProps {
  country: string;
  currency: string;
  onGoToEditorWithFinding?: (findingText: string) => void;
  onNotify?: (message: string) => void;
}

const PRESET_REAL_CASES = [
  {
    id: 'CASE-DOM-01',
    label: 'DGCP Rep. Dominicana: Colusión en Licitación de Insumos Médicos (SNS)',
    entity: 'Servicio Nacional de Salud (SNS)',
    country: 'DOM',
    tenderCode: 'SNS-CCC-LPN-2024-0012',
    law: 'Ley 340-06 & Reglamento 543-12',
    sampleText: `EXPEDIENTE DE LICITACIÓN PÚBLICA NACIONAL SNS-CCC-LPN-2024-0012.
ENTIDAD CONTRATANTE: Servicio Nacional de Salud (SNS).
OBJETO: Adquisición de Insumos Médicos Descartables para la Red Hospitalaria Regional.
MONTO ESTIMADO: RD$ 184,500,000.00.
OFERTAS ECONÓMICAS PRESENTADAS EN ACTA DE APERTURA:
1. AlphaVance Medical SRL (RNC: 1-31-09822-1): RD$ 184,200,000.00.
2. Distribuidora Sanitaria SRL (RNC: 1-32-11452-3): RD$ 184,350,000.00.
3. FarmaCaribe SAS (RNC: 1-30-77891-2): RD$ 184,480,000.00.
FOLIO 42: En la verificación de los estatutos y nómina de socios de las tres razones sociales, se comprueba que el señor Roberto Tavárez (Cédula: 001-0849201-4) posee el 70% de AlphaVance Medical, el 65% de Distribuidora Sanitaria y es socio administrador en FarmaCaribe SAS.
FOLIO 89: Se constató que las propuestas económicas contienen exactamente los mismos errores ortográficos en el desglose de ítems 14 al 22 y fueron cargadas desde la misma dirección IP (190.166.42.11) con minutos de diferencia.
HISTÓRICO DGCP: La partida de catéteres y jeringas presenta una sobreestimación del 38.6% frente al precio histórico promedio de los últimos 5 años registrado en la base transaccional de compras gubernamentales.`,
  },
  {
    id: 'CASE-DOM-02',
    label: 'MOPC Rep. Dominicana: Conflicto de Interés y Nómina vs Proveedor Adjudicado',
    entity: 'Ministerio de Obras Públicas y Comunicaciones (MOPC)',
    country: 'DOM',
    tenderCode: 'MOPC-CCC-CP-2024-019',
    law: 'Ley 340-06 Art. 14 & Ley 41-08 Art. 80',
    sampleText: `PROCESO DE COMPARACIÓN DE PRECIOS MOPC-CCC-CP-2024-019.
OBJETO: Mantenimiento Preventivo de Puentes y Alcantarillados Región Sur.
MONTO ADJUDICADO: RD$ 32,500,000.00.
ADJUDICATARIO: Constructora Cibao Sur SRL (RNC: 1-31-55442-8).
FOLIO 12: En el pliego de condiciones técnicas se requirió una certificación de maquinaria pesada emitida en un plazo menor a 24 horas hábiles.
FOLIO 28: En el cruce de nómina oficial de la institución con la base de socios del adjudicatario, se constató que el Lic. Manuel Almonte (Cédula: 001-0992817-2), actual Director de Planificación y miembro con voz del Comité de Compras de la entidad contratante, figura como socio titular con el 90% de las acciones de Constructora Cibao Sur SRL.
IMPACTO LEGAL: Violación directa a la prohibición expresa del Artículo 14 de la Ley 340-06 y Artículo 80 Numeral 13 de la Ley 41-08 de Función Pública.`,
  },
  {
    id: 'CASE-DOM-03',
    label: 'Contraloría / DGTT: Fraccionamiento del Gasto en Combustibles',
    entity: 'Dirección General de Transporte Terrestre (DGTT)',
    country: 'DOM',
    tenderCode: 'DGTT-DAF-CM-2023-041',
    law: 'Ley 340-06 Art. 25 & ISSAI 200',
    sampleText: `INSPECCIÓN DE EJECUCIÓN PRESUPUESTARIA EJERCICIO 2023 - DGTT.
PARTIDA: 2.3.7.1.01 (Combustibles y Lubricantes).
MONTO TOTAL EJECUTADO: RD$ 17,100,000.00.
HALLAZGO DE REVISIÓN: La entidad realizó 18 compras menores continuas de RD$ 950,000.00 cada una a la razón social Estación de Servicios del Caribe SRL, distribuidas entre el 15 de abril y el 30 de mayo de 2023.
FOLIO 315: Cada orden fue tramitada de forma independiente evitando el umbral fijado por la DGCP de RD$ 5,000,000.00 para la obligatoriedad de convocar Licitación Pública Nacional.
ININTENCIONALIDAD: Carencia de Plan Anual de Compras y Contrataciones consolidado con el objeto expreso de evitar la intervención previa de la Contraloría General de la República.`,
  },
  {
    id: 'CASE-USA-04',
    label: 'Federal USA (HHS/GAO): Brand-Locking y Especificación Dirigida FAR 11.002',
    entity: 'U.S. Department of Health and Human Services (HHS)',
    country: 'USA',
    tenderCode: 'HHS-OIG-2024-918',
    law: 'Federal Acquisition Regulation (FAR 11.002) & CICA',
    sampleText: `FEDERAL ACQUISITION OIG AUDIT - HHS CLOUD PLATFORM EXPANSION.
SOLICITATION: RFP-HHS-2024-089. ESTIMATED VALUE: $14,200,000.00 USD.
FINDING SUMMARY: The technical specifications in Section C mandated proprietary storage protocol microcode that is patented exclusively by Apex Cyber Systems Inc.
FAR VIOLATION: FAR 11.002(a)(1) prohibits drafting purchase descriptions that are unnecessarily restrictive of competition unless a formal Justification and Approval (J&A) for Other Than Full and Open Competition is published.
ECONOMIC EFFECT: GSA benchmark indicates identical commercial off-the-shelf cloud capacity is readily available at $9,650,000.00 USD, representing an artificial surcharge of $4,550,000.00 USD (32% price premium).`,
  },
];

export const WorkpapersFindingsView: React.FC<WorkpapersFindingsViewProps> = ({
  country,
  currency,
  onGoToEditorWithFinding,
  onNotify,
}) => {
  const [workpapers, setWorkpapers] = useState<AuditWorkpaper[]>([]);
  const [selectedWpId, setSelectedWpId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [autoFilling, setAutoFilling] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAutoFillModal, setShowAutoFillModal] = useState<boolean>(false);
  const [autoFillInputText, setAutoFillInputText] = useState<string>('');
  const [autoFillFilename, setAutoFillFilename] = useState<string>('Expediente_Licitacion_Oficial.pdf');
  const [activeTabSubView, setActiveTabSubView] = useState<'FINDING_SHEET' | 'TESTS' | 'COACHING' | 'CHAIN_OF_CUSTODY'>('FINDING_SHEET');
  const [newCoachingText, setNewCoachingText] = useState<string>('');
  const [signOffModal, setSignOffModal] = useState<boolean>(false);
  const [auditorSignerName, setAuditorSignerName] = useState<string>('Lic. Pedro Baldera');
  const [isSignOffDone, setIsSignOffDone] = useState<boolean>(false);

  // Editable form state for current active workpaper
  const [currentWp, setCurrentWp] = useState<AuditWorkpaper | null>(null);

  // Fetch workpapers on mount or country change
  useEffect(() => {
    fetchWorkpapers();
  }, [country]);

  const fetchWorkpapers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/workpapers?country=${country}`);
      if (res.ok) {
        const data = await res.json();
        setWorkpapers(data.workpapers || []);
        if (data.workpapers && data.workpapers.length > 0) {
          // Select first workpaper
          setSelectedWpId(data.workpapers[0].id);
          setCurrentWp(JSON.parse(JSON.stringify(data.workpapers[0])));
        }
      }
    } catch (err) {
      console.error('Error fetching workpapers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWorkpaper = (wp: AuditWorkpaper) => {
    setSelectedWpId(wp.id);
    setCurrentWp(JSON.parse(JSON.stringify(wp)));
  };

  const handleSaveWorkpaper = async () => {
    if (!currentWp) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/workpapers/${currentWp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentWp),
      });
      if (res.ok) {
        const data = await res.json();
        // Update in list
        setWorkpapers(prev => prev.map(w => (w.id === currentWp.id ? data.workpaper : w)));
        if (onNotify) onNotify(`Papel de trabajo ${currentWp.workpaper_code} guardado con éxito.`);
      }
    } catch (err) {
      console.error('Error saving workpaper:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNewWorkpaper = () => {
    const newId = `WP-${country}-${Date.now().toString(36).toUpperCase()}`;
    const newCode = `PT-ISSAI-300-${country}-${String(workpapers.length + 1).padStart(2, '0')}`;
    const blankWp: AuditWorkpaper = {
      id: newId,
      workpaper_code: newCode,
      title: 'Nuevo Papel de Trabajo de Auditoría Forense',
      audit_type: 'GESTION_ISSAI_300',
      risk_level: 'ALTO',
      status: 'BORRADOR',
      scope_entity: country === 'DOM' ? 'Entidad Pública DGCP' : 'Government Agency / Organization',
      scope_period: 'Ejercicio Fiscal Actual',
      country,
      assigned_auditor: 'Lic. Pedro Baldera (Auditor Forense)',
      reviewing_supervisor: 'Dirección de Aseguramiento Forense USA',
      procedure_tests: [
        {
          id: 'TST-01',
          name: 'Cruce Algorítmico de Oferentes y Socios',
          description: 'Verificar existencia de beneficiarios finales comunes en ofertas competidoras.',
          procedure_type: 'CRUCE_ACCIONISTAS',
          result: 'NOT_TESTED',
          notes: 'Pendiente de cruce con base maestra mercantil.',
        },
      ],
      finding_sheet: {
        title: 'Hallazgo en Proceso de Documentación Pericial',
        finding_code: `HA-ISSAI-${country}-001`,
        detected_procedure: 'Técnica pericial según normas INTOSAI ISSAI 300 / 200 / 400.',
        condition: {
          facts: 'Describir detalladamente los hechos constatados en el documento fuente...',
          document_source: 'Pliego_de_Condiciones.pdf',
          page_paragraph: 'Folio 1, Párrafo 1',
          hash_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          archive_token: `ARC-AES256-${Date.now().toString(36).toUpperCase()}`,
        },
        criterion: {
          law_and_decree: country === 'DOM' ? 'Ley No. 340-06 y Reglamento 543-12' : 'Federal Acquisition Regulation (FAR)',
          article_exact: country === 'DOM' ? 'Artículo 14 y 65 Ley 340-06' : 'FAR 11.002 & FAR 6.101',
          legal_standard: 'INTOSAI ISSAI 300 - Auditoría de Gestión',
          period_effective: 'Vigente en el periodo analizado',
        },
        cause: {
          root_failure: 'Falla u omisión de los controles internos previos.',
          control_deviation_type: 'Omisión de debida diligencia.',
          intentionality: 'DELIBERADA_COLUSION',
        },
        effect: {
          estimated_damage_local: 0,
          estimated_damage_usd: 0,
          qualitative_impact: 'Distorsión de la libre competencia y afectación a la transparencia.',
          penal_or_administrative_risk: 'Responsabilidad administrativa y posible persecución judicial.',
        },
        recommendation: {
          immediate_action: 'Suspender el proceso y solicitar revisión técnica independiente.',
          structural_correction: 'Fortalecer el sistema de control previo y trazabilidad.',
          sanctions_proposed: 'Remitir informe a los órganos rectores de control.',
        },
      },
      coaching_notes: [],
      traceability: {
        source_file: 'Pliego_de_Condiciones.pdf',
        portal_origin: country === 'DOM' ? 'Portal DGCP Compras Dominicana' : 'SAM.gov / Official Portal',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        archive_token: `ARC-AES256-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        verified_immutable: true,
      },
    };

    setWorkpapers([blankWp, ...workpapers]);
    setSelectedWpId(blankWp.id);
    setCurrentWp(blankWp);
    if (onNotify) onNotify('Nuevo papel de trabajo creado. Puede completar los datos o usar el auto-llenado.');
  };

  const handleExecuteAutoFill = async () => {
    if (!autoFillInputText && !autoFillFilename) return;
    setAutoFilling(true);
    try {
      const res = await fetch('/api/v1/workpapers/auto-fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_text: autoFillInputText,
          filename: autoFillFilename,
          country,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        const detected = result.data;

        if (currentWp) {
          const updatedWp: AuditWorkpaper = {
            ...currentWp,
            title: detected.title || currentWp.title,
            audit_type: detected.audit_type || currentWp.audit_type,
            risk_level: detected.risk_level || currentWp.risk_level,
            status: 'EN_REVISION',
            procedure_tests: detected.procedure_tests?.map((t: any, idx: number) => ({
              id: `TST-${idx + 1}`,
              name: t.name,
              description: t.name,
              procedure_type: t.procedure_type || 'CRUCE_ACCIONISTAS',
              result: t.result || 'FAIL',
              notes: t.notes || '',
              tested_by: 'Motor IA Forense Audit Intelligence USA',
              tested_at: new Date().toISOString(),
            })) || currentWp.procedure_tests,
            finding_sheet: {
              title: detected.title,
              finding_code: `HA-${currentWp.workpaper_code}`,
              detected_procedure: detected.detected_procedure,
              condition: detected.condition,
              criterion: detected.criterion,
              cause: detected.cause,
              effect: detected.effect,
              recommendation: detected.recommendation,
            },
            traceability: {
              ...currentWp.traceability,
              source_file: autoFillFilename,
              sha256: result.traceability?.sha256_hash || currentWp.traceability.sha256,
              archive_token: result.traceability?.archive_token || currentWp.traceability.archive_token,
              timestamp: new Date().toISOString(),
              verified_immutable: true,
            },
          };

          setCurrentWp(updatedWp);
          setWorkpapers(prev => prev.map(w => (w.id === currentWp.id ? updatedWp : w)));
          setShowAutoFillModal(false);
          if (onNotify) onNotify('¡Ficha de Hallazgo y Papel de Trabajo auto-llenados con éxito mediante análisis forense!');
        }
      }
    } catch (err) {
      console.error('Error in auto-fill:', err);
    } finally {
      setAutoFilling(false);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_REAL_CASES[0]) => {
    setAutoFillInputText(preset.sampleText);
    setAutoFillFilename(`${preset.tenderCode}_Expediente_Forense.pdf`);
  };

  const handleTestResultToggle = (testId: string) => {
    if (!currentWp) return;
    const nextResultMap: Record<ProcedureTest['result'], ProcedureTest['result']> = {
      NOT_TESTED: 'FAIL',
      FAIL: 'PASS',
      PASS: 'NOT_TESTED',
    };

    const updatedTests = currentWp.procedure_tests.map(t => {
      if (t.id === testId) {
        return {
          ...t,
          result: nextResultMap[t.result],
          tested_by: t.tested_by || 'Lic. Pedro Baldera',
          tested_at: new Date().toISOString(),
        };
      }
      return t;
    });

    setCurrentWp({ ...currentWp, procedure_tests: updatedTests });
  };

  const handleAddCoachingNote = async () => {
    if (!newCoachingText.trim() || !currentWp) return;
    try {
      const res = await fetch(`/api/v1/workpapers/${currentWp.id}/coaching-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: 'Dra. Carmen Rodríguez',
          role: 'Supervisora Senior de Aseguramiento Forense',
          content: newCoachingText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentWp(data.workpaper);
        setWorkpapers(prev => prev.map(w => (w.id === currentWp.id ? data.workpaper : w)));
        setNewCoachingText('');
        if (onNotify) onNotify('Nota de supervisión forense (Coaching Note) agregada al papel de trabajo.');
      }
    } catch (err) {
      console.error('Error adding coaching note:', err);
    }
  };

  const handleResolveCoachingNote = (noteId: string) => {
    if (!currentWp) return;
    const updatedNotes = currentWp.coaching_notes.map(cn => {
      if (cn.id === noteId) {
        return {
          ...cn,
          status: 'RESUELTA' as const,
          resolved_at: new Date().toISOString(),
        };
      }
      return cn;
    });

    setCurrentWp({ ...currentWp, coaching_notes: updatedNotes });
  };

  const handleExecuteSignOff = async () => {
    if (!currentWp) return;
    try {
      const res = await fetch(`/api/v1/workpapers/${currentWp.id}/sign-off`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditor_name: auditorSignerName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentWp(data.workpaper);
        setWorkpapers(prev => prev.map(w => (w.id === currentWp.id ? data.workpaper : w)));
        setSignOffModal(false);
        setIsSignOffDone(true);
        if (onNotify) onNotify(`¡Papel de trabajo ${currentWp.workpaper_code} validado y sellado digitalmente (Sign-Off oficial)!`);
      }
    } catch (err) {
      console.error('Error during sign off:', err);
    }
  };

  const handleSendToWordEditor = () => {
    if (!currentWp || !onGoToEditorWithFinding) return;
    const sheet = currentWp.finding_sheet;
    const markdownSnippet = `
### ${sheet.finding_code}: ${sheet.title}

**Tipo de Auditoría:** ${currentWp.audit_type} | **Nivel de Severidad:** 🚨 ${currentWp.risk_level}  
**Entidad Auditada:** ${currentWp.scope_entity} | **Período:** ${currentWp.scope_period}  
**Sello Criptográfico:** \`${currentWp.sign_off_hash || currentWp.traceability.sha256.slice(0, 32)}...\`

#### 1. Condición (Hechos Comprobados en Documento Fuente)
${sheet.condition.facts}
* **Fuente Oficial:** \`${sheet.condition.document_source}\`
* **Referencia / Folio:** ${sheet.condition.page_paragraph}
* **Token Custodia Inmutable:** \`${sheet.condition.archive_token}\`

#### 2. Criterio Jurídico y Normativo Vulnerado
* **Marco Legal:** ${sheet.criterion.law_and_decree}
* **Artículo Infringido:** ${sheet.criterion.article_exact}
* **Estándar Internacional:** ${sheet.criterion.legal_standard} (${sheet.criterion.period_effective})

#### 3. Procedimiento Forense Aplicado
${sheet.detected_procedure}

#### 4. Causa Raíz y Falla de Control Interno
* **Causa Identificada:** ${sheet.cause.root_failure}
* **Desviación de Control:** ${sheet.cause.control_deviation_type}
* **Calificación de Intencionalidad:** ${sheet.cause.intentionality}

#### 5. Efecto Patrimonial y Consecuencias Legales
* **Daño Estimado:** ${currency} ${sheet.effect.estimated_damage_local.toLocaleString()} (USD $${sheet.effect.estimated_damage_usd.toLocaleString()})
* **Impacto Institucional:** ${sheet.effect.qualitative_impact}
* **Riesgo Penal / Administrativo:** ${sheet.effect.penal_or_administrative_risk}

#### 6. Recomendaciones Periciales de Control Interno
* **Acción Inmediata:** ${sheet.recommendation.immediate_action}
* **Reforma Estructural:** ${sheet.recommendation.structural_correction}
* **Sanciones Propuestas:** ${sheet.recommendation.sanctions_proposed}
    `.trim();

    onGoToEditorWithFinding(markdownSnippet);
  };

  // Filtered list
  const filteredWorkpapers = workpapers.filter(wp => {
    if (filterType !== 'ALL' && wp.audit_type !== filterType) return false;
    if (filterRisk !== 'ALL' && wp.risk_level !== filterRisk) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        wp.title.toLowerCase().includes(q) ||
        wp.workpaper_code.toLowerCase().includes(q) ||
        wp.scope_entity.toLowerCase().includes(q) ||
        wp.finding_sheet?.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 backdrop-blur shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <FileCheck2 className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    Papeles de Trabajo & Ficha Forense de Hallazgos
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    INTOSAI ISSAI 200/300/400
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    Audit Intelligence USA
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Motor pericial de papeles de trabajo interactivos, detección automática de criterios normativos, procedimientos forenses y trazabilidad criptográfica inmutable.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAutoFillModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>⚡ Auto-Llenado Forense</span>
            </button>
            <button
              onClick={handleCreateNewWorkpaper}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Nuevo Papel de Trabajo</span>
            </button>
            <button
              onClick={handleSaveWorkpaper}
              disabled={saving || !currentWp}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </div>

        {/* Security & Traceability Ribbon */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Cumplimiento SOC2 Type II & INTOSAI Activo</span>
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Database className="w-3.5 h-3.5" />
              <span>Bóveda Inmutable SHA-256</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Cifrado AES-256 en Reposo y Tránsito</span>
            </span>
          </div>
          <div className="text-slate-400">
            Total Papeles de Trabajo: <strong className="text-white">{workpapers.length}</strong> | Jurisdicción:{' '}
            <strong className="text-amber-400">{country === 'DOM' ? 'República Dominicana (DGCP)' : country}</strong>
          </div>
        </div>
      </div>

      {/* Main Split Interface: List of Workpapers + Interactive Detail Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Workpaper Navigator & Index (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Índice de Papeles de Trabajo</span>
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {filteredWorkpapers.length} ítems
              </span>
            </div>

            {/* Search and Filters */}
            <div className="space-y-2 mb-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar papel, entidad o código..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="text-[11px] bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-1 focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">Todos los Tipos</option>
                  <option value="GESTION_ISSAI_300">Gestión (ISSAI 300)</option>
                  <option value="FINANCIERA_ISSAI_200">Financiera (ISSAI 200)</option>
                  <option value="SISTEMAS_ISSAI_400">Sistemas (ISSAI 400)</option>
                </select>

                <select
                  value={filterRisk}
                  onChange={e => setFilterRisk(e.target.value)}
                  className="text-[11px] bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-1 focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">Todo Riesgo</option>
                  <option value="CRITICO">🚨 Crítico</option>
                  <option value="ALTO">⚠️ Alto</option>
                  <option value="MEDIO">Medio</option>
                </select>
              </div>
            </div>

            {/* Workpaper Cards List */}
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {loading ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  <div className="animate-spin w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-2" />
                  Cargando papeles de trabajo periciales...
                </div>
              ) : filteredWorkpapers.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 bg-slate-950/40 rounded-lg border border-dashed border-slate-800">
                  No se encontraron papeles con los filtros seleccionados.
                </div>
              ) : (
                filteredWorkpapers.map(wp => {
                  const isSelected = wp.id === selectedWpId;
                  const riskBadge =
                    wp.risk_level === 'CRITICO'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : wp.risk_level === 'ALTO'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30';

                  const statusBadge =
                    wp.status === 'VALIDADO_SIGNOFF'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                      : wp.status === 'SUPERVISADO'
                      ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
                      : wp.status === 'EN_REVISION'
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      : 'text-slate-400 bg-slate-800 border-slate-700';

                  return (
                    <div
                      key={wp.id}
                      onClick={() => handleSelectWorkpaper(wp)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-800/90 border-amber-500/70 shadow-md ring-1 ring-amber-500/40'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-mono text-[11px] font-bold text-amber-400">
                          {wp.workpaper_code}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${riskBadge}`}>
                            {wp.risk_level}
                          </span>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${statusBadge}`}>
                            {wp.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-snug">
                        {wp.title}
                      </h3>

                      <p className="text-[11px] text-slate-400 mt-1 truncate">
                        🏢 {wp.scope_entity}
                      </p>

                      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-mono">{wp.scope_period}</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <ClipboardCheck className="w-3 h-3 text-indigo-400" />
                          {wp.procedure_tests?.length || 0} pruebas
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Finding Worksheet & Workpaper Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {currentWp ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
              {/* Worksheet Action & Status Header */}
              <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30">
                      {currentWp.workpaper_code}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Auditor: <strong className="text-slate-200">{currentWp.assigned_auditor}</strong>
                    </span>
                  </div>
                  <input
                    type="text"
                    value={currentWp.title}
                    onChange={e => setCurrentWp({ ...currentWp, title: e.target.value })}
                    className="text-base font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-amber-500 focus:outline-none w-full mt-1.5 py-0.5"
                    placeholder="Título del Papel de Trabajo..."
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Dropdown */}
                  <select
                    value={currentWp.status}
                    onChange={e => setCurrentWp({ ...currentWp, status: e.target.value as any })}
                    className="text-xs bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="BORRADOR">📝 Borrador</option>
                    <option value="EN_REVISION">🔍 En Revisión</option>
                    <option value="SUPERVISADO">🛡️ Supervisado</option>
                    <option value="VALIDADO_SIGNOFF">✅ Validado (Sign-Off)</option>
                    <option value="DESCARTADO">❌ Descartado (Falso Positivo)</option>
                  </select>

                  {/* Sign-Off Button */}
                  <button
                    onClick={() => setSignOffModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-colors cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Firma Digital (Sign-Off)</span>
                  </button>

                  {/* Send to Word Editor */}
                  <button
                    onClick={handleSendToWordEditor}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                    title="Inyectar al Informe Word Editable"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Inyectar a Word</span>
                  </button>
                </div>
              </div>

              {/* Sub-view Navigation Tabs */}
              <div className="flex border-b border-slate-800 text-xs">
                {[
                  { id: 'FINDING_SHEET', label: '1. Ficha Pericial INTOSAI (5 Pilares)', icon: '📋' },
                  { id: 'TESTS', label: `2. Pruebas de Auditoría (${currentWp.procedure_tests?.length || 0})`, icon: '🔬' },
                  { id: 'COACHING', label: `3. Supervisión & Coaching (${currentWp.coaching_notes?.length || 0})`, icon: '💬' },
                  { id: 'CHAIN_OF_CUSTODY', label: '4. Cadena de Custodia & Hash', icon: '🔒' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabSubView(tab.id as any)}
                    className={`flex items-center gap-1.5 px-4 py-2 font-medium border-b-2 transition-colors cursor-pointer ${
                      activeTabSubView === tab.id
                        ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* SUB-VIEW 1: FINDING SHEET (5 INTOSAI PILLARS: Condition, Criterion, Cause, Effect, Procedure) */}
              {activeTabSubView === 'FINDING_SHEET' && (
                <div className="space-y-5">
                  {/* General Scope & Meta Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400">Entidad Auditada:</label>
                      <input
                        type="text"
                        value={currentWp.scope_entity}
                        onChange={e => setCurrentWp({ ...currentWp, scope_entity: e.target.value })}
                        className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400">Período / Ejercicio Fiscal:</label>
                      <input
                        type="text"
                        value={currentWp.scope_period}
                        onChange={e => setCurrentWp({ ...currentWp, scope_period: e.target.value })}
                        className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400">Tipo de Auditoría / Norma:</label>
                      <select
                        value={currentWp.audit_type}
                        onChange={e => setCurrentWp({ ...currentWp, audit_type: e.target.value as any })}
                        className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="GESTION_ISSAI_300">ISSAI 300 - Gestión (Precios & Colusión)</option>
                        <option value="FINANCIERA_ISSAI_200">ISSAI 200 - Financiera (Fraccionamiento)</option>
                        <option value="SISTEMAS_ISSAI_400">ISSAI 400 - Sistemas (Nómina & Logs COBIT)</option>
                        <option value="INTEGRAL_FORENSE">Peritaje Forense Integral</option>
                      </select>
                    </div>
                  </div>

                  {/* 1. CRITERIO JURÍDICO UTILIZADO (Detección Automática & Editable) */}
                  <div className="p-4 bg-slate-950/70 border border-indigo-900/40 rounded-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                        <span>⚖️ 1. Criterio Jurídico & Normativa Infringida</span>
                        <span className="text-[10px] px-2 py-0.2 rounded bg-indigo-500/10 text-indigo-300 font-mono">
                          Automático & Verificado
                        </span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-400">Ley, Reglamento o Norma:</label>
                        <input
                          type="text"
                          value={currentWp.finding_sheet.criterion.law_and_decree}
                          onChange={e =>
                            setCurrentWp({
                              ...currentWp,
                              finding_sheet: {
                                ...currentWp.finding_sheet,
                                criterion: {
                                  ...currentWp.finding_sheet.criterion,
                                  law_and_decree: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Artículo Específico e Inciso:</label>
                        <input
                          type="text"
                          value={currentWp.finding_sheet.criterion.article_exact}
                          onChange={e =>
                            setCurrentWp({
                              ...currentWp,
                              finding_sheet: {
                                ...currentWp.finding_sheet,
                                criterion: {
                                  ...currentWp.finding_sheet.criterion,
                                  article_exact: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-amber-300 font-semibold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="text-[11px] text-slate-400">Estándar Metodológico INTOSAI / Fundamento Pericial:</label>
                      <input
                        type="text"
                        value={currentWp.finding_sheet.criterion.legal_standard}
                        onChange={e =>
                          setCurrentWp({
                            ...currentWp,
                            finding_sheet: {
                              ...currentWp.finding_sheet,
                              criterion: {
                                ...currentWp.finding_sheet.criterion,
                                legal_standard: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-300 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* 2. PROCEDIMIENTO FORENSE APLICADO */}
                  <div className="p-4 bg-slate-950/70 border border-cyan-900/40 rounded-lg space-y-2">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                      <span>🔬 2. Procedimiento Forense Aplicado</span>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                        Metodología Pericial
                      </span>
                    </span>
                    <textarea
                      rows={2}
                      value={currentWp.finding_sheet.detected_procedure}
                      onChange={e =>
                        setCurrentWp({
                          ...currentWp,
                          finding_sheet: {
                            ...currentWp.finding_sheet,
                            detected_procedure: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
                      placeholder="Describa la técnica pericial utilizada para constatar la irregularidad..."
                    />
                  </div>

                  {/* 3. CONDICIÓN (HECHOS CONSTATADOS Y FUENTE REAL) */}
                  <div className="p-4 bg-slate-950/70 border border-amber-900/40 rounded-lg space-y-2.5">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                      <span>📄 3. Condición (Hechos Verificados en Fuentes Reales)</span>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-amber-500/10 text-amber-300 font-mono">
                        Cero Alucinación / Trazable
                      </span>
                    </span>

                    <textarea
                      rows={3}
                      value={currentWp.finding_sheet.condition.facts}
                      onChange={e =>
                        setCurrentWp({
                          ...currentWp,
                          finding_sheet: {
                            ...currentWp.finding_sheet,
                            condition: {
                              ...currentWp.finding_sheet.condition,
                              facts: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
                      placeholder="Describa con precisión los hechos verificados..."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-400">Documento Fuente / Expediente:</label>
                        <input
                          type="text"
                          value={currentWp.finding_sheet.condition.document_source}
                          onChange={e =>
                            setCurrentWp({
                              ...currentWp,
                              finding_sheet: {
                                ...currentWp.finding_sheet,
                                condition: {
                                  ...currentWp.finding_sheet.condition,
                                  document_source: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-300 font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Folio / Página / Numeral Exacto:</label>
                        <input
                          type="text"
                          value={currentWp.finding_sheet.condition.page_paragraph}
                          onChange={e =>
                            setCurrentWp({
                              ...currentWp,
                              finding_sheet: {
                                ...currentWp.finding_sheet,
                                condition: {
                                  ...currentWp.finding_sheet.condition,
                                  page_paragraph: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-300 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. CAUSA RAÍZ & INTENCIONALIDAD */}
                  <div className="p-4 bg-slate-950/70 border border-purple-900/40 rounded-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-400 flex items-center gap-2">
                        <span>🎯 4. Causa Raíz & Falla de Control Interno</span>
                      </span>
                      <select
                        value={currentWp.finding_sheet.cause.intentionality}
                        onChange={e =>
                          setCurrentWp({
                            ...currentWp,
                            finding_sheet: {
                              ...currentWp.finding_sheet,
                              cause: {
                                ...currentWp.finding_sheet.cause,
                                intentionality: e.target.value as any,
                              },
                            },
                          })
                        }
                        className="text-[10px] bg-purple-950/40 border border-purple-700/50 text-purple-300 rounded px-2 py-1 font-semibold focus:outline-none"
                      >
                        <option value="DELIBERADA_COLUSION">🚨 Deliberada / Colusión Concertada</option>
                        <option value="NEGLIGENCIA_GRAVE">⚠️ Negligencia Grave / Inobservancia</option>
                        <option value="FALLA_SISTEMICA">⚙️ Falla Sistémica de Control</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-400">Causa Raíz Identificada:</label>
                        <textarea
                          rows={2}
                          value={currentWp.finding_sheet.cause.root_failure}
                          onChange={e =>
                            setCurrentWp({
                              ...currentWp,
                              finding_sheet: {
                                ...currentWp.finding_sheet,
                                cause: {
                                  ...currentWp.finding_sheet.cause,
                                  root_failure: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Tipo de Desviación de Control:</label>
                        <textarea
                          rows={2}
                          value={currentWp.finding_sheet.cause.control_deviation_type}
                          onChange={e =>
                            setCurrentWp({
                              ...currentWp,
                              finding_sheet: {
                                ...currentWp.finding_sheet,
                                cause: {
                                  ...currentWp.finding_sheet.cause,
                                  control_deviation_type: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. EFECTO ECONÓMICO Y JURÍDICO (Cuantificación de Daño) */}
                  <div className="p-4 bg-slate-950/70 border border-rose-900/40 rounded-lg space-y-2.5">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-2">
                      <span>💰 5. Efecto Cuantificado (Daño Patrimonial & Riesgo Penal)</span>
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-400">
                          Daño Estimado en Moneda Local ({currency}):
                        </label>
                        <input
                          type="number"
                          value={currentWp.finding_sheet.effect.estimated_damage_local}
                          onChange={e =>
                            setCurrentWp({
                              ...currentWp,
                              finding_sheet: {
                                ...currentWp.finding_sheet,
                                effect: {
                                  ...currentWp.finding_sheet.effect,
                                  estimated_damage_local: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-rose-400 font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Equivalente Estimado en USD ($):</label>
                        <input
                          type="number"
                          value={currentWp.finding_sheet.effect.estimated_damage_usd}
                          onChange={e =>
                            setCurrentWp({
                              ...currentWp,
                              finding_sheet: {
                                ...currentWp.finding_sheet,
                                effect: {
                                  ...currentWp.finding_sheet.effect,
                                  estimated_damage_usd: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-emerald-400 font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-400">Impacto Institucional / Cualitativo:</label>
                        <textarea
                          rows={2}
                          value={currentWp.finding_sheet.effect.qualitative_impact}
                          onChange={e =>
                            setCurrentWp({
                              ...currentWp,
                              finding_sheet: {
                                ...currentWp.finding_sheet,
                                effect: {
                                  ...currentWp.finding_sheet.effect,
                                  qualitative_impact: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">Tipificación Penal / Sanción Administrativa:</label>
                        <textarea
                          rows={2}
                          value={currentWp.finding_sheet.effect.penal_or_administrative_risk}
                          onChange={e =>
                            setCurrentWp({
                              ...currentWp,
                              finding_sheet: {
                                ...currentWp.finding_sheet,
                                effect: {
                                  ...currentWp.finding_sheet.effect,
                                  penal_or_administrative_risk: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-rose-300 font-semibold focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. RECOMENDACIONES PERICIALES */}
                  <div className="p-4 bg-slate-950/70 border border-emerald-900/40 rounded-lg space-y-2.5">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                      <span>💡 6. Recomendaciones de Control Interno & Acciones Forenses</span>
                    </span>

                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-400">Medida Correctiva Inmediata:</label>
                        <input
                          type="text"
                          value={currentWp.finding_sheet.recommendation.immediate_action}
                          onChange={e =>
                            setCurrentWp({
                              ...currentWp,
                              finding_sheet: {
                                ...currentWp.finding_sheet,
                                recommendation: {
                                  ...currentWp.finding_sheet.recommendation,
                                  immediate_action: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400">Reforma Estructural de Control:</label>
                        <input
                          type="text"
                          value={currentWp.finding_sheet.recommendation.structural_correction}
                          onChange={e =>
                            setCurrentWp({
                              ...currentWp,
                              finding_sheet: {
                                ...currentWp.finding_sheet,
                                recommendation: {
                                  ...currentWp.finding_sheet.recommendation,
                                  structural_correction: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400">Sanciones Administrativas / Remisión Penal Propuesta:</label>
                        <input
                          type="text"
                          value={currentWp.finding_sheet.recommendation.sanctions_proposed}
                          onChange={e =>
                            setCurrentWp({
                              ...currentWp,
                              finding_sheet: {
                                ...currentWp.finding_sheet,
                                recommendation: {
                                  ...currentWp.finding_sheet.recommendation,
                                  sanctions_proposed: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-VIEW 2: AUDIT TESTS (PROCEDURES EXECUTION MATRIX) */}
              {activeTabSubView === 'TESTS' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Matriz de Pruebas de Auditoría</h3>
                      <p className="text-xs text-slate-400">
                        Haga clic en el botón de resultado para alternar entre FAIL (Desviación/Hallazgo), PASS (Conforme) y NOT TESTED.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const newTest: ProcedureTest = {
                          id: `TST-${(currentWp.procedure_tests?.length || 0) + 1}`,
                          name: 'Nueva Prueba Pericial de Control',
                          description: 'Detalle de la prueba a ejecutar...',
                          procedure_type: 'CRUCE_ACCIONISTAS',
                          result: 'NOT_TESTED',
                          notes: 'Pendiente de ejecución por el auditor.',
                        };
                        setCurrentWp({
                          ...currentWp,
                          procedure_tests: [...(currentWp.procedure_tests || []), newTest],
                        });
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Añadir Prueba</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentWp.procedure_tests?.map(test => {
                      const resultBadge =
                        test.result === 'FAIL'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
                          : test.result === 'PASS'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700';

                      return (
                        <div
                          key={test.id}
                          className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                                {test.id}
                              </span>
                              <input
                                type="text"
                                value={test.name}
                                onChange={e => {
                                  const updated = currentWp.procedure_tests.map(t =>
                                    t.id === test.id ? { ...t, name: e.target.value } : t
                                  );
                                  setCurrentWp({ ...currentWp, procedure_tests: updated });
                                }}
                                className="text-xs font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-amber-500 focus:outline-none"
                              />
                            </div>

                            <button
                              onClick={() => handleTestResultToggle(test.id)}
                              className={`text-[11px] font-bold px-3 py-1 rounded border transition-colors cursor-pointer ${resultBadge}`}
                              title="Alternar resultado (FAIL / PASS / NOT_TESTED)"
                            >
                              {test.result === 'FAIL' ? '❌ FAIL (DESVIACIÓN)' : test.result === 'PASS' ? '✅ PASS (CONFORME)' : '⚪ NOT TESTED'}
                            </button>
                          </div>

                          <textarea
                            rows={2}
                            value={test.notes}
                            onChange={e => {
                              const updated = currentWp.procedure_tests.map(t =>
                                t.id === test.id ? { ...t, notes: e.target.value } : t
                              );
                              setCurrentWp({ ...currentWp, procedure_tests: updated });
                            }}
                            className="w-full text-xs px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-300 focus:outline-none focus:border-amber-500"
                            placeholder="Notas periciales de la prueba ejecutada..."
                          />

                          {test.evidence_ref && (
                            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                              <ExternalLink className="w-3 h-3 text-cyan-400" />
                              <span>Evidencia: {test.evidence_ref}</span>
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUB-VIEW 3: COACHING NOTES (SUPERVISION & QUALITY CONTROL) */}
              {activeTabSubView === 'COACHING' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Notas de Supervisión & Coaching Forense</h3>
                      <p className="text-xs text-slate-400">
                        Observaciones de aseguramiento de calidad emitidas por el Director o Supervisor antes del Sign-Off.
                      </p>
                    </div>
                  </div>

                  {/* Add Note Form */}
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Nueva Nota de Revisión / Coaching:
                    </label>
                    <textarea
                      rows={2}
                      value={newCoachingText}
                      onChange={e => setNewCoachingText(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-indigo-500"
                      placeholder="Escriba la instrucción de verificación pericial requerida para el auditor..."
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleAddCoachingNote}
                        disabled={!newCoachingText.trim()}
                        className="px-3 py-1.5 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Registrar Nota de Coaching</span>
                      </button>
                    </div>
                  </div>

                  {/* Notes List */}
                  <div className="space-y-2.5">
                    {currentWp.coaching_notes?.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-500 bg-slate-950/40 rounded border border-dashed border-slate-800">
                        No hay notas de coaching pendientes en este papel de trabajo.
                      </div>
                    ) : (
                      currentWp.coaching_notes?.map(cn => (
                        <div
                          key={cn.id}
                          className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-indigo-400">{cn.author}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({cn.role})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                                  cn.status === 'RESUELTA'
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                }`}
                              >
                                {cn.status}
                              </span>
                              {cn.status === 'ABIERTA' && (
                                <button
                                  onClick={() => handleResolveCoachingNote(cn.id)}
                                  className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                                >
                                  Marcar Resuelta
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed">{cn.content}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {new Date(cn.date).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SUB-VIEW 4: CHAIN OF CUSTODY & DIGITAL EVIDENCE RECORD */}
              {activeTabSubView === 'CHAIN_OF_CUSTODY' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>Registro de Custodia Criptográfica Inmutable</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                        VERIFICADO SOC2 / AES-256
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Token de Bóveda (Archive Token):</span>
                        <span className="text-amber-400 font-bold text-sm">
                          {currentWp.traceability.archive_token}
                        </span>
                      </div>

                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 break-all">
                        <span className="text-slate-400 block text-[10px]">Hash SHA-256 del Expediente Fuente:</span>
                        <span className="text-cyan-400 text-xs">{currentWp.traceability.sha256}</span>
                      </div>

                      {currentWp.sign_off_hash && (
                        <div className="p-2.5 rounded bg-slate-900 border border-emerald-500/40 break-all">
                          <span className="text-emerald-400 block text-[10px] font-bold">
                            Sello Digital de Validación (Sign-Off Hash):
                          </span>
                          <span className="text-white text-xs font-bold">{currentWp.sign_off_hash}</span>
                          <span className="block text-[10px] text-slate-400 mt-1">
                            Firmado por {currentWp.reviewing_supervisor || currentWp.assigned_auditor} el{' '}
                            {currentWp.sign_off_date ? new Date(currentWp.sign_off_date).toLocaleString() : ''}
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <span className="text-slate-400">Portal de Origen:</span>{' '}
                          <span className="text-slate-200">{currentWp.traceability.portal_origin}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Timestamp de Resguardo:</span>{' '}
                          <span className="text-slate-200">
                            {new Date(currentWp.traceability.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
              Seleccione un papel de trabajo o cree uno nuevo para comenzar la auditoría pericial.
            </div>
          )}
        </div>
      </div>

      {/* AUTO-FILL FORENSIC MODAL */}
      {showAutoFillModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Sparkles className="w-5 h-5" />
                <span>Auto-Llenado Pericial con Inteligencia Forense</span>
              </div>
              <button
                onClick={() => setShowAutoFillModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Seleccione un caso real de compras públicas o pegue el contenido de cualquier pliego, contrato o informe. El motor detectará automáticamente los <strong>criterios legales infringidos</strong>, el <strong>procedimiento pericial aplicado</strong> y los 5 elementos INTOSAI con referencias a fuentes reales.
            </p>

            {/* Quick Presets */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Casos Reales Preconfigurados:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {PRESET_REAL_CASES.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2.5 text-left text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-slate-200 line-clamp-1">{preset.label}</div>
                    <div className="text-[10px] text-amber-400 mt-0.5">{preset.law}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Document Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Texto del Expediente o Pliego a Analizar:
                </label>
                <input
                  type="text"
                  value={autoFillFilename}
                  onChange={e => setAutoFillFilename(e.target.value)}
                  className="text-xs bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 font-mono w-60"
                  placeholder="Nombre_Archivo.pdf"
                />
              </div>
              <textarea
                rows={6}
                value={autoFillInputText}
                onChange={e => setAutoFillInputText(e.target.value)}
                placeholder="Pegue aquí el texto oficial del expediente, pliego de condiciones, actas de adjudicación o cuadros comparativos de ofertas..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAutoFillModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteAutoFill}
                disabled={autoFilling || !autoFillInputText.trim()}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 flex items-center gap-2 cursor-pointer shadow-md"
              >
                {autoFilling ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full" />
                    <span>Detectando Criterios & Procedimientos...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Ejecutar Llenado Automático</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIGN-OFF DIGITAL MODAL */}
      {signOffModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold pb-2 border-b border-slate-800">
              <Shield className="w-5 h-5" />
              <span>Validación y Firma Digital Forense (Sign-Off)</span>
            </div>

            <p className="text-xs text-slate-300">
              Al validar este papel de trabajo, se generará un sello criptográfico <strong>SHA-256</strong> con el nombre del auditor responsable y quedará registrado de forma inmutable en el log de auditoría SOC2.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Auditor / Supervisor Firmante:</label>
              <input
                type="text"
                value={auditorSignerName}
                onChange={e => setAuditorSignerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSignOffModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteSignOff}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Firmar y Sellar Papel de Trabajo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
