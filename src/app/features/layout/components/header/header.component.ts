import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";

import { ButtonModule } from "primeng/button";
import { BadgeModule } from "primeng/badge";

import { BrandTitleComponent } from "../../../../shared/components/brand-title/brand-title.component";
import { SearchbarComponent } from "../../../searchbar/components/searchbar.component";
import { CartState, selectCartState } from "../../../cart";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule, BrandTitleComponent, SearchbarComponent, ButtonModule, BadgeModule],
  template: `
    <header
      class="sticky top-0 relative border-bottom-1 bg-black flex justify-content-center align-items-center surface-border shadow-3 w-full h-5rem z-5"
    >
      <div class="flex justify-content-between align-items-center w-11 xl:w-8">
        <app-brand-title />
        <nav class="flex justify-content-around align-items-center navbar" [class.show]="isNavbarOpen()">
          <ul class="flex gap-3  list-none">
            @for (item of headerConfig[0].navbar; track item.id) {
              <li>
                <p-button
                  styleClass="text-color white-space-nowrap	"
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
          <p-button
            styleClass="text-color"
            size="large"
            severity="secondary"
            [text]="true"
            (onClick)="navigate(headerConfig[0].buttons[0].url)"
          >
            @if (badgeCount() > 0) {
              <i
                pBadge
                class="pi {{ headerConfig[0].buttons[0].icon }} text-xl"
                severity="danger"
                [value]="badgeCount()"
              ></i>
            } @else {
              <i class="pi {{ headerConfig[0].buttons[0].icon }} text-xl"></i>
            }
          </p-button>
          <p-button
            styleClass="text-color"
            size="large"
            severity="secondary"
            [text]="true"
            (onClick)="navigate(headerConfig[0].buttons[1].url)"
          >
            <i class="pi {{ headerConfig[0].buttons[1].icon }} text-xl"></i>
          </p-button>
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
  private router: Router = inject(Router);

  private isAuthenticated = signal<boolean>(false);
  public isNavbarOpen = signal<boolean>(false);
  public badgeCount = signal<number>(0);
  public headerConfig = [
    {
      navbar: [
        { id: 0, label: "Inicio", url: "/" },
        { id: 1, label: "Tienda", url: "/tienda/pagina/1" },
        { id: 2, label: "Armá tu pc", url: "/armar-pc" },
      ],
      buttons: [
        { label: "bag", icon: "pi-shopping-cart", url: "/carrito" },
        { label: "auth", icon: "pi-user", url: this.getProfileUrl() },
      ],
    },
  ];

  constructor(private store: Store<{ cart: CartState }>) {
    this.store
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
  private adjustNavbar() {
    if (window.innerWidth > 992) {
      this.isNavbarOpen.set(false);
    }
  }

  /**
   * Navigates to the specified URL
   * @param url URL to navigate to
   */
  public navigate(url: string): void {
    this.isNavbarOpen.set(false);
    this.router.navigateByUrl(url);
  }

  /**
   * Returns the appropriate profile URL based on authentication status
   * @returns Profile URL
   */
  private getProfileUrl(): string {
    return this.isAuthenticated() ? "/perfil" : "/auth/iniciar-sesion";
  }
}
