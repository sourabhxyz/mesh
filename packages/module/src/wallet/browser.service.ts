import * as tsl from '@harmoniclabs/plu-ts';
import {
  DEFAULT_PROTOCOL_PARAMETERS, POLICY_ID_LENGTH, SUPPORTED_WALLETS,
} from '@mesh/common/constants';
import { ISigner, ISubmitter } from '@mesh/common/contracts';
import {
  fromBytes, fromUTF8, resolveFingerprint, toUTF8,
} from '@mesh/common/utils';
import type {
  Asset, AssetExtended, DataSignature, UTxO, Wallet,
} from '@mesh/common/types';

export class BrowserWallet implements ISigner, ISubmitter {
  private constructor(private readonly _walletInstance: WalletInstance) {}

  /**
   * Returns a list of wallets installed on user's device.
   * Each wallet is represented by an object with the following properties:
   * * A name is provided to display wallet's name on the user interface.
   * * A version is provided to display wallet's version on the user interface.
   * * An icon is provided to display wallet's icon on the user interface.
   * @returns {Wallet[]}
   * @see {@link https://meshjs.dev/apis/browserwallet#getInstallWallets}
   * @example
   * ```typescript
   * const wallets = BrowserWallet.getInstalledWallets();
   * ```
  */
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

  /**
   * This is the entrypoint to start communication with the user's wallet. 
   * The wallet should request the user's permission to connect the web page to the user's wallet, and if permission has been granted, the wallet will be returned and exposing the full API for the dApp to use.
   * @param walletName
   * @returns {Promise<BrowserWallet>}
   * @see {@link https://meshjs.dev/apis/browserwallet#connectWallet}
   * @example
   * ```typescript
   * const wallet = await BrowserWallet.enable('eternl');
   * ```
   */
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

  /**
   * Returns a list of assets in the wallet.
   * @returns {Promise<Asset[]>}
   * @see {@link https://meshjs.dev/apis/browserwallet#getBalance}
   * @example
   * ```typescript
   * const balance = await wallet.getBalance();
   * ```
   */
  async getBalance(): Promise<Asset[]> {
    const balance = await this._walletInstance.getBalance();
    return fromValue(tsl.Value.fromCbor(balance));
  }

  /**
   * Returns an address owned by the wallet that should be used as a change address to return leftover assets during transaction creation back to the connected wallet.
   * @returns {Promise<string>}
   * @see {@link https://meshjs.dev/apis/browserwallet#getChangeAddress}
   * @example
   * ```typescript
   * const changeAddress = await wallet.getChangeAddress();
   * ```
   */
  async getChangeAddress(): Promise<string> {
    const changeAddress = await this._walletInstance.getChangeAddress();
    return tsl.Address.fromBytes(changeAddress).toString();
  }

  /**
   * This function shall return a list of one or more UTXOs (unspent transaction outputs) controlled by the wallet that are required to reach AT LEAST the combined ADA value target specified in amount AND the best suitable to be used as collateral inputs for transactions with plutus script inputs (pure ADA-only utxos).
   * If this cannot be attained, an error message with an explanation of the blocking problem shall be returned. NOTE: wallets are free to return utxos that add up to a greater total ADA value than requested in the amount parameter, but wallets must never return any result where utxos would sum up to a smaller total ADA value, instead in a case like that an error message must be returned.
   * @param limit - The maximum number of collateral inputs to return.
   * @returns {Promise<UTxO[]>}
   * @see {@link https://meshjs.dev/apis/browserwallet#getCollateral}
   * @example
   * ```typescript
   * const collateral = await wallet.getCollateral();
   * ```
   */
  async getCollateral(
    limit = DEFAULT_PROTOCOL_PARAMETERS.maxCollateralInputs,
  ): Promise<UTxO[]> {
    const deserializedCollateral = await this.getUsedCollateral(limit);
    return deserializedCollateral.map((dc) => fromTxUnspentOutput(dc));
  }

  /**
   * Returns the network ID of the currently connected account. 
   * `0` is testnet and `1` is mainnet but other networks can possibly be returned by wallets. Those other network ID values are not governed by CIP-30. This result will stay the same unless the connected account has changed.
   * @returns {Promise<number>}
   * @see {@link https://meshjs.dev/apis/browserwallet#getNetworkId}
   * @example
   * ```typescript
   * const networkId = await wallet.getNetworkId();
   * ```
   */
  getNetworkId(): Promise<number> {
    return this._walletInstance.getNetworkId();
  }

  /**
   * Returns a list of reward addresses owned by the wallet.
   * A reward address is a stake address that is used to receive rewards from staking, generally starts from `stake` prefix.
   * @returns {Promise<string[]>}
   * @see {@link https://meshjs.dev/apis/browserwallet#getRewardAddresses}
   * @example
   * ```typescript
   * const rewardAddresses = await wallet.getRewardAddresses();
   * ```
   */
  async getRewardAddresses(): Promise<string[]> {
    const rewardAddresses = await this._walletInstance.getRewardAddresses();
    return rewardAddresses.map((ra) => tsl.StakeAddress.fromBytes(
      ra.length === 29 * 2 ? ra.slice(2) : ra
    ).toString());
  }

  /**
   * Returns a list of unused addresses controlled by the wallet.
   * @returns {Promise<string[]>}
   * @see {@link https://meshjs.dev/apis/browserwallet#getUnusedAddresses}
   * @example
   * ```typescript
   * const usedAddresses = await wallet.getUnusedAddresses();
   * ```
   */
  async getUnusedAddresses(): Promise<string[]> {
    const unusedAddresses = await this._walletInstance.getUnusedAddresses();
    return unusedAddresses.map((una) => tsl.Address.fromBytes(una).toString());
  }

  /**
   * Returns a list of used addresses controlled by the wallet.
   * @returns {Promise<string[]>}
   * @see {@link https://meshjs.dev/apis/browserwallet#getUsedAddresses}
   * @example
   * ```typescript
   * const usedAddresses = await wallet.getUsedAddresses();
   * ```
   */
  async getUsedAddresses(): Promise<string[]> {
    const usedAddresses = await this._walletInstance.getUsedAddresses();
    return usedAddresses.map((usa) => tsl.Address.fromBytes(usa).toString());
  }

  /**
   * Return a list of all UTXOs (unspent transaction outputs) controlled by the wallet.
   * @returns {Promise<UTxO[]>}
   * @see {@link https://meshjs.dev/apis/browserwallet#getUtxos}
   * @example
   * ```typescript
   * const utxos = await wallet.getUtxos();
   * ```
   */
  async getUtxos(): Promise<UTxO[]> {
    const deserializedUTxOs = await this.getUsedUTxOs();
    return deserializedUTxOs.map((du) => fromTxUnspentOutput(du));
  }

  /**
   * This endpoint utilizes the CIP-8 to sign arbitrary data, to verify the data was signed by the owner of the private key.
   * @param {string} address Get address from getUsedAddresses() or getRewardAddresses() endpoint
   * @param payload Data to be signed
   * @returns {Promise<DataSignature>}
   * @see {@link https://meshjs.dev/apis/browserwallet#signData}
   * @example
   * ```typescript
   * const addresses = await wallet.getUsedAddresses();
   * const signature = await wallet.signData(addresses[0], 'mesh');
   * ```
   */
  signData(address: string, payload: string): Promise<DataSignature> {
    const signerAddress = tsl.Address.fromString(address).toCbor().toString();
    return this._walletInstance.signData(signerAddress, fromUTF8(payload));
  }

  /**
   * Requests user to sign the provided transaction. The wallet should ask the user for permission, and if given, try to sign the supplied body and return a signed transaction. `partialSign` should be `true` if the transaction provided requires multiple signatures.
   * @param {Transaction} unsignedTx The Transaction object to be signed
   * @param {boolean} partialSign Must be true if the transaction provided requires multiple signatures. The default value is `false`.
   * @returns {Promise<Transaction>}
   * @see {@link https://meshjs.dev/apis/browserwallet#signTx}
   * @example
   * ```typescript
   * const tx = new Transaction({ initiator: wallet });
   * const unsignedTx = await tx.build();
   * const signedTx = await wallet.signTx(unsignedTx, false);
   */
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

  /**
   * As wallets should already have this ability to submit transaction, we allow dApps to request that a transaction be sent through it. If the wallet accepts the transaction and tries to send it, it shall return the transaction ID for the dApp to track. The wallet can return error messages or failure if there was an error in sending it.
   * @param {Transaction} tx The Transaction object to be submitted
   * @returns {Promise<string>}
   * @see {@link https://meshjs.dev/apis/browserwallet#submitTx}
   * @example
   * ```typescript
   * const tx = new Transaction({ initiator: wallet });
   * const unsignedTx = await tx.build();
   * const signedTx = await wallet.signTx(unsignedTx, false);
   * const txHash = await wallet.submitTx(signedTx);
   * ```
   */
  submitTx(tx: string): Promise<string> {
    return this._walletInstance.submitTx(tx);
  }

  async getUsedAddress(): Promise<tsl.Address> {
    const usedAddresses = await this._walletInstance.getUsedAddresses();
    return tsl.Address.fromBytes(usedAddresses[0]);
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

  /**
   * Returns a list of assets in wallet excluding lovelace.
   * @returns {Promise<AssetExtended[]>}
   * @see {@link https://meshjs.dev/apis/browserwallet#getAssets}
   * @example
   * ```typescript
   * const assets = await wallet.getAssets();
   * ```
   */
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

  /**
   * Return the lovelace balance in wallet. 1 ADA = 1000000 lovelace.
   * @returns {Promise<string>}
   * @see {@link https://meshjs.dev/apis/browserwallet#getLovelace}
   * @example
   * ```typescript
   * const lovelace = await wallet.getLovelace();
   * ```
   */
  async getLovelace(): Promise<string> {
    const balance = await this.getBalance();
    const nativeAsset = balance.find((v) => v.unit === 'lovelace');

    return nativeAsset !== undefined ? nativeAsset.quantity : '0';
  }

  /**
   * Returns a list of assets from a policy ID. If no assets in wallet belongs to the policy ID, an empty list is returned. Query for a list of assets' policy ID with wallet.getPolicyIds().
   * @param {string} policyId The policy ID of the assets to be returned.
   * @returns {Promise<AssetExtended[]>}
   * @see {@link https://meshjs.dev/apis/browserwallet#getPolicyIdAssets}
   * @example
   * ```typescript
   * const assets = await wallet.getPolicyIdAssets('64af286e2ad0df4de2e7de15f8ff5b3d27faecf4ab2757056d860a42');
   * ```
   */
  async getPolicyIdAssets(policyId: string): Promise<AssetExtended[]> {
    const assets = await this.getAssets();
    return assets.filter((v) => v.policyId === policyId);
  }

  /**
   * Return a list of assets' policy ID.
   * @returns {Promise<string[]>}
   * @see {@link https://meshjs.dev/apis/browserwallet#getPolicyIds}
   * @example
   * ```typescript
   * const policyIds = await wallet.getPolicyIds();
   * ```
   */
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
    ? fromBytes(tsl.hashData(utxo.resolved.datum).toBytes())
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
