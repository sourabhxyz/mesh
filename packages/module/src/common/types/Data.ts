import {
  Data as PlutusData, DataB, DataConstr,
  DataI, DataList, DataMap, DataPair,
} from '@harmoniclabs/plu-ts';

export type Data =
  | string
  | bigint
  | Array<Data>
  | Map<Data, Data>
  | {
    alternative: number;
    fields: Array<Data>;
  };

export const fromPlutusData = (plutusData: PlutusData): Data => {
  switch (plutusData.constructor) {
    case DataB:
      return plutusData.toJson().bytes;
    case DataI:
      return BigInt(plutusData.toJson().int);
    case DataList:
      return plutusData.toJson().list.map((element) => fromPlutusData(element));
    case DataMap:
      const map = new Map<Data, Data>();

      plutusData.toJson().map.forEach(([k, v]) => {
        map.set(fromPlutusData(k), fromPlutusData(v));
      });

      return map;
    case DataConstr:
      return {
        alternative: plutusData.toJson().constr,
        fields: plutusData.toJson().fields.map((data) => fromPlutusData(data)),
      };
    default:
      throw new Error('Invalid Plutus Data');
  }
};

export const toPlutusData = (data: Data): PlutusData => {
  const toPlutusList = (data: Data[]): PlutusData[] => {
    return data.map((element) => toPlutusData(element));
  };

  const toPlutusMap = (data: Map<Data, Data>): DataPair<PlutusData, PlutusData>[] => {
    return Array.from(data).map(([key, value]) => new DataPair(toPlutusData(key), toPlutusData(value)));
  };

  switch (typeof data) {
    case 'string':
      return new DataB(data);
    case 'bigint':
    case 'number':
      return new DataI(data);
    case 'object':
      if (data instanceof Array) {
        const plutusList = toPlutusList(data);
        return new DataList(plutusList);
      } else if (data instanceof Map) {
        const plutusMap = toPlutusMap(data);
        return new DataMap(plutusMap);
      } else {
        return new DataConstr(
          data.alternative,
          toPlutusList(data.fields),
        );
      }
  }
};
