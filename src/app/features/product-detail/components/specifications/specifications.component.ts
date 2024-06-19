import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-specifications",
  standalone: true,
  imports: [CommonModule],
  template: ` <div
    class="flex flex-column md:flex-row gap-3 justify-content-betwen align-items-start card mt-3 px-2 md:px-4 py-4 md:py-6"
  ></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecificationsComponent {
  public data = input();
}
