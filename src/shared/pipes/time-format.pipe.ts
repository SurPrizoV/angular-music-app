import { Pipe, PipeTransform } from '@angular/core';

/**
 * @description
 * Pipe для форматирования времени в формате "MM:SS" (минуты:секунды).
 *
 * @usageNotes
 * Используется для преобразования времени в секундах в строку формата "MM:SS".
 * Если значение `null` или `undefined`, вернёт "00:00".
 */

@Pipe({
  name: 'timeFormatPipe',
  standalone: true,
})
export class TimeFormatPipe implements PipeTransform {
  /**
   * @param {number} value - Время в секундах.
   * @returns {string} Отформатированное время в виде строки "MM:SS".
   */
  transform(value: number): string {
    if (!value && value !== 0) return '00:00';

    const minutes = Math.floor(value / 60);
    const seconds = value % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
