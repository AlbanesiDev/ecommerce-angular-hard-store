import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./features/home/pages/home.component"),
  },
  {
    path: "tienda/:page/:numberInput",
    loadComponent: () => import("./features/shop/pages/shop.component"),
  },
  {
    path: "armar-pc",
    loadComponent: () => import("./features/build-pc/pages/build-pc.component"),
  },
  {
    path: "producto/:titleInput",
    loadComponent: () => import("./features/product-detail/pages/product-detail.component"),
  },
  {
    path: "carrito",
    loadComponent: () => import("./features/cart/pages/cart.component"),
  },
  {
    path: "checkout",
    loadComponent: () => import("./features/checkout/pages/checkout.component"),
  },
];
