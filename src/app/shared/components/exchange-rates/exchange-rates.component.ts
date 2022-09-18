import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject, Subscription } from "rxjs";
import { IAccount } from "src/app/interfaces/account.interface";
import { ExchangeRatesService } from "../../services/exchange-rates/exchange-rates.service";
import { AuthService } from "../../services/auth/auth.service";
import { ISymbol } from "src/app/interfaces/exchangeRate.interface";

@Component({
  selector: "fury-exchange-rates",
  templateUrl: "./exchange-rates.component.html",
  styleUrls: ["./exchange-rates.component.scss"],
})
export class ExchangeRatesComponent implements OnInit, OnDestroy {
  @Output() symbolSelected = new EventEmitter<ISymbol>();
  @Input() refreshAccount: Subject<boolean>;

  subs: Subscription[] = [];

  exchangeForm!: FormGroup;

  searchRecords = false;
  processing = false;

  symbols: ISymbol[] = [];
  symbol: ISymbol | undefined;
  latest: any | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private exchangeRatesService: ExchangeRatesService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    // this.loadLatest();
    this.loadSymbols();

    if (this.refreshAccount) {
      this.subs.push(
        this.refreshAccount.subscribe((v) => {
          this.loadDocument();
        })
      );
    }
  }

  ngOnDestroy() {
    this.subs.map((s) => s.unsubscribe);
  }

  buildForm(): void {
    this.exchangeForm = this.formBuilder.group({
      accountControl: [null, Validators.required],
      currencyCode: [""],
      name: [""],
      rate: [0],
      conversion: [0],
    });
  }

  loadSymbols() {
    this.processing = true;
    this.exchangeRatesService.getSymbols().subscribe(
      (response: any) => {
        this.symbols = response;
        this.symbols.sort((a, b) => {
          if (a.order < b.order) {
            return -1;
          }
          if (a.order > b.order) {
            return 1;
          }
          return 0;
        });

        if (this.symbols.length > 0) {
          this.symbol = this.symbols[0];
          this.exchangeForm.get("accountControl").setValue(this.symbol);
          this.setSymbol();
        }

        this.processing = false;

        this.loadLatest();
        this.snackbar.open(`Registros cargados!`, "Bank System", {
          duration: 3000,
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }

  loadLatest() {
    this.processing = true;
    this.exchangeRatesService.getLatest().subscribe(
      (response: any) => {
        this.latest = response;
        if (this.latest.rates) {
          this.setSymbol();
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

  changeSymbol(event: any) {
    this.symbol = event;
    this.setSymbol();
  }

  setSymbol() {
    let rate = 0;
    let conversion = 0;

    this.exchangeForm.controls["name"].setValue(this.symbol.name);
    this.exchangeForm.controls["currencyCode"].setValue(
      this.symbol.currencyCode
    );

    if (this.latest) {
      rate = this.latest.rates[this.symbol.currencyCode];
      conversion = Math.round((1.0 / rate + Number.EPSILON) * 100) / 100;
    }
    this.symbol.rate = rate;
    this.symbol.conversion = conversion;
    this.exchangeForm.controls["rate"].setValue(this.symbol.rate);
    this.exchangeForm.controls["conversion"].setValue(this.symbol.conversion);

    this.symbolSelected.emit(this.symbol);
  }

  loadDocument() {
    this.processing = true;
    // this.exchangeRatesService.getAccount(this.account._id).subscribe(
    //   (response: any) => {
    //     this.account = response;
    //     this.setAccount();

    //     this.processing = false;

    //     this.snackbar.open(`Cuenta actualizada!`, "Bank System", {
    //       duration: 3000,
    //     });
    //   },
    //   (err) => {
    //     console.error(err);
    //   }
    // );
  }
}
