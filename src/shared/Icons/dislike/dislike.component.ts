import { Component } from '@angular/core';

@Component({
  selector: 'app-dislike',
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
      <path d="M0.743652 1L14.7437 13.5" stroke="#696969" />
      <path
        d="M8.08762 3.25572H8.10918C9.04108 2.44175 11.5002 1.16576 13.7004 2.76734C17.0549 5.20921 13.9897 10.5 8.10918 14H8.08762M8.08768 3.25572H8.06611C7.13422 2.44175 4.6751 1.16576 2.47491 2.76734C-0.879656 5.20921 2.18561 10.5 8.06611 14H8.08768"
        stroke="#696969"
      />
    </svg>
  `,
})
export class DislikeComponent {}
