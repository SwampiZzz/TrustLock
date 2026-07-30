import { cashAddressToLockingBytecode, binToHex } from '@bitauth/libauth';

const RPC_URL = process.env.BCHN_RPC_URL || 'http://127.0.0.1:18443';
const RPC_USER = process.env.BCHN_RPC_USER || 'trustlock';
const RPC_PASS = process.env.BCHN_RPC_PASS || 'trustlock';

/**
 * Minimal NetworkProvider implementation for CashScript, talking directly
 * to bitcoind's JSON-RPC (regtest). Implements the 5 methods CashScript's
 * NetworkProvider interface requires:
 *   getUtxos, getUtxosForLockingBytecode, getBlockHeight,
 *   getRawTransaction, sendRawTransaction
 *
 * Uses scantxoutset (a stateless UTXO-set scan) so no wallet bookkeeping
 * (importaddress, etc.) is required — just a running node with -txindex=1.
 */
export class RegtestRpcProvider {
  constructor({ rpcUrl = RPC_URL, rpcUser = RPC_USER, rpcPassword = RPC_PASS } = {}) {
    this.rpcUrl = rpcUrl;
    this.rpcUser = rpcUser;
    this.rpcPassword = rpcPassword;
    this.network = 'regtest'; // <-- add this line; Contract reads this to derive the bchreg: address prefix
  }

  async rpcCall(method, params = []) {
    const auth = Buffer.from(`${this.rpcUser}:${this.rpcPassword}`).toString('base64');

    const response = await fetch(this.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: 'trustlock',
        method,
        params,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`RPC HTTP error ${response.status}: ${text}`);
    }

    const json = await response.json();
    if (json.error) {
      throw new Error(`RPC error: ${json.error.message} (code ${json.error.code})`);
    }
    return json.result;
  }

  async getBlockHeight() {
    return this.rpcCall('getblockcount');
  }

  async getRawTransaction(txid) {
    // verbose=false returns raw hex
    return this.rpcCall('getrawtransaction', [txid, false]);
  }

  async sendRawTransaction(txHex) {
    return this.rpcCall('sendrawtransaction', [txHex]);
  }

  async getUtxosForLockingBytecode(lockingBytecodeHex) {
    const scan = await this.rpcCall('scantxoutset', ['start', [`raw(${lockingBytecodeHex})`]]);

    if (!scan.success) {
      throw new Error('scantxoutset scan did not complete successfully');
    }

    return scan.unspents.map((u) => ({
      txid: u.txid,
      vout: u.vout,
      satoshis: BigInt(Math.round(u.amount * 1e8)),
    }));
  }

  async getUtxos(address) {
    const result = cashAddressToLockingBytecode(address);
    if (typeof result === 'string') {
      throw new Error(`Failed to decode address ${address}: ${result}`);
    }
    return this.getUtxosForLockingBytecode(binToHex(result.bytecode));
  }
}