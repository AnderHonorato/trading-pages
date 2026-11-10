const test=require('node:test');
const assert=require('node:assert/strict');
const reciclagem=require('../frontend/compartilhado/reciclagem-agentes.js');

test('relevância favorece atividade, contribuição, evolução e saúde',()=>{
  const base={entradaEm:0,ultimaAcao:95,contribJanela:8,acertosJanela:5,rankNovo:4,contributo:12,vida:90,vidaMax:100};
  const boa=reciclagem.calcularRelevancia(base,100);
  const ruim=reciclagem.calcularRelevancia({...base,ultimaAcao:20,contribJanela:0,acertosJanela:0,rankNovo:1,contributo:0,vida:25},100);
  assert.ok(boa>ruim);
  assert.ok(boa<=100&&boa>=0);
  assert.ok(ruim<=100&&ruim>=0);
});

test('escolhe o agente elegível de menor relevância',()=>{
  const agentes=[
    {nome:'A',relevancia:82},
    {nome:'B',relevancia:17},
    {nome:'C',relevancia:46}
  ];
  assert.equal(reciclagem.escolherMenorRelevancia(agentes).nome,'B');
});

test('afinidade de papel prioriza reserva compatível',()=>{
  const reservas=[
    {nome:'X',papel:'Liquidez'},
    {nome:'Y',papel:'Risco / Stop'},
    {nome:'Z',papel:'Risco defensivo'}
  ];
  const escolhido=reciclagem.escolherSubstituto(reservas,'Risco / Stop',()=>0);
  assert.equal(escolhido.nome,'Y');
});

test('afinidade ignora acentos e caixa',()=>{
  assert.ok(reciclagem.afinidadePapel({papel:'Execução Rápida'},'execucao')>0);
});