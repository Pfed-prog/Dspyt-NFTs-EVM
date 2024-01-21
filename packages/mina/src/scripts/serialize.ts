import { MerkleMap, MerkleTree } from 'o1js';

import {
  deserializeJsonToMerkleMap,
  serializeMerkleMapToJson,
  serializeMerkleToJsonOptimized,
} from '../components/serialize.js';
import { generateCollection } from '../components/NFT.js';
import {
  startBerkeleyClient,
  getEnvAddresses,
} from '../components/transactions.js';

startBerkeleyClient();

const { pubKey: pubKey, deployerKey: deployerKey } = getEnvAddresses();

const merkleMap: MerkleMap = new MerkleMap();
console.log('MerkleMap()', merkleMap.getRoot().toString());

const merkleTree: MerkleTree = new MerkleTree(3);
console.log('MerkleTree', merkleTree.getRoot().toString());

console.log('merkle tree height', merkleTree.height);

console.log('merkle tree leaf count', merkleTree.leafCount);

console.log('merkle tree get node', merkleTree.getNode(0, 0n).toBigInt());

generateCollection(pubKey, merkleMap);

console.log('merkleMap root', merkleMap.getRoot().toString());

const serializedJson: string = serializeMerkleMapToJson(merkleMap);

const map: MerkleMap = deserializeJsonToMerkleMap(serializedJson);

console.log('after serialize-deserialize', map.getRoot().toString());

console.log('merkleMap root', merkleTree.getRoot().toString());

/* console.time('123');

const exampleMerkleTreeJson = serializeMerkleTreeToJson(merkleTree);

console.timeEnd('123');

const exampleMerkleTree = deserializeJsonToMerkleTree(exampleMerkleTreeJson);

console.log(
  'after serialize-deserialize',
  exampleMerkleTree.getRoot().toString()
); */

await serializeMerkleToJsonOptimized(merkleTree);

//console.log(getZerosMerkleTree(merkleTree.height).toString());

//console.log(serializeMerkleTreeToJsonFull(exampleMerkleTree));
