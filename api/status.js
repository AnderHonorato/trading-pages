// API sem ordens financeiras: somente estado do ambiente demonstrativo.
module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'GET') return res.status(405).json({ok:false,erro:'Método não permitido'});
  return res.status(200).json({ok:true,versao:'9.0',modo:'demonstracao',conectadoCorretora:false,
    agentes:20,temas:20,orquestracao:'simulação visual',observacao:'Sem operações reais de mercado.',hora:new Date().toISOString()});
};
