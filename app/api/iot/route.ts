import { NextResponse } from "next/server";
import { getBioEstufaData, setBioEstufaData } from "@/src/lib/bioEstufaStore";

export async function GET() {
  return NextResponse.json(getBioEstufaData());
}

export async function POST(request: Request) {
  const body = await request.json();

  const dados = {
    temperatura: Number(body.temperatura ?? 0),
    umidadeAr: Number(body.umidadeAr ?? 0),
    umidadeSolo: Number(body.umidadeSolo ?? 0),
    luminosidade: Number(body.luminosidade ?? 0),
    irrigacaoAtiva: Boolean(body.irrigacaoAtiva),
    luzArtificialAtiva: Boolean(body.luzArtificialAtiva),
    alertaCritico: Boolean(body.alertaCritico),
    servoVentilacao: Number(body.servoVentilacao ?? 0),
    status: String(body.status ?? "NORMAL"),
  };

  setBioEstufaData(dados);

  return NextResponse.json({
    mensagem: "Dados recebidos com sucesso",
    dados,
  });
}
