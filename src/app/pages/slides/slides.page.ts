import { Component, OnInit } from '@angular/core';
import Swiper, { SwiperOptions, Pagination } from 'swiper';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-slides',
    templateUrl: './slides.page.html',
    styleUrls: ['./slides.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        SwiperModule,
        RouterLink,
        TranslateModule,
    ],
})
export class SlidesPage implements OnInit {
  public swiperConfig: SwiperOptions = {
    pagination: true,
   };

  constructor() { }

  ngOnInit() {
    Swiper.use([Pagination]);
  }

}
