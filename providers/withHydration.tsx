import { cache } from 'react';
import { Hydrate, QueryClient, dehydrate } from '@tanstack/react-query';

export const getQueryClient = cache(() => new QueryClient());

export const withHydration = <T extends object>(
   Component: React.FC<T>,
   query: (queryClient: QueryClient, props: T) => Promise<QueryClient>
): React.FC<T> => {
   return async function (props) {
      const queryClient = await query(getQueryClient(), props);

      const dehydratedState = dehydrate(queryClient);

      return (
         <Hydrate state={dehydratedState}>
            <Component {...props} />
         </Hydrate>
      );
   };
};
