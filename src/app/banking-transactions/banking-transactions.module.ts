import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BankingTransactionsRoutingModule } from "./banking-transactions-routing.module";
import { TransferComponent } from "./transfer/transfer.component";

@NgModule({
  declarations: [TransferComponent],
  imports: [CommonModule, BankingTransactionsRoutingModule],
})
export class BankingTransactionsModule {}
