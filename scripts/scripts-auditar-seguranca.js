const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const raiz=path.resolve(__dirname,'..');
const ler=p=>fs.readFileSync(path.join(raiz,p),'utf8');
const existe=p=>fs.existsSync(path.join(raiz,p));
const resultados=[];

function agente(nome,testes){
  const detalhes=[];let aprovado=true;
  for(const [rotulo,fn] of testes){
    let ok=false,motivo='';
    try{ok=Boolean(fn());}catch(e){motivo=e.message;}
    if(!ok)aprovado=false;
    detalhes.push({rotulo,ok,motivo});
  }
  resultados.push({agente:nome,aprovado,detalhes});
}

agente('Autenticação',[
  ['scrypt com salt',()=>/scryptSync/.test(ler('servidor/seguranca/seguranca-credenciais.js'))],
  ['troca obrigatória',()=>/forcar_troca_senha/.test(ler('servidor/rotas/autenticacao/autenticacao-servico.js'))],
  ['2FA TOTP',()=>existe('servidor/seguranca/seguranca-2fa.js')&&/2fa_necessario/.test(ler('servidor/rotas/autenticacao/autenticacao-rotas.js'))]
]);
agente('Sessão e cookies',[
  ['token salvo por hash',()=>/token_hash/.test(ler('servidor/rotas/autenticacao/autenticacao-servico.js'))&&/hashToken/.test(ler('servidor/seguranca/seguranca-credenciais.js'))],
  ['HttpOnly e SameSite',()=>/httpOnly:true/.test(ler('servidor/rotas/autenticacao/autenticacao-rotas.js'))&&/sameSite:'Lax'/.test(ler('servidor/rotas/autenticacao/autenticacao-rotas.js'))],
  ['expiração e revogação',()=>/expira_em/.test(ler('banco/migracoes/banco-migracao-001-inicial.sql'))&&/revogada_em/.test(ler('banco/migracoes/banco-migracao-001-inicial.sql'))]
]);
agente('Superfície Web',[
  ['Helmet/CSP',()=>/contentSecurityPolicy/.test(ler('servidor/seguranca/seguranca-cabecalhos.js'))],
  ['sem unsafe-inline/eval na CSP',()=>!/'unsafe-inline'|'unsafe-eval'/.test(ler('servidor/seguranca/seguranca-cabecalhos.js'))],
  ['CSRF em mutações privadas',()=>/exigirCsrf/.test(ler('servidor/rotas/configuracoes/configuracoes-rotas.js'))&&/exigirCsrf/.test(ler('servidor/rotas/autenticacao/autenticacao-rotas.js'))],
  ['limite corpo 100kb',()=>/100kb/.test(ler('servidor/servidor.js'))]
]);
agente('Segredos',[
  ['.env ignorado',()=>/^\.env$/m.test(ler('.gitignore'))],
  ['API cifrada AES-GCM',()=>/aes-256-gcm/.test(ler('servidor/seguranca/seguranca-credenciais.js'))],
  ['API não devolve segredo',()=>!/chave_cifrada/.test(ler('servidor/rotas/configuracoes/configuracoes-rotas.js'))],
  ['.env não rastreado',()=>{const r=cp.spawnSync('git',['ls-files','.env'],{cwd:raiz,encoding:'utf8'});return !String(r.stdout||'').trim();}]
]);
agente('Auditoria e abuso',[
  ['auditoria persistente',()=>/CREATE TABLE IF NOT EXISTS auditoria/.test(ler('banco/migracoes/banco-migracao-001-inicial.sql'))],
  ['bloqueio persistente',()=>/bloqueios_trafego/.test(ler('servidor/seguranca/seguranca-trafego-servico.js'))],
  ['progressão até 24h',()=>/1440/.test(ler('servidor/seguranca/seguranca-limite-trafego.js'))]
]);
agente('Hardening',[
  ['timeouts HTTP',()=>/headersTimeout=10000/.test(ler('servidor/servidor.js'))&&/requestTimeout=15000/.test(ler('servidor/servidor.js'))],
  ['porta não usa 3000',()=>/3000/.test(ler('servidor/servidor-porta.js'))&&/PROIBIDAS/.test(ler('servidor/servidor-porta.js'))],
  ['npm audit limpo',()=>{const npm=process.platform==='win32'?'npm.cmd':'npm';const r=cp.spawnSync(npm,['audit','--omit=dev','--json'],{cwd:raiz,encoding:'utf8'});const j=JSON.parse(r.stdout||'{}');return Number(j.metadata?.vulnerabilities?.total||0)===0;}]
]);

const relatorio={gerado_em:new Date().toISOString(),aprovado:resultados.every(x=>x.aprovado),resultados};
fs.writeFileSync(path.join(raiz,'docs','auditoria-seguranca.json'),JSON.stringify(relatorio,null,2)+'\n');
for(const r of resultados)console.log((r.aprovado?'PASS':'FAIL'),r.agente,r.detalhes.map(x=>x.rotulo+':'+(x.ok?'ok':'falha')).join(' | '));
if(!relatorio.aprovado)process.exit(1);
