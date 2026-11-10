ALTER TABLE usuarios ADD COLUMN totp_cifrado TEXT;
ALTER TABLE usuarios ADD COLUMN totp_iv TEXT;
ALTER TABLE usuarios ADD COLUMN totp_tag TEXT;
ALTER TABLE usuarios ADD COLUMN totp_ativo INTEGER NOT NULL DEFAULT 0;
ALTER TABLE usuarios ADD COLUMN recuperacao_hashes TEXT;
