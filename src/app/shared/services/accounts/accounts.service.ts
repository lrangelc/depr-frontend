import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../../environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class AccountsService {
  private url = `${environment.backend}/api/accounts`;

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

  getAccounts() {
    return this.httpClient.get(`${this.url}`, this.options);
  }

  getAccount(id: string) {
    return this.httpClient.get(`${this.url}/${id}`, this.options);
  }

  createAccount(data: any) {
    return this.httpClient.post(`${this.url}`, data, this.options);
  }

  updateAccount(id: string, data: any) {
    return this.httpClient.patch(`${this.url}/${id}`, data, this.options);
  }

  deleteAccount(id: string) {
    return this.httpClient.delete(`${this.url}/${id}`, this.options);
  }

  getAccountsByOwner(ownerId: string) {
    return this.httpClient.get(`${this.url}/by-owner/${ownerId}`, this.options);
  }
}
