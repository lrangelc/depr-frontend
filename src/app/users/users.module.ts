import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MaterialModule } from "../material/material.module";
import { UsersRoutingModule } from "./users-routing.module";
import { UsersListComponent } from "./users-list/users-list.component";
import { UserFormComponent } from "./user-form/user-form.component";

@NgModule({
  declarations: [UsersListComponent, UserFormComponent],
  imports: [CommonModule, MaterialModule, UsersRoutingModule],
})
export class UsersModule {}
