import { 
  Address, ITxBuildOutput, Hash32, hashData, txBuildOutToTxOut,
} from '@harmoniclabs/plu-ts';
import { Asset, toValue } from './Asset';
import { Data, toPlutusData } from './Data';
import { PlutusScript, toScript } from './PlutusScript';

export type Recipient = string | {
  address: string;
  datum?: {
    value: Data;
    inline?: boolean;
  };
  script?: PlutusScript;
};

export const toTxBuildOutput = (recipient: Recipient | string, assets: Asset[]): ITxBuildOutput => {
  if (typeof recipient === 'object') {
    const plutusScriptReference = recipient.script
      ? toScript(recipient.script)
      : undefined;

    const plutusData = recipient.datum
      ? toPlutusData(recipient.datum.value)
      : undefined;

    const dataHash = plutusData
      ? new Hash32(hashData(plutusData))
      : undefined;

    return txBuildOutToTxOut({
      address: Address.fromString(recipient.address),
      value: toValue(assets),
      datum: recipient.datum?.inline ? plutusData : dataHash,
      refScript: plutusScriptReference,
    });
  }

  return txBuildOutToTxOut({
    address: Address.fromString(recipient),
    value: toValue(assets),
  });
}
