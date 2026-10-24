import { describe, it, beforeEach, expect } from 'vitest';
import { loadScript, resetEnv, setVersion } from './setup.js';

// Load in app order: userSettings first (defines awardPointsAndUpdateStreak),
// then todoList.
beforeEach(() => {
  resetEnv();
  setVersion('0.5.0');
  loadScript('scripts/content/helpers/userSettings.js');
  loadScript('scripts/content/helpers/todoList.js');
});

describe('todoList.js', () => {
  it('adds a new to-do item to the list and saves it', () => {
    document.getElementById('todo-input').value = 'Buy groceries';

    window.addTodoListItem();

    expect(window.todoList.itemStrings).toContain('Buy groceries');
    expect(window.todoList.itemStats).toContain('incomplete');

    // Saved to localStorage under the mindshed-todoList key.
    const saved = JSON.parse(localStorage.getItem('mindshed-todoList'));
    expect(saved.itemStrings).toContain('Buy groceries');
  });

  it('ignores an empty to-do input', () => {
    document.getElementById('todo-input').value = '';

    window.addTodoListItem();

    expect(window.todoList.itemStrings).toHaveLength(0);
  });

  it('marks a to-do complete, awards 10 points, and saves', () => {
    document.getElementById('todo-input').value = 'Write report';
    window.addTodoListItem();

    // Click the "Mark" button on the incomplete item.
    document.getElementById('item-0').click();

    expect(window.todoList.itemStats[0]).toBe('complete');
    expect(window.userInfo.points).toBe(10);

    const saved = JSON.parse(localStorage.getItem('mindshed-todoList'));
    expect(saved.itemStats[0]).toBe('complete');
  });

  it('deletes a completed to-do item', () => {
    document.getElementById('todo-input').value = 'Delete me';
    window.addTodoListItem();

    // Mark complete first so the delete button appears.
    document.getElementById('item-0').click();

    // Click the delete button (same id "item-0" on the complete list).
    document.querySelector('.listItem-delete-button').click();

    expect(window.todoList.itemStrings).toHaveLength(0);
  });
});
