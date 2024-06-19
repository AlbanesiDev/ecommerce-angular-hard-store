/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { Router, RouterModule } from "@angular/router";

import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <div class="flex justify-content-center align-items-center card px-4 py-6 min-h-calc">
      <div class="flex flex-column gap-3 w-6">
        <div class="flex flex-column align-items-center">
          <p class="m-0 text-4xl text-center">No se ha encontrado el producto</p>
          <img class="w-full" src="/assets/images/not-found/not-found-product.webp" alt="" />
        </div>
        @if (data().suggestions) {
          <div class="flex flex-column align-items-stretch">
            <span>Búsquedas parecidas:</span>
            @for (item of data().suggestions; track $index) {
              <p-button severity="info" [label]="item.title" [text]="true" (onClick)="navigateTo(item.url_search)" />
            }
          </div>
        }
        <p-button
          size="large"
          label="volver a la tienda"
          severity="warning"
          styleClass="mt-4 w-full"
          routerLink="/tienda/pagina/1"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  private readonly _router = inject(Router);
  public data = input.required<any>();

  public navigateTo(url: string) {
    this._router.navigate(["/producto", url]);
  }
}
