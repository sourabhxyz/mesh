import { Value } from '@harmoniclabs/plu-ts';

export type Unit = string;

export type Quantity = bigint;

export type Asset = {
  unit: Unit;
  quantity: Quantity;
};

export const fromValue = (value: string | Value): Asset[] => {
  if (typeof value === 'string')
    return Value.fromCbor(value).toUnits();

  return value.toUnits();
}

export const toValue = (assets: Asset[]): Value => Value.fromUnits(assets);
