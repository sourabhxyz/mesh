import {
  TxMetadatum, TxMetadatumText, TxMetadatumInt,
  TxMetadatumList, TxMetadatumMap, TxMetadatumMapEntry,
} from '@harmoniclabs/plu-ts';

export type Metadata =
  | string
  | number
  | bigint
  | Array<Metadata>
  | Map<Metadata, Metadata>;

export const fromTxMetadatum = (txMetadatum: TxMetadatum): Metadata => {
  switch (txMetadatum.constructor) {
    case TxMetadatumText:
      return (<TxMetadatumText>txMetadatum).text;
    case TxMetadatumInt:
      return (<TxMetadatumInt>txMetadatum).n;
    case TxMetadatumList:
      return (<TxMetadatumList>txMetadatum).list.map((element) => fromTxMetadatum(element));
    case TxMetadatumMap:
      const map = new Map<Metadata, Metadata>();

      (<TxMetadatumMap>txMetadatum).map.forEach(({ k, v }) => {
        map.set(fromTxMetadatum(k), fromTxMetadatum(v));
      });

      return map;
    default:
      throw new Error('Invalid TX Metadatum');
  }
};

export const toTxMetadatum = (metadata: Metadata): TxMetadatum => {
  const toTxMetadatumList = (list: Metadata[]): TxMetadatum[] => {
    return list.map((element) => toTxMetadatum(element));
  };

  const toTxMetadatumMap = (map: Map<Metadata, Metadata>): TxMetadatumMapEntry[] => {
    return Array.from(map).map(([key, value]) => ({
      k: toTxMetadatum(key),
      v: toTxMetadatum(value),
    }));
  };

  switch (typeof metadata) {
    case 'string':
      return new TxMetadatumText(metadata);
    case 'bigint':
    case 'number':
      return new TxMetadatumInt(metadata);
    case 'object':
      if (metadata instanceof Array) {
        const txMetadatumList = toTxMetadatumList(metadata);
        return new TxMetadatumList(txMetadatumList);
      } else if (metadata instanceof Map) {
        const txMetadatumMap = toTxMetadatumMap(metadata);
        return new TxMetadatumMap(txMetadatumMap);
      }

      throw new Error('Invalid Metadata');
  }
};
