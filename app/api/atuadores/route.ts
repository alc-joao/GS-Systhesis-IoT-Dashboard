import { NextResponse } from "next/server";
import { getBioEstufaData } from "@/src/lib/bioEstufaStore";

export async function GET() {
  const dados = getBioEstufaData();

  return NextResponse.json({
    irrigacaoAtiva: dados.irrigacaoAtiva,
    luzArtificialAtiva: dados.luzArtificialAtiva,
    alertaCritico: dados.alertaCritico,
    servoVentilacao: dados.servoVentilacao,
  });
}
