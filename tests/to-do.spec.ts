import { test, expect } from '@playwright/test';
import { TodoMVCPage } from '../pages/todo-mvc.page';
import { TODO_CONSTANTS } from '../utils/constants';
import { allure } from 'allure-playwright';

test.describe('TodoMVC Application Tests', () => {
  let todoPage: TodoMVCPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMVCPage(page);
  });

  test('Complete TodoMVC workflow test', async ({ page }) => {
    await allure.epic('TodoMVC Application');
    await allure.feature('Todo Management');
    await allure.story('Complete Todo Workflow');
    await allure.severity('critical');
    await allure.owner('QA Team');

    await allure.step('Navigate to TodoMVC page', async () => {
      await todoPage.navigateToTodoMVC();
    });
    
    await allure.step('Verify page title', async () => {
      await todoPage.verifyPageTitle();
    });
    
    await allure.step('Create first todo item', async () => {
      await todoPage.addTodo(TODO_CONSTANTS.TODO_TEXTS.FIRST_TODO);
    });
    
    await allure.step('Create second todo item', async () => {
      await todoPage.addTodo(TODO_CONSTANTS.TODO_TEXTS.SECOND_TODO);
    });
    
    await allure.step('Verify both todos were created', async () => {
      await todoPage.verifyTodoCount(TODO_CONSTANTS.COUNTS.TWO_TODOS);
      await todoPage.verifyTodoTextByIndex(0, TODO_CONSTANTS.TODO_TEXTS.FIRST_TODO);
      await todoPage.verifyTodoTextByIndex(1, TODO_CONSTANTS.TODO_TEXTS.SECOND_TODO);
    });
    
    await allure.step('Mark first todo as completed', async () => {
      await todoPage.toggleTodoByIndex(0);
      await todoPage.verifyTodoCompletedByIndex(0);
    });
    
    await allure.step('Filter by completed todos', async () => {
      await todoPage.clickCompletedFilter();
    });
    
    await allure.step('Verify only completed todo is visible', async () => {
      await todoPage.verifyVisibleTodoCount(TODO_CONSTANTS.COUNTS.ONE_TODO);
      await todoPage.verifyVisibleTodoText(TODO_CONSTANTS.TODO_TEXTS.FIRST_TODO);
      await todoPage.verifyVisibleTodoCompleted();
    });
  });

  test('Failing test for demonstration', async ({ page }) => {
    await allure.epic('TodoMVC Application');
    await allure.feature('Todo Management');
    await allure.story('Failing Test Demo');
    await allure.severity('critical');
    await allure.owner('QA Team');

    await allure.step('Navigate to TodoMVC page', async () => {
      await todoPage.navigateToTodoMVC();
    });
    
    await allure.step('Verify page title', async () => {
      await todoPage.verifyPageTitle();
    });
    
    await allure.step('Create a todo item', async () => {
      await todoPage.addTodo('This will fail');
    });
    
    await allure.step('Intentionally fail the test', async () => {
      // This will fail and generate video/screenshot
      await expect(page.locator('.non-existent-element')).toBeVisible();
    });
  });
});