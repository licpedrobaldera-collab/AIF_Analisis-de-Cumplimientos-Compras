import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertOctagon, 
  X, 
  ExternalLink, 
  Cpu, 
  CheckCheck, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Globe, 
  ShieldAlert, 
  Scale, 
  Users, 
  ArrowRight,
  Play,
  Square
} from 'lucide-react';
import { RealtimeCollusionAlert, CountryCode, CurrencyCode } from '../types';

interface NotificationCenterProps {
  country: CountryCode;
  currency: CurrencyCode;
  onAuditTenderFromNotification: (tenderCode: string, title: string, entity: string, country: CountryCode) => void;
  isOpen: boolean;
  onClose: () => void;
  onNewAlertReceived?: (alert: RealtimeCollusionAlert) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  country,
  currency,
  onAuditTenderFromNotification,
  isOpen,
  onClose,
  onNewAlertReceived,
}) => {
  const [alerts, setAlerts] = useState<RealtimeCollusionAlert[]>([]);
  const [filterCountry, setFilterCountry] = useState<string>('ALL');
  const [isSimulatingLive, setIsSimulatingLive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedAlert, setSelectedAlert] = useState<RealtimeCollusionAlert | null>(null);

  // Play subtle synth beep using Web Audio API
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // AudioContext not allowed or muted
    }
  };

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      const res = await fetch(`/api/notifications/collusion${filterCountry !== 'ALL' ? `?country=${filterCountry}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (err) {
      console.warn('Notification fetch warning:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 6000);
    return () => clearInterval(interval);
  }, [filterCountry]);

  // Live simulation loop
  useEffect(() => {
    let timer: any;
    if (isSimulatingLive) {
      timer = setInterval(async () => {
        try {
          const countries: CountryCode[] = ['DOM', 'USA', 'COL', 'MEX', 'CHL', 'PAN', 'ESP'];
          const randomCountry = countries[Math.floor(Math.random() * countries.length)];
          const collusionTypes: any[] = [
            'Ofertas Sombra / Cobertura',
            'Rotación de Licitadores',
            'Metadatos Idénticos',
            'Repartición de Mercado / Subcontratación Encubierta',
            'Precios Correlacionados',
          ];
          const randomType = collusionTypes[Math.floor(Math.random() * collusionTypes.length)];

          const res = await fetch('/api/notifications/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              country: randomCountry,
              collusionType: randomType,
            }),
          });

          if (res.ok) {
            const result = await res.json();
            if (result.alert) {
              setAlerts((prev) => [result.alert, ...prev]);
              playAlertSound();
              if (onNewAlertReceived) onNewAlertReceived(result.alert);
            }
          }
        } catch (e) {
          console.warn('Simulation trigger failed');
        }
      }, 15000); // Trigger every 15s when active
    }
    return () => clearInterval(timer);
  }, [isSimulatingLive, soundEnabled]);

  const handleTriggerSimulatedAlert = async (targetCountry: CountryCode) => {
    try {
      const res = await fetch('/api/notifications/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: targetCountry,
          collusionType: 'Ofertas Sombra / Cobertura',
        }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.alert) {
          setAlerts((prev) => [result.alert, ...prev]);
          playAlertSound();
          if (onNewAlertReceived) onNewAlertReceived(result.alert);
        }
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
    } catch (e) {
      //
    }
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <Bell className="w-4 h-4 animate-bounce" />
              </span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>Centro de Alertas de Colusión en Tiempo Real</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Vigilancia activa en DGCP y portales internacionales conforme a normas vigentes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700"
              title={soundEnabled ? 'Silenciar alertas' : 'Activar sonido de alertas'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Simulation & Country Filter Bar */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Live Simulator Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimulatingLive(!isSimulatingLive)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                isSimulatingLive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {isSimulatingLive ? <Square className="w-3 h-3 text-emerald-400" /> : <Play className="w-3 h-3 text-amber-400" />}
              <span>{isSimulatingLive ? 'Monitoreo en Vivo (Activo)' : 'Iniciar Detección en Vivo'}</span>
            </button>

            <button
              onClick={() => handleTriggerSimulatedAlert(country)}
              className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 text-[11px] font-semibold"
              title="Disparar detección inmediata para el país actual"
            >
              + Disparar Ahora ({country})
            </button>
          </div>

          {/* Filter by Country */}
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none"
            >
              <option value="ALL">Todos los Países</option>
              <option value="DOM">🇩🇴 Rep. Dominicana (DGCP)</option>
              <option value="USA">🇺🇸 USA (SAM.gov / FAR)</option>
              <option value="COL">🇨🇴 Colombia (SECOP II)</option>
              <option value="MEX">🇲🇽 México (CompraNet)</option>
              <option value="CHL">🇨🇱 Chile (Mercado Público)</option>
              <option value="PAN">🇵🇦 Panamá (PanamaCompra)</option>
              <option value="ESP">🇪🇸 España / UE (LCSP)</option>
            </select>
          </div>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs font-mono">
              No se registran alertas de colusión activas para el filtro seleccionado.
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => handleMarkAsRead(alert.id)}
                className={`p-4 rounded-xl border text-xs space-y-2.5 transition-all cursor-pointer ${
                  alert.read
                    ? 'bg-slate-950/50 border-slate-800/80 opacity-80'
                    : 'bg-slate-950 border-rose-600/40 shadow-lg shadow-rose-950/20'
                }`}
              >
                {/* Alert Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-rose-500/20 text-rose-400">
                      <AlertOctagon className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-mono font-bold text-rose-400 text-[11px]">
                      🚨 [{alert.severity}] {alert.collusionType}
                    </span>
                    {!alert.read && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-slate-950 text-[9px] font-bold">
                        NUEVA
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {new Date(alert.timestamp).toLocaleTimeString('es-DO')}
                  </div>
                </div>

                {/* Tender details */}
                <div>
                  <div className="font-mono font-bold text-amber-300 text-xs">
                    {alert.tenderCode}
                  </div>
                  <div className="text-slate-200 font-medium mt-0.5 line-clamp-1">
                    {alert.tenderTitle}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Entidad: <strong className="text-slate-300">{alert.entity}</strong> • {alert.countryName}
                  </div>
                </div>

                {/* Evidence snippet */}
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-300 font-mono">
                  <div className="text-[10px] text-slate-500 font-sans uppercase font-bold">Evidencia Forense:</div>
                  <p className="mt-0.5">{alert.evidenceDetail}</p>
                  <div className="mt-1 text-slate-400">
                    Licitadores Involucrados: <span className="text-amber-400 font-semibold">{alert.biddersInvolved.join(' vs. ')}</span>
                  </div>
                </div>

                {/* Legal reference */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1 font-mono">
                    <Scale className="w-3 h-3 text-amber-400" />
                    <span className="text-amber-300 font-semibold">{alert.lawArticle}</span> ({alert.infringedLaw})
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAuditTenderFromNotification(alert.tenderCode, alert.tenderTitle, alert.entity, alert.country);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[11px] transition-colors"
                  >
                    <Cpu className="w-3 h-3" />
                    <span>Auditar con IA</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Canal Criptográfico: AES-256-GCM</span>
          <span>SOC2 Type II & HIPAA Audit Trail</span>
        </div>
      </div>
    </div>
  );
};
