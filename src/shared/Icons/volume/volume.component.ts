import { Component } from '@angular/core';

@Component({
  selector: 'app-volume',
  standalone: true,
  imports: [],
  template: `
    <svg
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask id="path-1-inside-1_1_1942" fill="white">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8 0L3 5H0V13H3L8 18V0Z"
        />
      </mask>
      <path
        d="M3 5V6H3.41421L3.70711 5.70711L3 5ZM8 0H9V-2.41421L7.29289 -0.707107L8 0ZM0 5V4H-1V5H0ZM0 13H-1V14H0V13ZM3 13L3.70711 12.2929L3.41421 12H3V13ZM8 18L7.29289 18.7071L9 20.4142V18H8ZM3.70711 5.70711L8.70711 0.707107L7.29289 -0.707107L2.29289 4.29289L3.70711 5.70711ZM0 6H3V4H0V6ZM1 13V5H-1V13H1ZM3 12H0V14H3V12ZM8.70711 17.2929L3.70711 12.2929L2.29289 13.7071L7.29289 18.7071L8.70711 17.2929ZM7 0V18H9V0H7Z"
        fill="white"
        mask="url(#path-1-inside-1_1_1942)"
      />
      <path
        d="M11 13C12.1046 13 13 11.2091 13 9C13 6.79086 12.1046 5 11 5"
        stroke="white"
      />
    </svg>
  `,
})
export class VolumeComponent {}
