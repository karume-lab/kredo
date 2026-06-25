from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class Node(BaseModel):
    id: str
    label: str
    group: Optional[str] = None
    title: Optional[str] = None

class Edge(BaseModel):
    from_: str
    to: str
    label: str
    id: Optional[str] = None

class EvaluationResponse(BaseModel):
    phone_number: str
    graph: Dict[str, Any]
    repayment_confidence_brief: str
