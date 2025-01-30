import { render, screen } from "@testing-library/react";
import SideNav from "../../app/(routes)/dashboard/_components/SideNav"; // Ajusta la ruta según la ubicación
import { usePathname } from "next/navigation";
import Link from "next/link";

// Mock de usePathname para simular la ruta actual
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock de next/link para evitar problemas en pruebas
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }) => <a href={href}>{children}</a>,
}));

describe("SideNav Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza los elementos del menú correctamente", () => {
    usePathname.mockReturnValue("/dashboard");

    render(<SideNav />);

    // Verificar que los elementos del menú aparecen
    expect(screen.getByText("Panel de Control")).toBeInTheDocument();
    expect(screen.getByText("Transferencia")).toBeInTheDocument();
    expect(screen.getByText("Ingresar Dinero")).toBeInTheDocument();
    expect(screen.getByText("Historial de Transferencias")).toBeInTheDocument();
  });

  test("aplica la clase de estilo activo al enlace de la ruta actual", () => {
    usePathname.mockReturnValue("/dashboard/expense");

    render(<SideNav />);

    const activeLink = screen.getByText("Transferencia");
    expect(activeLink).toHaveClass("text-primary bg-blue-100");
  });

  test("los enlaces tienen las rutas correctas", () => {
    usePathname.mockReturnValue("/dashboard");

    render(<SideNav />);

    expect(screen.getByText("Panel de Control").closest("a")).toHaveAttribute("href", "/dashboard");
    expect(screen.getByText("Transferencia").closest("a")).toHaveAttribute("href", "/dashboard/expense");
    expect(screen.getByText("Ingresar Dinero").closest("a")).toHaveAttribute("href", "/dashboard/cash-in");
    expect(screen.getByText("Historial de Transferencias").closest("a")).toHaveAttribute("href", "/dashboard/expenseList");
  });
});
