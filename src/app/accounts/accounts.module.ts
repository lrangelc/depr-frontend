import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AccountsRoutingModule } from "./accounts-routing.module";
import { AccountsListComponent } from "./accounts-list/accounts-list.component";
import { AccountsByOwnerComponent } from './accounts-by-owner/accounts-by-owner.component';

@NgModule({
  declarations: [AccountsListComponent, AccountsByOwnerComponent],
  imports: [CommonModule, AccountsRoutingModule],
})
export class AccountsModule {}
