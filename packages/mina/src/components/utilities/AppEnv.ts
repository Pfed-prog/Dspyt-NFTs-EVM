import { PublicKey } from 'o1js';

import { NFTContract } from '../../NFTsMapContract.js';

export function getAppString(): string {
  const appPubString: string =
    'B62qmAp5CtaqfnsDgo4EifFngiSXodZDjp98QjSwkgmFmHVAXGsjePb';
  return appPubString;
}

export function getAppPublic(): PublicKey {
  const appPubString: string = getAppString();
  const appPubKey: PublicKey = PublicKey.fromBase58(appPubString);
  return appPubKey;
}

export function getAppContract(): NFTContract {
  const zkAppAddress: PublicKey = getAppPublic();
  const zkApp: NFTContract = new NFTContract(zkAppAddress);
  return zkApp;
}

export function getAppVars(): {
  appPubString: string;
  appContract: NFTContract;
} {
  const appPubString: string = getAppString();
  const appContract: NFTContract = getAppContract();
  return { appPubString: appPubString, appContract: appContract };
}
