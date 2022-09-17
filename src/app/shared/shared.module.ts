import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogComponent } from "./components/dialog/dialog.component";
import { MaterialModule } from "../material/material.module";
import { FormErrorHandlerPipe } from "./pipes/form-error-handler/form-error-handler.pipe";
import { AccountsComponent } from "./components/accounts/accounts.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [DialogComponent, FormErrorHandlerPipe, AccountsComponent],
  exports: [
    DialogComponent,
    MaterialModule,
    FormErrorHandlerPipe,
    AccountsComponent,
  ],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
})
export class SharedModule {}
