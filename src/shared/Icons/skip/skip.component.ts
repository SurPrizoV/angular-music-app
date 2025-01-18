import { Component } from '@angular/core';

@Component({
  selector: 'app-skip',
  standalone: true,
  imports: [],
  template: `
    <svg
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15 2.87988V13.3799" stroke="white" />
      <path
        d="M13 7.87988L3.25 1.81771L3.25 13.9421L13 7.87988Z"
        fill="#D9D9D9"
      />
    </svg>
  `,
})
export class SkipComponent {}
