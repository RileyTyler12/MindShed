import { describe, it, beforeEach, expect } from 'vitest';
import { loadScript, resetEnv, setVersion } from './setup.js';

// Load in app order: userSettings first (defines awardPointsAndUpdateStreak),
// then journal.
beforeEach(() => {
  resetEnv();
  setVersion('0.5.0');
  loadScript('scripts/content/helpers/userSettings.js');
  loadScript('scripts/content/helpers/journal.js');
});

describe('journal.js', () => {
  // Verifies that adding a journal entry awards 25 points and persists the entry
  it('adds a journal entry, awards 25 points, and saves it', () => {
    document.getElementById('journal-input').value = 'Today was a good day';

    window.addJournalItem();

    expect(window.journal.itemStrings).toContain('Today was a good day');
    expect(window.journal.itemStats).toContain('incomplete');
    expect(window.journal.itemDates).toHaveLength(1);
    expect(window.userInfo.points).toBe(25);

    const saved = JSON.parse(localStorage.getItem('mindshed-journal'));
    expect(saved.itemStrings).toContain('Today was a good day');
  });

  // Ensures that empty journal inputs are ignored
  it('ignores an empty journal input', () => {
    document.getElementById('journal-input').value = '';

    window.addJournalItem();

    expect(window.journal.itemStrings).toHaveLength(0);
    expect(window.userInfo.points).toBe(0);
  });

  // Verifies that the journal entry is correctly rendered in the DOM
  it('renders the entry into the journal main container', () => {
    document.getElementById('journal-input').value = 'First entry';
    window.addJournalItem();

    const text = document
      .getElementById('journal-main-container')
      .querySelector('.listItem-text');

    expect(text).not.toBeNull();
    expect(text.textContent).toBe('First entry');
  });

  // Verifies that journal entries can be removed from the list
  it('deletes a journal entry', () => {
    document.getElementById('journal-input').value = 'Delete me';
    window.addJournalItem();

    document.querySelector('.listItem-button').click();

    expect(window.journal.itemStrings).toHaveLength(0);
    expect(window.journal.itemDates).toHaveLength(0);
  });
});
