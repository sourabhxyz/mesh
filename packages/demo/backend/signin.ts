import { post } from './';

export async function getNonce(userAddress: string) {
  return await post(`get-nonce`, { userAddress });
}

export async function verifySignature(userAddress: string, signature: string) {
  return await post(`verify-signature`, { userAddress, signature });
}
