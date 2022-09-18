import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogComponent } from "./components/dialog/dialog.component";
import { MaterialModule } from "../material/material.module";
import { FormErrorHandlerPipe } from "./pipes/form-error-handler/form-error-handler.pipe";
import { AccountsComponent } from "./components/accounts/accounts.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FurySharedModule } from "src/@fury/fury-shared.module";
import { ExchangeRatesComponent } from './components/exchange-rates/exchange-rates.component';

@NgModule({
  declarations: [DialogComponent, FormErrorHandlerPipe, AccountsComponent, ExchangeRatesComponent],
  exports: [
    DialogComponent,
    MaterialModule,
    FormErrorHandlerPipe,
    AccountsComponent,
    ExchangeRatesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FurySharedModule,
  ],
})
export class SharedModule {}
