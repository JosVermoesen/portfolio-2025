import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, ReplaySubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';

import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

// import { Contactmail } from '../_models/contactmail';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  private isLoadingSource = new BehaviorSubject<boolean | null>(false);
  isLoading$ = this.isLoadingSource.asObservable();

  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  cookieService = inject(CookieService);

  constructor(
    private http: HttpClient,
    private router: Router // private ss: StorageService
  ) {}

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);

    // this.ss.set('USER', JSON.stringify(user));
    this.cookieService.set('v_user', JSON.stringify(user), {
      expires: 365,
      path: '/',
      domain: '.rv.be',
      secure: true,
      sameSite: 'Lax',
    });

    // console.log(user.roles);
    this.currentUserSource.next(user);
  }

  logout() {
    // this.ss.remove('USER');
    this.cookieService.delete('v_user', '/', '.rv.be', true, 'None');
    this.currentUserSource.next(null);

    this.router.navigateByUrl('/');
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  setLoading(isLoading: boolean) {
    this.isLoadingSource.next(isLoading);
  }

  getLoading() {
    return this.isLoadingSource.getValue();
  }

  /* contactmail(contactMail: Contactmail) {
    return this.http.post(this.baseUrl + 'contactmail', contactMail);
  } */
}
