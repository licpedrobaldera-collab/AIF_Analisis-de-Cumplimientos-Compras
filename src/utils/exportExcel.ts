import { ForensicFinding, TenderItem } from '../types';

export function exportForensicMatrixToExcel(findings: ForensicFinding[], tenderCode: string) {
  const headers = ['Tipo', 'Riesgo', 'Bandera Roja', 'Impacto', 'Accion Requerida', 'Evidencia Sustentante'];
  
  const rows = findings.map(f => [
    `"${f.Tipo.replace(/"/g, '""')}"`,
    `"${f.Riesgo.replace(/"/g, '""')}"`,
    `"${f.Bandera.replace(/"/g, '""')}"`,
    `"${f.Impacto.replace(/"/g, '""')}"`,
    `"${f.Acción.replace(/"/g, '""')}"`,
    `"${(f.Evidencia || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Matriz_Forense_BASA_V7_${tenderCode.replace(/[^a-zA-Z0-9_-]/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTendersToExcel(tenders: TenderItem[]) {
  const headers = ['Codigo', 'Titulo', 'Entidad', 'Pais', 'Ano', 'Presupuesto', 'Moneda', 'Sector', 'Estado', 'Riesgo', 'Puntuacion Cumplimiento', 'Banderas Rojas', 'Normativa Aplicable'];
  
  const rows = tenders.map(t => [
    `"${t.code}"`,
    `"${t.title.replace(/"/g, '""')}"`,
    `"${t.entity.replace(/"/g, '""')}"`,
    `"${t.countryName}"`,
    `"${t.year}"`,
    `"${t.budget}"`,
    `"${t.currency}"`,
    `"${t.sector}"`,
    `"${t.status}"`,
    `"${t.riskLevel}"`,
    `"${t.complianceScore}"`,
    `"${t.redFlagsCount}"`,
    `"${t.lawApplicable}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Reporte_Licitaciones_10Anos_BASAV7.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
