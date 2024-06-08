/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncPipe, CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";

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
@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, AsyncPipe, CarouselModule, SkeletonModule, ProgressSpinnerModule, CardGridComponent],
  template: `
    <div class="flex flex-column justify-content-center gap-4">
      @defer (on immediate) {
        <p-carousel
          styleClass="w-full"
          ngSkipHydration
          [value]="bannersSig()"
          [numVisible]="1"
          [numScroll]="1"
          [circular]="true"
          [draggable]="true"
          [autoplayInterval]="4000"
        >
          <ng-template let-slide pTemplate="item">
            <div class="h-full mx-2 px-3 py-4 border-1 bg-black surface-border border-round">
              <img class="w-full min-h-full border-round" [src]="slide.src" [alt]="slide.alt" />
            </div>
          </ng-template>
        </p-carousel>
        @for (item of cardsSig(); track $index) {
          <h2 class="capitalize text-xl">{{ item.title }}</h2>
          <p-carousel
            ngSkipHydration
            [value]="item.products"
            [numScroll]="1"
            [numVisible]="4"
            [circular]="true"
            [draggable]="true"
            [autoplayInterval]="item.interval"
            [responsiveOptions]="responsiveOptions"
          >
            <ng-template let-product pTemplate="item">
              <div class="h-full mx-2">
                <app-card-grid [data]="product" [loading]="loadingProducts()" />
              </div>
            </ng-template>
          </p-carousel>
        }
      } @placeholder {
        <div class="flex justify-content-center align-items-center min-h-calc">
          <p-progressSpinner ariaLabel="loading" fill="var(--bg-orange-500)" />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent implements OnInit {
  public bannersSig = signal<HomeBanners[]>([]);
  public cardsSig = signal<HomeProducts[]>([]);

  public loadingBanners = signal<boolean>(false);
  public loadingProducts = signal<boolean>(false);

  public bannerErrorMessage = signal<unknown>(undefined);
  public productsErrorMessage = signal<unknown>(undefined);

  public responsiveOptions: Array<CarouselResponsiveOptions> = [
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
  ];

  constructor(private store: Store<{ home: HomeState }>) {
    this.subscribeToStore(selectBanners, this.bannersSig);
    this.subscribeToStore(selectProducts, this.cardsSig);
    this.subscribeToStore(selectBannersLoading, this.loadingBanners);
    this.subscribeToStore(selectProductsLoading, this.loadingProducts);
    this.subscribeToStore(selectBannersFailure, this.bannerErrorMessage);
    this.subscribeToStore(selectProductsFailure, this.productsErrorMessage);
  }

  ngOnInit(): void {
    this.store.dispatch(HomeActions.loadBanners());
    this.store.dispatch(HomeActions.loadProducts());
  }

  /**
   * Subscribes to the provided selector and sets the value to the corresponding signal.
   * @param selector - The selector to subscribe to.
   * @param signal - The signal to set the value to.
   */
  private subscribeToStore<T>(selector: any, signal: any): void {
    this.store
      .select(selector)
      .pipe(takeUntilDestroyed())
      .subscribe((res: T) => {
        signal.set(res);
      });
  }
}
