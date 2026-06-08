import { NextResponse } from "next/server";

type BioEstufaData = {
  temperatura: number;
  umidadeAr: number;
  umidadeSolo: number;
  luminosidade: number;
  irrigacaoAtiva: boolean;
  luzArtificialAtiva: boolean;
  alertaCritico: boolean;
  servoVentilacao: number;
  status: string;
};

const globalForData = globalThis as unknown as {
  bioEstufaData?: BioEstufaData;
};

if (!globalForData.bioEstufaData) {
  globalForData.bioEstufaData = {
    temperatura: 24,
    umidadeAr: 40,
    umidadeSolo: 80,
    luminosidade: 60,
    irrigacaoAtiva: false,
    luzArtificialAtiva: false,
    alertaCritico: false,
    servoVentilacao: 0,
    status: "NORMAL",
  };
}

export async function GET() {
  return NextResponse.json(globalForData.bioEstufaData);
}

export async function POST(request: Request) {
  const body = await request.json();

  globalForData.bioEstufaData = {
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

  return NextResponse.json({
    mensagem: "Dados recebidos com sucesso",
    dados: globalForData.bioEstufaData,
  });
}
