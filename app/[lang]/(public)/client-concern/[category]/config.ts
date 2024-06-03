import { type Key } from 'react';

export const clientConcernConfig = {
   pagination: true,
   page: 1,
   sort: 'updatedAt' as Key,
   order: 'DESC' as const,
   size: 10,
   clientConcernCategorySlug: '',
};
