import { Contract } from 'cashscript';
import artifact from '../contracts/artifacts/TrustLock.json' with { type: 'json' };
import { RegtestRpcProvider } from './lib/RegtestRpcProvider.js';
import { buyerPKH, sellerPKH, arbiterPKH } from '../contracts/test/helpers.js';

const DEPOSIT_BCH = process.argv[2] ? Number(process.argv[2]) : 0.01; // default 0.01 BCH = 1,000,000 sats

async function main() {
  const provider = new RegtestRpcProvider();

  const contract = new Contract(
    artifact,
    [arbiterPKH, buyerPKH, sellerPKH], // must match constructor order: arbiterPKH, buyerPKH, sellerPKH
    { provider },
  );

  console.log('Contract address:', contract.address);

  // Fund the contract from bitcoind's own wallet (the 101 mined blocks gave it a spendable balance)
  console.log(`Sending ${DEPOSIT_BCH} BCH to contract...`);
  const txid = await provider.rpcCall('sendtoaddress', [contract.address, DEPOSIT_BCH]);
  console.log('Funding txid:', txid);

  // Confirm it with a block
  const minerAddr = await provider.rpcCall('getnewaddress');
  await provider.rpcCall('generatetoaddress', [1, minerAddr]);
  console.log('Mined 1 confirmation block.');

  // Verify the deposit landed as a spendable UTXO on the contract
  const utxos = await contract.getUtxos();
  console.log('Contract UTXOs:', utxos);

  const balance = await contract.getBalance();
  console.log('Contract balance (sats):', balance.toString());
}

main().catch((err) => {
  console.error('Deploy failed:', err);
  process.exit(1);
});