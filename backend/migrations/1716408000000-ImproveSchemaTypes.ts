import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

/**
 * Migration: Melhoria do Schema — text → varchar com limites + constraints + seed admins.
 *
 * Regras:
 * - Usa USING col::new_type para conversão segura
 * - Mantém `text` para campos de conteúdo longo (perguntas.conteudo, customizacoes.conteudo)
 * - Adiciona CHECK constraints para enums (role, sexo, tipo)
 * - Adiciona CHECK >= 0 para pontuacao
 * - Seed de 2 admins
 */
export class ImproveSchemaTypes1716408000000 implements MigrationInterface {
  name = 'ImproveSchemaTypes1716408000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ═══════════════════════════════════════════════════════════════
    // 1. TABELA: usuarios
    // ═══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      ALTER TABLE usuarios
        ALTER COLUMN nome      TYPE varchar(150) USING nome::varchar(150),
        ALTER COLUMN email     TYPE varchar(320) USING email::varchar(320),
        ALTER COLUMN senha     TYPE varchar(255) USING senha::varchar(255),
        ALTER COLUMN telefone  TYPE varchar(20)  USING LEFT(COALESCE(telefone,''), 20),
        ALTER COLUMN uf        TYPE char(2)      USING LEFT(COALESCE(uf,''), 2),
        ALTER COLUMN cidade    TYPE varchar(100) USING LEFT(COALESCE(cidade,''), 100),
        ALTER COLUMN foto      TYPE varchar(500) USING LEFT(COALESCE(foto,''), 500),
        ALTER COLUMN turma     TYPE varchar(20)  USING LEFT(COALESCE(turma,''), 20)
    `);

    // Converte role e sexo para smallint
    await queryRunner.query(`
      ALTER TABLE usuarios
        ALTER COLUMN role TYPE smallint USING role::smallint,
        ALTER COLUMN sexo TYPE smallint USING sexo::smallint
    `);

    // CHECK constraints
    await queryRunner.query(`
      ALTER TABLE usuarios
        ADD CONSTRAINT chk_usuarios_role CHECK (role IN (1, 2, 3, 4)),
        ADD CONSTRAINT chk_usuarios_sexo CHECK (sexo IS NULL OR sexo IN (0, 1, 2)),
        ADD CONSTRAINT chk_usuarios_pontuacao CHECK (pontuacao >= 0)
    `);

    // ═══════════════════════════════════════════════════════════════
    // 2. TABELA: campus
    // ═══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      ALTER TABLE campus
        ALTER COLUMN nomecampus TYPE varchar(150) USING nomecampus::varchar(150)
    `);

    // ═══════════════════════════════════════════════════════════════
    // 3. TABELA: curso
    // ═══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      ALTER TABLE curso
        ALTER COLUMN nome   TYPE varchar(150) USING nome::varchar(150),
        ALTER COLUMN imagem TYPE varchar(500) USING LEFT(COALESCE(imagem,''), 500)
    `);

    // ═══════════════════════════════════════════════════════════════
    // 4. TABELA: categorias
    // ═══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      ALTER TABLE categorias
        ALTER COLUMN descricao TYPE varchar(200) USING LEFT(descricao, 200),
        ALTER COLUMN imagem    TYPE varchar(500) USING LEFT(COALESCE(imagem,''), 500)
    `);

    // ═══════════════════════════════════════════════════════════════
    // 5. TABELA: perguntas (conteudo mantém text, pathimage → varchar)
    // ═══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      ALTER TABLE perguntas
        ALTER COLUMN pathimage TYPE varchar(500) USING LEFT(COALESCE(pathimage,''), 500)
    `);

    // ═══════════════════════════════════════════════════════════════
    // 6. TABELA: alternativas
    // ═══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      ALTER TABLE alternativas
        ALTER COLUMN conteudo TYPE varchar(1000) USING LEFT(COALESCE(conteudo,''), 1000),
        ALTER COLUMN imagem   TYPE varchar(500)  USING LEFT(COALESCE(imagem,''), 500)
    `);

    // ═══════════════════════════════════════════════════════════════
    // 7. TABELA: quiz
    // ═══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      ALTER TABLE quiz
        ALTER COLUMN titulo TYPE varchar(200) USING LEFT(titulo, 200),
        ALTER COLUMN imagem TYPE varchar(500) USING LEFT(COALESCE(imagem,''), 500)
    `);

    // ═══════════════════════════════════════════════════════════════
    // 8. TABELA: logs
    // ═══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      ALTER TABLE logs
        ALTER COLUMN descricao TYPE varchar(500) USING LEFT(descricao, 500)
    `);

    // ═══════════════════════════════════════════════════════════════
    // 9. TABELA: customizacoes
    // ═══════════════════════════════════════════════════════════════
    await queryRunner.query(`
      ALTER TABLE customizacoes
        ALTER COLUMN tipo       TYPE varchar(30)  USING tipo::varchar(30),
        ALTER COLUMN titulo     TYPE varchar(200) USING LEFT(titulo, 200),
        ALTER COLUMN imagem_url TYPE varchar(500) USING LEFT(COALESCE(imagem_url,''), 500)
    `);

    await queryRunner.query(`
      ALTER TABLE customizacoes
        ADD CONSTRAINT chk_customizacoes_tipo CHECK (tipo IN ('cutscene', 'banner', 'dialogo'))
    `);

    // ═══════════════════════════════════════════════════════════════
    // 10. SEED: Campus padrão (se vazio)
    // ═══════════════════════════════════════════════════════════════
    const campusCount = await queryRunner.query(`SELECT COUNT(*) as cnt FROM campus`);
    if (parseInt(campusCount[0].cnt) === 0) {
      await queryRunner.query(`
        INSERT INTO campus (nomecampus) VALUES 
          ('Campus Sede'),
          ('Campus Avançado')
      `);
    }

    // ═══════════════════════════════════════════════════════════════
    // 11. SEED: Curso padrão (se vazio)
    // ═══════════════════════════════════════════════════════════════
    const cursoCount = await queryRunner.query(`SELECT COUNT(*) as cnt FROM curso`);
    if (parseInt(cursoCount[0].cnt) === 0) {
      await queryRunner.query(`
        INSERT INTO curso (nome, imagem) VALUES ('Geral', '')
      `);
    }

    // ═══════════════════════════════════════════════════════════════
    // 12. SEED: PerguntasNivel padrão (se vazio)
    // ═══════════════════════════════════════════════════════════════
    const nivelCount = await queryRunner.query(`SELECT COUNT(*) as cnt FROM perguntasnivel`);
    if (parseInt(nivelCount[0].cnt) === 0) {
      await queryRunner.query(`
        INSERT INTO perguntasnivel (nivel, pontuacao, tempo) VALUES 
          (1, 10, 30),
          (2, 20, 25),
          (3, 30, 20)
      `);
    }

    // ═══════════════════════════════════════════════════════════════
    // 13. SEED: Administradores
    // ═══════════════════════════════════════════════════════════════

    // Gera hashes bcrypt para as senhas dos admins
    const superAdminHash = await bcrypt.hash('Admin@2026!', 10);
    const adminHash      = await bcrypt.hash('Admin@2026!', 10);

    // Busca IDs de campus e curso para os admins
    const campusRows = await queryRunner.query(`SELECT id FROM campus LIMIT 1`);
    const cursoRows  = await queryRunner.query(`SELECT id FROM curso LIMIT 1`);
    const campusIdAdmin = campusRows[0]?.id || null;
    const cursoIdAdmin  = cursoRows[0]?.id || null;

    // Verifica se já existem admin seeds
    const existingSuperAdmin = await queryRunner.query(
      `SELECT id FROM usuarios WHERE email = 'superadmin@rotadoconhecimento.com'`
    );
    
    if (existingSuperAdmin.length === 0) {
      await queryRunner.query(`
        INSERT INTO usuarios (nome, email, senha, role, pontuacao, status, email_verified, campusid, cursoid)
        VALUES ($1, $2, $3, 1, 0, true, true, $4, $5)
      `, ['Super Admin', 'superadmin@rotadoconhecimento.com', superAdminHash, campusIdAdmin, cursoIdAdmin]);
    }

    const existingAdmin = await queryRunner.query(
      `SELECT id FROM usuarios WHERE email = 'admin@rotadoconhecimento.com'`
    );
    
    if (existingAdmin.length === 0) {
      await queryRunner.query(`
        INSERT INTO usuarios (nome, email, senha, role, pontuacao, status, email_verified, campusid, cursoid)
        VALUES ($1, $2, $3, 2, 0, true, true, $4, $5)
      `, ['Admin', 'admin@rotadoconhecimento.com', adminHash, campusIdAdmin, cursoIdAdmin]);
    }

    console.log('✅ Migration ImproveSchemaTypes aplicada com sucesso!');
    console.log('📋 Admins cadastrados:');
    console.log('   Super Admin: superadmin@rotadoconhecimento.com (senha: Admin@2026!)');
    console.log('   Admin:       admin@rotadoconhecimento.com      (senha: Admin@2026!)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove CHECK constraints
    await queryRunner.query(`
      ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS chk_usuarios_role;
      ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS chk_usuarios_sexo;
      ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS chk_usuarios_pontuacao;
      ALTER TABLE customizacoes DROP CONSTRAINT IF EXISTS chk_customizacoes_tipo;
    `);

    // Reverte tipos para text
    await queryRunner.query(`
      ALTER TABLE usuarios
        ALTER COLUMN nome TYPE text, ALTER COLUMN email TYPE text,
        ALTER COLUMN senha TYPE text, ALTER COLUMN telefone TYPE text,
        ALTER COLUMN uf TYPE text, ALTER COLUMN cidade TYPE text,
        ALTER COLUMN foto TYPE text, ALTER COLUMN turma TYPE varchar(50),
        ALTER COLUMN role TYPE integer USING role::integer,
        ALTER COLUMN sexo TYPE integer USING sexo::integer
    `);

    await queryRunner.query(`ALTER TABLE campus ALTER COLUMN nomecampus TYPE text`);
    await queryRunner.query(`ALTER TABLE curso ALTER COLUMN nome TYPE text, ALTER COLUMN imagem TYPE text`);
    await queryRunner.query(`ALTER TABLE categorias ALTER COLUMN descricao TYPE text, ALTER COLUMN imagem TYPE text`);
    await queryRunner.query(`ALTER TABLE perguntas ALTER COLUMN pathimage TYPE text`);
    await queryRunner.query(`ALTER TABLE alternativas ALTER COLUMN conteudo TYPE text, ALTER COLUMN imagem TYPE text`);
    await queryRunner.query(`ALTER TABLE quiz ALTER COLUMN titulo TYPE text, ALTER COLUMN imagem TYPE text`);
    await queryRunner.query(`ALTER TABLE logs ALTER COLUMN descricao TYPE text`);
    await queryRunner.query(`
      ALTER TABLE customizacoes
        ALTER COLUMN tipo TYPE text, ALTER COLUMN titulo TYPE text,
        ALTER COLUMN imagem_url TYPE text
    `);

    // Remove admin seeds
    await queryRunner.query(`DELETE FROM usuarios WHERE email IN ('superadmin@rotadoconhecimento.com', 'admin@rotadoconhecimento.com')`);
  }
}
