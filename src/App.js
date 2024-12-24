import React, { useState } from "react";
import "./index.css";

const Hub = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [tier, setTier] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
    const joinDate = new Date().toLocaleDateString();

    setStudents([
      ...students,
      { 
        name, 
        tier, 
        amount, 
        weeklyInterest, 
        totalWithdrawal,
        joinDate,
        weeksActive: 0
      }
    ]);

    setName("");
    setTier("");
    setAmount("");
    setError("");
  };

  const handleWithdraw = (index) => {
    setSelectedStudent(students[index]);
    setShowModal(true);
  };

  const confirmWithdraw = () => {
    const index = students.findIndex(s => s.name === selectedStudent.name);
    setStudents(prevStudents => prevStudents.filter((_, i) => i !== index));
    setShowModal(false);
    setSelectedStudent(null);
  };

  const simulateWeek = () => {
    setStudents(prevStudents =>
      prevStudents.map(student => {
        const interestRate = parseFloat(student.tier.split(" ")[1]) / 100;
        const newWeeklyInterest = student.amount * interestRate;
        const newTotalWithdrawal = parseInt(student.totalWithdrawal) + newWeeklyInterest;
        return {
          ...student,
          weeklyInterest: newWeeklyInterest,
          totalWithdrawal: newTotalWithdrawal,
          weeksActive: student.weeksActive + 1
        };
      })
    );
  };

  const totalSavings = students.reduce((sum, student) => sum + parseInt(student.amount), 0);
  const totalInterest = students.reduce((sum, student) => sum + student.weeklyInterest, 0);
  const averageReturn = students.length > 0 ? (totalInterest / totalSavings * 100).toFixed(2) : 0;

  return (
    <div className="app-container">
      <div className="hero-section">
        <h1>Savings Group Hub</h1>
        <p>Secure your future with group savings</p>
      </div>

      <div className="content-wrapper">
        {/* Registration Form */}
        <div className="registration-container">
          <h2>Register a Student</h2>
          <div className="form-group">
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
            <button className="register-btn" onClick={handleRegister}>Register</button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-section">
          <div className="summary-card">
            <div className="card-icon savings-icon">💰</div>
            <h3>Total Savings</h3>
            <p className="amount">{totalSavings.toLocaleString()} Naira</p>
          </div>
          <div className="summary-card">
            <div className="card-icon members-icon">👥</div>
            <h3>Members</h3>
            <p className="amount">{students.length}/12</p>
          </div>
          <div className="summary-card">
            <div className="card-icon interest-icon">📈</div>
            <h3>Weekly Interest</h3>
            <p className="amount">{totalInterest.toLocaleString()} Naira</p>
          </div>
          <div className="summary-card">
            <div className="card-icon return-icon">🎯</div>
            <h3>Average Return</h3>
            <p className="amount">{averageReturn}%</p>
          </div>
        </div>

        <button className="simulate-btn" onClick={simulateWeek}>
          Simulate Weekly Progress
        </button>

        {/* Dashboard Table */}
        <div className="dashboard-container">
          <h2>Members Dashboard</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Tier</th>
                  <th>Savings</th>
                  <th>Weekly Interest</th>
                  <th>Total Value</th>
                  <th>Weeks Active</th>
                  <th>Join Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.tier}</td>
                    <td>{parseInt(student.amount).toLocaleString()}</td>
                    <td>{student.weeklyInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td>{student.totalWithdrawal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td>{student.weeksActive}</td>
                    <td>{student.joinDate}</td>
                    <td>
                      <button className="withdraw-btn" onClick={() => handleWithdraw(index)}>
                        Withdraw
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Withdrawal</h2>
            <p>Are you sure you want to withdraw {selectedStudent.name}?</p>
            <p>Total Amount: {selectedStudent.totalWithdrawal.toLocaleString()} Naira</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmWithdraw}>Confirm</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>We help students save and grow their money together.</p>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@savingshub.com</p>
            <p>Phone: +234 123 456 7890</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Savings Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Hub;