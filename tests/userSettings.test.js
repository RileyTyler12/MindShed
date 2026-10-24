import { describe, it, beforeEach, expect } from 'vitest';
import { loadScript, resetEnv, setVersion, isoDate } from './setup.js';

// Load the helper scripts in the same order the app does.
// userSettings.js first (defines awardPointsAndUpdateStreak).
beforeEach(() => {
  resetEnv();
  setVersion('0.5.0');
  loadScript('scripts/content/helpers/userSettings.js');
});

describe('userSettings.js', () => {
  // Tests the core logic for awarding points and maintaining streaks based on action dates
  describe('awardPointsAndUpdateStreak', () => {
    it('awards points and starts a streak on the first action', () => {
      const info = window.userInfo;
      expect(info.points).toBe(0);
      expect(info.streakDays).toBe(0);
      expect(info.lastActionDate).toBeNull();

      window.awardPointsAndUpdateStreak(10);

      expect(info.points).toBe(10);
      expect(info.streakDays).toBe(1);
      expect(info.lastActionDate).not.toBeNull();

      // The saved localStorage value should reflect the new state.
      const saved = JSON.parse(localStorage.getItem('mindshed-userInfo'));
      expect(saved.points).toBe(10);
      expect(saved.streakDays).toBe(1);
    });

    it('increments the streak when the last action was exactly yesterday', () => {
      const info = window.userInfo;
      info.streakDays = 3;
      info.lastActionDate = isoDate(-1); // yesterday

      window.awardPointsAndUpdateStreak(10);

      expect(info.streakDays).toBe(4);
      expect(info.points).toBe(10);
    });

    it('resets the streak to 1 when there is a gap of more than one day', () => {
      const info = window.userInfo;
      info.streakDays = 3;
      info.lastActionDate = isoDate(-2); // two days ago

      window.awardPointsAndUpdateStreak(10);

      expect(info.streakDays).toBe(1);
      expect(info.points).toBe(10);
    });

    it('does not change the streak when points is 0 (no action)', () => {
      const info = window.userInfo;
      info.streakDays = 3;
      info.lastActionDate = isoDate(-1); // yesterday

      window.awardPointsAndUpdateStreak(0);

      // points === 0 means no streak increment and no lastActionDate update.
      expect(info.streakDays).toBe(3);
      expect(info.points).toBe(0);
    });
  });

  // Verifies that the app version is updated in localStorage without losing existing data
  describe('migrateDataIfNeeded', () => {
    it('updates the stored version when it differs from the current version', () => {
      // On load the script auto-runs migrateDataIfNeeded('0.5.0'),
      // so the stored version starts as '0.5.0'.
      expect(localStorage.getItem('mindshed-version')).toBe('0.5.0');

      window.migrateDataIfNeeded('0.6.0');

      expect(localStorage.getItem('mindshed-version')).toBe('0.6.0');
    });

    it('does not change the stored version when it already matches', () => {
      localStorage.setItem('mindshed-version', '0.5.0');

      window.migrateDataIfNeeded('0.5.0');

      expect(localStorage.getItem('mindshed-version')).toBe('0.5.0');
    });
  });

  // Ensures theme classes are correctly applied to the DOM and persisted in localStorage
  describe('setTheme', () => {
    it('applies the theme class and saves it to localStorage', () => {
      const el = document.getElementById('html-element');
      expect(el.classList.contains('theme-light')).toBe(false);

      window.setTheme('light');

      expect(el.classList.contains('theme-light')).toBe(true);
      expect(localStorage.getItem('mindshed-theme')).toBe('light');
    });

    it('removes other theme classes when applying a new theme', () => {
      const el = document.getElementById('html-element');
      el.classList.add('theme-retro');

      window.setTheme('mint');

      expect(el.classList.contains('theme-retro')).toBe(false);
      expect(el.classList.contains('theme-mint')).toBe(true);
    });

    it('removes all theme classes when applying dark (the default)', () => {
      const el = document.getElementById('html-element');
      el.classList.add('theme-fire');

      window.setTheme('dark');

      expect(el.classList.contains('theme-fire')).toBe(false);
      expect(localStorage.getItem('mindshed-theme')).toBe('dark');
    });
  });
});
