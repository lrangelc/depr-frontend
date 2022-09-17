import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BankingTransactionsRoutingModule } from "./banking-transactions-routing.module";
import { TransferComponent } from "./transfer/transfer.component";
import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../material/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FurySharedModule } from "src/@fury/fury-shared.module";

@NgModule({
  declarations: [TransferComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FurySharedModule,
    BankingTransactionsRoutingModule,
  ],
})
export class BankingTransactionsModule {}
