import { Component } from "@angular/core";
import { concatMap, delay, from, of } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { LogosComponent } from "./logos.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [AsyncPipe, LogosComponent],
  template: `
    <header>
      <div class="name">
        <span>{{ name | async }}</span>
        <span class="caret">#</span>
      </div>
      <div class="title">Software Engineer</div>
      <app-logos></app-logos>
    </header>
  `,
})
export class AppComponent {
  name = of("Bruno Roque").pipe(
    delay(1000),
    concatMap((n) =>
      from([...Array(n.length + 1).keys()].map((i) => n.substring(0, i)))
    ),
    concatMap((n) => of(n).pipe(delay(100)))
  );
}
