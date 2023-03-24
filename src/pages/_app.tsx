import { ClerkProvider } from '@clerk/nextjs';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useState } from 'react';
import { PageLayout } from '~/components/Layout';
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  return (
    <ClerkProvider {...pageProps} >
      <SessionProvider session={session}>
        <SessionContextProvider supabaseClient={supabase} initialSession={session}>
          <PageLayout>
            <Component {...pageProps} />
          </PageLayout>
        </SessionContextProvider>
      </SessionProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
