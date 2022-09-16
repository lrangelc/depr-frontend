import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MaterialModule } from "../material/material.module";
import { UsersRoutingModule } from "./users-routing.module";
import { UsersListComponent } from "./users-list/users-list.component";
import { UserFormComponent } from "./user-form/user-form.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [UsersListComponent, UserFormComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    UsersRoutingModule,
  ],
})
export class UsersModule {}
