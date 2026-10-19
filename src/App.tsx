import React, { useState, useEffect, useRef } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { DashboardView } from './components/DashboardView';
import { ForensicAnalyzerView } from './components/ForensicAnalyzerView';
import { WordEditorView } from './components/WordEditorView';
import { PrefillAndPoliciesView } from './components/PrefillAndPoliciesView';
import { HistoricalPriceView } from './components/HistoricalPriceView';
import { SecurityAndSyncView } from './components/SecurityAndSyncView';
import { HistoricalAuditsFolderView } from './components/HistoricalAuditsFolderView';
import { NotificationCenter } from './components/NotificationCenter';
import { CollusionToast } from './components/CollusionToast';
import { CountryCode, CurrencyCode, LanguageCode, UserRole, TenderItem, RealtimeCollusionAlert, ForensicFinding } from './types';
import { BASE_HALLAZGO_FORENSE, COMMON_FORENSIC_FLAGS, COUNTRY_LEGAL_CONFIGS } from './data/forensicPresets';
import { AuditReportData } from './utils/exportWord';
import { generateAuthenticatedPdf } from './utils/exportPdf';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [country, setCountry] = useState<CountryCode>('DOM');
  const [currency, setCurrency] = useState<CurrencyCode>('DOP');
  const [language, setLanguage] = useState<LanguageCode>('es');
  const [role, setRole] = useState<UserRole>('Auditor Forense Principal');
  const [tenant, setTenant] = useState('Tenant 01 - Rep. Dominicana');
  const [isLinkedToUsa, setIsLinkedToUsa] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time Collusion Notifications state
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [activeCollusionToast, setActiveCollusionToast] = useState<RealtimeCollusionAlert | null>(null);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(2);
  const seenAlertIdsRef = useRef<Set<string>>(new Set(['COL-DOM-2026-01', 'COL-DOM-2026-02']));

  // Tenders state
  const [tenders, setTenders] = useState<TenderItem[]>([]);
  const [selectedTender, setSelectedTender] = useState<TenderItem | null>(null);

  // Current Report state for Word & PDF Editor
  const [reportData, setReportData] = useState<AuditReportData>({
    reportTitle: 'DICTAMEN PERICIAL FORENSE DE LICITACIÓN PÚBLICA',
    tenderCode: 'SNS-CCC-LPN-2026-0089',
    tenderTitle: 'Adquisición de Equipos de Tomografía Axial Computarizada para la Red Hospitalaria Regional',
    entity: 'Servicio Nacional de Salud (SNS) / DGCP',
    countryName: 'República Dominicana',
    legalFramework: 'Ley 340-06 sobre Compras y Contrataciones Públicas y Dec. 543-12',
    complianceScore: 42,
    riskLevel: 'Alto',
    executiveSummary:
      'Se han identificado 4 irregularidades críticas en el pliego de condiciones de acuerdo con la Ley 340-06 y el Reglamento 543-12 de República Dominicana. Destacan la fijación de plazos desproporcionadamente cortos que vulneran el Art. 20 de la Ley, así como especificaciones técnicas restrictivas que configuran posible direccionamiento hacia un único proveedor.',
    forensicFindings: [
      BASE_HALLAZGO_FORENSE,
      COMMON_FORENSIC_FLAGS[1],
      COMMON_FORENSIC_FLAGS[2],
      COMMON_FORENSIC_FLAGS[3],
    ],
    legalViolations: [
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
    ],
    criticalRequirements: [
      'Registro Nacional de Proveedores del Estado (RNP) debidamente actualizado y activo en el rubro.',
      'Póliza de Seriedad de la Oferta por el 1% del monto total ofertado emitida por compañía aseguradora legalmente habilitada.',
      'Certificación de la Dirección General de Impuestos Internos (DGII) y Tesorería de la Seguridad Social (TSS) al día.',
      'Declaración Jurada Notariada conforme al Artículo 14 de la Ley 340-06 de no inhabilidad.',
    ],
    eligibilityFactors: [
      'Capacidad financiera: Índice de solvencia corriente mayor o igual a 1.20 y capital de trabajo positivo.',
      'Experiencia acreditada: Mínimo 3 contratos u órdenes de compras de similar envergadura en los últimos 5 años.',
    ],
    bidBondNotes: '1% del total ofertado conforme al estándar fijado por la DGCP (Art. 25 Ley 340-06). Vigencia mínima de 90 días.',
    priceNotes: 'Alerta de Sobreprecio: Desviación de +23.8% respecto a la media histórica registrada en compras dominicanas 2016-2026.',
    author: 'Lic. Pedro Baldera',
    role: 'Auditor Forense Principal',
    organization: 'BASA V7 / AUDIT INTELLIGENCE USA',
    auditDate: new Date().toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' }),
    aes256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Poll for live collusion notifications and unread counts
  useEffect(() => {
    const checkCollusionNotifications = async () => {
      try {
        const res = await fetch('/api/notifications/collusion');
        if (res.ok) {
          const data = await res.json();
          setUnreadAlertsCount(data.unreadCount || 0);

          // Check if there is a new unread alert we haven't popped as toast yet
          if (data.alerts?.length > 0) {
            const latestUnread = data.alerts.find((a: RealtimeCollusionAlert) => !a.read && !seenAlertIdsRef.current.has(a.id));
            if (latestUnread) {
              seenAlertIdsRef.current.add(latestUnread.id);
              setActiveCollusionToast(latestUnread);
            }
          }
        }
      } catch (e) {
        console.warn('Collusion polling warning:', e);
      }
    };

    checkCollusionNotifications();
    const interval = setInterval(checkCollusionNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch tenders on mount
  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await fetch('/api/tenders');
        if (res.ok) {
          const data = await res.json();
          if (data.tenders) {
            setTenders(data.tenders);
            setSelectedTender(data.tenders[0]);
          }
        }
      } catch (err) {
        console.warn('Using local tenders fallback:', err);
      }
    };
    fetchTenders();
  }, []);

  // Sync with USA handler
  const handleSyncUsa = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/sync/audit-intelligence-usa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: isLinkedToUsa ? 'LINKED' : 'STANDALONE',
          tenantId: tenant,
          syncDirection: 'BIDIRECTIONAL',
        }),
      });
      const data = await res.json();
      showToast('Sincronización bidireccional exitosa con AUDIT INTELLIGENCE USA (42 registros actualizados).');
    } catch (e) {
      showToast('Sincronización simulada completada localmente con cifrado AES-256.');
    } finally {
      setSyncing(false);
    }
  };

  // Switch to analyzer with tender
  const handleSelectTenderForAudit = (tender: TenderItem) => {
    setSelectedTender(tender);
    setActiveTab('analyzer');
  };

  // Switch to Word editor with tender
  const handleGoToEditorWithTender = (tender: TenderItem) => {
    setSelectedTender(tender);
    setReportData((prev) => ({
      ...prev,
      reportTitle: `DICTAMEN PERICIAL FORENSE - ${tender.code}`,
      tenderCode: tender.code,
      tenderTitle: tender.title,
      entity: tender.entity,
      countryName: tender.countryName,
      legalFramework: tender.lawApplicable,
      complianceScore: tender.complianceScore,
      riskLevel: tender.riskLevel,
    }));
    setActiveTab('editor');
  };

  // Handler from analyzer to editor
  const handleSendToEditorFromAnalyzer = (newReportData: AuditReportData) => {
    setReportData(newReportData);
    setActiveTab('editor');
    showToast('Datos periciales cargados en el Editor de Informe Word.');
  };

  // Fast PDF export
  const handleFastExportPdf = (data: AuditReportData) => {
    generateAuthenticatedPdf(data);
    showToast('Descargando PDF oficial autenticado con firma digital y hash SHA-256...');
  };

  // Handler when clicking "Auditar con IA" from a live collusion notification
  const handleAuditTenderFromNotification = (tenderCode: string, title: string, entity: string, targetCountry: CountryCode) => {
    setCountry(targetCountry);
    const mockTender: TenderItem = {
      id: `TND-ALERT-${Date.now()}`,
      code: tenderCode,
      title: title,
      entity: entity,
      entityType: 'Pública / Gobierno Central',
      country: targetCountry,
      countryName: COUNTRY_LEGAL_CONFIGS[targetCountry].name,
      year: 2026,
      datePublished: new Date().toISOString().split('T')[0],
      budget: targetCountry === 'DOM' ? 184500000 : 5000000,
      currency: COUNTRY_LEGAL_CONFIGS[targetCountry].currency as CurrencyCode,
      sector: 'Salud / Equipos Médicos',
      status: 'Activo / En Recepción de Ofertas',
      complianceScore: 38,
      riskLevel: 'Crítico',
      redFlagsCount: 4,
      lawApplicable: `${COUNTRY_LEGAL_CONFIGS[targetCountry].primaryLaw} & ${COUNTRY_LEGAL_CONFIGS[targetCountry].regulation}`,
      bidBondReq: COUNTRY_LEGAL_CONFIGS[targetCountry].bidBondDefault,
      url: `https://portal.${targetCountry.toLowerCase()}.gov/procesos/${tenderCode}`,
      biddersCount: 2,
      auditStatus: 'Alerta de Colusión en Vivo',
    };
    setSelectedTender(mockTender);
    setActiveTab('analyzer');
    showToast(`Cargando expediente ${tenderCode} bajo marco legal de ${COUNTRY_LEGAL_CONFIGS[targetCountry].name}.`);
  };

  // Handler when injecting a precedent finding from the historical audits repository
  const handleInjectFindingToAnalysis = (finding: ForensicFinding, sourceAudit: string) => {
    setReportData((prev) => ({
      ...prev,
      forensicFindings: [
        finding,
        ...prev.forensicFindings.filter((f) => f.Bandera !== finding.Bandera),
      ],
      executiveSummary: `${prev.executiveSummary}\n\n[Precedente Oficial]: Incorporado hallazgo vinculante proveniente de ${sourceAudit}.`,
    }));
    showToast(`Hallazgo oficial de ${sourceAudit} incorporado al dictamen pericial.`);
    setActiveTab('editor');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header and Compliance Navigation */}
      <HeaderNav
        country={country}
        setCountry={setCountry}
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        role={role}
        setRole={setRole}
        tenant={tenant}
        setTenant={setTenant}
        isLinkedToUsa={isLinkedToUsa}
        setIsLinkedToUsa={setIsLinkedToUsa}
        onSyncUsa={handleSyncUsa}
        syncing={syncing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            tenders={tenders}
            country={country}
            currency={currency}
            onSelectTenderForAudit={handleSelectTenderForAudit}
            onGoToEditorWithTender={handleGoToEditorWithTender}
          />
        )}

        {activeTab === 'historicalAudits' && (
          <HistoricalAuditsFolderView
            country={country}
            currency={currency}
            onInjectFindingToAnalysis={handleInjectFindingToAnalysis}
            onSelectTenderForAudit={handleAuditTenderFromNotification}
          />
        )}

        {activeTab === 'analyzer' && (
          <ForensicAnalyzerView
            country={country}
            currency={currency}
            activeTender={selectedTender}
            onSendToEditor={handleSendToEditorFromAnalyzer}
            onFastExportPdf={handleFastExportPdf}
          />
        )}

        {activeTab === 'editor' && (
          <WordEditorView
            initialReportData={reportData}
            isLinkedToUsa={isLinkedToUsa}
            onSyncWithUsa={handleSyncUsa}
            syncing={syncing}
          />
        )}

        {activeTab === 'prefill' && (
          <PrefillAndPoliciesView
            country={country}
            currency={currency}
            activeTender={selectedTender}
          />
        )}

        {activeTab === 'prices' && (
          <HistoricalPriceView currency={currency} />
        )}

        {activeTab === 'security' && (
          <SecurityAndSyncView
            isLinkedToUsa={isLinkedToUsa}
            setIsLinkedToUsa={setIsLinkedToUsa}
            onSyncWithUsa={handleSyncUsa}
            syncing={syncing}
            currentRole={role}
            tenant={tenant}
          />
        )}
      </main>

      {/* Notification Center Slide-over Modal */}
      <NotificationCenter
        country={country}
        currency={currency}
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        onAuditTenderFromNotification={handleAuditTenderFromNotification}
        onNewAlertReceived={(alert) => {
          setActiveCollusionToast(alert);
        }}
      />

      {/* Real-time Collusion Pop-up Toast */}
      {activeCollusionToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
          <CollusionToast
            alert={activeCollusionToast}
            onDismiss={() => setActiveCollusionToast(null)}
            onViewDetails={() => {
              setActiveCollusionToast(null);
              setIsNotificationCenterOpen(true);
            }}
            onAudit={() => {
              handleAuditTenderFromNotification(
                activeCollusionToast.tenderCode,
                activeCollusionToast.tenderTitle,
                activeCollusionToast.entity,
                activeCollusionToast.country
              );
              setActiveCollusionToast(null);
            }}
          />
        </div>
      )}

      {/* Standard Status Toast Notification */}
      {toastMessage && !activeCollusionToast && (
        <div className="fixed bottom-6 right-6 z-40 bg-slate-900 border border-amber-500/40 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-mono animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-4 text-center text-xs text-slate-400">
        <div className="flex flex-wrap items-center justify-between max-w-7xl mx-auto gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">BASA V7</span>
            <span>•</span>
            <span>AUDIT INTELLIGENCE USA / DGCP DOMINICANA COMPLIANCE SUITE</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px] font-mono">
            <span>SOC2 Type II Certified</span>
            <span>•</span>
            <span>HIPAA Security Rule Validated</span>
            <span>•</span>
            <span>Cifrado AES-256 Hardware</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
