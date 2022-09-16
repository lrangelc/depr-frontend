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
import { UsersService } from "src/app/shared/services/users/users.service";
import { IUser } from "src/app/interfaces/user.interface";

const ELEMENT_DATA: IUser[] = [];

@Component({
  selector: 'fury-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss']
})
export class AccountsListComponent implements OnInit, AfterViewInit, OnDestroy {
  processing = false;

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selection = new SelectionModel<IUser>(true, []);

  subs: Subscription[] = [];
  attendanceRecords$!: Observable<any>;

  @Input()
  columns: ListColumn[] = [] as ListColumn[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private _liveAnnouncer: LiveAnnouncer,
    private snackbar: MatSnackBar,
    private dialogService: DialogService
  ) {}

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

  checkboxLabel(row?: IUser): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row._id ?? +1
    }`;
  }

  loadDocuments() {
    this.usersService.getUsers().subscribe(
      (response: any) => {
        const users = response.filter((element) => {
          return (
            element.userType === "user" ||
            element._id === this.authService.userData.userId
          );
        });
        this.fillDataSource(users);
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
      let newArray: IUser[] = [...this.dataSource.data];

      this.selection.selected.forEach((elementToDelete: IUser) => {
        if (this.authService.userData.userId !== elementToDelete._id) {
          this.usersService.deleteUser(elementToDelete._id).subscribe(
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
        }
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
        name: `Nickname`,
        property: "nickname",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `DPI`,
        property: "dpi",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Address`,
        property: "address",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Phone`,
        property: "phone",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Email`,
        property: "email",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Job`,
        property: "job",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Monthly Income`,
        property: "monthlyIncome",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Type`,
        property: "userType",
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

  delete(document: IUser) {
    if (this.authService.userData.userId !== document._id) {
      this.dialogService
        .openConfirmationDialog(
          "confirmation",
          "Eliminar Usuario",
          `¿Estas seguro de eliminar el usuario ${document.name}?`,
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

  deleteDocument(document: IUser) {
    try {
      this.usersService.deleteUser(document._id).subscribe(
        (response: any) => {
          if (response.success) {
            this.loadDocuments();

            this.snackbar.open(
              `Se ha eliminado el usuario ${document.name}`,
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