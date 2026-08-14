import type {
  FullConfig, FullResult, Reporter, Suite, TestCase, TestResult
} from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

class HTMLTestBookReporter implements Reporter {
  private results: any[] = [];

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const annotations = test.annotations;
    
    const getAnnotation = (type: string) => annotations.find(a => a.type === type)?.description || 'N/A';

    this.results.push({
      testCaseId: getAnnotation('testCaseId'),
      featureName: getAnnotation('featureName'),
      inputData: getAnnotation('inputData'),
      expectedOutcome: getAnnotation('expectedOutcome'),
      actualOutput: getAnnotation('actualOutput') || (result.status === 'passed' ? 'As expected' : result.error?.message || 'Failed'),
      eventTraceLogs: getAnnotation('eventTraceLogs') || 'No trace provided',
      status: result.status === 'passed' ? 'PASSED' : 'FAILED',
      title: test.title,
    });
  }

  onEnd(result: FullResult) {
    console.log(`Finished the run: ${result.status}`);
    this.generateHtmlReport();
  }

  generateHtmlReport() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invecho QA Test Book</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        .test-case { background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 24px; padding: 20px; border-left: 6px solid #ccc; }
        .test-case.passed { border-left-color: #2ecc71; }
        .test-case.failed { border-left-color: #e74c3c; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 15px; font-weight: bold; color: white; float: right; }
        .status.passed { background: #2ecc71; }
        .status.failed { background: #e74c3c; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
        .meta-item { background: #f8f9fa; padding: 10px; border-radius: 4px; border: 1px solid #e9ecef; }
        .meta-label { font-size: 0.85em; text-transform: uppercase; color: #6c757d; font-weight: bold; margin-bottom: 5px; }
        pre { background: #2b2b2b; color: #f8f8f2; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 0.9em; margin-top: 5px; white-space: pre-wrap; }
        .full-width { grid-column: 1 / -1; }
    </style>
</head>
<body>
    <h1>Invecho QA Test Book / Execution Log</h1>
    <p>Generated on: ${new Date().toLocaleString()}</p>

    ${this.results.map(r => `
    <div class="test-case ${r.status.toLowerCase()}">
        <div class="status ${r.status.toLowerCase()}">${r.status}</div>
        <h2>${r.testCaseId}: ${r.featureName}</h2>
        <p><strong>Scenario:</strong> ${r.title}</p>
        
        <div class="meta-grid">
            <div class="meta-item">
                <div class="meta-label">Input Data / Payload</div>
                <pre>${this.escapeHtml(r.inputData)}</pre>
            </div>
            <div class="meta-item">
                <div class="meta-label">Expected Outcome</div>
                <pre>${this.escapeHtml(r.expectedOutcome)}</pre>
            </div>
            <div class="meta-item">
                <div class="meta-label">Actual Output</div>
                <pre>${this.escapeHtml(r.actualOutput)}</pre>
            </div>
            <div class="meta-item full-width">
                <div class="meta-label">Event Trace Logs</div>
                <pre>${this.escapeHtml(r.eventTraceLogs)}</pre>
            </div>
        </div>
    </div>
    `).join('')}
    
    ${this.results.length === 0 ? '<p>No tests were executed.</p>' : ''}
</body>
</html>`;

    const outDir = path.resolve(__dirname, '../docs/qa');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.writeFileSync(path.join(outDir, 'test-book.html'), html, 'utf-8');
    console.log('HTML Test Book generated at docs/qa/test-book.html');
  }

  private escapeHtml(unsafe: string) {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }
}

export default HTMLTestBookReporter;
