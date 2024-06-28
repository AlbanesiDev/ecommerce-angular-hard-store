import { AsyncPipe, CommonModule, CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { Router } from "@angular/router";

import { ButtonModule } from "primeng/button";
import { SkeletonModule } from "primeng/skeleton";

import { Product } from "../../../core/interfaces/product.interface";
import { ImgProductComponent } from "../img-product/img-product.component";

@Component({
  selector: "app-card-list",
  standalone: true,
  imports: [CommonModule, AsyncPipe, CurrencyPipe, ButtonModule, SkeletonModule, ImgProductComponent],
  template: ` <div class="flex gap-3 card min-h-full px-3 py-4">
    @if (loading()) {
      <div class="w-3">
        <p-skeleton styleClass="w-full h-10rem" />
      </div>
      <div class="flex flex-column justify-content-between w-9">
        <p-skeleton styleClass="w-9" />
        <p-skeleton styleClass="w-4" />
        <div>
          <p-skeleton styleClass="w-full" />
          <p-button styleClass="w-full h-2rem mt-2 p-2 border-round-sm" severity="warning" [disabled]="true" />
        </div>
      </div>
    } @else {
      <div class="w-3">
        <div class=" bg-white border-round  overflow-hidden cursor-pointer">
          <app-img-product loading="lazy" [data]="data()" [padding]="3" />
        </div>
      </div>
      <div class="flex flex-column justify-content-between w-9">
        @if (data().title) {
          <h3 class="text-lg m-0">{{ data().title }}</h3>
        }
        <div class="flex flex-column gap-4 w-full">
          @if (data().price_special) {
            <span class="text-lg font-medium text-blue-400 ml-2">
              {{ data().price_special | currency: "ARS" : "symbol" : "1.2-2" : "" }}
            </span>
          }
          <p-button
            styleClass="w-full p-2 border-round-sm"
            severity="warning"
            [disabled]="data().stock <= 0"
            (onClick)="navigateToProduct(data().url_search)"
          >
            <span class="text-base font-bold text-center w-full">
              {{ data().stock <= 0 ? "Agotado" : "Comprar" }}
            </span>
          </p-button>
        </div>
      </div>
    }
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListComponent {
  private readonly _router = inject(Router);
  public data = input.required<Product>();
  public loading = input.required<boolean>();
  public loadingImg = input<"lazy" | "eager">("eager");
  public imgHover: boolean = false;

  public navigateToProduct(url: string): void {
    this._router.navigateByUrl(`/producto/${url}`);
  }
}
