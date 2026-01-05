import { Pipe, PipeTransform } from '@angular/core';
import { USER_ROLE } from '@/core/constants/common';
import { UserRole } from '@/core/types/user-response.type';
import { assertNever } from '@/core/utils/common.util';

@Pipe({
  name: 'userRole',
})
export class UserRolePipe implements PipeTransform {
  transform(value: UserRole): string {
    switch (value) {
      case 'admin':
        return USER_ROLE.admin;
      case 'general':
        return USER_ROLE.general;
      default:
        return assertNever(value);
    }
  }
}
