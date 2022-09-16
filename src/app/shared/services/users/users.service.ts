import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../../environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private url = `${environment.backend}/api/users`;

  options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.authService.userData.token}`,
    },
  };

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getUsers() {
    return this.httpClient.get(`${this.url}`, this.options);
  }

  getUser(id: string) {
    return this.httpClient.get(`${this.url}/${id}`, this.options);
  }

  createUser(data: any) {
    return this.httpClient.post(`${this.url}`, data, this.options);
  }

  updateUser(id: string, data: any) {
    return this.httpClient.patch(`${this.url}/${id}`, data, this.options);
  }

  deleteUser(id: string) {
    return this.httpClient.delete(`${this.url}/${id}`, this.options);
  }
}
