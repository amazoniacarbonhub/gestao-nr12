export type DemoMachine = {
  id: string; tag: string; name: string; type: string; sector: string; line: string;
  manufacturer: string; model: string; serial: string; year: number; power: string;
  voltage: string; status: string; stage: string; category: string; plr: string;
  hrn: number; risk: string; image: string; description: string;
  safeguards: string[]; hazards: string[]; actions: string[];
};

const types = [
  { type:"Máquina SMT", name:"Linha SMT", maker:"Yamaha", model:"YSM20R", power:"7,5 kW", category:"Linha de montagem", image:"https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900" },
  { type:"Injetora plástica", name:"Injetora", maker:"Haitian", model:"MA1600/600", power:"18,5 kW", category:"Prensas e injetoras", image:"https://images.unsplash.com/photo-1567789884554-0b844b597180?w=900" },
  { type:"Prensa pneumática", name:"Prensa pneumática", maker:"Schmidt", model:"PressControl 300", power:"3,0 kW", category:"Prensas e injetoras", image:"https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?w=900" },
  { type:"Furadeira de bancada", name:"Furadeira", maker:"Motomil", model:"FB-16", power:"0,75 kW", category:"Usinagem", image:"https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900" },
  { type:"Compressor de ar", name:"Compressor", maker:"Atlas Copco", model:"GA 15", power:"15 kW", category:"Utilidades", image:"https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=900" },
  { type:"Torno mecânico", name:"Torno", maker:"Nardini", model:"ND 250", power:"5,5 kW", category:"Usinagem", image:"https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=900" },
  { type:"Fresadora", name:"Fresadora", maker:"Clever", model:"VH-3", power:"4,0 kW", category:"Usinagem", image:"https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=900" },
  { type:"Esteira transportadora", name:"Transportador", maker:"FlexLink", model:"X85", power:"1,5 kW", category:"Movimentação", image:"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900" },
  { type:"Robô industrial", name:"Robô", maker:"FANUC", model:"M-10iD", power:"6,0 kW", category:"Automação", image:"https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=900" },
  { type:"Serra de fita", name:"Serra de fita", maker:"Franho", model:"SF-250", power:"2,2 kW", category:"Usinagem", image:"https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900" }
];

const sectors = ["SMT 01","SMT 02","Injeção","Estamparia","Usinagem","Manutenção","Utilidades","Montagem","Almoxarifado","Ferramentaria"];
const statuses = ["Ativa","Ativa","Em adequação","Manutenção","Bloqueada"];
const stages = ["diagnostico","apr_hrn","adequacao","validacao","inventario"];
const risks = ["Alto","Moderado","Crítico","Alto","Baixo"];
const guards = [
  ["Carenagem fixa com fixadores não removíveis manualmente","Intertravamento codificado na porta","Relé de segurança monitorado","Parada de emergência"],
  ["Cortina de luz tipo 4 (a validar)","Comando bimanual monitorado","Válvula de segurança monitorada","Proteção móvel intertravada"],
  ["Grade perimetral","Scanner de área","Chave de segurança com bloqueio","Reset manual fora da zona de risco"],
  ["Proteção do mandril","Anteparo contra cavacos","Botão de emergência","Procedimento LOTO"]
];
const hazards = [
  ["Acesso a partes móveis durante ciclo","Esmagamento em zona de fechamento","Choque elétrico em painel"],
  ["Projeção de cavacos e partículas","Contato com ferramenta rotativa","Aprisionamento em transmissão"],
  ["Partida inesperada após retorno de energia","Energia pneumática residual","Ruído ocupacional"],
  ["Queda de carga ou componente","Acesso à zona de operação","Intervenção sem bloqueio de energia"]
];
const actions = [
  ["Validar categoria e PLr da função de segurança","Revisar apreciação de riscos e HRN residual","Executar teste de parada e registrar evidência"],
  ["Instalar proteção fixa conforme projeto","Adequar circuito de intertravamento","Atualizar procedimento de bloqueio e etiquetagem"],
  ["Realizar medição de tempo de parada","Inspecionar aterramento e continuidade","Capacitar operadores e manutenção"],
  ["Registrar fotos de antes/depois","Atualizar diagrama elétrico","Submeter validação técnica independente"]
];

export const demoCompany = {
  name:"Amazônia Componentes Industriais Ltda. (DEMO)",
  cnpj:"12.345.678/0001-90", unit:"Planta Manaus — Distrito Industrial",
  address:"Av. fictícia do Distrito Industrial, 1000 — Manaus/AM",
  responsible:"Engenharia e Segurança de Máquinas",
  note:"Empresa, pessoas, documentos, fotos e resultados inteiramente fictícios para demonstração."
};

export const demoMachines: DemoMachine[] = Array.from({length:100},(_,i) => {
  const t = types[i % types.length];
  const n = i + 1;
  const hrn = [18,36,72,144,240][i % 5];
  const risk = risks[i % risks.length];
  return {
    id:`demo-${n}`, tag:`MCH-${String(n).padStart(3,"0")}`,
    name:`${t.name} ${String(Math.floor(i / types.length)+1).padStart(2,"0")}`,
    type:t.type, sector:sectors[i % sectors.length], line:`Linha ${String((i % 6)+1).padStart(2,"0")}`,
    manufacturer:t.maker, model:t.model, serial:`DEMO-${2020+i%7}-${String(n).padStart(4,"0")}`,
    year:2018+i%9, power:t.power, voltage:i%3===0?"220/380 V":"380 V",
    status:statuses[i % statuses.length], stage:stages[i % stages.length],
    category:t.category, plr:["PLr a","PLr b","PLr c","PLr d"][i%4],
    hrn, risk, image:t.image,
    description:`Equipamento demonstrativo ${t.type.toLowerCase()} instalado no setor ${sectors[i%sectors.length]}, utilizado em processo de fabricação de componentes.`,
    safeguards:guards[i%guards.length], hazards:hazards[i%hazards.length], actions:actions[i%actions.length]
  };
});

export const demoCategories = [
  {name:"Linha de montagem",count:10,examples:"SMT, montagem automatizada"},
  {name:"Prensas e injetoras",count:20,examples:"Injetoras plásticas, prensas pneumáticas"},
  {name:"Usinagem",count:30,examples:"Tornos, fresadoras, furadeiras, serras"},
  {name:"Utilidades",count:10,examples:"Compressores, secadores, bombas"},
  {name:"Movimentação",count:10,examples:"Esteiras, talhas, mesas elevatórias"},
  {name:"Automação",count:10,examples:"Robôs, células robotizadas"},
  {name:"Apoio e processo",count:10,examples:"Misturadores, bancadas, equipamentos auxiliares"}
];

export const demoRisks = [
  {hazard:"Esmagamento",source:"Zona de fechamento / prensagem",severity:"Crítico",control:"Proteção móvel intertravada e validação da função"},
  {hazard:"Corte e amputação",source:"Ferramenta, lâmina ou eixo",severity:"Alto",control:"Proteção fixa/móvel e distância de segurança"},
  {hazard:"Aprisionamento",source:"Transmissões e partes rotativas",severity:"Alto",control:"Carenagem e intertravamento"},
  {hazard:"Choque elétrico",source:"Painel e circuitos",severity:"Alto",control:"Seccionamento bloqueável, aterramento e LOTO"},
  {hazard:"Partida inesperada",source:"Retorno de energia / falha de comando",severity:"Crítico",control:"Prevenção de partida inesperada e validação"},
  {hazard:"Energia acumulada",source:"Ar comprimido / gravidade",severity:"Alto",control:"Despressurização, retenção e verificação de energia zero"}
];

export const demoDeviceTypes = [
  {name:"Chave de intertravamento",purpose:"Detectar abertura de proteção móvel",standard:"ISO 14119"},
  {name:"Cortina de luz",purpose:"Detecção de acesso à zona perigosa",standard:"IEC 61496"},
  {name:"Relé / CLP de segurança",purpose:"Lógica de segurança monitorada",standard:"ISO 13849-1"},
  {name:"Válvula de segurança",purpose:"Desenergização pneumática segura",standard:"ISO 13849-1 / ISO 4414"},
  {name:"Botão de emergência",purpose:"Parada de emergência complementar",standard:"ISO 13850"},
  {name:"Scanner de área",purpose:"Detecção de presença em célula",standard:"IEC 61496"}
];
