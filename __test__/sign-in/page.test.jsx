import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../../app/(auth)/sign-in/[[...sign-in]]/page';
import { SignIn } from "@clerk/nextjs";

jest.mock("@clerk/nextjs", () => ({
    SignIn: jest.fn(() => <div>SignIn Component</div>),
}));

describe('Page Component', () => {
    test('renderiza la seccion main con la correcta clase', () => {
        render(<Page />);
        const mainSection = screen.getByRole('main');
        expect(mainSection).toHaveClass('flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6');
    });

    test('renderiza el logo svg', () => {
        render(<Page />);
        const logo = screen.getByTestId('logo-svg', { hidden: true });
        expect(logo).toBeInTheDocument();
    });

    test('renderiza el mensaje de bienvenida', () => {
        render(<Page />);
        const welcomeMessage = screen.getByText('Bienvenido a FinappIA');
        expect(welcomeMessage).toBeInTheDocument();
    });

    test('renderiza el componente de iniciar sesion', () => {
        render(<Page />);
        const signInComponent = screen.getByText('SignIn Component');
        expect(signInComponent).toBeInTheDocument();
    });
});