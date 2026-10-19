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
