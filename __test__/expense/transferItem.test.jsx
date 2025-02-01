import React from "react";
import { render, screen } from "@testing-library/react";
import TransferItem from "../../app/(routes)/dashboard/expense/_components/TransferItem";
import Link from "next/link";

// Mock de Next.js Link para que se renderice como un <a>
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }) => <a href={href}>{children}</a>,
}));

describe("TransferItem Component", () => {
  const defaultProps = {
    id: "1",
    totalCash: 5000,
    totalSpend: 2000,
  };

  test("se renderiza correctamente con datos normales", () => {
    render(<TransferItem {...defaultProps} />);
    
    // Verificamos que se muestre el título
    expect(screen.getByText("Dinero restante:")).toBeInTheDocument();

    // Verificamos que se muestre el total gastado y el total ingresado
    expect(screen.getByText("$2000 Gastado")).toBeInTheDocument();
    expect(screen.getByText("$5000 ingresado")).toBeInTheDocument();

    // Verificamos que el enlace tenga la URL correcta
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/dashboard/expense/1");
  });

  test("la barra de progreso muestra el ancho correcto cuando totalSpend es menor que totalCash", () => {
    const { container } = render(<TransferItem {...defaultProps} />);
    // El cálculo esperado es: (2000 / 5000 * 100) = 40.00%
    // Buscamos el div que representa la barra de progreso.
    const progressBar = container.querySelector(".bg-primary.h-2.rounded-full");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle("width: 40.00%");
  });

  test("se renderiza correctamente cuando los gastos superan el total", () => {
    // En este caso, totalCash es 3000 y totalSpend es 4000.
    // Se espera que: Dinero restante = 3000 - 4000 = -1000
    // Y la barra de progreso se limita al 100%
    const props = {
      id: "2",
      totalCash: 3000,
      totalSpend: 4000,
    };
    const { container } = render(<TransferItem {...props} />);
    
    // Verificamos que se muestre el total gastado e ingresado
    expect(screen.getByText("$4000 Gastado")).toBeInTheDocument();
    expect(screen.getByText("$3000 ingresado")).toBeInTheDocument();

    // Verificamos la barra de progreso (debe ser 100%)
    const progressBar = container.querySelector(".bg-primary.h-2.rounded-full");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle("width: 100%");
  });
});
