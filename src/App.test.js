import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Ensure this is imported
import Hub from './Hub'; // Replace with the correct path to your component

describe('Savings Group Hub', () => {
  test('renders the registration form', () => {
    render(<Hub />);
    expect(screen.getByText(/Register a Student/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Amount/i)).toBeInTheDocument();
  });

  test('displays an error for invalid tier or amount', () => {
    render(<Hub />);
    fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i })); // Use `getByRole`
    expect(screen.getByText(/Invalid tier or amount/i)).toBeInTheDocument();
  });

  test('registers a student successfully', () => {
    render(<Hub />);
    fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Tier 1' } });
    fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: 10000 } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i })); // Use `getByRole`
    expect(screen.getByText(/Alice/i)).toBeInTheDocument();
    expect(screen.getByText(/Tier 1/i)).toBeInTheDocument();
  });

  test('simulates weekly progress correctly', () => {
    render(<Hub />);
    fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Tier 2' } });
    fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: 20000 } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i })); // Use `getByRole`
    fireEvent.click(screen.getByRole('button', { name: /Simulate Weekly Progress/i })); // Specificity
    expect(screen.getByText(/2000.00/i)).toBeInTheDocument(); // Weekly interest
  });
});
