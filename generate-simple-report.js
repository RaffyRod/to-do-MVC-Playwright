const fs = require('fs');
const path = require('path');

console.log('Generating enhanced Allure HTML report...');

try {
  // Read all JSON result files (should be clean now)
  const resultsDir = 'allure-results';
  const files = fs.existsSync(resultsDir) ? 
    fs.readdirSync(resultsDir).filter(file => file.endsWith('.json')) : [];
  
  console.log(`Found ${files.length} result files`);
  
  let allResults = [];
  
  files.forEach(file => {
    const filePath = path.join(resultsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const result = JSON.parse(content);
    
    // Calculate duration if not present
    if (!result.time && result.start && result.stop) {
      result.time = result.stop - result.start;
    }
    
    // Ensure time is a number
    result.time = result.time || 0;
    
    // Extract browser information from parameters
    let browser = 'Unknown';
    if (result.parameters) {
      const projectParam = result.parameters.find(param => param.name === 'Project');
      if (projectParam) {
        browser = projectParam.value;
      }
    }
    
    // Fallback: try to extract browser from labels
    if (browser === 'Unknown' && result.labels) {
      const parentSuiteLabel = result.labels.find(label => label.name === 'parentSuite');
      if (parentSuiteLabel) {
        browser = parentSuiteLabel.value;
      }
    }
    
    // Fallback: try to extract browser from test name
    if (browser === 'Unknown' && result.name) {
      if (result.name.includes('chromium')) browser = 'chromium';
      else if (result.name.includes('firefox')) browser = 'firefox';
      else if (result.name.includes('webkit')) browser = 'webkit';
    }
    
    result.browser = browser;
    allResults.push(result);
  });
  
  // Helper function to format duration
  function formatDuration(ms) {
    if (!ms || ms === 0) return '0ms';
    if (ms < 1000) return ms + 'ms';
    if (ms < 60000) return (ms / 1000).toFixed(2) + 's';
    return (ms / 60000).toFixed(2) + 'm';
  }
  
  // Create enhanced HTML with filters
  const passedTests = allResults.filter(r => r.status === 'passed');
  const failedTests = allResults.filter(r => r.status === 'failed');
  const skippedTests = allResults.filter(r => r.status === 'skipped');
  const totalDuration = allResults.reduce((sum, r) => sum + (r.time || 0), 0);
  
  // Get unique browsers
  const browsers = [...new Set(allResults.map(r => r.browser))];
  
  // Group tests by browser
  const testsByBrowser = browsers.reduce((acc, browser) => {
    acc[browser] = allResults.filter(r => r.browser === browser);
    return acc;
  }, {});
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Allure Report - TodoMVC Tests</title>
    <style>
        * { box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container { 
            max-width: 1400px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            margin-top: 20px;
            margin-bottom: 20px;
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
        }
        .header h1 { 
            color: #2c3e50; 
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        .header p { 
            color: #7f8c8d; 
            font-size: 1.1em;
        }
        .summary { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin: 30px 0; 
        }
        .stat { 
            text-align: center; 
            padding: 25px; 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 10px; 
            border: 1px solid #dee2e6;
            transition: transform 0.3s ease;
        }
        .stat:hover { transform: translateY(-5px); }
        .stat-number { 
            font-size: 2.5em; 
            font-weight: bold; 
            margin-bottom: 10px;
        }
        .stat-passed .stat-number { color: #28a745; }
        .stat-failed .stat-number { color: #dc3545; }
        .stat-skipped .stat-number { color: #ffc107; }
        .stat-total .stat-number { color: #007bff; }
        .stat-label { 
            color: #6c757d; 
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .filters {
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border: 1px solid #dee2e6;
        }
        .filters h3 {
            margin-top: 0;
            color: #495057;
        }
        .filter-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .filter-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            background: #6c757d;
            color: white;
        }
        .filter-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .filter-btn.active {
            background: #007bff;
        }
        .filter-btn.passed { background: #28a745; }
        .filter-btn.failed { background: #dc3545; }
        .filter-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            background: #6c757d;
            color: white;
        }
        .filter-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .filter-btn.active {
            background: #007bff;
        }
        .filter-btn.passed { background: #28a745; }
        .filter-btn.failed { background: #dc3545; }
        .filter-btn.skipped { background: #ffc107; color: #000; }
        .filter-btn.browser { background: #17a2b8; }
        .checkbox-container {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 5px 0;
            padding: 8px 12px;
            background: white;
            border-radius: 8px;
            border: 1px solid #dee2e6;
            transition: all 0.3s ease;
        }
        .checkbox-container:hover {
            background: #f8f9fa;
            border-color: #007bff;
        }
        .checkbox-container input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }
        .checkbox-container label {
            cursor: pointer;
            font-weight: 500;
            color: #495057;
            margin: 0;
        }
        .checkbox-container.checked {
            background: #e3f2fd;
            border-color: #007bff;
        }
        .checkbox-container.checked label {
            color: #007bff;
            font-weight: 600;
        }
        .browser-badge {
            background: #6c757d;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7em;
            font-weight: normal;
            margin-left: 10px;
        }
        .browser-name {
            font-weight: bold;
            color: #17a2b8;
        }
        .test-case { 
            margin: 20px 0; 
            padding: 20px; 
            border: 1px solid #dee2e6; 
            border-radius: 10px; 
            background: white;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .test-case:hover {
            box-shadow: 0 5px 15px rgba(0,0,0,0.15);
            transform: translateY(-2px);
        }
        .test-case.hidden { display: none; }
        .test-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .test-title { 
            font-weight: bold; 
            font-size: 1.2em;
            color: #2c3e50;
            margin: 0;
        }
        .test-status { 
            padding: 8px 16px; 
            border-radius: 20px; 
            color: white; 
            font-size: 12px; 
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .status-passed { background: linear-gradient(135deg, #28a745, #20c997); }
        .status-failed { background: linear-gradient(135deg, #dc3545, #e74c3c); }
        .status-skipped { background: linear-gradient(135deg, #ffc107, #fd7e14); color: #000; }
        .test-meta {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
            font-size: 0.9em;
            color: #6c757d;
        }
        .test-meta span {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .steps { 
            margin-top: 15px; 
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
        }
        .steps h4 {
            margin-top: 0;
            color: #495057;
            font-size: 1em;
        }
        .step { 
            margin: 8px 0; 
            padding: 10px; 
            background: white; 
            border-left: 4px solid #007bff; 
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .step-name {
            font-weight: 500;
            color: #495057;
        }
        .step-status {
            font-size: 0.8em;
            color: #6c757d;
            margin-top: 5px;
        }
        .no-tests {
            text-align: center;
            padding: 40px;
            color: #6c757d;
            font-style: italic;
        }
        .duration {
            font-weight: bold;
            color: #007bff;
        }
        .timestamp {
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Allure Report - TodoMVC Tests</h1>
            <p>Report generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="stat stat-total">
                <div class="stat-number">${allResults.length}</div>
                <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat stat-passed">
                <div class="stat-number">${passedTests.length}</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat stat-failed">
                <div class="stat-number">${failedTests.length}</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat stat-skipped">
                <div class="stat-number">${skippedTests.length}</div>
                <div class="stat-label">Skipped</div>
            </div>
        </div>
        
        <div class="filters">
            <h3>🔍 Filter Tests</h3>
            <div class="filter-buttons">
                <button class="filter-btn active" onclick="filterTests('all', 'all')">All Tests</button>
                <button class="filter-btn passed" onclick="filterTests('passed', 'all')">Passed Only</button>
                <button class="filter-btn failed" onclick="filterTests('failed', 'all')">Failed Only</button>
                <button class="filter-btn skipped" onclick="filterTests('skipped', 'all')">Skipped Only</button>
            </div>
            <h4>🌐 Filter by Browser</h4>
            <div class="browser-filters">
                <div class="checkbox-container checked" onclick="toggleBrowser('all')">
                    <input type="checkbox" id="browser-all" checked onchange="toggleBrowser('all')">
                    <label for="browser-all">All Browsers</label>
                </div>
                ${browsers.map(browser => `
                    <div class="checkbox-container checked" onclick="toggleBrowser('${browser}')">
                        <input type="checkbox" id="browser-${browser}" checked onchange="toggleBrowser('${browser}')">
                        <label for="browser-${browser}">${browser}</label>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <h2>📋 Test Details</h2>
        <div id="test-results">
            ${allResults.map(result => `
                <div class="test-case" data-status="${result.status}" data-browser="${result.browser}">
                    <div class="test-header">
                        <h3 class="test-title">${result.name} <span class="browser-badge">[${result.browser}]</span></h3>
                        <div class="test-status status-${result.status}">${result.status.toUpperCase()}</div>
                    </div>
                    <div class="test-meta">
                        <span><strong>Duration:</strong> <span class="duration">${formatDuration(result.time)}</span></span>
                        <span><strong>Executed:</strong> <span class="timestamp">${new Date(result.start).toLocaleString()}</span></span>
                        <span><strong>Browser:</strong> <span class="browser-name">${result.browser}</span></span>
                    </div>
                    ${result.steps && result.steps.length > 0 ? `
                        <div class="steps">
                            <h4>📝 Test Steps:</h4>
                            ${result.steps.map(step => `
                                <div class="step">
                                    <div class="step-name">${step.name}</div>
                                    ${step.status ? `<div class="step-status">Status: ${step.status}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    </div>
    
    <script>
        let currentStatusFilter = 'all';
        let selectedBrowsers = new Set(['all']);
        
        function filterTests(status, browser) {
            currentStatusFilter = status;
            
            // Update button states
            const statusButtons = document.querySelectorAll('.filter-btn:not(.browser)');
            statusButtons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            applyFilters();
        }
        
        function toggleBrowser(browser) {
            const checkbox = document.getElementById(\`browser-\${browser}\`);
            const container = checkbox.closest('.checkbox-container');
            
            if (browser === 'all') {
                // Toggle all browsers
                if (checkbox.checked) {
                    selectedBrowsers.clear();
                    selectedBrowsers.add('all');
                    // Uncheck all individual browsers
                    ${browsers.map(b => `
                        const ${b}Checkbox = document.getElementById('browser-${b}');
                        const ${b}Container = ${b}Checkbox.closest('.checkbox-container');
                        ${b}Checkbox.checked = false;
                        ${b}Container.classList.remove('checked');
                    `).join('')}
                } else {
                    // Check all individual browsers
                    selectedBrowsers.clear();
                    ${browsers.map(b => `
                        selectedBrowsers.add('${b}');
                        const ${b}Checkbox = document.getElementById('browser-${b}');
                        const ${b}Container = ${b}Checkbox.closest('.checkbox-container');
                        ${b}Checkbox.checked = true;
                        ${b}Container.classList.add('checked');
                    `).join('')}
                }
            } else {
                // Toggle individual browser
                if (checkbox.checked) {
                    selectedBrowsers.add(browser);
                    selectedBrowsers.delete('all');
                    // Uncheck "All Browsers"
                    const allCheckbox = document.getElementById('browser-all');
                    const allContainer = allCheckbox.closest('.checkbox-container');
                    allCheckbox.checked = false;
                    allContainer.classList.remove('checked');
                } else {
                    selectedBrowsers.delete(browser);
                    // If no browsers selected, select all
                    if (selectedBrowsers.size === 0) {
                        selectedBrowsers.add('all');
                        const allCheckbox = document.getElementById('browser-all');
                        const allContainer = allCheckbox.closest('.checkbox-container');
                        allCheckbox.checked = true;
                        allContainer.classList.add('checked');
                    }
                }
            }
            
            // Update container visual state
            if (checkbox.checked) {
                container.classList.add('checked');
            } else {
                container.classList.remove('checked');
            }
            
            applyFilters();
        }
        
        function applyFilters() {
            const testCases = document.querySelectorAll('.test-case');
            testCases.forEach(test => {
                const testStatus = test.dataset.status;
                const testBrowser = test.dataset.browser;
                
                const statusMatch = currentStatusFilter === 'all' || testStatus === currentStatusFilter;
                const browserMatch = selectedBrowsers.has('all') || selectedBrowsers.has(testBrowser);
                
                if (statusMatch && browserMatch) {
                    test.classList.remove('hidden');
                } else {
                    test.classList.add('hidden');
                }
            });
        }
        
        function formatDuration(ms) {
            if (!ms || ms === 0) return '0ms';
            if (ms < 1000) return ms + 'ms';
            if (ms < 60000) return (ms / 1000).toFixed(2) + 's';
            return (ms / 60000).toFixed(2) + 'm';
        }
    </script>
</body>
</html>`;
  
  // Create report directory if it doesn't exist
  if (!fs.existsSync('allure-report')) {
    fs.mkdirSync('allure-report');
  }
  
  // Write HTML file
  fs.writeFileSync('allure-report/index.html', html);
  
  console.log('✅ Allure HTML report generated successfully!');
  console.log('📁 Location: allure-report/index.html');
  console.log('🌐 To open: npm run allure:open');
  
} catch (error) {
  console.error('❌ Error generating report:', error.message);
  process.exit(1);
}
