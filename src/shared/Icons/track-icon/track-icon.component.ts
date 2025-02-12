import { Component } from '@angular/core';

@Component({
  selector: 'app-track-icon',
  standalone: true,
  imports: [],
  template: `
    <svg
      width="51"
      height="52"
      viewBox="0 0 51 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="0.750977" width="51" height="51" fill="#313131" />
      <path d="M23 32.751V18.7207L34 17.751V29.751" stroke="#4E4E4E" />
      <ellipse cx="19.5" cy="32.751" rx="3.5" ry="2" stroke="#4E4E4E" />
      <ellipse cx="30.5" cy="29.751" rx="3.5" ry="2" stroke="#4E4E4E" />
    </svg>
  `,
})
export class TrackIconComponent {}
