import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import { Expenses, Cash } from "@/lib/schema";
import moment from "moment";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export const POST = async (req) => {
  try {
    const { accountNumber, description, amount, cashId, totalCash, totalSpend } = await req.json();
    const remainingCash = totalCash - totalSpend;

    if (parseFloat(amount) <= 0) {
      return NextResponse.json({ message: "El monto ingresado debe ser mayor a 0." }, { status: 400 });
    }

    if (parseFloat(amount) > totalCash) {
      return NextResponse.json({ message: "El monto ingresado es mayor que el dinero total disponible." }, { status: 400 });
    }

    if (parseFloat(amount) > remainingCash) {
      return NextResponse.json({ message: "El monto ingresado es mayor al dinero restante." }, { status: 400 });
    }

    // Insertar nueva transferencia en la base de datos
    const result = await db
      .insert(Expenses)
      .values({
        accountNumber: accountNumber,
        name: description,
        amount: amount,
        cashId: cashId,
        createdAt: moment().format("DD/MM/yyyy"),
      })
      .returning();

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json({ message: "Error interno del servidor", error: error.message }, { status: 500 });
  }
};

export const GET = async () => {
  try {
    const user = await currentUser();

    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json({ message: "No se pudo obtener el correo electrónico del usuario" }, { status: 400 });
    }

    const userEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ message: "No se pudo obtener el correo electrónico principal del usuario" }, { status: 400 });
    }

    // Consulta a la base de datos
    const result = await db
      .select({
        ...getTableColumns(Cash),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Cash)
      .leftJoin(Expenses, eq(Cash.id, Expenses.cashId))
      .where(eq(Cash.createdBy, userEmail))
      .groupBy(Cash.id)
      .orderBy(desc(Cash.id));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error al obtener la lista de transferencias:", error);
    return NextResponse.json({ message: "Error interno del servidor", error: error.message }, { status: 500 });
  }
};