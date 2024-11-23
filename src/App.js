import React, { useState } from "react";
import "./index.css";

const Hub = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [tier, setTier] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // Register a new student
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

    if (students.length >= 12) {
      setError("The group is full. Wait for a member to withdraw.");
      return;
    }

    const weeklyInterest = amount * interestRate;
    const totalWithdrawal = parseInt(amount) + weeklyInterest;

    setStudents([
      ...students,
      { name, tier, amount, weeklyInterest, totalWithdrawal },
    ]);

    // Reset form fields
    setName("");
    setTier("");
    setAmount("");
    setError("");
  };

  // Withdraw a student
  const handleWithdraw = (index) => {
    setStudents((prevStudents) => prevStudents.filter((_, i) => i !== index));
  };

  // Simulate weekly progress
  const simulateWeek = () => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        const interestRate = parseFloat(student.tier.split(" ")[1]) / 100;
        const newWeeklyInterest = student.amount * interestRate;
        const newTotalWithdrawal =
          parseInt(student.totalWithdrawal) + newWeeklyInterest;
        return {
          ...student,
          weeklyInterest: newWeeklyInterest,
          totalWithdrawal: newTotalWithdrawal,
        };
      })
    );
  };

  // Calculate total savings
  const totalSavings = students.reduce(
    (sum, student) => sum + parseInt(student.amount),
    0
  );

  return (
    <div className="app-container">
      <h1>Savings Group</h1>

      {/* Registration Form */}
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

      {/* Savings Dashboard */}
      <div className="dashboard-container">
        <h2>Savings Dashboard</h2>
        <h3>Total Group Savings: {totalSavings} Naira</h3>
        <button className="simulate-btn" onClick={simulateWeek}>
          Simulate Weekly Progress
        </button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Tier</th>
              <th>Savings</th>
              <th>Weekly Interest</th>
              <th>Total Withdrawal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.tier}</td>
                <td>{student.amount}</td>
                <td>{student.weeklyInterest.toFixed(2)}</td>
                <td>{student.totalWithdrawal.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleWithdraw(index)}>Withdraw</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Hub;
