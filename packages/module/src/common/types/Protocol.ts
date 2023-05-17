import { ProtocolParamters } from '@harmoniclabs/plu-ts';

export type Protocol = {
  epoch: number;
  minFeeA: number;
  minFeeB: number;
  maxBlockSize: number;
  maxTxSize: number;
  maxBlockHeaderSize: number;
  keyDeposit: string;
  poolDeposit: string;
  decentralisation: number;
  minPoolCost: string;
  priceMem: number;
  priceStep: number;
  maxTxExMem: string;
  maxTxExSteps: string;
  maxBlockExMem: string;
  maxBlockExSteps: string;
  maxValSize: string;
  collateralPercent: number;
  maxCollateralInputs: number;
  coinsPerUTxOSize: string;
};

export const toProtocolParameters = (protocol: Protocol): ProtocolParamters => (<ProtocolParamters>{
  txFeePerByte: protocol.minFeeA,
  txFeeFixed: protocol.minFeeB,
  maxBlockBodySize: protocol.maxBlockSize,
  maxTxSize: protocol.maxTxSize,
  maxBlockHeaderSize: protocol.maxBlockHeaderSize,
  stakeAddressDeposit: BigInt(protocol.keyDeposit),
  stakePoolDeposit: BigInt(protocol.poolDeposit),
  minPoolCost: BigInt(protocol.minPoolCost),
  utxoCostPerByte: BigInt(protocol.coinsPerUTxOSize),
  executionUnitPrices: {
    priceMemory: protocol.priceMem,
    priceSteps: protocol.priceStep,
  },
  maxTxExecutionUnits: {
    memory: parseInt(protocol.maxTxExMem),
    steps: parseInt(protocol.maxTxExSteps),
  },
  maxBlockExecutionUnits: {
    memory: parseInt(protocol.maxBlockExMem),
    steps: parseInt(protocol.maxBlockExSteps),
  },
  maxValueSize: BigInt(protocol.maxValSize),
  collateralPercentage: protocol.collateralPercent,
  maxCollateralInputs: protocol.maxCollateralInputs,
});
