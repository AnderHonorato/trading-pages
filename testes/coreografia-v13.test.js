const test=require('node:test');
const assert=require('node:assert/strict');
const Coreografia=require('../frontend/compartilhado/orbital-coreografia.js');
const Conversa=require('../frontend/compartilhado/conversa-contextual.js');

test('distribui agentes da mesma órbita em fases regulares preservando ordem',()=>{
  const itens=[
    {id:'a',angulo:0.1},{id:'b',angulo:1.1},{id:'c',angulo:2.2},{id:'d',angulo:5.6}
  ];
  const alvos=Coreografia.distribuirFases(itens);
  assert.equal(Object.keys(alvos).length,4);
  const vals=Object.values(alvos).sort((a,b)=>a-b);
  const difs=vals.map((v,i)=>{
    const prox=vals[(i+1)%vals.length]+(i===vals.length-1?Math.PI*2:0);
    return prox-v;
  });
  for(const d of difs)assert.ok(Math.abs(d-Math.PI/2)<0.0001);
});

test('interpolação angular usa caminho curto e não teletransporta',()=>{
  const atual=6.20, alvo=0.08;
  const novo=Coreografia.interpolarAngulo(atual,alvo,0.1,4);
  assert.ok(novo>atual || novo<0.2);
  const delta=Math.abs(Coreografia.deltaAngular(novo,atual));
  assert.ok(delta<0.5);
});

test('repulsão suave aumenta distância sem explodir deslocamento',()=>{
  const itens=[
    {id:'a',x:100,y:100,raio:20,ox:0,oy:0},
    {id:'b',x:110,y:100,raio:20,ox:0,oy:0}
  ];
  const antes=Math.hypot(itens[1].x-itens[0].x,itens[1].y-itens[0].y);
  const saida=Coreografia.resolverSeparacao(itens,{dt:1/60,margem:8,maxDeslocamento:18});
  const depois=Math.hypot(
    (itens[1].x+saida.b.x)-(itens[0].x+saida.a.x),
    (itens[1].y+saida.b.y)-(itens[0].y+saida.a.y)
  );
  assert.ok(depois>antes);
  assert.ok(Math.abs(saida.a.x)<=18 && Math.abs(saida.b.x)<=18);
});

test('fala contextual respeita papel, evento e não é genérica',()=>{
  const fala=Conversa.criarFala({
    agente:{nome:'Kelly',papel:'analista',status:'cruzando sinais'},
    contexto:'sinal_confirmado',
    dados:{alvo:'BTC',confianca:82}
  });
  assert.match(fala,/sinal|BTC|82/i);
  assert.equal(fala.includes('pronto!'),false);
});

test('fila limita concorrência e aplica cooldown por agente',()=>{
  const fila=Conversa.criarFila({maxAtivas:2,cooldownMs:5000});
  const agora=10000;
  assert.equal(fila.solicitar({agenteId:'a',texto:'um',prioridade:2,agora}),true);
  assert.equal(fila.solicitar({agenteId:'b',texto:'dois',prioridade:1,agora}),true);
  assert.equal(fila.solicitar({agenteId:'c',texto:'três',prioridade:0,agora}),false);
  fila.concluir('a',agora+1000);
  assert.equal(fila.solicitar({agenteId:'a',texto:'de novo',prioridade:3,agora:agora+1500}),false);
  assert.equal(fila.solicitar({agenteId:'c',texto:'agora vai',prioridade:1,agora:agora+1500}),true);
});
