from pydantic import BaseModel
from typing import Literal

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

class KeyFactors(BaseModel):
    cost_ratio: float
    network: Literal["In-Network", "Out-of-Network"]
    hospital_rating: int
    risk_score: float
    pre_existing: bool

class InsuranceOutput(BaseModel):
    decision: Literal["Approved", "Rejected"]
    probability: float
    threshold: float
    key_factors: KeyFactors
