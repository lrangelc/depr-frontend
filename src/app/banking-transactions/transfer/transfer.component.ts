import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";
import { IAccount } from "src/app/interfaces/account.interface";
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { BankingTransactionsService } from "src/app/shared/services/banking-transactions/banking-transactions.service";

@Component({
  selector: "fury-transfer",
  templateUrl: "./transfer.component.html",
  styleUrls: ["./transfer.component.scss"],
})
export class TransferComponent implements OnInit {
  refreshAccount: Subject<boolean> = new Subject();

  account: IAccount | undefined;

  form!: FormGroup;
  processing = false;

  get description() {
    return this.form.get("description");
  }

  get amount() {
    return this.form.get("amount");
  }

  get code() {
    return this.form.get("code");
  }

  get dpi() {
    return this.form.get("dpi");
  }

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private bankingTransactionsService: BankingTransactionsService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {}

  accountSelected(account: IAccount) {
    this.account = account;
  }

  refresh() {
    this.refreshAccount.next(true);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      description: ["", [Validators.required]],
      amount: [0, [Validators.required]],
      code: ["", [Validators.required]],
      dpi: ["", [Validators.required]],
    });
  }

  async submit(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      this.processing = true;
      try {
        const newData = {
          userId: this.authService.userId,
          amount: this.amount?.value,
          description: this.description?.value,
          originAccount: {
            _id: this.account._id,
          },
          destinationAccount: {
            code: this.code?.value,
            dpi: this.dpi?.value,
          },
        };
        this.bankingTransactionsService.transfer(newData).subscribe(
          (response: any) => {
            this.processing = false;

            if (response.success) {
              this.refresh();
              this.form.controls["description"].setValue("");
              this.form.controls["code"].setValue("");
              this.form.controls["dpi"].setValue("");
              this.form.controls["amount"].setValue(0);
            }
          },
          (err) => {
            this.processing = false;
            console.error(err);
            this.snackbar.open(
              `${
                err.error.message ?? "Error al hacer una nueva transferencia."
              }`,
              "Bank System",
              {
                duration: 3000,
              }
            );
          }
        );
      } catch (err) {
        console.error("ERROR", err);
      }
    }
  }
}
