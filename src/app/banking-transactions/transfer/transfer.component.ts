import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { IAccount } from "src/app/interfaces/account.interface";

@Component({
  selector: "fury-transfer",
  templateUrl: "./transfer.component.html",
  styleUrls: ["./transfer.component.scss"],
})
export class TransferComponent implements OnInit {
  refreshAccount: Subject<boolean> = new Subject();
  
  account: IAccount | undefined;

  constructor() {}

  ngOnInit(): void {}

  accountSelected(account: IAccount) {
    this.account = account;
  }

  refresh() {
    this.refreshAccount.next(true);
  }
}
