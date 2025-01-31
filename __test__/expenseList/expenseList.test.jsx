import React from "react";
import { render } from "@testing-library/react";
import ExpenseListTable from "../../app/(routes)/dashboard/expenseList/_components/ExpenseListTable";

describe("ExpenseListTable", () => {
    const expensesList = [
        {
            accountNumber: "123456",
            name: "Compra de materiales",
            amount: 50000,
            createdAt: "2023-10-01",
        },
        {
            accountNumber: "789012",
            name: "Pago de servicios",
            amount: 20000,
            createdAt: "2023-10-02",
        },
    ];

    test("renderiza la tabla de encabezados correctamente", () => {
        const { getByText } = render(<ExpenseListTable expensesList={[]} />);
        expect(getByText("Numero de Cuenta")).toBeInTheDocument();
        expect(getByText("Concepto")).toBeInTheDocument();
        expect(getByText("Monto")).toBeInTheDocument();
        expect(getByText("Fecha")).toBeInTheDocument();
    });

    test("renderiza la lista de transferencias correctamente", () => {
        const { getByText } = render(<ExpenseListTable expensesList={expensesList} />);
        expensesList.forEach(expense => {
            expect(getByText(expense.accountNumber)).toBeInTheDocument();
            expect(getByText(expense.name)).toBeInTheDocument();
            expect(getByText(`$${expense.amount}`)).toBeInTheDocument();
            expect(getByText(expense.createdAt)).toBeInTheDocument();
        });
    });

    test("Renderiza el titulo correctamente", () => {
        const { getByText } = render(<ExpenseListTable expensesList={[]} />);
        expect(getByText("Ultimas Transferencias")).toBeInTheDocument();
    });
});