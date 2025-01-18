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
  @Input() title!: string;
  @Input() items: string[] = [];
  @Input() isSortable = false;
  @Output() selectionChange = new EventEmitter<string[]>();
  @Output() sortChange = new EventEmitter<'asc' | 'desc'>();

  isOpen = false;
  selectedItems: string[] = [];
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private selectService: SelectService) {}

  toggleDropdown() {
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

  onItemSelect(item: string) {
    const index = this.selectedItems.indexOf(item);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
    this.selectionChange.emit(this.selectedItems);
  }

  onSortChange(order: 'asc' | 'desc') {
    this.sortOrder = order;
    this.sortChange.emit(order);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isOpen && !(event.target as HTMLElement).closest('.filter')) {
      this.close();
    }
  }
}
