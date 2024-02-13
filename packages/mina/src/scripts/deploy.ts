import { deployApp, startBerkeleyClient } from '../components/transactions.js';
import { getEnvAccount } from '../components/env.js';

startBerkeleyClient();

const { pk: deployerKey, pubKey: pubKey } = getEnvAccount();

console.log('deployer:', pubKey.toBase58());

const { zkAppPk: pk } = await deployApp(deployerKey);

console.log('app private key:', pk.toBase58());

console.log('app public key:', pk.toPublicKey().toBase58());
