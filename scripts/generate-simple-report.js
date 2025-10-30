const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Generating Allure HTML report...');

try {
  // Check if allure-results directory exists
  const resultsDir = 'allure-results';
  if (!fs.existsSync(resultsDir)) {
    console.log('❌ No allure-results directory found');
    console.log('📁 Creating allure-results directory...');
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  // Check if there are any JSON files
  const files = fs
    .readdirSync(resultsDir)
    .filter(file => file.endsWith('.json'));
  if (files.length === 0) {
    console.log('❌ No JSON result files found in allure-results');
    console.log('📁 Checking test-results directory...');

    // Check if test-results directory exists and has files
    const testResultsDir = 'test-results';
    if (fs.existsSync(testResultsDir)) {
      const testFiles = fs.readdirSync(testResultsDir, { recursive: true });
      console.log(`Found ${testFiles.length} files in test-results`);
      if (testFiles.length > 0) {
        console.log(
          '⚠️  Tests ran but Allure results not generated. This might be due to test failures.'
        );
        console.log('📋 Test results available in test-results directory');
      }
    }

    console.log('🔄 Attempting to generate a basic report...');
    // Create a basic HTML report even without Allure results
    const basicReport = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Report - No Allure Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .error { color: #d32f2f; background: #ffebee; padding: 20px; border-radius: 4px; }
        .info { color: #1976d2; background: #e3f2fd; padding: 20px; border-radius: 4px; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>Test Report</h1>
    <div class="error">
        <h2>⚠️ No Allure Results Found</h2>
        <p>Tests may have failed before Allure could generate results.</p>
        <p>Check the test-results directory for more information.</p>
    </div>
    <div class="info">
        <h3>Next Steps:</h3>
        <ul>
            <li>Check test execution logs</li>
            <li>Verify Playwright configuration</li>
            <li>Ensure tests are running successfully</li>
        </ul>
    </div>
</body>
</html>`;

    // Create allure-report directory
    if (!fs.existsSync('allure-report')) {
      fs.mkdirSync('allure-report', { recursive: true });
    }

    // Write basic report
    fs.writeFileSync('allure-report/index.html', basicReport);
    console.log('✅ Basic report generated');
    process.exit(0);
  }

  console.log(`Found ${files.length} result files`);

  // Remove old report if exists
  const reportDir = 'allure-report';
  if (fs.existsSync(reportDir)) {
    fs.rmSync(reportDir, { recursive: true, force: true });
    console.log('🧹 Cleaned old report directory');
  }

  // Set JAVA_HOME if not already set
  if (!process.env.JAVA_HOME) {
    process.env.JAVA_HOME = '/usr/lib/jvm/java-11-openjdk-amd64';
  }

  // Generate Allure report using official command
  console.log('📊 Generating Allure report...');

  try {
    // Try to use npx allure generate
    execSync('npx allure generate allure-results --clean -o allure-report', {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: { ...process.env, JAVA_HOME: process.env.JAVA_HOME },
    });
    console.log('✅ Allure report generated successfully!');
  } catch (error) {
    console.log('⚠️  npx allure generate failed, trying alternative...');

    // Alternative: try allure command directly
    try {
      execSync('allure generate allure-results --clean -o allure-report', {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: { ...process.env, JAVA_HOME: process.env.JAVA_HOME },
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
        env: { ...process.env, JAVA_HOME: process.env.JAVA_HOME },
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
