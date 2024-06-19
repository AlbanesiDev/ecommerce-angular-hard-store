import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, from, map, throwError } from "rxjs";
import { DocumentData, Firestore, doc, getDoc } from "@angular/fire/firestore";
import fuzzysort from "fuzzysort";

import { ProductErrorService, Product } from "../../../core/";
import { environment } from "../../../../environments/environment";
import { Suggestions } from "../interfaces/suggestion.interface";

/**
 * ProductService is responsible for retrieving product data.
 * It supports fetching data from Firestore in production mode,
 * and from a mock endpoint in development mode.
 */
@Injectable({
  providedIn: "root",
})
export class ProductService {
  private readonly _productErrorService: ProductErrorService = inject(ProductErrorService);
  private readonly _firestore: Firestore = inject(Firestore);
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly isProduction: boolean = environment.production;
  private readonly mockEndpoint: string = environment.mock.shopProducts;

  /**
   * Retrieves a product by URL.
   * @param url - The URL of the product.
   * @returns An observable with the product data or an error.
   */
  public getProduct(url: string): Observable<Product | DocumentData | Suggestions> {
    return this.isProduction ? this.getFirestoreProduct(url) : this.getMockProduct(url);
  }

  /**
   * Fetches a product from Firestore.
   * @param url - The URL of the product.
   * @returns An observable with the product data or an error.
   */
  private getFirestoreProduct(url: string): Observable<DocumentData> {
    const productDocRef = doc(this._firestore, "products", url);
    const productPromise = getDoc(productDocRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        return docSnapshot.data();
      } else {
        throw new Error("Product not found");
      }
    });
    return from(productPromise);
  }

  /**
   * Fetches a product from the mock endpoint.
   * @param url - The URL of the product.
   * @returns An observable with the product data or an error.
   */
  private getMockProduct(url: string): Observable<Product | { suggestions: Suggestions[] }> {
    return this._http.get<Product[]>(this.mockEndpoint).pipe(
      map((res: Product[]) => {
        const exactProduct = this.findExactProduct(res, url);
        if (exactProduct) {
          this._productErrorService.productNotFoundSig.set(false);
          return exactProduct;
        } else {
          this._productErrorService.productNotFoundSig.set(true);
          const suggestions = this.findAproximatedProducts(res, url);
          if (suggestions.length > 0 && suggestions.length < 20) {
            return { suggestions };
          } else {
            throw new Error("Product not found");
          }
        }
      }),
      catchError((error) => {
        this._productErrorService.productNotFoundSig.set(true);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Finds an exact product by URL.
   * @param res - The array of products.
   * @param url - The URL of the product.
   * @returns The product if found, otherwise undefined.
   */
  private findExactProduct(res: Product[], url: string): Product | undefined {
    return res.find((product: Product) => product.url_search === url);
  }

  /**
   * Finds approximated products by URL.
   * @param res - The array of products.
   * @param url - The URL of the product.
   * @returns An array of suggestions.
   */
  private findAproximatedProducts(products: Product[], url: string): Suggestions[] {
    const urlNormalized = url.replace(/_/g, " ");
    const results = fuzzysort.go(urlNormalized, products, {
      keys: ["title"],
      threshold: -5000,
    });

    return results.map((result) => ({
      url_search: result.obj.url_search,
      title: result.obj.title,
    }));
  }
}
