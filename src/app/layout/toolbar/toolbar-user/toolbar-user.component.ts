import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/auth/auth.service";

@Component({
  selector: "fury-toolbar-user",
  templateUrl: "./toolbar-user.component.html",
  styleUrls: ["./toolbar-user.component.scss"],
})
export class ToolbarUserComponent implements OnInit {
  isOpen: boolean;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit() {}

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    this.isOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
