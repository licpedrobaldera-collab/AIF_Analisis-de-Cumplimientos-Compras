import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  Link2, 
  Unlink, 
  Lock, 
  Users, 
  KeyRound, 
  Building2, 
  Coins, 
  Languages, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Server,
  Bell,
  AlertOctagon
} from 'lucide-react';
import { CountryCode, CurrencyCode, LanguageCode, UserRole } from '../types';
import { COUNTRY_LEGAL_CONFIGS } from '../data/forensicPresets';

interface HeaderNavProps {
  country: CountryCode;
  setCountry: (country: CountryCode) => void;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  tenant: string;
  setTenant: (tenant: string) => void;
  isLinkedToUsa: boolean;
  setIsLinkedToUsa: (linked: boolean) => void;
  onSyncUsa: () => void;
  syncing: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNotifications: () => void;
  unreadAlertsCount: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  country,
  setCountry,
  currency,
  setCurrency,
  language,
  setLanguage,
  role,
  setRole,
  tenant,
  setTenant,
  isLinkedToUsa,
  setIsLinkedToUsa,
  onSyncUsa,
  syncing,
  activeTab,
  setActiveTab,
  onOpenNotifications,
  unreadAlertsCount,
}) => {
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaCode, setMfaCode] = useState('749 203');
  const [mfaVerified, setMfaVerified] = useState(true);

  const countryConfig = COUNTRY_LEGAL_CONFIGS[country];

  const tenantsList = [
    { id: 'Tenant 01 - Rep. Dominicana', label: 'Rep. Dominicana - Órganos de Control & DGCP' },
    { id: 'Tenant 02 - Audit Intelligence USA', label: 'Audit Intelligence USA (Federal Node)' },
    { id: 'Tenant 03 - Forensic Multi-Corp', label: 'Forensic Audit Multi-Corp Enterprise' },
    { id: 'Tenant 04 - NGO & International', label: 'ONGs & Cooperación Internacional' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      {/* Top Compliance & Sync Bar */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>BASA V7 ENGINE ONLINE</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-slate-300">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Cifrado: <strong className="text-amber-300 font-mono">AES-256-GCM</strong></span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">SOC2 TYPE II</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">HIPAA COMPLIANT</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">ISO 27001</span>
          </div>
        </div>

        {/* Audit Intelligence USA Link Switch */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-md">
            {isLinkedToUsa ? (
              <Link2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Unlink className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="text-slate-300 text-[11px] font-medium">
              AUDIT INTELLIGENCE USA:
            </span>
            <button
              onClick={() => setIsLinkedToUsa(!isLinkedToUsa)}
              className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                isLinkedToUsa 
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isLinkedToUsa ? 'VINCULADO (Sinc. Bidireccional)' : 'INDEPENDIENTE'}
            </button>
            {isLinkedToUsa && (
              <button
                onClick={onSyncUsa}
                disabled={syncing}
                title="Sincronizar datos en tiempo real con nodo USA"
                className="p-1 hover:text-cyan-300 text-slate-400 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            )}
          </div>

          {/* MFA Badge */}
          <button
            onClick={() => setShowMfaModal(true)}
            className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded-md text-[11px]"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>MFA: <strong className="text-emerald-400">ACTIVO</strong></span>
          </button>

          {/* Real-Time Collusion Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors"
            title="Ver Centro de Alertas de Colusión en Tiempo Real"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <Bell className="w-3.5 h-3.5 text-rose-400" />
            <span>COLUSIÓN EN VIVO</span>
            {unreadAlertsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/30">
            <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>BASA V7</span>
                <span className="text-xs font-normal text-amber-400 px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                  FORENSE
                </span>
              </h1>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-300 font-medium">AUDIT INTELLIGENCE USA</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Inteligencia y Auditoría Forense de Compras Gubernamentales & DGCP
            </p>
          </div>
        </div>

        {/* Global Selectors: Tenant, Country, Currency, Language, Role */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tenant Selector */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-md px-2 py-1 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              {tenantsList.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Country Selector */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-md px-2 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={country}
              onChange={(e) => {
                const newCountry = e.target.value as CountryCode;
                setCountry(newCountry);
                if (newCountry === 'DOM') setCurrency('DOP');
                else if (newCountry === 'USA') setCurrency('USD');
                else if (newCountry === 'COL') setCurrency('COP');
                else if (newCountry === 'MEX') setCurrency('MXN');
                else if (newCountry === 'ESP') setCurrency('EUR');
              }}
              className="bg-transparent text-amber-300 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="DOM" className="bg-slate-900 text-white">🇩🇴 Rep. Dominicana (DGCP)</option>
              <option value="USA" className="bg-slate-900 text-white">🇺🇸 USA (SAM.gov / FAR)</option>
              <option value="COL" className="bg-slate-900 text-white">🇨🇴 Colombia (SECOP II)</option>
              <option value="MEX" className="bg-slate-900 text-white">🇲🇽 México (CompraNet)</option>
              <option value="CHL" className="bg-slate-900 text-white">🇨🇱 Chile (Mercado Público)</option>
              <option value="PAN" className="bg-slate-900 text-white">🇵🇦 Panamá (PanamaCompra)</option>
              <option value="ESP" className="bg-slate-900 text-white">🇪🇸 España / UE (LCSP)</option>
            </select>
          </div>

          {/* Currency */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-md px-2 py-1 text-xs">
            <Coins className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer font-mono font-medium"
            >
              <option value="DOP" className="bg-slate-900 text-white">DOP (RD$)</option>
              <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
              <option value="EUR" className="bg-slate-900 text-white">EUR (€)</option>
              <option value="COP" className="bg-slate-900 text-white">COP ($)</option>
              <option value="MXN" className="bg-slate-900 text-white">MXN ($)</option>
            </select>
          </div>

          {/* Language */}
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-md px-2 py-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value="es" className="bg-slate-900 text-white">Español</option>
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="fr" className="bg-slate-900 text-white">Français</option>
            </select>
          </div>

          {/* RBAC Role Selector */}
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 rounded-md px-2 py-1 text-xs text-amber-300">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent text-amber-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Auditor Forense Principal" className="bg-slate-900 text-white">Auditor Forense Principal</option>
              <option value="Oficial de Cumplimiento" className="bg-slate-900 text-white">Oficial de Cumplimiento</option>
              <option value="Especialista en Licitaciones" className="bg-slate-900 text-white">Especialista en Licitaciones</option>
              <option value="Super Admin Multitenant" className="bg-slate-900 text-white">Super Admin Multitenant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-4 flex overflow-x-auto gap-1 border-t border-slate-800/80 bg-slate-950/60 scrollbar-none">
        {[
          { id: 'dashboard', label: 'Dashboard & Procesos (10 Años)', icon: '📊' },
          { id: 'historicalAudits', label: 'Carpeta: Hallazgos Históricos', icon: '📁' },
          { id: 'analyzer', label: 'Peritaje Forense con IA', icon: '🔍' },
          { id: 'editor', label: 'Informe Word & PDF Autenticado', icon: '📝' },
          { id: 'prefill', label: 'Prellenado & Pólizas de Licitación', icon: '📑' },
          { id: 'prices', label: 'Precios Históricos & Mercado', icon: '📈' },
          { id: 'security', label: 'Seguridad, Sinc. USA & Logs SOC2', icon: '🛡️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* MFA Dialog Modal */}
      {showMfaModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
                <span>Autenticación Multifactor (MFA / 2FA)</span>
              </div>
              <button
                onClick={() => setShowMfaModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-300">
              <p>
                Para cumplir con los protocolos de seguridad <strong>HIPAA Security Rule</strong> y <strong>SOC2 Type II</strong>, todas las acciones periciales están protegidas por doble factor criptográfico.
              </p>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Código TOTP Temporal (30s)</div>
                <div className="text-2xl font-bold text-amber-400 tracking-wider">{mfaCode}</div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Sincronizado con hardware token AES-256</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-slate-400">Usuario Asignado:</div>
                <div className="font-semibold text-white">licpedrobaldera@gmail.com</div>
                <div className="text-slate-400">Rol: <span className="text-amber-300">{role}</span></div>
                <div className="text-slate-400">Tenant: <span className="text-slate-200">{tenant}</span></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setShowMfaModal(false)}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
              >
                Cerrar y Continuar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
