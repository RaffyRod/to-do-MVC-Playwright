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
- [CI/CD Pipeline](#-cicd-pipeline)
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

| Technology         | Version | Purpose                     |
| ------------------ | ------- | --------------------------- |
| **Playwright**     | ^1.56.1 | Automation framework        |
| **TypeScript**     | ^5.9.3  | Static typing and better DX |
| **Node.js**        | ^18+    | JavaScript runtime          |
| **Allure**         | ^3.4.2  | Report generation           |
| **Prettier**       | ^3.6.2  | Code formatting             |
| **Husky**          | ^9.1.7  | Git hooks                   |
| **lint-staged**    | ^16.2.6 | Pre-commit linting          |
| **GitHub Actions** | -       | CI/CD pipeline              |
| **npm**            | ^9+     | Package manager             |

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
├── 📁 .github/                   # GitHub Actions workflows
│   └── 📁 workflows/
│       └── 📄 ci.yml             # CI/CD pipeline configuration
├── 📁 .husky/                    # Git hooks configuration
│   └── 📄 pre-commit             # Pre-commit hook
├── 📁 pages/                     # Page Object Models
│   ├── 📄 base.page.ts          # Base class for all pages
│   └── 📄 todo-mvc.page.ts      # TodoMVC specific page
├── 📁 scripts/                   # Utility scripts
│   ├── 📄 clean-allure-results.js # Clean old test results
│   └── 📄 generate-simple-report.js # Custom HTML report generator
├── 📁 types/                     # TypeScript type definitions
│   └── 📄 todo.types.ts         # Interfaces and types for TodoMVC
├── 📁 utils/                     # Utilities and constants
│   └── 📄 constants.ts          # Centralized selectors and data
├── 📁 tests/                     # Test files
│   └── 📄 to-do.spec.ts         # Main tests with Allure annotations
├── 📁 allure-results/           # Allure JSON results (generated)
├── 📁 allure-report/            # Allure HTML report (generated)
├── 📄 .prettierrc               # Prettier configuration
├── 📄 .prettierignore           # Prettier ignore rules
├── 📄 playwright.config.ts      # Playwright configuration
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 package.json              # Dependencies and scripts
└── 📄 .gitignore                # Files to ignore in Git
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

### Code Quality

```bash
# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Run TypeScript type checking
npm run type-check

# Run full linting (type-check + format-check)
npm run lint

# Fix linting issues automatically
npm run lint:fix
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

### Playwright HTML Report

```bash
# Generate Playwright's default HTML report
npm run test:html
```

## 🔄 CI/CD Pipeline

### GitHub Actions

The project includes a comprehensive CI/CD pipeline that runs on every push and pull request:

#### Pipeline Steps:

1. **Code Checkout**: Clone repository
2. **Node.js Setup**: Install Node.js 18 with npm cache
3. **Dependencies**: Install all project dependencies
4. **Linting**: Run TypeScript type checking and Prettier formatting
5. **Browser Installation**: Install Playwright browsers
6. **Test Execution**: Run all tests across multiple browsers
7. **Artifact Upload**: Save test results and reports
8. **Report Deployment**: Deploy report to GitHub Pages (main branch)
9. **PR Comments**: Add report link to pull request comments

#### Features:

- ✅ **Multi-browser testing**: Chromium, Firefox, WebKit
- ✅ **Automatic report generation**: HTML report with videos/screenshots
- ✅ **GitHub Pages deployment**: Live report accessible via URL
- ✅ **PR integration**: Automatic comments with report links
- ✅ **Artifact retention**: Test results stored for 30 days

### Pre-commit Hooks

The project uses Husky and lint-staged to ensure code quality:

#### Automatic Checks on Commit:

- **Prettier formatting**: Auto-format TypeScript, JavaScript, JSON, Markdown, YAML files
- **TypeScript validation**: Type checking for all TypeScript files
- **Staged files only**: Only processes files being committed

#### Configuration:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["prettier --write", "tsc --noEmit"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

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
  reporter: [
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: false,
      },
    ],
  ],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
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
