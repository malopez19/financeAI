import { render, screen, waitFor } from "@testing-library/react";
import CardInfo from "../../app/(routes)/dashboard/_components/CardInfo"; // Ajusta la ruta si es necesario
import formatNumber from "@/lib";

describe("componente cardInfo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("muestra los placeholders cuando `cashList` está vacío", () => {
    render(<CardInfo cashList={[]} />);

    // Verifica que hay 3 divs de carga
    const loadingDivs = screen.getAllByTestId("loading-placeholder");
    expect(loadingDivs.length).toBe(3);
  });

  test("calcula y muestra correctamente `totalCash`, `totalSpend` y `netCash` con datos", async () => {
    const mockCashList = [
      { amount: 500, totalSpend: 200 },
      { amount: 300, totalSpend: 100 },
    ];

    render(<CardInfo cashList={mockCashList} />);

    await waitFor(() => {
      // Verifica que los valores se calculan y se muestran correctamente
      expect(screen.getByText("$800")).toBeInTheDocument(); // 500 + 300
      expect(screen.getByText("$300")).toBeInTheDocument(); // 200 + 100
      expect(screen.getByText("$500")).toBeInTheDocument(); // 800 - 300
    });

  });
});
