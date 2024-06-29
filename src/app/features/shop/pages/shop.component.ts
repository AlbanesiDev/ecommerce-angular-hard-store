/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncPipe, CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, OnInit, signal, inject, DestroyRef } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { map, switchMap } from "rxjs";
import { Store } from "@ngrx/store";

import { PaginatorModule, PaginatorState } from "primeng/paginator";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ButtonModule } from "primeng/button";

import { CategoryProductsComponent } from "../components/category-products/category-products.component";
import { SortProductsComponent } from "../components/sort-products/sort-products.component";

import { CardGridComponent, CardListComponent, ScrollTopComponent } from "../../../shared";

import { selectLoading, selectProducts, selectSortOrder, selectViewMode } from "../store/shop.selectors";
import { selectSearchProducts } from "../../searchbar/store/search.selectors";
import * as SearchActions from "../../searchbar/store/search.actions";
import * as ShopActions from "../store/shop.actions";

import { ShopState, SortOrder, ViewMode } from "../interfaces/shop.interfaces";
import { SearchState } from "../../searchbar/interfaces/search.interface";
import { Product } from "../../../core/interfaces/product.interface";
import { FilterService } from "../services/filter.service";
import { SortService } from "../services/sort.service";

/**
 *
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AsyncPipe,
    ProgressSpinnerModule,
    PaginatorModule,
    ButtonModule,
    CategoryProductsComponent,
    SortProductsComponent,
    CardGridComponent,
    CardListComponent,
    ScrollTopComponent,
    ProgressSpinnerModule,
  ],
  template: `
    <div class="flex flex-column md:flex-row gap-3 justify-content-center align-items-start">
      <div class="w-12 md:w-3">
        <app-category-products (onCategoryChange)="onCategoryChange($event)" />
      </div>
      <div class="flex flex-column gap-3 w-12 md:w-9">
        @if (products().length > 0) {
          <app-sort-products />
        }
        <div class="grid">
          @for (item of products(); track item.id_product; let i = $index) {
            @if (viewSig() === "grid") {
              <div class="col-6 md:col-4 lg:col-3">
                <app-card-grid [data]="item" [loading]="loadingProducts()" [loadingImg]="i < 8 ? 'eager' : 'lazy'" />
              </div>
            } @else {
              <div class="col-12">
                <app-card-list [data]="item" [loading]="loadingProducts()" [loadingImg]="i < 4 ? 'eager' : 'lazy'" />
              </div>
            }
          } @empty {
            <div class="flex flex-column justify-content-center align-items-center w-12 h-30rem">
              <h1>{{ emptyMessage[emptyMessageState()] }}</h1>
              <p-button label="Volver a la tienda" routerLink="/tienda/pagina/1" />
              <!-- <p-progressSpinner ariaLabel="Cargando..." /> -->
            </div>
          }
        </div>
        @defer {
          <p-paginator
            styleClass="card"
            [rows]="itemsPerPage"
            [first]="pFirst"
            [totalRecords]="pTotal"
            (onPageChange)="onPageChange($event)"
          />
        }
      </div>
    </div>
    <app-scroll-top />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ShopComponent implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _filterService = inject(FilterService);
  private readonly _sortService = inject(SortService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _store = inject(Store<{ shop: ShopState; search: SearchState }>);

  public currentUrl = signal<string | undefined>(undefined); // Contains the current URL

  public loadingProducts = signal<boolean>(false);
  public allProducts = signal<Product[]>([]); // Contains all fetched products
  public products = signal<Product[]>([]); // Contains the products to be displayed based on the page

  public viewSig = signal<ViewMode>("grid"); // Contains the view type

  public currentCategory = signal<number | undefined>(undefined);
  public currentSubCategory = signal<number | undefined>(undefined);
  public currentBrand = signal<number | undefined>(undefined);

  public emptyMessageState = signal<"shop" | "shopCategory" | "shopSubcategory" | "shopBrand" | "search">("shop");
  public readonly emptyMessage = {
    shop: "No hay ningun producto",
    shopCategory: "No hay productos en esta categoría",
    shopSubcategory: "No hay productos en esta subcategoría",
    shopBrand: "No hay productos de esta marca",
    search: "No se encontraron resultados",
  };

  public readonly itemsPerPage: number = 20; // Maximum number of products per page
  public currentPage!: number; // Current page number
  public pTotal: number = 0; // Total number of fetched products
  public pFirst: number = 0; // Index of the first product on the current page

  ngOnInit(): void {
    this.initializeLoadingProducts();
    this.initializeCurrentPage();
    this.initializeViewMode();
    this.validateAndFetchProducts();
  }

  private initializeLoadingProducts(): void {
    this._store
      .select(selectLoading)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((loading) => {
        this.loadingProducts.set(loading);
      });
  }

  /**
   * Initializes the current page based on route parameters.
   */
  private initializeCurrentPage() {
    this._activatedRoute.paramMap
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        map((params) => Number(params.get("numberPage"))),
      )
      .subscribe((page) => {
        this.currentPage = page || 1;
        this.pFirst = (this.currentPage - 1) * this.itemsPerPage;
      });
  }

  /**
   * Initializes the view mode from the store.
   */
  private initializeViewMode() {
    this._store
      .select(selectViewMode)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((view) => this.viewSig.set(view));
  }

  /**
   * Validates the URL and fetches products based on it.
   */
  private validateAndFetchProducts() {
    const firstSegment = this._activatedRoute.root.firstChild?.snapshot.url[0]?.path;
    this.currentUrl.set(firstSegment);
    this.dispatchProductsBasedOnUrl();
  }

  /**
   * Dispatches actions to fetch products based on the current URL.
   */
  private dispatchProductsBasedOnUrl() {
    this._activatedRoute.paramMap
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        map((params) => params.get("queryInput")),
        switchMap((query) => {
          if (query) {
            const queryInput = query.replace(/_/g, " ").toLowerCase();
            this._store.dispatch(SearchActions.searchProducts({ query: queryInput }));
            return this._store.select(selectSearchProducts);
          } else {
            this._store.dispatch(
              ShopActions.loadProducts({ pageSize: this.itemsPerPage, numberPage: this.pFirst + 1 }),
            );
            return this._store.select(selectProducts);
          }
        }),
      )
      .subscribe((products: Product[]) => {
        this.allProducts.set(products);
        this.pTotal = products.length;
        this.initializeSortOrder();
      });
  }

  public onCategoryChange(queryParams: { cat: number; subcat?: number; brand?: number }) {
    this.currentCategory.set(queryParams.cat);
    this.currentSubCategory.set(queryParams.subcat);
    this.currentBrand.set(queryParams.brand);

    this.currentPage = 1;

    let routePath = "/tienda/pagina";
    let queryParamsObj: any = {
      cat: queryParams.cat,
      subcat: queryParams.subcat,
      brand: queryParams.brand,
    };

    if (this.currentUrl() === "busqueda") {
      routePath = "/busqueda/pagina";
      const queryInput = this._activatedRoute.snapshot.paramMap.get("queryInput");
      if (queryInput) {
        queryParamsObj = { ...queryParamsObj, queryInput };
      }
    }

    this._router.navigate([routePath, this.currentPage], { queryParams: queryParamsObj });
    this.filterAndSortProducts();
  }

  /**
   * Initializes the sort order from the store.
   */
  private initializeSortOrder() {
    this._store.select(selectSortOrder).subscribe((order) => {
      this.onSortOrderChange(order);
    });
  }

  onSortOrderChange(order: SortOrder) {
    this.filterAndSortProducts(order);
  }

  /**
   * Filters and sorts products based on the current filters and sort order.
   */
  private filterAndSortProducts(sortOrder?: SortOrder) {
    let products = this.allProducts();

    if (this.currentCategory()) {
      products = this._filterService.showCategory(this.currentCategory()!, products);
    }
    if (this.currentSubCategory()) {
      products = this._filterService.showSubcategory(this.currentSubCategory()!, products);
    }
    if (this.currentBrand()) {
      products = this._filterService.showBrand(this.currentBrand()!, products);
    }

    switch (sortOrder) {
      case "priceAsc":
        products = this._sortService.sortPriceAsc(products);
        break;
      case "priceDesc":
        products = this._sortService.sortPriceDesc(products);
        break;
      case "alphaAsc":
        products = this._sortService.sortNameAsc(products);
        break;
      case "alphaDesc":
        products = this._sortService.sortNameDesc(products);
        break;
    }

    this.pTotal = products.length;
    this.paginateProducts(products, this.itemsPerPage, this.currentPage);
  }

  /**
   * Handles page change events.
   * @param event The paginator event
   */
  public onPageChange(event: PaginatorState): void {
    const pageIndex = event.page;

    if (pageIndex != null && event.first != null) {
      this.currentPage = pageIndex + 1;
      this.pFirst = event.first;

      const queryParams: any = {};
      if (this.currentCategory()) {
        queryParams.cat = this.currentCategory();
      }
      if (this.currentSubCategory()) {
        queryParams.subcat = this.currentSubCategory();
      }
      if (this.currentBrand()) {
        queryParams.brand = this.currentBrand();
      }

      if (this.currentUrl() === "tienda") {
        this._router.navigate(["/tienda/pagina", this.currentPage], { queryParams: queryParams });
      } else if (this.currentUrl() === "busqueda") {
        const queryInput = this._activatedRoute.snapshot.paramMap.get("queryInput");
        this._router.navigate(["/busqueda/pagina", this.currentPage, queryInput], { queryParams: queryParams });
      } else {
        this._router.navigate(["/tienda/pagina/1"], { queryParams: queryParams });
      }
      this.filterAndSortProducts();
    }
  }

  private paginateProducts(products: Product[], itemsPerPage: number, currentPage: number): void {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    this.products.set(paginatedProducts);
  }
}
