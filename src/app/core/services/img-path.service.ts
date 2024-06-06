import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

/**
 * Service to handle image paths.
 */
@Injectable({
  providedIn: "root",
})
export class ImgPathService {
  private cdnImg: string = environment.img_cdn;

  /**
   * Generates the URL for the provided product image.
   * If no product is provided, a default "not found" image URL is returned.
   * @param product The product identifier.
   * @returns The URL for the product image.
   */
  public urlImg(product: string | null): string {
    if (product) {
      return `${this.cdnImg}${product}.jpg`;
    } else {
      return "/assets/images/not-found-image.jpg";
    }
  }
}
