# BankCredit – Credit History Classification System

A full-stack machine learning application that classifies customer credit history using a Random Forest model, with a FastAPI backend and React frontend.

**Live Application:** https://bank-credit-prediction.vercel.app

**Backend API:** https://bankcredit-prediction.onrender.com

**API Documentation:** https://bankcredit-prediction.onrender.com/docs

---

## 1. Project Overview

BankCredit is a machine learning project focused on credit history classification.

The application analyzes customer account, payment history, and credit enquiry-related features to classify credit history into two categories:

- **Good Credit History (0)**
- **Bad Credit History (1)**

The project includes two trained Random Forest pipelines:

- Original model: Uses 146 engineered features.
- Simplified model: Uses 10 selected features for easier user interaction through the web application.

The simplified model is integrated into an interactive prediction interface.

## 2. Business Problem

Understanding customer credit history is important in banking and financial services.

This project explores how historical payment behaviour, account characteristics, and credit enquiry patterns can be used to classify credit history.

The objective is to demonstrate an end-to-end machine learning workflow, from data preparation and feature engineering to model deployment and API integration.

## 3. Technology Stack

| Category | Technologies |
|---|---|
| Programming | Python |
| Data Processing | Pandas, NumPy |
| Machine Learning | Scikit-learn |
| Model Persistence | Joblib |
| Backend | FastAPI |
| API Validation | Pydantic |
| Frontend | React, Vite |
| Styling | Tailwind CSS |
| Version Control | Git, GitHub |
| Backend Deployment | Render |
| Frontend Deployment | Vercel |

## 4. System Architecture

```text
Customer Input
      |
      v
React Frontend
      |
      v
FastAPI Backend
      |
      v
Input Validation
      |
      v
Random Forest Pipeline
      |
      v
Prediction + Probability
      |
      v
Frontend Result Display
```

## 5. Machine Learning Approach

The project uses Random Forest classification.

Two model configurations were developed:

### Original Model
- Uses 146 engineered input features.
- Includes the original trained preprocessing and classification pipeline.
- Exposes predictions through the `/predict` endpoint.

### Simplified Model
- Uses 10 selected input features.
- Designed for a more accessible prediction interface.
- Exposes predictions through the `/predict-simple` endpoint.

### Simplified Model Features

1. Mean difference between last payment and account opening dates.
2. Count of zero-DPD payment history entries.
3. Count of numeric-DPD payment history entries.
4. Minimum account age.
5. Current balance to credit limit ratio.
6. Total payment history entries.
7. Average account age.
8. Mean difference between account opening and enquiry dates.
9. Total credit limit.
10. Credit enquiries within the last 365 days.

## 6. Application Features

- Interactive customer input form.
- Credit history classification.
- Bad credit probability output.
- Model information endpoint.
- Backend health monitoring endpoint.
- REST API integration.
- Deployed frontend and backend.

## 7. API Endpoints

Base URL:

`https://bankcredit-prediction.onrender.com`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API welcome information |
| GET | `/health` | Backend and model health status |
| GET | `/model-info-simple` | Simplified model information |
| POST | `/predict` | Original model prediction |
| POST | `/predict-simple` | Simplified model prediction |

Interactive API documentation:

https://bankcredit-prediction.onrender.com/docs

## 8. Project Structure

```text
BankCredit/
│
├── Backend/
│   ├── main.py
│   └── Models/
│       ├── bank_goodcredit_risk_pipeline.joblib
│       ├── bank_goodcredit_model_metadata.joblib
│       ├── bank_goodcredit_simple_pipeline.joblib
│       └── bank_goodcredit_simple_metadata.joblib
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── requirements.txt
├── .gitignore
└── README.md
```

## 9. Run Locally

### Backend Setup

Clone the repository:

```bash
git clone https://github.com/JaswanthRaj14/BankCredit-Prediction.git
cd BankCredit-Prediction
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
python -m uvicorn Backend.main:app --reload
```

Backend documentation:

http://127.0.0.1:8000/docs

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend development URL:

http://localhost:5173

## 10. Deployment

The application is deployed using:

- **GitHub:** Source code management.
- **Render:** FastAPI backend hosting.
- **Vercel:** React frontend hosting.

The frontend communicates with the backend through REST API requests.

## 11. Key Learning Outcomes

- End-to-end machine learning application development.
- Feature engineering and model integration.
- Building REST APIs using FastAPI.
- Input validation using Pydantic.
- Connecting React applications with machine learning APIs.
- Managing model artifacts using Joblib.
- Git and GitHub version control.
- Deploying full-stack ML applications.

## 12. Limitations and Responsible Use

- This is an educational and portfolio demonstration project.
- Model predictions are classifications, not guaranteed assessments of actual creditworthiness.
- Predicted probabilities should not be interpreted as calibrated real-world default probabilities without further validation.
- The application is not intended for actual lending, loan approval, or rejection decisions.
- Model performance, fairness, calibration, and robustness require further evaluation before any real-world financial use.

---

**Project Status:** Deployed and operational.

**Developed as a Banking and Financial Services Machine Learning Portfolio Project.**
