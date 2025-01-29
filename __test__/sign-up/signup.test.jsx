import { render, screen } from "@testing-library/react";
import Page from "../../app/(auth)/sign-up/[[...sign-up]]/page"; // Asegúrate de que la ruta sea correcta
import { SignUp } from "@clerk/nextjs";

jest.mock("@clerk/nextjs", () => ({
  SignUp: jest.fn(() => <div data-testid="sign-up-component">Mocked SignUp</div>),
}));

describe("Page Component", () => {
  test("se renderiza correctamente", () => {
    render(<Page />);

    // Verifica que el título esté presente
    const title = screen.getByText(/Registrate a FinappIA/i);
    expect(title).toBeInTheDocument();

    // Verifica que el componente SignUp se renderiza
    const signUpComponent = screen.getByTestId("sign-up-component");
    expect(signUpComponent).toBeInTheDocument();
  });
});
