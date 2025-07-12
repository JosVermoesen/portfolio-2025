import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';


import { HasRoleDirective } from '../../shared/directives/hasRole.directive';
import { UserPage } from './user.page';

const routes: Routes = [
  {
    path: '',
    component: UserPage
  }
];

@NgModule({
    imports: [
    CommonModule,
    TranslateModule,
    IonicModule,
    RouterModule.forChild(routes),
    FormsModule,
    UserPage, HasRoleDirective
]
})
export class UserPageModule {}
