import { Contract, MockNetworkProvider, randomUtxo, SignatureTemplate, TransactionBuilder } from 'cashscript';
import { hash160 } from '@cashscript/utils';
import { secp256k1 } from '@bitauth/libauth';
import artifact from '../artifacts/TrustLock.json' with { type: 'json' };

const BUYER_KEY = Uint8Array.from(Buffer.from('11'.repeat(32), 'hex'));
const SELLER_KEY = Uint8Array.from(Buffer.from('22'.repeat(32), 'hex'));
const ARBITER_KEY = Uint8Array.from(Buffer.from('33'.repeat(32), 'hex'));

function pubkeyOf(privKey) {
  const result = secp256k1.derivePublicKeyCompressed(privKey);
  if (typeof result === 'string') throw new Error(result);
  return result;
}

export const buyerPK = pubkeyOf(BUYER_KEY);
export const sellerPK = pubkeyOf(SELLER_KEY);
export const arbiterPK = pubkeyOf(ARBITER_KEY);

export const buyerPKH = hash160(buyerPK);
export const sellerPKH = hash160(sellerPK);
export const arbiterPKH = hash160(arbiterPK);

export const buyerSigTemp = new SignatureTemplate(BUYER_KEY);
export const sellerSigTemp = new SignatureTemplate(SELLER_KEY);
export const arbiterSigTemp = new SignatureTemplate(ARBITER_KEY);

export const TOTAL_DEPOSIT = 20000n;
export const MINER_FEE = 1000n;
export const DUST_LIMIT = 546n;

/**
 * Constructor arg order matches: TrustLock(arbiterPKH, buyerPKH, sellerPKH)
 */
export function setupTrustLock(overrides = {}) {
  const totalDeposit = overrides.totalDeposit ?? TOTAL_DEPOSIT;

  const provider = new MockNetworkProvider();
  const contract = new Contract(
    artifact,
    [arbiterPKH, buyerPKH, sellerPKH],
    { provider },
  );

  const contractUTXO = provider.addUtxo(
    contract.address,
    randomUtxo({ satoshis: totalDeposit }),
  );

  return { provider, contract, contractUTXO, totalDeposit };
}

export { TransactionBuilder };