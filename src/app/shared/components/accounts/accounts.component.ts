import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IAccount } from "src/app/interfaces/account.interface";
import { AccountsService } from "../../services/accounts/accounts.service";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "fury-accounts",
  templateUrl: "./accounts.component.html",
  styleUrls: ["./accounts.component.scss"],
})
export class AccountsComponent implements OnInit {

  @Output() accountSelected = new EventEmitter<IAccount>();
  
  accounts: IAccount[] = [];
  account: IAccount | undefined;

  accountForm!: FormGroup;

  searchRecords = false;
  processing = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private accountsService: AccountsService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  buildForm(): void {
    this.accountForm = this.formBuilder.group({
      accountControl: [null, Validators.required],
      code: [""],
      availableBalance: [0],
    });
  }

  loadAccounts() {
    this.processing = true;
    this.accountsService.getAccountsByOwner(this.authService.userId).subscribe(
      (response: any) => {
        this.accounts = response;
        if (this.accounts.length > 0) {
          this.account = this.accounts[0];
          this.accountForm.get("accountControl").setValue(this.account);
          this.setAccount();
        }

        this.processing = false;

        this.snackbar.open(`Registros cargados!`, "Bank System", {
          duration: 3000,
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }

  changeAccount(event: any) {
    this.account = event;
    this.setAccount();

    // if (this.searchRecords) {
    //   this.loadDocuments();
    // }
  }

  setAccount() {
    this.accountSelected.emit(this.account);

    this.accountForm.controls["code"].setValue(this.account.code);
    this.accountForm.controls["availableBalance"].setValue(
      this.account.availableBalance
    );
  }
}
