const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const DEFAULT_MANIFEST_URL = 'https://mythreon-online.vercel.app/downloads/latest.json';
const MAX_MANIFEST_BYTES = 256 * 1024;
const MAX_UPDATE_BYTES = 300 * 1024 * 1024;

function versionParts(value) {
  return String(value ?? '0').replace(/^v/i, '').split('.').slice(0, 3).map(part => {
    const match = part.match(/^(\d+)/);
    return match ? Number(match[1]) : 0;
  }).concat([0, 0, 0]).slice(0, 3);
}

function compareVersions(left, right) {
  const a = versionParts(left);
  const b = versionParts(right);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] > b[index] ? 1 : -1;
  }
  return 0;
}

function isNewerVersion(candidate, current) {
  return compareVersions(candidate, current) > 0;
}

function validateManifest(manifest) {
  if (!manifest || typeof manifest !== 'object') throw new Error('Manifesto de atualização inválido.');
  if (!/^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(String(manifest.version ?? ''))) throw new Error('Versão do manifesto inválida.');
  const url = new URL(String(manifest.url ?? ''));
  if (url.protocol !== 'https:') throw new Error('O pacote de atualização precisa usar HTTPS.');
  if (!/^[a-f0-9]{64}$/i.test(String(manifest.sha256 ?? ''))) throw new Error('SHA-256 ausente ou inválido no manifesto.');
  if (manifest.platform && manifest.platform !== 'win32') throw new Error('Plataforma de atualização não suportada.');
  if (manifest.arch && manifest.arch !== 'x64') throw new Error('Arquitetura de atualização não suportada.');
  return {
    version: String(manifest.version),
    url: url.toString(),
    sha256: String(manifest.sha256).toLowerCase(),
    notes: String(manifest.notes ?? ''),
    mandatory: Boolean(manifest.mandatory),
    platform: manifest.platform ?? 'win32',
    arch: manifest.arch ?? 'x64',
  };
}

async function readResponseBytes(url, maxBytes, timeoutMs = 20_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal });
    if (!response.ok) throw new Error(`Servidor de atualização respondeu ${response.status}.`);
    const contentLength = Number(response.headers.get('content-length') ?? 0);
    if (contentLength > maxBytes) throw new Error('Arquivo de atualização excede o limite permitido.');
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > maxBytes) throw new Error('Arquivo de atualização excede o limite permitido.');
    return buffer;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchManifest(manifestUrl = DEFAULT_MANIFEST_URL) {
  const url = new URL(manifestUrl);
  if (url.protocol !== 'https:') throw new Error('A URL do manifesto precisa usar HTTPS.');
  const payload = await readResponseBytes(url.toString(), MAX_MANIFEST_BYTES);
  return validateManifest(JSON.parse(payload.toString('utf8')));
}

async function checkForUpdate({ manifestUrl = DEFAULT_MANIFEST_URL, currentVersion }) {
  const manifest = await fetchManifest(manifestUrl);
  return {
    available: isNewerVersion(manifest.version, currentVersion),
    currentVersion: String(currentVersion),
    manifest,
  };
}

async function stageUpdate({ manifestUrl = DEFAULT_MANIFEST_URL, currentVersion, userDataPath }) {
  const result = await checkForUpdate({ manifestUrl, currentVersion });
  if (!result.available) return { ...result, downloaded: false };

  const updatesDir = path.join(userDataPath, 'updates');
  await fs.mkdir(updatesDir, { recursive: true });
  const fileName = `Mythreon-Online-${result.manifest.version}-Windows-x64.exe`;
  const temporaryPath = path.join(updatesDir, `${fileName}.download`);
  const downloadPath = path.join(updatesDir, fileName);
  const payload = await readResponseBytes(result.manifest.url, MAX_UPDATE_BYTES, 120_000);
  const digest = crypto.createHash('sha256').update(payload).digest('hex');
  if (digest !== result.manifest.sha256) throw new Error('A assinatura SHA-256 do pacote não confere. Download cancelado.');
  await fs.writeFile(temporaryPath, payload, { flag: 'w' });
  await fs.rename(temporaryPath, downloadPath);
  return { ...result, downloaded: true, downloadPath };
}

module.exports = {
  DEFAULT_MANIFEST_URL,
  compareVersions,
  isNewerVersion,
  validateManifest,
  fetchManifest,
  checkForUpdate,
  stageUpdate,
};
