import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ExpensesScreen from "../../app/(routes)/dashboard/expense/[id]/page";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Coloca el mock antes de cualquier importación del módulo "@clerk/nextjs"
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock de CashItem: renderiza un div simple con data-testid="cash-item"
jest.mock("../../app/(routes)/dashboard/cash-in/_components/CashItem.jsx", () => (props) => (
  <div data-testid="cash-item">
    CashItem: {props.id} - {props.totalCash} - {props.totalSpend}
  </div>
));

// Mock de AddTransfer: renderiza un div simple con data-testid="add-transfer"
jest.mock("../../app/(routes)/dashboard/expense/_components/AddTransfer.jsx", () => (props) => (
  <div data-testid="add-transfer">AddTransfer for cashId: {props.cashId}</div>
));

// Mock de sonner
jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

describe("ExpensesScreen Component", () => {
  const mockUser = { id: "test-user" };
  // Simulamos que params es una promesa que se resuelve con { id: "test-cash-id" }
  const mockParamsPromise = Promise.resolve({ id: "test-cash-id" });
  // Data simulada para la información del dinero
  const mockCashInfo = { id: "cash1", amount: 5000, totalSpend: 1000 };

  let mockReplace, mockBack;
  beforeEach(() => {
    jest.clearAllMocks();
    // Simulamos que hay un usuario autenticado
    useUser.mockReturnValue({ user: mockUser });
    // Simulamos el hook useRouter
    mockReplace = jest.fn();
    mockBack = jest.fn();
    useRouter.mockReturnValue({
      replace: mockReplace,
      back: mockBack,
    });
  });

  test("muestra el encabezado, obtiene información de efectivo y muestra CashItem y AddTransfer", async () => {
    // Mock de fetch para la llamada GET a la API
    global.fetch = jest.fn((url, options) => {
      if (
        url === `/api/transfer-id?cashId=test-cash-id` &&
        options.method === "GET"
      ) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCashInfo),
        });
      }
      // Para cualquier otra llamada, se retorna un arreglo vacío
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    render(<ExpensesScreen params={mockParamsPromise} />);

    // Verificamos que se renderice el título de la página
    expect(screen.getByText("Mis Transferencias")).toBeInTheDocument();

    // Esperamos a que se renderice el componente CashItem
    await waitFor(() => {
      expect(screen.getByTestId("cash-item")).toBeInTheDocument();
    });

    // Verificamos que CashItem muestre la información correcta
    expect(
      screen.getByText("CashItem: cash1 - 5000 - 1000")
    ).toBeInTheDocument();

    // Verificamos que AddTransfer reciba el cashId proveniente de params (test-cash-id)
    expect(screen.getByTestId("add-transfer")).toHaveTextContent(
      "test-cash-id"
    );
  });
});
