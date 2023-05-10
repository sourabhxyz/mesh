import { UTxO as TxUnspentOutput } from '@harmoniclabs/plu-ts';

export interface ICreator {
  getChangeAddress(): SometimesPromise<string>;
  getUsedCollateral(
    limit?: number
  ): SometimesPromise<TxUnspentOutput[]>;
  getUsedUTxOs(): SometimesPromise<TxUnspentOutput[]>;
}

type SometimesPromise<T> = Promise<T> | T;
