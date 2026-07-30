import {compileFile} from "cashc"
import { Contract, ElectrumNetworkProvider } from "cashscript";


const artifact = compileFile("./TrustLock.cash");
const amount = 5000n
const sellerPkh = "22df947520c3abbba8aeda3983952fd826cf79fd";
const buyerPkh = "280f3f76ef1182b5b8109267971b90336f6dcae6";
const arbiterPkh = "07560da851445f4e8b3d7f7ee5beac6c68fbb2b6";
const args = [sellerPkh, buyerPkh, arbiterPkh]
const options = {
    provider: new ElectrumNetworkProvider("chipnet"),
    addressType: "p2sh32"
}


const contract = new Contract(artifact, args, options)
// console.log(contract.address);
// console.log(contract.tokenAddress)
const utxos = await contract.getUtxos()
const balance = await contract.getBalance()

console.log("Address: ", contract.address)
console.log("UTXO's: ", utxos)
console.log("Balance: ", balance)

