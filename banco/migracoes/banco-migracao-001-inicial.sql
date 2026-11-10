CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  papel TEXT NOT NULL DEFAULT 'admin',
  forcar_troca_senha INTEGER NOT NULL DEFAULT 1,
  ativo INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT NOT NULL,
  atualizado_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  csrf_token TEXT NOT NULL,
  ip TEXT,
  agente_usuario TEXT,
  criado_em TEXT NOT NULL,
  expira_em TEXT NOT NULL,
  revogada_em TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS configuracoes_api (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  provedor TEXT NOT NULL,
  chave_cifrada TEXT NOT NULL,
  iv TEXT NOT NULL,
  tag TEXT NOT NULL,
  modelo TEXT,
  ativo INTEGER NOT NULL DEFAULT 1,
  atualizado_em TEXT NOT NULL,
  UNIQUE(usuario_id, provedor),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bloqueios_trafego (
  chave TEXT NOT NULL,
  grupo TEXT NOT NULL,
  falhas INTEGER NOT NULL DEFAULT 0,
  infracoes INTEGER NOT NULL DEFAULT 0,
  janela_inicio TEXT,
  bloqueado_ate TEXT,
  atualizado_em TEXT NOT NULL,
  PRIMARY KEY (chave, grupo)
);

CREATE TABLE IF NOT EXISTS auditoria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  acao TEXT NOT NULL,
  ip TEXT,
  detalhes TEXT,
  criado_em TEXT NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_sessoes_usuario ON sessoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_expira ON sessoes(expira_em);
CREATE INDEX IF NOT EXISTS idx_auditoria_criado ON auditoria(criado_em);
