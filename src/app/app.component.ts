import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent, FooterComponent } from "./features/layout/";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { SkeletonModule } from "primeng/skeleton";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ConfirmDialogModule,
    SkeletonModule,
    ToastModule,
  ],
  template: `
    <p-toast position="bottom-right" />
    <p-confirmDialog />
    <app-header />
    <div class="flex justify-content-center">
      <div class="w-12 xl:w-8 px-2 xl:px-0 py-4 xl:py-6">
        <router-outlet class="w-full" />
      </div>
    </div>
    @defer {
      <app-footer />
    }
  `,
})
export class AppComponent {}
