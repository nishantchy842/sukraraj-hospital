export type NoticeCategory = {
   id: number;
   title_En: string;
   title_Np: string;
   slug: string;
   createdAt: string;
   updatedAt: string;
   notices?: number[];
};

export type Notice = {
   date: Date;
   id: number;
   title_En: string;
   title_Np: string;
   slug: string;
   previewImage: string;
   downloadFile: string;
   content_En: string;
   content_Np: string;
   noticeCategory: NoticeCategory;
   isPopup: boolean;
   createdAt: Date;
   updatedAt: Date;
};

export type NoticeDetails = {
   id: number;
   title_En: string;
   title_Np: string;
   slug: string;
   previewImage: string;
   downloadFile: string;
   content_En: string;
   content_Np: string;
   isPopup: boolean;
   createdAt: Date;
   updatedAt: Date;
   category: {
      id: number;
      title_En: string;
      title_Np: string;
      slug: string;
      createdAt: string;
      updatedAt: string;
   };
};
