import pandas as pd
import pickle
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load model and scaler
model = pickle.load(open("model.pkl", "rb"))
scaler = pickle.load(open("scaler.pkl", "rb"))

class LoanApplication(BaseModel):
    Gender: int
    Married: int
    Dependents: int
    Education: int
    Self_Employed: int
    ApplicantIncome: float
    CoapplicantIncome: float
    LoanAmount: float
    Loan_Amount_Term: float
    Credit_History: int
    Property_Area: int

@app.post("/predict")
def predict_loan(application: LoanApplication):
    df = pd.DataFrame([application.dict()])
    df_scaled = scaler.transform(df)  # scale features
    prediction = model.predict(df_scaled)[0]
    status = "Approved" if prediction == 1 else "Rejected"
    return {"loan_status": status}
