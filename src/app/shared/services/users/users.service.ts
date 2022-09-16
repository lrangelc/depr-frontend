import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../../../../environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private url = `${environment.backend}/api/users`;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getUsers() {
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.authService.userData.token}`,
      },
    };
    return this.httpClient.get(this.url, options);
  }
}
