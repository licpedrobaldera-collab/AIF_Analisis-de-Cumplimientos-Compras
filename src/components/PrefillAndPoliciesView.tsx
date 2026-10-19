import React, { useState } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  CheckCircle, 
  QrCode, 
  Building, 
  Calculator, 
  ExternalLink,
  Coins,
  FileSpreadsheet
} from 'lucide-react';
import { BidBondPolicy, CountryCode, CurrencyCode, TenderItem } from '../types';
import { MOCK_POLICIES } from '../data/historicalPrices';
import { COUNTRY_LEGAL_CONFIGS } from '../data/forensicPresets';

interface PrefillAndPoliciesViewProps {
  country: CountryCode;
  currency: CurrencyCode;
  activeTender: TenderItem | null;
}

export const PrefillAndPoliciesView: React.FC<PrefillAndPoliciesViewProps> = ({
  country,
  currency,
  activeTender,
}) => {
  const [subTab, setSubTab] = useState<'prefill' | 'policies'>('prefill');

  // Bidder Profile for Prefill
  const [bidderName, setBidderName] = useState('Biomédica Dominicana SRL');
  const [bidderRnc, setBidderRnc] = useState('1-30-88492-1');
  const [bidderRnp, setBidderRnp] = useState('RNP-64210-ACT');
  const [legalRep, setLegalRep] = useState('Ing. Marcos Peña Castillo (Cédula 001-0849201-4)');
  const [bidderAddress, setBidderAddress] = useState('Av. Abraham Lincoln No. 1022, Piantini, Santo Domingo, D.N.');
  const [bidderEmail, setBidderEmail] = useState('licitaciones@biomedicadom.com');

  // Form selection
  const [selectedForm, setSelectedForm] = useState<'SNCC_F_033' | 'SNCC_F_034' | 'DECLARACION_ART14' | 'CARTA_PRESENTACION'>('SNCC_F_033');
  const [isPrefilling, setIsPrefilling] = useState(false);
  const [prefillGenerated, setPrefillGenerated] = useState(true);

  // Policy Issuance states
  const [policies, setPolicies] = useState<BidBondPolicy[]>(MOCK_POLICIES);
  const [policyType, setPolicyType] = useState<any>('Seriedad de la Oferta (1%)');
  const [offeredAmount, setOfferedAmount] = useState(activeTender?.budget || 184500000);
  const [selectedInsurer, setSelectedInsurer] = useState('Seguros Reservas, S.A.');
  const [isIssuingPolicy, setIsIssuingPolicy] = useState(false);

  const countryConfig = COUNTRY_LEGAL_CONFIGS[country];

  // Calculate policy amount (1% for Seriedad, 4% for Cumplimiento, 20% for Anticipo)
  const calculatePolicyAmount = () => {
    if (policyType.includes('Seriedad')) return offeredAmount * 0.01;
    if (policyType.includes('Fiel Cumplimiento')) return offeredAmount * 0.04;
    return offeredAmount * 0.20;
  };

  const handleIssuePolicy = () => {
    setIsIssuingPolicy(true);
    setTimeout(() => {
      const newPolicy: BidBondPolicy = {
        policyNumber: `POL-${selectedInsurer.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        tenderCode: activeTender?.code || 'DGCP-CCC-LPN-2026-0089',
        beneficiary: activeTender?.entity || 'Servicio Nacional de Salud (SNS) / DGCP',
        insuredEntity: bidderName,
        policyType,
        amount: calculatePolicyAmount(),
        currency,
        insurer: selectedInsurer,
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString().split('T')[0],
        status: 'Emitida & Activa',
        digitalSealHash: Math.random().toString(36).substring(2) + Date.now().toString(36),
        qrVerified: true,
      };
      setPolicies([newPolicy, ...policies]);
      setIsIssuingPolicy(false);
    }, 600);
  };

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: currency === 'DOP' ? 'DOP' : currency === 'USD' ? 'USD' : currency === 'EUR' ? 'EUR' : currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Subtab Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex gap-2">
        <button
          onClick={() => setSubTab('prefill')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
            subTab === 'prefill'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Prellenado Automático de Formularios DGCP (Prefill)</span>
        </button>

        <button
          onClick={() => setSubTab('policies')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
            subTab === 'policies'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Gestión & Emisión de Pólizas de Licitación (Bid Bonds)</span>
        </button>
      </div>

      {subTab === 'prefill' ? (
        /* PREFILL VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bidder Profile Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider pb-3 border-b border-slate-800">
              <Building className="w-4 h-4 text-amber-400" />
              <span>Perfil del Oferente / Empresa Licitante</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Razón Social Oferente:</label>
                <input
                  type="text"
                  value={bidderName}
                  onChange={(e) => setBidderName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">RNC / Tax ID:</label>
                  <input
                    type="text"
                    value={bidderRnc}
                    onChange={(e) => setBidderRnc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Registro RNP DGCP:</label>
                  <input
                    type="text"
                    value={bidderRnp}
                    onChange={(e) => setBidderRnp(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-emerald-400 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Representante Legal & Cédula:</label>
                <input
                  type="text"
                  value={legalRep}
                  onChange={(e) => setLegalRep(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Domicilio Legal:</label>
                <input
                  type="text"
                  value={bidderAddress}
                  onChange={(e) => setBidderAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Correo Electrónico:</label>
                <input
                  type="text"
                  value={bidderEmail}
                  onChange={(e) => setBidderEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-cyan-300 font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsPrefilling(true);
                    setTimeout(() => setIsPrefilling(false), 300);
                  }}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Prellenar Todos los Documentos</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Selector & Live Document Preview */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Formulario Estándar:</span>
                <select
                  value={selectedForm}
                  onChange={(e: any) => setSelectedForm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-amber-300 font-bold text-xs rounded-lg px-3 py-1.5 focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="SNCC_F_033">Formulario SNCC.F.033 - Presentación de Oferta Técnica</option>
                  <option value="SNCC_F_034">Formulario SNCC.F.034 - Presentación de Oferta Económica</option>
                  <option value="DECLARACION_ART14">Declaración Jurada Art. 14 Ley 340-06 (No Inhabilitado)</option>
                  <option value="CARTA_PRESENTACION">Carta Oficial de Presentación de Oferta</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Imprimir / Descargar</span>
                </button>
              </div>
            </div>

            {/* Render Selected Form */}
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-6 font-mono text-xs text-slate-300 leading-relaxed overflow-y-auto max-h-[500px]">
              {selectedForm === 'SNCC_F_033' && (
                <div className="space-y-4">
                  <div className="text-center font-bold text-white border-b border-slate-800 pb-3">
                    <div>DIRECCIÓN GENERAL DE CONTRATACIONES PÚBLICAS (DGCP)</div>
                    <div className="text-amber-400">FORMULARIO DE INFORMACIÓN SOBRE EL OFERENTE / PROPUESTA TÉCNICA</div>
                    <div className="text-[10px] text-slate-500 font-normal">CÓDIGO ESTÁNDAR: SNCC.F.033</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div><strong>PROCESO:</strong> {activeTender?.code || 'DGCP-CCC-LPN-2026-0089'}</div>
                    <div><strong>ENTIDAD CONVOCANTE:</strong> {activeTender?.entity || 'Servicio Nacional de Salud (SNS)'}</div>
                    <div><strong>OFERENTE:</strong> {bidderName}</div>
                    <div><strong>RNC:</strong> {bidderRnc}</div>
                    <div><strong>REGISTRO RNP:</strong> {bidderRnp} (Estado: ACTIVO)</div>
                    <div><strong>REPRESENTANTE LEGAL:</strong> {legalRep}</div>
                    <div className="col-span-2"><strong>DOMICILIO:</strong> {bidderAddress}</div>
                  </div>

                  <div className="border-t border-slate-800 pt-3">
                    <strong className="text-amber-300">MANIFESTACIÓN BAJO FE DE JURAMENTO:</strong>
                    <p className="mt-1 text-slate-400 text-[11px]">
                      Por medio del presente documento, declaramos formalmente cumplir cabalmente con todas las especificaciones técnicas requeridas en el Pliego de Condiciones Específicas del proceso de referencia, comprometiéndonos a entregar los bienes o servicios en estricta sujeción a la Ley No. 340-06 y su Reglamento de Aplicación Dec. No. 543-12.
                    </p>
                  </div>

                  <div className="border-t border-slate-800 pt-3 flex justify-between items-end">
                    <div>
                      <div className="text-[10px] text-slate-500">FECHA DE GENERACIÓN PREFILL:</div>
                      <div className="text-white">{new Date().toLocaleDateString('es-DO')}</div>
                    </div>
                    <div className="text-right">
                      <div className="border-t border-slate-600 pt-1 w-48 text-center text-slate-400 text-[10px]">
                        Firma y Sello Representante Legal
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedForm === 'SNCC_F_034' && (
                <div className="space-y-4">
                  <div className="text-center font-bold text-white border-b border-slate-800 pb-3">
                    <div>DIRECCIÓN GENERAL DE CONTRATACIONES PÚBLICAS (DGCP)</div>
                    <div className="text-amber-400">FORMULARIO DE PRESENTACIÓN DE OFERTA ECONÓMICA</div>
                    <div className="text-[10px] text-slate-500 font-normal">CÓDIGO ESTÁNDAR: SNCC.F.034</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div><strong>PROCESO:</strong> {activeTender?.code || 'DGCP-CCC-LPN-2026-0089'}</div>
                    <div><strong>MONTO TOTAL OFERTADO:</strong> {formatMoney(offeredAmount)}</div>
                    <div><strong>VALOR GARANTÍA SERIEDAD (1%):</strong> {formatMoney(offeredAmount * 0.01)}</div>
                    <div><strong>CONDICIÓN DE PAGO:</strong> Conforme pliego / Crédito 60 días</div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded border border-slate-800 text-[11px]">
                    El precio ofertado incluye todos los impuestos aplicables (ITBIS), transporte, seguros y garantías requeridas por el marco legal de contrataciones públicas.
                  </div>
                </div>
              )}

              {selectedForm === 'DECLARACION_ART14' && (
                <div className="space-y-4">
                  <div className="text-center font-bold text-white border-b border-slate-800 pb-3">
                    <div className="text-amber-400">DECLARACIÓN JURADA DE NO INHABILIDAD (ARTÍCULO 14 LEY 340-06)</div>
                    <div className="text-[10px] text-slate-500 font-normal">REQUISITO OBLIGATORIO DE HABILITACIÓN</div>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    Yo, <strong>{legalRep}</strong>, actuando en calidad de Representante Legal de la sociedad <strong>{bidderName}</strong>, declaro solemnemente bajo juramento que ni mi persona ni ninguno de los socios, directores o administradores de la referida entidad se encuentran incursos en las inhabilidades, incompatibilidades o prohibiciones consagradas taxativamente en el <strong>Artículo 14 de la Ley 340-06</strong> ni en el <strong>Reglamento de Aplicación No. 543-12</strong>.
                  </p>
                </div>
              )}

              {selectedForm === 'CARTA_PRESENTACION' && (
                <div className="space-y-4">
                  <div className="text-center font-bold text-white border-b border-slate-800 pb-3">
                    <div className="text-amber-400">CARTA OFICIAL DE PRESENTACIÓN DE PROPUESTA</div>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    Señores del Comité de Compras y Contrataciones de: <strong>{activeTender?.entity || 'Servicio Nacional de Salud (SNS)'}</strong>.<br />
                    Atención: Dirección de Compras y Contrataciones.<br /><br />
                    Tenemos el agrado de presentar nuestra formal propuesta para el proceso: <strong>{activeTender?.code || 'DGCP-CCC-LPN-2026-0089'}</strong>, correspondiente a <em>"{activeTender?.title || 'Adquisición de Equipos Médicos'}"</em>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* POLICIES VIEW */
        <div className="space-y-6">
          {/* Policy Calculator & Generator Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider pb-3 border-b border-slate-800">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Emisor y Cotizador de Pólizas de Licitación (Fianzas de Garantía)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Tipo de Garantía:</label>
                <select
                  value={policyType}
                  onChange={(e) => setPolicyType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-amber-300 font-bold focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="Seriedad de la Oferta (1%)">Garantía de Seriedad de Oferta (1%)</option>
                  <option value="Fiel Cumplimiento de Contrato (4-10%)">Garantía de Fiel Cumplimiento (4%)</option>
                  <option value="Buen Uso de Anticipo (20%)">Garantía de Buen Uso de Anticipo (20%)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Monto Ofertado Base:</label>
                <input
                  type="number"
                  value={offeredAmount}
                  onChange={(e) => setOfferedAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Compañía Aseguradora:</label>
                <select
                  value={selectedInsurer}
                  onChange={(e) => setSelectedInsurer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="Seguros Reservas, S.A.">Seguros Reservas, S.A.</option>
                  <option value="Humano Seguros">Humano Seguros</option>
                  <option value="Seguros Universal">Seguros Universal</option>
                  <option value="Mapfre BHD Seguros">Mapfre BHD Seguros</option>
                  <option value="Chubb Federal Surety Corp">Chubb Federal Surety Corp (USA Node)</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  onClick={handleIssuePolicy}
                  disabled={isIssuingPolicy}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isIssuingPolicy ? 'Emitiendo...' : 'Emitir Póliza con QR'}</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Monto Calculado de la Garantía de Fianza ({policyType}):
              </span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {formatMoney(calculatePolicyAmount())}
              </span>
            </div>
          </div>

          {/* Active Policies Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pólizas Emitidas & Registro Criptográfico ({policies.length})</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Verificación QR & Certificación X.509
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <th className="py-3 px-4">No. Póliza</th>
                    <th className="py-3 px-4">Proceso DGCP</th>
                    <th className="py-3 px-4">Beneficiario / Entidad</th>
                    <th className="py-3 px-4">Tipo & Monto Afianzado</th>
                    <th className="py-3 px-4">Aseguradora</th>
                    <th className="py-3 px-4">Vigencia</th>
                    <th className="py-3 px-4">Estado & QR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {policies.map((pol) => (
                    <tr key={pol.policyNumber} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-300">
                        {pol.policyNumber}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-200">
                        {pol.tenderCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{pol.beneficiary}</div>
                        <div className="text-[10px] text-slate-500">Afianzado: {pol.insuredEntity}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-emerald-400">{formatMoney(pol.amount)}</div>
                        <div className="text-[10px] text-slate-400">{pol.policyType}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-200">
                        {pol.insurer}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {pol.issueDate} al {pol.expiryDate}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle className="w-3 h-3" />
                          <span>QR VALIDADO</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
