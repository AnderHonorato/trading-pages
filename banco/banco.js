const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

let instancia = null;

function caminhoBanco() {
  const configurado = process.env.BANCO_CAMINHO || './banco/dados/trading.sqlite';
  return path.resolve(process.cwd(), configurado);
}

function obterBanco() {
  if (instancia) return instancia;
  const caminho = caminhoBanco();
  fs.mkdirSync(path.dirname(caminho), { recursive: true });
  instancia = new Database(caminho);
  instancia.pragma('journal_mode = WAL');
  instancia.pragma('foreign_keys = ON');
  instancia.pragma('busy_timeout = 5000');
  return instancia;
}

function fecharBanco() {
  if (instancia) {
    instancia.close();
    instancia = null;
  }
}

module.exports = { obterBanco, fecharBanco, caminhoBanco };
