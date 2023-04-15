import { useState, useEffect } from 'react';
import CommonLayout from '../../components/common/layout';
import Metatags from '../../components/site/metatags';
import Codeblock from '../../components/ui/codeblock';
import { HandlerProvider } from '@meshsdk/core';
import GetHandler from '../../components/pages/providers/handler/getHandler';

export default function ProvidersOgmios() {
  const sidebarItems = [
    { label: 'Get Handler', to: 'getHandler' },
    { label: 'Get Handlers', to: 'getHandlers' },
    { label: 'Get Handler Datum', to: 'getHandlerDatum' },
    { label: 'Get Handler Personalized', to: 'getHandlerPersonalized' },
    { label: 'Get Holders', to: 'getHolders' },
    { label: 'Get Holder', to: 'getHolder' },
  ];

  return (
    <>
      <Metatags
        title="Handler Provider"
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
  let code1 = `const handlerProvider = new HandlerProvider();\n`;

  return (
    <header className="mb-4 lg:mb-6">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Handler
        <span className="ml-2"></span>
      </h2>
      <p className="mb-8 font-light text-gray-500 sm:text-xl dark:text-gray-400">
        ADA Handler is a NFT-powered naming solution for your Cardano wallet
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
            These APIs allow you to get all minted handlers, get specific
            Handler metadata, and list wallet/script/enterprise addresses that
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
  const [provider, setProvider] = useState<HandlerProvider | null>(null);
  const [handler, setHandler] = useState<string>('jingles');

  useEffect(() => {
    async function load() {
      const _provider = new HandlerProvider();
      setProvider(_provider);
    }
    load();
  }, []);

  return (
    <>
      <GetHandler
        provider={provider}
        handler={handler}
        setHandler={setHandler}
      />
    </>
  );
}
