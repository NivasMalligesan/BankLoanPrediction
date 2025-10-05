import React, { useState } from "react";
import axios from "axios";

const steps = ["Personal Info", "Income Details", "Loan Details", "Property Info", "Review & Submit"];

const LoanFormMultiStep = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    Gender: 1,
    Married: 0,
    Dependents: 0,
    Education: 1,
    Self_Employed: 0,
    ApplicantIncome: 0,
    CoapplicantIncome: 0,
    LoanAmount: 0,
    Loan_Amount_Term: 360,
    Credit_History: 1,
    Property_Area: 1,
  });
  const [result, setResult] = useState("");

  // Function to format number in Indian style
    const formatIndianNumber = (num) => {
      if (!num && num !== 0) return '';
      const x = Math.round(num); // round off decimals
      const lastThree = x % 1000;
      const otherNumbers = Math.floor(x / 1000);
      let result = '';
      if (otherNumbers !== 0) {
        result = otherNumbers.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ',' + (lastThree < 100 ? lastThree.toString().padStart(3, '0') : lastThree);
      } else {
        result = lastThree.toString();
      }
      return result;
    };


  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: ["ApplicantIncome", "CoapplicantIncome", "LoanAmount", "Loan_Amount_Term"].includes(e.target.name)
        ? parseFloat(value)
        : parseInt(value),
    });
  };

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    try {
      const res = await axios.post("https://bankloanpredictionbackend.onrender.com/predict", formData);
      setResult(res.data.loan_status);
      setSubmitted(true); 
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }
  };

  const renderStep = () => {
    if (submitted) {
      return (
<div className="bg-gray-900 p-8 rounded-xl shadow-2xl text-white max-w-lg mx-auto flex flex-col items-center space-y-6">
  {/* Header */}
  <h2 className="text-3xl font-bold">Loan Result</h2>

  {/* Result Badge */}
  <div
    className={`px-6 py-4 rounded-full text-2xl font-semibold shadow-inner w-full text-center ${
      result === 'Approved' ? 'bg-green-800 text-green-400' : 'bg-red-800 text-red-400'
    }`}
  >
    {result === 'Approved' ? '🎉 Approved' : '❌ Rejected'}
  </div>

  {/* Loan Details */}
  <div className="w-full bg-gray-800 p-4 rounded-lg shadow-inner grid grid-cols-2 gap-4 text-left">
    <div className="col-span-2 text-center font-semibold text-lg mb-2">
      <span className="font-semibold">Loan Amount:</span> ${formData.LoanAmount} (₹{formatIndianNumber(formData.LoanAmount * 88.56)})
    </div>
    <div>
      <span className="font-semibold">Loan Term:</span> {formData.Loan_Amount_Term} months <br /> ({formData.Loan_Amount_Term/12} Years)
    </div>
    <div>
      <span className="font-semibold">Applicant Income:</span> ${formData.ApplicantIncome} (₹{formatIndianNumber(formData.ApplicantIncome * 88.56)})
    </div>
    <div>
      <span className="font-semibold">Coapplicant Income:</span> ${formData.CoapplicantIncome} (₹{formatIndianNumber(formData.CoapplicantIncome * 88.56)})
    </div>
    <div>
      <span className="font-semibold">Credit History:</span> {formData.Credit_History === 1 ? 'Good' : 'Bad'}
    </div>
    <div>
      <span className="font-semibold">Property Area:</span> {['Rural', 'Semiurban', 'Urban'][formData.Property_Area]}
    </div>
  </div>

  {/* Tips / Next Steps */}
  <div className="w-full bg-gray-800 p-4 rounded-lg shadow-inner text-gray-300 text-sm text-left">
    {result === 'Approved' ? (
      <p>✅ Congratulations! Your loan is likely to be approved. Please prepare your documents for final submission.</p>
    ) : (
      <p>⚠️ Unfortunately, your loan application may not meet the criteria. Consider reviewing your credit history, income, or applying for a smaller amount.</p>
    )}
  </div>

  {/* Action Button */}
  <button
    onClick={() => { setSubmitted(false); setCurrentStep(0); }}
    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition transform hover:-translate-y-1"
  >
    Apply Again
  </button>

  {/* Note */}
  <p className="mt-2 text-xs text-gray-400 text-center">
    Note: This is a simulated result for demonstration purposes only.
  </p>
</div>


      );
    }

    const fieldWrapper = "flex flex-col";
    const fieldInput = "p-2 rounded border border-gray-600 mt-1 bg-gray-900 text-white";

    switch (currentStep) {
      case 0:
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4 text-white h-96">
            <h3 className="text-lg font-semibold">Personal Info</h3>
            <div className="grid grid-cols-2 gap-4">

            <div className={fieldWrapper}>
                <label>Gender</label>
                <select name="Gender" value={formData.Gender} onChange={handleChange} className={fieldInput}>
                    <option value={1}>Male</option>
                    <option value={0}>Female</option>
                </select>
            </div>
            <div className={fieldWrapper}>
              <label>Married</label>
              <select name="Married" value={formData.Married} onChange={handleChange} className={fieldInput}>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>
            <div className={fieldWrapper}>
              <label>Dependents</label>
              <input type="number" name="Dependents" value={formData.Dependents} onChange={handleChange} min="0" className={fieldInput} />
            </div>
            <div className={fieldWrapper}>
              <label>Education</label>
              <select name="Education" value={formData.Education} onChange={handleChange} className={fieldInput}>
                <option value={1}>Graduate</option>
                <option value={0}>Not Graduate</option>
              </select>
            </div>
            <div className={fieldWrapper}>
              <label>Self Employed</label>
              <select name="Self_Employed" value={formData.Self_Employed} onChange={handleChange} className={fieldInput}>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4 text-white h-96">
            <h3 className="text-lg font-semibold">Income Details</h3>
            <div className={fieldWrapper}>
              <div className="flex justify-between">
              <label>Applicant Income: ₹{formatIndianNumber(formData.ApplicantIncome * 88.56)}</label>
              <label>Applicant Income: ${formData.ApplicantIncome}</label>
              </div>

              <input type="range" min="0" max="50000" name="ApplicantIncome" value={formData.ApplicantIncome} onChange={handleChange} className="w-full mt-2 accent-green-500" />
            </div>
            <div className={fieldWrapper}>
              <div className="flex justify-between">
              <label>Applicant Income: ₹{formatIndianNumber(formData.CoapplicantIncome * 88.56)}</label>
              <label>Coapplicant Income: ${formData.CoapplicantIncome}</label>

              </div>
              <input type="range" min="0" max="50000" name="CoapplicantIncome" value={formData.CoapplicantIncome} onChange={handleChange} className="w-full mt-2 accent-green-500" />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4 text-white h-96 ">
            <h3 className="text-lg font-semibold">Loan Details</h3>
            <div className={fieldWrapper}>
              <div className="flex justify-between">
                <label>Applicant Income: ₹{formatIndianNumber(formData.LoanAmount * 88.56)}</label>
                <label>Loan Amount: ${formData.LoanAmount}</label>
              </div>
              <input type="range" min="0" max="1000000" step="1000" name="LoanAmount" value={formData.LoanAmount} onChange={handleChange} className="w-full mt-2 accent-green-500" />
            </div>
            <div className={fieldWrapper}>
              <label>Loan Term (Months)</label>
              <input type="number" name="Loan_Amount_Term" value={formData.Loan_Amount_Term} onChange={handleChange} min="1" className={fieldInput} />
            </div>
            <div className={fieldWrapper}>
              <label>Credit History</label>
              <select name="Credit_History" value={formData.Credit_History} onChange={handleChange} className={fieldInput}>
                <option value={1}>Good</option>
                <option value={0}>Bad</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4 text-white h-96">
            <h3 className="text-lg font-semibold">Property Info</h3>
            <div className={fieldWrapper}>
              <label>Property Area</label>
              <select name="Property_Area" value={formData.Property_Area} onChange={handleChange} className={fieldInput}>
                <option value={2}>Urban</option>
                <option value={1}>Semiurban</option>
                <option value={0}>Rural</option>
              </select>
            </div>
          </div>
        );

      case 4:
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-6 text-white min-h-[24rem]">
      <h3 className="text-lg font-semibold mb-2">Review & Submit</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="bg-gray-900 px-4 py-2 rounded border border-gray-700 shadow-sm flex justify-between">
            <span className="font-semibold">{key.replace(/_/g, " ")}:</span>
            <span>
              {key === "Gender" ? (value === 1 ? "Male" : "Female") :
               key === "Married" ? (value === 1 ? "Yes" : "No") :
               key === "Education" ? (value === 1 ? "Graduate" : "Not Graduate") :
               key === "Self_Employed" ? (value === 1 ? "Yes" : "No") :
               key === "Credit_History" ? (value === 1 ? "Good" : "Bad") :
               key === "Property_Area" ? ["Rural", "Semiurban", "Urban"][value] :
               key.includes("Income") || key === "LoanAmount" ? `$${value}` :
               value
              }
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition mt-2"
      >
        Submit Application
      </button>
    </div>
  );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 rounded-lg shadow-lg text-white">
      <h1 className="text-2xl font-bold text-center mb-6">Loan Approval Wizard</h1>

      {/* Step Indicators */}
      {!submitted && (
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center w-1/5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${index <= currentStep ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"}`}>
                {index + 1}
              </div>
              <span className="text-xs text-center">{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {!submitted && (
        <div className="h-2 bg-gray-700 rounded mb-6">
          <div className="h-2 bg-green-600 rounded transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {/* Step Content */}
      {renderStep()}

      {/* Navigation */}
      {!submitted && (
        <div className="flex items-center gap-5 mt-4">
          {currentStep > 0 && <button onClick={handleBack} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition w-full">Back</button>}
          {currentStep < steps.length - 1 && <button onClick={handleNext} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full">Next</button>}
        </div>
      )}
    </div>
  );
};

export default LoanFormMultiStep;
