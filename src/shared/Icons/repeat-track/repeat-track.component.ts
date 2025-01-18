import { Component } from '@angular/core';

@Component({
  selector: 'app-repeat-track',
  standalone: true,
  imports: [],
  template: `
    <svg
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 2.87988L5 -0.0068686V5.76663L10 2.87988ZM7 14.3799C3.96243 14.3799 1.5 11.9174 1.5 8.87988H0.5C0.5 12.4697 3.41015 15.3799 7 15.3799V14.3799ZM1.5 8.87988C1.5 5.84232 3.96243 3.37988 7 3.37988V2.37988C3.41015 2.37988 0.5 5.29003 0.5 8.87988H1.5Z"
        fill="white"
      />
      <path
        d="M10 14.8799L15 17.7666V11.9931L10 14.8799ZM13 3.37988C16.0376 3.37988 18.5 5.84232 18.5 8.87988H19.5C19.5 5.29003 16.5899 2.37988 13 2.37988V3.37988ZM18.5 8.87988C18.5 11.9174 16.0376 14.3799 13 14.3799V15.3799C16.5899 15.3799 19.5 12.4697 19.5 8.87988H18.5Z"
        fill="white"
      />
      <text
        x="10"
        y="9"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="5"
        fill="white"
        font-family="Arial, sans-serif"
      >
        1
      </text>
    </svg>
  `,
})
export class RepeatTrackComponent {}
