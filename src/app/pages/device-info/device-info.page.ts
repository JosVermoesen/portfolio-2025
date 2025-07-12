import { Component, OnInit } from '@angular/core';
import { Device } from '@capacitor/device';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-device-info',
    templateUrl: './device-info.page.html',
    styleUrls: ['./device-info.page.scss'],
    standalone: true,
    imports: [IonicModule, TranslateModule],
})
export class DeviceInfoPage implements OnInit {
  osVersion!: string | undefined;
  isCharging: boolean | undefined;

  constructor() {}

  async ngOnInit() {
    const deviceInfo = await Device.getInfo();
    this.osVersion = deviceInfo.osVersion;

    const batteryInfo = await Device.getBatteryInfo();
    this.isCharging = batteryInfo.isCharging;
  }
}
