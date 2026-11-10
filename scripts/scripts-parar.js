const fs=require('node:fs');const path=require('node:path');
const raiz=path.resolve(__dirname,'..'),arquivo=path.join(raiz,'.execucao','servidor.pid');
if(!fs.existsSync(arquivo)){console.log('Servidor não está registrado como ativo.');process.exit(0);}
const pid=Number(fs.readFileSync(arquivo,'utf8').trim());
if(!Number.isInteger(pid)||pid<=0)throw new Error('PID inválido');
try{process.kill(pid,'SIGTERM');console.log('Encerramento solicitado ao PID',pid);}catch(e){if(e.code!=='ESRCH')throw e;console.log('Processo já estava encerrado.');}
try{fs.unlinkSync(arquivo);}catch{}
