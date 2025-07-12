import { Insurer } from '../../shared/models/insurer';
import { InsurerService } from '../../shared/services/insurer.service';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-insurers',
    templateUrl: './insurers.page.html',
    styleUrls: ['./insurers.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NgFor,
        RouterLink,
    ],
})
export class InsurersPage implements OnInit {
  insurers: Insurer[] = [];

  constructor(private insurerService: InsurerService) {}

  ngOnInit() {
    this.insurers = this.insurerService.getAllInsurers();
  }
}
