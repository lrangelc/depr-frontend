import { LiveAnnouncer } from "@angular/cdk/a11y";
import { SelectionModel } from "@angular/cdk/collections";
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, Subscription } from "rxjs";

import { ListColumn } from "src/app/models/list-column.model";
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { DialogService } from "src/app/shared/services/dialog/dialog.service";
import { FavoritesService } from "src/app/shared/services/favorites/favorites.service";
import { IFavorite } from "src/app/interfaces/favorite.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

const ELEMENT_DATA: IFavorite[] = [];

@Component({
  selector: "fury-favorites-list",
  templateUrl: "./favorites-list.component.html",
  styleUrls: ["./favorites-list.component.scss"],
})
export class FavoritesListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  processing = false;

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selection = new SelectionModel<IFavorite>(true, []);

  subs: Subscription[] = [];
  attendanceRecords$!: Observable<any>;

  @Input()
  columns: ListColumn[] = [] as ListColumn[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  favorites: IFavorite[] = [];
  favorite: IFavorite | undefined;

  favoritesForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private _liveAnnouncer: LiveAnnouncer,
    private snackbar: MatSnackBar,
    private dialogService: DialogService,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.setColumns();
    this.loadDocuments();
  }

  ngAfterViewInit() {
    this.fillDataSource(ELEMENT_DATA);
  }

  ngOnDestroy() {
    this.subs.map((s) => s.unsubscribe);
  }

  buildForm(): void {
    this.favoritesForm = this.formBuilder.group({
      accountControl: [null, Validators.required],
      accountCode: [""],
    });
  }

  changeFavorite(event: any) {
    this.favorite = event;
    this.setFavorite();
  }

  setFavorite() {
    this.favoritesForm.controls["accountCode"].setValue(
      this.favorite.accountCode
    );
  }

  fillDataSource(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: IFavorite): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row._id ?? +1
    }`;
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
            this.favoritesForm.get("accountControl").setValue(this.favorite);
            this.setFavorite();
          }

          this.fillDataSource(response);
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

  deleteRecords() {
    if (this.selection.selected.length > 0) {
      let newArray: IFavorite[] = [...this.dataSource.data];

      this.selection.selected.forEach((elementToDelete: IFavorite) => {
        this.favoritesService.deleteFavorite(elementToDelete._id).subscribe(
          (response: any) => {
            if (response.success) {
              newArray = newArray.filter(
                (element) => element._id !== elementToDelete._id
              );
              this.fillDataSource(newArray);
            }
          },
          (err) => {
            console.error(err);
          }
        );
      });

      this.selection.clear();
    }
  }

  setColumns() {
    this.columns = [
      {
        name: `select`,
        property: "select",
        visible: true,
        isModelProperty: false,
      },
      {
        name: `Id.`,
        property: "_id",
        visible: false,
        isModelProperty: true,
      },
      {
        name: `Code`,
        property: "code",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Name`,
        property: "name",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Credito`,
        property: "totalCredit",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Debito`,
        property: "totalDebit",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Available Balance`,
        property: "availableBalance",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Transactions`,
        property: "countTransactions",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Ultima Transaccion`,
        property: "lastTransaction",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Tipo`,
        property: "lastTransaction.type",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Descripcion`,
        property: "lastTransaction.description",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Monto`,
        property: "lastTransaction.amount",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `actions`,
        property: "actions",
        visible: true,
        isModelProperty: false,
      },
    ] as ListColumn[];
  }

  get visibleColumns() {
    try {
      return this.columns
        .filter((column) => column.visible)
        .map((column) => column.property);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  delete(document: IFavorite) {
    if (this.authService.userId !== document._id) {
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
}
