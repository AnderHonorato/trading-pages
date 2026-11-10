const fs=require('node:fs');const path=require('node:path');const cp=require('node:child_process');
const raiz=path.resolve(__dirname,'..');
const arquivos=[
'evolucao-v11.js','frontend/compartilhado/orbital-fisica.js','frontend/compartilhado/reciclagem-agentes.js','frontend/paginas/painel/painel.js',
'servidor/servidor.js','servidor/servidor-porta.js','servidor/servidor-instancia.js','servidor/bootstrap-admin.js','servidor/observabilidade/observabilidade.js','servidor/seguranca/seguranca-credenciais.js',
'servidor/rotas/autenticacao/autenticacao-rotas.js','servidor/rotas/configuracoes/configuracoes-rotas.js',
'scripts/scripts-gerar-demo-publica.js','scripts/scripts-testar-demo-publica.js'
];
for(const arquivo of arquivos){const r=cp.spawnSync(process.execPath,['--check',path.join(raiz,arquivo)],{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);}
const htmlBruto=fs.readFileSync(path.join(raiz,'agentes-orbitais.html'),'utf8');
const html=htmlBruto.replace(/<!--[\s\S]*?-->/g,'');
if(/<script\s*>/i.test(html))throw new Error('Script inline encontrado no painel');
if(/<style\s*>/i.test(html))throw new Error('Style inline encontrado no painel');
if(/\sstyle\s*=|\sonclick\s*=/i.test(html))throw new Error('Atributo inline inseguro encontrado no painel');
console.log('Verificação estrutural concluída.');
