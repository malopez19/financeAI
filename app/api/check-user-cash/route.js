import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import { Cash } from "@/lib/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

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
      .select()
      .from(Cash)
      .where(eq(Cash.createdBy, userEmail));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error al verificar el cash del usuario:", error);
    return NextResponse.json({ message: "Error interno del servidor", error: error.message }, { status: 500 });
  }
};