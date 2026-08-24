import { STORAGE_KEYS, loadJSON, saveJSON } from './jsonDataLoader';

const DEMO_ADMIN = { email: 'admin@beliora.com', password: 'beliora2026', name: 'Store Admin' };

function getUsers() {
  return loadJSON(STORAGE_KEYS.users, []);
}

export function signup({ name, email, password }) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }
  const user = { id: `usr-${Date.now()}`, name: name || 'Beliora Client', email, password, role: 'customer' };
  users.push(user);
  saveJSON(STORAGE_KEYS.users, users);
  const session = { userId: user.id, name: user.name, email: user.email, role: user.role };
  saveJSON(STORAGE_KEYS.session, session);
  return session;
}

export function login({ email, password }) {
  if (
    email.trim().toLowerCase() === DEMO_ADMIN.email &&
    password === DEMO_ADMIN.password
  ) {
    const session = { userId: 'admin', name: DEMO_ADMIN.name, email: DEMO_ADMIN.email, role: 'admin' };
    saveJSON(STORAGE_KEYS.session, session);
    return session;
  }
  const user = getUsers().find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  );
  if (!user) throw new Error('Invalid email or password.');
  const session = { userId: user.id, name: user.name, email: user.email, role: user.role };
  saveJSON(STORAGE_KEYS.session, session);
  return session;
}

export function getSession() {
  return loadJSON(STORAGE_KEYS.session, null);
}

export function logout() {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.session);
  } catch {
    /* noop */
  }
}

export function requestPasswordReset(email) {
  // Mock: always "succeeds" — a real backend would send the link.
  return { email, sent: true };
}
