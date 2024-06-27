import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, ButtonModule, DividerModule],
  template: `
    <footer class="flex justify-content-center border-top-1 surface-border bg-black mt-4 py-6">
      <div class="flex flex-column sm:flex-row gap-5 justify-content-between w-12 px-3 xl:px-0 xl:w-8">
        <div class="flex-order-2 sm:flex-order-0 w-12 sm:w-2">
          <div class="flex justify-content-center align-items-center h-full">
            <img class="w-3 sm:w-5 lg:w-4" src="/assets/images/afip/data.webp" alt="Qr afip" />
          </div>
        </div>
        <div class="flex-order-0 sm:flex-order-1 w-12 sm:w-5">
          <div class="flex flex-column gap-3">
            @for (item of footer[0].buttons; track $index) {
              <p-button
                [styleClass]="item.severity ? 'w-full' : 'text-white w-full'"
                [severity]="item.severity ? 'warning' : 'secondary'"
                [outlined]="true"
                [label]="item.label"
              />
            }
          </div>
        </div>
        <div class="flex-order-1 sm:flex-order-2 w-12 sm:w-3">
          <div class="grid justify-content-start align-items-center">
            @for (item of footer[0].social; track $index) {
              <div class="col-6">
                <p-button
                  styleClass="w-full text-white"
                  severity="secondary"
                  size="large"
                  [text]="true"
                  [icon]="item.icon"
                  [title]="item.label"
                />
              </div>
            }
          </div>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  public footer = [
    {
      buttons: [
        {
          label: "Ayuda",
          action: () => {},
        },
        {
          label: "Términos y condiciones",
          action: () => {},
        },
        {
          label: "¡Trabajá con nosotros!",
          action: () => {},
        },
        {
          label: "Botón de arrepentimiento",
          severity: "warning",
          action: () => {},
        },
      ],
      social: [
        {
          label: "X",
          icon: "pi pi-twitter",
          action: () => {},
        },
        {
          label: "YouTube",
          icon: "pi pi-youtube",
          action: () => {},
        },
        {
          label: "Facebook",
          icon: "pi pi-facebook",
          action: () => {},
        },
        {
          label: "Linkedin",
          icon: "pi pi-linkedin",
          action: () => {},
        },
        {
          label: "Instagram",
          icon: "pi pi-instagram",
          action: () => {},
        },
        {
          label: "Twitch",
          icon: "pi pi-twitch",
          action: () => {},
        },
      ],
    },
  ];
}
