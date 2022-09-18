import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../../environments/environment";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class ExchangeRatesService {
  private url = `${environment.backend}/api/exchange-rates`;

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

  getSymbols() {
    return this.httpClient.get(`${this.url}/symbols`, this.options);
  }

  getLatest() {
    return this.httpClient.get(`${this.url}/latest`, this.options);
  }
}
