"""
Audit Intelligence USA - FastAPI Microservice & Polyglot Persistence
Endpoint HTTP (/api/v1/audit/process) para análisis forense INTOSAI y resguardo en PostgreSQL y MongoDB.
"""

import os
import json
import uuid
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

try:
    import psycopg2
    from psycopg2.extras import Json
except ImportError:
    psycopg2 = None

try:
    from motor.motor_asyncio import AsyncIOMotorClient
except ImportError:
    AsyncIOMotorClient = None

app = FastAPI(
    title="Audit Intelligence USA - Core Forensic Engine",
    version="2.0.0",
    description="SaaS API con cifrado en tránsito y persistencia políglota para auditoría integral e INTOSAI."
)

class ConditionModel(BaseModel):
    description: str
    source_document: str
    page_reference: str
    archive_token: str

class CriterionModel(BaseModel):
    law_reference: str
    article: str
    period_validity: str

class CrossReferenceAlerts(BaseModel):
    shareholder_overlap: bool
    matched_entities: List[str]
    common_shareholder_id: Optional[str]
    employee_overlap_detected: bool

class EffectModel(BaseModel):
    financial_impact: float
    description: str

class FindingModel(BaseModel):
    finding_id: str
    type: str
    procedure_applied: str
    condition: ConditionModel
    criterion: CriterionModel
    cross_reference_alerts: CrossReferenceAlerts
    effect: EffectModel
    causa: str

class ForensicAuditReport(BaseModel):
    frameworks: List[str]
    scope_period: str
    findings_matrix: List[FindingModel]

class AuditIntelligenceEngine:
    def __init__(self):
        self.client = genai.Client()
        self.model_name = "gemini-2.5-pro"

    def _get_system_instruction(self) -> str:
        return (
            "Actúas como el Motor de Inteligencia Forense Avanzado de la plataforma SaaS 'Audit Intelligence USA'. "
            "Tu marco operativo se rige estrictamente por las Normas Internacionales de Entidades Fiscalizadoras Superiores (INTOSAI), "
            "normas de auditoría de gestión y de sistemas de información.\n\n"
            "REGLAS OBLIGATORIAS:\n"
            "1. Analiza minuciosamente el texto en busca de irregularidades, fraccionamientos de compras, colusión de oferentes "
            "mediante cruces de socios/accionistas, empleados duplicados en nómina o desvíos presupuestarios.\n"
            "2. Construye cada hallazgo estructurando fielmente sus 4 elementos: Condición (citando punto y página exacta), "
            "Criterio (artículo de ley infringido), Efecto y Causa. Explica el procedimiento forense utilizado.\n"
            "3. No inventes datos bajo ninguna circunstancia. Si no hay anomalías, devuelve las matrices vacías."
        )

    def analyze_text(self, text_content: str, filename: str, scope: str, archive_token: str) -> ForensicAuditReport:
        prompt = (
            f"Analizar el siguiente contenido extraído del documento original '{filename}'.\n"
            f"Alcance Temporal/Normativo solicitado por el Auditor: {scope}.\n"
            f"Token de Evidencia asignado para resguardo: {archive_token}.\n\n"
            f"Contenido a procesar:\n{text_content}"
        )

        config = types.GenerateContentConfig(
            system_instruction=self._get_system_instruction(),
            temperature=0.1,
            response_mime_type="application/json",
            response_schema=ForensicAuditReport,
        )

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=config
        )
        return ForensicAuditReport.model_validate_json(response.text)

forensic_engine = AuditIntelligenceEngine()

def save_to_postgresql(report_id: str, report_data: ForensicAuditReport):
    if not psycopg2:
        return "PostgreSQL Driver no instalado."
    postgres_url = os.getenv("POSTGRES_DATABASE_URL")
    if not postgres_url:
        return "URL de PostgreSQL no configurada."
    try:
        conn = psycopg2.connect(postgres_url)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS forensic_reports (
                id VARCHAR(36) PRIMARY KEY,
                scope_period VARCHAR(255),
                report_json JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        cur.execute(
            "INSERT INTO forensic_reports (id, scope_period, report_json) VALUES (%s, %s, %s);",
            (report_id, report_data.scope_period, Json(report_data.model_dump()))
        )
        conn.commit()
        cur.close()
        conn.close()
        return "Guardado exitosamente en PostgreSQL (JSONB)."
    except Exception as e:
        return f"Error en PostgreSQL: {str(e)}"

async def save_to_mongodb(report_id: str, report_data: ForensicAuditReport):
    if not AsyncIOMotorClient:
        return "MongoDB Driver (motor) no instalado."
    mongo_url = os.getenv("MONGODB_URI")
    if not mongo_url:
        return "URI de MongoDB no configurada."
    try:
        client = AsyncIOMotorClient(mongo_url)
        db = client[os.getenv("MONGODB_DB_NAME", "audit_intelligence_db")]
        collection = db["forensic_reports"]
        document = report_data.model_dump()
        document["_id"] = report_id
        await collection.insert_one(document)
        return "Guardado exitosamente en MongoDB (NoSQL)."
    except Exception as e:
        return f"Error en MongoDB: {str(e)}"

@app.post("/api/v1/audit/process", status_code=status.HTTP_201_CREATED)
async def process_audit_document(
    file: UploadFile = File(..., description="Archivo digital de soporte o evidencia forense (PDF, TXT, JPG, PNG)."),
    scope: str = Form(..., description="Alcance y leyes aplicables (Ej: República Dominicana - Ley 340-06 periodo 2020-2024)."),
    db_engine: str = Form("all", description="Motor de destino: 'postgresql', 'mongodb', o 'all' para sincronización simultánea.")
):
    archive_token = f"ARC-{uuid.uuid4().hex[:12].upper()}"
    report_id = str(uuid.uuid4())
    
    try:
        file_bytes = await file.read()
        raw_text_content = file_bytes.decode("utf-8", errors="ignore")
        if not raw_text_content.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El archivo cargado está vacío o no contiene texto legible directamente."
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Fallo al procesar el archivo físico: {str(e)}"
        )

    try:
        forensic_report = forensic_engine.analyze_text(
            text_content=raw_text_content,
            filename=file.filename,
            scope=scope,
            archive_token=archive_token
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"El motor de IA no pudo estructurar la información: {str(e)}"
        )

    storage_log = {}
    target = db_engine.lower()
    
    if target in ["postgresql", "all"]:
        pg_status = save_to_postgresql(report_id, forensic_report)
        storage_log["postgresql"] = pg_status

    if target in ["mongodb", "all"]:
        mongo_status = await save_to_mongodb(report_id, forensic_report)
        storage_log["mongodb"] = mongo_status

    return {
        "status": "SUCCESS",
        "report_id": report_id,
        "archive_token": archive_token,
        "filename_processed": file.filename,
        "storage_synchronization": storage_log,
        "data": forensic_report
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
