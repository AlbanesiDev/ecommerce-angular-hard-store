import { Routes } from "@angular/router";
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from "@angular/fire/auth-guard";

export const routes: Routes = [
  {
    path: "",
    title: "Inicio | Hard Store",
    loadComponent: () => import("./features/home/pages/home.component"),
  },
  {
    path: "tienda/pagina/:numberPage",
    title: "Tienda | Hard Store",
    loadComponent: () => import("./features/shop/pages/shop.component"),
  },
  {
    path: "busqueda/pagina/:numberPage/:queryInput",
    title: "Busqueda | Hard Store",
    loadComponent: () => import("./features/shop/pages/shop.component"),
  },
  {
    path: "armar-pc",
    title: "Armá tu pc | Hard Store",
    loadComponent: () => import("./features/build-pc/pages/build-pc.component"),
  },
  {
    path: "producto/:titleInput",
    title: "Producto | Hard Store",
    loadComponent: () => import("./features/product-detail/pages/product-detail.component"),
  },
  {
    path: "carrito",
    title: "Carrito | Hard Store",
    loadComponent: () => import("./features/cart/pages/cart.component"),
  },
  {
    path: "favoritos",
    title: "Favoritos | Hard Store",
    loadComponent: () => import("./features/favorites/pages/favorites.component"),
  },
  {
    path: "checkout",
    title: "Checkout | Hard Store",
    loadComponent: () => import("./features/checkout/pages/checkout.component"),
  },
  {
    ...canActivate(() => redirectLoggedInTo(["perfil"])),
    path: "auth",
    children: [
      {
        path: "iniciar-sesion",
        title: "Iniciar sesión | Hard Store",
        loadComponent: () => import("./features/auth/pages/sign-in/sign-in.component"),
      },
      {
        path: "registrarse",
        title: "Registrarse | Hard Store",
        loadComponent: () => import("./features/auth/pages/sign-up/sign-up.component"),
      },
      {
        path: "recuperar-contraseña",
        title: "Recuperar contraseña | Hard Store",
        loadComponent: () => import("./features/auth/pages/forgot/forgot.component"),
      },
    ],
  },
  {
    ...canActivate(() => redirectUnauthorizedTo(["auth/iniciar-sesion"])),
    path: "perfil",
    title: "Perfil | Hard Store",
    loadComponent: () => import("./features/profile/pages/profile.component"),
  },
];
