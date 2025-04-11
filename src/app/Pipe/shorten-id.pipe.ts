import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenId' // هذا اسم الـ Pipe الذي سنستخدمه في القالب
})
export class ShortenIdPipe implements PipeTransform {
  transform(value: string, length: number = 8): string {
    if (!value) return ''; // إذا كانت القيمة فارغة
    // إذا كان النص أطول من الطلب، نقطعها ونضيف ...
    return value.length > length ? `${value.substring(0, length)}...` : value;
  }
}