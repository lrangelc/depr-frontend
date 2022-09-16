import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FavoritesRoutingModule } from "./favorites-routing.module";
import { FavoritesListComponent } from "./favorites-list/favorites-list.component";

@NgModule({
  declarations: [FavoritesListComponent],
  imports: [CommonModule, FavoritesRoutingModule],
})
export class FavoritesModule {}
