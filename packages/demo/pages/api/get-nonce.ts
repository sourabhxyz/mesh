import type { NextApiRequest, NextApiResponse } from 'next';
import { generateNonce } from '@meshsdk/core';
import { createUser, getUserByAddress, upsertUser } from '../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userAddress = req.body.userAddress;

  let user = await getUserByAddress({ address: userAddress });

  if (user === undefined) {
    const userAuth = await createUser({ address: userAddress });
    console.log('userAuth', userAuth);
    user = userAuth?.user;
  }

  console.log('user', user);

  if (user) {
    const nonce = generateNonce('Sign to login in to Mesh: ');

    const _ = await upsertUser({
      user_id: user.id,
      userInfo: { address: userAddress, nonce: nonce },
    });

    res.status(200).json(nonce);
  } else {
    res.status(200).json(false);
  }
}
