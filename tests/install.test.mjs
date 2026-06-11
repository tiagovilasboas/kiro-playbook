/**
 * Testes unitários e de integração — bin/install.mjs
 *
 * Usa node:test (nativo Node >=18) e node:assert — zero dependências.
 *
 * Cobertura:
 *   - parseArgs: flags válidas, flag desconhecida, combinações
 *   - getDest: global (macOS/Linux/Windows home), workspace, tipos de item
 *   - backupFile: cria backup, retorna path, retorna null se não existe
 *   - install: dry-run, skip existente, update, backup automático, erros
 *   - manifest: todos os itens têm mcp_required:false e source existente
 *   - integração: backup/restore em diretório temporário real
 *
 * Sistemas testados: macOS, Linux, Windows (via simulação de paths)
 */

import { test, describe, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { join, sep } from 'node:path';
import { readFileSync, existsSync, mkdirSync, copyFileSync, rmSync, writeFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLAYBOOK_DIR = resolve(__dirname, '..');

// ─── Import das funções exportadas ───────────────────────────────────────────

const { parseArgs, getDest, backupFile, install, PLAYBOOK_DIR: PD } =
  await import('../bin/install.mjs');

// ─── Fixtures ────────────────────────────────────────────────────────────────

const STEERING_ITEM = {
  id: 'test-steering',
  name: 'Test Steering',
  type: 'steering',
  mcp_required: false,
  source: 'steerings/jira-support.md',
  destination: '~/.kiro/steering/jira-support.md',
};

const SKILL_ITEM = {
  id: 'test-skill',
  name: 'Test Skill',
  type: 'skill',
  mcp_required: false,
  source: 'skills/incident-triage.md',
  destination: '~/.kiro/skills/incident-triage.md',
};

const HOOK_ITEM = {
  id: 'test-hook',
  name: 'Test Hook',
  type: 'hook',
  mcp_required: false,
  source: 'hooks/dev/php-lint-on-save.kiro.hook',
  destination: '~/.kiro/hooks/php-lint-on-save.kiro.hook',
};

// ─── FS Mock factory ─────────────────────────────────────────────────────────

function makeFsMock({ sourcesExist = true, destsExist = false, copyFails = false, mkdirFails = false } = {}) {
  const copied = [];
  const dirs   = [];
  return {
    existsSync: (p) => {
      if (p.includes(PLAYBOOK_DIR)) return sourcesExist;
      return destsExist;
    },
    mkdirSync: (p, _opts) => {
      if (mkdirFails) throw new Error('EACCES: permission denied, mkdir');
      dirs.push(p);
    },
    copyFileSync: (src, dest) => {
      if (copyFails) throw new Error('EACCES: permission denied');
      copied.push({ src, dest });
    },
    _copied: copied,
    _dirs: dirs,
  };
}

// ─── parseArgs ────────────────────────────────────────────────────────────────

describe('parseArgs', () => {
  test('sem argumentos → defaults', () => {
    const f = parseArgs([]);
    assert.equal(f.dryRun, false);
    assert.equal(f.update, false);
    assert.equal(f.target, 'global');
    assert.equal(f.help, false);
  });

  test('--dry-run', () => assert.equal(parseArgs(['--dry-run']).dryRun, true));
  test('--update',  () => assert.equal(parseArgs(['--update']).update,  true));
  test('--help',    () => assert.equal(parseArgs(['--help']).help,      true));

  test('--target=workspace', () => assert.equal(parseArgs(['--target=workspace']).target, 'workspace'));
  test('--target=global',    () => assert.equal(parseArgs(['--target=global']).target,    'global'));

  test('combinação --dry-run --update', () => {
    const f = parseArgs(['--dry-run', '--update']);
    assert.equal(f.dryRun, true);
    assert.equal(f.update, true);
  });

  test('flag desconhecida lança erro com --help', () => {
    assert.throws(() => parseArgs(['--unknown']), /Opção desconhecida.*--help/s);
  });

  test('flag desconhecida menciona o nome da flag', () => {
    assert.throws(() => parseArgs(['--foo']), /--foo/);
  });
});

// ─── getDest — global ─────────────────────────────────────────────────────────

describe('getDest — target=global', () => {
  const flags = { target: 'global' };

  test('steering → ~/.kiro/steering/ (macOS/Linux)', () => {
    assert.equal(getDest(STEERING_ITEM, flags, { home: '/home/dev' }),
      '/home/dev/.kiro/steering/jira-support.md');
  });

  test('skill → ~/.kiro/skills/', () => {
    assert.equal(getDest(SKILL_ITEM, flags, { home: '/home/dev' }),
      '/home/dev/.kiro/skills/incident-triage.md');
  });

  test('hook → ~/.kiro/hooks/', () => {
    assert.equal(getDest(HOOK_ITEM, flags, { home: '/home/dev' }),
      '/home/dev/.kiro/hooks/php-lint-on-save.kiro.hook');
  });

  test('home Windows (C:\\Users\\dev) — substitui ~ corretamente', () => {
    const dest = getDest(STEERING_ITEM, flags, { home: 'C:\\Users\\dev' });
    assert.ok(dest.startsWith('C:\\Users\\dev'));
    assert.ok(dest.endsWith('jira-support.md'));
  });

  test('home com espaços no path funciona', () => {
    const dest = getDest(STEERING_ITEM, flags, { home: '/Users/João Silva' });
    assert.ok(dest.startsWith('/Users/João Silva'));
  });
});

// ─── getDest — workspace ─────────────────────────────────────────────────────

describe('getDest — target=workspace', () => {
  const flags = { target: 'workspace' };
  const cwd   = '/projects/seller-greenn-back';

  test('steering → .kiro/steering/ do CWD', () => {
    assert.equal(getDest(STEERING_ITEM, flags, { cwd }),
      join(cwd, '.kiro', 'steering', 'jira-support.md'));
  });

  test('skill → .kiro/skills/ do CWD', () => {
    assert.equal(getDest(SKILL_ITEM, flags, { cwd }),
      join(cwd, '.kiro', 'skills', 'incident-triage.md'));
  });

  test('hook → .kiro/hooks/ do CWD', () => {
    assert.equal(getDest(HOOK_ITEM, flags, { cwd }),
      join(cwd, '.kiro', 'hooks', 'php-lint-on-save.kiro.hook'));
  });

  test('usa só filename da source, não o subpath', () => {
    const item = { ...STEERING_ITEM, source: 'steerings/subdir/file.md' };
    assert.equal(getDest(item, flags, { cwd }),
      join(cwd, '.kiro', 'steering', 'file.md'));
  });
});

// ─── backupFile ───────────────────────────────────────────────────────────────

describe('backupFile', () => {
  test('retorna null se arquivo não existe', () => {
    const fsMock = { existsSync: () => false, mkdirSync: () => {}, copyFileSync: () => {} };
    assert.equal(backupFile('/fake/file.md', '/backup/dir', fsMock), null);
  });

  test('cria o diretório de backup', () => {
    const dirs = [];
    const fsMock = {
      existsSync: () => true,
      mkdirSync: (p, _) => dirs.push(p),
      copyFileSync: () => {},
    };
    backupFile('/some/file.md', '/backup/dir', fsMock);
    assert.ok(dirs.includes('/backup/dir'));
  });

  test('retorna o path do backup criado', () => {
    const fsMock = {
      existsSync: () => true,
      mkdirSync: () => {},
      copyFileSync: () => {},
    };
    const result = backupFile('/some/file.md', '/backup/dir', fsMock);
    assert.ok(result !== null);
    assert.ok(result.startsWith('/backup/dir'));
    assert.ok(result.endsWith('_file.md'));
  });

  test('nome do backup contém timestamp ISO', () => {
    const fsMock = {
      existsSync: () => true,
      mkdirSync: () => {},
      copyFileSync: () => {},
    };
    const result = backupFile('/some/jira-support.md', '/backup', fsMock);
    // Formato: 2026-06-05T10-30-00_jira-support.md
    assert.match(result, /\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_jira-support\.md$/);
  });

  test('copia o arquivo para o destino de backup', () => {
    const copies = [];
    const fsMock = {
      existsSync: () => true,
      mkdirSync: () => {},
      copyFileSync: (src, dest) => copies.push({ src, dest }),
    };
    backupFile('/source/file.md', '/backup/dir', fsMock);
    assert.equal(copies.length, 1);
    assert.equal(copies[0].src, '/source/file.md');
    assert.ok(copies[0].dest.includes('_file.md'));
  });

  test('funciona com path Windows (backslash)', () => {
    const fsMock = {
      existsSync: () => true,
      mkdirSync: () => {},
      copyFileSync: () => {},
    };
    const result = backupFile('C:\\Users\\dev\\.kiro\\steering\\file.md', 'C:\\backup', fsMock);
    assert.ok(result.endsWith('_file.md'));
  });
});

// ─── install — dry-run ────────────────────────────────────────────────────────

describe('install — dry-run', () => {
  test('não chama copyFileSync', () => {
    const fsMock = makeFsMock();
    install([STEERING_ITEM], { dryRun: true, update: false, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(fsMock._copied.length, 0);
  });

  test('não chama mkdirSync', () => {
    const fsMock = makeFsMock();
    install([STEERING_ITEM], { dryRun: true, update: false, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(fsMock._dirs.length, 0);
  });

  test('contabiliza como installed sem copiar', () => {
    const fsMock = makeFsMock();
    const r = install([STEERING_ITEM], { dryRun: true, update: false, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(r.installed, 1);
    assert.equal(r.errors, 0);
  });

  test('log status "install" para item novo', () => {
    const fsMock = makeFsMock({ destsExist: false });
    const r = install([STEERING_ITEM], { dryRun: true, update: false, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(r.log[0].status, 'install');
    assert.equal(r.log[0].dry, true);
  });

  test('log status "update" para item existente', () => {
    const fsMock = makeFsMock({ destsExist: true });
    const r = install([STEERING_ITEM], { dryRun: true, update: true, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(r.log[0].status, 'update');
  });

  test('dry-run não cria backup mesmo em --update', () => {
    const fsMock = makeFsMock({ destsExist: true });
    const r = install([STEERING_ITEM], { dryRun: true, update: true, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(r.backed_up, 0);
    assert.equal(fsMock._copied.length, 0);
  });
});

// ─── install — skip existente ─────────────────────────────────────────────────

describe('install — preserva existente', () => {
  test('item existente é skipped sem --update', () => {
    const fsMock = makeFsMock({ destsExist: true });
    const r = install([STEERING_ITEM], { dryRun: false, update: false, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(r.skipped, 1);
    assert.equal(r.installed, 0);
    assert.equal(fsMock._copied.length, 0);
  });

  test('item existente é sobrescrito com --update', () => {
    const fsMock = makeFsMock({ destsExist: true });
    const r = install([STEERING_ITEM], { dryRun: false, update: true, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(r.installed, 1);
    assert.equal(r.skipped, 0);
  });
});

// ─── install — backup automático ─────────────────────────────────────────────

describe('install — backup em --update', () => {
  test('cria backup ao sobrescrever item existente', () => {
    const fsMock = makeFsMock({ destsExist: true });
    const r = install([STEERING_ITEM], { dryRun: false, update: true, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', backupDir: '/tmp/bkp', fs: fsMock });
    assert.equal(r.backed_up, 1);
  });

  test('NÃO cria backup para item novo (não existia)', () => {
    const fsMock = makeFsMock({ destsExist: false });
    const r = install([STEERING_ITEM], { dryRun: false, update: true, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', backupDir: '/tmp/bkp', fs: fsMock });
    assert.equal(r.backed_up, 0);
  });

  test('NÃO cria backup sem --update', () => {
    const fsMock = makeFsMock({ destsExist: false });
    const r = install([STEERING_ITEM], { dryRun: false, update: false, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', backupDir: '/tmp/bkp', fs: fsMock });
    assert.equal(r.backed_up, 0);
  });

  test('falha no backup não impede a instalação', () => {
    let mkdirCallCount = 0;
    const fsMock = {
      existsSync: (p) => true, // source e dest existem
      mkdirSync: (p, opts) => {
        mkdirCallCount++;
        // Primeira chamada é do backupFile → falha
        if (mkdirCallCount === 1) throw new Error('ENOSPC: no space left');
        // Demais chamadas (install real) → passa
      },
      copyFileSync: () => {},
      _copied: [],
    };
    const r = install([STEERING_ITEM], { dryRun: false, update: true, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', backupDir: '/tmp/bkp', fs: fsMock });
    // Instalação continua mesmo que backup falhe
    assert.equal(r.installed, 1);
    // Aviso no log
    const warn = r.log.find(e => e.status === 'warn');
    assert.ok(warn, 'deve ter entrada warn no log');
    assert.ok(warn.reason.includes('backup falhou'));
  });

  test('múltiplos itens → um backup por item existente', () => {
    const fsMock = makeFsMock({ destsExist: true });
    const r = install(
      [STEERING_ITEM, SKILL_ITEM, HOOK_ITEM],
      { dryRun: false, update: true, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', backupDir: '/tmp/bkp', fs: fsMock }
    );
    assert.equal(r.backed_up, 3);
  });
});

// ─── install — source ausente ─────────────────────────────────────────────────

describe('install — source não encontrada', () => {
  test('contabiliza como error', () => {
    const fsMock = makeFsMock({ sourcesExist: false });
    const r = install([STEERING_ITEM], { dryRun: false, update: false, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(r.errors, 1);
    assert.equal(r.installed, 0);
  });

  test('log contém reason "source not found"', () => {
    const fsMock = makeFsMock({ sourcesExist: false });
    const r = install([STEERING_ITEM], { dryRun: false, update: false, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(r.log[0].reason, 'source not found');
  });

  test('não para nos outros itens da lista', () => {
    const fsMock = makeFsMock({ sourcesExist: false });
    const r = install([STEERING_ITEM, SKILL_ITEM, HOOK_ITEM],
      { dryRun: false, update: false, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(r.errors, 3);
    assert.equal(r.log.length, 3);
  });
});

// ─── install — erros de sistema ───────────────────────────────────────────────

describe('install — erros de sistema de arquivos', () => {
  test('EACCES na cópia é capturado e contabilizado como error', () => {
    const fsMock = makeFsMock({ copyFails: true });
    const r = install([STEERING_ITEM], { dryRun: false, update: false, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(r.errors, 1);
    assert.ok(r.log[0].reason.includes('permission denied'));
  });

  test('outros itens continuam após erro de cópia', () => {
    let copyCount = 0;
    const fsMock = {
      // sources existem no PLAYBOOK_DIR, dests não existem (novo install)
      existsSync: (p) => p.includes(PLAYBOOK_DIR),
      mkdirSync: () => {},
      copyFileSync: () => {
        copyCount++;
        if (copyCount === 1) throw new Error('EACCES: permission denied');
        // segundo item copia normalmente
      },
      _copied: [],
    };
    const r = install([STEERING_ITEM, SKILL_ITEM],
      { dryRun: false, update: false, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(r.log.length, 2);
    assert.equal(r.errors, 1);
    assert.equal(r.installed, 1);
  });

  test('mkdirSync falhando conta como error', () => {
    const fsMock = makeFsMock({ mkdirFails: true });
    const r = install([STEERING_ITEM], { dryRun: false, update: false, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(r.errors, 1);
  });
});

// ─── install — contadores ─────────────────────────────────────────────────────

describe('install — contadores', () => {
  test('todos instalados quando nenhum existe', () => {
    const fsMock = makeFsMock({ destsExist: false });
    const r = install([STEERING_ITEM, SKILL_ITEM, HOOK_ITEM],
      { dryRun: false, update: false, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(r.installed, 3);
    assert.equal(r.skipped, 0);
    assert.equal(r.errors, 0);
  });

  test('lista vazia → zeros em tudo', () => {
    const fsMock = makeFsMock();
    const r = install([], { dryRun: false, update: false, target: 'global' },
      { playbookDir: PLAYBOOK_DIR, home: '/home/dev', fs: fsMock });
    assert.equal(r.installed, 0);
    assert.equal(r.skipped, 0);
    assert.equal(r.errors, 0);
    assert.equal(r.backed_up, 0);
  });
});

// ─── manifest.json — integridade ─────────────────────────────────────────────

describe('manifest.json — integridade', () => {
  let manifest;
  before(() => {
    manifest = JSON.parse(readFileSync(join(PLAYBOOK_DIR, 'manifest.json'), 'utf-8'));
  });

  test('tem campo version', () => assert.ok(manifest.version));

  test('todos os itens têm mcp_required: false', () => {
    for (const item of manifest.items)
      assert.equal(item.mcp_required, false, `${item.id} deve ter mcp_required: false`);
  });

  test('todos os itens têm campos obrigatórios', () => {
    for (const item of manifest.items) {
      assert.ok(item.id,          `${item.id}: falta id`);
      assert.ok(item.name,        `${item.id}: falta name`);
      assert.ok(item.type,        `${item.id}: falta type`);
      assert.ok(item.source,      `${item.id}: falta source`);
      assert.ok(item.destination, `${item.id}: falta destination`);
    }
  });

  test('type é steering, skill ou hook', () => {
    const valid = new Set(['steering', 'skill', 'hook']);
    for (const item of manifest.items)
      assert.ok(valid.has(item.type), `${item.id}: type inválido: ${item.type}`);
  });

  test('destination começa com ~/', () => {
    for (const item of manifest.items)
      assert.ok(item.destination.startsWith('~/'), `${item.id}: destination deve começar com ~/`);
  });

  test('todos os source files existem no disco', () => {
    for (const item of manifest.items) {
      const fullPath = join(PLAYBOOK_DIR, item.source);
      assert.ok(existsSync(fullPath), `Arquivo não encontrado: ${item.source}`);
    }
  });

  test('sem IDs duplicados', () => {
    const ids = manifest.items.map(i => i.id);
    assert.equal(new Set(ids).size, ids.length, 'IDs duplicados encontrados');
  });

  test('steerings → ~/.kiro/steering/', () => {
    for (const item of manifest.items.filter(i => i.type === 'steering'))
      assert.ok(item.destination.includes('.kiro/steering/'), `${item.id}: destination errado`);
  });

  test('skills → ~/.kiro/skills/', () => {
    for (const item of manifest.items.filter(i => i.type === 'skill'))
      assert.ok(item.destination.includes('.kiro/skills/'), `${item.id}: destination errado`);
  });

  test('hooks → ~/.kiro/hooks/', () => {
    for (const item of manifest.items.filter(i => i.type === 'hook'))
      assert.ok(item.destination.includes('.kiro/hooks/'), `${item.id}: destination errado`);
  });
});

// ─── Cross-platform paths ─────────────────────────────────────────────────────

describe('getDest — cross-platform', () => {
  test('workspace usa path.join (separador nativo do OS)', () => {
    const dest = getDest(STEERING_ITEM, { target: 'workspace' },
      { cwd: join('C:', 'projects', 'repo') });
    assert.ok(dest.endsWith('jira-support.md'));
    assert.ok(dest.includes(sep) || dest.includes('/'));
  });

  test('global funciona em Linux (/home/dev)', () => {
    const dest = getDest(STEERING_ITEM, { target: 'global' }, { home: '/home/dev' });
    assert.ok(dest.startsWith('/home/dev'));
  });

  test('global funciona em macOS (/Users/tiago)', () => {
    const dest = getDest(STEERING_ITEM, { target: 'global' }, { home: '/Users/tiago' });
    assert.ok(dest.startsWith('/Users/tiago'));
  });

  test('global funciona em Windows (C:\\Users\\dev)', () => {
    const dest = getDest(STEERING_ITEM, { target: 'global' }, { home: 'C:\\Users\\dev' });
    assert.ok(dest.startsWith('C:\\Users\\dev'));
  });
});

// ─── Integração — backup/restore com filesystem real ─────────────────────────

describe('integração — backup e restore em tmpdir', () => {
  let tmpBase, kiroDir, backupDir;

  beforeEach(() => {
    // Cria estrutura temporária isolada para cada teste
    tmpBase   = join(tmpdir(), `kiro-test-${Date.now()}`);
    kiroDir   = join(tmpBase, '.kiro');
    backupDir = join(tmpBase, '.kiro', '.backup');
    mkdirSync(join(kiroDir, 'steering'), { recursive: true });
  });

  afterEach(() => {
    // Limpa tudo após cada teste — nunca deixa rastro
    try { rmSync(tmpBase, { recursive: true, force: true }); } catch {}
  });

  test('backup cria arquivo em backupDir', () => {
    const origFile = join(kiroDir, 'steering', 'test.md');
    writeFileSync(origFile, '# Original');

    const bkpPath = backupFile(origFile, backupDir);

    assert.ok(existsSync(bkpPath), 'arquivo de backup deve existir');
    assert.ok(bkpPath.endsWith('_test.md'), 'nome do backup deve terminar com _test.md');
  });

  test('backup preserva conteúdo original', () => {
    const origFile = join(kiroDir, 'steering', 'test.md');
    writeFileSync(origFile, '# Conteúdo original');

    const bkpPath = backupFile(origFile, backupDir);
    const content = readFileSync(bkpPath, 'utf-8');

    assert.equal(content, '# Conteúdo original');
  });

  test('install --update faz backup antes de sobrescrever', () => {
    // Arrange: arquivo já instalado com conteúdo "antigo"
    const destFile = join(kiroDir, 'steering', 'jira-support.md');
    writeFileSync(destFile, '# Versão antiga customizada');

    const fsMock = {
      existsSync: (p) => {
        if (p.includes(PLAYBOOK_DIR)) return true; // sources existem no repo
        return existsSync(p);                       // dests: verifica no disco real
      },
      mkdirSync: (p, opts) => mkdirSync(p, opts ?? {}),
      copyFileSync: (src, dest) => copyFileSync(src, dest),
    };

    install([STEERING_ITEM], { dryRun: false, update: true, target: 'global' }, {
      playbookDir: PLAYBOOK_DIR,
      home: tmpBase,
      backupDir,
      fs: fsMock,
    });

    // Arquivo novo foi instalado
    assert.ok(existsSync(destFile));
    const newContent = readFileSync(destFile, 'utf-8');
    assert.ok(newContent.includes('VSUS') || newContent.includes('Jira'), 'deve ter conteúdo real do playbook');

    // Backup foi criado com conteúdo antigo
    const backupFiles = readdirSync(backupDir);
    assert.equal(backupFiles.length, 1, 'deve ter exatamente 1 backup');
    const bkpContent = readFileSync(join(backupDir, backupFiles[0]), 'utf-8');
    assert.equal(bkpContent, '# Versão antiga customizada');
  });

  test('install sem --update NÃO faz backup nem sobrescreve', () => {
    const destFile = join(kiroDir, 'steering', 'jira-support.md');
    writeFileSync(destFile, '# Versão customizada do dev');

    const fsMock = {
      existsSync: (p) => {
        if (p.includes(PLAYBOOK_DIR)) return true;
        return existsSync(p);
      },
      mkdirSync: (p, opts) => mkdirSync(p, opts ?? {}),
      copyFileSync: (src, dest) => copyFileSync(src, dest),
    };

    const r = install([STEERING_ITEM], { dryRun: false, update: false, target: 'global' }, {
      playbookDir: PLAYBOOK_DIR,
      home: tmpBase,
      backupDir,
      fs: fsMock,
    });

    assert.equal(r.skipped, 1);
    assert.equal(r.backed_up, 0);

    // Conteúdo original preservado
    const content = readFileSync(destFile, 'utf-8');
    assert.equal(content, '# Versão customizada do dev');

    // Nenhum backup criado
    assert.ok(!existsSync(backupDir), 'diretório de backup não deve existir');
  });
});
