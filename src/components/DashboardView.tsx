import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  AlertOctagon, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  FileText, 
  ShieldAlert, 
  ExternalLink, 
  Download, 
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { TenderItem, CountryCode, CurrencyCode } from '../types';
import { exportTendersToExcel } from '../utils/exportExcel';

interface DashboardViewProps {
  tenders: TenderItem[];
  country: CountryCode;
  currency: CurrencyCode;
  onSelectTenderForAudit: (tender: TenderItem) => void;
  onGoToEditorWithTender: (tender: TenderItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tenders,
  country,
  currency,
  onSelectTenderForAudit,
  onGoToEditorWithTender,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedEntityType, setSelectedEntityType] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [yearRange, setYearRange] = useState<[number, number]>([2016, 2026]);
  const [selectedTenderDetail, setSelectedTenderDetail] = useState<TenderItem | null>(null);

  // Filtered tenders
  const filteredTenders = useMemo(() => {
    return tenders.filter((t) => {
      // Country filter
      if (country && t.country !== country) {
        // Can optionally filter or view across jurisdictions
      }
      // Year range filter (10 years simultaneously)
      if (t.year < yearRange[0] || t.year > yearRange[1]) return false;
      // Search
      if (
        searchTerm &&
        !t.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !t.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !t.entity.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      // Sector
      if (selectedSector !== 'ALL' && !t.sector.includes(selectedSector)) return false;
      // Entity Type
      if (selectedEntityType !== 'ALL' && !t.entityType.includes(selectedEntityType)) return false;
      // Risk
      if (selectedRisk !== 'ALL' && t.riskLevel !== selectedRisk) return false;

      return true;
    });
  }, [tenders, country, yearRange, searchTerm, selectedSector, selectedEntityType, selectedRisk]);

  // Aggregate stats
  const totalMonitored = filteredTenders.length;
  const criticalCount = filteredTenders.filter((t) => t.riskLevel === 'Crítico').length;
  const highCount = filteredTenders.filter((t) => t.riskLevel === 'Alto').length;
  const totalBudget = filteredTenders.reduce((acc, t) => acc + t.budget, 0);
  const avgCompliance = totalMonitored > 0
    ? Math.round(filteredTenders.reduce((acc, t) => acc + t.complianceScore, 0) / totalMonitored)
    : 0;

  const formatCurrency = (val: number, cur: CurrencyCode) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: cur === 'DOP' ? 'DOP' : cur === 'USD' ? 'USD' : cur === 'EUR' ? 'EUR' : cur,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Early Warning Broadcast Ticker */}
      <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-3 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-semibold shrink-0">
          <ShieldAlert className="w-4 h-4 animate-pulse" />
          <span>ALERTAS TEMPRANAS EN TIEMPO REAL (DGCP & ENTIDADES):</span>
        </div>
        <div className="text-slate-300 truncate font-mono text-[11px] flex-1">
          <span className="text-rose-400 font-bold">[CRÍTICO]</span> SNS-CCC-LPN-2026-0089: Plazo para aclaraciones reducido artificialmente a 48h. • <span className="text-amber-400 font-bold">[ALTO]</span> MOPC-CCC-CP-2025-0412: Sobreprecio detectado (+38.7% vs media histórica 2016-2026). • <span className="text-cyan-400 font-bold">[SINCRONIZADO]</span> Audit Intelligence USA Node verificado.
        </div>
        <div className="shrink-0 text-slate-500 font-mono text-[10px]">
          Filtro Activo: 2016 - 2026 (10 Años)
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="text-slate-400 text-xs font-medium">Licitaciones Monitoreadas</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{totalMonitored}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>Ventana {yearRange[0]}-{yearRange[1]}</span>
          </div>
          <div className="absolute top-3 right-3 text-slate-700">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="text-rose-400 text-xs font-medium flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Riesgo Crítico / Alto</span>
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-1 font-mono">{criticalCount + highCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {criticalCount} Críticos / {highCount} Altos
          </div>
          <div className="absolute top-3 right-3 text-rose-950">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="text-slate-400 text-xs font-medium">Volumen Total Auditado</div>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono truncate">
            {formatCurrency(totalBudget, currency)}
          </div>
          <div className="text-[11px] text-emerald-500/80 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Contratación auditada</span>
          </div>
          <div className="absolute top-3 right-3 text-slate-700">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="text-slate-400 text-xs font-medium">Índice de Cumplimiento DGCP</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">{avgCompliance}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Ley 340-06 & Dec. 543-12
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                avgCompliance > 75 ? 'bg-emerald-500' : avgCompliance > 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${avgCompliance}%` }}
            />
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="text-slate-400 text-xs font-medium">Garantías / Pólizas Requeridas</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1 font-mono">100%</div>
          <div className="text-[11px] text-cyan-500/80 mt-1">
            Seriedad (1%) & Fiel Cumplimiento
          </div>
          <div className="absolute top-3 right-3 text-slate-700">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Control de Filtros y Ventana de Auditoría
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportTendersToExcel(filteredTenders)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exportar Matriz Excel</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar código, entidad u objeto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-2 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Sector */}
          <div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-2 focus:border-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Todos los Sectores</option>
              <option value="Salud">Salud / Hospitalario</option>
              <option value="Infraestructura">Infraestructura / Obras</option>
              <option value="Tecnología">Tecnología / Telecomunicaciones</option>
              <option value="Alimentos">Alimentos / Raciones</option>
              <option value="Seguridad">Seguridad / Vigilancia</option>
            </select>
          </div>

          {/* Entity Type */}
          <div>
            <select
              value={selectedEntityType}
              onChange={(e) => setSelectedEntityType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-2 focus:border-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Todas las Entidades</option>
              <option value="Pública">Entidad Pública / DGCP</option>
              <option value="ONG">ONG / Fundaciones</option>
              <option value="Privada">Sector Privado / Corp</option>
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-2 focus:border-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Todos los Niveles de Riesgo</option>
              <option value="Crítico">Crítico (Banderas Rojas)</option>
              <option value="Alto">Alto</option>
              <option value="Medio">Medio</option>
              <option value="Bajo">Bajo (Conforme)</option>
            </select>
          </div>

          {/* 10-Year Period Selector */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 flex flex-col justify-center">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Ventana 10 Años:</span>
              <span className="text-amber-400 font-bold">{yearRange[0]} - {yearRange[1]}</span>
            </div>
            <input
              type="range"
              min={2016}
              max={2026}
              value={yearRange[0]}
              onChange={(e) => setYearRange([parseInt(e.target.value), 2026])}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg mt-1"
            />
          </div>
        </div>
      </div>

      {/* Tenders Grid Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Expedientes y Licitaciones Auditables ({filteredTenders.length})</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Sincronización en tiempo real habilitada con portal DGCP y base internacional
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Proceso / Código</th>
                <th className="py-3 px-4">Entidad & Jurisdicción</th>
                <th className="py-3 px-4">Año / Fecha</th>
                <th className="py-3 px-4">Monto Estimado</th>
                <th className="py-3 px-4">Diagnóstico Forense</th>
                <th className="py-3 px-4">Cumplimiento</th>
                <th className="py-3 px-4 text-right">Acciones Periciales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredTenders.map((tender) => (
                <tr key={tender.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Code & Title */}
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-amber-400 flex items-center gap-1.5">
                      <span>{tender.code}</span>
                      <a
                        href={tender.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-slate-300"
                        title="Ver en portal oficial"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-slate-200 font-medium line-clamp-1 max-w-sm mt-0.5" title={tender.title}>
                      {tender.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Sector: {tender.sector}
                    </div>
                  </td>

                  {/* Entity & Country */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{tender.entity}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>{tender.country === 'DOM' ? '🇩🇴' : tender.country === 'USA' ? '🇺🇸' : '🇨🇴'}</span>
                      <span>{tender.countryName}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] px-1 rounded bg-slate-800 text-slate-300">{tender.entityType}</span>
                    </div>
                  </td>

                  {/* Year & Date */}
                  <td className="py-3 px-4 font-mono">
                    <div className="text-slate-200 font-bold">{tender.year}</div>
                    <div className="text-[11px] text-slate-500">{tender.datePublished}</div>
                  </td>

                  {/* Budget */}
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-white">
                      {formatCurrency(tender.budget, tender.currency)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Garantía 1%: {tender.bidBondReq}
                    </div>
                  </td>

                  {/* Risk Badge */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          tender.riskLevel === 'Crítico'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : tender.riskLevel === 'Alto'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : tender.riskLevel === 'Medio'
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {tender.riskLevel === 'Crítico' && <AlertOctagon className="w-3 h-3" />}
                        {tender.riskLevel}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {tender.redFlagsCount > 0 ? (
                        <span className="text-rose-400 font-semibold">{tender.redFlagsCount} banderas rojas</span>
                      ) : (
                        <span className="text-emerald-400">Sin banderas rojas</span>
                      )}
                    </div>
                  </td>

                  {/* Compliance Score */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-200">{tender.complianceScore}/100</span>
                    </div>
                    <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full ${
                          tender.complianceScore >= 75
                            ? 'bg-emerald-500'
                            : tender.complianceScore >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${tender.complianceScore}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{tender.lawApplicable}</div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectTenderForAudit(tender)}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-xs flex items-center gap-1 transition-colors"
                        title="Ejecutar Peritaje Forense con IA sobre este pliego"
                      >
                        <Cpu className="w-3 h-3" />
                        <span>Auditar con IA</span>
                      </button>
                      <button
                        onClick={() => onGoToEditorWithTender(tender)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                        title="Generar informe en Word editable"
                      >
                        <FileText className="w-3 h-3" />
                      </button>
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
