"""
Audit Intelligence USA - Core Forensic Engine (INTOSAI Standards)
Script con Google GenAI SDK (google-genai) y Pydantic para Modelado Forense Estricto.
"""

import os
import json
from typing import List, Optional
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

# ---------------------------------------------------------------------------
# 1. ESQUEMAS DE MODELADO DE DATOS (ESTÁNDAR INTOSAI + FORENSE)
# ---------------------------------------------------------------------------
class ConditionModel(BaseModel):
    description: str = Field(description="Lo que la IA encontró en los datos reales de la entidad.")
    source_document: str = Field(description="Nombre del archivo fuente analizado.")
    page_reference: str = Field(description="Cita detallada del punto y número de página exacto de referencia.")
    archive_token: str = Field(description="Token único de archivado automático simulado para control de evidencia.")

class CriterionModel(BaseModel):
    law_reference: str = Field(description="Ley o norma nacional/internacional infringida aplicable al periodo.")
    article: str = Field(description="Artículo específico de la ley o reglamento vulnerado.")
    period_validity: str = Field(description="Validación de que la ley correspondía al periodo del alcance auditado.")

class CrossReferenceAlerts(BaseModel):
    shareholder_overlap: bool = Field(description="True si se detecta cruce de accionistas o socios duplicados entre participantes.")
    matched_entities: List[str] = Field(description="Lista de empresas o participantes vinculados de forma irregular.")
    common_shareholder_id: Optional[str] = Field(description="Cédula, RNC o Tax ID del accionista o empleado implicado en el cruce.")
    employee_overlap_detected: bool = Field(description="True si un empleado de la entidad figura como participante o socio.")

class EffectModel(BaseModel):
    financial_impact: float = Field(description="Cuantificación o estimación del impacto económico del hallazgo (0.00 si no aplica).")
    description: str = Field(description="Impacto patrimonial, administrativo o legal del incumplimiento.")

class FindingModel(BaseModel):
    finding_id: str = Field(description="Identificador único del hallazgo (Ej: HA-2026-001).")
    type: str = Field(description="Categoría forense: FRACCIONAMIENTO, COLUSION, SOBREPRECIO, NOMINA_FANTASMA, etc.")
    procedure_applied: str = Field(description="Descripción explícita del procedimiento de auditoría o sistema utilizado.")
    condition: ConditionModel
    criterion: CriterionModel
    cross_reference_alerts: CrossReferenceAlerts
    effect: EffectModel
    causa: str = Field(description="Fallo de control interno o acción deliberada que originó la irregularidad.")

class ForensicAuditReport(BaseModel):
    frameworks: List[str] = Field(description="Marcos aplicados (Ej: INTOSAI-ISSAI-200, ISSAI-300, ISSAI-400).")
    scope_period: str = Field(description="Rango de años o periodo auditado bajo el alcance.")
    findings_matrix: List[FindingModel]

# ---------------------------------------------------------------------------
# 2. MOTOR CORE DE AUDITORÍA FORENSE SCM
# ---------------------------------------------------------------------------
class AuditIntelligenceEngine:
    def __init__(self):
        # El nuevo SDK busca automáticamente la variable de entorno GEMINI_API_KEY
        self.client = genai.Client()
        # Se utiliza el modelo recomendado para razonamiento analítico avanzado
        self.model_name = "gemini-2.5-pro"

    def get_system_instruction(self) -> str:
        return (
            "Actúas como el Motor de Inteligencia Forense Avanzado de la plataforma SaaS 'Audit Intelligence USA'. "
            "Tu marco operativo se rige estrictamente por las Normas Internacionales de Entidades Fiscalizadoras Superiores (INTOSAI), "
            "así como por normas de auditoría de gestión y de sistemas.\n\n"
            "INSTRUCCIONES CRÍTICAS DE AUDITORÍA:\n"
            "1. Analiza artículo por artículo de las leyes que apliquen según el periodo histórico provisto. "
            "Busca inconsistencias, irregularidades o violaciones directas.\n"
            "2. Evalúa patrones de colusión, sobreprecios, nóminas fantasma y fraccionamiento de gasto.\n"
            "3. Ejecuta de forma simulada el cruce de accionistas de participantes de la licitación y empleados duplicados.\n"
            "4. Construye cada hallazgo estructurando fielmente sus 4 elementos: Condición (citando punto y página exacta), "
            "Criterio (artículo de ley), Efecto y Causa. Explica el procedimiento forense utilizado.\n"
            "5. Asegura total apego a la verdad de los datos suministrados. Si no detectas una colusión o fraccionamiento, "
            "los campos correspondientes deben reflejar valores vacíos o falsos; nunca inventes datos (cero alucinación)."
        )

    def analyze_document_content(self, document_text: str, document_name: str, scope: str) -> ForensicAuditReport:
        prompt = f"Analizar el siguiente contenido del documento '{document_name}' bajo el alcance temporal: {scope}.\n\nContenido:\n{document_text}"

        config = types.GenerateContentConfig(
            system_instruction=self.get_system_instruction(),
            temperature=0.1,  # Temperatura baja para maximizar la precisión forense
            response_mime_type="application/json",
            response_schema=ForensicAuditReport,
        )

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=config
        )

        return ForensicAuditReport.model_validate_json(response.text)

# ---------------------------------------------------------------------------
# 3. EJEMPLO DE EJECUCIÓN DEL MÓDULO SAAS
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    sample_text = """
    CONTRATO DE ADQUISICIÓN DE SUMINISTROS DE OFICINA. FECHA: 14 de Octubre de 2023.
    ENTIDAD: Ministerio de Inclusión Social. ADJUDICATARIO: Consorcio Tecnológico SRL.
    MONTO TOTAL: RD$ 4,500,000.00. 
    PROCESO: Adjudicación Directa por Urgencia de la Entidad.
    PÁGINA 12: Se aprueba la compra fraccionada en 3 órdenes independientes de RD$ 1,500,000.00 cada una ejecutadas el mismo día para agilizar el despacho.
    PÁGINA 24: Composición accionaria del Adjudicatario: Socio Mayoritario Pedro Martínez (Cédula: 001-0000000-1).
    ANEXO NÓMINA ENTIDAD: Se verifica que el señor Pedro Martínez (Cédula: 001-0000000-1) figura activo como Director de Planificación de esta misma Institución contratante.
    """

    engine = AuditIntelligenceEngine()
    
    try:
        print("🔍 Analizando documentos y ejecutando cruces de datos forenses en tiempo real...")
        report = engine.analyze_document_content(
            document_text=sample_text,
            document_name="Acta_Adjudicacion_Licitacion_2023.pdf",
            scope="Periodo Fiscal 2023 - Normativa Dominicana (Ley 340-06)"
        )
        print("\n✅ Matriz de Hallazgos Automáticos Generada con Éxito (Editable en pantalla):")
        print(json.dumps(report.model_dump(), indent=2, ensure_ascii=False))

    except Exception as e:
        print(f"❌ Error durante el procesamiento del motor forense: {e}")
