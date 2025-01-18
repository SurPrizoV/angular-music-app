import { Injectable } from '@angular/core';

import { SelectComponent } from '../components/select/select.component';

@Injectable({
  providedIn: 'root',
})
export class SelectService {
  private activeSelect: SelectComponent | null = null;

  register(select: SelectComponent) {
    this.activeSelect = select;
  }

  unregister(select: SelectComponent) {
    if (this.activeSelect === select) {
      this.activeSelect = null;
    }
  }

  toggle(select: SelectComponent) {
    if (this.activeSelect && this.activeSelect !== select) {
      this.activeSelect.close();
    }
    this.register(select);
  }
}
