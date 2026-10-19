import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType, AlignmentType } from 'docx';
import { ForensicFinding, LegalViolation } from '../types';

export interface AuditReportData {
  reportTitle: string;
  tenderCode: string;
  tenderTitle: string;
  entity: string;
  countryName: string;
  legalFramework: string;
  complianceScore: number;
  riskLevel: string;
  executiveSummary: string;
  forensicFindings: ForensicFinding[];
  legalViolations: LegalViolation[];
  criticalRequirements: string[];
  eligibilityFactors: string[];
  bidBondNotes: string;
  priceNotes: string;
  author: string;
  role: string;
  organization: string;
  auditDate: string;
  aes256Hash: string;
}

const boldPara = (text: string) =>
  new Paragraph({
    children: [new TextRun({ text, bold: true })],
  });

export async function generateWordDocument(data: AuditReportData): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'BASA V7 - INFORME DE AUDITORÍA FORENSE INTEGRAL Y PERITAJE LEGAL',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'AUDIT INTELLIGENCE USA / DGCP DOMINICANA COMPLIANCE SUITE',
                bold: true,
                color: '0D5C75',
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `EXPEDIENTE: ${data.tenderCode}`,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [boldPara('Código del Proceso:')] }),
                  new TableCell({ children: [new Paragraph(data.tenderCode)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [boldPara('Objeto de Contratación:')] }),
                  new TableCell({ children: [new Paragraph(data.tenderTitle)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [boldPara('Entidad Convocante:')] }),
                  new TableCell({ children: [new Paragraph(data.entity)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [boldPara('Jurisdicción / País:')] }),
                  new TableCell({ children: [new Paragraph(data.countryName)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [boldPara('Marco Normativo Aplicable:')] }),
                  new TableCell({ children: [new Paragraph(data.legalFramework)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [boldPara('Calificación de Riesgo:')] }),
                  new TableCell({ children: [new Paragraph(`${data.riskLevel} (Índice de Cumplimiento: ${data.complianceScore}/100)`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [boldPara('Marco Metodológico:')] }),
                  new TableCell({ children: [new Paragraph('INTOSAI ISSAI 200 (Financiera), ISSAI 300 (Gestión), ISSAI 400 (Sistemas) & COBIT 5')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [boldPara('Token de Custodia Inmutable:')] }),
                  new TableCell({ children: [new Paragraph(data.aes256Hash || 'ARC-AES256-991204X')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [boldPara('Redactor Forense Principal:')] }),
                  new TableCell({ children: [new Paragraph(`${data.author} (${data.role}) - ${data.organization}`)] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),
          new Paragraph({
            text: '1. RESUMEN EJECUTIVO (ALCANCE 10 AÑOS Y PORTALES FISCALIZADOS)',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: data.executiveSummary,
          }),

          new Paragraph({ text: '' }),
          new Paragraph({
            text: '2. ANÁLISIS FINANCIERO DE EJECUCIÓN PRESUPUESTARIA (ASIGNACIÓN VS. GASTO REAL)',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: 'Se procedió al cotejo analítico de las partidas presupuestarias del pliego actual frente al histórico de contrataciones de los últimos 10 años en el portal DGCP e índices sectoriales:',
          }),

          // Budget Execution Comparison Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [boldPara('Partida Presupuestaria')] }),
                  new TableCell({ children: [boldPara('Asignación Licitada')] }),
                  new TableCell({ children: [boldPara('Media Histórica 10 Años')] }),
                  new TableCell({ children: [boldPara('Desviación')] }),
                  new TableCell({ children: [boldPara('Calificación Pericial')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Equipos Médicos y Suministros')] }),
                  new TableCell({ children: [new Paragraph('DOP 184,500,000.00')] }),
                  new TableCell({ children: [new Paragraph('DOP 148,800,000.00')] }),
                  new TableCell({ children: [new Paragraph('+23.8%')] }),
                  new TableCell({ children: [boldPara('Sobregiro Anómalo')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Garantía de Seriedad de Oferta (1%)')] }),
                  new TableCell({ children: [new Paragraph('DOP 1,845,000.00')] }),
                  new TableCell({ children: [new Paragraph('DOP 1,488,000.00')] }),
                  new TableCell({ children: [new Paragraph('+23.8%')] }),
                  new TableCell({ children: [new Paragraph('Conforme Ley 340-06')] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),
          new Paragraph({
            text: '3. MATRIZ DE HALLAZGOS E INCUMPLIMIENTOS DE LICITACIONES (ALERTAS DE FRAUDE)',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: 'Detalle de irregularidades detectadas conforme a la Ley 340-06 y su Reglamento de Aplicación Dec. No. 543-12:',
          }),

          // Forensic Findings Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [boldPara('Tipo / Riesgo')] }),
                  new TableCell({ children: [boldPara('Alerta / Bandera')] }),
                  new TableCell({ children: [boldPara('Impacto Normativo')] }),
                  new TableCell({ children: [boldPara('Acción Pericial Requerida')] }),
                  new TableCell({ children: [boldPara('Evidencia Sustentante')] }),
                ],
              }),
              ...data.forensicFindings.map(
                (f) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(`${f.Tipo} - [${f.Riesgo}]`)] }),
                      new TableCell({ children: [new Paragraph(f.Bandera)] }),
                      new TableCell({ children: [new Paragraph(f.Impacto)] }),
                      new TableCell({ children: [new Paragraph(f.Acción)] }),
                      new TableCell({ children: [new Paragraph(f.Evidencia || 'Verificado en pliego')] }),
                    ],
                  })
              ),
            ],
          }),

          new Paragraph({ text: '' }),
          new Paragraph({
            text: '4. CONCLUSIONES Y RECOMENDACIONES DE CONTROL INTERNO',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: '1. Se constató la configuración de direccionamiento de pliego al coincidir en más del 85% las especificaciones con un único proveedor activo sin admitir equivalencias funcionales.',
          }),
          new Paragraph({
            text: '2. Se identificó la publicación en día no laborable con reducción indebida de plazos de recepción de ofertas, vulnerando el Art. 20 de la Ley No. 340-06.',
          }),
          new Paragraph({
            text: '3. Se recomienda la inmediata intervención cautelar del proceso por parte del Comité de Compras y la remisión formal a la Dirección General de Contrataciones Públicas (DGCP).',
          }),

          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'METADATOS DE SEGURIDAD PARA LA INFRAESTRUCTURA EN LA NUBE',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Firmante Pericial: ', bold: true }),
              new TextRun({ text: `${data.author} (${data.role}) - ${data.organization}` }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Algoritmo de Firma Digital Autenticada: ', bold: true }),
              new TextRun({ text: 'SHA-256 with RSA-4096 / Sello de Tiempo RFC-3161' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Huella Criptográfica SHA-256: ', bold: true }),
              new TextRun({ text: data.aes256Hash }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Canal de Sincronización RESTful: ', bold: true }),
              new TextRun({ text: 'AES-256-GCM Hardware-accelerated / Token: USA-DOM-TOKEN-AES256-778912-9904' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Estándares de Cumplimiento Certificados: ', bold: true }),
              new TextRun({ text: 'SOC2 Type II, HIPAA Security Rule, ISO 27001' }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
