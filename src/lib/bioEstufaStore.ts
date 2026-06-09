export type BioEstufaData = {
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

export function getBioEstufaData() {
  return globalForData.bioEstufaData!;
}

export function setBioEstufaData(data: BioEstufaData) {
  globalForData.bioEstufaData = data;
}
