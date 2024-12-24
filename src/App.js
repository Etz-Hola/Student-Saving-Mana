import React, { useState, useEffect } from "react";
import "./index.css";

const Hub = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [tier, setTier] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profitStats, setProfitStats] = useState({
    dailyProfit: 0,
    weeklyProfit: 0,
    monthlyProfit: 0,
    yearlyProfit: 0,
  });

  useEffect(() => {
    calculateProfits();
  }, [students]);

  const calculateProfits = () => {
    const totalInterest = students.reduce(
      (sum, student) => sum + student.weeklyInterest,
      0
    );
    setProfitStats({
      dailyProfit: totalInterest / 7,
      weeklyProfit: totalInterest,
      monthlyProfit: totalInterest * 4,
      yearlyProfit: totalInterest * 52,
    });
  };

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
        amount: parseInt(amount),
        weeklyInterest,
        totalWithdrawal,
        joinDate,
        weeksActive: 0,
        totalProfit: 0,
        profitHistory: [],
      },
    ]);

    resetForm();
  };

  const resetForm = () => {
    setName("");
    setTier("");
    setAmount("");
    setError("");
  };

  const handleWithdraw = (index) => {
    setSelectedStudent(students[index]);
    setShowModal(true);
  };

  const simulateWeek = () => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        const interestRate = parseFloat(student.tier.split(" ")[1]) / 100;
        const newWeeklyInterest = student.amount * interestRate;
        const newTotalProfit = student.totalProfit + newWeeklyInterest;

        return {
          ...student,
          weeklyInterest: newWeeklyInterest,
          totalWithdrawal: student.amount + newTotalProfit,
          weeksActive: student.weeksActive + 1,
          totalProfit: newTotalProfit,
          profitHistory: [...student.profitHistory, newWeeklyInterest],
        };
      })
    );
  };

  const totalSavings = students.reduce(
    (sum, student) => sum + student.amount,
    0
  );
  const totalMembers = students.length;
  const averageReturn =
    students.length > 0
      ? ((profitStats.weeklyProfit / totalSavings) * 100).toFixed(2)
      : 0;

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="nav-logo">SavingsHub</div>
        <div className="nav-links">
          <span className="nav-item">Dashboard</span>
          <span className="nav-item">Reports</span>
          <span className="nav-item">Settings</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <h1>Student Savings & Investment Hub</h1>
        <p>Building wealth through collective saving and compound interest</p>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        <div className="grid-container">
          {/* Registration Form */}
          <div className="registration-card">
            <div className="card-header">
              <h2>New Member Registration</h2>
              <p>Join our savings community today</p>
            </div>
            <div className="form-group">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              <div className="input-group">
                <label>Savings Tier</label>
                <select value={tier} onChange={(e) => setTier(e.target.value)}>
                  <option value="">Select your tier</option>
                  <option value="Tier 1">Tier 1 - ₦10,000</option>
                  <option value="Tier 2">Tier 2 - ₦20,000</option>
                  <option value="Tier 3">Tier 3 - ₦30,000</option>
                </select>
              </div>
              <div className="input-group">
                <label>Initial Deposit</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button className="primary-button" onClick={handleRegister}>
                Register Member
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Savings</h3>
                <p className="stat-value">₦{totalSavings.toLocaleString()}</p>
              </div>
            </div>
            <div className="stat-card secondary">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Active Members</h3>
                <p className="stat-value">{totalMembers}/12</p>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>Average Return</h3>
                <p className="stat-value">{averageReturn}%</p>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>Top Tier</h3>
                <p className="stat-value">
                  Tier {students.length > 0 ? "3" : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Profit Tracking */}
          <div className="profit-section">
            <h2>Profit Analytics</h2>
            <div className="profit-grid">
              <div className="profit-card">
                <h3>Daily Profit</h3>
                <p>
                  ₦
                  {profitStats.dailyProfit.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="profit-card">
                <h3>Weekly Profit</h3>
                <p>
                  ₦
                  {profitStats.weeklyProfit.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="profit-card">
                <h3>Monthly Profit</h3>
                <p>
                  ₦
                  {profitStats.monthlyProfit.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="profit-card">
                <h3>Yearly Projection</h3>
                <p>
                  ₦
                  {profitStats.yearlyProfit.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
            <div class="simulate-button-container">
              <button class="simulate-button"> Simulate Weekly Progress</button>
            </div>
          </div>

          {/* Members Table */}
          <div className="members-section">
            <h2>Members Overview</h2>
            <div className="table-responsive">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Tier</th>
                    <th>Principal</th>
                    <th>Weekly Returns</th>
                    <th>Total Value</th>
                    <th>Weeks Active</th>
                    <th>Total Profit</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={index}>
                      <td>
                        <div className="member-info">
                          <span className="member-name">{student.name}</span>
                          <span className="member-date">
                            Joined: {student.joinDate}
                          </span>
                        </div>
                      </td>
                      <td>{student.tier}</td>
                      <td>₦{student.amount.toLocaleString()}</td>
                      <td>
                        ₦
                        {student.weeklyInterest.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        ₦
                        {student.totalWithdrawal.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>{student.weeksActive}</td>
                      <td>
                        ₦
                        {student.totalProfit.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        <button
                          className="withdraw-button"
                          onClick={() => handleWithdraw(index)}
                        >
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
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About SavingsHub</h3>
            <p>Empowering students to save and grow their wealth together.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <a href="#terms">Terms of Service</a>
              </li>
              <li>
                <a href="#privacy">Privacy Policy</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: qadiradesoye@gmail.com.com</p>
            <p>Phone: +234 8130605384</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 SavingsHub. All rights reserved.</p>
        </div>
      </footer>

      {/* Withdrawal Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Withdrawal</h2>
            <div className="withdrawal-summary">
              <div className="summary-item">
                <span>Member:</span>
                <span>{selectedStudent.name}</span>
              </div>
              <div className="summary-item">
                <span>Principal Amount:</span>
                <span>₦{selectedStudent.amount.toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span>Total Profit:</span>
                <span>
                  ₦
                  {selectedStudent.totalProfit.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="summary-item total">
                <span>Total Withdrawal:</span>
                <span>
                  ₦
                  {selectedStudent.totalWithdrawal.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="confirm-button"
                onClick={() => {
                  setStudents((prev) =>
                    prev.filter((s) => s.name !== selectedStudent.name)
                  );
                  setShowModal(false);
                }}
              >
                Confirm Withdrawal
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hub;
