import { AsyncPipe, CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { CardGridComponent } from "../../../shared";
import { HomeService } from "../services/home.service";
import { SkeletonModule } from "primeng/skeleton";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CarouselModule, CarouselResponsiveOptions } from "primeng/carousel";
import { HomeBanners, HomeProducts } from "../interfaces/home.interface";
import { LoaderService } from "../../../core/services/loader.service";
import { ProgressSpinnerModule } from "primeng/progressspinner";

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
                <app-card-grid [data]="product" />
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
  public _loaderService = inject(LoaderService);
  private _homeService = inject(HomeService);
  private _destroyRef = inject(DestroyRef);

  public bannersSig = signal<HomeBanners[]>([]);
  public cardsSig = signal<HomeProducts[]>([]);
  public bannerErrorMessage = signal<string | undefined>(undefined);
  public cardErrorMessage = signal<string | undefined>(undefined);

  public isBannersLoading$ = this._loaderService.getLoader("banners");
  public isProductsLoading$ = this._loaderService.getLoader("products");

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

  ngOnInit(): void {
    this._homeService
      .getBanners()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.bannersSig.set(res);
        },
        error: (err) => {
          this.bannerErrorMessage.set(err);
        },
      });

    this._homeService
      .getProducts()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.cardsSig.set(res);
        },
        error: (err) => {
          this.bannerErrorMessage.set(err);
        },
      });
  }
}
