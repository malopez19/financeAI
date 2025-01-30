import { render, screen } from "@testing-library/react";
import CashItem from "../../app/(routes)/dashboard/cash-in/_components/CashItem"; 
import formatNumber from "@/lib";

describe("CashItem Component", () => {
  test("muestra correctamente el dinero restante, gastado e ingresado", () => {
    const totalCash = 1000;
    const totalSpend = 400;

    render(<CashItem totalCash={totalCash} totalSpend={totalSpend} />);

    // Verifica que muestra el dinero restante
    expect(screen.getByText(`$${formatNumber(totalCash - totalSpend)}`)).toBeInTheDocument();

    // Verifica que muestra el total gastado
    expect(screen.getByText(`$${totalSpend} Gastado`)).toBeInTheDocument();

    // Verifica que muestra el total ingresado
    expect(screen.getByText(`$${totalCash} Ingresado`)).toBeInTheDocument();

    // Verifica que la barra de progreso tiene el ancho correcto
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle(`width: 40%`); // 400/1000 * 100 = 40%
  });

  test("muestra 100% en la barra de progreso si el gasto supera el total de dinero", () => {
    const totalCash = 500;
    const totalSpend = 800; // Gasto mayor que el ingreso

    render(<CashItem totalCash={totalCash} totalSpend={totalSpend} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle(`width: 100%`); // No puede superar el 100%
  });

  test("muestra 0% en la barra de progreso si no hay gasto", () => {
    const totalCash = 1000;
    const totalSpend = 0; // No se ha gastado nada

    render(<CashItem totalCash={totalCash} totalSpend={totalSpend} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle(`width: 0%`);
  });
});
