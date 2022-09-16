import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userData: any; // Save logged in user data

  private url = `${environment.backend}/api/login`;

  private _authStateSubject = new BehaviorSubject<string | null>(null);

  authState$ = this._authStateSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    const userData = localStorage.getItem("userData");
    if (userData) {
      this.userData = JSON.parse(userData);

      this.setAuthState(this.userData.userId);
    }
  }

  login(email: string, password: string) {
    const data = { email, password };
    return this.httpClient.post(this.url, data);
  }

  setUser(data: any) {
    this.userData = data;

    localStorage.setItem("userData", JSON.stringify(this.userData));

    // localStorage.setItem("email", this.userData.email);
    // localStorage.setItem("userId", this.userData.userId);

    this.setAuthState(this.userData.userId);
  }

  private setAuthState(status: string | null) {
    if (!status) {
      localStorage.removeItem("userData");
    }
    this._authStateSubject.next(status);
  }

  hasUser() {
    return this.authState$;
  }

  logout() {
    this.setAuthState(null);
  }
}
