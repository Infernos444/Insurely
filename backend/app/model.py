import pandas as pd
import numpy as np
import joblib

def load_model():
    """Load the trained model with dependencies"""
    model_data = joblib.load('insurance_model.pkl')
    return model_data['model'], model_data['threshold'], model_data['features']

def engineer_features(input_df):
    """Create features the model expects"""
    input_df['cost_ratio'] = input_df['treatment_cost'] / input_df['sum_insured']

    input_df['cost_adequacy'] = np.where(
        input_df['cost_ratio'] > 0.7, 'Critical',
        np.where(input_df['cost_ratio'] > 0.3, 'Borderline', 'Safe')
    )

    input_df['age_group'] = pd.cut(
        input_df['age'],
        bins=[0, 30, 45, 60, 100],
        labels=['Young', 'Adult', 'Senior', 'Elderly']
    )

    input_df['cost_bucket'] = pd.cut(
        input_df['treatment_cost'],
        bins=[0, 50000, 150000, 300000, 500000, np.inf],
        labels=['Very Low', 'Low', 'Medium', 'High', 'Very High']
    )

    input_df['claim_frequency'] = input_df['claim_history'] / (input_df['policy_age'] + 1)
    input_df['recent_claims'] = (input_df['claim_history'] / np.sqrt(input_df['policy_age'] + 1)).round(2)
    input_df['high_risk'] = ((input_df['pre_existing'] == 1) & (input_df['claim_history'] > 2)).astype(int)
    input_df['risk_score'] = (0.5 * input_df['pre_existing'] +
                              0.3 * (input_df['claim_history'] > 1) +
                              0.2 * (input_df['age'] > 60))
    input_df['network_advantage'] = input_df['in_network'] * input_df['hospital_rating']

    # Cast categoricals to string
    input_df['age_group'] = input_df['age_group'].astype(str)
    input_df['cost_bucket'] = input_df['cost_bucket'].astype(str)
    input_df['cost_adequacy'] = input_df['cost_adequacy'].astype(str)
    input_df['diagnosis_group'] = input_df['diagnosis_group'].astype(str)

    return input_df

def predict_case(input_data):
    model, threshold, expected_features = load_model()
    input_df = pd.DataFrame([input_data])
    input_df = engineer_features(input_df)

    missing = set(expected_features) - set(input_df.columns)
    if missing:
        raise ValueError(f"Missing features after engineering: {missing}")

    prob = model.predict_proba(input_df)[0][1]
    decision = "Approved" if prob >= threshold else "Rejected"

    return {
        'decision': decision,
        'probability': float(round(prob, 3)),
        'threshold': float(round(threshold, 4)),
        'key_factors': {
            'cost_ratio': round(float(input_df['cost_ratio'].iloc[0]), 3),
            'network': 'In-Network' if int(input_df['in_network'].iloc[0]) else 'Out-of-Network',
            'hospital_rating': int(input_df['hospital_rating'].iloc[0]),
            'risk_score': round(float(input_df['risk_score'].iloc[0]), 3),
            'pre_existing': bool(input_df['pre_existing'].iloc[0])
        }
    }
