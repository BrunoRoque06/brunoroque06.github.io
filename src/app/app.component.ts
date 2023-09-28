import { AsyncPipe, NgForOf } from "@angular/common";
import { Component } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { concatMap, delay, from, of } from "rxjs";

function type(val: string) {
  return [...Array(val.length + 1).keys()].map((i) => val.substring(0, i));
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [AsyncPipe, NgForOf],
  template: `
    <div class="links">
      <a
        *ngFor="let l of links"
        href="{{ l.ref }}"
        target="_blank"
        rel="noopener noreferrer"
        >{{ l.name }}</a
      >
    </div>
    <div class="name">
      <div>
        <span>{{ name() }}</span>
        <span class="caret">&nbsp;</span>
      </div>
      <div class="title">Software Engineer</div>
    </div>
  `,
})
export class AppComponent {
  name = toSignal(
    of("Bruno Roque").pipe(
      delay(1000),
      concatMap((n) => from(type(n))),
      concatMap((n) => of(n).pipe(delay(100))),
    ),
  );

  links = [
    {
      name: "Curriculum Vitae",
      ref: "/assets/docs/bruno-roque-cv.pdf",
    },
    {
      name: "GitHub",
      ref: "https://github.com/brunoroque06",
    },
    {
      name: "LinkedIn",
      ref: "https://www.linkedin.com/in/brunoroque06",
    },
  ];
}
