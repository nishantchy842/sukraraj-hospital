import { withHydration } from '@/providers/withHydration';
import DepartmentDetails from '.';
import { getDepartmentDetails } from '@/api/departments';
import { queryKeys } from '@/utils';
import { ABOUTUS_STAFF_DETAILS, DEPARTMENT } from '@/constants/querykeys';
import { MEMBER } from '@/enums/privilege';
import { getAllMember } from '@/api/member';

export default withHydration(
   DepartmentDetails,
   async (queryClient, { params: { details }, searchParams: { id } }) => {
      await Promise.all([
         queryClient.prefetchQuery({
            queryFn: () => getDepartmentDetails(details),
            queryKey: queryKeys(DEPARTMENT).detail(details),
         }),

         queryClient.prefetchQuery({
            queryKey: queryKeys(ABOUTUS_STAFF_DETAILS).lists(),
            queryFn: () =>
               getAllMember({
                  type: MEMBER.DOCTOR,
                  departmentId: id,
               }),
         }),
      ]);
      return queryClient;
   }
);
