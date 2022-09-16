export interface IUser {
  _id: string;

  name: string;
  nickname: string;
  dpi: string;
  address: string;
  phone: string;
  email: string;
  job: string;
  monthlyIncome?: number;
  userType: string;
  password?: string;
}

export enum IUserType {
  admin = "admin",
  user = "user",
}
