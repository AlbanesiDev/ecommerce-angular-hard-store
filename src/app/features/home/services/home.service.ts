import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Firestore, collection, collectionData } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { HomeBanners, HomeProducts } from "../interfaces/home.interface";

/**
 * Service to handle operations related to home banners and products.
 */
@Injectable({
  providedIn: "root",
})
export class HomeService {
  private readonly _http = inject(HttpClient);
  private readonly _firestore = inject(Firestore);

  private readonly productionState: boolean = environment.production;

  private readonly mockHomeBanners: string = environment.mock.homeBanner;
  private readonly mockHomeProducts: string = environment.mock.homeProducts;

  private readonly homeBanners: string = environment.endpoint.homeBanners;
  private readonly homeProducts: string = environment.endpoint.homeProducts;

  private bannersCollecion = collection(this._firestore, this.homeBanners);
  private productCollection = collection(this._firestore, this.homeProducts);

  /**
   * Fetches the home banners.
   * In production, it retrieves data from Firestore. In development, it fetches data from a mock HTTP endpoint.
   * @returns An observable that emits an array of HomeBanners.
   */
  public getBanners(): Observable<HomeBanners[]> {
    if (this.productionState) {
      return collectionData(this.bannersCollecion) as Observable<HomeBanners[]>;
    } else {
      return this._http.get<HomeBanners[]>(this.mockHomeBanners);
    }
  }

  /**
   * Fetches the home products.
   * In production, it retrieves data from Firestore. In development, it fetches data from a mock HTTP endpoint.
   * @returns An observable that emits an array of HomeProducts.
   */
  public getProducts(): Observable<HomeProducts[]> {
    if (this.productionState) {
      return collectionData(this.productCollection) as Observable<HomeProducts[]>;
    } else {
      return this._http.get<HomeProducts[]>(this.mockHomeProducts);
    }
  }
}
