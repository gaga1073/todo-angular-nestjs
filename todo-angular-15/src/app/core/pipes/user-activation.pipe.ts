import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userActivationPipe',
})
export class UserActivationPipe implements PipeTransform {
  transform(value: boolean): string {
    if (value) {
      return 'アクティブ';
    } else {
      return '停止';
    }
  }
}
