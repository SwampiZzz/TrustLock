import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RegtestRpcProvider } from './lib/RegtestRpcProvider.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '.bchn-regtest-data');
const MINER_ADDR_FILE = path.join(DATA_DIR, 'miner-address.txt');

const INTERVAL_SECONDS = process.argv[2] ? Number(process.argv[2]) : 3;

async function main() {
  const provider = new RegtestRpcProvider();

  let minerAddr;
  if (fs.existsSync(MINER_ADDR_FILE)) {
    minerAddr = fs.readFileSync(MINER_ADDR_FILE, 'utf8').trim();
  } else {
    minerAddr = await provider.rpcCall('getnewaddress');
    fs.writeFileSync(MINER_ADDR_FILE, minerAddr);
  }

  console.log(`Mining 1 block every ${INTERVAL_SECONDS}s to ${minerAddr}. Ctrl+C to stop.`);

  setInterval(async () => {
    try {
      const hashes = await provider.rpcCall('generatetoaddress', [1, minerAddr]);
      const height = await provider.getBlockHeight();
      console.log(`Mined block ${hashes[0]} — height now ${height}`);
    } catch (err) {
      console.error('Mining error:', err.message);
    }
  }, INTERVAL_SECONDS * 1000);
}

main();