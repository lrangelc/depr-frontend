import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

import { fadeInUpAnimation } from "../../../../@fury/animations/fade-in-up.animation";
import { AuthService } from "src/app/shared/services/auth/auth.service";

@Component({
  selector: "fury-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: [fadeInUpAnimation],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  inputType = "password";
  visible = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  send() {
    this.authService
      .login(
        this.form.controls["email"].value,
        this.form.controls["password"].value
      )
      .subscribe(
        (response: any) => {
          if (response.success) {
            this.authService.setUser(response.data);
            this.router.navigate(["/"]);
            this.snackbar.open(
              `Welcome ${response.data.nickname ?? response.data.name}!`,
              "Bank System",
              {
                duration: 10000,
              }
            );
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = "password";
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = "text";
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
