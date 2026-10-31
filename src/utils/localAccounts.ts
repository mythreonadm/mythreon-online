export interface LocalAccount {
  id: string;
  email: string;
}

interface StoredAccount extends LocalAccount {
  salt: string;
  passwordHash: string;
}

const ACCOUNTS_KEY = "mythreon_accounts_v1";
const SESSION_KEY = "mythreon_account_session_v1";
const PBKDF2_ITERATIONS = 160_000;

function readAccounts(): StoredAccount[] {
  try {
    const value = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{1,2}/g)?.map(pair => Number.parseInt(pair, 16)) || []);
}

async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
  if (!window.crypto?.subtle) throw new Error("Seu navegador não oferece criptografia segura para criar a conta.");
  const key = await window.crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const saltBuffer = new ArrayBuffer(salt.byteLength);
  new Uint8Array(saltBuffer).set(salt);
  const bits = await window.crypto.subtle.deriveBits({ name: "PBKDF2", salt: saltBuffer, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" }, key, 256);
  return toHex(new Uint8Array(bits));
}

function openSession(account: LocalAccount) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(account));
  return account;
}

export function getLocalAccountSession(): LocalAccount | null {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return session?.id && session?.email ? session as LocalAccount : null;
  } catch {
    return null;
  }
}

export function closeLocalAccountSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function createLocalAccount(emailInput: string, password: string): Promise<LocalAccount> {
  const email = emailInput.trim().toLowerCase();
  if (readAccounts().some(account => account.email === email)) throw new Error("Já existe uma conta com este e-mail neste navegador.");
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const account: StoredAccount = {
    id: window.crypto.randomUUID(),
    email,
    salt: toHex(salt),
    passwordHash: await hashPassword(password, salt),
  };
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...readAccounts(), account]));
  return openSession({ id: account.id, email: account.email });
}

export async function signInLocalAccount(emailInput: string, password: string): Promise<LocalAccount> {
  const email = emailInput.trim().toLowerCase();
  const account = readAccounts().find(candidate => candidate.email === email);
  if (!account || await hashPassword(password, fromHex(account.salt)) !== account.passwordHash) {
    throw new Error("Conta ou senha incorretos.");
  }
  return openSession({ id: account.id, email: account.email });
}
