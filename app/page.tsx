"use client";

import Image from "next/image";
import { useEffect, useState, type ElementType } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Droplets,
  Fan,
  FileText,
  Gauge,
  Home,
  Leaf,
  Lightbulb,
  Radio,
  Server,
  Sprout,
  Thermometer,
  Wifi,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

type Historico = {
  horario: string;
  temperatura: number;
  umidadeSolo: number;
  luminosidade: number;
};

const menuItems = [
  { label: "Dashboard", icon: Home, id: "dashboard" },
  { label: "Sensores", icon: Thermometer, id: "sensores" },
  { label: "Automação", icon: Gauge, id: "automacao" },
  { label: "Alertas", icon: AlertTriangle, id: "alertas" },
  { label: "API REST", icon: Server, id: "api" },
  { label: "Documentação", icon: FileText, id: "documentacao" },
];

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [horaAtual, setHoraAtual] = useState("");

  const [dados, setDados] = useState<BioEstufaData>({
    temperatura: 24,
    umidadeAr: 40,
    umidadeSolo: 80,
    luminosidade: 60,
    irrigacaoAtiva: false,
    luzArtificialAtiva: false,
    alertaCritico: false,
    servoVentilacao: 0,
    status: "NORMAL",
  });

  const [historico, setHistorico] = useState<Historico[]>([
    { horario: "12:00", temperatura: 24, umidadeSolo: 80, luminosidade: 60 },
  ]);

  function irParaSecao(id: string) {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  useEffect(() => {
    async function carregarDadosIoT() {
      try {
        const resposta = await fetch("/api/iot", {
          cache: "no-store",
        });

        if (!resposta.ok) {
          throw new Error("Erro ao carregar dados da API IoT");
        }

        const dadosApi: BioEstufaData = await resposta.json();

        const agora = new Date();
        const horario = agora.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        setHoraAtual(horario);
        setDados(dadosApi);

        setHistorico((old) => [
          ...old.slice(-7),
          {
            horario,
            temperatura: dadosApi.temperatura,
            umidadeSolo: dadosApi.umidadeSolo,
            luminosidade: dadosApi.luminosidade,
          },
        ]);
      } catch (error) {
        console.error("Erro ao buscar dados da BioEstufa:", error);
      }
    }

    carregarDadosIoT();

    const interval = setInterval(carregarDadosIoT, 1000);

    return () => clearInterval(interval);
  }, []);

  const saudeSistema = dados.alertaCritico ? 72 : 98;

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_90%_0%,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_60%_90%,rgba(16,185,129,0.10),transparent_28%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-30 [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative flex min-h-screen">
        <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 overflow-y-auto border-r border-cyan-400/10 bg-slate-950/95 p-6 backdrop-blur-xl lg:block">
          <div className="text-center">
            <Image
              src="/logo.png"
              alt="Systhesis"
              width={200}
              height={200}
              priority
              className="mx-auto object-contain drop-shadow-[0_0_45px_rgba(34,211,238,0.85)]"
            />
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
              BioEstufa IoT
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => irParaSecao(item.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-sm font-semibold transition ${
                    activeSection === item.id
                      ? "bg-cyan-400/10 text-cyan-300"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-cyan-400/10 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Conexão ESP32</p>
            <div className="mt-3 flex items-center gap-2 text-emerald-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
              Online
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              ESP32 conectado via Wi-Fi, enviando dados para a API REST do dashboard.
            </p>
          </div>
        </aside>

        <section className="flex-1 px-6 py-6 lg:ml-72 lg:px-8">
          <div className="mb-6 flex flex-col justify-between gap-4 rounded-3xl border border-cyan-400/10 bg-slate-950/70 p-5 backdrop-blur-xl md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
                Global Solution • FIAP
              </p>
              <h1 className="mt-1 text-2xl font-black md:text-3xl">
                Systhesis Mission Control
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <TopBadge icon={Wifi} label="ESP32" value="Online" />
              <TopBadge icon={Radio} label="API REST" value="Ativa" />
              <TopBadge
                icon={Clock}
                label="Última leitura"
                value={horaAtual || "--:--"}
              />
            </div>
          </div>

          <header
            id="dashboard"
            className="scroll-mt-8 rounded-[2rem] border border-cyan-400/10 bg-slate-950/70 p-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr] xl:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.55em] text-cyan-300">
                  BioEstufa Espacial
                </p>

                <h2 className="mt-4 max-w-5xl text-5xl font-black tracking-tight md:text-6xl">
                  Painel IoT para Cultivo em Ambientes Extremos
                </h2>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                  Monitoramento de temperatura, umidade, solo, luminosidade,
                  irrigação e ventilação usando ESP32, sensores, atuadores,
                  Wi-Fi, API REST e interface local OLED.
                </p>
              </div>

              <div className="rounded-3xl border border-cyan-400/10 bg-slate-900/70 p-6">
                <p className="text-sm text-slate-400">Status geral</p>
                <p
                  className={`mt-2 text-4xl font-black ${
                    dados.alertaCritico
                      ? "text-red-400"
                      : dados.status === "NORMAL"
                      ? "text-emerald-400"
                      : "text-cyan-300"
                  }`}
                >
                  {dados.status}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Badge icon={Activity} label="Saúde" value={`${saudeSistema}%`} />
                  <Badge icon={Leaf} label="Cultivo" value="Monitorado" />
                </div>
              </div>
            </div>
          </header>

          <section id="sensores" className="scroll-mt-8 mt-8">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <h2 className="text-3xl font-black">Monitoramento Ambiental</h2>
                <p className="mt-2 text-slate-400">
                  Leituras recebidas em tempo real a partir da API IoT da BioEstufa.
                </p>
              </div>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-300">
                Sistema operacional
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard icon={Thermometer} title="Temperatura" value={`${dados.temperatura}°C`} subtitle="Sensor DHT22" percent={Math.min(100, Math.max(0, Math.round((dados.temperatura / 40) * 100)))} color="bg-red-400" valueColor="text-red-300" />
              <MetricCard icon={Droplets} title="Umidade do Ar" value={`${dados.umidadeAr}%`} subtitle="Condição atmosférica" percent={Math.min(100, Math.max(0, Math.round(dados.umidadeAr)))} color="bg-blue-400" valueColor="text-blue-300" />
              <MetricCard icon={Sprout} title="Umidade do Solo" value={`${dados.umidadeSolo}%`} subtitle="Controle de irrigação" percent={Math.min(100, Math.max(0, dados.umidadeSolo))} color="bg-emerald-400" valueColor="text-emerald-300" />
              <MetricCard icon={Lightbulb} title="Luminosidade" value={`${dados.luminosidade}%`} subtitle="Sensor LDR" percent={Math.min(100, Math.max(0, dados.luminosidade))} color="bg-yellow-300" valueColor="text-yellow-300" />
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-[2rem] border border-cyan-400/10 bg-slate-950/70 p-7 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
                    Tempo real
                  </p>
                  <h2 className="mt-2 text-3xl font-black">
                    Histórico dos Sensores
                  </h2>
                </div>

                <BarChart3 className="text-cyan-300" size={28} />
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historico}>
                    <defs>
                      <linearGradient id="temp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="horario" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />

                    <Tooltip
                      contentStyle={{
                        background: "#020617",
                        border: "1px solid rgba(34,211,238,0.25)",
                        borderRadius: "16px",
                        color: "#fff",
                      }}
                    />

                    <Area type="monotone" dataKey="temperatura" name="Temperatura" stroke="#22d3ee" fill="url(#temp)" strokeWidth={3} />
                    <Area type="monotone" dataKey="umidadeSolo" name="Umidade do Solo" stroke="#34d399" fill="transparent" strokeWidth={3} />
                    <Area type="monotone" dataKey="luminosidade" name="Luminosidade" stroke="#fde047" fill="transparent" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div id="alertas" className="scroll-mt-8 rounded-[2rem] border border-cyan-400/10 bg-slate-950/70 p-7 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
                Alertas
              </p>
              <h2 className="mt-2 text-3xl font-black">Eventos do Sistema</h2>

              <div className="mt-6 space-y-4">
                {dados.alertaCritico && <AlertCard danger title="Condição crítica detectada" description="Buzzer e LED vermelho acionados automaticamente." />}
                {dados.irrigacaoAtiva && <AlertCard title="Solo abaixo do ideal" description="Irrigação automática ativada para estabilizar o cultivo." />}
                {dados.luzArtificialAtiva && <AlertCard title="Baixa luminosidade" description="Luz artificial ligada para manter a fotossíntese." />}
                {dados.servoVentilacao > 0 && <AlertCard title="Ventilação ativada" description="Servo abriu a saída de ar para reduzir temperatura." />}
                {!dados.alertaCritico && !dados.irrigacaoAtiva && !dados.luzArtificialAtiva && dados.servoVentilacao === 0 && <AlertCard success title="Ambiente estável" description="Todos os parâmetros estão dentro da faixa segura." />}
              </div>
            </div>
          </section>

          <section id="automacao" className="scroll-mt-8 mt-8">
            <h2 className="mb-5 text-3xl font-black">Automação da Estufa</h2>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <ActionCard icon={Droplets} title="Irrigação" description="Liga abaixo de 30% de umidade do solo." active={dados.irrigacaoAtiva} activeText="Ativa" inactiveText="Em espera" />
              <ActionCard icon={Lightbulb} title="Luz Artificial" description="Liga quando a luminosidade está baixa." active={dados.luzArtificialAtiva} activeText="Ligada" inactiveText="Desligada" />
              <ActionCard icon={Fan} title="Ventilação" description="Servo abre quando a temperatura passa de 30°C." active={dados.servoVentilacao > 0} activeText={`${dados.servoVentilacao}°`} inactiveText="Fechada" />
              <ActionCard icon={AlertTriangle} title="Alerta Crítico" description="Buzzer e LED vermelho para condições de risco." active={dados.alertaCritico} activeText="Acionado" inactiveText="Normal" danger={dados.alertaCritico} />
            </div>
          </section>

          <section id="api" className="scroll-mt-8 mt-8 rounded-[2rem] border border-cyan-400/10 bg-slate-950/70 p-7 backdrop-blur-xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
                  API REST Next.js
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  Endpoints JSON Documentados
                </h2>
                <p className="mt-2 text-slate-400">
                  Rotas utilizadas para receber dados do ESP32 e consultar sensores,
                  status e atuadores da BioEstufa.
                </p>
              </div>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-300">
                4 endpoints ativos
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Endpoint path="/api/iot" description="Payload completo" />
              <Endpoint path="/api/sensores" description="Leituras ambientais" />
              <Endpoint path="/api/status" description="Estado geral" />
              <Endpoint path="/api/atuadores" description="Saídas e ações" />
            </div>
          </section>

          <section id="documentacao" className="scroll-mt-8 mt-8 rounded-[2rem] border border-cyan-400/10 bg-slate-950/70 p-7 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
              Documentação
            </p>
            <h2 className="mt-2 text-3xl font-black">Arquitetura da Solução</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <DocCard title="Entradas" description="DHT22, sensor de solo, LDR e botão físico para interação com o sistema." />
              <DocCard title="Saídas" description="LEDs de status, buzzer de alerta, luz artificial e servo motor para ventilação." />
              <DocCard title="Comunicação" description="ESP32 conectado via Wi-Fi enviando dados para uma API REST em JSON consumida pelo dashboard." />
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function TopBadge({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/10 bg-slate-900/70 px-4 py-3">
      <Icon size={18} className="text-cyan-300" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

function Badge({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-slate-950/70 p-4">
      <div className="flex items-center gap-3 text-cyan-300">
        <Icon size={18} />
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-2 font-bold">{value}</p>
    </div>
  );
}

function MetricCard({ icon: Icon, title, value, subtitle, percent, color, valueColor }: { icon: ElementType; title: string; value: string; subtitle: string; percent: number; color: string; valueColor: string }) {
  return (
    <div className="rounded-[2rem] border border-cyan-400/10 bg-slate-950/70 p-7 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <Icon className="text-cyan-300" size={26} />
        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
          Live
        </span>
      </div>

      <p className="mt-6 text-slate-400">{title}</p>
      <p className={`mt-3 text-5xl font-black ${valueColor}`}>{value}</p>
      <p className="mt-3 text-sm text-slate-500">{subtitle}</p>

      <div className="mt-7 h-2 rounded-full bg-slate-800">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function AlertCard({ title, description, danger = false, success = false }: { title: string; description: string; danger?: boolean; success?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${danger ? "border-red-400/25 bg-red-500/10" : success ? "border-emerald-400/25 bg-emerald-500/10" : "border-yellow-400/25 bg-yellow-500/10"}`}>
      <p className={`font-bold ${danger ? "text-red-300" : success ? "text-emerald-300" : "text-yellow-300"}`}>
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function ActionCard({ icon: Icon, title, description, active, activeText, inactiveText, danger = false }: { icon: ElementType; title: string; description: string; active: boolean; activeText: string; inactiveText: string; danger?: boolean }) {
  return (
    <div className="rounded-[2rem] border border-cyan-400/10 bg-slate-950/70 p-6 backdrop-blur-xl">
      <Icon className="text-cyan-300" size={28} />
      <p className="mt-5 text-xl font-bold">{title}</p>
      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{description}</p>

      <span className={`mt-5 inline-block rounded-full px-4 py-2 text-sm font-semibold ${active ? danger ? "bg-red-500/15 text-red-300" : "bg-cyan-400/15 text-cyan-300" : "bg-slate-800 text-slate-400"}`}>
        {active ? activeText : inactiveText}
      </span>
    </div>
  );
}

function Endpoint({ path, description }: { path: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
      <p className="font-mono text-sm text-cyan-300">GET {path}</p>
      <p className="mt-3 text-sm text-slate-400">{description}</p>
    </div>
  );
}

function DocCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/70 p-5">
      <p className="font-bold text-cyan-300">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
