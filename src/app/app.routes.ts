import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'album/:id',
    loadComponent: () => import('./components/album-details/album-details.component').then(m => m.AlbumDetailsComponent),
  },
  {
    path: 'registration',
    loadComponent: () => import('./components/registration/registration.component').then(m => m.RegistrationComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
