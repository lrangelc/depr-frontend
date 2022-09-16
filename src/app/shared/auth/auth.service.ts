import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userData: any; // Save logged in user data

  private url = `${environment.backend}/api/login`;

  private _authStateSubject = new BehaviorSubject<string | null>(null);

  authState$ = this._authStateSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.setAuthState(null);
  }

  login(email: string, password: string) {
    const data = { email, password };
    return this.httpClient.post(this.url, data);
  }

  setUser(data: any) {
    this.userData = data;
    localStorage.setItem("user", JSON.stringify(this.userData));
    localStorage.setItem("email", this.userData.email);
    localStorage.setItem("userId", this.userData.userId);
    localStorage.setItem("userName", this.userData.name);
    localStorage.setItem("userNickname", this.userData.nickname);
    localStorage.setItem("userAddress", this.userData.address);
    localStorage.setItem("userPhone", this.userData.phone);
    localStorage.setItem("token", this.userData.token);
    this.setAuthState(this.userData.userId);
  }

  private setAuthState(status: string | null) {
    this._authStateSubject.next(status);
  }

  hasUser() {
    return this.authState$;
  }

  logout() {
    this.setAuthState(null);
  }
}
