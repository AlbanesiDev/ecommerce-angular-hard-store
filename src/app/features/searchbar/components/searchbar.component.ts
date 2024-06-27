import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AutoCompleteModule } from "primeng/autocomplete";
import { InputTextModule } from "primeng/inputtext";

@Component({
  selector: "app-searchbar",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutoCompleteModule, InputTextModule],
  template: `
    <span class="p-input-icon-right w-full">
      <i class="pi pi-search"></i>
      <input
        pInputText
        id="searchbar"
        name="searchbar"
        type="text"
        class="bg-black w-full"
        placeholder="Buscar..."
        [formControl]="searchControl"
        (keydown.enter)="onSearch()"
      />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchbarComponent {
  private readonly _router = inject(Router);
  public searchControl = new FormControl("", Validators.minLength(3));

  public onSearch(): void {
    const query = this.searchControl.value;
    if (query) {
      this._router.navigate(["/busqueda/pagina/1/", this.regexUrl(query)]);
    }
  }

  private regexUrl(url: string): string {
    const regex = /[^\w\s]|_+(?=\s|$)|-(?=\s|$)/g;
    const query = url.replace(regex, " ").trim().replace(/\s+/g, "_").toLowerCase();
    return query;
  }
}
