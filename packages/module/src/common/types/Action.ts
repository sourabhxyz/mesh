import {
  ExBudget, TxRedeemer, TxRedeemerTag,
} from '@harmoniclabs/plu-ts';
import { Data, toPlutusData } from './Data';

const REDEEMER_TAGS = {
  CERT: TxRedeemerTag.Cert,
  MINT: TxRedeemerTag.Mint,
  REWARD: TxRedeemerTag.Withdraw,
  SPEND: TxRedeemerTag.Spend,
};

export type Action = {
  data: Data;
  index: number;
  budget: Budget;
  tag: keyof typeof REDEEMER_TAGS;
};

export type Budget = {
  mem: number;
  steps: number;
};

export const toTxRedeemer = (action: Action): TxRedeemer => {
  const lookupRedeemerTag = (key: string): TxRedeemerTag => REDEEMER_TAGS[key];

  return new TxRedeemer({
    index: action.index,
    tag: lookupRedeemerTag(action.tag),
    data: toPlutusData(action.data),
    execUnits: new ExBudget({
      cpu: action.budget.steps,
      mem: action.budget.mem,
    }),
  });
};
