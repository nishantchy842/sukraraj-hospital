export type IRCCategory = {
   id: number;
   title_En: string;
   title_Np: string;
   slug: string;
   createdAt: Date;
   updatedAt: Date;
};

export type IRC = {
   id: number;
   title_En: string;
   title_Np: string;
   slug: string;
   content_En: string;
   content_Np: string;
   previewImage: string;
   downloadFile: string;
   createdAt: Date;
   updatedAt: Date;
   ircCategory: IRCCategory;
};
