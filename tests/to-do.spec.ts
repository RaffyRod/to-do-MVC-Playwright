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

    // Navigate to TodoMVC page
    await todoPage.navigateToTodoMVC();

    // Verify page title
    await todoPage.verifyPageTitle();

    // Create first todo item
    await todoPage.addTodo(TODO_CONSTANTS.TODO_TEXTS.FIRST_TODO);

    // Create second todo item
    await todoPage.addTodo(TODO_CONSTANTS.TODO_TEXTS.SECOND_TODO);

    // Verify both todos were created
    await todoPage.verifyTodoCount(TODO_CONSTANTS.COUNTS.TWO_TODOS);
    await todoPage.verifyTodoTextByIndex(
      0,
      TODO_CONSTANTS.TODO_TEXTS.FIRST_TODO
    );
    await todoPage.verifyTodoTextByIndex(
      1,
      TODO_CONSTANTS.TODO_TEXTS.SECOND_TODO
    );

    // Mark first todo as completed
    await todoPage.toggleTodoByIndex(0);
    await todoPage.verifyTodoCompletedByIndex(0);

    // Filter by completed todos
    await todoPage.clickCompletedFilter();

    // Verify only completed todo is visible
    await todoPage.verifyVisibleTodoCount(TODO_CONSTANTS.COUNTS.ONE_TODO);
    await todoPage.verifyVisibleTodoText(TODO_CONSTANTS.TODO_TEXTS.FIRST_TODO);
    await todoPage.verifyVisibleTodoCompleted();
  });

  test('Failing test for demonstration', async ({ page }) => {
    await allure.epic('TodoMVC Application');
    await allure.feature('Todo Management');
    await allure.story('Failing Test Demo');
    await allure.severity('critical');
    await allure.owner('QA Team');

    // Navigate to TodoMVC page
    await todoPage.navigateToTodoMVC();

    // Verify page title
    await todoPage.verifyPageTitle();

    // Create a todo item
    await todoPage.addTodo('This will fail');

    // Intentionally fail the test
    // This will fail and generate video/screenshot
    await expect(page.locator('.non-existent-element')).toBeVisible();
  });
});
