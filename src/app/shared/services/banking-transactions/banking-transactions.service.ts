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
      Authorization: `Bearer ${this.authService.token}`,
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

  transfer(data: any) {
    return this.httpClient.post(`${this.url}/transfer`, data, this.options);
  }
}
