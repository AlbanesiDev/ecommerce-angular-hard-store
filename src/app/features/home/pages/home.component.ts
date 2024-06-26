/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncPipe, CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, OnInit, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { combineLatest } from "rxjs";

import { CarouselModule, CarouselResponsiveOptions } from "primeng/carousel";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SkeletonModule } from "primeng/skeleton";

import { HomeBanners, HomeProducts, HomeState } from "../interfaces/home.interface";
import { CardGridComponent } from "../../../shared";
import {
  selectBanners,
  selectBannersFailure,
  selectBannersLoading,
  selectProducts,
  selectProductsFailure,
  selectProductsLoading,
} from "../store/home.selectors";
import * as HomeActions from "../store/home.actions";
import * as HomeSelectors from "../store/home.selectors";
@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, AsyncPipe, ProgressSpinnerModule, CarouselModule, SkeletonModule, CardGridComponent],
  template: `
    <div class="flex flex-column justify-content-center gap-4">
      <p-carousel
        styleClass="w-full min-h-full"
        ngSkipHydration
        [value]="bannersSig()"
        [numVisible]="1"
        [numScroll]="1"
        [circular]="true"
        [draggable]="true"
        [showNavigators]="showNavigators()"
        [autoplayInterval]="4000"
      >
        <ng-template let-slide pTemplate="item">
          <div class="h-full mx-2  card">
            @if (loadingBanners()) {
              <p-skeleton styleClass="w-full h-17rem" />
            } @else if (bannerError()) {
              <h3 class="text-center text-red-500">{{ bannerError() }}</h3>
            } @else {
              <img
                class="w-full min-h-full border-round-xs px-2 py-2"
                [src]="slide.src"
                [srcset]="slide.srcset"
                [alt]="slide.alt"
              />
            }
          </div>
        </ng-template>
      </p-carousel>
      @if (productsError()) {
        <h3 class="text-center text-red-500">{{ productsError() }}</h3>
      } @else {
        @for (item of productsSig(); track item.id; let i = $index) {
          <h1 class="capitalize text-xl">{{ item.title }}</h1>
          <p-carousel
            ngSkipHydration
            [value]="item.products"
            [numScroll]="1"
            [circular]="true"
            [draggable]="true"
            [showNavigators]="showNavigators()"
            [autoplayInterval]="item.interval"
            [responsiveOptions]="responsiveOptions"
          >
            <ng-template let-product pTemplate="item">
              <div class="h-full mx-2">
                <app-card-grid [data]="product" [loading]="loadingProducts()" [loadingImg]="i < 5 ? 'eager' : 'lazy'" />
              </div>
            </ng-template>
          </p-carousel>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _store = inject(Store<HomeState>);

  public bannersSig = signal<HomeBanners[] | any[]>([]);
  public productsSig = signal<HomeProducts[] | any[]>([]);

  public loadingBanners = signal<boolean>(false);
  public loadingProducts = signal<boolean>(false);

  public bannerError = signal<unknown>(undefined);
  public productsError = signal<unknown>(undefined);

  public showNavigators = signal<boolean>(true);

  public readonly responsiveOptions: Array<CarouselResponsiveOptions> = [
    {
      breakpoint: "2560px",
      numVisible: 5,
      numScroll: 1,
    },
    {
      breakpoint: "1024px",
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: "768px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "425px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "368px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  constructor() {
    this.updateResponsive();
    this.subscribeToSelector(selectBanners, this.bannersSig);
    this.subscribeToSelector(selectProducts, this.productsSig);
    this.subscribeToSelector(selectBannersLoading, this.loadingBanners);
    this.subscribeToSelector(selectProductsLoading, this.loadingProducts);
    this.subscribeToSelector(selectBannersFailure, this.bannerError);
    this.subscribeToSelector(selectProductsFailure, this.productsError);
  }

  ngOnInit(): void {
    combineLatest([this._store.select(HomeSelectors.selectBanners), this._store.select(HomeSelectors.selectProducts)])
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(([banners, products]) => {
        if (!banners || banners.length === 0) {
          this._store.dispatch(HomeActions.loadBanners());
        }
        if (!products || products.length === 0) {
          this._store.dispatch(HomeActions.loadProducts());
        }
      });
    if (this.loadingBanners()) {
      this.bannersSig.set([{ src: "", alt: "" }]);
    }
    if (this.loadingProducts()) {
      this.productsSig.set([
        { id: 0, title: "productos destacados", products: [{}, {}, {}, {}, {}], interval: 4000 },
        { id: 1, title: "ultimos ingresados", products: [{}, {}, {}, {}, {}], interval: 4000 },
      ]);
    }
  }

  @HostListener("window:resize", ["$event"])
  private updateResponsive() {
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      this.showNavigators.set(true);
    } else {
      this.showNavigators.set(false);
    }
  }

  /**
   * Subscribes to the provided selector and sets the value to the corresponding signal.
   * @param selector - The selector to subscribe to.
   * @param signal - The signal to set the value to.
   */
  private subscribeToSelector<T>(selector: any, signal: any): void {
    this._store
      .select(selector)
      .pipe(takeUntilDestroyed())
      .subscribe((res: T) => {
        signal.set(res);
      });
  }
}
