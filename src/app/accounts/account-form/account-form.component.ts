import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { IAccount } from "src/app/interfaces/account.interface";
import { AccountsService } from "src/app/shared/services/accounts/accounts.service";

@Component({
  selector: "fury-account-form",
  templateUrl: "./account-form.component.html",
  styleUrls: ["./account-form.component.scss"],
})
export class AccountFormComponent implements OnInit {
  baseText = "Cuenta";
  selectedBusinessId = "";

  title = this.baseText + " - ";
  document: Partial<IAccount> = {};
  form!: FormGroup;
  paramId: string | null = null;
  ownerId: string | null = null;

  get name() {
    return this.form.get("name");
  }

  get startingAmount() {
    return this.form.get("startingAmount");
  }

  get code() {
    return this.form.get("code");
  }

  get totalCredit() {
    return this.form.get("totalCredit");
  }

  get totalDebit() {
    return this.form.get("totalDebit");
  }

  get availableBalance() {
    return this.form.get("availableBalance");
  }

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private accountsService: AccountsService,
    private snackbar: MatSnackBar
  ) {
    this.buildForm();
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.userId) {
        this.title += "Nueva";
        this.ownerId = params.userId;
      } else {
        if (params.id) {
          this.title += "Editar";
          this.paramId = params.id;
        } else {
          this.title += "Nueva";
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadDocument(this.paramId);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required]],
      startingAmount: [0, [Validators.required]],
      code: [""],
      totalCredit: [0],
      totalDebit: [0],
      availableBalance: [0],
    });
  }

  async loadDocument(id: string | null) {
    if (id) {
      this.accountsService.getAccount(id).subscribe(
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
      startingAmount: this.document.startingAmount,
      code: this.document.code,
      totalCredit: this.document.totalCredit,
      totalDebit: this.document.totalDebit,
      availableBalance: this.document.availableBalance,
    });
  }

  async submit(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      this.document.name = this.name?.value;
      this.document.startingAmount = this.startingAmount?.value;
      this.document.code = this.code?.value;
      this.document.totalCredit = this.totalCredit?.value;
      this.document.totalDebit = this.totalDebit?.value;
      this.document.availableBalance = this.availableBalance?.value;

      try {
        if (!this.document._id) {
          const newData = {
            ownerId: this.ownerId,
            name: this.document.name,
            startingAmount: this.document.startingAmount,
          };
          this.accountsService.createAccount(newData).subscribe(
            (response: any) => {
              if (response.success) {
                this.document._id = response._id;
                this.router.navigate(["/accounts"]);
              }
            },
            (err) => {
              console.error(err);
              this.snackbar.open(
                `${err.error.message ?? "Error al agregar una nueva cuenta."}`,
                "Bank System",
                {
                  duration: 3000,
                }
              );
            }
          );
        } else {
          const updateData = {
            name: this.document.name,
          };
          this.accountsService
            .updateAccount(this.document._id, updateData)
            .subscribe(
              (response: any) => {
                if (response.modifiedCount > 0) {
                  this.router.navigate(["/accounts"]);
                }
              },
              (err) => {
                console.error(err);
                this.snackbar.open(
                  `${err.error.message ?? "Error al actualizar la cuenta."}`,
                  "Bank System",
                  {
                    duration: 3000,
                  }
                );
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
