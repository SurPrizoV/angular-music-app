import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  template: `
    <div class="spinner-wrapper">
      <div class="spinner"></div>
    </div>
  `,
  styles: [
    `
      .spinner-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
      }

      .spinner {
        width: 5rem;
        height: 5rem;
        border: 5px solid rgba(255, 255, 255, 0.3);
        border-top-color: #ffffff; // <- определение цвета вне файла variables
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoaderComponent {}
