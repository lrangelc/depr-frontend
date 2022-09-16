import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FurySharedModule } from "src/@fury/fury-shared.module";
import { AccountsRoutingModule } from "./accounts-routing.module";
import { AccountsListComponent } from "./accounts-list/accounts-list.component";
import { AccountsByOwnerComponent } from "./accounts-by-owner/accounts-by-owner.component";
import { MaterialModule } from "../material/material.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [AccountsListComponent, AccountsByOwnerComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FurySharedModule,
    AccountsRoutingModule,
  ],
})
export class AccountsModule {}
