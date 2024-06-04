import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Firestore, collection } from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { environment } from "../../../../environments/environment";
import { LocalStorageService } from "../../../core/services/local-storage.service";
import { HomeBanners, HomeProducts } from "../interfaces/home.interface";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  private _http = inject(HttpClient);
  private _firestore = inject(Firestore);
  private _localStorageService = inject(LocalStorageService);

  private productCollection = collection(this._firestore, "products");

  private productionState: boolean = environment.production;
  private mockHomeBanners: string = environment.mock.homeBanner;
  private mockHomeProducts: string = environment.mock.homeProducts;

  public getBanners(): Observable<HomeBanners[]> {
    if (this.productionState) {
      return of();
    } else {
      return this._http.get<HomeBanners[]>(this.mockHomeBanners);
    }
  }

  public getProducts(): Observable<HomeProducts[]> {
    if (this.productionState) {
      return of();
    } else {
      return this._http.get<HomeProducts[]>(this.mockHomeProducts);
    }
  }
}
