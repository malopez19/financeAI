import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Cash, Expenses } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";

export const GET = async () => {

  try {
    // Obtener usuario autenticado con Clerk y correo electrónico
    const user = await currentUser();

    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json({ message: "No se pudo obtener el correo electrónico del usuario" }, { status: 400 });
    }

    // Obtener el correo electrónico del usuario autenticado
    const userEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ message: "No se pudo obtener el correo electrónico principal del usuario" }, { status: 400 });
    }

    // Consulta a la base de datos
    const result = await db
      .select({
        ...getTableColumns(Cash),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      })
      .from(Cash)
      .leftJoin(Expenses, eq(Cash.id, Expenses.cashId))
      .where(eq(Cash.createdBy, userEmail))
      .groupBy(Cash.id)
      .orderBy(desc(Cash.id));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error interno del servidor", error: error.message }, { status: 500 });
  }
};
