import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { Toast } from '@capacitor/toast';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  aService = inject(AccountService);

  canActivate(): Observable<boolean> {
    return this.aService.currentUser$.pipe(
      map((user) => {
        if (user) return true;
        else {
          const showFailed = async () => {
            await Toast.show({
              text: 'You need to be signed in!',
            });
          };
          showFailed();
          return false;
        }
      })
    );
  }
}
