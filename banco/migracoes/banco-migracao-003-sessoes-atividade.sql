ALTER TABLE sessoes ADD COLUMN ultimo_acesso_em TEXT;
UPDATE sessoes SET ultimo_acesso_em=criado_em WHERE ultimo_acesso_em IS NULL;
CREATE INDEX IF NOT EXISTS idx_sessoes_atividade ON sessoes(usuario_id, ultimo_acesso_em);
