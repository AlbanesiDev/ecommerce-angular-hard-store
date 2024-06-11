import { AsyncPipe, CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, OnInit, signal, inject, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";

import { ProgressSpinnerModule } from "primeng/progressspinner";
import { PaginatorModule, PaginatorState } from "primeng/paginator";

import { CategoryProductsComponent } from "../components/category-products/category-products.component";
import { SortProductsComponent } from "../components/sort-products/sort-products.component";

import { CardGridComponent, CardListComponent } from "../../../shared";
import { Product } from "../../../core/interfaces/product.interface";
import { ShopState, SortOrder, ViewMode } from "../interfaces/shop.interfaces";

import { selectProducts, selectSortOrder, selectViewMode } from "../store/shop.selectors";
import { selectSearchProducts } from "../../searchbar/store/search.selectors";
import * as ShopActions from "../store/shop.actions";
import * as SearchActions from "../../searchbar/store/search.actions";
import { ActivatedRoute, Router } from "@angular/router";
import { map, switchMap } from "rxjs";
import { SearchState } from "../../searchbar/interfaces/search.interface";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    ProgressSpinnerModule,
    PaginatorModule,
    CategoryProductsComponent,
    SortProductsComponent,
    CardGridComponent,
    CardListComponent,
  ],
  template: `
    <div class="flex flex-column md:flex-row gap-3 justify-content-center align-items-start">
      <div class="w-12 md:w-3">
        <app-category-products />
      </div>
      <div class="flex flex-column gap-3 w-12 md:w-9">
        <app-sort-products />
        <div class="grid">
          @for (item of products(); track $index) {
            @if (viewSig() === "grid") {
              <div class="col-6 md:col-4 lg:col-3">
                <app-card-grid [data]="item" [loading]="false" />
              </div>
            } @else {
              <div class="col-12">
                <app-card-list [data]="item" [loading]="false" />
              </div>
            }
          }
        </div>
        @defer {
          <p-paginator
            styleClass="bg-black border-1 surface-border"
            [rows]="itemsPerPage"
            [first]="pFirst"
            [totalRecords]="pTotal"
            (onPageChange)="onPageChange($event)"
          />
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ShopComponent implements OnInit {
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _destroyRef = inject(DestroyRef);
  public allProducts = signal<Product[]>([]);
  public products = signal<Product[]>([]);
  public viewSig = signal<ViewMode>("grid");
  public sortOrderSig = signal<SortOrder>("top");
  public itemsPerPage: number = 20;
  public currentPage!: number;
  public pTotal: number = 0;
  public pFirst: number = 0;

  constructor(private store: Store<{ shop: ShopState; search: SearchState }>) {
    this._activatedRoute.paramMap
      .pipe(
        takeUntilDestroyed(),
        map((params) => Number(params.get("numberPage"))),
      )
      .subscribe((page) => {
        this.currentPage = page || 1;
        this.pFirst = (this.currentPage - 1) * this.itemsPerPage;
      });
    this.store
      .select(selectViewMode)
      .pipe(takeUntilDestroyed())
      .subscribe((view) => this.viewSig.set(view));
  }

  ngOnInit(): void {
    this._activatedRoute.url.subscribe((url) => {
      const path = url[0]?.path;
      const maxPage = Math.round(this.pTotal / this.itemsPerPage);
      if (this.currentPage < 1 || this.currentPage > maxPage) {
        if (path === "tienda") {
          this._router.navigateByUrl("/tienda/pagina/1");
        } else if (path === "busqueda" && this._activatedRoute.snapshot.paramMap.get("queryInput")) {
          this._router.navigateByUrl(`/busqueda/pagina/1/${this._activatedRoute.snapshot.paramMap.get("queryInput")}`);
        } else {
          this._router.navigateByUrl("/busqueda/pagina/1");
        }
      }
    });
    this.dispatchProducts();

    this.store
      .select(selectSortOrder)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((order) => {
        this.sortOrderSig.set(order);
        this.sortAndPaginateProducts();
      });
  }

  public dispatchProducts() {
    this._activatedRoute.paramMap
      .pipe(
        map((params) => params.get("queryInput")),
        switchMap((query) => {
          console.log(query);
          if (query) {
            console.log(query);
            this.store.dispatch(SearchActions.searchProducts({ query: query }));
            return this.store.select(selectSearchProducts);
          } else {
            this.store.dispatch(ShopActions.loadProducts());
            return this.store.select(selectProducts);
          }
        }),
      )
      .subscribe((products: Product[]) => {
        this.pTotal = products.length;
        this.allProducts.set(products);
        this.sortAndPaginateProducts();
      });
  }

  private sortAndPaginateProducts() {
    const order = this.sortOrderSig();
    const sortedProducts = [...this.allProducts()];

    if (order === "min") {
      sortedProducts.sort((a, b) => a.price_special - b.price_special);
    } else if (order === "max") {
      sortedProducts.sort((a, b) => b.price_special - a.price_special);
    }
    this.paginateProducts(sortedProducts);
  }

  private paginateProducts(products: Product[]) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    this.products.set(paginatedProducts);
  }

  public onPageChange(event: PaginatorState): void {
    const pageIndex = event.page;
    if (pageIndex != null && event.first != null) {
      this.currentPage = pageIndex + 1;
      this.pFirst = event.first;
      this._router.navigate(["/tienda/pagina", this.currentPage]);
      this.sortAndPaginateProducts();
    }
  }
}
