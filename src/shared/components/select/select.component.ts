import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectService } from '../../services/select.service';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  /** Имя селекта. */
  @Input() title!: string;
  /** Список пунктов селекта. */
  @Input() items: string[] = [];
  /** Флаг для отображения сортированы/не сортированы. */
  @Input() isSortable = false;
  /** Выбранные пункты селекта. */
  @Output() selectionChange = new EventEmitter<string[]>();
  /** Вариант сортировки, сначала новые/сначала старые. */
  @Output() sortChange = new EventEmitter<'asc' | 'desc'>();

  /**  Флаг для определения открыт/закрыт селект. */
  protected isOpen = false;
  /** Список выбранных элементов. */
  protected selectedItems: string[] = [];
  protected sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private readonly selectService: SelectService) {}

  /** Функция для обработчика клика вне селекта, чтобы он закрывался. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isOpen && !(event.target as HTMLElement).closest('.filter')) {
      this.close();
    }
  }

  protected toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.selectService.toggle(this);
    } else {
      this.selectService.unregister(this);
    }
  }

  close() {
    this.isOpen = false;
    this.selectService.unregister(this);
  }

  protected onItemSelect(item: string) {
    const index = this.selectedItems.indexOf(item);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
    this.selectionChange.emit(this.selectedItems);
  }

  protected onSortChange(order: 'asc' | 'desc') {
    this.sortOrder = order;
    this.sortChange.emit(order);
  }
}
