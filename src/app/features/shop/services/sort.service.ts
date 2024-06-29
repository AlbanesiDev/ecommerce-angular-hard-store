import { Injectable } from "@angular/core";
import { Product } from "../../../core";

@Injectable({
  providedIn: "root",
})
export class SortService {
  public sortNameAsc(products: Product[]): Product[] {
    return [...products].sort((a, b) => a.title.localeCompare(b.title));
  }

  public sortNameDesc(products: Product[]): Product[] {
    return [...products].sort((a, b) => b.title.localeCompare(a.title));
  }

  public sortPriceAsc(products: Product[]): Product[] {
    return [...products].sort((a, b) => a.price_special - b.price_special);
  }

  public sortPriceDesc(products: Product[]): Product[] {
    return [...products].sort((a, b) => b.price_special - a.price_special);
  }
}
