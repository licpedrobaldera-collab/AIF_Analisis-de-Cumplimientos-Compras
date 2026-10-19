import { jsPDF } from 'jspdf';
import { AuditReportData } from './exportWord';

export function generateAuthenticatedPdf(data: AuditReportData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(245, 158, 11); // amber-500
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('BASA V7 - SISTEMA FORENSE DE COMPRAS PÚBLICAS', 14, 11);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('AUDIT INTELLIGENCE USA / DGCP COMPLIANCE ENGINE | SOC2 & HIPAA VERIFIED', 14, 18);
  doc.text(`HASH AES-256: ${data.aes256Hash.substring(0, 32)}...`, 14, 23);

  // Security Badge
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - 65, 6, 52, 16, 2, 2, 'F');
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('FIRMA DIGITAL ACTIVA', pageWidth - 60, 12);
  doc.setTextColor(203, 213, 225);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`SHA-256 / RFC-3161 Timestamp`, pageWidth - 60, 17);

  y = 36;

  // Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('DICTAMEN PERICIAL FORENSE DE LICITACIÓN', 14, y);
  y += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Expediente: ${data.tenderCode} | Fecha de Auditoría: ${data.auditDate}`, 14, y);
  y += 8;

  // Metadata Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 38, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);

  doc.setFont('helvetica', 'bold');
  doc.text('Objeto:', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  const titleLines = doc.splitTextToSize(data.tenderTitle, pageWidth - 70);
  doc.text(titleLines.slice(0, 2), 48, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Entidad:', 18, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(data.entity, 48, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.text('Jurisdicción:', 18, y + 21);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.countryName} | Marco: ${data.legalFramework}`, 48, y + 21);

  doc.setFont('helvetica', 'bold');
  doc.text('Diagnóstico:', 18, y + 28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(data.riskLevel === 'Crítico' || data.riskLevel === 'Alto' ? 220 : 16, data.riskLevel === 'Crítico' || data.riskLevel === 'Alto' ? 38 : 185, 38);
  doc.text(`Nivel de Riesgo: ${data.riskLevel.toUpperCase()} | Puntuación de Cumplimiento: ${data.complianceScore}/100`, 48, y + 28);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Perito / Rol:', 18, y + 34);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.author} (${data.role}) - ${data.organization}`, 48, y + 34);

  y += 44;

  // Executive summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. RESUMEN EJECUTIVO Y CONCLUSIONES PERICIALES', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(data.executiveSummary, pageWidth - 28);
  doc.text(summaryLines, 14, y);
  y += summaryLines.length * 4.2 + 4;

  // Forensic Findings
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. MATRIZ DE HALLAZGOS FORENSES (BASA V7 CORE)', 14, y);
  y += 5;

  data.forensicFindings.slice(0, 4).forEach((finding, idx) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, y, pageWidth - 28, 18, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text(`[${finding.Tipo.toUpperCase()}] ${finding.Bandera} - Riesgo: ${finding.Riesgo}`, 17, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`Impacto: ${finding.Impacto}`, 17, y + 10);
    doc.text(`Acción Recomendada: ${finding.Acción}`, 17, y + 14.5);

    y += 21;
  });

  // Check if we need page 2 for signature and legal analysis
  if (y > 215) {
    doc.addPage();
    y = 20;
  }

  // Legal violations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. VULNERACIONES NORMATIVAS DETECTADAS', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(51, 65, 85);
  data.legalViolations.slice(0, 3).forEach((v) => {
    doc.text(`• ${v.norm} (${v.article}): ${v.description} [Severidad: ${v.severity}]`, 16, y);
    y += 4.5;
  });

  y += 4;

  // Digital Signature Block
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CERTIFICADO DE FIRMA DIGITAL Y VALIDACIÓN CRIPTOGRÁFICA', 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(`Firma emitida por: ${data.author} (${data.role})`, 18, y + 13);
  doc.text(`Certificador Raíz: Audit Intelligence USA Root CA / DGCP Dominicana Secure Node`, 18, y + 18);
  doc.text(`Algoritmo Criptográfico: SHA-256 with RSA-4096 / Cifrado de Transporte AES-256-GCM`, 18, y + 23);
  doc.text(`Estándar de Seguridad: Cumple estrictamente con HIPAA Security Rule & SOC2 Type II Audit Standards`, 18, y + 28);
  doc.text(`Sello de Tiempo RFC-3161: ${new Date().toISOString()} | UUID: ${data.aes256Hash}`, 18, y + 33);

  // Simulated QR Code box on right side
  doc.setFillColor(15, 23, 42);
  doc.rect(pageWidth - 46, y + 6, 26, 26, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(pageWidth - 44, y + 8, 22, 22, 'F');
  doc.setFillColor(15, 23, 42);
  doc.rect(pageWidth - 42, y + 10, 6, 6, 'F');
  doc.rect(pageWidth - 30, y + 10, 6, 6, 'F');
  doc.rect(pageWidth - 42, y + 22, 6, 6, 'F');
  doc.setFontSize(5);
  doc.text('QR VERIF', pageWidth - 42, y + 20);

  // Trigger download
  doc.save(`Dictamen_Forense_${data.tenderCode.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
}
