import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Reads a script file (relative to the project root) and executes it in the
 * window global scope, exactly as the app injects it via <script src>.
 * This makes top-level function declarations and implicit globals (userInfo,
 * todoList, journal) available on window.
 */
export function loadScript(relativePath) {
  const code = readFileSync(join(__dirname, '..', relativePath), 'utf8');
  window.eval(code);
}

/**
 * Creates a DOM element with the given id and appends it to the body.
 */
export function createEl(id, tag = 'div') {
  const el = document.createElement(tag);
  el.id = id;
  document.body.appendChild(el);
  return el;
}

/**
 * Builds the full DOM that the helper scripts reference.
 */
export function setupDom() {
  createEl('html-element');
  createEl('streak');
  createEl('me-points');
  createEl('version');
  createEl('todo-input');
  createEl('list-incomplete');
  createEl('list-complete');
  createEl('journal-input');
  createEl('journal-main-container');
  createEl('theme-button');
  createEl('theme-dropdown-container');
  createEl('onboarding');
  createEl('dashboard');
  createEl('enterButton');
}

/**
 * Resets the environment: clears localStorage and re-creates the DOM.
 */
export function resetEnv() {
  localStorage.clear();
  document.body.innerHTML = '';
  setupDom();
}

/**
 * Sets the app version text in the #version element.
 */
export function setVersion(version) {
  document.getElementById('version').textContent = version;
}

/**
 * Returns a Date string (ISO) offset by `days` from the current system time.
 */
export function isoDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/**
 * Returns the local date string (YYYY-MM-DD) for `days` offset from today.
 */
export function localDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toDateString();
}
