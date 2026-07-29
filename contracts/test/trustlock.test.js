import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { encodeCashAddress } from '@bitauth/libauth';
import { TransactionBuilder } from 'cashscript';
import {
  setupTrustLock,
  buyerPK,
  sellerPK,
  arbiterPK,
  buyerPKH,
  sellerPKH,
  arbiterPKH,
  buyerSigTemp,
  sellerSigTemp,
  arbiterSigTemp,
  MINER_FEE,
} from './helpers.js';

function pkhToAddress(pkh, contractAddress) {
  const prefix = contractAddress.split(':')[0];
  const { address } = encodeCashAddress({ prefix, type: 'p2pkh', payload: pkh });
  return address;
}

describe('TrustLock.deposit', () => {
  it('happy path: contract UTXO is funded with the expected amount of satoshis', async () => {
    const { contract, contractUTXO, totalDeposit } = setupTrustLock();

    assert.equal(contractUTXO.satoshis, totalDeposit);

    const balance = await contract.getBalance();
    assert.equal(balance, totalDeposit);
  });

  it('supports custom deposit amounts via overrides', async () => {
    const customDeposit = 50000n;
    const { contractUTXO, totalDeposit } = setupTrustLock({ totalDeposit: customDeposit });

    assert.equal(totalDeposit, customDeposit);
    assert.equal(contractUTXO.satoshis, customDeposit);
  });
});

describe('TrustLock.releaseToSeller', () => {
  it('happy path: buyer + seller cooperatively release funds to seller', async () => {
    const { provider, contract, contractUTXO, totalDeposit } = setupTrustLock();
    const sellerAddress = pkhToAddress(sellerPKH, contract.address);
    const expectedAmount = totalDeposit - MINER_FEE;

    const tx = await new TransactionBuilder({ provider })
      .addInput(contractUTXO, contract.unlock.releaseToSeller(buyerSigTemp, buyerPK, sellerSigTemp, sellerPK))
      .addOutput({ to: sellerAddress, amount: expectedAmount })
      .send();

    assert.ok(tx.txid);
  });

  it('fails when buyer signature is invalid (wrong key signs)', async () => {
    const { provider, contract, contractUTXO, totalDeposit } = setupTrustLock();
    const sellerAddress = pkhToAddress(sellerPKH, contract.address);
    const expectedAmount = totalDeposit - MINER_FEE;

    await assert.rejects(
      new TransactionBuilder({ provider })
        .addInput(contractUTXO, contract.unlock.releaseToSeller(arbiterSigTemp, buyerPK, sellerSigTemp, sellerPK))
        .addOutput({ to: sellerAddress, amount: expectedAmount })
        .send()
    );
  });

  it('fails when buyerPk does not match buyerPKH', async () => {
    const { provider, contract, contractUTXO, totalDeposit } = setupTrustLock();
    const sellerAddress = pkhToAddress(sellerPKH, contract.address);
    const expectedAmount = totalDeposit - MINER_FEE;

    await assert.rejects(
      new TransactionBuilder({ provider })
        .addInput(contractUTXO, contract.unlock.releaseToSeller(buyerSigTemp, sellerPK, sellerSigTemp, sellerPK))
        .addOutput({ to: sellerAddress, amount: expectedAmount })
        .send()
    );
  });

  it('fails when output amount does not equal input value + minerFee', async () => {
    const { provider, contract, contractUTXO, totalDeposit } = setupTrustLock();
    const sellerAddress = pkhToAddress(sellerPKH, contract.address);
    const wrongAmount = totalDeposit;

    await assert.rejects(
      new TransactionBuilder({ provider })
        .addInput(contractUTXO, contract.unlock.releaseToSeller(buyerSigTemp, buyerPK, sellerSigTemp, sellerPK))
        .addOutput({ to: sellerAddress, amount: wrongAmount })
        .send()
    );
  });

  it('fails when output goes to the wrong locking bytecode (not seller)', async () => {
    const { provider, contract, contractUTXO, totalDeposit } = setupTrustLock();
    const wrongAddress = pkhToAddress(buyerPKH, contract.address);
    const expectedAmount = totalDeposit - MINER_FEE;

    await assert.rejects(
      new TransactionBuilder({ provider })
        .addInput(contractUTXO, contract.unlock.releaseToSeller(buyerSigTemp, buyerPK, sellerSigTemp, sellerPK))
        .addOutput({ to: wrongAddress, amount: expectedAmount })
        .send()
    );
  });
});

describe('TrustLock.arbiterReleaseToSeller', () => {
  it('happy path: arbiter + seller release funds to seller', async () => {
    const { provider, contract, contractUTXO, totalDeposit } = setupTrustLock();
    const sellerAddress = pkhToAddress(sellerPKH, contract.address);
    const expectedAmount = totalDeposit - MINER_FEE;

    const tx = await new TransactionBuilder({ provider })
      .addInput(contractUTXO, contract.unlock.arbiterReleaseToSeller(arbiterSigTemp, arbiterPK, sellerSigTemp, sellerPK))
      .addOutput({ to: sellerAddress, amount: expectedAmount })
      .send();

    assert.ok(tx.txid);
  });

  it('fails when arbiter signature is invalid (wrong key signs)', async () => {
    const { provider, contract, contractUTXO, totalDeposit } = setupTrustLock();
    const sellerAddress = pkhToAddress(sellerPKH, contract.address);
    const expectedAmount = totalDeposit - MINER_FEE;

    await assert.rejects(
      new TransactionBuilder({ provider })
        .addInput(contractUTXO, contract.unlock.arbiterReleaseToSeller(buyerSigTemp, arbiterPK, sellerSigTemp, sellerPK))
        .addOutput({ to: sellerAddress, amount: expectedAmount })
        .send()
    );
  });

  it('fails when arbiterPk does not match arbiterPKH', async () => {
    const { provider, contract, contractUTXO, totalDeposit } = setupTrustLock();
    const sellerAddress = pkhToAddress(sellerPKH, contract.address);
    const expectedAmount = totalDeposit - MINER_FEE;

    await assert.rejects(
      new TransactionBuilder({ provider })
        .addInput(contractUTXO, contract.unlock.arbiterReleaseToSeller(arbiterSigTemp, buyerPK, sellerSigTemp, sellerPK))
        .addOutput({ to: sellerAddress, amount: expectedAmount })
        .send()
    );
  });

  it('fails when seller signature is missing/invalid', async () => {
    const { provider, contract, contractUTXO, totalDeposit } = setupTrustLock();
    const sellerAddress = pkhToAddress(sellerPKH, contract.address);
    const expectedAmount = totalDeposit - MINER_FEE;

    await assert.rejects(
      new TransactionBuilder({ provider })
        .addInput(contractUTXO, contract.unlock.arbiterReleaseToSeller(arbiterSigTemp, arbiterPK, buyerSigTemp, sellerPK))
        .addOutput({ to: sellerAddress, amount: expectedAmount })
        .send()
    );
  });

  it('fails when output amount is wrong', async () => {
    const { provider, contract, contractUTXO, totalDeposit } = setupTrustLock();
    const sellerAddress = pkhToAddress(sellerPKH, contract.address);
    const wrongAmount = totalDeposit + MINER_FEE + 1n;

    await assert.rejects(
      new TransactionBuilder({ provider })
        .addInput(contractUTXO, contract.unlock.arbiterReleaseToSeller(arbiterSigTemp, arbiterPK, sellerSigTemp, sellerPK))
        .addOutput({ to: sellerAddress, amount: wrongAmount })
        .send()
    );
  });
});