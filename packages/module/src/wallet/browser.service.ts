import {
  Address, StakeAddress, Tx, TxWitnessSet, UTxO as TxUnspentOutput,
} from '@harmoniclabs/plu-ts';
import {
  SUPPORTED_WALLETS, DEFAULT_PROTOCOL_PARAMETERS, POLICY_ID_LENGTH,
} from '@mesh/common/constants';
import { ICreator, ISigner, ISubmitter } from '@mesh/common/contracts';
import { mergeSignatures } from '@mesh/common/helpers';
import { fromUTF8, resolveFingerprint, toUTF8 } from '@mesh/common/utils';
import { Cardano, WalletStandard } from '@mesh/core';
import {
  Asset, AssetExtended, DataSignature, fromValue,
  fromTxUnspentOutput, toTxUnspentOutput, UTxO, Wallet,
} from '@mesh/common/types';

/**
 * Wallet for connecting, queries and performs wallet functions in accordance to CIP-30.
 * These wallets APIs are in accordance to CIP-30, which defines the API for dApps to communicate with the user's wallet.
 * Additional utility functions provided for developers that are useful for building dApps.
 * @see {@link https://meshjs.dev/apis/browserwallet}
 */
export class BrowserWallet implements ICreator, ISigner, ISubmitter {
  private constructor(private readonly _walletInstance: WalletStandard) {}

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
   * The wallet should request the user's permission to connect the web page to the user's wallet.
   * If permission has been granted, the wallet will be returned and exposing the full API for the dApp to use.
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
    return fromValue(balance);
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
    return Address.fromBytes(changeAddress).toString();
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
    const collateral = (await this._walletInstance.experimental.getCollateral()) ?? [];
    return collateral.map((c) => fromTxUnspentOutput(c)).slice(0, limit);
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
    return rewardAddresses.map((r) => StakeAddress.fromBytes(r).toString());
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
    return unusedAddresses.map((una) => Address.fromBytes(una).toString());
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
    return usedAddresses.map((usa) => Address.fromBytes(usa).toString());
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
    const utxos = (await this._walletInstance.getUtxos()) ?? [];
    return utxos.map((utxo) => fromTxUnspentOutput(utxo));
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
    const signerAddress = Address.fromString(address).toCbor().toString();
    return this._walletInstance.signData(signerAddress, fromUTF8(payload));
  }

  /**
   * Requests user to sign the provided transaction.
   * The wallet should ask the user for permission, and if given, try to sign the supplied body and return a signed transaction.
   * `partialSign` should be `true` if the transaction provided requires multiple signatures.
   * @param {Transaction} unsignedTx The Transaction object to be signed
   * @param {boolean} partialSign Must be true if the transaction provided requires multiple signatures. The default value is `false`.
   * @returns {Promise<Transaction>}
   * @see {@link https://meshjs.dev/apis/browserwallet#signTx}
   * @example
   * ```typescript
   * const tx = new Transaction({ creator: wallet });
   * const unsignedTx = await tx.build();
   * const signedTx = await wallet.signTx(unsignedTx);
   */
  async signTx(unsignedTx: string, partialSign = false): Promise<string> {
    try {
      const tx = Tx.fromCbor(unsignedTx);

      const newWitnessSet = await this._walletInstance
        .signTx(unsignedTx, partialSign);

      const newSignatures = TxWitnessSet.fromCbor(newWitnessSet)
        .vkeyWitnesses ?? [];

      const txWitnessSet = mergeSignatures(
        tx.witnesses, newSignatures,
      );

      const signedTx = new Tx({
        ...tx, witnesses: txWitnessSet,
      }).toCbor().toString();

      return signedTx;
    } catch (error) {
      throw new Error(`[BrowserWallet] An error occurred during signTx: ${JSON.stringify(error)}.`);
    }
  }

  /**
   * As wallets should already have this ability to submit transaction, we allow dApps to request that a transaction be sent through it.
   * If the wallet accepts the transaction and tries to send it, it shall return the transaction hash for the dApp to track.
   * The wallet can return error messages or failure if there was an error in sending it.
   * @param {Transaction} tx The Transaction object to be submitted
   * @returns {Promise<string>}
   * @see {@link https://meshjs.dev/apis/browserwallet#submitTx}
   * @example
   * ```typescript
   * const tx = new Transaction({ creator: wallet });
   * const unsignedTx = await tx.build();
   * const signedTx = await wallet.signTx(unsignedTx, false);
   * const txHash = await wallet.submitTx(signedTx);
   * ```
   */
  submitTx(tx: string): Promise<string> {
    return this._walletInstance.submitTx(tx);
  }

  async getUsedCollateral(
    limit = DEFAULT_PROTOCOL_PARAMETERS.maxCollateralInputs,
  ): Promise<TxUnspentOutput[]> {
    const collateral = await this.getCollateral(limit);
    return collateral.map((c) => toTxUnspentOutput(c));
  }

  async getUsedUTxOs(): Promise<TxUnspentOutput[]> {
    const utxos = await this.getUtxos();
    return utxos.map((u) => toTxUnspentOutput(u));
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
        const assetName = toUTF8(v.unit.slice(POLICY_ID_LENGTH));
        const fingerprint = resolveFingerprint(policyId, assetName);

        return {
          unit: v.unit,
          quantity: v.quantity,
          policyId, assetName, fingerprint,
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
    return balance.find(
      (v) => v.unit === 'lovelace'
    )?.quantity.toString() ?? '0';
  }

  /**
   * Returns a list of assets from a policy ID. If no assets in wallet belongs to the policy ID, an empty list is returned.
   * Query for a list of assets' policy ID with wallet.getPolicyIds().
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
