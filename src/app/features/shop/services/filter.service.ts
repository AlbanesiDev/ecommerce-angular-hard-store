import { Injectable } from "@angular/core";
import { Product } from "../../../core";

@Injectable({
  providedIn: "root",
})
export class FilterService {
  public showCategory(category: number, products: Product[]): Product[] {
    return products.filter((product: Product) => product.id_category === category);
  }

  public showSubcategory(subcategory: number, products: Product[]): Product[] {
    return products.filter((product: Product) => product.id_subcategory === subcategory);
  }

  public showBrand(brand: number, products: Product[]): Product[] {
    return products.filter((product: Product) => product.id_brand === brand);
  }
}
