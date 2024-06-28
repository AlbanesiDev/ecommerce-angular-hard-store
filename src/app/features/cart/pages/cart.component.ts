import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, effect, inject, signal } from "@angular/core";
import { Product } from "../../../core/interfaces/product.interface";
import { RouterModule } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { Store } from "@ngrx/store";
import { CartState } from "../store/cart.reducer";
import { clearCart, removeProduct } from "../store/cart.actions";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { selectProducts } from "../store/cart.selectors";
import { CartProductsComponent } from "../components/cart-products/cart-products.component";
import { CartTicketComponent } from "../components/cart-ticket/cart-ticket.component";
import { ProgressSpinnerModule } from "primeng/progressspinner";

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ProgressSpinnerModule, CartProductsComponent, CartTicketComponent],
  template: `
    <div class="flex flex-column lg:flex-row gap-3">
      @defer {
        <div [ngClass]="cartSig().length ? 'w-12 lg:w-8' : 'w-12'">
          <app-cart-products
            [data]="cartSig()"
            (clearCartOut)="clearCart()"
            (removeProductOut)="removeProduct($event)"
          />
        </div>
        @if (cartSig().length) {
          <div class="w-12 lg:w-4">
            <app-cart-ticket [data]="cartSig()" />
          </div>
        }
      } @placeholder {
        <div class="flex justify-content-center align-items-center w-full min-h-calc">
          <p-progressSpinner ariaLabel="loading" />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CartComponent {
  private readonly _store = inject(Store<{ cart: CartState }>);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _messageService = inject(MessageService);
  public cartSig = signal<Product[]>([]);

  constructor() {
    this._store
      .select(selectProducts)
      .pipe(takeUntilDestroyed())
      .subscribe((products) => {
        this.cartSig.set(products);
      });
    effect(
      () => {
        const products = this.cartSig();
        this._store.dispatch({ type: "[Cart] Update Products", products });
      },
      { allowSignalWrites: true },
    );
  }

  public removeProduct(product: Product): void {
    this._store.dispatch(removeProduct({ idCart: product.id_cart! }));
  }

  public clearCart(): void {
    this._confirmationService.confirm({
      message: "¿Estás seguro de vaciar el carrito?",
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      acceptLabel: "Si",
      rejectLabel: "No",
      rejectButtonStyleClass: "p-button-secondary",
      accept: () => {
        this._store.dispatch(clearCart());
        this._messageService.add({
          severity: "success",
          summary: "Carrito",
          detail: "Carrito vaciado correctamente",
        });
      },
    });
  }
}
