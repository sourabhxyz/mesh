import { CborString, NativeScript, nativeScriptFromCbor, nativeScriptToCbor } from '@harmoniclabs/plu-ts';

export { NativeScript } from '@harmoniclabs/plu-ts';

export const fromNativeScriptHex = (nativeScriptHex: string): NativeScript => nativeScriptFromCbor(new CborString(nativeScriptHex));

export const toNativeScriptHex = (nativeScript: NativeScript): string => nativeScriptToCbor(nativeScript).toString();
