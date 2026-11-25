
from pathlib import Path

import joblib
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict

# Project paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "Models"

PIPELINE_PATH = MODEL_DIR / "bank_goodcredit_risk_pipeline.joblib"
METADATA_PATH = MODEL_DIR / "bank_goodcredit_model_metadata.joblib"

SIMPLE_PIPELINE_PATH = MODEL_DIR / "bank_goodcredit_simple_pipeline.joblib"
SIMPLE_METADATA_PATH = MODEL_DIR / "bank_goodcredit_simple_metadata.joblib"

# Load trained artifacts — original 146-feature model
pipeline = joblib.load(PIPELINE_PATH)
metadata = joblib.load(METADATA_PATH)

INPUT_FEATURES = metadata["input_features"]
TARGET_MAPPING = metadata["target_mapping"]

# Load simplified 10-feature model
simple_pipeline = joblib.load(SIMPLE_PIPELINE_PATH)
simple_metadata = joblib.load(SIMPLE_METADATA_PATH)

SIMPLE_INPUT_FEATURES = simple_metadata["input_features"]
SIMPLE_TARGET_MAPPING = simple_metadata["target_mapping"]

# Initialize API
app = FastAPI(
    title="BankCredit Risk Prediction API",
    description="Credit history classification using a trained Random Forest pipeline.",
    version="1.0.0"
)

# CORS — allow the React frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Input validation
class CustomerInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    features: dict[str, str | int | float | None]

@app.get("/")
def home():
    return {
        "message": "BankCredit Risk Prediction API is running",
        "model": metadata["model_name"],
        "total_features": len(INPUT_FEATURES)
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": pipeline is not None,
        "simple_model_loaded": simple_pipeline is not None
    }


@app.post("/predict")
def predict(customer: CustomerInput):

    supplied_features = customer.features

    missing_features = [
        feature for feature in INPUT_FEATURES
        if feature not in supplied_features
    ]

    extra_features = [
        feature for feature in supplied_features
        if feature not in INPUT_FEATURES
    ]

    if missing_features or extra_features:
        raise HTTPException(
            status_code=422,
            detail={
                "missing_features": missing_features,
                "extra_features": extra_features
            }
        )

    try:
        input_df = pd.DataFrame(
            [[supplied_features[f] for f in INPUT_FEATURES]],
            columns=INPUT_FEATURES
        )

        prediction = int(pipeline.predict(input_df)[0])

        probabilities = pipeline.predict_proba(input_df)[0]
        bad_credit_probability = float(probabilities[
            list(pipeline.classes_).index(1)
        ])

        return {
            "prediction": prediction,
            "credit_history": TARGET_MAPPING[prediction],
            "bad_credit_probability": round(
                bad_credit_probability, 4
            )
        }

    except (ValueError, TypeError) as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


# ── Simplified 10-feature model endpoints ──


class SimpleInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    mean_diff_lastpaymt_opened_dt: float | None = None
    payment_history_zero_dpd_count: int | float | None = None
    payment_history_numeric_dpd_count: int | float | None = None
    min_account_age_days: float | None = None
    ratio_curbalance_creditlimit: float | None = None
    payment_history_total_entries: int | float | None = None
    mean_account_age_days: float | None = None
    mean_diff_open_enquiry_dt: float | None = None
    total_creditlimit: float | None = None
    count_enquiry_recency_365: int | float | None = None


@app.get("/model-info-simple")
def simple_model_info():
    return {
        "model_name": simple_metadata["model_name"],
        "input_features": simple_metadata["input_features"],
        "feature_labels": simple_metadata.get("feature_labels", {}),
        "feature_sections": simple_metadata.get("feature_sections", {}),
        "feature_types": simple_metadata.get("feature_types", {}),
        "target": simple_metadata["target"],
        "target_mapping": simple_metadata["target_mapping"],
        "metrics": {
            "test_roc_auc": simple_metadata.get("test_roc_auc"),
            "test_gini": simple_metadata.get("test_gini"),
            "test_pr_auc": simple_metadata.get("test_pr_auc"),
            "test_f1": simple_metadata.get("test_f1"),
            "test_precision": simple_metadata.get("test_precision"),
            "test_recall": simple_metadata.get("test_recall"),
            "cv_roc_auc_mean": simple_metadata.get("cv_roc_auc_mean"),
            "cv_roc_auc_std": simple_metadata.get("cv_roc_auc_std"),
        },
    }


@app.post("/predict-simple")
def predict_simple(inputs: SimpleInput):

    supplied = inputs.model_dump()

    try:
        input_df = pd.DataFrame(
            [[supplied[f] for f in SIMPLE_INPUT_FEATURES]],
            columns=SIMPLE_INPUT_FEATURES,
        )

        prediction = int(simple_pipeline.predict(input_df)[0])

        probabilities = simple_pipeline.predict_proba(input_df)[0]
        bad_credit_probability = float(
            probabilities[list(simple_pipeline.classes_).index(1)]
        )

        return {
            "prediction": prediction,
            "credit_history": SIMPLE_TARGET_MAPPING[prediction],
            "bad_credit_probability": round(bad_credit_probability, 4),
            "model": simple_metadata["model_name"],
        }

    except (ValueError, TypeError) as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )
