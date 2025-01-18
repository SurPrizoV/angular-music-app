import { Component } from '@angular/core';

@Component({
  selector: 'app-clock-icon',
  standalone: true,
  imports: [],
  template: `
    <svg
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="6.75098" r="5.5" stroke="#4E4E4E" />
      <path d="M4 6.75098H6.5V3.25098" stroke="#4E4E4E" />
    </svg>
  `,
})
export class ClockIconComponent {}
