import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Firestore, collection, query, where, getDocs } from "@angular/fire/firestore";
import { Observable, from, map } from "rxjs";

import * as fuzzysort from "fuzzysort";

import { environment } from "../../../../environments/environment";
import { Product } from "../../../core";

/**
 * Service for searching products.
 */
@Injectable({
  providedIn: "root",
})
export class SearchService {
  private readonly _http = inject(HttpClient);
  private readonly _firestore = inject(Firestore);
  private readonly productionState = environment.production;
  private readonly mockProducts = environment.mock.shopProducts;

  /**
   * Searches products based on a query.
   * @param query The search query.
   * @returns An Observable emitting an array of Product objects matching the query.
   */
  public searchProducts(query: string): Observable<Product[]> {
    if (this.productionState) {
      return this.searchInFirestore(query);
    } else {
      return this.searchInMock(query);
    }
  }

  /**
   * Searches for products in Firestore based on the search term.
   * @param searchTerm The search term.
   * @returns An Observable emitting an array of Product objects matching the search term.
   */
  private searchInFirestore(searchTerm: string): Observable<Product[]> {
    const productsRef = collection(this._firestore, "products");
    const q = query(productsRef, where("title", ">=", searchTerm), where("title", "<=", searchTerm + "\uf8ff"));
    return from(getDocs(q)).pipe(map((snapshot) => snapshot.docs.map((doc) => doc.data() as Product)));
  }

  /**
   * Searches for products in the mock data based on the query.
   * @param query The search query.
   * @returns An Observable emitting an array of Product objects matching the query.
   */
  private searchInMock(query: string): Observable<Product[]> {
    return this._http.get<Product[]>(this.mockProducts).pipe(
      map((products: Product[]) => {
        return this.filterProducts(products, query);
      }),
    );
  }

  /**
   * Filters products based on a fuzzy search query.
   * @param products The array of Product objects to filter.
   * @param query The search query.
   * @returns An array of Product objects filtered based on the query.
   */
  private filterProducts(products: Product[], query: string): Product[] {
    const lowerCaseQuery = query.toLowerCase();
    const results = fuzzysort.go(lowerCaseQuery, products, {
      keys: ["title"],
      threshold: -1000,
    });

    return results.map((result) => result.obj);
  }
}
