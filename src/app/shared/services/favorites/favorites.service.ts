import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../../environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class FavoritesService {
  private url = `${environment.backend}/api/favorites`;

  options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.authService.token}`,
    },
  };

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getFavorites() {
    return this.httpClient.get(`${this.url}`, this.options);
  }

  getFavorite(id: string) {
    return this.httpClient.get(`${this.url}/${id}`, this.options);
  }

  createFavorite(data: any) {
    return this.httpClient.post(`${this.url}`, data, this.options);
  }

  updateFavorite(id: string, data: any) {
    return this.httpClient.patch(`${this.url}/${id}`, data, this.options);
  }

  deleteFavorite(id: string) {
    return this.httpClient.delete(`${this.url}/${id}`, this.options);
  }

  getFavoritesByOwner(ownerId: string) {
    return this.httpClient.get(`${this.url}/by-owner/${ownerId}`, this.options);
  }
}
