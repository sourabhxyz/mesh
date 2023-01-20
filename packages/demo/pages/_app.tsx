import '../styles/globals.css';
import '../styles/highlight/stackoverflow-dark.css';
import '../styles/custom.css';
import type { AppProps } from 'next/app';
import { DemoProvider } from '../contexts/demo';
import Navbar from '../components/site/navbar';
import Footer from '../components/site/footer';
import { AppWalletProvider } from '../contexts/appWallet';
import { MeshProvider } from '@meshsdk/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as ga from '../lib/ga';
import Scroller from '../components/site/scroller';
import { AuthProvider } from '../contexts/auth';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  /**
   * Google Analytics
   */
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  /**
   * Supabase
   */
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <MeshProvider>
        <AuthProvider>
          <AppWalletProvider>
            <DemoProvider>
              <div className="cursor-default">
                <header>
                  <Navbar />
                </header>
                <main className="pt-16 bg-white dark:bg-gray-900">
                  <Component {...pageProps} />
                </main>
                <Footer />
                <Scroller />
              </div>
            </DemoProvider>
          </AppWalletProvider>
        </AuthProvider>
      </MeshProvider>
    </SessionContextProvider>
  );
}

export default MyApp;
