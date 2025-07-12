import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Platform, IonicModule } from '@ionic/angular';

import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { VsoftContract } from '../../../shared/models/vsoftContract';
import { SelectOptions } from '../../../shared/models/selectOptions';

import { Router } from '@angular/router';
import { Insurer } from 'src/app/shared/models/insurer';
import { InsurerService } from 'src/app/shared/services/insurer.service';

import { Clipboard } from '@capacitor/clipboard';
import { Toast } from '@capacitor/toast';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-contractdetail',
    templateUrl: './contractdetail.component.html',
    styleUrls: ['./contractdetail.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NgIf,
        TranslateModule,
    ],
})
export class ContractdetailComponent implements OnInit {
  @Input()
  selectedContract!: VsoftContract;
  @Input() isManual = false; //: boolean;
  @Input() localCopy = false; //: boolean;

  isAndroid: boolean = false;
  isTablet: boolean = false;
  isDesktop: boolean = false;
  isIphone: boolean = false;
  hasPhoneFunction: boolean = false;

  loadedInsurer: any;
  insurerImage!: string;
  defaultSelected!: string;
  policie!: string;

  closeForMap = true;

  VS97S: SelectOptions[] = []; // Actioncode

  constructor(
    // private ionicStorage: Storage,
    private platform: Platform,
    private insurerService: InsurerService,
    private modalCtrl: ModalController,
    private ts: TranslateService,
    private router: Router
  ) {}

  ionViewDidLoad() {}

  refreshLanguage() {
    this.ts.get('selectOptions.VS97').subscribe((res: SelectOptions[]) => {
      this.VS97S = res;
    });
  }

  ngOnInit() {
    this.isTablet = this.platform.is('tablet');
    this.isAndroid = this.platform.is('android');
    this.isDesktop = this.platform.is('desktop');
    this.isIphone = this.platform.is('iphone');
    this.hasPhoneFunction = false;

    if (this.isIphone) {
      this.hasPhoneFunction = true;
    } else {
      if (this.isAndroid) {
        if (!this.isTablet) {
          this.hasPhoneFunction = true;
        }
      } else {
        if (this.isDesktop) {
          this.hasPhoneFunction = true;
        }
      }
    }

    this.refreshLanguage();
    this.loadedInsurer = this.insurerService.getInsurer(
      'be_' + this.selectedContract.a010
    );

    this.insurerImage =
      'assets/images/companies/be_' + this.selectedContract.a010 + '.png';
  }

  onCancel(forMap: boolean) {
    if (!forMap) {
      this.modalCtrl.dismiss(null, 'cancel');
    } else {
      this.modalCtrl.dismiss(null, 'cancelForMap');
    }
  }

  onClipTest(comType: string) {
    console.log('onClipTest', comType);
    
    const writeToClipboard = async () => {
      await Clipboard.write({
        string: comType,
      });
    };
  }

  onCall(comNumber: string) {
    // this.commingFrom('onCall');    
    const showHelloToast = async () => {
      await Toast.show({
        text: 'comNumber: ' + comNumber,
      });
    };
    window.open('tel:' + comNumber, '_system');
  }

  onMail(mailAddress: string) {
    // this.commingFrom('onMail');
    if (this.loadedInsurer.id === 'be_0145') {
      this.policie = '$' + this.selectedContract.id + '$';
    } else {
      this.policie = this.selectedContract.id;
    }

    const subject = '?subject=' + this.loadedInsurer.name + ' ' + this.policie;
    const message = 'Gelieve';

    window.open(
      'mailto:' + mailAddress + subject + '&body=' + message,
      '_system'
    );
  }

  commingFrom(me: string) {
    /* // console.log(me, this.selectedContract);
    this.ionicStorage.set('LAST_CONTRACT', this.selectedContract); */
  }

  loadMapPage() {
    this.router.navigate(['map']);
  }
}
