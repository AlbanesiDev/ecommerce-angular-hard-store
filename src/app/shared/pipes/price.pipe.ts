import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "priceView",
  standalone: true,
})
export class PricePipe implements PipeTransform {
  transform(priceSpecial: number, priceList: number, selector: "priceSpecial" | "priceList"): number {
    return selector === "priceSpecial" ? priceSpecial : priceList;
  }
}
