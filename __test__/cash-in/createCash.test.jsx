import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateCash from "../../app/(routes)/dashboard/cash-in/_components/CreateCash";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

describe("CreateCash Component", () => {
  test("renderiza el botón de recarga", () => {
    render(<CreateCash refreshData={jest.fn()} />);
    
    expect(screen.getByText("Recargar")).toBeInTheDocument();
  });

  test("abre el modal al hacer clic en el botón de recarga", () => {
    render(<CreateCash refreshData={jest.fn()} />);

    const recargarButton = screen.getByText("Recargar");
    fireEvent.click(recargarButton);

    expect(screen.getByText("Ingresa el dinero")).toBeInTheDocument();
  });

  test("el botón de recarga dentro del modal está deshabilitado si no hay monto", () => {
    render(<CreateCash refreshData={jest.fn()} />);
    
    fireEvent.click(screen.getByText("Recargar"));
    
    const submitButton = screen.getByRole("button", { name: "Recargar" });
    expect(submitButton).toBeDisabled();
  });

  test("permite ingresar un monto y habilita el botón de recarga", () => {
    render(<CreateCash refreshData={jest.fn()} />);
    
    fireEvent.click(screen.getByText("Recargar"));
    
    const input = screen.getByPlaceholderText("e.g. $10000");
    fireEvent.change(input, { target: { value: "5000" } });

    const submitButton = screen.getByRole("button", { name: "Recargar" });
    expect(submitButton).not.toBeDisabled();
  });

  test("simula una recarga exitosa y muestra un mensaje de éxito", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    const refreshDataMock = jest.fn();
    render(<CreateCash refreshData={refreshDataMock} />);

    fireEvent.click(screen.getByText("Recargar"));

    const input = screen.getByPlaceholderText("e.g. $10000");
    fireEvent.change(input, { target: { value: "10000" } });

    fireEvent.click(screen.getByRole("button", { name: "Recargar" }));

    await waitFor(() => expect(refreshDataMock).toHaveBeenCalled());
    expect(toast).toHaveBeenCalledWith("Dinero actualizado!");
  });

  test("maneja errores y muestra un mensaje de error", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false })
    );

    render(<CreateCash refreshData={jest.fn()} />);

    fireEvent.click(screen.getByText("Recargar"));

    const input = screen.getByPlaceholderText("e.g. $10000");
    fireEvent.change(input, { target: { value: "10000" } });

    fireEvent.click(screen.getByRole("button", { name: "Recargar" }));

    await waitFor(() => expect(toast).toHaveBeenCalledWith("Error al procesar la solicitud"));
  });
});
