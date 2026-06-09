import { NextResponse } from "next/server";
import { getBioEstufaData } from "@/src/lib/bioEstufaStore";

export async function GET() {
  const dados = getBioEstufaData();

  return NextResponse.json({
    status: dados.status,
    alertaCritico: dados.alertaCritico,
  });
}
