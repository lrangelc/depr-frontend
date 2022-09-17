import { LiveAnnouncer } from "@angular/cdk/a11y";
import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject, Subscription } from "rxjs";

import { AuthService } from "src/app/shared/services/auth/auth.service";
import { DialogService } from "src/app/shared/services/dialog/dialog.service";
import { FavoritesService } from "src/app/shared/services/favorites/favorites.service";
import { IFavorite } from "src/app/interfaces/favorite.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IAccount } from "src/app/interfaces/account.interface";
import { BankingTransactionsService } from "src/app/shared/services/banking-transactions/banking-transactions.service";

const ELEMENT_DATA: IFavorite[] = [];

@Component({
  selector: "fury-favorites-list",
  templateUrl: "./favorites-list.component.html",
  styleUrls: ["./favorites-list.component.scss"],
})
export class FavoritesListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  refreshAccount: Subject<boolean> = new Subject();

  processing = false;

  subs: Subscription[] = [];

  account: IAccount | undefined;
  favorites: IFavorite[] = [];
  favorite: IFavorite | undefined;
  destinationFavorite: IFavorite | undefined;

  favoritesForm!: FormGroup;
  destinationFavoritesForm!: FormGroup;
  formTransfer!: FormGroup;

  get description() {
    return this.formTransfer.get("description");
  }

  get amount() {
    return this.formTransfer.get("amount");
  }

  get code() {
    return this.destinationFavorite.accountCode;
  }

  get dpi() {
    return this.destinationFavorite.accountDpi;
  }

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private _liveAnnouncer: LiveAnnouncer,
    private snackbar: MatSnackBar,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private bankingTransactionsService: BankingTransactionsService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.loadDocuments();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.subs.map((s) => s.unsubscribe);
  }

  buildForm(): void {
    this.favoritesForm = this.formBuilder.group({
      accountControl: [null, Validators.required],
      accountCode: [""],
    });

    this.destinationFavoritesForm = this.formBuilder.group({
      accountControl: [null, Validators.required],
      accountCode: [""],
    });

    this.formTransfer = this.formBuilder.group({
      description: ["", [Validators.required]],
      amount: [0, [Validators.required]],
      code: [""],
      dpi: [""],
    });
  }

  changeFavorite(event: any) {
    this.favorite = event;
    this.setFavorite();
  }

  changeDestinationFavorite(event: any) {
    this.destinationFavorite = event;
    this.setDestinationFavorite();
  }

  setFavorite() {
    this.favoritesForm.controls["accountCode"].setValue(
      this.favorite.accountCode
    );
  }

  setDestinationFavorite() {
    this.destinationFavoritesForm.controls["accountCode"].setValue(
      this.destinationFavorite.accountCode
    );
  }

  loadDocuments() {
    this.favoritesService
      .getFavoritesByOwner(this.authService.userId)
      .subscribe(
        (response: any) => {
          response.forEach((element) => {
            if (!element.lastTransaction) {
              element.lastTransaction = {};
            }
          });
          this.favorites = response;
          if (this.favorites.length > 0) {
            this.favorite = this.favorites[0];
            this.destinationFavorite = this.favorites[0];
            this.favoritesForm.get("accountControl").setValue(this.favorite);
            this.destinationFavoritesForm
              .get("accountControl")
              .setValue(this.favorite);
            this.setFavorite();
            this.setDestinationFavorite();
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

  delete(document: IFavorite) {
    this.dialogService
      .openConfirmationDialog(
        "confirmation",
        "Eliminar Usuario",
        `¿Estas seguro de eliminar el favorito ${document.accountAlias}?`,
        "Cancelar",
        "Eliminar"
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.deleteDocument(document);
        }
      });
  }

  deleteDocument(document: IFavorite) {
    try {
      this.favoritesService.deleteFavorite(document._id).subscribe(
        (response: any) => {
          if (response.success) {
            this.loadDocuments();

            this.snackbar.open(
              `Se ha eliminado el favorito ${document.accountAlias}`,
              "Bank System",
              {
                duration: 3000,
              }
            );
          }
        },
        (err) => {
          console.error(err);
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  accountSelected(account: IAccount) {
    this.account = account;
    // if (this.searchRecords) {
    //   this.loadDocuments();
    // }
  }

  async submit(event: Event) {
    event.preventDefault();
    if (this.formTransfer.valid) {
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
            code: this.code,
            dpi: this.dpi,
          },
        };
        this.bankingTransactionsService.transfer(newData).subscribe(
          (response: any) => {
            this.processing = false;

            if (response.success) {
              this.refresh();
              this.formTransfer.controls["description"].setValue("");
              this.formTransfer.controls["code"].setValue("");
              this.formTransfer.controls["dpi"].setValue("");
              this.formTransfer.controls["amount"].setValue(0);
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

  refresh() {
    this.refreshAccount.next(true);
  }
}
