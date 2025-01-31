import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpensesScreen from '../../app/(routes)/dashboard/expenseList/page';
import { useUser } from '@clerk/nextjs';

// Mock the Clerk useUser hook
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn()
}));

// Mock the ExpenseListTable component
jest.mock('../../app/(routes)/dashboard/expenseList/_components/ExpenseListTable.jsx', () => {
  return function MockExpenseListTable({ expensesList, refreshData }) {
    return (
      <div data-testid="expense-table">
        <button onClick={refreshData} data-testid="refresh-button">
          Refresh
        </button>
        <div data-testid="expenses-count">{expensesList.length}</div>
      </div>
    );
  };
});

describe('Componente ExpenseScreen', () => {
  // Mock data
  const mockExpenses = [
    { id: 1, amount: 100 },
    { id: 2, amount: 200 }
  ];

  // Setup before each test
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock the fetch API
    global.fetch = jest.fn();
  });

  it('renderiza el titulo correctamente', () => {
    useUser.mockReturnValue({ user: null });
    render(<ExpensesScreen />);
    expect(screen.getByText('Mis Transferencias')).toBeInTheDocument();
  });

  it('Busca transferencias cuando el usuario esta autenticado', async () => {
    // Mock successful API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockExpenses)
    });

    // Mock authenticated user
    useUser.mockReturnValue({ user: { id: '123' } });

    await act(async () => {
      render(<ExpensesScreen />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/all-expenses', {
        method: 'GET'
      });
    });

    expect(screen.getByTestId('expenses-count')).toHaveTextContent('2');
  });

  it('manejo del error de API correctamente', async () => {
    // Mock failed API response
    global.fetch.mockResolvedValueOnce({
      ok: false
    });

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error');
    
    // Mock authenticated user
    useUser.mockReturnValue({ user: { id: '123' } });

    await act(async () => {
      render(<ExpensesScreen />);
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    expect(screen.getByTestId('expenses-count')).toHaveTextContent('0');
  });

  it('no busca las transferencias si el usuario no esta autenticado', () => {
    useUser.mockReturnValue({ user: null });
    render(<ExpensesScreen />);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('refresca la finromacion cuando refreshData es llamada', async () => {
    // Mock successful API responses
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockExpenses)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([...mockExpenses, { id: 3, amount: 300 }])
      });

    // Mock authenticated user
    useUser.mockReturnValue({ user: { id: '123' } });

    await act(async () => {
      render(<ExpensesScreen />);
    });

    // Click refresh button
    await act(async () => {
      screen.getByTestId('refresh-button').click();
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(screen.getByTestId('expenses-count')).toHaveTextContent('3');
    });
  });
});