// Feed stateless de observações fictícias para demonstrar a integração front/back.
// Nenhum dado é sinal financeiro ou recomendação de investimento.
module.exports = function handler(req,res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.method!=='GET')return res.status(405).json({ok:false,erro:'Método não permitido'});
  const agentes=['KELLY','SPOTTER','TAKER','CLOSER','PRIOR','EDGE','LUNA','RUBI','AXO'];
  const ciclo=Math.floor(Date.now()/30000);
  return res.status(200).json({ok:true,demonstracao:true,versao:'9.0',eventos:[
    {id:'demo-'+ciclo,tipo:'observacao',agente:agentes[ciclo%agentes.length],horario:new Date(ciclo*30000).toISOString(),descricao:'Pulso visual demonstrativo — sem ordem real.'}
  ]});
};
