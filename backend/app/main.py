from fastapi import FastAPI
from pydantic import BaseModel
from typing import Literal
from app.model import predict_case

app = FastAPI()

class InsuranceInput(BaseModel):
    age: int
    pre_existing: int
    treatment_cost: float
    diagnosis_group: str
    policy_age: int
    sum_insured: float
    claim_history: int
    hospital_rating: int
    in_network: int

@app.post("/predict")
def predict(data: InsuranceInput):
    return predict_case(data.dict())
