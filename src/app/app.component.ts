import { Component, inject, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { User } from './shared/models/user';
import { AccountService } from './shared/services/account.service';
import { LanguageService } from './shared/services/language.service';
import { CookieService } from 'ngx-cookie-service';
import { RouterLink } from '@angular/router';
import { environment } from '../environments/environment';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  checkmarkOutline,
  chevronForwardOutline,
  ellipsisVerticalOutline,
  gitNetworkOutline,
  helpOutline,
  homeOutline,
  listOutline,
  laptopOutline,
  scanOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonicModule, RouterLink, TranslateModule],
})
export class AppComponent implements OnInit {
  cookieService = inject(CookieService);
  ls = inject(LanguageService);
  ts = inject(TranslateService);
  alertCtrl = inject(AlertController);
  aService = inject(AccountService);

  expire!: number;
  aUser: User | undefined;
  user!: User;
  memberLoading = false;

  constructor() {
    addIcons({
      'close-outline': 'close-outline',
      'camera-outline': cameraOutline,
      'checkmark-outline': checkmarkOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'home-outline': homeOutline,
      'list-outline': listOutline,
      'scan-outline': scanOutline,
      'laptop-outline': laptopOutline,
      'git-network-outline': gitNetworkOutline,
      'help-outline': helpOutline,
      'ellipsis-vertical-outline': ellipsisVerticalOutline,
    });
  }

  ngOnInit(): void {
    this.ls.setInitialAppLanguage();
    this.setCurrentUser();
  }

  setCurrentUser() {
    const aUser = this.cookieService.get('v_user');
    // All cookies are lost on localhost after closing the browser or
    // refreshing the page, so we use a fake user for development

    if (aUser != '') {
      this.user = JSON.parse(aUser);
      this.aService.setCurrentUser(this.user);
      this.aService.currentPhotoUrl.subscribe();
    } else {
      this.user = environment.fakeUser;
      this.aService.setCurrentUser(this.user);
      this.aService.currentPhotoUrl.subscribe();
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: this.ts.instant('ALERT.titleLogout'),
      message:
        this.ts.instant('ALERT.msgLogout') +
        ' ' +
        this.ts.instant('ALERT.msgAreYouSure') +
        '?',
      buttons: [
        {
          text: this.ts.instant('ALERT.btnCancelText'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (doNothing) => {},
        },
        {
          text: this.ts.instant('ALERT.btnOkText'),
          handler: () => {
            this.aService.logout();
          },
        },
      ],
    });
    await alert.present();
  }
}
