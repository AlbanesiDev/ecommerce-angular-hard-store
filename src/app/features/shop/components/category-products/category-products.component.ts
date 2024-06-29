/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject, output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { TreeModule } from "primeng/tree";

import { Categories } from "../../interfaces/shop.interfaces";
import { CATEGORIES } from "../../../../shared";

@Component({
  selector: "app-category-products",
  standalone: true,
  imports: [CommonModule, TreeModule],
  template: `
    <div class="card p-2">
      <p-tree
        styleClass="w-full bg-black"
        selectionMode="single"
        filterPlaceholder="Buscar categoria..."
        emptyMessage="No se encontraron categorías"
        [value]="categories"
        [filter]="false"
        (onNodeSelect)="onNodeSelect($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryProductsComponent {
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  public readonly categories: Categories[] = CATEGORIES;

  public onCategoryChange = output<any>();

  public onNodeSelect(event: any): void {
    const category = event.node.id_category;
    const subcategory = event.node.id_subcategory;
    const brand = event.node.id_brand;

    let queryParams = {};

    if (category) {
      queryParams = { cat: category };
    } else if (subcategory) {
      const parentCategory = event.node.parent ? event.node.parent.id_category : category;
      queryParams = { cat: parentCategory, subcat: subcategory };
    } else if (brand) {
      const parentCategory = event.node.parent ? event.node.parent.id_category : category;
      const parentSubcategory = event.node.parent ? event.node.parent.id_subcategory : subcategory;
      queryParams = { cat: parentCategory, subcat: parentSubcategory, brand: brand };
    }

    this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParams,
      replaceUrl: true,
    });

    this.onCategoryChange.emit(queryParams);
  }
}
