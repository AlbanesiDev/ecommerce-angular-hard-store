import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";

import { ButtonModule } from "primeng/button";
import { BadgeModule } from "primeng/badge";

import { BrandTitleComponent } from "../../../../shared/components/brand-title/brand-title.component";
import { SearchbarComponent } from "../../../searchbar/components/searchbar.component";
import { CartState, selectCartState } from "../../../cart";
import { AuthState, selectAuthState } from "../../../auth";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, BrandTitleComponent, SearchbarComponent, ButtonModule, BadgeModule],
  template: `
    <header
      class="sticky top-0 relative border-bottom-1 bg-black flex justify-content-center align-items-center surface-border shadow-3 w-full h-5rem z-5"
    >
      <div class="flex justify-content-between align-items-center w-11 xl:w-8">
        <app-brand-title />
        <nav class="flex justify-content-around align-items-center navbar" [class.show]="isNavbarOpen()">
          <ul class="flex gap-3  list-none">
            @for (item of headerConfig.navbar; track item.id) {
              <li>
                <p-button
                  class="hover:text-orange-400"
                  styleClass="white-space-nowrap text-white"
                  severity="secondary"
                  [text]="true"
                  [label]="item.label"
                  (onClick)="navigate(item.url)"
                />
              </li>
            }
            <app-searchbar />
          </ul>
        </nav>
        <div class="flex gap-2">
          @for (item of headerConfig.buttons; track item.id) {
            @if (!item.authRequired || isAuthenticated()) {
              <p-button
                size="large"
                severity="secondary"
                styleClass="text-color px-3 py-2"
                [text]="true"
                [title]="item.label"
                (onClick)="navigate(item.url)"
              >
                @if (item.badge && badgeCount() > 0) {
                  <i pBadge class="pi {{ item.icon }} text-xl" severity="danger" [value]="badgeCount()"></i>
                } @else {
                  <i class="pi {{ item.icon }} text-xl"></i>
                }
              </p-button>
            }
          }
          <p-button
            styleClass="text-color lg:hidden"
            size="large"
            severity="secondary"
            icon="pi pi-bars"
            [text]="true"
            (onClick)="isNavbarOpen.set(isNavbarOpen() ? false : true)"
          />
        </div>
      </div>
    </header>
  `,
  styles: `
    @media screen and (max-width: 992px) {
      .navbar {
        display: none !important;
      }
    }

    .show {
      width: 100%;
      background-color: black;
      position: absolute;
      top: 80px;
      left: 0;
      display: flex !important;

      padding-block: 2rem;
      border-bottom: solid 1px var(--surface-border);
      ul {
        padding-inline: 2rem;
        width: 100%;
        flex-direction: column !important;

        app-searchbar {
          margin-top: 1.5rem;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly _router = inject(Router);
  private readonly _store = inject(Store<{ cart: CartState; auth: AuthState }>);

  public isAuthenticated = signal<boolean>(false);
  public isNavbarOpen = signal<boolean>(false);
  public badgeCount = signal<number>(0);

  public readonly headerConfig = {
    navbar: [
      { id: 0, label: "Inicio", url: "/" },
      { id: 1, label: "Tienda", url: "/tienda/pagina/1" },
      { id: 2, label: "Armá tu pc", url: "/armar-pc" },
    ],
    buttons: [
      {
        id: 0,
        label: "carrito",
        icon: "pi pi-shopping-cart",
        url: "/carrito",
        badge: true,
      },
      {
        id: 1,
        label: "favoritos",
        icon: "pi pi-heart",
        url: "/favoritos",
        authRequired: true,
      },
      {
        id: 2,
        label: "iniciar sesión",
        icon: "pi pi-user",
        url: this.getProfileUrl(),
      },
    ],
  };

  constructor() {
    this._store
      .select(selectAuthState)
      .pipe(takeUntilDestroyed())
      .subscribe((auth) => {
        this.isAuthenticated.set(auth.userAuth);
      });
    this._store
      .select(selectCartState)
      .pipe(takeUntilDestroyed())
      .subscribe((products) => {
        this.badgeCount.set(products.products.length);
      });
  }

  /**
   * Adjusts navbar visibility based on window size
   */
  @HostListener("window:resize", ["$event"])
  private adjustNavbar(): void {
    if (typeof window !== "undefined" && window.innerWidth > 992) {
      this.isNavbarOpen.set(false);
    }
  }

  /**
   * Navigates to the specified URL
   * @param url URL to navigate to
   */
  public navigate(url: string): void {
    this.isNavbarOpen.set(false);
    this._router.navigateByUrl(url);
  }

  /**
   * Returns the appropriate profile URL based on authentication status
   * @returns Profile URL
   */
  private getProfileUrl(): string {
    return this.isAuthenticated() ? "/perfil" : "/auth/iniciar-sesion";
  }
}
