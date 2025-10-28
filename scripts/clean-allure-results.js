const fs = require('fs');
const path = require('path');

console.log('Cleaning old Allure results...');

const resultsDir = 'allure-results';

if (fs.existsSync(resultsDir)) {
  const files = fs.readdirSync(resultsDir);
  const jsonFiles = files.filter(file => file.endsWith('.json'));

  if (jsonFiles.length > 0) {
    console.log(`Found ${jsonFiles.length} old result files, cleaning...`);

    jsonFiles.forEach(file => {
      fs.unlinkSync(path.join(resultsDir, file));
    });

    console.log('✅ Cleaned old result files');
  } else {
    console.log('No old result files to clean');
  }
} else {
  console.log('Allure results directory does not exist, creating...');
  fs.mkdirSync(resultsDir);
}

console.log('Ready for new test execution');
