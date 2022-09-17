import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FavoritesRoutingModule } from "./favorites-routing.module";
import { FavoritesListComponent } from "./favorites-list/favorites-list.component";
import { MaterialModule } from "../material/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { FurySharedModule } from "src/@fury/fury-shared.module";
import { FavoriteFormComponent } from './favorite-form/favorite-form.component';

@NgModule({
  declarations: [FavoritesListComponent, FavoriteFormComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FurySharedModule,
    FavoritesRoutingModule,
  ],
})
export class FavoritesModule {}
