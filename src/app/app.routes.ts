import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'slides',
    loadChildren: () =>
      import('./pages/slides/slides.module').then((m) => m.SlidesPageModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./pages/about/about.module').then((m) => m.AboutPageModule),
  },
  {
    path: 'qr',
    loadChildren: () =>
      import('./pages/qr/qr.module').then((m) => m.QrPageModule),
  },
  {
    path: 'insurers',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/insurers/insurers.module').then(
            (m) => m.InsurersPageModule
          ),
      },
      {
        path: ':insurerId',
        loadChildren: () =>
          import('./pages/insurers/insurer-detail/insurer-detail.module').then(
            (m) => m.InsurerDetailPageModule
          ),
      },
    ],
  },
  {
    path: 'device',
    loadChildren: () =>
      import('./pages/device-info/device-info.module').then(
        (m) => m.DeviceInfoPageModule
      ),
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'user',
        loadChildren: () =>
          import('./pages/users/user.module').then((m) => m.UserPageModule),
      },
      {
        path: 'customers/:id',
        loadChildren: () =>
          import('./pages/contractslist/contractslist.module').then(
            (m) => m.ContractsListPageModule
          ),
      },
      /* {
        path: 'map',
        loadChildren: () =>
          import('./pages/map/map.module').then((m) => m.MapPageModule),
      }, */
    ],
  },
  {
    path: 'customerslocalcopy',
    loadChildren: () =>
      import('./pages/contractslist/contractslist.module').then(
        (m) => m.ContractsListPageModule
      ),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./pages/contact/contact.module').then((m) => m.ContactPageModule),
  },
];
