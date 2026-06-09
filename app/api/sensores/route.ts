import { NextResponse } from "next/server";
import { getBioEstufaData } from "@/src/lib/bioEstufaStore";

export async function GET() {
  const dados = getBioEstufaData();

  return NextResponse.json({
    temperatura: dados.temperatura,
    umidadeAr: dados.umidadeAr,
    umidadeSolo: dados.umidadeSolo,
    luminosidade: dados.luminosidade,
  });
}
