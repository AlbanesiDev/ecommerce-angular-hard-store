import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Firestore, collection, getCountFromServer } from "@angular/fire/firestore";
import { Observable, from, map } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Product } from "../../../core";

@Injectable({
  providedIn: "root",
})
export class ShopService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _firestore = inject(Firestore);

  private readonly productionState = environment.production;
  private readonly mockProducts = environment.mock.shopProducts;
  private readonly shopProducts = environment.endpoint.shopProducts;

  public getProducts(pageSize: number, numberPage: number): Observable<Product[]> {
    return this.productionState ? this.getProductsWithFirestore(pageSize, numberPage) : this.getProductsWithMock();
  }
  private getProductsWithFirestore(pageSize: number, numberPage: number): Observable<Product[]> {
    /**
     * @Todo Get products from firestore
     */
    return this._httpClient.get<Product[]>(this.mockProducts);
  }
  private getProductsWithMock(): Observable<Product[]> {
    return this._httpClient.get<Product[]>(this.mockProducts);
  }

  public getTotalRecords() {
    return this.productionState ? this.getTotalRecordsWithFirestore() : this.getTotalRecordsWithMock();
  }
  public async getTotalRecordsWithFirestore() {
    const collectionRef = collection(this._firestore, this.shopProducts);
    return from(getCountFromServer(collectionRef)).pipe(map((snapshot) => snapshot.data().count));
  }
  private getTotalRecordsWithMock(): Observable<number> {
    return this._httpClient.get<Product[]>(this.mockProducts).pipe(map((products) => products.length));
  }
}
