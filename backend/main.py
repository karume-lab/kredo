import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import get_connection
from agents.explanation_agent import generate_repayment_confidence_brief
from database.schemas import EvaluationResponse
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="KREDO API")

origins = os.getenv("FRONTEND_CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/evaluate/{phone_number}", response_model=EvaluationResponse)
async def evaluate_farmer(phone_number: str):
    # Get database connection
    db = get_connection()
    graph_data = db.get_graph_data(phone_number)
    db.close()
    
    # Generate brief using Featherless API
    brief = generate_repayment_confidence_brief(graph_data)
    
    return EvaluationResponse(
        phone_number=phone_number,
        graph=graph_data,
        repayment_confidence_brief=brief
    )
