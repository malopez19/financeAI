import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddTransfer from "../../app/(routes)/dashboard/expense/_components/AddTransfer";
import { toast } from "sonner";

// Mock de sonner
jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

describe("Componente agregar transferencia", () => {
  const defaultProps = {
    cashId: "123",
    totalCash: 5000,
    totalSpend: 1000,
    refreshData: jest.fn(),
  };

  // Mock de console.error para evitar mensajes en la consola durante las pruebas
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Limpiar el mock de console.error antes de cada prueba
    console.error.mockClear();
  });

  // ... (resto de las pruebas de renderizado y validación permanecen igual)

  test("maneja errores en la transferencia y muestra toast de error", async () => {
    const errorMessage = "Error de red";
    global.fetch = jest.fn(() =>
      Promise.reject(new Error(errorMessage))
    );

    render(<AddTransfer {...defaultProps} />);
    
    // Llenar el formulario
    fireEvent.change(screen.getByPlaceholderText("e.g. 62315975"), { 
      target: { value: "12345678" } 
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. Gasto en comida"), { 
      target: { value: "Comida" } 
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. 20000"), { 
      target: { value: "1000" } 
    });
    
    // Hacer clic en el botón
    fireEvent.click(screen.getByRole("button"));

    // Esperar a que se muestren los mensajes de error
    await waitFor(() => {
      // Verificar que se llamó a console.error con el mensaje correcto
      expect(console.error).toHaveBeenCalledWith(
        "Error al procesar la solicitud:",
        errorMessage
      );
      // Verificar que se mostró el toast de error
      expect(toast).toHaveBeenCalledWith("Error al procesar la solicitud");
    });

    // Verificar que el botón vuelve a estar habilitado
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  test("maneja errores de respuesta del servidor", async () => {
    const errorText = "Error del servidor";
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve(errorText),
      })
    );

    render(<AddTransfer {...defaultProps} />);
    
    // Llenar el formulario
    fireEvent.change(screen.getByPlaceholderText("e.g. 62315975"), { 
      target: { value: "12345678" } 
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. Gasto en comida"), { 
      target: { value: "Comida" } 
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. 20000"), { 
      target: { value: "1000" } 
    });
    
    // Hacer clic en el botón
    fireEvent.click(screen.getByRole("button"));

    // Esperar a que se muestren los mensajes de error
    await waitFor(() => {
      // Verificar que se llamó a console.error con el mensaje correcto
      expect(console.error).toHaveBeenCalledWith(
        "Error al procesar la solicitud:",
        `Error al procesar la solicitud: ${errorText}`
      );
      // Verificar que se mostró el toast de error
      expect(toast).toHaveBeenCalledWith("Error al procesar la solicitud");
    });
  });

  test("realiza una transferencia exitosa", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    render(<AddTransfer {...defaultProps} />);
    
    // Llenar el formulario
    fireEvent.change(screen.getByPlaceholderText("e.g. 62315975"), { 
      target: { value: "12345678" } 
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. Gasto en comida"), { 
      target: { value: "Comida" } 
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. 20000"), { 
      target: { value: "1000" } 
    });
    
    // Hacer clic en el botón
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      // Verificar que se llamó a refreshData
      expect(defaultProps.refreshData).toHaveBeenCalled();
      // Verificar que se mostró el toast de éxito
      expect(toast).toHaveBeenCalledWith("Nueva transferencia enviada!");
      // Verificar que no se llamó a console.error
      expect(console.error).not.toHaveBeenCalled();
    });

    // Verificar que los campos se limpiaron
    expect(screen.getByPlaceholderText("e.g. 62315975").value).toBe("");
    expect(screen.getByPlaceholderText("e.g. Gasto en comida").value).toBe("");
    expect(screen.getByPlaceholderText("e.g. 20000").value).toBe("");
  });
});