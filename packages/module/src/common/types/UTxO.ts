import {
  Address, Hash32, Script, UTxO as TxUnspentOutput,
  dataFromCbor, dataToCbor, hashData, isData,
} from '@harmoniclabs/plu-ts';
import { Asset, fromValue, toValue } from './Asset';

export type UTxO = {
  input: {
    outputIndex: number;
    txHash: string;
  };
  output: {
    address: string;
    amount: Asset[];
    dataHash?: string;
    plutusData?: string;
    scriptRef?: string;
  };
};

export const fromTxUnspentOutput = (txUnspentOutput: string | TxUnspentOutput): UTxO => {
  if (typeof txUnspentOutput === 'string') {
    return fromTxUnspentOutput(TxUnspentOutput.fromCbor(txUnspentOutput));
  }

  const plutusData = isData(txUnspentOutput.resolved.datum)
    ? dataToCbor(txUnspentOutput.resolved.datum).toString()
    : undefined;

  const dataHash = isData(txUnspentOutput.resolved.datum)
    ? hashData(txUnspentOutput.resolved.datum).toString()
    : txUnspentOutput.resolved.datum?.toString();

  const scriptRef = txUnspentOutput.resolved.refScript
    ?.toCbor().toString();

  return <UTxO>{
    input: {
      outputIndex: txUnspentOutput.utxoRef.index,
      txHash: txUnspentOutput.utxoRef.id.toString(),
    },
    output: {
      address: txUnspentOutput.resolved.address.toString(),
      amount: fromValue(txUnspentOutput.resolved.value),
      dataHash, plutusData, scriptRef,
    },
  };
};

export const toTxUnspentOutput = (utxo: UTxO): TxUnspentOutput => {
  const plutusData = utxo.output.plutusData
    ? dataFromCbor(utxo.output.plutusData)
    : undefined;

  const dataHash = utxo.output.dataHash
    ? new Hash32(utxo.output.dataHash)
    : undefined;

  const scriptRef = utxo.output.scriptRef
    ? Script.fromCbor(utxo.output.scriptRef)
    : undefined;

  return new TxUnspentOutput({
    utxoRef: {
      id: new Hash32(utxo.input.txHash),
      index: utxo.input.outputIndex,
    },
    resolved: {
      address: Address.fromString(utxo.output.address),
      value: toValue(utxo.output.amount),
      datum: plutusData ?? dataHash,
      refScript: scriptRef,
    },
  });
};
