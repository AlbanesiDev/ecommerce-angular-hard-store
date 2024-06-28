import { AsyncPipe, CommonModule, CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { SkeletonModule } from "primeng/skeleton";
import { Product } from "../../../core/interfaces/product.interface";
import { ImgProductComponent } from "../img-product/img-product.component";

@Component({
  selector: "app-card-grid",
  standalone: true,
  imports: [CommonModule, CurrencyPipe, AsyncPipe, ButtonModule, SkeletonModule, ImgProductComponent],
  template: `
    <div class="flex flex-column justify-content-between gap-3 card min-h-full w-full px-3 py-4">
      @if (loading()) {
        <p-skeleton styleClass="w-full h-10rem" />
        <p-skeleton styleClass="w-9" />
        <p-skeleton styleClass="w-4" />
        <p-skeleton styleClass="w-full" />
        <p-button styleClass="w-full h-2rem mt-2 p-2 border-round-sm" severity="warning" [disabled]="true" />
      } @else {
        <div class="h-full">
          <app-img-product [loading]="loadingImg()" [data]="data()" [padding]="3" />
          <h3 class="text-base">{{ data().title }}</h3>
        </div>
        <div class="flex flex-column gap-4">
          <span class="text-lg font-medium text-blue-400 ml-2">
            {{ data().price_special | currency: "ARS" : "symbol" : "1.2-2" : "" }}
          </span>
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
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardGridComponent {
  private readonly _router = inject(Router);
  public data = input.required<Product>();
  public loading = input.required<boolean>();
  public loadingImg = input<"eager" | "lazy">("eager");
  public imgHover: boolean = false;

  public navigateToProduct(url: string): void {
    this._router.navigateByUrl(`/producto/${url}`);
  }
}
