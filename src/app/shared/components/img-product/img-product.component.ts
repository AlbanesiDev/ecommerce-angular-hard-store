import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { Router } from "@angular/router";
import { ImgPathService } from "../../../core/services/img-path.service";
import { Product } from "../../../core/interfaces/product.interface";

@Component({
  selector: "app-img-product",
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="btn-img relative bg-white border-round overflow-hidden p-{{ padding() }}"
      (click)="navigateToProduct(data().url_search)"
      (mouseenter)="imgHover = true"
      (mouseleave)="imgHover = false"
    >
      @if (data().images && data().images.length > 1) {
        <img
          class="w-full cursor-pointer transition-opacity"
          [src]="imgPathService.urlImg(data().images[0].url)"
          alt="Imagen de {{ data().title }}"
        />
        <img
          class="w-full absolute top-0 left-0 cursor-pointer transition-opacity opacity-0 p-{{ padding() }}"
          [src]="imgPathService.urlImg(data().images[1].url)"
          [loading]="loading()"
          [class.opacity-100]="imgHover"
          alt="Imagen de {{ data().title }}"
        />
      } @else {
        <img
          class="w-full cursor-pointer transition-opacity"
          [src]="imgPathService.urlImg(data().images[0].url)"
          [loading]="loading()"
          [class.opacity-100]="imgHover"
          alt="Imagen de {{ data().title }}"
        />
      }
    </button>
  `,
  styles: `
    @keyframe {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .btn-img {
      all: unset;
      &:focus {
        outline-offset: 2px;
        outline: solid 1px var(--orange-400);
      }
    }
    .transition-opacity {
      transition: opacity 0.25s ease;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImgProductComponent {
  private router: Router = inject(Router);
  public imgPathService: ImgPathService = inject(ImgPathService);

  public data = input.required<Product>();
  public padding = input.required<number>();
  public loading = input.required<"lazy" | "eager">();

  public imgHover: boolean = false;

  public navigateToProduct(url: string): void {
    this.router.navigate(["producto/", url]);
  }
}
