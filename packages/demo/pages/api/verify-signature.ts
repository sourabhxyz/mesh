import type { NextApiRequest, NextApiResponse } from 'next';
import { checkSignature } from '@meshsdk/core';
import { getUserByAddress, signinUser } from '../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userAddress = req.body.userAddress;
  const signature = req.body.signature;

  const user = await getUserByAddress({ address: userAddress });

  if (user) {
    const nonce = user.nonce;
    const result = checkSignature(nonce, userAddress, signature);

    if (result) {
      const userAuth = await signinUser({ address: userAddress });
      res.status(200).json(userAuth);
    } else {
      res.status(200).json(false);
    }
  } else {
    res.status(200).json(false);
  }
}
