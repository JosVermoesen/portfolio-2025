import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ContractdetailComponent } from './contractdetail/contractdetail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, IonItemSliding, NavController, AlertController, IonicModule } from '@ionic/angular';

import { Subscription } from 'rxjs';

import { VsoftContract } from '../../shared/models/vsoftContract';
import { VsoftCustomer } from '../../shared/models/vsoftCustomer';

// import { ContractEditComponent } from './contractedit/contractedit.component';
// import { ContractNewComponent } from './contractnew/contractnew.component';
import { VsoftCustomerService } from '../../shared/services/vsoftcustomer.service';
import { User } from '../../shared/models/user';
import { AccountService } from 'src/app/shared/services/account.service';
import { take } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { NgIf, NgFor, NgStyle } from '@angular/common';

@Component({
    selector: 'app-contractslist',
    templateUrl: './contractslist.page.html',
    styleUrls: ['./contractslist.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NgIf,
        NgFor,
        NgStyle,
        TranslateModule,
    ],
})
export class ContractsListPage implements OnInit, OnDestroy {
  customer!: VsoftCustomer;
  activeUser!: User;
  hasClientNumber!: boolean;

  servercontracts: VsoftContract[] = [];
  // manualcontracts!: VsoftContract[];
  // manualContractToEdit!: VsoftContract;
  // private manualcontractsSub: Subscription;

  isLoading = this.aService.getLoading();

  myDocuments: string | undefined;
  hasDocumentsDef = false;

  toggleShowCanceled = false;
  togglemanualONLY = false;
  toggleServerLive = false;

  isLocalCopy = false;

  constructor(
    private vsoftCustomerService: VsoftCustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    // private mcService: ManualContractService,
    private alertCtrl: AlertController,
    private ts: TranslateService,
    private ss: StorageService,
    private aService: AccountService
  ) {}

  async ngOnInit() {
    const value1 = await this.ss.get('SHOWCANCELED');
    if (value1 === 'true') {
      this.toggleShowCanceled = true;
    } else {
      this.toggleShowCanceled = false;
    }

    const value2 = await this.ss.get('MANUALONLY');
    if (value2 === 'true') {
      this.togglemanualONLY = true;
      this.toggleServerLive = false;
    } else {
      this.togglemanualONLY = false;
      const value3 = await this.ss.get('SERVERLIVE');
      if (value1 === 'true') {
        this.toggleServerLive = true;
      } else {
        this.toggleServerLive = false;
      }
    }
    this.route.params.subscribe((result: any) => {
      // console.log(result.id );
      this.loadServerData(result.id);
    });
  }

  loadServerData(customerId: string) {
    // console.log('start get: ', customerId);
    this.vsoftCustomerService
      .getVsoftCustomer(customerId)
      .subscribe((result: VsoftCustomer) => {
        this.customer = result;
        /* console.log(this.customer); */
        this.servercontracts = this.customer.vsoftContracts || [];
        this.myDocuments = this.customer.v254;
        if (this.myDocuments) {
          this.hasDocumentsDef = true;
        }
        //console.log('ready');
        this.isLoading = false;
        this.aService.setLoading(this.isLoading);
      });
  }

  ionViewWillEnter() {
    /* this.manualcontractsSub = this.mcService.manualContracts.subscribe(
      (mcontracts) => {
        this.manualcontracts = mcontracts;
        const myJSON = JSON.stringify(this.manualcontracts);
        this.ionicStorage.set('MANUALCONTRACTS', myJSON);
      }
    ); */
  }

  ngOnDestroy() {
    /* if (this.manualcontractsSub) {
      this.manualcontractsSub.unsubscribe();
    } */
  }

  getColor(vs97: string | undefined) {
    switch (vs97) {
      default:
        return 'green'; // running
      case '7':
        return 'blue'; // suspended
      case '8':
        return 'blue'; // various
      case '9':
        return 'red'; // canceled
    }
  }

  showServerContractDetail(i: number) {
    /* console.log(this.servercontracts[i]);
    console.log('isLocalCopy: ', this.isLocalCopy); */
    this.modalCtrl
      .create({
        component: ContractdetailComponent,
        componentProps: {
          selectedContract: this.servercontracts[i],
          isManual: false,
          localCopy: this.isLocalCopy,
        },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {});
  }

  showManualContractDetail(i: number) {
    /* this.modalCtrl
      .create({
        component: ContractdetailComponent,
        componentProps: {
          selectedContract: this.manualcontracts[i],
          isManual: true,
          localCopy: this.isLocalCopy,
        },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData);
      }); */
  }

  onNewManualContract() {
    /* const mcIndex = this.manualcontracts.length;
    this.modalCtrl
      .create({
        component: ContractNewComponent,
        componentProps: {
          lastId: mcIndex,
        },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {}); */
  }

  onEditManualContract(mcIndex: number, slidingEl: IonItemSliding) {
    slidingEl.close();

    /* this.modalCtrl
      .create({
        component: ContractEditComponent,
        componentProps: {
          selectedContract: this.manualcontracts[mcIndex],
        },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'updated') {
          this.manualcontracts[mcIndex] = resultData.data;
          const myJSON = JSON.stringify(this.manualcontracts);
          this.ionicStorage.set('MANUALCONTRACTS', myJSON);
        }
      }); */
  }

  onDeleteManualContract(mcId: number, slidingEl: IonItemSliding) {
    slidingEl.close();
  }

  async saveLocalCopy() {
    /* const alert = await this.alertCtrl.create({
      header: this.ts.instant('ALERT.titleSaveCopy'),
      message:
        this.ts.instant('ALERT.msgSaveCopy') +
        ' <strong>' +
        this.ts.instant('ALERT.msgAreYouSure') +
        '</strong>',
      buttons: [
        {
          text: this.ts.instant('ALERT.btnCancelText'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: this.ts.instant('ALERT.btnOkText'),
          handler: () => {
            const myJSON = JSON.stringify(this.customer);
            this.ionicStorage.set('SERVERCOPY', myJSON);

            const dateOfCopy = new Date();
            this.ionicStorage.set('DATEOFCOPY', dateOfCopy.toISOString());
          },
        },
      ],
    });

    await alert.present(); */
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: this.ts.instant('ALERT.titleRefresh'),
      message:
        this.ts.instant('ALERT.msgRefresh') +
        ' <strong>' +
        this.ts.instant('ALERT.msgAreYouSure') +
        '</strong>',
      buttons: [
        {
          text: this.ts.instant('ALERT.btnCancelText'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: this.ts.instant('ALERT.btnOkText'),
          handler: () => {
            window.location.reload();
          },
        },
      ],
    });

    await alert.present();
  }
}
