import { SettingsPopoverPage } from './settings-popover/settings-popover.page';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  PopoverController,
  AlertController,
  Platform,
  NavController,
  IonicModule,
} from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { AccountService } from 'src/app/shared/services/account.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Browser } from '@capacitor/browser';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, AsyncPipe, TranslateModule],
})
export class HomePage implements OnInit {
  version: string = environment.version;

  isLoading = this.aService.getLoading();
  toggleServerLive = true;
  togglemanualONLY = false;

  dateOfCopy!: Date;

  constructor(
    private router: Router,
    private ts: TranslateService,
    private ss: StorageService,
    private navCtrl: NavController,
    public aService: AccountService,

    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private platform: Platform
  ) {}

  async ngOnInit() {
    // At first time use, set default settings
    const settingsFirst = await this.ss.get('SHOWCANCELED');
    if (!settingsFirst) {
      this.ss.set('SHOWCANCELED', 'false');
      this.ss.set('MANUALONLY', 'false');
      this.ss.set('SERVERLIVE', 'true');
    } else {
      const manual = await this.ss.get('MANUALONLY');
      if (manual === 'true') {
        this.togglemanualONLY = true;
        this.toggleServerLive = false;
      } else {
        this.togglemanualONLY = false;
        this.checkForLive();
      }
    }

    // At first time use, show intro page
    const introPreviouslyShown = await this.ss.get('INTROSHOWN');
    if (!introPreviouslyShown) {
      this.ss.set('INTROSHOWN', 'true');
      this.navCtrl.navigateForward('/intro');
    }
  }

  async openInvestorProfile() {
    /* await Browser.open({
      url: 'https://secure.brokertools.be/beleggersprofiel/?partnerid=0d6a6d64fc6jfze512e512d1s21g1879f5d5',
    }); */
  }

  async openWebSite() {
    await Browser.open({ url: 'https://rv.be/' });
  }

  async openWebSiteInSameWindow() {
    await Browser.open({
      url: 'https://rv.be',
      windowName: '_self', // This will open the URL in the current window/tab on the web
    });
  }

  async checkForLive() {
    const settingLive = await this.ss.get('SERVERLIVE');
    if (settingLive === 'true') {
      this.toggleServerLive = true;
    } else {
      const settingDate = await this.ss.get('DATEOFCOPY');
      if (!settingDate) {
        this.ss.set('SERVERLIVE', 'true');
        this.toggleServerLive = true;
      } else {
        this.dateOfCopy = new Date(settingDate);
        this.toggleServerLive = false;
      }
    }
  }

  async showAdvise() {
    const alert = await this.alertCtrl.create({
      header: this.ts.instant('ALERT.adviseTitle'),
      message:
        this.ts.instant('ALERT.loginAdvise') +
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
            this.openWebSiteInSameWindow();
          },
        },
      ],
    });
    await alert.present();
  }

  showMemberPage() {
    this.isLoading = true;
    this.aService.setLoading(this.isLoading);
    this.router.navigateByUrl('/user');
  }

  loadLocalData() {
    this.router.navigate(['/customerslocalcopy']);
  }

  async showAlert() {
    const alert = await this.alertCtrl.create({
      header: this.ts.instant('ALERT.header'),
      message: this.ts.instant('ALERT.msg'),
      buttons: ['OK'],
    });
    alert.present();
  }

  async openSettingsPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: SettingsPopoverPage,
      event: ev,
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();
    const settingManual = await this.ss.get('MANUALONLY');
    if (settingManual === 'true') {
      this.togglemanualONLY = true;
      this.toggleServerLive = false;
    } else {
      this.togglemanualONLY = false;
      this.checkForLive();
    }
  }

  ionViewWillEnter() {
    // this.mc.loadManualContracts();
    this.isLoading = false;
    this.aService.setLoading(this.isLoading);
    // console.log('ionViewWillEnter event fired works');
  }
}
