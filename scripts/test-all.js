// scripts/test-all.js
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

let pass = 0;
let fail = 0;

function runBash(scriptPath, label) {
  console.log(`\n>>> ${label}`);
  // Explicitly invoke bash so this works the same whether npm itself
  // was launched from PowerShell or WSL.
  const result = spawnSync('bash', [scriptPath], { cwd: ROOT, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`FATAL: ${label} failed (exit code ${result.status}). Stopping.`);
    process.exit(1);
  }
}

function runNodeScenario(scriptPath, label) {
  console.log(`\n=== Scenario: ${label} ===`);
  // Use process.execPath (the exact node binary running this file),
  // not "node" resolved from the shell's PATH.
  const result = spawnSync(process.execPath, [scriptPath], { cwd: ROOT, stdio: 'inherit' });
  if (result.status === 0) {
    console.log(`PASS: ${label}`);
    pass++;
  } else {
    console.log(`FAIL: ${label} (exit code ${result.status})`);
    fail++;
  }
}

console.log('>>> Round 1: deploy + release-to-seller');
runBash('scripts/reset-regtest-data.sh', 'reset');
runBash('scripts/start-regtest-node.sh', 'start');
runNodeScenario('scripts/deploy-trustlock.js', 'deploy');
runNodeScenario('scripts/release-to-seller.js', 'release-to-seller');

console.log('\n>>> Round 2: fresh deploy + arbiter-release-to-seller');
runBash('scripts/reset-regtest-data.sh', 'reset');
runBash('scripts/start-regtest-node.sh', 'start');
runNodeScenario('scripts/deploy-trustlock.js', 'deploy (for arbiter path)');
runNodeScenario('scripts/arbiter-release-to-seller.js', 'arbiter-release-to-seller');

console.log('\n==========================');
console.log(`Results: ${pass} passed, ${fail} failed`);
console.log('==========================');
process.exit(fail === 0 ? 0 : 1);