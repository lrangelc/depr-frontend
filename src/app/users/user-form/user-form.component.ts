import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { IUser, IUserType } from "src/app/interfaces/user.interface";
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { UsersService } from "src/app/shared/services/users/users.service";

@Component({
  selector: "fury-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.scss"],
})
export class UserFormComponent implements OnInit {
  baseText = "Usuario";
  selectedBusinessId = "";

  title = this.baseText + " - ";
  document: Partial<IUser> = {};
  form!: FormGroup;
  userTypes: IUserType[] = [IUserType.user, IUserType.admin];
  paramId: string | null = null;

  get name() {
    return this.form.get("name");
  }

  get nickname() {
    return this.form.get("nickname");
  }

  get dpi() {
    return this.form.get("dpi");
  }

  get address() {
    return this.form.get("address");
  }

  get phone() {
    return this.form.get("phone");
  }

  get email() {
    return this.form.get("email");
  }

  get job() {
    return this.form.get("job");
  }

  get monthlyIncome() {
    return this.form.get("monthlyIncome");
  }

  get password() {
    return this.form.get("password");
  }

  get userType() {
    return this.form.get("userType");
  }

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ) {
    this.buildForm();
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id !== undefined && params.id !== null) {
        this.title += "edit";
        this.paramId = params.id;
      } else {
        this.title += "new";
      }
    });
  }

  ngOnInit(): void {
    this.loadDocument(this.paramId);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required]],
      nickname: ["", [Validators.required]],
      dpi: ["", [Validators.required]],
      address: ["", [Validators.required]],
      phone: ["", [Validators.required]],
      email: ["", [Validators.required]],
      job: ["", [Validators.required]],
      monthlyIncome: [0, [Validators.required]],
      password: ["", [Validators.required]],
      userType: [IUserType.user, [Validators.required]],
    });
  }

  changeType(event: any) {
    this.userType?.setValue(event);
  }

  async loadDocument(id: string | null) {
    if (id) {
      this.usersService.getUser(id).subscribe(
        (response: any) => {
          this.document = response;
          this.patchForm();
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  patchForm() {
    this.form.patchValue({
      name: this.document.name,
      nickname: this.document.nickname,
      dpi: this.document.dpi,
      address: this.document.address,
      phone: this.document.phone,
      email: this.document.email,
      userType: this.document.userType,
      job: this.document.job,
      monthlyIncome: this.document.monthlyIncome,
      password: this.document.password,
    });
  }

  async submit(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      this.document.name = this.name?.value;
      this.document.nickname = this.nickname?.value;
      this.document.dpi = this.dpi?.value;
      this.document.address = this.address?.value;
      this.document.phone = this.phone?.value;
      this.document.email = this.email?.value;
      this.document.job = this.job?.value;
      this.document.monthlyIncome = this.monthlyIncome?.value;
      this.document.password = this.password?.value;
      this.document.userType = this.userType?.value;

      try {
        const data = {
          name: this.document.name,
          nickname: this.document.nickname,
          dpi: this.document.dpi,
          address: this.document.address,
          phone: this.document.phone,
          email: this.document.email,
          job: this.document.job,
          monthlyIncome: this.document.monthlyIncome,
          password: this.document.password,
          userType: this.document.userType,
        };

        if (!this.document._id) {
          this.usersService.createUser(data).subscribe(
            (response: any) => {
              if (response.success) {
                this.document._id = response._id;
                this.router.navigate(["/users"]);
              }
            },
            (err) => {
              console.error(err);
            }
          );
        } else {
          this.usersService.updateUser(this.document._id, data).subscribe(
            (response: any) => {
              if (response.modifiedCount > 0) {
                this.router.navigate(["/users"]);
              }
            },
            (err) => {
              console.error(err);
            }
          );
        }
      } catch (err) {
        console.error("ERROR", err);
      }
    }
  }

  getSelectedData(event: any) {
    const target = event.source.selected._element.nativeElement;
    return {
      value: event.value,
      text: target.innerText.trim(),
    };
  }
}
