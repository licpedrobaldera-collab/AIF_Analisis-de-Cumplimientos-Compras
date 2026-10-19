import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  Download, 
  Scale, 
  ArrowUpRight, 
  ArrowDownRight,
  Sliders,
  DollarSign
} from 'lucide-react';
import { CurrencyCode, HistoricalPriceItem } from '../types';
import { HISTORICAL_PRICES_10_YEARS } from '../data/historicalPrices';

interface HistoricalPriceViewProps {
  currency: CurrencyCode;
}

export const HistoricalPriceView: React.FC<HistoricalPriceViewProps> = ({ currency }) => {
  const [items, setItems] = useState<HistoricalPriceItem[]>(HISTORICAL_PRICES_10_YEARS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'ALL' && !item.category.includes(selectedCategory)) return false;
    if (
      searchTerm &&
      !item.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: currency === 'DOP' ? 'DOP' : currency === 'USD' ? 'USD' : currency === 'EUR' ? 'EUR' : currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Inteligencia de Negocios y Análisis de Precios Históricos (2016 - 2026)
              </h2>
              <p className="text-xs text-slate-400">
                Detección de sobreprecios, ofertas temerarias y desvíos presupuestarios en ventana de 10 años
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Base Histórica: <strong>10 Años Simultáneos</strong></span>
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar insumo, obra o código de catálogo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-2 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-2 focus:border-amber-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Todas las Categorías</option>
              <option value="Salud">Salud / Médico & Laboratorio</option>
              <option value="Infraestructura">Infraestructura / Obras Civiles</option>
              <option value="Tecnología">Tecnología / Educación</option>
              <option value="Alimentos">Alimentos / Raciones</option>
              <option value="Seguridad">Seguridad / Vigilancia</option>
            </select>
          </div>

          <div className="flex items-center justify-end">
            <span className="text-xs text-slate-400 font-mono">
              Registros analizados: <strong className="text-amber-400">{filteredItems.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.itemCode}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono font-bold">
                  {item.itemCode}
                </span>
                <span className="text-[11px] text-slate-400 ml-2 font-mono">
                  {item.category} • Unidad: {item.unit}
                </span>
                <h3 className="text-xs font-bold text-white mt-1 leading-snug">
                  {item.description}
                </h3>
              </div>

              {/* Status Badge */}
              <span
                className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  item.priceTrend === 'Sobreprecio Anómalo'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    : item.priceTrend === 'Baja Temeraria'
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                    : item.priceTrend === 'Inflacionario'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {item.deviationPercent > 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                <span>{item.priceTrend} ({item.deviationPercent > 0 ? `+${item.deviationPercent}%` : `${item.deviationPercent}%`})</span>
              </span>
            </div>

            {/* Price Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono">
              <div>
                <div className="text-[10px] text-slate-500">Mínimo (10A):</div>
                <div className="text-slate-300 font-bold mt-0.5">{formatPrice(item.minPriceHistorical)}</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500">Promedio (10A):</div>
                <div className="text-cyan-400 font-bold mt-0.5">{formatPrice(item.avgPriceHistorical)}</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500">Máximo (10A):</div>
                <div className="text-slate-300 font-bold mt-0.5">{formatPrice(item.maxPriceHistorical)}</div>
              </div>

              <div>
                <div className="text-[10px] text-amber-400 font-bold">Precio Pliego:</div>
                <div className={`font-bold mt-0.5 ${
                  item.deviationPercent > 15 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {formatPrice(item.currentTenderPrice)}
                </div>
              </div>
            </div>

            {/* Visual Dispersion Range Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Banda Histórica Segura</span>
                <span>Ventana: {item.historicalPeriod}</span>
              </div>
              <div className="relative w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="absolute inset-y-0 left-[20%] right-[30%] bg-slate-700/60 rounded-full" />
                <div 
                  className={`absolute top-0 bottom-0 w-2.5 rounded-full ${
                    item.deviationPercent > 15 ? 'bg-rose-500' : item.deviationPercent < -15 ? 'bg-yellow-400' : 'bg-emerald-400'
                  }`}
                  style={{ 
                    left: `${Math.min(95, Math.max(5, 50 + item.deviationPercent))}%` 
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
