import { useWallet } from '@meshsdk/react';
import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import { getNonce, verifySignature } from '../backend/signin';
import { getSession } from '../lib/supabase';
import { User } from '../types';

const AuthContext = createContext({
  userMeta: {} as User,
  showLoginModal: false,
  isLogined: false,
  setShowLoginModal: (bool) => {},
  frontendStartLoginProcess: () => {},
  frontendSignMessage: (nonce) => {},
});

export const AuthProvider = ({ children }) => {
  const { wallet, connected } = useWallet();

  const [userMeta, setUserMeta] = useState<User>({} as User);
  const [session, setSession] = useState<{}>({});
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isLogined, setIsLogined] = useState<boolean>(false);

  useEffect(() => {
    async function get() {
      const session = await getSession();
      console.log(123, 'session', session);
    }
    get();
  }, [userMeta, isLogined]);

  async function frontendStartLoginProcess() {
    if (connected) {
      const userAddress = (await wallet.getRewardAddresses())[0];
      console.log('userAddress', userAddress);
      const nonce = await getNonce(userAddress);
      console.log('nonce', nonce);
      await frontendSignMessage(nonce);
    }
  }

  async function frontendSignMessage(nonce) {
    try {
      const userAddress = (await wallet.getRewardAddresses())[0];
      console.log('userAddress', userAddress);
      const signature = await wallet.signData(userAddress, nonce);
      console.log('signature', signature);
      const success = await verifySignature(userAddress, signature);
      console.log('success', success);
      setShowLoginModal(false);
      if (success) {
        setUserMeta(success.user);
        setSession(success.session);
        setIsLogined(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const memoedValue = useMemo(
    () => ({
      userMeta,
      showLoginModal,
      isLogined,
      setShowLoginModal,
      frontendStartLoginProcess,
      frontendSignMessage,
    }),
    [
      userMeta,
      showLoginModal,
      isLogined,
      setShowLoginModal,
      frontendStartLoginProcess,
      frontendSignMessage,
    ]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
