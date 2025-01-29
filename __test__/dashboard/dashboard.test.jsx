import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../../app/(routes)/dashboard/page"; // Asegúrate de usar la ruta correcta
import { useUser } from "@clerk/nextjs";
import CardInfo from "../../app/(routes)/dashboard/_components/CardInfo";

// Mock de Clerk useUser
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

// Mock de CardInfo
jest.mock("../../app/(routes)/dashboard/_components/CardInfo", () => () => <div data-testid="card-info-component">Mocked CardInfo</div>);

describe("Componente Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {}); // Evitar que los errores de la API ensucien la salida del test
  });

  test("debe renderizar el saludo con el nombre del usuario", () => {
    useUser.mockReturnValue({
      user: { fullName: "Juan Pérez" },
    });

    render(<Dashboard />);

    expect(screen.getByText(/Hola, Juan Pérez/i)).toBeInTheDocument();
    expect(screen.getByText(/Que esta pasando con tu dinero/i)).toBeInTheDocument();
  });

  test("debe obtener y mostrar la lista de ingresos en CardInfo", async () => {
    useUser.mockReturnValue({
      user: { fullName: "Juan Pérez" },
    });

    // Mock de fetch para simular la API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, amount: 100, description: "Ingreso mensual" }]),
      })
    );

    render(<Dashboard />);

    // Espera a que la API cargue y se pase a CardInfo
    await waitFor(() => {
      expect(screen.getByTestId("card-info-component")).toBeInTheDocument();
    });
  });

  test("muestra un mensaje de error si la API falla", async () => {
    useUser.mockReturnValue({
      user: { fullName: "Juan Pérez" },
    });

    // Mock de fetch que simula un error
    global.fetch = jest.fn(() => Promise.reject(new Error("Error en la API")));

    render(<Dashboard />);

    // Espera que el error se imprima en la consola
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Error al obtener la lista de dineros:", expect.any(Error));
    });
  });
});
