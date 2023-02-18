import * as tsl from '@harmoniclabs/plu-ts';
import {
  DEFAULT_PROTOCOL_PARAMETERS, POLICY_ID_LENGTH, SUPPORTED_WALLETS,
} from '@mesh/common/constants';
import { ISigner, ISubmitter } from '@mesh/common/contracts';
import {
  fromUTF8, resolveFingerprint, toUTF8,
} from '@mesh/common/utils';
import type {
  Asset, AssetExtended, DataSignature, UTxO, Wallet,
} from '@mesh/common/types';

export class BrowserWallet implements ISigner, ISubmitter {
  private constructor(private readonly _walletInstance: WalletInstance) {}

  static getInstalledWallets(): Wallet[] {
    if (window.cardano === undefined) return [];

    return SUPPORTED_WALLETS
      .filter((sw) => window.cardano[sw] !== undefined)
      .map((sw) => ({
        name: window.cardano[sw].name,
        icon: window.cardano[sw].icon,
        version: window.cardano[sw].apiVersion,
      }));
  }

  static async enable(walletName: string): Promise<BrowserWallet> {    
    try {
      const walletInstance = await BrowserWallet.resolveInstance(walletName);

      if (walletInstance !== undefined)
        return new BrowserWallet(walletInstance);

      throw new Error(`Couldn't create an instance of wallet: ${walletName}`);
    } catch (error) {
      throw new Error(`[BrowserWallet] An error occurred during enable: ${error}.`);
    }
  }

  async getBalance(): Promise<Asset[]> {
    const balance = await this._walletInstance.getBalance();
    return fromValue(tsl.Value.fromCbor(balance));
  }

  async getChangeAddress(): Promise<string> {
    const changeAddress = await this._walletInstance.getChangeAddress();
    return tsl.Address.fromCbor(changeAddress).toString();
  }

  async getCollateral(
    limit = DEFAULT_PROTOCOL_PARAMETERS.maxCollateralInputs,
  ): Promise<UTxO[]> {
    const deserializedCollateral = await this.getUsedCollateral(limit);
    return deserializedCollateral.map((dc) => fromTxUnspentOutput(dc));
  }

  getNetworkId(): Promise<number> {
    return this._walletInstance.getNetworkId();
  }

  async getRewardAddresses(): Promise<string[]> {
    const rewardAddresses = await this._walletInstance.getRewardAddresses();
    return rewardAddresses.map((ra) => tsl.Address.fromCbor(ra).toString());
  }

  async getUnusedAddresses(): Promise<string[]> {
    const unusedAddresses = await this._walletInstance.getUnusedAddresses();
    return unusedAddresses.map((una) => tsl.Address.fromCbor(una).toString());
  }

  async getUsedAddresses(): Promise<string[]> {
    const usedAddresses = await this._walletInstance.getUsedAddresses();
    return usedAddresses.map((usa) => tsl.Address.fromCbor(usa).toString());
  }

  async getUtxos(): Promise<UTxO[]> {
    const deserializedUTxOs = await this.getUsedUTxOs();
    return deserializedUTxOs.map((du) => fromTxUnspentOutput(du));
  }

  signData(address: string, payload: string): Promise<DataSignature> {
    const signerAddress = tsl.Address.fromString(address).toCbor().toString();
    return this._walletInstance.signData(signerAddress, fromUTF8(payload));
  }

  async signTx(unsignedTx: string, partialSign = false): Promise<string> {
    try {
      const tx = tsl.Tx.fromCbor(unsignedTx);

      const newWitnessSet = await this._walletInstance
        .signTx(unsignedTx, partialSign);

      const newSignatures = tsl.TxWitnessSet.fromCbor(newWitnessSet)
        .vkeyWitnesses ?? [];

      const txWitnessSet = mergeSignatures(
        tx.witnesses,
        newSignatures,
      );

      const signedTx = new tsl.Tx({
        ...tx, witnesses: txWitnessSet,
      }).toCbor().toString();

      return signedTx;
    } catch (error) {
      throw new Error(`[BrowserWallet] An error occurred during signTx: ${JSON.stringify(error)}.`);
    }
  }

  submitTx(tx: string): Promise<string> {
    return this._walletInstance.submitTx(tx);
  }

  async getUsedAddress(): Promise<tsl.Address> {
    const usedAddresses = await this._walletInstance.getUsedAddresses();
    return tsl.Address.fromCbor(usedAddresses[0]);
  }

  async getUsedCollateral(
    limit = DEFAULT_PROTOCOL_PARAMETERS.maxCollateralInputs,
  ): Promise<tsl.UTxO[]> {
    const collateral = (await this._walletInstance.experimental.getCollateral()) ?? [];
    return collateral.map((c) => tsl.UTxO.fromCbor(c)).slice(0, limit);
  }

  async getUsedUTxOs(): Promise<tsl.UTxO[]> {
    const utxos = (await this._walletInstance.getUtxos()) ?? [];
    return utxos.map((u) => tsl.UTxO.fromCbor(u));
  }

  async getAssets(): Promise<AssetExtended[]> {
    const balance = await this.getBalance();
    return balance
      .filter((v) => v.unit !== 'lovelace')
      .map((v) => {
        const policyId = v.unit.slice(0, POLICY_ID_LENGTH);
        const assetName = v.unit.slice(POLICY_ID_LENGTH);
        const fingerprint = resolveFingerprint(policyId, assetName);

        return {
          unit: v.unit,
          policyId,
          assetName: toUTF8(assetName),
          fingerprint,
          quantity: v.quantity
        };
      });
  }

  async getLovelace(): Promise<string> {
    const balance = await this.getBalance();
    const nativeAsset = balance.find((v) => v.unit === 'lovelace');

    return nativeAsset !== undefined ? nativeAsset.quantity : '0';
  }

  async getPolicyIdAssets(policyId: string): Promise<AssetExtended[]> {
    const assets = await this.getAssets();
    return assets.filter((v) => v.policyId === policyId);
  }

  async getPolicyIds(): Promise<string[]> {
    const balance = await this.getBalance();
    return Array.from(
      new Set(balance.map((v) => v.unit.slice(0, POLICY_ID_LENGTH))),
    ).filter((p) => p !== 'lovelace');
  }

  private static resolveInstance(walletName: string) {
    if (window.cardano === undefined)
      return undefined;

    const wallet = SUPPORTED_WALLETS
      .map((sw) => window.cardano[sw])
      .filter((sw) => sw !== undefined)
      .find((sw) => sw.name.toLowerCase() === walletName.toLowerCase());

    return wallet?.enable();
  }
}

declare global {
  interface Window {
    cardano: Cardano;
  }
}

type Cardano = {
  [key: string]: {
    name: string;
    icon: string;
    apiVersion: string;
    enable: () => Promise<WalletInstance>;
  };
};

type WalletInstance = {
  experimental: ExperimentalFeatures;
  getBalance(): Promise<string>;
  getChangeAddress(): Promise<string>;
  getNetworkId(): Promise<number>;
  getRewardAddresses(): Promise<string[]>;
  getUnusedAddresses(): Promise<string[]>;
  getUsedAddresses(): Promise<string[]>;
  getUtxos(): Promise<string[] | undefined>;
  signData(address: string, payload: string): Promise<DataSignature>;
  signTx(tx: string, partialSign: boolean): Promise<string>;
  submitTx(tx: string): Promise<string>;
};

type ExperimentalFeatures = {
  getCollateral(): Promise<string[] | undefined>;
};

function fromValue(value: tsl.Value): Asset[] {
  return value.map.flatMap(({ policy, assets }) => {
    return policy === ''
      ? { unit: 'lovelace', quantity: assets[''].toString() }
      : Object.keys(assets).map((assetName) => ({
          unit: `${policy.toString()}${fromUTF8(assetName)}`,
          quantity: assets[assetName].toString()
        }));
  });
}

function fromTxUnspentOutput(utxo: tsl.UTxO): UTxO {
  const dataHash = tsl.isData(utxo.resolved.datum)
    ? tsl.hashData(utxo.resolved.datum)
    : utxo.resolved.datum?.toString();

  const plutusData = tsl.isData(utxo.resolved.datum)
    ? tsl.dataToCbor(utxo.resolved.datum).toString()
    : undefined;

  const scriptRef = utxo.resolved.refScript?.toCbor().toString();

  return <UTxO>{
    input: {
      outputIndex: utxo.utxoRef.index,
      txHash: utxo.utxoRef.id.toString(),
    },
    output: {
      address: utxo.resolved.address.toString(),
      amount: fromValue(utxo.resolved.value),
      dataHash, plutusData, scriptRef,
    },
  };
}

function mergeSignatures(txWitnessSet: tsl.TxWitnessSet, newSignatures: tsl.VKeyWitness[]) {
  const txSignatures = txWitnessSet.vkeyWitnesses;

  if (txSignatures !== undefined) {
    const signatures = new Set<string>();

    txSignatures.forEach((signature) => {
      signatures.add(signature.toCbor().toString());
    });

    newSignatures.forEach((signature) => {
      signatures.add(signature.toCbor().toString());
    });

    return new tsl.TxWitnessSet({
      ...txWitnessSet,
      vkeyWitnesses: [...signatures].map(
        (signature) => tsl.VKeyWitness.fromCbor(signature)
      )
    });
  }

  return new tsl.TxWitnessSet({
    ...txWitnessSet,
    vkeyWitnesses: newSignatures
  });
}
