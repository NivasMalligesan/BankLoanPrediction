import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
import pickle

# -----------------------------
# 1️⃣ Load and clean dataset
# -----------------------------
data = pd.read_csv('loan_data.csv')

# Drop Loan_ID column if exists
if 'Loan_ID' in data.columns:
    data = data.drop(columns=['Loan_ID'])

# Fix Dependents column
data['Dependents'] = data['Dependents'].replace('3+', '3')
data['Dependents'] = pd.to_numeric(data['Dependents'], errors='coerce')

# Fill missing numeric values with median
numeric_cols = ['Dependents', 'LoanAmount', 'ApplicantIncome', 'CoapplicantIncome', 'Loan_Amount_Term', 'Credit_History']
for col in numeric_cols:
    data[col] = pd.to_numeric(data[col], errors='coerce')
    data[col] = data[col].fillna(data[col].median())

# Encode categorical variables
categorical_cols = ['Gender', 'Married', 'Education', 'Self_Employed', 'Property_Area', 'Loan_Status']
for col in categorical_cols:
    data[col] = LabelEncoder().fit_transform(data[col].astype(str))

# -----------------------------
# 2️⃣ Features and target
# -----------------------------
X = data.drop('Loan_Status', axis=1)
y = data['Loan_Status']

# -----------------------------
# 3️⃣ Train/test split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# -----------------------------
# 4️⃣ Feature scaling
# -----------------------------
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# -----------------------------
# 5️⃣ Train Logistic Regression
# -----------------------------
model = LogisticRegression(max_iter=2000, solver='lbfgs')
model.fit(X_train_scaled, y_train)

# -----------------------------
# 6️⃣ Save model and scaler
# -----------------------------
pickle.dump(model, open('model.pkl', 'wb'))
pickle.dump(scaler, open('scaler.pkl', 'wb'))

# -----------------------------
# 7️⃣ Optional: test accuracy
# -----------------------------
accuracy = model.score(X_test_scaled, y_test)
print(f"✅ Model trained and saved as model.pkl")
print(f"📊 Test Accuracy: {accuracy*100:.2f}%")
