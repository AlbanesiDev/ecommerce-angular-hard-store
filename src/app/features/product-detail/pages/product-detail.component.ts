import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";

import { GalleriaModule } from "primeng/galleria";
import { SkeletonModule } from "primeng/skeleton";
import { DividerModule } from "primeng/divider";
import { TooltipModule } from "primeng/tooltip";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";

/**
 * uuid used for creating unique ids
 */
import { v4 as uuidv4 } from "uuid";

import { SpecificationsComponent } from "../components/specifications/specifications.component";
import { NotFoundComponent } from "../components/not-found/not-found.component";
import { ProductService } from "../services/product.service";
import { Product, ProductErrorService } from "../../../core";
import { addProduct, CartState } from "../../cart";
import { ImagePathPipe } from "../../../shared";

@Component({
  selector: "app-product-details",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SkeletonModule,
    GalleriaModule,
    DividerModule,
    TooltipModule,
    ButtonModule,
    ToastModule,
    ImagePathPipe,
    NotFoundComponent,
    SpecificationsComponent,
  ],
  templateUrl: "./product-detail.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductDetailComponent {
  private readonly _productErrorService = inject(ProductErrorService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productService = inject(ProductService);
  private readonly _messageService = inject(MessageService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _store = inject(Store<{ cart: CartState }>);

  public error = signal<unknown | undefined>(undefined); // TODO: Handle error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public data = signal<any>({});

  public notFound = computed<boolean>(() => {
    return this._productErrorService.productNotFoundSig();
  });

  public priceInstallment = computed<number>(() => {
    return +(this.data().price_list / 12).toFixed();
  });

  constructor() {
    this._activatedRoute.params.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.getProduct(params["titleInput"]);
    });
  }

  /**
   * Fetches product details from the service.
   * @param url URL of the product.
   */
  public getProduct(url: string) {
    this._productService
      .getProduct(url)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.data.set(res);
        },
        error: (error) => {
          this.error.set(error);
        },
      });
  }

  /**
   * Copies the provided label to clipboard.
   * @param label Label to copy.
   */
  public copyClipboard(label: string): void {
    navigator.clipboard.writeText(label).then(() => {
      this._messageService.add({
        severity: "contrast",
        detail: `Se ha copiado ${label} al portapapeles`,
      });
    });
  }

  /**
   * Adds the product to the cart.
   * @param product Product to add to the cart.
   */
  public addToCart(product: Product): void {
    const productWithIdCart = { ...product, id_cart: uuidv4() };
    this._store.dispatch(addProduct({ product: productWithIdCart }));
    this._messageService.add({
      severity: "success",
      summary: "Producto",
      detail: "Añadido al carrito correctamente",
    });
  }
}
