'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
   MutationCache,
   QueryCache,
   QueryClient,
   QueryClientProvider,
} from '@tanstack/react-query';
import { FetchError } from '@/api';

export default function Providers({ children }: { children: React.ReactNode }) {
   const router = useRouter();

   // eslint-disable-next-line react/hook-use-state
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  refetchOnWindowFocus: false,
                  retry: false,
               },
            },
            mutationCache: new MutationCache({
               onError: (err) => {
                  if (err instanceof FetchError)
                     if (err?.status === 401) {
                        router.push('/auth/login');
                     }
               },
            }),
            queryCache: new QueryCache({
               onError: (err) => {
                  if (err instanceof FetchError)
                     if (err?.status === 401) {
                        router.push('/auth/login');
                     }
               },
            }),
         })
   );

   return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
   );
}
