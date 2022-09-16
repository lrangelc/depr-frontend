import { LiveAnnouncer } from "@angular/cdk/a11y";
import { SelectionModel } from "@angular/cdk/collections";
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "src/app/shared/services/auth/auth.service";
import { UsersService } from "src/app/shared/services/users/users.service";

export interface IUser {
  _id: string;

  name: string;
  nickname: string;
  dpi: string;
  address: string;
  phone: string;
  email: string;
  job: string;
  monthlyIncome?: number;
  userType: string;
}

const ELEMENT_DATA: IUser[] = [];

@Component({
  selector: "fury-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.scss"],
})
export class UsersListComponent implements OnInit, AfterViewInit, OnDestroy {
  processing = false;

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selection = new SelectionModel<IUser>(true, []);

  subs: Subscription[] = [];
  attendanceRecords$!: Observable<any>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  displayedColumns: string[] = [
    "select",
    "_id",
    "name",
    "nickname",
    "dpi",
    "address",
    "phone",
    "email",
    "job",
    "monthlyIncome",
    "userType",
  ];

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private _liveAnnouncer: LiveAnnouncer,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
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
        this.fillDataSource(response);
        this.processing = false;

        this.snackbar.open(`Registros cargados!`, "Bank System", {
          duration: 10000,
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
}
