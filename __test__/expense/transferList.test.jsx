import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TransferList from "../../app/(routes)/dashboard/expense/_components/TransferList";
import { useUser } from "@clerk/nextjs";

// Mockear useUser para simular usuario autenticado o no.
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

// Mockear el componente TransferItem para facilitar su verificación.
jest.mock(
  "../../app/(routes)/dashboard/expense/_components/TransferItem",
  () =>
    (props) => (
      <div data-testid="transfer-item">
        {props.id} - {props.totalCash} - {props.totalSpend}
      </div>
    )
);

describe("TransferList Componente", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("muestra marcadores de posición cuando cashList está vacío", async () => {
    // Simula que hay un usuario autenticado.
    useUser.mockReturnValue({ user: { id: "test-user" } });

    // Simula que la API retorna un arreglo vacío.
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(<TransferList />);

    // Espera a que se llame a fetch.
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/transfer", { method: "GET" });
    });

    // Verifica que se rendericen 5 placeholders.
    // Los placeholders tienen la clase "animate-pulse"
    const placeholders = document.querySelectorAll("div.animate-pulse");
    expect(placeholders.length).toBe(5);
  });

  test("Procesa TransferItem cuando cashList no está vacío", async () => {
    // Simula que hay un usuario autenticado.
    useUser.mockReturnValue({ user: { id: "test-user" } });

    // Datos de ejemplo: dos transferencias.
    // Se suman los valores numéricamente:
    // totalCash = Number("1000") + Number("2000") = 3000
    // totalSpend = 200 + 300 = 500
    const mockData = [
      { id: "1", amount: "1000", totalSpend: 200 },
      { id: "2", amount: "2000", totalSpend: 300 },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    render(<TransferList />);

    // Espera a que se renderice el componente TransferItem.
    await waitFor(() => {
      expect(screen.getByTestId("transfer-item")).toBeInTheDocument();
    });

    // Dado que el componente usa el primer elemento del arreglo (mockData[0])
    // y se calculan totales a partir de todo el arreglo:
    // Se espera que se renderice TransferItem con:
    // id = "1", totalCash = 3000, totalSpend = 500
    expect(screen.getByText("1 - 3000 - 500")).toBeInTheDocument();
  });

  test("maneja el error de recuperación y registra el error", async () => {
    useUser.mockReturnValue({ user: { id: "test-user" } });

    const errorMessage = "Network error";
    global.fetch = jest.fn(() => Promise.reject(new Error(errorMessage)));

    // Espía console.error para verificar que se llame con el mensaje esperado.
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<TransferList />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error al obtener la lista de transferencias:",
        errorMessage
      );
    });

    consoleErrorSpy.mockRestore();
  });

  test("No busca si no hay ningún usuario", async () => {
    // Simula que no hay usuario.
    useUser.mockReturnValue({ user: null });
    global.fetch = jest.fn();

    render(<TransferList />);

    // Dado que no hay usuario, no debe realizarse ninguna llamada a fetch.
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});
