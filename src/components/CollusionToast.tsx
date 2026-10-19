import React from 'react';
import { AlertOctagon, X, Cpu, ArrowRight, Scale, ShieldAlert } from 'lucide-react';
import { RealtimeCollusionAlert } from '../types';

interface CollusionToastProps {
  alert: RealtimeCollusionAlert;
  onDismiss: () => void;
  onAudit: () => void;
  onViewDetails: () => void;
}

export const CollusionToast: React.FC<CollusionToastProps> = ({
  alert,
  onDismiss,
  onAudit,
  onViewDetails,
}) => {
  return (
    <div className="bg-slate-900 border-2 border-rose-500 text-slate-100 rounded-xl p-4 shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-5 duration-300 relative space-y-3 z-50">
      {/* Top Banner */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-rose-500 text-slate-950 animate-pulse">
            <AlertOctagon className="w-4 h-4" />
          </span>
          <div>
            <div className="text-rose-400 font-bold font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <span>🚨 ALERTA DE COLUSIÓN EN TIEMPO REAL</span>
              <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px]">
                {alert.country}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Detectado en: {alert.rectorEntity}
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
          title="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Alert Info */}
      <div className="space-y-1">
        <div className="text-amber-300 font-mono font-bold text-xs">
          {alert.tenderCode} - {alert.collusionType}
        </div>
        <p className="text-slate-200 text-xs font-medium line-clamp-2">
          {alert.evidenceDetail}
        </p>
        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 pt-0.5">
          <Scale className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="text-amber-400">{alert.lawArticle}</span> ({alert.infringedLaw})
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={onViewDetails}
          className="text-xs text-slate-400 hover:text-white font-medium"
        >
          Ver Detalle Completo
        </button>

        <button
          onClick={onAudit}
          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Auditar con IA Ahora</span>
        </button>
      </div>
    </div>
  );
};
