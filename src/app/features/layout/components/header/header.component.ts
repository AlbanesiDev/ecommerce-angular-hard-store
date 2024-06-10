import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";

import { ButtonModule } from "primeng/button";
import { BadgeModule } from "primeng/badge";

import { BrandTitleComponent } from "../../../../shared/components/brand-title/brand-title.component";
import { SearchbarComponent } from "../../../searchbar/components/searchbar.component";
import { AuthService } from "../../../../core/services/auth.service";
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
        <nav class="flex justify-content-around align-items-center navbar" [class.show]="navbarOpen()">
          <ul class="flex gap-3  list-none">
            @for (item of navbar; track $index) {
              <li>
                <p-button
                  styleClass="text-color white-space-nowrap	"
                  severity="secondary"
                  [text]="true"
                  [label]="item.label"
                  [routerLink]="item.url"
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
            (onClick)="buttons[0].action()"
          >
            @if (badgeSig() > 0) {
              <i pBadge class="pi {{ buttons[0].icon }} text-xl" severity="danger" [value]="badgeSig()"></i>
            } @else {
              <i class="pi {{ buttons[0].icon }} text-xl"></i>
            }
          </p-button>
          <p-button
            styleClass="text-color"
            size="large"
            severity="secondary"
            [text]="true"
            (onClick)="buttons[1].action()"
          >
            <i class="pi {{ buttons[1].icon }} text-xl"></i>
          </p-button>
          <p-button
            styleClass="text-color lg:hidden"
            size="large"
            severity="secondary"
            icon="pi pi-bars"
            [text]="true"
            (onClick)="navbarOpen.set(navbarOpen() ? false : true)"
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
  // public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);
  public router: Router = inject(Router);
  public cdr = inject(ChangeDetectorRef);
  public badgeSig = signal<number>(0);

  public navbarOpen = signal<boolean>(false);

  public navbar: Array<{ label: string; url: string }> = [
    {
      label: "Inicio",
      url: "/",
    },
    {
      label: "Tienda",
      url: "/tienda/pagina/1",
    },
    {
      label: "Armá tu pc",
      url: "/armar-pc",
    },
  ];

  public buttons: Array<{ label: string; icon: string; action: () => void }> = [
    {
      label: "bag",
      icon: "pi-shopping-cart",
      action: () => this.router.navigateByUrl("/carrito"),
    },
    {
      label: "auth",
      icon: "pi-user",
      action: () => this.profile(),
    },
  ];

  constructor(private store: Store<{ cart: CartState }>) {
    this.store
      .select(selectCartState)
      .pipe(takeUntilDestroyed())
      .subscribe((products) => {
        this.badgeSig.set(products.products.length);
      });
  }

  private profile(): void {
    //  auth ? go to profile : go to signIn
  }
}
