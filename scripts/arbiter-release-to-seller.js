import { Contract, TransactionBuilder } from 'cashscript';
import { encodeCashAddress } from '@bitauth/libauth';
import artifact from '../contracts/artifacts/TrustLock.json' with { type: 'json' };
import { RegtestRpcProvider } from './lib/RegtestRpcProvider.js';
import {
  arbiterPK,
  sellerPK,
  buyerPKH,
  sellerPKH,
  arbiterPKH,
  arbiterSigTemp,
  sellerSigTemp,
  MINER_FEE,
} from '../contracts/test/helpers.js';

function pkhToAddress(pkh, contractAddress) {
  const prefix = contractAddress.split(':')[0];
  const { address } = encodeCashAddress({ prefix, type: 'p2pkh', payload: pkh });
  return address;
}

async function main() {
  const provider = new RegtestRpcProvider();

  const contract = new Contract(
    artifact,
    [arbiterPKH, buyerPKH, sellerPKH],
    { provider },
  );

  const utxos = await contract.getUtxos();
  if (utxos.length === 0) {
    throw new Error('No UTXOs found on contract — did you run deploy-trustlock.js first?');
  }

  const contractUTXO = utxos[0];
  console.log('Spending contract UTXO:', contractUTXO);

  const sellerAddress = pkhToAddress(sellerPKH, contract.address);
  const releaseAmount = contractUTXO.satoshis - MINER_FEE;

  console.log('Arbiter releasing to seller address:', sellerAddress);
  console.log('Release amount (sats):', releaseAmount.toString());

  const tx = await new TransactionBuilder({ provider })
    .addInput(contractUTXO, contract.unlock.arbiterReleaseToSeller(arbiterSigTemp, arbiterPK, sellerSigTemp, sellerPK))
    .addOutput({ to: sellerAddress, amount: releaseAmount })
    .send();

  console.log('Broadcast txid:', tx.txid);

  const minerAddr = await provider.rpcCall('getnewaddress');
  await provider.rpcCall('generatetoaddress', [1, minerAddr]);
  console.log('Mined 1 confirmation block.');

  const sellerUtxos = await provider.getUtxos(sellerAddress);
  console.log('Seller UTXOs after arbiter release:', sellerUtxos);
}

main().catch((err) => {
  console.error('Arbiter release failed:', err);
  process.exit(1);
});