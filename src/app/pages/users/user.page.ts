import { AlertController, IonicModule } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { User } from '../../shared/models/user';

import { AccountService } from '../../shared/services/account.service';
import { UserService } from '../../shared/services/user.service';

// import { StoragePhoto } from '../../shared/models/storagePhoto';
import { Toast } from '@capacitor/toast';
import { HasRoleDirective } from '../../shared/directives/hasRole.directive';
import { NgIf, DatePipe } from '@angular/common';

/* function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
} */

@Component({
    selector: 'app-user',
    templateUrl: './user.page.html',
    styleUrls: ['./user.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NgIf,
        HasRoleDirective,
        FormsModule,
        RouterLink,
        DatePipe,
        TranslateModule,
    ],
})
export class UserPage implements OnInit {
  // public photos: StoragePhoto[] = [];

  isLoading: boolean;
  
  editForm!: FormGroup;
  // @ViewChild('editForm')
  activeUser!: User;
  user!: User;
  imgData: any;

  searchClient!: string;
  hasClientNumber!: boolean;

  constructor(
    private route: ActivatedRoute,
    private aService: AccountService,
    private userService: UserService,
    private router: Router,

    private translate: TranslateService,
    private alertCtrl: AlertController
  ) {
    this.aService.currentUser$.pipe(take(1)).subscribe({
      next: (result) => {
        this.activeUser = result as User;
        // console.log(this.activeUser);
        if (this.activeUser.clientNumber === null) {
          // this.userParams = new UserParams(user);
          this.hasClientNumber = false;
        } else {
          this.hasClientNumber = true;
        }
      },
    });
    this.isLoading = true;
    this.aService.setLoading(this.isLoading);    
  }

  ionViewWillEnter() {
    this.isLoading = false;
    this.aService.setLoading(this.isLoading);
  }

  ionViewDidEnter() {
    if (!this.hasClientNumber) {
      // clientNumberWarning
      const msg =
        'Contracten via ons kantoor zijn spoedig raadpleegbaar. U kan deze melding uitschakelen indien U enkel met eigen inbreng wenst te werken';
      const showWarning = async () => {
        await Toast.show({
          text: msg,
          duration: 'long',
        });
      };
      showWarning();
    }
  }

  ngOnInit() {
    this.loadSavedPhotos();
    this.loadUserData();
  }

  loadUserData() {
    this.isLoading = true;
    this.aService.setLoading(this.isLoading);

    this.userService.getUser(this.activeUser.userName).subscribe(
      (result: User) => {
        this.user = result;
        this.isLoading = false;
        this.aService.setLoading(this.isLoading);
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
        this.aService.setLoading(this.isLoading);
      }
    );
  }

  onImagePicked(imageData: string | File) {
    /* let imageFile: any;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.imgData = imageFile;
    this.photos.unshift({
      data: imageData,
    });

    // Save all photos for later viewing
    this.ionicStorage.set('photos', this.photos);
    // console.log(this.imgData); */
  }

  loadClientData(clientId: string) {
    this.isLoading = true;
    this.aService.setLoading(this.isLoading);

    // console.log(clientId);
    this.router.navigate(['/customers', clientId]);
  }

  fakeClientNumber(clientId: string) {
    // console.log(this.searchClient);
    if (this.searchClient.length == 6) {
      this.isLoading = true;
      this.aService.setLoading(this.isLoading);
      this.router.navigate(['/customers', this.searchClient]);
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('ALERT.titlePageRefresh'),
      message:
        this.translate.instant('ALERT.msgPartOne') +
        ' <strong>' +
        this.translate.instant('ALERT.msgPartTwo') +
        '</strong>',
      buttons: [
        {
          text: this.translate.instant('ALERT.btnCancelText'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: this.translate.instant('ALERT.btnOkText'),
          handler: () => {
            window.location.reload();
          },
        },
      ],
    });

    await alert.present();
  }

  loadSavedPhotos() {
    /* this.ionicStorage.get('photos').then((photos) => {
      this.photos = photos || [];
    }); */
  }
}
