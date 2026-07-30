import { RegtestRpcProvider } from './lib/RegtestRpcProvider.js';

const INTERVAL_SECONDS = process.argv[2] ? Number(process.argv[2]) : 3;

async function main() {
  const provider = new RegtestRpcProvider();
  const minerAddr = await provider.rpcCall('getnewaddress');

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