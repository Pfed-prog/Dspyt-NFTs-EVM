import { MerkleMapContract } from './MerkleMapContract.js';
import {
  Field,
  Mina,
  PrivateKey,
  AccountUpdate,
  MerkleMap,
  CircuitString,
  Poseidon,
} from 'o1js';

const proofsEnabled = false;

const Local = Mina.LocalBlockchain({ proofsEnabled: proofsEnabled });

Mina.setActiveInstance(Local);

const { privateKey: deployerKey, publicKey: deployerAccount } =
  Local.testAccounts[0];
const { privateKey: deployerKey2, publicKey: deployerAccount2 } =
  Local.testAccounts[1];

console.log('deployerPrivateKey: ' + deployerKey.toBase58());
console.log('deployerAccount: ' + deployerAccount.toBase58());

// ----------------------------------------------------

let verificationKey: any;

if (proofsEnabled) {
  ({ verificationKey } = await MerkleMapContract.compile());
  //console.log(verificationKey.hash);
}

console.log('compiled');

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

const zkAppInstance = new MerkleMapContract(zkAppAddress);

const deployTxn = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy({ verificationKey, zkappKey: zkAppPrivateKey });
});

await deployTxn.prove();

await deployTxn.sign([deployerKey]).send();

const mapRoot = zkAppInstance.mapRoot.get();

console.log('state after deploy rootMap:', mapRoot.toString());

const map = new MerkleMap();

const key = Field(100);
const value = Field(50);

map.set(key, value);

console.log('value for key', key.toString() + ':', map.get(key).toString());

const rootBefore = map.getRoot();

console.log(rootBefore.toString());

const witness = map.getWitness(key);

const init_txn = await Mina.transaction(deployerAccount, () => {
  zkAppInstance.initRoot(rootBefore);
});

await init_txn.prove();
await init_txn.sign([deployerKey]).send();

console.log('initialized root');

const mapRoot1 = zkAppInstance.mapRoot.get();
const treeRoot1 = zkAppInstance.treeRoot.get();

console.log('mapRoot state after init: ', mapRoot1.toString());
console.log('treeRoot state after init: ', treeRoot1.toString());

const txn2 = await Mina.transaction(deployerAccount, () => {
  zkAppInstance.update(witness, key, value, Field(5));
});

await txn2.prove();
await txn2.sign([deployerKey]).send();

const mapRoot2 = zkAppInstance.mapRoot.get();
const treeRoot2 = zkAppInstance.treeRoot.get();

console.log('mapRoot state after init tx2: ', mapRoot2.toString());
console.log('treeRoot state after init tx2: ', treeRoot2.toString());

const txn3 = await Mina.transaction(deployerAccount2, () => {
  zkAppInstance.update(witness, key, value, Field(5));
});

await txn3.prove();
await txn3.sign([deployerKey2]).send();

const mapRoot3 = zkAppInstance.mapRoot.get();
const treeRoot3 = zkAppInstance.treeRoot.get();

console.log('mapRoot state after init tx3: ', mapRoot3.toString());
console.log('treeRoot state after init tx3: ', treeRoot3.toString());

const key2 = Field(10);
const value2 = Field(0);

const witness2 = map.getWitness(key2);

console.log('value for key', key2.toString() + ':', map.get(key2).toString());

const txn4 = await Mina.transaction(deployerAccount, () => {
  zkAppInstance.update(witness2, key2, value2, Field(5));
});

await txn4.prove();
await txn4.sign([deployerKey]).send();

const mapRoot4 = zkAppInstance.mapRoot.get();
const treeRoot4 = zkAppInstance.treeRoot.get();

console.log('mapRoot state after init tx4: ', mapRoot4.toString());
console.log('treeRoot state after init tx4: ', treeRoot4.toString());

const key3 = Poseidon.hash(CircuitString.fromString('qwert').toFields());
const value3 = Field(0);

const witness3 = map.getWitness(key3);

console.log('value for key', key3.toString() + ':', map.get(key3).toString());

const txn5 = await Mina.transaction(deployerAccount, () => {
  zkAppInstance.update(witness3, key3, value3, Field(5));
});

await txn5.prove();
await txn5.sign([deployerKey]).send();

const mapRoot5 = zkAppInstance.mapRoot.get();
const treeRoot5 = zkAppInstance.treeRoot.get();

console.log('mapRoot state after init tx5: ', mapRoot5.toString());
console.log('treeRoot state after init tx5: ', treeRoot5.toString());

try {
  const fail_txn = await Mina.transaction(deployerAccount, () => {
    zkAppInstance.initRoot(rootBefore);
  });

  await fail_txn.prove();
  await fail_txn.sign([deployerKey]).send();
} catch {
  console.log('failed sucessfully');
}