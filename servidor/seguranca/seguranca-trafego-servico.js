const { obterBanco } = require('../../banco/banco.js');
const { minutosBloqueioPorInfracao, segundosAte } = require('./seguranca-limite-trafego.js');

const agoraIso = () => new Date().toISOString();

function obterEstado({grupo,chave}) {
  return obterBanco().prepare('SELECT * FROM bloqueios_trafego WHERE grupo=? AND chave=?').get(grupo,chave)
    || {grupo,chave,falhas:0,infracoes:0,janela_inicio:null,bloqueado_ate:null,atualizado_em:agoraIso()};
}

function consultarBloqueio({grupo,chave}) {
  const estado=obterEstado({grupo,chave});
  if(!estado.bloqueado_ate)return {bloqueado:false,retryAfter:0,estado};
  const retryAfter=segundosAte(estado.bloqueado_ate);
  if(retryAfter<=0){
    obterBanco().prepare('UPDATE bloqueios_trafego SET bloqueado_ate=NULL WHERE grupo=? AND chave=?').run(grupo,chave);
    return {bloqueado:false,retryAfter:0,estado:{...estado,bloqueado_ate:null}};
  }
  return {bloqueado:true,retryAfter,estado};
}

function registrarFalha({grupo,chave,limite,janelaMinutos}) {
  const banco=obterBanco(),agora=Date.now(),estado=obterEstado({grupo,chave});
  let falhas=Number(estado.falhas||0),infracoes=Number(estado.infracoes||0),janelaInicio=estado.janela_inicio;
  if(!janelaInicio || agora-Date.parse(janelaInicio)>janelaMinutos*60000){
    falhas=0;janelaInicio=new Date(agora).toISOString();
  }
  falhas++;
  let bloqueadoAte=estado.bloqueado_ate;
  if(falhas>=limite){
    infracoes = agora-Date.parse(estado.atualizado_em||0)>24*3600000 ? 1 : infracoes+1;
    bloqueadoAte=new Date(agora+minutosBloqueioPorInfracao(infracoes)*60000).toISOString();
    falhas=0;
    janelaInicio=new Date(agora).toISOString();
  }
  banco.prepare(`
    INSERT INTO bloqueios_trafego (chave,grupo,falhas,infracoes,janela_inicio,bloqueado_ate,atualizado_em)
    VALUES (?,?,?,?,?,?,?)
    ON CONFLICT(chave,grupo) DO UPDATE SET
      falhas=excluded.falhas,infracoes=excluded.infracoes,janela_inicio=excluded.janela_inicio,
      bloqueado_ate=excluded.bloqueado_ate,atualizado_em=excluded.atualizado_em
  `).run(chave,grupo,falhas,infracoes,janelaInicio,bloqueadoAte,new Date(agora).toISOString());
  const retryAfter=bloqueadoAte?segundosAte(bloqueadoAte,agora):0;
  return {bloqueado:retryAfter>0,retryAfter,falhas,infracoes,bloqueadoAte};
}

function limparFalhas({grupo,chave}) {
  obterBanco().prepare('UPDATE bloqueios_trafego SET falhas=0,janela_inicio=NULL,bloqueado_ate=NULL,atualizado_em=? WHERE grupo=? AND chave=?')
    .run(agoraIso(),grupo,chave);
}

module.exports={obterEstado,consultarBloqueio,registrarFalha,limparFalhas};
