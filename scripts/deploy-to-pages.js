const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting GitHub Pages deployment...');

try {
  // Check if we're in CI
  if (!process.env.CI) {
    console.log('❌ This script should only run in CI environment');
    process.exit(1);
  }

  // Check if report exists
  if (!fs.existsSync('allure-report/index.html')) {
    console.log('❌ Allure report not found');
    process.exit(1);
  }

  console.log('✅ Allure report found');

  // Install gh CLI if not available
  try {
    execSync('gh --version', { stdio: 'ignore' });
    console.log('✅ GitHub CLI already installed');
  } catch (error) {
    console.log('📦 Installing GitHub CLI...');
    execSync(
      'curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg',
      { stdio: 'inherit' }
    );
    execSync(
      'echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null',
      { stdio: 'inherit' }
    );
    execSync('sudo apt update && sudo apt install gh -y', { stdio: 'inherit' });
  }

  // Configure git
  execSync('git config --global user.name "CircleCI"', { stdio: 'inherit' });
  execSync('git config --global user.email "circleci@example.com"', {
    stdio: 'inherit',
  });

  // Clone gh-pages branch
  console.log('📥 Cloning gh-pages branch...');
  if (fs.existsSync('gh-pages')) {
    execSync('rm -rf gh-pages', { stdio: 'inherit' });
  }
  execSync(
    'git clone --branch gh-pages --single-branch https://github.com/RaffyRod/to-do-MVC-Playwright.git gh-pages',
    { stdio: 'inherit' }
  );

  // Copy report files
  console.log('📋 Copying report files...');
  execSync('cp -r allure-report/* gh-pages/', { stdio: 'inherit' });

  // Commit and push
  console.log('💾 Committing changes...');
  process.chdir('gh-pages');

  execSync('git add .', { stdio: 'inherit' });

  try {
    execSync('git commit -m "Update test report"', { stdio: 'inherit' });
  } catch (error) {
    console.log('ℹ️  No changes to commit');
  }

  console.log('🚀 Pushing to GitHub Pages...');
  execSync(
    `git push https://${process.env.GITHUB_TOKEN}@github.com/RaffyRod/to-do-MVC-Playwright.git gh-pages`,
    { stdio: 'inherit' }
  );

  console.log('✅ Successfully deployed to GitHub Pages!');
  console.log(
    '🌐 Report available at: https://raffyrod.github.io/to-do-MVC-Playwright/'
  );
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
