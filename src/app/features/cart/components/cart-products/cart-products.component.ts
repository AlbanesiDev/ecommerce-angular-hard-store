import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";

import { ImgProductComponent } from "../../../../shared";
import { Product } from "../../../../core";

@Component({
  selector: "app-cart-products",
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, DividerModule, ImgProductComponent],
  template: `
    <div class="flex flex-column card px-2 md:px-4 py-4 md:py-4 w-full">
      <div class="flex justify-content-between align-items-center">
        <h1 class="font-semibold text-xl">Carrito de compras</h1>
        @if (data().length) {
          <p-button
            size="small"
            icon="pi pi-trash"
            label="Vaciar carrito"
            severity="danger"
            text="true"
            (onClick)="clearCart()"
          />
        }
      </div>
      <p-divider />
      <div>
        @for (item of data(); track item.id_cart) {
          <div class="grid px-2">
            <div class="col-3 md:col-2">
              <app-img-product loading="lazy" [data]="item" [padding]="3" />
            </div>
            <div class="col-7 md:col-8">
              <p class="mt-0">{{ item.title }}</p>
              <span class="font-semibold text-blue-400">{{ item.price_special | currency: "ARS" : "symbol" }}</span>
            </div>
            <div class="flex flex-column col-2">
              <p-button
                size="small"
                icon="pi pi-trash"
                class="align-self-end"
                severity="danger"
                [text]="true"
                (onClick)="removeProduct(item)"
              />
            </div>
          </div>
          <p-divider />
        } @empty {
          <div class="flex flex-column justify-content-center gap-3 py-4 h-30rem">
            <div class="flex flex-column justify-content-center align-items-center gap-5">
              <i class="pi pi-shopping-cart text-8xl text-color-secondary"></i>
              <p class="font-bold text-xl m-0 text-color-secondary">El carrito se encuentra vacío</p>
            </div>
            <div class="flex justify-content-center">
              <div class="w-3">
                <p-button
                  styleClass="w-full"
                  severity="warning"
                  rounded="true"
                  label="Volver a la tienda"
                  routerLink="/tienda/pagina/1"
                />
              </div>
            </div>
          </div>

          <p-divider />
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartProductsComponent {
  public data = input.required<Product[]>();
  public removeProductOut = output<Product>();
  public clearCartOut = output();

  public removeProduct(product: Product): void {
    this.removeProductOut.emit(product);
  }

  public clearCart(): void {
    this.clearCartOut.emit();
  }
}
