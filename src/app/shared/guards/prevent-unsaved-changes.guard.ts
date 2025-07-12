import { Injectable } from '@angular/core';
import { UserPage } from '../../pages/users/user.page';

@Injectable()
export class PreventUnsavedChanges {
  canDeactivate(component: UserPage) {
    if (component.editForm.dirty) {
      return confirm(
        'Are you sure you want to continue?  Any unsaved changes will be lost'
      );
    }
    return true;
  }
}
