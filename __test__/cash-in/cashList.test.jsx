import { render, screen, waitFor } from "@testing-library/react";
import CashList from "../../app/(routes)/dashboard/cash-in/_components/CashList"; // Ajusta la ruta si es necesario
import { useUser } from "@clerk/nextjs";

// Mock de `useUser` para simular autenticación
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

// Mock de `CreateCash` y `CashItem`
jest.mock("../../app/(routes)/dashboard/cash-in/_components/CreateCash.jsx", () => () => <div data-testid="create-cash" />);
jest.mock("../../app/(routes)/dashboard/cash-in/_components/CashItem.jsx", () => ({ totalCash, totalSpend }) => (
  <div data-testid="cash-item">{`Total: ${totalCash}, Gastado: ${totalSpend}`}</div>
));

describe("CashList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza el botón de agregar dinero", () => {
    useUser.mockReturnValue({ user: { id: "123" } });

    render(<CashList />);

    expect(screen.getByTestId("create-cash")).toBeInTheDocument();
  });

  test("muestra skeleton cuando `cashList` está vacío", () => {
    useUser.mockReturnValue({ user: { id: "123" } });

    render(<CashList />);

    const placeholders = screen.getAllByTestId("placeholder");
    expect(placeholders.length).toBe(5);
  });

  test("muestra los elementos de la lista cuando `cashList` tiene datos", async () => {
    useUser.mockReturnValue({ user: { id: "123" } });

    // Mock de `fetch` para simular respuesta de la API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: "1", amount: 1000, totalSpend: 200 },
            { id: "2", amount: 500, totalSpend: 50 },
          ]),
      })
    );

    render(<CashList />);

    // Espera a que los elementos se rendericen
    await waitFor(() => {
      expect(screen.getAllByTestId("cash-item").length).toBe(2);
    });

    expect(screen.getByText("Total: 1000, Gastado: 200")).toBeInTheDocument();
    expect(screen.getByText("Total: 500, Gastado: 50")).toBeInTheDocument();
  });
});
