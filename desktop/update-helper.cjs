const fs = require('node:fs/promises');
const crypto = require('node:crypto');
const path = require('node:path');
const { spawn } = require('node:child_process');

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function sha256File(filePath) {
  const hash = crypto.createHash('sha256');
  const handle = await fs.open(filePath, 'r');
  try {
    for await (const chunk of handle.createReadStream()) hash.update(chunk);
  } finally {
    await handle.close();
  }
  return hash.digest('hex');
}

async function waitForProcessExit(pid, timeoutMs = 45_000) {
  if (!Number.isInteger(pid) || pid <= 0 || pid === process.pid) return;
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      process.kill(pid, 0);
      await delay(250);
    } catch (error) {
      if (error?.code === 'EPERM') { await delay(250); continue; }
      return;
    }
  }
  throw new Error('O Mythreon Online não encerrou a tempo para atualizar.');
}

async function runUpdaterHelper(payload) {
  const targetPath = path.resolve(String(payload?.targetPath ?? ''));
  const packagePath = path.resolve(String(payload?.packagePath ?? ''));
  const expectedHash = String(payload?.sha256 ?? '').toLowerCase();
  if (!targetPath.toLowerCase().endsWith('.exe') || !packagePath.toLowerCase().endsWith('.exe')) throw new Error('Pacote ou destino de atualização inválido.');
  if (!/^[a-f0-9]{64}$/.test(expectedHash)) throw new Error('Assinatura da atualização inválida.');
  await waitForProcessExit(Number(payload?.pid));
  if ((await sha256File(packagePath)) !== expectedHash) throw new Error('A assinatura do pacote mudou antes da instalação.');

  const lockPath = `${targetPath}.update.lock`;
  const backupPath = `${targetPath}.previous.exe`;
  const temporaryPath = `${targetPath}.new.exe`;
  let movedOriginal = false;
  let lockHandle;
  try {
    lockHandle = await fs.open(lockPath, 'wx');
    await fs.copyFile(packagePath, temporaryPath);
    await fs.rm(backupPath, { force: true });
    await fs.rename(targetPath, backupPath);
    movedOriginal = true;
    await fs.rename(temporaryPath, targetPath);
    const child = spawn(targetPath, [], { detached: true, stdio: 'ignore', windowsHide: false });
    child.unref();
    return { ok: true, targetPath, backupPath };
  } catch (error) {
    await fs.rm(temporaryPath, { force: true }).catch(() => {});
    if (movedOriginal) {
      await fs.rm(targetPath, { force: true }).catch(() => {});
      await fs.rename(backupPath, targetPath).catch(() => {});
    }
    throw error;
  } finally {
    await lockHandle?.close().catch(() => {});
    await fs.rm(lockPath, { force: true }).catch(() => {});
  }
}

module.exports = { sha256File, waitForProcessExit, runUpdaterHelper };
