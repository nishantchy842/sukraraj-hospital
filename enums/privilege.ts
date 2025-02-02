export enum PRIVILEGE_NAME {
   HOMEPAGE = 'HOMEPAGE',
   ABOUT_US = 'ABOUT_US',
   CLIENT_CONCERN = 'CLIENT_CONCERN',
   CONTACT = 'CONTACT',
   DEPARTMENT = 'DEPARTMENT',
   OPD_SCHEDULE = 'OPD_SCHEDULE',
   GALLERY = 'GALLERY',
   RESEARCH = 'RESEARCH',
   MEMBER = 'MEMBER',
   NOTICE = 'NOTICE',
   RESOURCE = 'RESOURCE',
   SERVICE = 'SERVICE',
   USER = 'USER',
}

export const MEMBER = Object.freeze({
   STAFF: 'STAFF',
   DOCTOR: 'DOCTOR',
   DEVELOPMENT_COMMITTEE: 'DEVELOPMENT_COMMITTEE',
   BOARD_MEMBER: 'BOARD_MEMBER',
   INFORMATION_OFFICER: 'INFORMATION_OFFICER',
   WARD_INCHARGE: 'WARD_INCHARGE',
   TEAM_MEMBER: 'TEAM_MEMBER',
});

export type MEMBER = typeof MEMBER;
