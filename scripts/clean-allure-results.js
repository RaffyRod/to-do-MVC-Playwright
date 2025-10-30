const fs = require('fs');
const path = require('path');

console.log('Cleaning old Allure results...');

const safeRmDir = dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
};

// Fully reset result/report directories to avoid stale data
safeRmDir('allure-results');
safeRmDir('test-results');
safeRmDir('allure-report');

console.log('✅ Cleaned allure-results, test-results and allure-report');
console.log('Ready for new test execution');
