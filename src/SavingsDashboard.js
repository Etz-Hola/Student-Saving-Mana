import React from "react";
import "./SavingsDashboard.css";

const SavingsDashboard = ({ students, onWithdraw, simulateWeek }) => {
  const totalSavings = students.reduce((sum, student) => sum + parseInt(student.amount), 0);

  return (
    <div className="dashboard-container">
      <h2>Savings Dashboard</h2>
      <h3>Total Group Savings: {totalSavings} Naira</h3>
      <button onClick={simulateWeek}>Simulate Weekly Progress</button>
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
                <button onClick={() => onWithdraw(index)}>Withdraw</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SavingsDashboard;
