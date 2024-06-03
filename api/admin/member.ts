import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import { MEMBER_STATUS } from '@/enums/member';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { Member } from '@/models/admin/member';

type MemberApi = {
   ADMIN: {
      getMembers: GetAll<
         IQueryParamaters &
            Partial<Pick<Member, 'type'>> & {
               departmentId?: number;
               name?: string;
            },
         Member
      >;
      getMember: Get<Member['id'], Member>;
      createMember: Post<Member>;
      updateMember: Patch<Partial<Member> & Pick<Member, 'id'>>;
   };
   SUPER_ADMIN: {
      getMembers: GetAll<
         IQueryParamaters &
            Partial<Pick<Member, 'status' | 'type'>> & {
               departmentId?: number;
               name?: string;
            },
         Member
      >;
      getMember: Get<Member['id'], Member>;
      createMember: Post<Member>;
      updateMember: Patch<Partial<Member> & Pick<Member, 'id'>>;
   };
};

export const memberApi: MemberApi = {
   [ROLE_NAME.ADMIN]: {
      getMembers: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         name = '',
         type = '',
         departmentId = '',
      }) => {
         const res = await fetch(
            `admin/member?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&departmentId=${departmentId}&type=${type}&name=${name}`
         );

         return res.data as IGetAll<Member>;
      },
      getMember: async (id) => {
         const res = await fetch(`admin/member/${id}`);

         const { data } = res.data;

         return data as Member;
      },
      createMember: async (data) => {
         const res = await fetch(`admin/member`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateMember: async ({ id, ...data }) => {
         const res = await fetch(`admin/member/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getMembers: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         name = '',
         type = '',
         departmentId = '',
         status = MEMBER_STATUS.ACTIVE,
      }) => {
         const res = await fetch(
            `super-admin/member?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&departmentId=${departmentId}&type=${type}&status=${status}&name=${name}`
         );

         return res.data as IGetAll<Member>;
      },
      getMember: async (slug) => {
         const res = await fetch(`super-admin/member/${slug}`);

         const { data } = res.data;

         return data as Member;
      },
      createMember: async (data) => {
         const res = await fetch(`super-admin/member`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateMember: async ({ id, ...data }) => {
         const res = await fetch(`super-admin/member/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
