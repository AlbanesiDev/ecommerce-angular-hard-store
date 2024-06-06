import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent, FooterComponent } from "./features/layout/";
import { SkeletonModule } from "primeng/skeleton";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, SkeletonModule, ToastModule],
  template: `
    <p-toast />
    <app-header />
    <div class="flex justify-content-center">
      <div class="min-h-calc w-12 px-2 xl:px-0 xl:w-8 py-7">
        <router-outlet class="w-full" />
      </div>
    </div>
    @defer {
      <app-footer />
    }
  `,
})
export class AppComponent {}
