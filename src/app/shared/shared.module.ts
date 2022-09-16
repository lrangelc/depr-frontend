import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogComponent } from "./components/dialog/dialog.component";
import { MaterialModule } from "../material/material.module";

@NgModule({
  declarations: [DialogComponent],
  exports: [DialogComponent, MaterialModule],
  imports: [CommonModule, MaterialModule],
})
export class SharedModule {}
