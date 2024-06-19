import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { Router } from "@angular/router";

import { Product } from "../../../core/interfaces/product.interface";
import { ImagePathPipe } from "../../pipes/image-path.pipe";

@Component({
  selector: "app-img-product",
  standalone: true,
  imports: [CommonModule, ImagePathPipe],
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
          [src]="data().images[0].url | imagePath"
          [loading]="loading()"
          alt="Imagen de {{ data().title }}"
        />
        <img
          class="w-full absolute top-0 left-0 cursor-pointer transition-opacity opacity-0 p-{{ padding() }}"
          loading="lazy"
          [src]="data().images[1].url | imagePath"
          [class.opacity-100]="imgHover"
          alt="Imagen de {{ data().title }}"
        />
      } @else {
        <img
          class="w-full cursor-pointer transition-opacity"
          [src]="data().images[0].url | imagePath"
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
  private readonly _router = inject(Router);

  public data = input.required<Product>();
  public padding = input.required<number>();
  public loading = input.required<"lazy" | "eager">();

  public imgHover: boolean = false;

  public navigateToProduct(url: string): void {
    this._router.navigate(["producto/", url]);
  }
}
