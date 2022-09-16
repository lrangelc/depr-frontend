export interface IAccount {
  _id: string;

  name: string;
  code: number;
  owner: any;
  startingAmount: number;
  availableBalance: number;
  ownerId: string;
  totalCredit?: number;
  totalDebit?: number;
  createdBy?: string;
  lastTransaction?: any;
  lastCreditTransaction?: any;
  lastDebitTransaction?: any;
  countCredits?: number;
  countDebits?: number;
  countTransactions?: number;
}
