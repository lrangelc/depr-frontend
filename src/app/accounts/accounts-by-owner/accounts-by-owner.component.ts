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
import { AccountsService } from "src/app/shared/services/accounts/accounts.service";
import { IAccount } from "src/app/interfaces/account.interface";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { BankingTransactionsService } from "src/app/shared/services/banking-transactions/banking-transactions.service";

const ELEMENT_DATA: IAccount[] = [];

@Component({
  selector: "fury-accounts-by-owner",
  templateUrl: "./accounts-by-owner.component.html",
  styleUrls: ["./accounts-by-owner.component.scss"],
})
export class AccountsByOwnerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  processing = false;

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selection = new SelectionModel<IAccount>(true, []);

  subs: Subscription[] = [];
  attendanceRecords$!: Observable<any>;

  @Input()
  columns: ListColumn[] = [] as ListColumn[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  accounts: IAccount[] = [];
  account: IAccount | undefined;

  filterForm!: FormGroup;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  currentDate: Date = new Date();
  searchRecords = false;

  constructor(
    private authService: AuthService,
    private accountsService: AccountsService,
    private bankingTransactionsService: BankingTransactionsService,
    private _liveAnnouncer: LiveAnnouncer,
    private snackbar: MatSnackBar,
    private dialogService: DialogService,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.range.controls["start"].setValue(this.currentDate);
    this.range.controls["end"].setValue(this.currentDate);

    this.setColumns();
    this.loadAccounts();
  }

  ngAfterViewInit() {
    this.fillDataSource(ELEMENT_DATA);
  }

  ngOnDestroy() {
    this.subs.map((s) => s.unsubscribe);
  }

  buildForm(): void {
    this.filterForm = this.formBuilder.group({
      accountControl: [null, Validators.required],
    });
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

  checkboxLabel(row?: IAccount): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row._id ?? +1
    }`;
  }

  loadAccounts() {
    this.processing = true;
    this.accountsService.getAccountsByOwner(this.authService.userId).subscribe(
      (response: any) => {
        this.accounts = response;
        if (this.accounts.length > 0) {
          this.account = this.accounts[0];
          this.filterForm.get("accountControl").setValue(this.account);
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
        name: `Fecha`,
        property: "createdAt",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Tipo`,
        property: "type",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Descripcion`,
        property: "description",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Credito`,
        property: "credit",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Debito`,
        property: "debit",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `Balance`,
        property: "balance",
        visible: true,
        isModelProperty: true,
      },
      {
        name: `actions`,
        property: "actions",
        visible: false,
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

  changeAccount(event: any) {
    this.account = event;
    if (this.searchRecords) {
      this.loadDocuments();
    }
  }

  addEventDatePicker(
    type: string,
    event: MatDatepickerInputEvent<Date>,
    controlName: string
  ) {
    try {
      if (controlName === "end") {
        this.loadDocuments();
      }
    } catch (err) {
      console.error(err);
    }
  }

  loadDocuments() {
    const startDate: Date = new Date(this.range.controls["start"].value);
    const endDate: Date = new Date(this.range.controls["end"].value);

    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    if (startDate <= endDate) {
      this.processing = true;

      this.bankingTransactionsService
        .getTransactionsByAccount(
          this.account._id,
          `${startDate.getFullYear()}-${
            startDate.getMonth() + 1
          }-${startDate.getDate()}`,
          `${endDate.getFullYear()}-${
            endDate.getMonth() + 1
          }-${endDate.getDate()}`
        )
        .subscribe(
          (response: any) => {
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
  }

  onSearchRecords() {
    this.searchRecords = true;
    this.loadDocuments();
  }
}
