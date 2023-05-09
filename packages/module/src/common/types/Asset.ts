import { Value } from '@harmoniclabs/plu-ts';

export type Unit = string;

export type Quantity = bigint;

export type Asset = {
  unit: Unit;
  quantity: Quantity;
};

export const fromValue = (value: Value): Asset[] => value.toUnits();

export const toValue = (assets: Asset[]): Value => Value.fromUnits(assets);
