import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { IFavorite } from "src/app/interfaces/favorite.interface";
import { FavoritesService } from "src/app/shared/services/favorites/favorites.service";

@Component({
  selector: "fury-favorite-form",
  templateUrl: "./favorite-form.component.html",
  styleUrls: ["./favorite-form.component.scss"],
})
export class FavoriteFormComponent implements OnInit {
  baseText = "Favorito";
  selectedBusinessId = "";

  title = this.baseText + " - ";
  document: Partial<IFavorite> = {};
  form!: FormGroup;
  paramId: string | null = null;
  ownerId: string | null = null;

  get accountAlias() {
    return this.form.get("accountAlias");
  }

  get accountCode() {
    return this.form.get("accountCode");
  }

  get accountDpi() {
    return this.form.get("accountDpi");
  }

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private favoritesService: FavoritesService,
    private snackbar: MatSnackBar
  ) {
    this.buildForm();
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.userId) {
        this.title += "Nuevo";
        this.ownerId = params.userId;
      } else {
        if (params.id) {
          this.title += "Editar";
          this.paramId = params.id;
        } else {
          this.title += "Nuevo";
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadDocument(this.paramId);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      accountAlias: ["", [Validators.required]],
      accountCode: ["", [Validators.required]],
      accountDpi: ["", [Validators.required]],
    });
  }

  async loadDocument(id: string | null) {
    if (id) {
      this.favoritesService.getFavorite(id).subscribe(
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
      accountAlias: this.document.accountAlias,
      accountCode: this.document.accountCode,
      accountDpi: this.document.accountDpi,
    });
  }

  async submit(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      this.document.accountAlias = this.accountAlias?.value;
      this.document.accountCode = this.accountCode?.value;
      this.document.accountDpi = this.accountDpi?.value;

      try {
        if (!this.document._id) {
          const newData = {
            ownerId: this.ownerId,
            accountAlias: this.document.accountAlias,
            accountCode: this.document.accountCode,
            accountDpi: this.document.accountDpi,
          };
          this.favoritesService.createFavorite(newData).subscribe(
            (response: any) => {
              if (response.success) {
                this.document._id = response._id;
                this.router.navigate(["/favorites"]);
              }
            },
            (err) => {
              console.error(err);
              this.snackbar.open(
                `${err.error.message ?? "Error al agregar un nuevo favorito."}`,
                "Bank System",
                {
                  duration: 3000,
                }
              );
            }
          );
        } else {
          const updateData = {
            accountAlias: this.document.accountAlias,
          };
          this.favoritesService
            .updateFavorite(this.document._id, updateData)
            .subscribe(
              (response: any) => {
                if (response.modifiedCount > 0) {
                  this.router.navigate(["/favorites"]);
                }
              },
              (err) => {
                console.error(err);
                this.snackbar.open(
                  `${err.error.message ?? "Error al actualizar un favorito."}`,
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
