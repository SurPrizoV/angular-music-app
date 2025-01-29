import { Injectable } from '@angular/core';

import { SelectComponent } from '../components/select/select.component';

@Injectable({
  providedIn: 'root',
})
/**
 * Сервис для управления состоянием активного элемента SelectComponent.
 * Позволяет регистрировать, удалять регистрацию и переключать активные селекты.
 */
export class SelectService {
  /**
   * Текущий активный элемент SelectComponent.
   * Хранит ссылку на компонент, который является активным в данный момент.
   * @private
   */
  private activeSelect: SelectComponent | null = null;

  /**
   * Регистрирует элемент SelectComponent как активный.
   *
   * @param {SelectComponent} select - Селект, который нужно зарегистрировать как активный.
   */
  register(select: SelectComponent) {
    this.activeSelect = select;
  }

  /**
   * Удаляет регистрацию элемента SelectComponent.
   * Если переданный элемент является текущим активным, то активность сбрасывается.
   *
   * @param {SelectComponent} select - Селект, который нужно удалить из активных.
   */
  unregister(select: SelectComponent) {
    if (this.activeSelect === select) {
      this.activeSelect = null;
    }
  }

  /**
   * Переключает активность между элементами SelectComponent.
   * Если другой элемент уже активен, он закрывается, и новый элемент регистрируется как активный.
   *
   * @param {SelectComponent} select - Селект, который нужно сделать активным.
   */
  toggle(select: SelectComponent) {
    if (this.activeSelect && this.activeSelect !== select) {
      this.activeSelect.close();
    }
    this.register(select);
  }
}
