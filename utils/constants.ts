// Constants for TodoMVC application
export const TODO_CONSTANTS = {
  // URLs
  URLS: {
    TODO_MVC: 'https://demo.playwright.dev/todomvc/'
  },

  // Page titles
  TITLES: {
    TODO_MVC: /TodoMVC/
  },

  // Todo texts
  TODO_TEXTS: {
    FIRST_TODO: 'Complete Playwright Challenge',
    SECOND_TODO: 'Submit the Challenge'
  },

  // Selectors
  SELECTORS: {
    NEW_TODO_INPUT: '.new-todo',
    TODO_LIST: '.todo-list',
    TODO_ITEM: '.todo-list li',
    TODO_TOGGLE: '.toggle',
    COMPLETED_FILTER: 'a[href="#/completed"]',
    VISIBLE_TODOS: '.todo-list li:not(.hidden)'
  },

  // Expected counts
  COUNTS: {
    TWO_TODOS: 2,
    ONE_TODO: 1
  },

  // CSS classes
  CLASSES: {
    COMPLETED: /completed/
  }
} as const;
