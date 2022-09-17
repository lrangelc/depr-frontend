import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { FavoritesListComponent } from "./favorites-list/favorites-list.component";
import { FavoriteFormComponent } from "./favorite-form/favorite-form.component";

const routes: Routes = [
  {
    path: "",
    component: FavoritesListComponent,
  },
  {
    path: "new",
    component: FavoriteFormComponent,
  },
  {
    path: "edit/:id",
    component: FavoriteFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritesRoutingModule {}
