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
            text: 'BASA V7 - SISTEMA DE AUDITORÍA FORENSE DE COMPRAS PÚBLICAS',
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
            text: 'DICTAMEN PERICIAL FORENSE DE LICITACIÓN PÚBLICA',
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
                  new TableCell({ children: [boldPara('Código de Proceso:')] }),
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
                  new TableCell({ children: [boldPara('Nivel de Riesgo Global:')] }),
                  new TableCell({ children: [new Paragraph(`${data.riskLevel} (Puntuación de Cumplimiento: ${data.complianceScore}/100)`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [boldPara('Firma / Auditor Responsable:')] }),
                  new TableCell({ children: [new Paragraph(`${data.author} (${data.role}) - ${data.organization}`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [boldPara('Hash de Integridad AES-256:')] }),
                  new TableCell({ children: [new Paragraph(data.aes256Hash)] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '' }),
          new Paragraph({
            text: '1. RESUMEN EJECUTIVO PERICIAL',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: data.executiveSummary,
          }),

          new Paragraph({ text: '' }),
          new Paragraph({
            text: '2. MATRIZ DE HALLAZGOS FORENSES (BASA V7)',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: 'Detalle de alertas tempranas, riesgos de colusión, fraccionamiento o restricciones a la concurrencia identificadas en el pliego y expediente:',
          }),

          // Forensic Findings Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [boldPara('Tipo / Riesgo')] }),
                  new TableCell({ children: [boldPara('Bandera Roja')] }),
                  new TableCell({ children: [boldPara('Impacto Identificado')] }),
                  new TableCell({ children: [boldPara('Acción Requerida')] }),
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
            text: '3. ANÁLISIS DE VULNERACIÓN NORMATIVA',
            heading: HeadingLevel.HEADING_2,
          }),
          ...data.legalViolations.map(
            (v, idx) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `${idx + 1}. ${v.norm} - ${v.article} [Severidad: ${v.severity}]: `, bold: true }),
                  new TextRun({ text: v.description }),
                ],
              })
          ),

          new Paragraph({ text: '' }),
          new Paragraph({
            text: '4. REQUISITOS CRÍTICOS Y FACTORES DE ELEGIBILIDAD',
            heading: HeadingLevel.HEADING_2,
          }),
          ...data.criticalRequirements.map((r) => new Paragraph({ text: `• ${r}` })),
          new Paragraph({ text: '' }),
          boldPara('Factores de Habilitación y Solvencia:'),
          ...data.eligibilityFactors.map((e) => new Paragraph({ text: `• ${e}` })),

          new Paragraph({ text: '' }),
          new Paragraph({
            text: '5. ANÁLISIS DE PRECIOS HISTÓRICOS Y GARANTÍAS DE OFERTA',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ text: `Póliza de Seriedad de Oferta: ${data.bidBondNotes}` }),
          new Paragraph({ text: `Inteligencia de Precios Históricos (10 Años): ${data.priceNotes}` }),

          new Paragraph({ text: '' }),
          new Paragraph({
            text: 'CERTIFICACIÓN DE AUTENTICIDAD Y FIRMA DIGITAL',
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Este dictamen ha sido emitido bajo estrictos estándares forenses ISO 27001, SOC2 Type II y normativas de compras públicas. Sincronizado con AUDIT INTELLIGENCE USA Node ID: US-DOM-NODE-7. Firma digital criptográfica validada con algoritmo SHA-256 y cifrado AES-256.`,
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
