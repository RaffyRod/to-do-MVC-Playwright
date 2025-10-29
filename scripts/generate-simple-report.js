const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Generating Allure HTML report...');

try {
  // Check if allure-results directory exists
  const resultsDir = 'allure-results';
  if (!fs.existsSync(resultsDir)) {
    console.log('❌ No allure-results directory found');
    process.exit(1);
  }

  // Check if there are any JSON files
  const files = fs
    .readdirSync(resultsDir)
    .filter(file => file.endsWith('.json'));
  if (files.length === 0) {
    console.log('❌ No JSON result files found in allure-results');
    process.exit(1);
  }

  console.log(`Found ${files.length} result files`);

  // Remove old report if exists
  const reportDir = 'allure-report';
  if (fs.existsSync(reportDir)) {
    fs.rmSync(reportDir, { recursive: true, force: true });
    console.log('🧹 Cleaned old report directory');
  }

  // Generate Allure report using official command
  console.log('📊 Generating Allure report...');

  try {
    // Try to use npx allure generate
    execSync('npx allure generate allure-results --clean -o allure-report', {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    console.log('✅ Allure report generated successfully!');
  } catch (error) {
    console.log('⚠️  npx allure generate failed, trying alternative...');

    // Alternative: try allure command directly
    try {
      execSync('allure generate allure-results --clean -o allure-report', {
        stdio: 'inherit',
        cwd: process.cwd(),
      });
      console.log('✅ Allure report generated successfully!');
    } catch (error2) {
      console.log(
        '❌ Allure command not found. Installing allure-commandline...'
      );

      // Install allure-commandline locally
      execSync('npm install allure-commandline --save-dev', {
        stdio: 'inherit',
      });

      // Try again with local installation
      execSync('npx allure generate allure-results --clean -o allure-report', {
        stdio: 'inherit',
        cwd: process.cwd(),
      });
      console.log('✅ Allure report generated successfully!');
    }
  }

  // Verify report was generated
  if (fs.existsSync('allure-report/index.html')) {
    console.log('📁 Report location: allure-report/index.html');
    console.log(
      '📈 Report size:',
      execSync('du -sh allure-report/ | cut -f1', { encoding: 'utf8' }).trim()
    );
    console.log('🌐 To open: npm run allure:open');
  } else {
    console.log('❌ Report generation failed - index.html not found');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error generating Allure report:', error.message);
  process.exit(1);
}
