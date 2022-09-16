import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AccountsListComponent } from "./accounts-list/accounts-list.component";
import { AccountsByOwnerComponent } from './accounts-by-owner/accounts-by-owner.component';

const routes: Routes = [
  {
    path: "",
    component: AccountsListComponent,
  },
  {
    path: "by-owner",
    component: AccountsByOwnerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}
