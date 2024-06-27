import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { RadioButtonModule } from "primeng/radiobutton";
import { DividerModule } from "primeng/divider";
import { ButtonModule } from "primeng/button";

import { Product } from "../../../../core";
import { PricePipe } from "../../../../shared";

@Component({
  selector: "app-cart-ticket",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonModule, DividerModule, RadioButtonModule, PricePipe],
  template: `
    <div class="flex flex-column card px-2 md:px-4 py-4 md:py-4 w-full h-full">
      <div class="px-2">
        @for (item of data(); track item.id_cart) {
          <div class="flex">
            <div class="w-7">
              <p class="text-base text-overflow-ellipsis overflow-hidden">{{ item.title }}</p>
            </div>
            <div class="w-5 ">
              <p class="font-semibold text-base text-right text-blue-400">
                {{ item.price_special | priceView: item.price_list : price | currency: "ARS" : "symbol" }}
              </p>
            </div>
          </div>
        }
        <p-divider />
        <p class="text-base text-right">Subtotal: {{ calcSubtotal() | currency: "ARS" : "symbol" }}</p>
        <p class="text-base text-right text-green-400">Envío: {{ shipping | currency: "ARS" : "symbol" }}</p>
        <p class="text-xl text-right font-bold">
          Total: {{ calcTotal(calcSubtotal(), shipping) | currency: "ARS" : "symbol" }}
        </p>
      </div>
      <p-divider />
      <div class="px-2">
        <div class="flex justify-content-around">
          <div>
            <p-radioButton name="priceSpecial" value="priceSpecial" [(ngModel)]="price" inputId="priceSpecial" />
            <label for="priceSpecial" class="ml-2"> Precio especial </label>
          </div>
          <div>
            <p-radioButton name="priceList" value="priceList" [(ngModel)]="price" inputId="priceList" />
            <label for="priceList" class="ml-2"> Precio de lista </label>
          </div>
        </div>
        <p class="mb-0">
          {{
            price === "priceSpecial"
              ? "Pagando por depósito o transferencia bancaria."
              : "Pagando con tarjeta de crédito o debito, hasta 12 cuotas sin interés."
          }}
        </p>
      </div>

      <p-divider />
      <p-button styleClass="w-full" label="Proceder al pago" routerLink="/checkout" [disabled]="!data().length" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartTicketComponent {
  public data = input.required<Product[]>();
  public price: "priceSpecial" | "priceList" = "priceSpecial";
  public shipping: number = 7999;

  public calcSubtotal(): number {
    if (this.price === "priceList") {
      return this.data().reduce((acc, item) => acc + item.price_list, 0);
    }
    return this.data().reduce((acc, item) => acc + item.price_special, 0);
  }

  public calcTotal(subtotal: number, shipping: number): number {
    return subtotal + shipping;
  }
}
