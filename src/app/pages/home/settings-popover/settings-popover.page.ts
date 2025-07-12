import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';
import { Component, OnInit } from '@angular/core';
import { PopoverController, IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Toast } from '@capacitor/toast';
import { Language } from 'src/app/shared/models/language';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';


@Component({
    selector: 'app-settings-popover',
    templateUrl: './settings-popover.page.html',
    styleUrls: ['./settings-popover.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule,
        NgFor,
        TranslateModule,
    ],
})
export class SettingsPopoverPage implements OnInit {
  languages!: Language[];
  selected = '';

  togglemanualONLY!: boolean;
  toggleShowCanceled!: boolean;
  toggleServerLive!: boolean;
lng: any;

  constructor(
    private popoverCtrl: PopoverController,
    private ls: LanguageService,
    private ts: TranslateService,
    private ss: StorageService
  ) {}

  async ngOnInit() {
    this.languages = this.ls.getLanguages();
    this.selected = this.ls.selected;

    const value1 = await this.ss.get('MANUALONLY');
    if (value1 === 'true') {
      this.togglemanualONLY = true;
    } else {
      this.togglemanualONLY = false;
    }

    const value2 = await this.ss.get('SHOWCANCELED');
    if (value2 === 'true') {
      this.toggleShowCanceled = true;
    } else {
      this.toggleShowCanceled = false;
    }

    const value3 = await this.ss.get('SERVERLIVE');
    if (value3 === 'true') {
      this.toggleServerLive = true;
    } else {
      this.toggleServerLive = false;
    }

    this.ts.get('SETTINGS.MessageAlert').subscribe((value) => {
      const showMessage = async () => {
        await Toast.show({
          text: value,
          duration: 'long',
        });
      };
      showMessage();
    });
  }

  select(lng: string) {
    this.ls.setLanguage(lng);
    this.saveSettings();
    this.popoverCtrl.dismiss();
    this.selected = this.ls.selected;
    // console.log(this.ls.selected);
  }

  saveSettings() {
    if (this.togglemanualONLY) {
      this.ss.set('MANUALONLY', 'true');
      this.toggleServerLive = false;
    } else {
      this.ss.set('MANUALONLY', 'false');
    }

    if (this.toggleShowCanceled) {
      this.ss.set('SHOWCANCELED', 'true');
    } else {
      this.ss.set('SHOWCANCELED', 'false');
    }

    if (this.toggleServerLive) {
      this.ss.set('SERVERLIVE', 'true');
    } else {
      this.ss.set('SERVERLIVE', 'false');
    }
  }
}
