require('dotenv').config();
const crypto=require('node:crypto');
const autenticacao=require('../servidor/rotas/autenticacao/autenticacao-servico.js');
const dois=require('../servidor/seguranca/seguranca-2fa.js');
const {obterBanco,fecharBanco}=require('../banco/banco.js');
const origem=process.env.ORIGEM_SMOKE||'http://127.0.0.1:4312';

function cookies(headers){
  const arr=headers.getSetCookie?headers.getSetCookie():[headers.get('set-cookie')];
  return arr.filter(Boolean).map(x=>x.split(';')[0]).join('; ');
}
async function csrfAnon(){
  const r=await fetch(origem+'/api/autenticacao/iniciar');
  const j=await r.json();return {csrf:j.csrf,cookie:cookies(r.headers)};
}
async function entrar(usuario,senha,codigo2fa=''){
  const a=await csrfAnon();
  const r=await fetch(origem+'/api/autenticacao/entrar',{method:'POST',headers:{'content-type':'application/json','x-csrf-token':a.csrf,'cookie':a.cookie},body:JSON.stringify({usuario,senha,codigo2fa})});
  return {r,j:await r.json(),cookie:cookies(r.headers)};
}
(async()=>{
  const usuario='smoke2_'+Date.now(),senha=crypto.randomBytes(16).toString('base64url')+'!7Q';
  const u=autenticacao.criarAdmin({usuario,senha});
  obterBanco().prepare('UPDATE usuarios SET forcar_troca_senha=0 WHERE id=?').run(u.id);
  try{
    const l1=await entrar(usuario,senha);
    if(l1.r.status!==200)throw new Error('login inicial falhou');
    const prep=await fetch(origem+'/api/autenticacao/2fa/preparar',{method:'POST',headers:{cookie:l1.cookie,'x-csrf-token':l1.j.csrf}});
    const pj=await prep.json();if(prep.status!==200||!pj.segredo)throw new Error('preparo 2fa falhou');
    const codigo=dois.gerarTotp(pj.segredo);
    const ativ=await fetch(origem+'/api/autenticacao/2fa/ativar',{method:'POST',headers:{cookie:l1.cookie,'content-type':'application/json','x-csrf-token':l1.j.csrf},body:JSON.stringify({codigo})});
    const aj=await ativ.json();if(ativ.status!==200||!aj.ativo||aj.codigosRecuperacao?.length!==8)throw new Error('ativação 2fa falhou');
    await fetch(origem+'/api/autenticacao/sair',{method:'POST',headers:{cookie:l1.cookie,'x-csrf-token':l1.j.csrf}});
    const sem=await entrar(usuario,senha);
    console.log('login_sem_2fa',sem.r.status,sem.j.erro);
    if(sem.r.status!==401||sem.j.erro!=='2fa_necessario')throw new Error('2fa não foi exigido');
    const com=await entrar(usuario,senha,dois.gerarTotp(pj.segredo));
    console.log('login_com_2fa',com.r.status,com.j.ok===true);
    if(com.r.status!==200||!com.j.ok)throw new Error('2fa correto não autenticou');
    console.log('SMOKE_2FA_OK');
  }finally{
    obterBanco().prepare('DELETE FROM usuarios WHERE usuario=?').run(usuario);fecharBanco();
  }
})().catch(e=>{console.error(e);try{fecharBanco();}catch{}process.exit(1);});
