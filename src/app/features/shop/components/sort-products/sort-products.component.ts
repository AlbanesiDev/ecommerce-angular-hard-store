/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";

import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";

import { ShopState, SortOrder, ViewMode } from "../../interfaces/shop.interfaces";
import { selectSortOrder, selectViewMode } from "../../store/shop.selectors";
import * as ShopActions from "../../store/shop.actions";

@Component({
  selector: "app-sort-products",
  standalone: true,
  imports: [FormsModule, DropdownModule, ButtonModule],
  template: `
    <div class="flex justify-content-between align-items-center card w-full h-4rem px-3">
      <div class="w-4">
        <p-dropdown
          styleClass="w-full bg-black"
          optionLabel="label"
          optionValue="value"
          placeholder="Sort"
          [options]="sortOptions"
          [(ngModel)]="selectedSortOrder"
          (onClick)="onSortOrderChange(selectedSortOrder)"
        />
      </div>
      <div class="flex gap-3">
        <p-button
          ariaLabel="Grid view"
          icon="pi pi-table"
          [text]="true"
          [severity]="getButtonSeverity('grid')"
          (onClick)="onViewModeChange('grid')"
        />
        <p-button
          ariaLabel="List view"
          icon="pi pi-list"
          [text]="true"
          [severity]="getButtonSeverity('list')"
          (onClick)="onViewModeChange('list')"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortProductsComponent {
  private readonly _store = inject(Store<{ shop: ShopState }>);

  public activeViewMode: ViewMode = "grid";
  public selectedSortOrder: SortOrder = "default";
  public readonly sortOptions = [
    {
      label: "Destacados",
      value: "default",
    },
    {
      label: "Precio más bajo",
      value: "priceAsc",
    },
    {
      label: "Precio más alto",
      value: "priceDesc",
    },
    {
      label: "De la a-z",
      value: "alphaAsc",
    },
    {
      label: "De la z-a",
      value: "alphaDesc",
    },
  ];

  constructor() {
    this.subscribeToStore(selectViewMode, (viewMode: ViewMode) => {
      this.activeViewMode = viewMode;
    });
    this.subscribeToStore(selectSortOrder, (sortOrder: SortOrder) => {
      this.selectedSortOrder = sortOrder;
    });
  }

  /**
   * Dispatches an action to change the sort order.
   * @param sortOrder The selected sort order.
   */
  public onSortOrderChange(sortOrder: SortOrder): void {
    this._store.dispatch(ShopActions.changeSortOrder({ sortOrder: sortOrder }));
  }

  /**
   * Dispatches an action to change the view mode.
   * @param viewMode The selected view mode.
   */
  public onViewModeChange(viewMode: ViewMode): void {
    this.activeViewMode = viewMode;
    this._store.dispatch(ShopActions.changeViewMode({ viewMode: viewMode }));
  }

  /**
   * Determines the button severity based on the active view mode.
   * @param viewMode The view mode to check.
   * @returns The severity style for the button.
   */
  public getButtonSeverity(viewMode: ViewMode): "warning" | "secondary" {
    return this.activeViewMode === viewMode ? "warning" : "secondary";
  }

  /**
   * Subscribes to a store selector and assigns the result to a variable.
   * @param selector The store selector to subscribe to.
   * @param callback The callback function to assign the result.
   */
  private subscribeToStore<T>(selector: any, callback: (result: T) => void): void {
    this._store.select(selector).pipe(takeUntilDestroyed()).subscribe(callback);
  }
}
