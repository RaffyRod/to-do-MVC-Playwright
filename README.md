# 🚀 TodoMVC Playwright Tests

Automated testing project for the TodoMVC application using Playwright with TypeScript, implementing the Page Object Model (POM) pattern and Allure reporting.

## 📋 Table of Contents

- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Design Patterns](#-design-patterns)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Commands](#-commands)
- [Test Execution](#-test-execution)
- [Reports](#-reports)
- [Best Practices](#-best-practices)

## 🏗️ Architecture

### Page Object Model (POM) Pattern
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Test Layer    │───▶│  Page Objects   │───▶│   Web Elements  │
│   (to-do.spec)  │    │ (todo-mvc.page) │    │   (Selectors)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Test Logic    │    │  Page Actions   │    │   Constants      │
│   & Assertions  │    │  & Validations  │    │   & Selectors    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Execution Flow
1. **Test Layer**: Defines what to test and expectations
2. **Page Objects**: Encapsulates UI interaction logic
3. **Constants**: Centralizes selectors and test data
4. **Base Page**: Provides common functionality
5. **Allure Reporter**: Generates detailed reports

## 🛠️ Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Playwright** | ^1.56.1 | Automation framework |
| **TypeScript** | ^5.0+ | Static typing and better DX |
| **Node.js** | ^18+ | JavaScript runtime |
| **Allure** | ^2.24+ | Report generation |
| **npm** | ^9+ | Package manager |

## 🎯 Design Patterns

### 1. Page Object Model (POM)
- **Separation of concerns**: Tests vs. Page logic
- **Reusability**: Page Objects can be used in multiple tests
- **Maintainability**: UI changes only require updating Page Objects

### 2. Constants Pattern
- **Centralization**: All selectors and data in one place
- **Maintainability**: UI changes centralized
- **Type Safety**: TypeScript-typed constants

### 3. Base Page Pattern
- **Inheritance**: Common functionality for all pages
- **Consistency**: Standard methods across the application
- **Scalability**: Easy to add new pages

## 📁 Project Structure

```
├── 📁 pages/                    # Page Object Models
│   ├── 📄 base.page.ts         # Base class for all pages
│   └── 📄 todo-mvc.page.ts     # TodoMVC specific page
├── 📁 types/                    # TypeScript type definitions
│   └── 📄 todo.types.ts        # Interfaces and types for TodoMVC
├── 📁 utils/                    # Utilities and constants
│   └── 📄 constants.ts         # Centralized selectors and data
├── 📁 tests/                    # Test files
│   └── 📄 to-do.spec.ts        # Main tests with Allure annotations
├── 📁 allure-results/          # Allure JSON results (generated)
├── 📁 allure-report/           # Allure HTML report (generated)
├── 📄 playwright.config.ts     # Playwright configuration
├── 📄 tsconfig.json            # TypeScript configuration
├── 📄 package.json             # Dependencies and scripts
├── 📄 generate-simple-report.js # Custom HTML report generator
└── 📄 .gitignore               # Files to ignore in Git
```

## ⚙️ Configuration

### Prerequisites
```bash
# Check versions
node --version    # >= 18.0.0
npm --version     # >= 9.0.0
```

### Installation
```bash
# Clone repository
git clone <repository-url>
cd test

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## 🚀 Commands

### Main Tests
```bash
# Run all tests (generates Allure report automatically)
npm test

# Run tests with visual interface
npm run test:headed

# Run tests with interactive UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug
```

### Reports
```bash
# Open Allure report (default)
npm run test:report

# Generate Playwright HTML report (optional)
npm run test:html

# Run tests and open report automatically
npm run test:allure

# Generate Allure report only
npm run allure:generate

# Generate and open Allure report
npm run allure:open
```

### Development
```bash
# Check TypeScript types
npm run type-check

# Compile TypeScript
npm run build
```

## 🧪 Test Execution

### Main Test
The project includes a comprehensive test that validates:

1. **Navigation**: Access to TodoMVC application
2. **Creation**: Add two todo items
3. **Verification**: Confirm both items exist
4. **Completion**: Mark first item as completed
5. **Filtering**: Filter by completed items
6. **Validation**: Verify only completed item is visible

### Allure Annotations
```typescript
await allure.epic('TodoMVC Application');
await allure.feature('Todo Management');
await allure.story('Complete Todo Workflow');
await allure.severity('critical');
await allure.owner('QA Team');
```

## 📊 Reports

### Allure Report (Default)
- ✅ **Detailed steps**: Each test action documented
- ✅ **Metrics**: Execution time, status, duration
- ✅ **Filters**: By epic, feature, story, severity, owner
- ✅ **Screenshots**: Automatic captures on failures
- ✅ **Traces**: Complete debugging information
- ✅ **History**: Comparison between executions

### Report Features
- **Professional design**: Modern and responsive CSS
- **Complete information**: All execution data
- **Easy navigation**: Clear and organized structure
- **Exportable**: Static reports for sharing

## 🎯 Best Practices

### 1. Page Object Model
```typescript
// ✅ Good: Semantic methods
await todoPage.addTodo('Complete task');
await todoPage.verifyTodoCount(1);

// ❌ Bad: UI logic in tests
await page.locator('.new-todo').fill('Complete task');
await page.locator('.new-todo').press('Enter');
```

### 2. Constants
```typescript
// ✅ Good: Use constants
await todoPage.addTodo(TODO_CONSTANTS.TODO_TEXTS.FIRST_TODO);

// ❌ Bad: Magic strings
await todoPage.addTodo('Complete Playwright Challenge');
```

### 3. Allure Annotations
```typescript
// ✅ Good: Descriptive steps
await allure.step('Create first todo item', async () => {
  await todoPage.addTodo(TODO_CONSTANTS.TODO_TEXTS.FIRST_TODO);
});
```

### 4. Error Handling
```typescript
// ✅ Good: Timeouts and validations
await this.waitForElement(locator, timeout);
await expect(element).toBeVisible();

// ❌ Bad: No error handling
await locator.click();
```

## 🔧 Advanced Configuration

### Playwright Config
```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['allure-playwright', { 
    outputFolder: 'allure-results',
    detail: true,
    suiteTitle: false 
  }]],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
});
```

### TypeScript Config
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## 🚀 Extensibility

### Adding New Page
1. Create new class extending `BasePage`
2. Define selectors in `constants.ts`
3. Implement interaction methods
4. Use in tests

### Adding New Tests
1. Import `TodoMVCPage`
2. Use Allure annotations
3. Follow descriptive steps pattern
4. Use constants for data

### Adding New Features
1. Extend `BasePage` with common methods
2. Add necessary constants
3. Update TypeScript types
4. Document in README

## 📝 Important Notes

- **Path spaces**: Project automatically handles spaces in Windows usernames
- **Automatic reports**: Tests generate Allure reports automatically
- **Cross-browser**: Tests run on Chrome, Firefox, and Safari
- **Type safety**: TypeScript prevents errors at compile time
- **Maintainability**: Scalable and easy-to-maintain architecture

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License. See `package.json` for more details.

---

**Developed with ❤️ using Playwright + TypeScript + Allure**