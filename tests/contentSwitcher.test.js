import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { loadScript, resetEnv, setVersion } from './setup.js';

/**
 * contentSwitcher.js is an ES module with no exports — it only attaches
 * window.changeContent and runs top-level side effects on import:
 *   - creates a fresh #dashboard div
 *   - changeContent(previousSection || "welcome")  (async, fetches HTML)
 *   - sendNotification("Even more new themes have been added!")
 *   - if mindshed-userInfo exists: setTimeout(..., 7000) notification
 *
 * So each test gets a fresh module instance via vi.resetModules() + dynamic
 * import(), with fetch stubbed and fake timers active for the 7s notification.
 */

const SECTION_STUBS = {
  welcome: '<div id="welcome-stub">Welcome content</div>',
  todoList: '<div id="todoList-stub">Todo content</div>',
  journal: '<div id="journal-stub">Journal content</div>',
  settings: '<div id="settings-stub">Settings content</div>',
};

function buildDom() {
  document.body.innerHTML = '';
  const main = document.createElement('div');
  main.id = 'main-container';
  document.body.appendChild(main);

  const notification = document.createElement('div');
  notification.id = 'notification-container';
  document.body.appendChild(notification);

  for (const name of ['welcome', 'todoList', 'journal', 'settings']) {
    const btn = document.createElement('button');
    btn.id = `${name}-button`;
    document.body.appendChild(btn);
  }
}

async function loadContentSwitcher() {
  vi.resetModules();
  const mod = await import('../scripts/contentSwitcher.js');
  // Flush the microtask queue so the module's async init changeContent(...)
  // (fetch -> text -> innerHTML -> addHelpers -> setActiveButton) has settled.
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  return mod;
}

describe('contentSwitcher.js', () => {
  beforeEach(async () => {
    resetEnv();
    setVersion('0.5.0');
    buildDom();
    vi.useFakeTimers();
    // Stub fetch for the dashboard modules (they fetch scripts/content/html/*.html).
    vi.stubGlobal('fetch', (url) => {
      // Dashboard modules fetch scripts/content/html/<name>.html.
      const name = url.split('/').pop().replace(/\.html$/, '');
      const stub = SECTION_STUBS[name] || '<div id="unknown-stub">Unknown content</div>';
      return Promise.resolve({ text: () => Promise.resolve(stub) });
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  // ---------------------------------------------------------------------------
  // changeContent
  // ---------------------------------------------------------------------------
  describe('changeContent', () => {
    it('loads welcome content by default on module init (no previous section stored)', async () => {
      await loadContentSwitcher();

      const dashboard = document.getElementById('dashboard');
      expect(dashboard).not.toBeNull();
      expect(dashboard.parentElement.id).toBe('main-container');
      expect(dashboard.innerHTML).toContain('Welcome content');
      expect(window.changeContent).toBeDefined();
      expect(localStorage.getItem('mindshed-previousContentSection')).toBe('welcome');
    });

    it('restores the previously used section when one is stored', async () => {
      localStorage.setItem('mindshed-previousContentSection', 'journal');
      await loadContentSwitcher();

      const dashboard = document.getElementById('dashboard');
      expect(dashboard.innerHTML).toContain('Journal content');
      expect(localStorage.getItem('mindshed-previousContentSection')).toBe('journal');
    });

    it('switches to each section and saves it as the previous section', async () => {
      await loadContentSwitcher();

      await window.changeContent('todoList');
      expect(document.getElementById('dashboard').innerHTML).toContain('Todo content');
      expect(localStorage.getItem('mindshed-previousContentSection')).toBe('todoList');

      await window.changeContent('settings');
      expect(document.getElementById('dashboard').innerHTML).toContain('Settings content');
      expect(localStorage.getItem('mindshed-previousContentSection')).toBe('settings');

      await window.changeContent('journal');
      expect(document.getElementById('dashboard').innerHTML).toContain('Journal content');
      expect(localStorage.getItem('mindshed-previousContentSection')).toBe('journal');
    });

    it('shows an error message for an unknown section name', async () => {
      await loadContentSwitcher();

      await window.changeContent('bogus');

      expect(document.getElementById('dashboard').innerHTML).toContain('There was an error getting the content.');
      // currentContent is not updated, so the previous section is not re-saved.
      expect(localStorage.getItem('mindshed-previousContentSection')).toBe('welcome');
    });

    it('does nothing when the same section is requested twice', async () => {
      await loadContentSwitcher();

      const before = document.getElementById('dashboard').innerHTML;
      await window.changeContent('welcome');

      expect(document.getElementById('dashboard').innerHTML).toBe(before);
      expect(localStorage.getItem('mindshed-previousContentSection')).toBe('welcome');
    });

    it('replaces the old dashboard content when switching sections', async () => {
      await loadContentSwitcher();
      await window.changeContent('todoList');
      expect(document.getElementById('dashboard').innerHTML).not.toContain('Welcome content');
      expect(document.getElementById('dashboard').innerHTML).toContain('Todo content');
    });
  });

  // ---------------------------------------------------------------------------
  // setActiveButton (heartbeat class on <content>-button)
  // ---------------------------------------------------------------------------
  describe('setActiveButton', () => {
    it('adds the heartbeat class to the active section button', async () => {
      await loadContentSwitcher();
      expect(document.getElementById('welcome-button').classList.contains('heartbeat')).toBe(true);
      expect(document.getElementById('todoList-button').classList.contains('heartbeat')).toBe(false);
    });

    it('moves the heartbeat class when switching sections', async () => {
      await loadContentSwitcher();
      await window.changeContent('journal');

      expect(document.getElementById('welcome-button').classList.contains('heartbeat')).toBe(false);
      expect(document.getElementById('journal-button').classList.contains('heartbeat')).toBe(true);
    });

    it('does not duplicate the heartbeat class on the active button', async () => {
      await loadContentSwitcher();
      await window.changeContent('settings');
      await window.changeContent('settings');

      expect(document.getElementById('settings-button').classList.contains('heartbeat')).toBe(true);
      // classList.toggle is idempotent here; the class is present exactly once.
      expect(document.querySelectorAll('button.heartbeat')).toHaveLength(1);
    });
  });

  // ---------------------------------------------------------------------------
  // savePreviouslyUsedContentSection
  // ---------------------------------------------------------------------------
  describe('savePreviouslyUsedContentSection', () => {
    it('persists the current section to mindshed-previousContentSection', async () => {
      await loadContentSwitcher();
      await window.changeContent('todoList');

      expect(localStorage.getItem('mindshed-previousContentSection')).toBe('todoList');
    });
  });

  // ---------------------------------------------------------------------------
  // sendNotification / toggleNotificationDisplay
  // ---------------------------------------------------------------------------
  describe('sendNotification', () => {
    it('shows the initial notification on module init', async () => {
      await loadContentSwitcher();

      const container = document.getElementById('notification-container');
      expect(container.querySelector('p').textContent).toBe('Even more new themes have been added!');
      expect(container.classList.contains('slide-in-top')).toBe(true);
    });

    it('renders a message and a button when both are provided', async () => {
      await loadContentSwitcher();

      // window.sendNotification is not exported, but the module's own
      // sendNotification is the same function used by the 7s init notification.
      // We can only observe it via the init path, so instead verify the button
      // path by triggering the userInfo-gated notification with fake timers.
      localStorage.setItem('mindshed-userInfo', JSON.stringify({ points: 0 }));
      await loadContentSwitcher();

      vi.advanceTimersByTime(7000);

      const container = document.getElementById('notification-container');
      const btn = container.querySelector('button');
      expect(btn).not.toBeNull();
      expect(btn.textContent).toBe('Go to Journal');
      expect(btn.classList.contains('btn-secondary')).toBe(true);
    });

    it('hides the notification after 5 seconds', async () => {
      await loadContentSwitcher();

      const container = document.getElementById('notification-container');
      expect(container.classList.contains('slide-in-top')).toBe(true);

      vi.advanceTimersByTime(5000);

      expect(container.classList.contains('slide-in-top')).toBe(false);
      expect(container.classList.contains('slide-out-top')).toBe(true);
    });

    it('navigates to the target section when the notification button is clicked', async () => {
      localStorage.setItem('mindshed-userInfo', JSON.stringify({ points: 0 }));
      await loadContentSwitcher();

      vi.advanceTimersByTime(7000);

      const btn = document.getElementById('notification-container').querySelector('button');
      expect(btn).not.toBeNull();
      btn.click();

      // changeContent is async (fetches content), so await the microtask queue.
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(document.getElementById('dashboard').innerHTML).toContain('Journal content');
      expect(document.getElementById('journal-button').classList.contains('heartbeat')).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // toggleNotificationDisplay (via the 5s auto-hide)
  // ---------------------------------------------------------------------------
  describe('toggleNotificationDisplay', () => {
    it('hides the notification after 5 seconds and re-shows on next toggle', async () => {
      await loadContentSwitcher();

      const container = document.getElementById('notification-container');
      expect(container.classList.contains('slide-in-top')).toBe(true);

      vi.advanceTimersByTime(5000);
      expect(container.classList.contains('slide-in-top')).toBe(false);
      expect(container.classList.contains('slide-out-top')).toBe(true);

      // A second toggle (e.g., from a new sendNotification) re-shows it.
      localStorage.setItem('mindshed-userInfo', JSON.stringify({ points: 0 }));
      await loadContentSwitcher();
      vi.advanceTimersByTime(7000);

      expect(container.classList.contains('slide-in-top')).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Module init side effects
  // ---------------------------------------------------------------------------
  describe('module init', () => {
    it('creates a fresh #dashboard div on import', async () => {
      await loadContentSwitcher();
      expect(document.getElementById('dashboard')).not.toBeNull();
      expect(document.getElementById('dashboard').parentElement.id).toBe('main-container');
    });

    it('does not show the userInfo-gated notification when no user info exists', async () => {
      await loadContentSwitcher();

      const container = document.getElementById('notification-container');
      expect(container.querySelector('p').textContent).toBe('Even more new themes have been added!');

      vi.advanceTimersByTime(7000);
      // No second notification should appear (no mindshed-userInfo).
      expect(container.querySelector('button')).toBeNull();
    });

    it('shows the userInfo-gated notification after 7 seconds when user info exists', async () => {
      localStorage.setItem('mindshed-userInfo', JSON.stringify({ points: 0 }));
      await loadContentSwitcher();

      vi.advanceTimersByTime(7000);

      const container = document.getElementById('notification-container');
      expect(container.querySelector('button')).not.toBeNull();
      expect(container.querySelector('button').textContent).toBe('Go to Journal');
    });
  });
});
