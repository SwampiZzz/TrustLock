// scripts/test-rpc-connection.js
import { RegtestRpcProvider } from './lib/RegtestRpcProvider.js';

const provider = new RegtestRpcProvider();
const height = await provider.getBlockHeight();
console.log('Current block height:', height);
