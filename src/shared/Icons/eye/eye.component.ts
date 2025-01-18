import { Component } from '@angular/core';

@Component({
  selector: 'app-eye',
  standalone: true,
  imports: [],
  template: `
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="11.0001"
        cy="11"
        r="1.83333"
        stroke="#4B465C"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        cx="11.0001"
        cy="11"
        r="1.83333"
        stroke="white"
        stroke-opacity="0.2"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M20.1666 11C17.7218 15.2781 14.6666 17.4167 10.9999 17.4167C7.33325 17.4167 4.278 15.2781 1.83325 11C4.278 6.72192 7.33325 4.58334 10.9999 4.58334C14.6666 4.58334 17.7218 6.72192 20.1666 11"
        stroke="#4B465C"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M20.1666 11C17.7218 15.2781 14.6666 17.4167 10.9999 17.4167C7.33325 17.4167 4.278 15.2781 1.83325 11C4.278 6.72192 7.33325 4.58334 10.9999 4.58334C14.6666 4.58334 17.7218 6.72192 20.1666 11"
        stroke="white"
        stroke-opacity="0.2"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class EyeComponent {}
