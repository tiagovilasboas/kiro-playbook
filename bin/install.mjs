#!/usr/bin/env node
/**
 * kiro-playbook v3 — Instalador MVP
 *
 * Instala apenas artefatos sem dependência de MCP.
 * Fluxos com MCP (Jira, Grafana, Azure DevOps) → docs/prompts/
 *
 * Usa apenas módulos nativos do Node.js — zero dependências externas.
 *
 * Sistemas operacionais suportados:
 *   - macOS (primário)
 *   - Linux / Windows + WSL2 (secundário)
 *
 * Backup automático:
 *   - Em modo --update: arquivos existentes são copiados para ~/.kiro/.backup/
 *     antes de serem sobrescritos, com timestamp no nome.
 *   - Restaurar: copie o arquivo de ~/.kiro/.backup/ de volta para o destino original.
 */

import { readFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const PLAYBOOK_DIR = resolve(__dirname, '..');

// ─── Parse Args ───────────────────────────────────────────────────────────────

export function parseArgs(argv) {
  const flags = { dryRun: false, update: false, target: 'global', help: false };
  for (const arg of argv) {
    if (arg === '--help')             { flags.help = true; continue; }
    if (arg === '--dry-run')          { flags.dryRun = true; continue; }
    if (arg === '--update')           { flags.update = true; continue; }
    if (arg === '--target=workspace') { flags.target = 'workspace'; continue; }
    if (arg === '--target=global')    { flags.target = 'global'; continue; }
    throw new Error(`Opção desconhecida: ${arg}. Use --help`);
  }
  return flags;
}

// ─── Destino ─────────────────────────────────────────────────────────────────

export function getDest(item, flags, { home, cwd } = {}) {
  const HOME = home ?? homedir();
  const CWD  = cwd  ?? process.cwd();

  if (flags.target === 'workspace') {
    const file = item.source.split('/').pop();
    if (item.type === 'hook')  return join(CWD, '.kiro', 'hooks', file);
    if (item.type === 'skill') return join(CWD, '.kiro', 'skills', file);
    return join(CWD, '.kiro', 'steering', file);
  }
  return item.destination.replace(/^~/, HOME);
}

// ─── Backup ──────────────────────────────────────────────────────────────────

/**
 * Cria backup de um arquivo existente antes de sobrescrevê-lo.
 * Destino: {backupDir}/{timestamp}_{filename}
 *
 * @param {string} filePath - caminho do arquivo a ser backupeado
 * @param {string} backupDir - diretório onde o backup será salvo
 * @param {object} fsImpl - implementação de fs (real ou mock)
 * @returns {string|null} caminho do backup criado, ou null se arquivo não existia
 */
export function backupFile(filePath, backupDir, fsImpl = { existsSync, mkdirSync, copyFileSync }) {
  if (!fsImpl.existsSync(filePath)) return null;

  fsImpl.mkdirSync(backupDir, { recursive: true });

  const filename  = filePath.split('/').pop().split('\\').pop(); // cross-platform
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupPath = join(backupDir, `${timestamp}_${filename}`);

  fsImpl.copyFileSync(filePath, backupPath);
  return backupPath;
}

// ─── Install ─────────────────────────────────────────────────────────────────

export function install(items, flags, { playbookDir, home, cwd, backupDir, fs: fsMock } = {}) {
  const dir    = playbookDir ?? PLAYBOOK_DIR;
  const HOME   = home ?? homedir();
  const fsImpl = fsMock ?? { existsSync, mkdirSync, copyFileSync };

  // Diretório de backup: ~/.kiro/.backup/ (ou .kiro/.backup/ no workspace)
  const defaultBackupDir = flags.target === 'workspace'
    ? join(cwd ?? process.cwd(), '.kiro', '.backup')
    : join(HOME, '.kiro', '.backup');
  const bkpDir = backupDir ?? defaultBackupDir;

  const results = { installed: 0, skipped: 0, errors: 0, backed_up: 0, log: [] };

  for (const item of items) {
    const src    = join(dir, item.source);
    const dest   = getDest(item, flags, { home: HOME, cwd });
    const exists = fsImpl.existsSync(dest);

    if (!fsImpl.existsSync(src)) {
      results.log.push({ status: 'error', name: item.name, reason: 'source not found' });
      results.errors++;
      continue;
    }

    if (exists && !flags.update) {
      results.log.push({ status: 'skipped', name: item.name });
      results.skipped++;
      continue;
    }

    if (flags.dryRun) {
      results.log.push({ status: exists ? 'update' : 'install', name: item.name, dry: true });
      results.installed++;
      continue;
    }

    // Backup antes de sobrescrever (só em --update com arquivo existente)
    if (exists && flags.update) {
      try {
        const bkpPath = backupFile(dest, bkpDir, fsImpl);
        if (bkpPath) results.backed_up++;
      } catch (err) {
        // Falha no backup não impede a instalação — avisa e continua
        results.log.push({ status: 'warn', name: item.name, reason: `backup falhou: ${err.message}` });
      }
    }

    try {
      fsImpl.mkdirSync(dirname(dest), { recursive: true });
      fsImpl.copyFileSync(src, dest);
      results.log.push({ status: exists ? 'update' : 'install', name: item.name });
      results.installed++;
    } catch (err) {
      results.log.push({ status: 'error', name: item.name, reason: err.message });
      results.errors++;
    }
  }

  return results;
}

// ─── Main (só executa quando chamado diretamente) ─────────────────────────────

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isMain) {
  const HOME = homedir();
  const CWD  = process.cwd();

  const manifest = JSON.parse(readFileSync(join(PLAYBOOK_DIR, 'manifest.json'), 'utf-8'));

  let flags;
  try {
    flags = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  if (flags.help) {
    console.log(`
kiro-playbook v${manifest.version}

Instala steerings, skills e hooks do time N3.
Só instala o que funciona sem MCP — prompts estão em docs/prompts/.

Sistemas suportados: macOS · Linux · Windows (WSL2)

Uso: node bin/install.mjs [FLAGS]

  --update            Atualiza itens já instalados (faz backup automático antes)
  --dry-run           Simula sem modificar arquivos
  --target=workspace  Instala em .kiro/ do projeto atual
  --target=global     Instala em ~/.kiro/ (padrão)
  --help              Esta mensagem

Backup:
  Em --update, arquivos existentes são copiados para ~/.kiro/.backup/
  antes de serem sobrescritos. Para restaurar, copie o arquivo de volta.

Exemplos:
  node bin/install.mjs
  node bin/install.mjs --dry-run
  node bin/install.mjs --update
  node bin/install.mjs --target=workspace
`);
    process.exit(0);
  }

  const dest_label = flags.target === 'global' ? '~/.kiro/' : '.kiro/ (workspace)';
  console.log(`\n📦 kiro-playbook v${manifest.version} → ${dest_label}`);
  if (flags.dryRun) console.log('   [dry-run] nenhum arquivo será modificado\n');
  else console.log('');

  const results = install(manifest.items, flags, { playbookDir: PLAYBOOK_DIR, home: HOME, cwd: CWD });

  const icons = { install: '✓', update: '~', error: '✗', warn: '⚠', skipped: null };
  for (const entry of results.log) {
    if (entry.status === 'skipped') continue;
    const icon = entry.dry ? (entry.status === 'update' ? '~' : '+') : icons[entry.status];
    const suffix = entry.reason ? ` — ${entry.reason}` : '';
    console.log(`  ${icon} ${entry.name}${suffix}`);
  }

  const steerings = manifest.items.filter(i => i.type === 'steering').length;
  const skills    = manifest.items.filter(i => i.type === 'skill').length;
  const hooks     = manifest.items.filter(i => i.type === 'hook').length;

  console.log(`\n  ${results.installed} instalado(s) · ${results.skipped} já existente(s) · ${results.errors} erro(s)`);

  if (results.backed_up > 0) {
    const bkpDir = flags.target === 'global'
      ? join(HOME, '.kiro', '.backup')
      : join(CWD, '.kiro', '.backup');
    console.log(`  💾 ${results.backed_up} backup(s) em: ${bkpDir}`);
  }
  if (flags.dryRun) console.log('  ⚠ Dry-run — nenhum arquivo modificado');
  if (results.skipped > 0 && !flags.update) console.log('  ℹ Itens existentes foram preservados. Use --update para atualizá-los.');
  if (flags.target === 'global' && manifest.items.some(i => i.type === 'hook')) {
    console.log('  💡 Hooks globais não aparecem no painel. Use --target=workspace para ver no Kiro.');
  }

  console.log(`
  📋 Instalado: ${steerings} steerings · ${skills} skills · ${hooks} hooks
  📝 Prompts disponíveis em: docs/prompts/
     (investigate-incident, close-task, deliver-story, triage-incident, generate-pr, war-room-status, health-check)
`);
}
