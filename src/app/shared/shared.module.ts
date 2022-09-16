import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogComponent } from "./components/dialog/dialog.component";
import { MaterialModule } from "../material/material.module";
import { FormErrorHandlerPipe } from "./pipes/form-error-handler/form-error-handler.pipe";

@NgModule({
  declarations: [DialogComponent, FormErrorHandlerPipe],
  exports: [DialogComponent, MaterialModule, FormErrorHandlerPipe],
  imports: [CommonModule, MaterialModule],
})
export class SharedModule {}
