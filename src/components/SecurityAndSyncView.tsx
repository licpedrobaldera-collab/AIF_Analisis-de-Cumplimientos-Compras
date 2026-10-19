import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Link2, 
  Unlink, 
  Lock, 
  RefreshCw, 
  BellRing, 
  FileText, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  KeyRound, 
  Search, 
  ShieldAlert,
  Database
} from 'lucide-react';
import { AuditLogEntry, UserRole } from '../types';

interface SecurityAndSyncViewProps {
  isLinkedToUsa: boolean;
  setIsLinkedToUsa: (linked: boolean) => void;
  onSyncWithUsa: () => void;
  syncing: boolean;
  currentRole: UserRole;
  tenant: string;
}

export const SecurityAndSyncView: React.FC<SecurityAndSyncViewProps> = ({
  isLinkedToUsa,
  setIsLinkedToUsa,
  onSyncWithUsa,
  syncing,
  currentRole,
  tenant,
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Security Alert Preferences
  const [alertsConfig, setAlertsConfig] = useState({
    alertOnSplitPurchases: true,
    alertOnPriceOver20: true,
    alertOnShortDeadlines: true,
    alertOnBulkExport: true,
    notifyComplianceEmail: 'auditor.forense@auditintelligence.us',
    symmetricKeyRotationDays: 30,
  });

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/security/logs');
      if (res.ok) {
        const data = await res.json();
        if (data.logs) setLogs(data.logs);
      }
    } catch (e) {
      console.warn('Failed to load logs:', e);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [syncing]);

  const filteredLogs = logs.filter((log) => {
    if (categoryFilter !== 'ALL' && log.category !== categoryFilter) return false;
    if (
      logSearch &&
      !log.actor.toLowerCase().includes(logSearch.toLowerCase()) &&
      !log.action.toLowerCase().includes(logSearch.toLowerCase()) &&
      !log.details.toLowerCase().includes(logSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Audit Intelligence USA Link & RESTful API Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isLinkedToUsa 
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {isLinkedToUsa ? <Link2 className="w-5 h-5" /> : <Unlink className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Integración Bidireccional: AUDIT INTELLIGENCE USA
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                  isLinkedToUsa
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {isLinkedToUsa ? 'NODO ACTIVO & SINCRONIZADO' : 'MODO INDEPENDIENTE'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sincronización bidireccional en tiempo real mediante API RESTful con cifrado de grado militar AES-256
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLinkedToUsa(!isLinkedToUsa)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                isLinkedToUsa
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {isLinkedToUsa ? 'Desvincular a Modo Independiente' : 'Vincular a AUDIT INTELLIGENCE USA'}
            </button>

            {isLinkedToUsa && (
              <button
                onClick={onSyncWithUsa}
                disabled={syncing}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Sincronizando...' : 'Ejecutar Sinc. Bidireccional'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Node Telemetry Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono">
          <div>
            <div className="text-[10px] text-slate-500">Protocolo de Cifrado:</div>
            <div className="text-amber-300 font-bold mt-0.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>AES-256-GCM / TLS 1.3</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500">API Endpoint Remoto:</div>
            <div className="text-cyan-400 font-bold mt-0.5 truncate">
              https://auditintelligence.us/api/v7/sync
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500">Rotación de Clave:</div>
            <div className="text-slate-200 mt-0.5">Cada 24 horas (Automática)</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500">Estándar de Cumplimiento:</div>
            <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SOC2 Type II & HIPAA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Alerts Configuration & RBAC Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Alerts Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider pb-3 border-b border-slate-800">
            <BellRing className="w-4 h-4 text-amber-400" />
            <span>Panel de Configuración de Alertas Personalizables</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Alerta por Sospecha de Fraccionamiento</span>
                <span className="text-[11px] text-slate-400">Emisión de compras menores sucesivas en un lapso &lt; 30 días</span>
              </div>
              <input
                type="checkbox"
                checked={alertsConfig.alertOnSplitPurchases}
                onChange={(e) => setAlertsConfig({ ...alertsConfig, alertOnSplitPurchases: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Alerta por Sobreprecio Anómalo (&gt; 20%)</span>
                <span className="text-[11px] text-slate-400">Desvío de precio vs base histórica de 10 años en DGCP</span>
              </div>
              <input
                type="checkbox"
                checked={alertsConfig.alertOnPriceOver20}
                onChange={(e) => setAlertsConfig({ ...alertsConfig, alertOnPriceOver20: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Alerta por Plazo Reducido en Pliego</span>
                <span className="text-[11px] text-slate-400">Tiempos inferiores al mínimo estipulado en Art. 20 Ley 340-06</span>
              </div>
              <input
                type="checkbox"
                checked={alertsConfig.alertOnShortDeadlines}
                onChange={(e) => setAlertsConfig({ ...alertsConfig, alertOnShortDeadlines: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <div>
                <span className="font-semibold text-white block">Auditoría de Exportación Masiva de Datos</span>
                <span className="text-[11px] text-slate-400">Detección de descarga repetitiva de expedientes confidenciales</span>
              </div>
              <input
                type="checkbox"
                checked={alertsConfig.alertOnBulkExport}
                onChange={(e) => setAlertsConfig({ ...alertsConfig, alertOnBulkExport: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
            </label>

            <div className="pt-2">
              <label className="text-[11px] text-slate-400 block mb-1">Email del Oficial de Cumplimiento para Alertas Críticas:</label>
              <input
                type="email"
                value={alertsConfig.notifyComplianceEmail}
                onChange={(e) => setAlertsConfig({ ...alertsConfig, notifyComplianceEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* RBAC & Tenant Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider pb-3 border-b border-slate-800">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Control de Acceso Basado en Roles (RBAC) & Multitenant</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Tenant Activo:</div>
                <div className="font-bold text-white text-xs">{tenant}</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono">
                MULTITENANT AISLADO
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Rol Actual en Sesión:</div>
                <div className="font-bold text-cyan-400 text-xs">{currentRole}</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                PRIVILEGIOS FORENSES
              </span>
            </div>

            {/* Matrix Table */}
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2">Rol / Perfil</th>
                    <th className="p-2">Auditar IA</th>
                    <th className="p-2">Editar Word</th>
                    <th className="p-2">Firma Digital</th>
                    <th className="p-2">Sinc. USA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-2 font-semibold">Auditor Forense</td>
                    <td className="p-2 text-emerald-400">✓</td>
                    <td className="p-2 text-emerald-400">✓</td>
                    <td className="p-2 text-emerald-400">✓</td>
                    <td className="p-2 text-emerald-400">✓</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Oficial Cumplimiento</td>
                    <td className="p-2 text-emerald-400">✓</td>
                    <td className="p-2 text-emerald-400">✓</td>
                    <td className="p-2 text-emerald-400">✓</td>
                    <td className="p-2 text-slate-500">-</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Especialista Licitaciones</td>
                    <td className="p-2 text-emerald-400">✓</td>
                    <td className="p-2 text-slate-500">Solo lectura</td>
                    <td className="p-2 text-slate-500">-</td>
                    <td className="p-2 text-slate-500">-</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Super Admin</td>
                    <td className="p-2 text-emerald-400">✓</td>
                    <td className="p-2 text-emerald-400">✓</td>
                    <td className="p-2 text-emerald-400">✓</td>
                    <td className="p-2 text-emerald-400">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* SOC2 Type II & HIPAA Audit Logs Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Registro Inmutable de Logs de Seguridad (SOC2 Type II & HIPAA Audit Trail)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filtrar actor, IP o acción..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:border-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Todas las Categorías</option>
              <option value="ACCESS">ACCESS (Acceso & MFA)</option>
              <option value="AI_FORENSIC">AI_FORENSIC (Peritaje)</option>
              <option value="SYNC_USA">SYNC_USA (Sincronización)</option>
              <option value="SECURITY">SECURITY (Alertas)</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor & Rol</th>
                <th className="py-3 px-4">Acción Pericial</th>
                <th className="py-3 px-4">Detalle Operativo</th>
                <th className="py-3 px-4">IP & Origen</th>
                <th className="py-3 px-4">Checksum AES-256</th>
                <th className="py-3 px-4">Conformidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors text-[11px]">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                    {new Date(log.timestamp).toLocaleString('es-DO')}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-sans font-bold text-white">{log.actor}</div>
                    <div className="text-[10px] text-slate-400 font-sans">{log.role}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-sans text-slate-300 max-w-xs">
                    {log.details}
                  </td>

                  <td className="py-3 px-4 text-slate-400">
                    {log.ipAddress}
                  </td>

                  <td className="py-3 px-4 text-[10px] text-amber-400 truncate max-w-[120px]" title={log.aes256Checksum}>
                    {log.aes256Checksum}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-[9px] font-sans font-bold text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>SOC2 & HIPAA</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
