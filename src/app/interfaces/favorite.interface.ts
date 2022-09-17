export interface IFavorite {
  _id: string;

  accountAlias: string;
  accountCode: number;
  accountDpi: string;
  accountName?: string;
  userId: string;
  createdBy?: string;
}
