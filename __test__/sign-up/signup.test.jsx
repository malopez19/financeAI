import { render, screen } from "@testing-library/react";
import Page from "../../app/(auth)/sign-up/[[...sign-up]]/page"; // Asegúrate de que la ruta sea correcta
import { SignUp } from "@clerk/nextjs";

jest.mock("@clerk/nextjs", () => ({
  SignUp: jest.fn(() => <div data-testid="sign-up-component">Mocked SignUp</div>),
}));

describe("componente registrarse", () => {
  // Verifica que el título esté presente
  test("se renderiza el parrafo de registrate", () => {
    render(<Page />);
    const title = screen.getByText(/Registrate a FinappIA/i);
    expect(title).toBeInTheDocument();
  });

  // Verifica que el componente SignUp se renderiza
  test("renderiza el componente sign-up", () => {
    render(<Page />);
    const signUpComponent = screen.getByTestId("sign-up-component");
    expect(signUpComponent).toBeInTheDocument();
  })
});
