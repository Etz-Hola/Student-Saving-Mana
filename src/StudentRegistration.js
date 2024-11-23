import React, { useState } from "react";
import "./StudentRegistration.css";

const StudentRegistration = ({ onRegister }) => {
  const [name, setName] = useState("");
  const [tier, setTier] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!name || !tier || !amount) {
      setError("All fields are required.");
      return;
    }

    let interestRate = 0;
    if (tier === "Tier 1" && amount === "10000") interestRate = 0.05;
    else if (tier === "Tier 2" && amount === "20000") interestRate = 0.1;
    else if (tier === "Tier 3" && amount === "30000") interestRate = 0.2;
    else {
      setError("Invalid tier or amount.");
      return;
    }

    const weeklyInterest = amount * interestRate;
    const totalWithdrawal = parseInt(amount) + weeklyInterest;

    onRegister({ name, tier, amount, weeklyInterest, totalWithdrawal });
    setName("");
    setTier("");
    setAmount("");
    setError("");
  };

  return (
    <div className="registration-container">
      <h2>Register a Student</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={tier} onChange={(e) => setTier(e.target.value)}>
        <option value="">Select Tier</option>
        <option value="Tier 1">Tier 1 - 10,000 Naira</option>
        <option value="Tier 2">Tier 2 - 20,000 Naira</option>
        <option value="Tier 3">Tier 3 - 30,000 Naira</option>
      </select>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default StudentRegistration;

