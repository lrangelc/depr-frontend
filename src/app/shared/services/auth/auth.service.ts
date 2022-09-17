import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userData: any = null; // Save logged in user data

  private url = `${environment.backend}/api/login`;

  private _authStateSubject = new BehaviorSubject<string | null>(null);

  authState$ = this._authStateSubject.asObservable();

  get userId() {
    return this.getPayload().userId;
  }

  get email() {
    return this.getPayload().email;
  }

  get userType() {
    return this.getPayload().userType;
  }

  get name() {
    return this.userData ? this.userData.name : "";
  }

  get token() {
    return this.userData.token;
  }

  getPayload() {
    if (!this.userData) {
      return { name: null };
    }
    return JSON.parse(atob(this.userData.token.split(".")[1]));
  }

  constructor(private httpClient: HttpClient) {
    const userData = localStorage.getItem("userData");
    if (userData) {
      this.userData = JSON.parse(userData);

      this.setAuthState(this.userId);
    }
  }

  login(email: string, password: string) {
    const data = { email, password };
    return this.httpClient.post(this.url, data);
  }

  setUser(data: any) {
    const payload = JSON.parse(atob(data.token.split(".")[1]));
    this.userData = data;

    localStorage.setItem("userData", JSON.stringify(this.userData));

    this.setAuthState(payload.userId);
  }

  private setAuthState(status: string | null) {
    if (!status) {
      localStorage.removeItem("userData");
      this.userData = null;
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
