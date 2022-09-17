import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AccountsListComponent } from "./accounts-list/accounts-list.component";
import { AccountsByOwnerComponent } from "./accounts-by-owner/accounts-by-owner.component";
import { AccountFormComponent } from "./account-form/account-form.component";

const routes: Routes = [
  {
    path: "",
    component: AccountsListComponent,
  },
  {
    path: "by-owner",
    component: AccountsByOwnerComponent,
  },
  {
    path: "new/:userId",
    component: AccountFormComponent,
  },
  {
    path: 'edit/:id',
    component: AccountFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}
