export type CountryCode = 'DOM' | 'USA' | 'COL' | 'MEX' | 'CHL' | 'PAN' | 'ESP';
export type CurrencyCode = 'DOP' | 'USD' | 'EUR' | 'COP' | 'MXN';
export type LanguageCode = 'es' | 'en' | 'fr';

export type UserRole = 
  | 'Auditor Forense Principal'
  | 'Oficial de Cumplimiento'
  | 'Especialista en Licitaciones'
  | 'Super Admin Multitenant';

export interface ForensicFinding {
  Tipo: string;
  Riesgo: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  Bandera: string;
  Impacto: string;
  Acción: string;
  Evidencia?: string;
}

export interface LegalViolation {
  article: string;
  norm: string;
  description: string;
  severity: 'Media' | 'Alta' | 'Crítica';
}

export interface TenderItem {
  id: string;
  code: string;
  title: string;
  entity: string;
  entityType: 'Pública / Gobierno Central' | 'Pública / Descentralizada' | 'ONG / Fundación' | 'Privada / Corporativa' | 'Pública / Federal USA' | 'Pública / Concesiones';
  country: CountryCode;
  countryName: string;
  year: number;
  datePublished: string;
  budget: number;
  currency: CurrencyCode;
  sector: string;
  status: 'Activo / En Recepción de Ofertas' | 'En Evaluación' | 'Adjudicado' | 'Cerrado' | 'Histórico' | 'Histórico 10 Años' | 'Soliciting Offers' | 'Evaluación de Propuestas';
  complianceScore: number;
  riskLevel: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  redFlagsCount: number;
  lawApplicable: string;
  bidBondReq: string;
  url: string;
  biddersCount: number;
  auditStatus: string;
}

export interface BidBondPolicy {
  policyNumber: string;
  tenderCode: string;
  beneficiary: string;
  insuredEntity: string;
  policyType: 'Seriedad de la Oferta (1%)' | 'Fiel Cumplimiento de Contrato (4-10%)' | 'Buen Uso de Anticipo (20%)' | 'Vicios Ocultos';
  amount: number;
  currency: CurrencyCode;
  insurer: string;
  issueDate: string;
  expiryDate: string;
  status: 'Emitida & Activa' | 'En Tramitación' | 'Vencida' | 'Liberada';
  digitalSealHash: string;
  qrVerified: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  entityId?: string;
  category: 'ACCESS' | 'DATA_READ' | 'DATA_MODIFY' | 'AI_FORENSIC' | 'SYNC_USA' | 'SECURITY';
  status: 'SUCCESS' | 'WARNING' | 'ALERT';
  ipAddress: string;
  details: string;
  aes256Checksum: string;
  soc2Compliance: boolean;
  hipaaCompliance: boolean;
}

export interface HistoricalPriceItem {
  itemCode: string;
  description: string;
  category: string;
  unit: string;
  minPriceHistorical: number;
  avgPriceHistorical: number;
  maxPriceHistorical: number;
  currentTenderPrice: number;
  priceTrend: 'Estable' | 'Inflacionario' | 'Sobreprecio Anómalo' | 'Baja Temeraria';
  historicalPeriod: string;
  deviationPercent: number;
}

export interface ThreatModelMeta {
  pais: CountryCode | string;
  periodo_fiscal: string;
  sistema_origen: string;
}

export interface BudgetExecutionDeviation {
  desvio_detectado: boolean;
  monto_alerta: number;
  moneda?: CurrencyCode;
  porcentaje_desvio?: number;
  descripcion: string;
}

export interface EarlyFraudAlert {
  id: string;
  nivel_riesgo: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO';
  tipo: 'Fraccionamiento' | 'Colusion' | 'Sobreprecio' | 'Direccionamiento' | 'Tiempo_Anomalo';
  evidencia_origen: string;
  norma_infringida: string;
}

export interface ThreatEngineOutput {
  meta: ThreatModelMeta;
  ejecucion_presupuestaria: BudgetExecutionDeviation;
  alertas_tempranas_fraude: EarlyFraudAlert[];
  alertas_dashboard: {
    critico_colusion_fraccionamiento: string;
    advertencia_desviacion_presupuestaria: string;
    seguridad_log_acceso: string;
  };
  especificaciones_coincidencia_proveedor_pct: number;
  proveedor_coincidente?: string;
  publicado_dia_no_laborable: boolean;
  plazo_dias_otorgado: number;
  plazo_minimo_legal: number;
}

export interface RealtimeCollusionAlert {
  id: string;
  timestamp: string;
  tenderCode: string;
  tenderTitle: string;
  entity: string;
  country: CountryCode;
  countryName: string;
  collusionType: 'Ofertas Sombra / Cobertura' | 'Rotación de Licitadores' | 'Metadatos Idénticos' | 'Repartición de Mercado / Subcontratación Encubierta' | 'Precios Correlacionados';
  severity: 'CRITICO' | 'ALTO';
  infringedLaw: string;
  lawArticle: string;
  rectorEntity: string;
  evidenceDetail: string;
  biddersInvolved: string[];
  estimatedImpact: number;
  currency: CurrencyCode;
  read: boolean;
}

export interface HistoricalAuditRecord {
  id: string;
  sourceOrgan: 'Cámara de Cuentas' | 'Contraloría General' | 'DGCP' | 'Auditoría Externa Privada / ONG' | 'GAO / OIG USA' | 'Contraloría General Colombia' | 'ASF México';
  entityAudited: string;
  entityType: 'Pública / Gobierno Central' | 'Pública / Descentralizada' | 'Ayuntamiento / Municipio' | 'ONG / Fundación' | 'Privada / Corporativa' | 'Pública / Federal USA';
  country: CountryCode;
  countryName: string;
  auditNumber: string;
  title: string;
  auditPeriod: string;
  publicationDate: string;
  legalBasis: string;
  totalAmountAudited: number;
  totalFindingsAmount: number;
  currency: CurrencyCode;
  riskRating: 'Crítico' | 'Alto' | 'Medio' | 'Bajo';
  status: 'Publicada Oficial' | 'Remitida a PEPCA / MP' | 'Juicio de Cuentas' | 'Plan de Mejora en Ejecución';
  officialReportUrl?: string;
  documentFileName?: string;
  executiveSummary: string;
  findings: ForensicFinding[];
  financialDiscrepancies: {
    concept: string;
    amount: number;
    description: string;
    infringedArticle: string;
  }[];
  officialsResponsible?: string[];
  recurrentVendorsInvolved?: string[];
}

// ---------------------------------------------------------------------------
// INTOSAI (ISSAI 200, 300, 400) + COBIT FORENSIC DATA MODELS
// ---------------------------------------------------------------------------
export type IntosaiFrameworkType = 
  | 'INTOSAI-ISSAI-200'  // Financiera: Validación de saldos vs. Ejecución física (malversación, desvíos presupuestarios)
  | 'INTOSAI-ISSAI-300'  // Gestión: Eficiencia de procesos y análisis de precios históricos (colusión, direccionamiento)
  | 'INTOSAI-ISSAI-400'  // Sistemas: Análisis de logs, pistas de auditoría y base de datos maestra (nóminas fantasma, alteración)
  | 'COBIT-5';

export interface ConditionModel {
  description: string;
  source_document: string;
  page_reference: string;
  archive_token: string;
}

export interface CriterionModel {
  law_reference: string;
  article: string;
  period_validity: string;
}

export interface CrossReferenceAlerts {
  shareholder_overlap: boolean;
  matched_entities: string[];
  common_shareholder_id?: string;
  employee_overlap_detected: boolean;
}

export interface EffectModel {
  financial_impact: number;
  description: string;
}

export interface IntosaiFindingModel {
  finding_id: string;
  type: string;
  procedure_applied: string;
  condition: ConditionModel;
  criterion: CriterionModel;
  cross_reference_alerts: CrossReferenceAlerts;
  effect: EffectModel;
  causa: string;
  editable_status?: 'PENDING_REVIEW' | 'CONFIRMED' | 'DISMISSED';
}

export interface ForensicAuditReport {
  frameworks: string[];
  scope_period: string;
  status?: string;
  findings_matrix: IntosaiFindingModel[];
}

export interface IntosaiProcessResponse {
  status: 'SUCCESS' | 'ERROR';
  report_id: string;
  archive_token: string;
  filename_processed: string;
  storage_synchronization: {
    postgresql?: string;
    mongodb?: string;
    audit_intelligence_usa?: string;
  };
  data: ForensicAuditReport;
}

export interface ProcedureTest {
  id: string;
  name: string;
  description: string;
  procedure_type: 'CRUCE_ACCIONISTAS' | 'DESVIACION_PRECIOS' | 'PLAZO_LICITACION' | 'NOMINA_VS_PROVEEDORES' | 'MARCA_DIRIGIDA' | 'ARQUEO_PRESUPUESTO';
  result: 'PASS' | 'FAIL' | 'NOT_TESTED';
  notes: string;
  evidence_ref?: string;
  tested_by?: string;
  tested_at?: string;
}

export interface CoachingNote {
  id: string;
  author: string;
  role: string;
  date: string;
  content: string;
  status: 'ABIERTA' | 'RESUELTA';
  resolved_at?: string;
}

export interface FindingSheet {
  title: string;
  finding_code: string;
  detected_procedure: string;
  condition: {
    facts: string;
    document_source: string;
    page_paragraph: string;
    hash_sha256: string;
    archive_token: string;
  };
  criterion: {
    law_and_decree: string;
    article_exact: string;
    legal_standard: string;
    period_effective: string;
  };
  cause: {
    root_failure: string;
    control_deviation_type: string;
    intentionality: 'DELIBERADA_COLUSION' | 'NEGLIGENCIA_GRAVE' | 'FALLA_SISTEMICA';
  };
  effect: {
    estimated_damage_local: number;
    estimated_damage_usd: number;
    qualitative_impact: string;
    penal_or_administrative_risk: string;
  };
  recommendation: {
    immediate_action: string;
    structural_correction: string;
    sanctions_proposed: string;
  };
}

export interface AuditWorkpaper {
  id: string;
  workpaper_code: string;
  title: string;
  audit_type: 'FINANCIERA_ISSAI_200' | 'GESTION_ISSAI_300' | 'SISTEMAS_ISSAI_400' | 'INTEGRAL_FORENSE';
  risk_level: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO';
  status: 'BORRADOR' | 'EN_REVISION' | 'SUPERVISADO' | 'VALIDADO_SIGNOFF' | 'DESCARTADO';
  scope_entity: string;
  scope_period: string;
  country: string;
  assigned_auditor: string;
  reviewing_supervisor: string;
  sign_off_date?: string;
  sign_off_hash?: string;
  procedure_tests: ProcedureTest[];
  finding_sheet: FindingSheet;
  coaching_notes: CoachingNote[];
  traceability: {
    source_file: string;
    portal_origin: string;
    sha256: string;
    archive_token: string;
    timestamp: string;
    verified_immutable: boolean;
  };
}



