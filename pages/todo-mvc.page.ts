import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { TODO_CONSTANTS } from '../utils/constants';

export class TodoMVCPage extends BasePage {
  // Locators from original test
  private get newTodoInput(): Locator {
    return this.page.locator(TODO_CONSTANTS.SELECTORS.NEW_TODO_INPUT);
  }

  private get todoItems(): Locator {
    return this.page.locator(TODO_CONSTANTS.SELECTORS.TODO_ITEM);
  }

  private get completedFilter(): Locator {
    return this.page.locator(TODO_CONSTANTS.SELECTORS.COMPLETED_FILTER);
  }

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to TodoMVC application
   */
  async navigateToTodoMVC(): Promise<void> {
    await this.goto(TODO_CONSTANTS.URLS.TODO_MVC);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify page title contains TodoMVC
   */
  async verifyPageTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(TODO_CONSTANTS.TITLES.TODO_MVC);
  }

  /**
   * Add a new todo item
   */
  async addTodo(text: string): Promise<void> {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  /**
   * Verify todo count
   */
  async verifyTodoCount(expectedCount: number): Promise<void> {
    await expect(this.todoItems).toHaveCount(expectedCount);
  }

  /**
   * Verify todo text by index
   */
  async verifyTodoTextByIndex(index: number, expectedText: string): Promise<void> {
    await expect(this.todoItems.nth(index)).toContainText(expectedText);
  }

  /**
   * Click toggle checkbox for todo by index
   */
  async toggleTodoByIndex(index: number): Promise<void> {
    const toggle = this.todoItems.nth(index).locator(TODO_CONSTANTS.SELECTORS.TODO_TOGGLE);
    await toggle.click();
  }

  /**
   * Verify todo has completed class
   */
  async verifyTodoCompletedByIndex(index: number): Promise<void> {
    await expect(this.todoItems.nth(index)).toHaveClass(TODO_CONSTANTS.CLASSES.COMPLETED);
  }

  /**
   * Click completed filter
   */
  async clickCompletedFilter(): Promise<void> {
    await this.completedFilter.click();
  }

  /**
   * Verify visible todo count (after filtering)
   */
  async verifyVisibleTodoCount(expectedCount: number): Promise<void> {
    const visibleItems = this.page.locator(TODO_CONSTANTS.SELECTORS.VISIBLE_TODOS);
    await expect(visibleItems).toHaveCount(expectedCount);
  }

  /**
   * Verify visible todo text
   */
  async verifyVisibleTodoText(expectedText: string): Promise<void> {
    const visibleItems = this.page.locator(TODO_CONSTANTS.SELECTORS.VISIBLE_TODOS);
    await expect(visibleItems.first()).toContainText(expectedText);
  }

  /**
   * Verify visible todo has completed class
   */
  async verifyVisibleTodoCompleted(): Promise<void> {
    const visibleItems = this.page.locator(TODO_CONSTANTS.SELECTORS.VISIBLE_TODOS);
    await expect(visibleItems.first()).toHaveClass(TODO_CONSTANTS.CLASSES.COMPLETED);
  }
}