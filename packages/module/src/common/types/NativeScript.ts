import { CborString, NativeScript, nativeScriptFromCbor, nativeScriptToCbor } from '@harmoniclabs/plu-ts';

export { NativeScript } from '@harmoniclabs/plu-ts';

export const fromNativeScriptCbor = (nativeScriptCbor: string): NativeScript => nativeScriptFromCbor(new CborString(nativeScriptCbor));

export const toNativeScriptCbor = (nativeScript: NativeScript): string => nativeScriptToCbor(nativeScript).toString();
