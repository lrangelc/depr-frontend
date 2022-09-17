import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../../environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class BankingTransactionsService {
  private url = `${environment.backend}/api/banking-transactions`;

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

  getTransactionsByAccount(
    accountId: string,
    startDate: string,
    endDate: string
  ) {
    return this.httpClient.get(
      `${this.url}/by-account/${accountId}?start-date=${startDate}&end-date=${endDate}`,
      this.options
    );
  }
}
