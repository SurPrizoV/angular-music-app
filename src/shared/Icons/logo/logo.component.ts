import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  template: `
    <div class="logo-container">
      <svg
        width="25"
        height="18"
        viewBox="0 0 25 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.13502 17.0487C1.31059 18.1026 0 17.2244 0 15.6623C0 13.9994 0 9.00999 0 9.00999C0 9.00999 0 4.02055 0 2.35768C0 0.79563 1.30978 -0.0825642 3.13502 0.971268C5.97654 2.61219 14.5003 7.53658 14.5003 7.53658C15.6336 8.19116 15.6336 9.82801 14.5003 10.4826C14.5003 10.4834 5.97654 15.4078 3.13502 17.0487Z"
          fill="#00C1FF"
        />
        <path
          d="M12.5169 17.0473C10.6924 18.1011 9.38184 17.2229 9.38184 15.6608C9.38184 13.998 9.38184 9.00853 9.38184 9.00853C9.38184 9.00853 9.38184 4.01909 9.38184 2.35621C9.38184 0.794165 10.6916 -0.084029 12.5169 0.969803C15.2958 2.57495 23.6325 7.39119 23.6325 7.39119C24.8773 8.11001 24.8773 9.90705 23.6325 10.6259C23.6317 10.6259 15.2958 15.4421 12.5169 17.0473Z"
          fill="#BCEC30"
        />
      </svg>
      <p>MyMusic</p>
    </div>
  `,
  styles: [
    `
      .logo-container {
        display: flex;
        align-items: center;
      }
      p {
        font-family: 'Kanit', sans-serif;
        font-weight: 500;
        font-style: normal;
        font-size: 2.4rem;
        margin-left: 0.8rem;
      }
    `,
  ],
})
export class LogoComponent {}
