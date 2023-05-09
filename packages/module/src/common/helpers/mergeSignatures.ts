import { TxWitnessSet, VKeyWitness } from '@harmoniclabs/plu-ts';

export const mergeSignatures = (
  txWitnessSet: TxWitnessSet, newSignatures: VKeyWitness[],
) => {
  const txSignatures = txWitnessSet.vkeyWitnesses;

  if (txSignatures !== undefined) {
    const signatures = new Set<string>();

    txSignatures.forEach((signature) => {
      signatures.add(signature.toCbor().toString());
    });

    newSignatures.forEach((signature) => {
      signatures.add(signature.toCbor().toString());
    });

    return new TxWitnessSet({
      ...txWitnessSet,
      vkeyWitnesses: [...signatures].map(
        (signature) => VKeyWitness.fromCbor(signature)
      )
    });
  }

  return new TxWitnessSet({
    ...txWitnessSet,
    vkeyWitnesses: newSignatures
  });
};
