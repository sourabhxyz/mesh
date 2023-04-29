import { useState, useEffect } from 'react';
import CommonLayout from '../../components/common/layout';
import Metatags from '../../components/site/metatags';
import Codeblock from '../../components/ui/codeblock';
import { HandleProvider } from '@meshsdk/core';
import GetHandle from '../../components/pages/providers/handle/getHandle';
import GetHandles from '../../components/pages/providers/handle/getHandles';
import GetHandleDatum from '../../components/pages/providers/handle/getHandleDatum';
import GetHolders from '../../components/pages/providers/handle/getHolders';
import GetHolder from '../../components/pages/providers/handle/getHolder';

export default function ProvidersOgmios() {
  const sidebarItems = [
    { label: 'Get Handle', to: 'getHandle' },
    { label: 'Get Handles', to: 'getHandles' },
    { label: 'Get Handle Datum', to: 'getHandleDatum' },
    // { label: 'Get Handle Personalized', to: 'getHandlePersonalized' },
    { label: 'Get Holders', to: 'getHolders' },
    { label: 'Get Holder', to: 'getHolder' },
  ];

  return (
    <>
      <Metatags
        title="Handle Provider"
        description="NFT-powered naming solution for your Cardano wallet address, secured entirely on-chain via the Handle Standard."
      />
      <CommonLayout sidebarItems={sidebarItems}>
        <Hero />
        <Main />
      </CommonLayout>
    </>
  );
}

function Hero({}) {
  let code1 = `const handleProvider = new HandleProvider();\n`;

  return (
    <header className="mb-4 lg:mb-6">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Handle
        <span className="ml-2"></span>
      </h2>
      <p className="mb-8 font-light text-gray-500 sm:text-xl dark:text-gray-400">
        ADA Handle is a NFT-powered naming solution for your Cardano wallet
        address, secured entirely on-chain via the Handle Standard.
      </p>

      <div className="grid grid-cols-1 px-4 lg:grid-cols-2 lg:gap-16 pb-16">
        <div className="col-span-1 xl:col-auto">
          <p>
            <a href="https://adahandle.com/" target="_blank" rel="noreferrer">
              ADA Handle
            </a>{' '}
            is an NFT standard that allows custom Cardano addresses for
            everyone, secured entirely on-chain and which dynamically resolve to
            the holder's wallet address.
          </p>
          <p>
            These APIs allow you to get all minted handles, get specific
            Handle metadata, and list wallet/script/enterprise addresses that
            hold Handles.
          </p>
          <p>Get started:</p>
          <Codeblock data={code1} isJson={false} />
        </div>
        <div className="col-span-1"></div>
      </div>
    </header>
  );
}

function Main({}) {
  const [provider, setProvider] = useState<HandleProvider | null>(null);
  const [handle, setHandle] = useState<string>('meshjs');
  const [address, setAddress] = useState<string>('stake1u8qg7q55at26k7hqee28rh2gwqrery5hh22jxzhj9uj72agv45wv8');
  

  useEffect(() => {
    async function load() {
      const _provider = new HandleProvider();
      setProvider(_provider);
    }
    load();
  }, []);

  return (
    <>
      <GetHandle
        provider={provider}
        handle={handle}
        setHandle={setHandle}
      />
      <GetHandles provider={provider} />
      <GetHandleDatum
        provider={provider}
        handle={handle}
        setHandle={setHandle}
      />
      <GetHolders provider={provider} />
      <GetHolder
        provider={provider}
        address={address}
        setAddress={setAddress}
      />
    </>
  );
}
