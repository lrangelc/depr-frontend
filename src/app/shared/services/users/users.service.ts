import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

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

  getUser(userId: string) {
    return this.httpClient.get(`${this.url}/${userId}`, this.options);
  }

  createUser(data: any) {
    return this.httpClient.post(`${this.url}`, data, this.options);
  }

  updateUser(userId: string, data: any) {
    return this.httpClient.patch(`${this.url}/${userId}`, data, this.options);
  }

  deleteUser(userId: string) {
    return this.httpClient.delete(`${this.url}/${userId}`, this.options);
  }
}
