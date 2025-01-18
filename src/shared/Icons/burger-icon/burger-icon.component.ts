import { Component } from '@angular/core';

@Component({
  selector: 'app-burger-icon',
  standalone: true,
  imports: [],
  template: `
    <div class="burger-container">
      <svg
        width="20"
        height="11"
        viewBox="0 0 20 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20 0.509277H0" stroke="#D3D3D3" />
        <path d="M20 5.50928H0" stroke="#D3D3D3" />
        <path d="M20 10.5093H0" stroke="#D3D3D3" />
      </svg>
    </div>
  `,
  styles: [
    `
      .burger-container {
        padding-top: 1rem;
      }
    `,
  ],
})
export class BurgerIconComponent {}
