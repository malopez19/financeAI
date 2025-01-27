import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import { Cash, Expenses } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";


export const GET = async (req) => {
  try {
    const user = await currentUser();

    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json({ message: "No se pudo obtener el correo electrónico del usuario" }, { status: 400 });
    }

    const userEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ message: "No se pudo obtener el correo electrónico principal del usuario" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const cashId = searchParams.get('cashId');

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

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error("Error al obtener la información del dinero:", error);
    return NextResponse.json({ message: "Error interno del servidor", error: error.message }, { status: 500 });
  }
};

export const DELETE = async (req) => {
    try {
      const { cashId } = await req.json();
  
      // Eliminar gastos asociados
      await db
        .delete(Expenses)
        .where(eq(Expenses.cashId, cashId))
        .returning();
  
      // Eliminar bolsillo
      const result = await db
        .delete(Cash)
        .where(eq(Cash.id, cashId))
        .returning();
  
      return NextResponse.json(result[0], { status: 200 });
    } catch (error) {
      console.error("Error al eliminar el bolsillo:", error);
      return NextResponse.json({ message: "Error interno del servidor", error: error.message }, { status: 500 });
    }
  };