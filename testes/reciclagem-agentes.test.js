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

test('sorteio de substituto avalia cada reserva uma única vez',()=>{
  const reservas=[
    {nome:'A',papel:'Risco'},
    {nome:'B',papel:'Risco'},
    {nome:'C',papel:'Risco'}
  ];
  const valores=[0.1,0.9,0.4];
  let chamadas=0;
  const escolhido=reciclagem.escolherSubstituto(reservas,'Risco',()=>{
    assert.ok(chamadas<valores.length,'não deve sortear durante comparações');
    return valores[chamadas++];
  });
  assert.equal(chamadas,reservas.length);
  assert.equal(escolhido.nome,'B');
  assert.deepEqual(reservas.map(a=>a.nome),['A','B','C']);
});

test('substituição preserva prioridade de afinidade mesmo com sorteio adverso',()=>{
  const reservas=[{nome:'Compatível',papel:'Risco'},{nome:'Outro',papel:'Liquidez'}];
  const escolhido=reciclagem.escolherSubstituto(reservas,'Risco',(()=>{let n=0;return ()=>n++===0?0:1;})());
  assert.equal(escolhido.nome,'Compatível');
});
