const fs = require('fs');
const path = require('path');

console.log('Generando reporte HTML básico de Allure...');

try {
  // Leer todos los archivos JSON de resultados
  const resultsDir = 'allure-results';
  const files = fs.readdirSync(resultsDir).filter(file => file.endsWith('.json'));
  
  let allResults = [];
  
  files.forEach(file => {
    const filePath = path.join(resultsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const result = JSON.parse(content);
    allResults.push(result);
  });
  
  // Crear HTML básico
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Allure Report - TodoMVC Tests</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 5px; }
        .stat-number { font-size: 24px; font-weight: bold; color: #28a745; }
        .stat-label { color: #666; margin-top: 5px; }
        .test-case { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .test-title { font-weight: bold; margin-bottom: 10px; }
        .test-status { padding: 5px 10px; border-radius: 3px; color: white; font-size: 12px; }
        .status-passed { background-color: #28a745; }
        .status-failed { background-color: #dc3545; }
        .steps { margin-top: 10px; }
        .step { margin: 5px 0; padding: 5px; background: #f8f9fa; border-left: 3px solid #007bff; }
        .timestamp { color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Allure Report - TodoMVC Tests</h1>
            <p>Reporte generado el ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="stat">
                <div class="stat-number">${allResults.length}</div>
                <div class="stat-label">Tests Ejecutados</div>
            </div>
            <div class="stat">
                <div class="stat-number">${allResults.filter(r => r.status === 'passed').length}</div>
                <div class="stat-label">Exitosos</div>
            </div>
            <div class="stat">
                <div class="stat-number">${allResults.filter(r => r.status === 'failed').length}</div>
                <div class="stat-label">Fallidos</div>
            </div>
        </div>
        
        <h2>📋 Detalles de Tests</h2>
        ${allResults.map(result => `
            <div class="test-case">
                <div class="test-title">${result.name}</div>
                <div class="test-status status-${result.status}">${result.status.toUpperCase()}</div>
                <div class="timestamp">Duración: ${result.time}ms | Ejecutado: ${new Date(result.start).toLocaleString()}</div>
                ${result.steps ? `
                    <div class="steps">
                        <strong>Pasos:</strong>
                        ${result.steps.map(step => `
                            <div class="step">${step.name}</div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  
  // Crear directorio de reporte si no existe
  if (!fs.existsSync('allure-report')) {
    fs.mkdirSync('allure-report');
  }
  
  // Escribir archivo HTML
  fs.writeFileSync('allure-report/index.html', html);
  
  console.log('✅ Reporte HTML generado exitosamente!');
  console.log('📁 Ubicación: allure-report/index.html');
  console.log('🌐 Para abrir: npm run allure:open');
  
} catch (error) {
  console.error('❌ Error al generar el reporte:', error.message);
  process.exit(1);
}
