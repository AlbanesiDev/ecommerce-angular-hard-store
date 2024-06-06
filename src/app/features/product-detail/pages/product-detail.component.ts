/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from "@angular/core";
import { ProductService } from "../services/product.service";
import { ButtonModule } from "primeng/button";
import { SkeletonModule } from "primeng/skeleton";
import { LoaderService } from "../../../core/services/loader.service";
import { GalleriaModule } from "primeng/galleria";
import { ImgPathService } from "../../../core/services/img-path.service";
import { ImageModule } from "primeng/image";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { DividerModule } from "primeng/divider";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-product-details",
  standalone: true,
  imports: [
    CommonModule,
    SkeletonModule,
    ButtonModule,
    GalleriaModule,
    ImageModule,
    BreadcrumbModule,
    DividerModule,
    TooltipModule,
  ],
  template: `
    <div class="flex justify-content-betwen align-items-start bg-black border-1 border-round surface-border px-4 py-6">
      <div class="col-5">
        <p-galleria
          [value]="data().images"
          [circular]="true"
          [numVisible]="4"
          [showItemNavigators]="true"
          [showThumbnailNavigators]="false"
          [showThumbnails]="data().images.length > 1"
        >
          <ng-template pTemplate="item" let-item>
            <div class="aspect-ratio-75-67 bg-white border-round p-4 overflow-hidden">
              <img class="w-full p-2" [src]="_imgPathService.urlImg(item.url)" alt="Image" />
            </div>
          </ng-template>
          <ng-template pTemplate="thumbnail" let-item>
            <div class="aspect-ratio-75-67 bg-white border-round p-1 overflow-hidden">
              <img class="w-full" [src]="_imgPathService.urlImg(item.url)" alt="" />
            </div>
          </ng-template>
        </p-galleria>
      </div>
      <div class="col-7">
        <div class="flex flex-column pl-4">
          <!-- <p-breadcrumb ngSkipHydration styleClass="bg-black max-w-full" [model]="items">
            <ng-template pTemplate="item" let-item>
              <a [routerLink]="item.route" class="p-menuitem-link">
                <span class="text-color-secondary font-normal">{{ item.label }}</span>
              </a>
            </ng-template>
          </p-breadcrumb> -->

          <h1 class="m-0 text-2xl font-normal px-2">{{ data().title }}</h1>
          <div class="flex gap-2 mt-3 px-2">
            <p-button label="{{ data().main_code[0] }}" size="small" [rounded]="true" severity="secondary" />
            <p-button label="ID: {{ data().id_product }}" size="small" [rounded]="true" severity="secondary" />
          </div>
          <p-divider />

          <p class="m-0 text-blue-400 px-2">
            Precio especial
            <span class="text-2xl font-medium ml-1" [pTooltip]="tooltipPrice" tooltipPosition="bottom">
              {{ data().price_special | currency: "ARS" : "symbol" : "1.2-2" }}
              <sup>
                <i class="pi pi-info-circle"></i>
              </sup>
            </span>
          </p>
          <p-divider />
          <div class="px-2">
            <p class="m-0">
              12 cuotas sin interés de
              <span class="text-purple-400 text-xl ml-1">
                {{ calcInstallments(data().price_list) | currency: "ARS" : "symbol" : "1.2-2" }}
              </span>
            </p>
            <p class="m-0 mt-3">Precio de lista {{ data().price_list | currency: "ARS" : "symbol" : "1.2-2" }}</p>
          </div>
          <p-divider />
          <div class="flex flex-column gap-3 px-2 text-green-400">
            <div class="flex align-items-center gap-2">
              <i class="pi pi-shield text-lg"></i>
              <p class="m-0 ">Garantía - {{ data().warranty }} meses.</p>
            </div>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-truck text-lg"></i>
              <p class="m-0">Envíos a todo el país.</p>
            </div>
          </div>
          <p-divider />
          <div class="px-2">
            <p-button
              styleClass="w-full"
              [label]="data().stock <= 0 ? 'Agotado' : 'Sumar al carrito'"
              severity="warning"
              [disabled]="data().stock <= 0"
              (onClick)="data().buy[0].action"
            />
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductDetailComponent implements OnInit {
  private _productService = inject(ProductService);
  private _loaderService = inject(LoaderService);
  public _imgPathService = inject(ImgPathService);
  public titleInput = input<string>();

  public tooltipPrice: string = "Pagando por depósito o transferencia bancaria.";

  public data = signal<any>({});
  public notFoundProduct = signal<boolean>(false);

  items = [
    { label: "Electronics" },
    { label: "Computer" },
    { label: "Accessories" },
    { label: "Keyboard" },
    { label: "Wireless" },
  ];

  home = { icon: "pi pi-home", routerLink: "/" };

  public calcInstallments(price: number) {
    return (price / 12).toFixed(2);
  }

  ngOnInit(): void {
    if (this.titleInput()) {
      // this._productService.getProductByUrl(this.titleInput()!).subscribe((res) => console.log(res));
      this._productService.findProductMock(this.titleInput()!).subscribe((res) => {
        this.data.set(res);
      });
      console.log("console.log del componente: ", this.data());
    }
  }
}

// Breadcrumb
// /tienda/pagina/1 > id_category > ?id_subcategory > id_brand
// Tienda > Almacenamiento > SSD > XPG
// Tienda > Fuentes > Aerocool
