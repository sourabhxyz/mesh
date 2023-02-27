import { csl } from '@mesh/core';
import { DEFAULT_PROTOCOL_PARAMETERS } from '@mesh/common/constants';
import { IFetcher, IInitiator, ISigner, ISubmitter } from '@mesh/common/contracts';
import { mergeSignatures } from '@mesh/common/helpers';
import {
  deserializeTx, toAddress, toTxUnspentOutput,
} from '@mesh/common/utils';
import { EmbeddedWallet } from './embedded.service';
import type {
  Address, TransactionUnspentOutput,
} from '@mesh/core';
import type { DataSignature } from '@mesh/common/types';

const DEFAULT_PASSWORD = 'MARI0TIME';

export type CreateAppWalletOptions = {
  networkId: number;
  fetcher: IFetcher;
  submitter: ISubmitter;
  key: {
    type: 'root';
    bech32: string;
  } | {
    type: 'cli';
    payment: string;
    stake?: string;
  } | {
    type: 'mnemonic';
    words: string[];
  };
};

/**
 * Wallet for building transactions in your applications.
 * Whether you are building a minting script, or an application that requires multi-signature, AppWallet is all you need to get started.
 * @see {@link https://meshjs.dev/apis/appwallet}
 */
export class AppWallet implements IInitiator, ISigner, ISubmitter {
  private readonly _fetcher: IFetcher;
  private readonly _submitter: ISubmitter;
  private readonly _wallet: EmbeddedWallet;

  constructor(options: CreateAppWalletOptions) {
    this._fetcher = options.fetcher;
    this._submitter = options.submitter;

    switch (options.key.type) {
      case 'mnemonic':
        this._wallet = new EmbeddedWallet(
          options.networkId,
          EmbeddedWallet
            .encryptMnemonic(options.key.words, DEFAULT_PASSWORD),
        );
        break;
      case 'root':
        this._wallet = new EmbeddedWallet(
          options.networkId,
          EmbeddedWallet
            .encryptPrivateKey(options.key.bech32, DEFAULT_PASSWORD),
        );
        break;
      case 'cli':
        this._wallet = new EmbeddedWallet(
          options.networkId,
          EmbeddedWallet.encryptSigningKeys(
            options.key.payment,
            options.key.stake ?? 'f0'.repeat(34),
            DEFAULT_PASSWORD,
          ),
        );
    }
  }

  /**
   * Get wallet's address. For multi-addresses wallet, it will return the first address. To choose other address, `accountIndex` can be specified.
   * @param {number} accountIndex The index of the account to get address from. The default value is `0`.
   * @returns {string} The address of the wallet.
   * @example
   * ```typescript
   * const address = wallet.getPaymentAddress();
   * ```
   */
  getPaymentAddress(accountIndex = 0): string {
    const account = this._wallet
      .getAccount(accountIndex, DEFAULT_PASSWORD);
    return account.enterpriseAddress;
  }

  /**
   * Get wallet's reward address. For multi-addresses wallet, it will return the first address. To choose other address, `accountIndex` can be specified.
   * @param {number} accountIndex The index of the account to get address from. The default value is `0`.
   * @returns {string} The reward address of the wallet.
   * @example
   * ```typescript
   * const address = wallet.getRewardAddress();
   * ```
   */
  getRewardAddress(accountIndex = 0): string {
    const account = this._wallet
      .getAccount(accountIndex, DEFAULT_PASSWORD);
    return account.rewardAddress;
  }

  getUsedAddress(accountIndex = 0): Address {
    const account = this._wallet
      .getAccount(accountIndex, DEFAULT_PASSWORD);
    return toAddress(account.enterpriseAddress);
  }

  getUsedCollateral(
    _limit = DEFAULT_PROTOCOL_PARAMETERS.maxCollateralInputs,
  ): Promise<TransactionUnspentOutput[]> {
    throw new Error('getUsedCollateral not implemented.');
  }

  async getUsedUTxOs(accountIndex = 0): Promise<TransactionUnspentOutput[]> {
    const account = this._wallet
      .getAccount(accountIndex, DEFAULT_PASSWORD);
    const utxos = await this._fetcher
      .fetchAddressUTxOs(account.enterpriseAddress);

    return utxos.map((utxo) => toTxUnspentOutput(utxo));
  }

  /**
   * Sign arbitrary data to verify the data was signed by the owner of the private key.
   * @param {string} address The address to sign the data with.
   * @param {string} payload The data to sign.
   * @param accountIndex The index of the account to sign the data with. The default value is `0`.
   * @returns {DataSignature} The signature of the data.
   * @see {@link https://meshjs.dev/apis/appwallet#signData}
   */
  signData(address: string, payload: string, accountIndex = 0): DataSignature {
    try {
      return this._wallet.signData(accountIndex, DEFAULT_PASSWORD, address, payload);
    } catch (error) {
      throw new Error(`[AppWallet] An error occurred during signData: ${error}.`);
    }
  }

  /**
   * Requests user to sign the supplied transaction and return a signed transaction. `partialSign` should be `true` if the transaction provided requires multiple signatures.
   * @param {string} unsignedTx The unsigned transaction to sign.
   * @param {boolean} partialSign Whether the transaction requires multiple signatures. The default value is `false`.
   * @param {number} accountIndex The index of the account to sign the transaction with. The default value is `0`.
   * @returns {Promise<string>} The signed transaction.
   * @see {@link https://meshjs.dev/apis/appwallet#signTx}
   * @example
   * ```typescript
   * const tx = new Transaction({ initiator: wallet });
   * const unsignedTx = await tx.build();
   * const signedTx = await wallet.signTx(unsignedTx, false);
   */
  async signTx(
    unsignedTx: string, partialSign = false, accountIndex = 0,
  ): Promise<string> {
    try {
      const account = this._wallet
        .getAccount(accountIndex, DEFAULT_PASSWORD);
      const utxos = await this._fetcher
        .fetchAddressUTxOs(account.enterpriseAddress);

      const newSignatures = this._wallet.signTx(
        accountIndex, DEFAULT_PASSWORD,
        utxos, unsignedTx, partialSign,
      );

      const tx = deserializeTx(unsignedTx);
      const txWitnessSet = tx.witness_set();

      const txSignatures = mergeSignatures(
        txWitnessSet,
        newSignatures,
      );

      txWitnessSet.set_vkeys(txSignatures);

      const signedTx = csl.Transaction.new(
        tx.body(),
        txWitnessSet,
        tx.auxiliary_data()
      ).to_hex();

      return signedTx;
    } catch (error) {
      throw new Error(`[AppWallet] An error occurred during signTx: ${error}.`);
    }
  }

  /**
   * Submit a signed transaction to the blockchain.
   * @param {string} tx The signed transaction to submit.
   * @returns {Promise<string>} The transaction hash.
   * @example
   * ```typescript
   * const tx = new Transaction({ initiator: wallet });
   * const unsignedTx = await tx.build();
   * const signedTx = await wallet.signTx(unsignedTx);
   * const txHash = await wallet.submitTx(signedTx);
   * ```
   */
  submitTx(tx: string): Promise<string> {
    return this._submitter.submitTx(tx);
  }

  /**
   * You can generate deterministic keys based on the Bitcoin BIP39. These mnemonic phrases allow you to recover your wallet.
   * @param {number} strength The strength of the mnemonic phrase. The default is 256.
   * @returns {string[]} The mnemonic phrase.
   * @see {@link https://meshjs.dev/apis/appwallet#generateWallet}
   * @example
   * ```typescript
   * import { AppWallet } from '@meshsdk/core';
   * const mnemonic = AppWallet.brew();
   * ```
   */
  static brew(strength = 256): string[] {
    return EmbeddedWallet.generateMnemonic(strength);
  }
}
