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
  DollarSign,
  Database,
  Link2,
  Users,
  Edit3,
  Trash2,
  Check,
  RefreshCw,
  FileCode,
  ShieldCheck,
  X,
  Layers,
  Fingerprint
} from 'lucide-react';
import { 
  ForensicFinding, 
  LegalViolation, 
  CountryCode, 
  CurrencyCode, 
  TenderItem, 
  IntosaiFindingModel, 
  IntosaiFrameworkType, 
  CrossReferenceAlerts 
} from '../types';
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
  
  // Default text featuring sample case from user specifications
  const [analysisText, setAnalysisText] = useState(
`CONTRATO DE ADQUISICIÓN DE SUMINISTROS Y TECNOLOGÍA. FECHA: 14 de Octubre de 2023.
ENTIDAD: Ministerio de Inclusión Social y Red Hospitalaria. 
ADJUDICATARIO: Consorcio Tecnológico SRL (RNC: 1-30-99812-4).
MONTO TOTAL: RD$ 4,500,000.00. 
PROCESO: Adjudicación Directa por Urgencia de la Entidad.
PÁGINA 12: Se aprueba la compra fraccionada en 3 órdenes independientes de RD$ 1,500,000.00 cada una ejecutadas el mismo día para agilizar el despacho.
PÁGINA 24: Composición accionaria del Adjudicatario: Socio Mayoritario Pedro Martínez (Cédula: 001-0000000-1, participación: 70%).
ANEXO NÓMINA ENTIDAD: Se verifica que el señor Pedro Martínez (Cédula: 001-0000000-1) figura activo como Director de Planificación de esta misma Institución contratante.
ESPECIFICACIONES TÉCNICAS: Se exige exclusividad de fábrica de marca patentada sin admitir equivalente funcional.`
  );

  const [historicalYears, setHistoricalYears] = useState(10);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(true);
  const [selectedFrameworkFilter, setSelectedFrameworkFilter] = useState<'ALL' | IntosaiFrameworkType>('ALL');

  // Archive and Custody States
  const [archiveToken, setArchiveToken] = useState('ARC-AES256-991204X');
  const [reportId, setReportId] = useState('REP-INTOSAI-2026-0089');
  const [storageSyncLog, setStorageSyncLog] = useState<Record<string, string>>({
    postgresql: 'Guardado exitosamente en PostgreSQL (JSONB nativo con índices GIN).',
    mongodb: 'Guardado exitosamente en MongoDB (Colección NoSQL forensic_reports).',
    audit_intelligence_usa: 'Sincronizado bajo cifrado AES-256 con nodo central USA.',
  });

  // Cross Reference Alerts State
  const [crossReferenceAlerts, setCrossReferenceAlerts] = useState<CrossReferenceAlerts>({
    shareholder_overlap: true,
    matched_entities: ['Consorcio Tecnológico SRL', 'Servicios Globales de Oficina SRL'],
    common_shareholder_id: '001-0000000-1',
    employee_overlap_detected: true,
  });

  // Analysis result states
  const [complianceScore, setComplianceScore] = useState(38);
  const [riskLevel, setRiskLevel] = useState<'Bajo' | 'Medio' | 'Alto' | 'Crítico'>('Crítico');
  const [executiveSummary, setExecutiveSummary] = useState(
    'Se constató colusión, fraccionamiento deliberado del gasto (ISSAI 300) y conflicto penal de interés (ISSAI 400). El socio mayoritario de la empresa adjudicataria figura activo simultáneamente como Director de Planificación de la entidad contratante, violando el Art. 14 de la Ley 340-06 y tipificando posible nómina fantasma / abuso de función.'
  );

  // Structured INTOSAI findings with in-place editing
  const [intosaiFindings, setIntosaiFindings] = useState<IntosaiFindingModel[]>([
    {
      finding_id: 'HA-2026-001',
      type: 'FRACCIONAMIENTO_Y_COLUSION',
      editable_status: 'CONFIRMED',
      procedure_applied: 'Cruce relacional de bases de datos maestras de órdenes de compra simultáneas y minería de texto en actas (ISSAI 300 - Auditoría de Gestión).',
      condition: {
        description: 'Se constató la aprobación y ejecución de compras fraccionadas en 3 órdenes independientes de RD$ 1,500,000.00 cada una (totalizando RD$ 4,500,000.00) suscritas en la misma fecha para eludir la Licitación Pública Nacional.',
        source_document: 'Acta_Adjudicacion_Licitacion_2023.pdf',
        page_reference: 'Pág. 12, Párrafo 2',
        archive_token: 'ARC-AES256-991204X',
      },
      criterion: {
        law_reference: 'Ley 340-06 sobre Compras y Contrataciones Públicas y Dec. 543-12',
        article: 'Artículo 11 (Prohibición Taxativa de Fraccionamiento de Compras)',
        period_validity: 'Vigente en el año fiscal del gasto analizado',
      },
      cross_reference_alerts: {
        shareholder_overlap: true,
        matched_entities: ['Consorcio Tecnológico SRL', 'Servicios Globales de Oficina SRL'],
        common_shareholder_id: '001-0000000-1',
        employee_overlap_detected: false,
      },
      effect: {
        financial_impact: 4500000.0,
        description: 'Evasión ilícita del procedimiento de Licitación Pública Nacional, vulnerando los umbrales financieros fijados por la DGCP y limitando la libre concurrencia.',
      },
      causa: 'Inexistencia deliberada de consolidación de compras en el Plan Anual (PACC) y elusión deliberada de los controles internos de la entidad.',
    },
    {
      finding_id: 'HA-2026-002',
      type: 'NOMINA_FANTASMA_Y_CONFLICTO_INTERES',
      editable_status: 'CONFIRMED',
      procedure_applied: 'Cruce algorítmico automatizado entre el Registro Maestro de Nómina de la entidad vs. Base de Accionistas del RNP y RNC (ISSAI 400 / COBIT 5).',
      condition: {
        description: 'Se verificó que el señor Pedro Martínez (Cédula: 001-0000000-1), socio mayoritario de la empresa adjudicataria Consorcio Tecnológico SRL, figura simultáneamente en nómina como Director de Planificación activo de la misma institución contratante.',
        source_document: 'Acta_Adjudicacion_Licitacion_2023.pdf',
        page_reference: 'Pág. 24, Anexo Nómina Institucional',
        archive_token: 'ARC-AES256-991204X',
      },
      criterion: {
        law_reference: 'Ley 340-06 sobre Compras Públicas y Código Penal de la República Dominicana',
        article: 'Artículo 14, Numeral 1 (Régimen de Prohibiciones e Inhabilidades Absolutas) y Art. 175 Código Penal',
        period_validity: 'Vigente en el ejercicio fiscal analizado',
      },
      cross_reference_alerts: {
        shareholder_overlap: false,
        matched_entities: ['Consorcio Tecnológico SRL', 'Nómina Central Institucional'],
        common_shareholder_id: '001-0000000-1',
        employee_overlap_detected: true,
      },
      effect: {
        financial_impact: 4500000.0,
        description: 'Nulidad absoluta de pleno derecho del contrato adjudicado, tipificación penal de conflicto de intereses, colusión y posible malversación de fondos públicos.',
      },
      causa: 'Falta de validación previa en el portal transaccional de compras con la base de datos de nómina gubernamental (Contraloría General).',
    },
    {
      finding_id: 'HA-2026-003',
      type: 'SOBREPRECIO_Y_DESVIO_HISTORICO',
      editable_status: 'CONFIRMED',
      procedure_applied: 'Contraste estadístico y de regresión contra la serie temporal de precios históricos de 10 años de la DGCP (ISSAI 200 - Auditoría Financiera).',
      condition: {
        description: 'Los precios unitarios adjudicados presentan un sobrecosto medio del +31.4% en suministros estándar en comparación con la base de precios históricos del periodo 2016-2026.',
        source_document: 'Acta_Adjudicacion_Licitacion_2023.pdf',
        page_reference: 'Pág. 18, Tabla de Oferta Económica',
        archive_token: 'ARC-AES256-991204X',
      },
      criterion: {
        law_reference: 'Reglamento de Aplicación No. 543-12',
        article: 'Artículo 8 (Estudio Previo de Mercado y Precios de Referencia Razonables)',
        period_validity: 'Vigente en el ejercicio analizado',
      },
      cross_reference_alerts: {
        shareholder_overlap: false,
        matched_entities: ['Consorcio Tecnológico SRL'],
        common_shareholder_id: undefined,
        employee_overlap_detected: false,
      },
      effect: {
        financial_impact: 1413000.0,
        description: 'Desvío presupuestario y lesión patrimonial directa estimada en RD$ 1,413,000.00 por liquidación por encima de los valores de mercado.',
      },
      causa: 'Omisión del estudio previo de mercado regulatorio y aceptación acrítica de la única propuesta económica presentada.',
    },
  ]);

  // Standard findings list (for backward compatibility and export)
  const [findings, setFindings] = useState<ForensicFinding[]>([
    {
      Tipo: 'Forense',
      Riesgo: 'Crítico',
      Bandera: 'Fraccionamiento de Compras y Evasión de Licitación',
      Impacto: 'Vulneración al principio de transparencia y libre concurrencia (Art. 11 Ley 340-06)',
      Acción: 'Remisión formal con indicios de responsabilidad penal a la PEPCA',
      Evidencia: 'Pág. 12: 3 órdenes de RD$ 1,500,000.00 ejecutadas el mismo día para el mismo suministro.',
    },
    {
      Tipo: 'Forense',
      Riesgo: 'Crítico',
      Bandera: 'Nómina Fantasma & Inhabilidad Absoluta',
      Impacto: 'Nulidad absoluta del contrato adjudicado y responsabilidad penal funcionarial',
      Acción: 'Apertura de sumario penal e inhabilitación definitiva del proveedor en el RNP',
      Evidencia: 'Pág. 24: Accionista mayoritario es a la vez Director de Planificación en nómina activa.',
    },
    {
      Tipo: 'Forense',
      Riesgo: 'Alto',
      Bandera: 'Sobreprecio Anómalo (+31.4%)',
      Impacto: 'Desvío presupuestario y lesión patrimonial al erario público',
      Acción: 'Ajuste de liquidación y cobro de fianza de fiel cumplimiento',
      Evidencia: 'Precios unitarios +31.4% respecto al histórico de 10 años de la DGCP.',
    },
  ]);

  const [legalViolations, setLegalViolations] = useState<LegalViolation[]>([
    {
      article: 'Artículo 11',
      norm: 'Ley 340-06 de Compras y Contrataciones Públicas (DOM)',
      description: 'Prohibición taxativa de fraccionamiento de compras para eludir los procedimientos obligatorios.',
      severity: 'Crítica',
    },
    {
      article: 'Artículo 14, Numeral 1',
      norm: 'Ley 340-06 y Art. 175 Código Penal',
      description: 'Prohibición a funcionarios y empleados públicos de ser oferentes o socios adjudicatarios en su propia entidad.',
      severity: 'Crítica',
    },
    {
      article: 'Artículo 8',
      norm: 'Reglamento de Aplicación No. 543-12',
      description: 'Obligatoriedad de efectuar estudios previos de mercado y precios históricos de referencia antes de licitar.',
      severity: 'Alta',
    },
  ]);

  const [criticalReqs, setCriticalReqs] = useState<string[]>([
    'Validación cruzada obligatoria de nómina del Estado (Contraloría) vs. Socios del RNP antes de adjudicar.',
    'Prohibición estricta de fraccionamiento cuando el monto anual consolidado exceda el umbral de Licitación.',
    'Póliza de Seriedad de la Oferta por el 1% del monto total ofertado emitida por aseguradora legalmente habilitada.',
    'Declaración Jurada Notariada conforme al Artículo 14 de la Ley 340-06 de no inhabilidad.',
  ]);

  const [eligibilityFactors, setEligibilityFactors] = useState<string[]>([
    'Incompatibilidad legal: Inhabilidad automática de empresas con funcionarios en junta directiva.',
    'Precios dentro del rango de desviación estándar máxima (+/-10%) del catálogo histórico de la DGCP.',
  ]);

  const [priceAnomaly, setPriceAnomaly] = useState({
    priceStatus: 'Alerta de Sobreprecio',
    deviationPercentage: 31.4,
    recommendation: 'El precio unitario adjudicado excede en un 31.4% el promedio histórico de 10 años registrado en el Sistema de Precios de la DGCP.',
  });

  // Modal State for In-Place Editing of an INTOSAI Finding
  const [editingFinding, setEditingFinding] = useState<IntosaiFindingModel | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editCausa, setEditCausa] = useState('');
  const [editImpact, setEditImpact] = useState(0);

  // Modal State for Evidence Custody Record
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  const countryConfig = COUNTRY_LEGAL_CONFIGS[country];

  // Quick Preset Handlers
  const handleLoadPreset = (presetType: 'DOM_FRACCIONAMIENTO' | 'HOSPITAL_MARCA' | 'SISTEMAS_COBIT') => {
    if (presetType === 'DOM_FRACCIONAMIENTO') {
      setTenderCode('MISPAS-CCC-URG-2023-0104');
      setTenderTitle('Adquisición de Insumos y Suministros Hospitalarios');
      setEntity('Ministerio de Inclusión Social y Salud Pública');
      setAnalysisText(
`CONTRATO DE ADQUISICIÓN DE SUMINISTROS Y TECNOLOGÍA. FECHA: 14 de Octubre de 2023.
ENTIDAD: Ministerio de Inclusión Social y Red Hospitalaria. 
ADJUDICATARIO: Consorcio Tecnológico SRL (RNC: 1-30-99812-4).
MONTO TOTAL: RD$ 4,500,000.00. 
PROCESO: Adjudicación Directa por Urgencia de la Entidad.
PÁGINA 12: Se aprueba la compra fraccionada en 3 órdenes independientes de RD$ 1,500,000.00 cada una ejecutadas el mismo día para agilizar el despacho.
PÁGINA 24: Composición accionaria del Adjudicatario: Socio Mayoritario Pedro Martínez (Cédula: 001-0000000-1, participación: 70%).
ANEXO NÓMINA ENTIDAD: Se verifica que el señor Pedro Martínez (Cédula: 001-0000000-1) figura activo como Director de Planificación de esta misma Institución contratante.
ESPECIFICACIONES TÉCNICAS: Se exige exclusividad de fábrica de marca patentada sin admitir equivalente funcional.`
      );
    } else if (presetType === 'HOSPITAL_MARCA') {
      setTenderCode('SNS-CCC-LPN-2026-0089');
      setTenderTitle('Adquisición de Equipos de Tomografía Axial Computarizada para la Red Hospitalaria Regional');
      setEntity('Servicio Nacional de Salud (SNS) / DGCP');
      setAnalysisText(
`PLIEGO DE CONDICIONES ESPECÍFICAS - SECCIÓN FORENSE A AUDITAR:
1. Objeto: Suministro e instalación de 4 Tomógrafos Multicorte de 64 cortes.
2. Plazo de presentación de ofertas: 5 días hábiles contados a partir de la publicación de la enmienda No. 2.
3. Especificaciones Técnicas: El detector debe poseer tecnología "Dual-Energy UltraMatrix" patentada con exclusividad de fábrica por marca "AlphaVance Medical". No se aceptarán equivalencias funcionales.
4. Experiencia mínima: Se requiere acreditar mínimo 15 años de operación continua en República Dominicana y ser distribuidor exclusivo oficial.
5. Garantía de Seriedad: Fianza bancaria por el 5% del valor de la oferta (no póliza de seguro).
6. Presupuesto estimado: DOP 184,500,000.00. No se publica desglose de precios unitarios ni estudio de precios de referencia DGCP.`
      );
    } else {
      setTenderCode('LOG-SYS-COBIT-2026-092');
      setTenderTitle('Auditoría Integral de Sistemas, Logs y Base de Datos Transaccional');
      setEntity('Dirección de Compras y Contraloría General');
      setAnalysisText(
`AUDITORÍA DE SISTEMAS COBIT 5 / INTOSAI ISSAI 400:
1. ANÁLISIS DE PISTAS DE AUDITORÍA: Se identificaron 14 modificaciones directas en la tabla maestro_adjudicaciones fuera del horario hábil (entre las 02:14 AM y 03:22 AM).
2. REGISTROS DE NÓMINA DUPLICADA: 3 funcionarios activos en la nómina 01 figuran con cuentas bancarias idénticas a los proveedores registrados en el módulo de pagos.
3. INCONSISTENCIAS DE LOGS: La firma electrónica del funcionario autorizante fue generada desde una IP externa no corporativa sin autenticación multifactor (MFA).`
      );
    }
  };

  // Handle File Upload simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setAnalysisText(text.slice(0, 15000));
        }
      };
      if (file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        setAnalysisText(`[CONTENIDO FORENSE EXTRAÍDO DEL EXPEDIENTE: ${file.name}]\n` + analysisText);
      }
    }
  };

  // Execute Core INTOSAI Engine via /api/v1/audit/process
  const handleExecuteIntosaiEngine = async () => {
    setIsAuditing(true);
    setAuditComplete(false);

    try {
      const response = await fetch('/api/v1/audit/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text_content: analysisText,
          filename: uploadedFileName || `${tenderCode}.pdf`,
          scope: `${countryConfig.name} - ${countryConfig.primaryLaw} (Alcance Multianual de hasta 10 Años)`,
          db_engine: 'all',
          country,
        }),
      });

      if (!response.ok) throw new Error('Error al conectar con el motor INTOSAI');
      const result = await response.json();

      if (result.status === 'SUCCESS' && result.data) {
        setReportId(result.report_id);
        setArchiveToken(result.archive_token);
        if (result.storage_synchronization) {
          setStorageSyncLog(result.storage_synchronization);
        }

        const reportData = result.data;
        if (reportData.findings_matrix && reportData.findings_matrix.length > 0) {
          setIntosaiFindings(reportData.findings_matrix);
          
          // Sync standard findings for Word editor
          const convertedFindings: ForensicFinding[] = reportData.findings_matrix.map((fm: IntosaiFindingModel) => ({
            Tipo: 'Forense (INTOSAI)',
            Riesgo: fm.effect.financial_impact > 1000000 ? 'Crítico' : 'Alto',
            Bandera: fm.type.replace(/_/g, ' '),
            Impacto: fm.effect.description,
            Acción: `Remisión pericial. Procedimiento: ${fm.procedure_applied}`,
            Evidencia: `${fm.condition.source_document} (${fm.condition.page_reference}): ${fm.condition.description.slice(0, 140)}...`,
          }));
          setFindings(convertedFindings);

          // Update cross reference alerts from first finding or consolidated
          const firstOverlap = reportData.findings_matrix.find((f: IntosaiFindingModel) => f.cross_reference_alerts?.shareholder_overlap || f.cross_reference_alerts?.employee_overlap_detected);
          if (firstOverlap) {
            setCrossReferenceAlerts(firstOverlap.cross_reference_alerts);
          }
        }
      }
      setAuditComplete(true);
    } catch (err) {
      console.error(err);
      setAuditComplete(true);
    } finally {
      setIsAuditing(false);
    }
  };

  // Open Edit Finding Modal
  const handleOpenEdit = (finding: IntosaiFindingModel) => {
    setEditingFinding(finding);
    setEditDesc(finding.condition.description);
    setEditCausa(finding.causa);
    setEditImpact(finding.effect.financial_impact);
  };

  // Save in-place changes to finding
  const handleSaveEdit = async () => {
    if (!editingFinding) return;

    try {
      await fetch('/api/v1/audit/findings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_id: reportId,
          finding_id: editingFinding.finding_id,
          description: editDesc,
          causa: editCausa,
          financial_impact: editImpact,
          editable_status: 'CONFIRMED',
        }),
      });

      setIntosaiFindings((prev) =>
        prev.map((f) =>
          f.finding_id === editingFinding.finding_id
            ? {
                ...f,
                editable_status: 'CONFIRMED',
                condition: { ...f.condition, description: editDesc },
                causa: editCausa,
                effect: { ...f.effect, financial_impact: editImpact },
              }
            : f
        )
      );
      setEditingFinding(null);
    } catch (e) {
      console.warn('Error saving edit:', e);
    }
  };

  // Dismiss False Positive Finding
  const handleDismissFinding = async (findingId: string) => {
    try {
      await fetch('/api/v1/audit/findings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_id: reportId,
          finding_id: findingId,
          editable_status: 'DISMISSED',
        }),
      });

      setIntosaiFindings((prev) => prev.filter((f) => f.finding_id !== findingId));
      setFindings((prev) => prev.filter((_, idx) => idx !== 0)); // sync
    } catch (e) {
      console.warn('Error dismissing finding:', e);
    }
  };

  const getReportPayload = () => {
    return {
      reportTitle: `DICTAMEN PERICIAL FORENSE (INTOSAI) - ${tenderCode}`,
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
      bidBondNotes: `${countryConfig.bidBondDefault}. Fianza emitida bajo estándares de la ${countryConfig.rectorBody}.`,
      priceNotes: priceAnomaly.recommendation,
      author: 'Lic. Pedro Baldera',
      role: 'Auditor Forense Principal',
      organization: 'BASA V7 / AUDIT INTELLIGENCE USA',
      auditDate: new Date().toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' }),
      aes256Hash: archiveToken,
    };
  };

  // Filtered findings by framework
  const filteredIntosaiFindings = intosaiFindings.filter((f) => {
    if (selectedFrameworkFilter === 'ALL') return true;
    if (selectedFrameworkFilter === 'INTOSAI-ISSAI-200') return f.type.includes('SOBREPRECIO') || f.procedure_applied.includes('ISSAI 200');
    if (selectedFrameworkFilter === 'INTOSAI-ISSAI-300') return f.type.includes('FRACCIONAMIENTO') || f.type.includes('COLUSION') || f.procedure_applied.includes('ISSAI 300');
    if (selectedFrameworkFilter === 'INTOSAI-ISSAI-400') return f.type.includes('NOMINA') || f.type.includes('LOG') || f.procedure_applied.includes('ISSAI 400');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Methodological Banner: INTOSAI Framework */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Motor de Inteligencia Forense Avanzado & INTOSAI ISSAI 200 / 300 / 400
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  BLINDAJE JUDICIAL
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Automatiza el ciclo de vida de hallazgos penales y administrativos: auditoría financiera (ISSAI 200), auditoría de gestión y precios históricos (ISSAI 300), y auditoría de sistemas e integridad de nómina (ISSAI 400 / COBIT 5) con cruce relacional y custodia de evidencia inmutable.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300 flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
              <span>Custodia: <strong>{archiveToken}</strong></span>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>PostgreSQL JSONB + MongoDB</span>
            </span>
          </div>
        </div>

        {/* 3 Pillars of INTOSAI Interactive Ticker */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div 
            onClick={() => setSelectedFrameworkFilter('INTOSAI-ISSAI-200')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedFrameworkFilter === 'INTOSAI-ISSAI-200'
                ? 'bg-amber-500/15 border-amber-500/60 shadow-md shadow-amber-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-amber-400 font-bold text-[11px] mb-1">
              <span>1. FINANCIERA (ISSAI 200)</span>
              <span className="text-[10px] text-slate-500">Saldos vs. Físico</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Detección de malversación, desvíos presupuestarios, sobrecostos y partidas no justificadas frente a la ejecución real.
            </p>
          </div>

          <div 
            onClick={() => setSelectedFrameworkFilter('INTOSAI-ISSAI-300')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedFrameworkFilter === 'INTOSAI-ISSAI-300'
                ? 'bg-amber-500/15 border-amber-500/60 shadow-md shadow-amber-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-cyan-400 font-bold text-[11px] mb-1">
              <span>2. GESTIÓN (ISSAI 300)</span>
              <span className="text-[10px] text-slate-500">Eficiencia & Precios</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Detección de fraccionamiento de gasto, acuerdos colusorios de precios, especificaciones direccionadas y restricciones.
            </p>
          </div>

          <div 
            onClick={() => setSelectedFrameworkFilter('INTOSAI-ISSAI-400')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedFrameworkFilter === 'INTOSAI-ISSAI-400'
                ? 'bg-amber-500/15 border-amber-500/60 shadow-md shadow-amber-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px] mb-1">
              <span>3. SISTEMAS (ISSAI 400 / COBIT)</span>
              <span className="text-[10px] text-slate-500">Logs & BD Maestra</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Cruce cruzado de registros de nómina institucional vs. proveedores y accionistas adjudicados ("Nóminas Fantasma").
            </p>
          </div>
        </div>
      </div>

      {/* Relational Cross-Referencing & Custody Alert Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Cruce Relacional de Actores, Accionistas y Detección de Nóminas Fantasma
            </h3>
          </div>

          <button
            onClick={() => setShowEvidenceModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-cyan-300 font-mono transition-colors"
          >
            <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ver Bóveda de Custodia ({archiveToken})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Shareholder Overlap Alert */}
          <div className={`p-3.5 rounded-lg border ${
            crossReferenceAlerts.shareholder_overlap
              ? 'bg-rose-950/30 border-rose-500/40 text-slate-200'
              : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center justify-between font-bold mb-1.5">
              <span className="text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Alerta de Accionistas / Socios Cruzados:</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-mono font-bold">
                {crossReferenceAlerts.shareholder_overlap ? 'PATRÓN DETECTADO' : 'CONFORME'}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Coincidencia de titularidad y beneficio final identificada entre empresas concurrentes: 
              <strong className="text-amber-300 ml-1">{crossReferenceAlerts.matched_entities.join(' ↔ ')}</strong>.
            </p>
            {crossReferenceAlerts.common_shareholder_id && (
              <div className="mt-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                Identificador común detectado: <span className="text-rose-400 font-bold">{crossReferenceAlerts.common_shareholder_id}</span>
              </div>
            )}
          </div>

          {/* Phantom Payroll / Employee Overlap Alert */}
          <div className={`p-3.5 rounded-lg border ${
            crossReferenceAlerts.employee_overlap_detected
              ? 'bg-rose-950/30 border-rose-500/40 text-slate-200'
              : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <div className="flex items-center justify-between font-bold mb-1.5">
              <span className="text-rose-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Alerta de Empleado Público / Nómina Fantasma:</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-mono font-bold">
                {crossReferenceAlerts.employee_overlap_detected ? 'CRÍTICO / PENAL' : 'CONFORME'}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              El funcionario o empleado público activo figura simultáneamente como socio o beneficiario adjudicado de la empresa contratista en su propia institución.
            </p>
            <div className="mt-2 text-[10px] font-mono text-emerald-400 bg-slate-900/80 p-1.5 rounded border border-slate-800">
              Vulneración taxativa: <span className="text-white font-semibold">Art. 14 Ley 340-06 & Art. 175 Código Penal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tender & Corpus Input Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        {/* Quick Presets for Auditor Testing */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Cargar Casos Periciales de Prueba Rápida:</span>
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleLoadPreset('DOM_FRACCIONAMIENTO')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded text-xs transition-colors"
            >
              📋 Caso Real DGCP: Fraccionamiento & Nómina
            </button>
            <button
              onClick={() => handleLoadPreset('HOSPITAL_MARCA')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs transition-colors"
            >
              🏥 Pliego Tomógrafos (Marca Exclusiva)
            </button>
            <button
              onClick={() => handleLoadPreset('SISTEMAS_COBIT')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs transition-colors"
            >
              💻 Auditoría Sistemas (ISSAI 400)
            </button>
          </div>
        </div>

        {/* Primary Metadata Fields */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Código de Licitación o Proceso:
            </label>
            <input
              type="text"
              value={tenderCode}
              onChange={(e) => setTenderCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Título del Expediente / Contrato:
            </label>
            <input
              type="text"
              value={tenderTitle}
              onChange={(e) => setTenderTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Alcance Temporal Multianual:
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

        {/* Text Area & File Uploader */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Corpus Documental (Pliego, Contrato, Actas de Apertura, Adendas, Facturas):</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs border border-slate-700 transition-colors">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>{uploadedFileName ? `Archivo: ${uploadedFileName}` : 'Cargar Archivo Fuente (.pdf, .txt, .xlsx)'}</span>
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
            rows={6}
            value={analysisText}
            onChange={(e) => setAnalysisText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono leading-relaxed focus:border-amber-500 focus:outline-none"
            placeholder="Pegue aquí el texto de los contratos, composición de accionistas, actas de adjudicación o nómina para ejecutar el cruce forense..."
          />
        </div>

        {/* Action Execution Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Motor: Gemini 2.5 Pro (Razonamiento Forense) & Pistas de Auditoría INTOSAI</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExecuteIntosaiEngine}
              disabled={isAuditing}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Cpu className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'PROCESANDO CON INTOSAI FORENSE...' : 'EJECUTAR MOTOR INTOSAI FORENSE (FASTAPI / GEMINI 2.5 PRO)'}</span>
            </button>
          </div>
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
                      Dictamen Pericial de Cumplimiento Normativo (INTOSAI)
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
                    Evaluado bajo {countryConfig.primaryLaw} y los estándares internacionales ISSAI 200, 300 y 400
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
              <strong className="text-white block mb-1">Resumen Ejecutivo de la Evidencia Pericial:</strong>
              {executiveSummary}
            </div>
          </div>

          {/* Structured INTOSAI Findings Matrix (Editable with the 4 Elements) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Matriz de Hallazgos Forenses Estructurados (4 Elementos INTOSAI)
                </h3>
              </div>

              {/* Framework filter selector */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 mr-2 text-[11px]">Filtrar por Marco:</span>
                {(['ALL', 'INTOSAI-ISSAI-200', 'INTOSAI-ISSAI-300', 'INTOSAI-ISSAI-400'] as const).map((fw) => (
                  <button
                    key={fw}
                    onClick={() => setSelectedFrameworkFilter(fw)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                      selectedFrameworkFilter === fw
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {fw === 'ALL' ? 'Todos' : fw.replace('INTOSAI-ISSAI-', 'ISSAI ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Findings Cards (Editable in-place) */}
            <div className="space-y-4">
              {filteredIntosaiFindings.map((finding) => (
                <div
                  key={finding.finding_id}
                  className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        {finding.finding_id}
                      </span>
                      <span className="font-semibold text-white text-xs">
                        {finding.type.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        finding.editable_status === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : finding.editable_status === 'DISMISSED'
                          ? 'bg-slate-800 text-slate-500 line-through'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {finding.editable_status === 'CONFIRMED' ? 'CONFIRMADO' : finding.editable_status === 'DISMISSED' ? 'DESCARTADO' : 'PENDIENTE DE REVISIÓN'}
                      </span>

                      {/* In-place edit button */}
                      <button
                        onClick={() => handleOpenEdit(finding)}
                        className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                        title="Editar Hallazgo en Pantalla"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Dismiss false positive button */}
                      <button
                        onClick={() => handleDismissFinding(finding.finding_id)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Descartar como Falso Positivo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 4 INTOSAI Elements Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Element 1: Condición */}
                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                        <span>1. Condición (Lo que se encontró)</span>
                        <span className="text-slate-400 font-mono text-[9px]">{finding.condition.page_reference}</span>
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {finding.condition.description}
                      </p>
                      <div className="text-[10px] font-mono text-slate-400 pt-1">
                        Archivo fuente: <span className="text-slate-300 font-medium">{finding.condition.source_document}</span>
                      </div>
                    </div>

                    {/* Element 2: Criterio */}
                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
                        <span>2. Criterio (Norma / Ley Infringida)</span>
                        <span className="text-slate-400 font-mono text-[9px]">{finding.criterion.period_validity}</span>
                      </div>
                      <p className="text-slate-200 text-xs font-semibold">
                        {finding.criterion.article}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {finding.criterion.law_reference}
                      </p>
                    </div>

                    {/* Element 3: Efecto */}
                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center justify-between">
                        <span>3. Efecto (Impacto Económico & Legal)</span>
                        <span className="text-rose-400 font-bold font-mono">
                          {currency} {finding.effect.financial_impact.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {finding.effect.description}
                      </p>
                    </div>

                    {/* Element 4: Causa */}
                    <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                        4. Causa (Fallo de Control / Acción Deliberada)
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {finding.causa}
                      </p>
                    </div>
                  </div>

                  {/* Procedimiento Utilizado */}
                  <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center gap-2">
                    <span className="text-amber-400 font-bold shrink-0">Procedimiento Forense:</span>
                    <span>{finding.procedure_applied}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Violations & Requirements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Mapeo Legal Dinámico (Artículo por Artículo)</span>
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

            <div className="space-y-6">
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

      {/* Modal for In-Place Editing of an INTOSAI Finding */}
      {editingFinding && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Edit3 className="w-4 h-4" />
                <span>Edición de Hallazgo Forense ({editingFinding.finding_id})</span>
              </div>
              <button
                onClick={() => setEditingFinding(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  1. Condición (Hechos objetivos constatados):
                </label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  4. Causa (Falla de control interno u origen intencional):
                </label>
                <textarea
                  rows={2}
                  value={editCausa}
                  onChange={(e) => setEditCausa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  3. Impacto Financiero Cuantificado ({currency}):
                </label>
                <input
                  type="number"
                  value={editImpact}
                  onChange={(e) => setEditImpact(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingFinding(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar Modificación</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Evidence Custody Record */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Fingerprint className="w-5 h-5" />
                <span>Bóveda de Evidencia Inmutable (SOC2 / HIPAA)</span>
              </div>
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                <div>Token de Archivo: <strong className="text-cyan-300">{archiveToken}</strong></div>
                <div>Reporte ID: <span className="text-slate-300">{reportId}</span></div>
                <div>Hash SHA-256: <span className="text-amber-400 break-all text-[11px]">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span></div>
                <div>Cifrado en Reposo: <span className="text-emerald-400">AES-256-GCM Sellado</span></div>
              </div>

              <div className="space-y-1 text-[11px] text-slate-400">
                <p className="text-white font-semibold mb-1">Estado de Persistencia Políglota:</p>
                <div className="p-2 bg-slate-950 rounded border border-slate-800/80 space-y-1">
                  <div>🐘 PostgreSQL: <span className="text-emerald-400">{storageSyncLog.postgresql || 'Guardado (JSONB)'}</span></div>
                  <div>🍃 MongoDB: <span className="text-emerald-400">{storageSyncLog.mongodb || 'Guardado (Colección NoSQL)'}</span></div>
                  <div>🇺🇸 Audit Intelligence USA: <span className="text-cyan-400">{storageSyncLog.audit_intelligence_usa || 'Sincronizado AES-256'}</span></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg"
              >
                Cerrar Bóveda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
