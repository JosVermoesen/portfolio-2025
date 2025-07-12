import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { environment } from 'src/environments/environment';
import { QrCodeComponent } from 'ng-qrcode';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [IonicModule, QrCodeComponent],
})
export class AboutPage implements OnInit {
  version = environment.version;

  qrElementType = 'url';
  qrUrl = 'https://github.com/JosVermoesen/portfolio-2025';

  qrResult: any;
  qrValue: any;

  ngOnInit() {
    const lf = '\n';
    this.qrResult =
      'BCD 001 1 SCT BBRUBEBB BV Centrum voor Medische Analyse BE38363177290172 EUR125.94 120/0349/46169';
    const serviceTagValue = 'BCD';
    const versionValue = '001';
    const charactersetValue = '1';
    const identificationValue = 'SCT';
    const bicValue = 'BHBLDEHHXXX';
    const nameValue = 'Franz Mustermänn';
    const ibanValue = 'DE71110220330123456789';
    const amountValue = 'EUR12.3';
    const purposeValue = 'GDDS';
    const referenceValue = 'RF18539007547034';
    const remittanceValue = '';
    const informationValue = '';

    const qrTMP =
      'BCD 001 1 SCT BHBLDEHHXXX Franz Mustermänn DE71110220330123456789 EUR12.3 GDDS RF18539007547034';

    this.qrValue =
      serviceTagValue +
      lf +
      versionValue +
      lf +
      charactersetValue +
      lf +
      identificationValue +
      lf +
      bicValue +
      lf +
      nameValue +
      lf +
      ibanValue +
      lf +
      amountValue +
      lf +
      purposeValue +
      lf +
      referenceValue +
      lf +
      remittanceValue +
      lf +
      informationValue;
  }

  async openGithubPage() {
    await Browser.open({ url: this.qrUrl });
  }

  ionViewWillEnter() {
    // console.log('ionViewWillEnter event fired works');
  }

  ionViewWillLeave() {
    // console.log('ionViewWillLeave event fired');
  }

  ionViewDidEnter() {
    // console.log('ionViewDidEnter event fired works');
  }

  ionViewDidLeave() {
    // console.log('ionViewDidLeave event fired');
  }
}
