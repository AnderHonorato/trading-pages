const fs = require('node:fs');
const path = require('node:path');
const { obterBanco } = require('./banco.js');

function migrar() {
  const banco = obterBanco();
  banco.exec('CREATE TABLE IF NOT EXISTS migracoes_aplicadas (arquivo TEXT PRIMARY KEY, aplicado_em TEXT NOT NULL)');
  const pasta = path.join(__dirname, 'migracoes');
  const arquivos = fs.readdirSync(pasta).filter(nome => nome.endsWith('.sql')).sort();
  const aplicadas=[];
  for (const arquivo of arquivos) {
    const existe=banco.prepare('SELECT 1 FROM migracoes_aplicadas WHERE arquivo=?').get(arquivo);
    if(existe)continue;
    const sql=fs.readFileSync(path.join(pasta, arquivo), 'utf8');
    const transacao=banco.transaction(()=>{
      banco.exec(sql);
      banco.prepare('INSERT INTO migracoes_aplicadas (arquivo,aplicado_em) VALUES (?,?)').run(arquivo,new Date().toISOString());
    });
    transacao();
    aplicadas.push(arquivo);
  }
  return aplicadas;
}

if (require.main === module) {
  const arquivos = migrar();
  console.log(arquivos.length?'Migrações aplicadas: '+arquivos.join(', '):'Banco já estava atualizado.');
}

module.exports = { migrar };
