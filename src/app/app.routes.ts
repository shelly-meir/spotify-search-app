import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AlbumDetailsComponent } from './components/album-details/album-details.component';
import { RegistrationComponent } from './components/registration/registration.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'album/:id',
    component: AlbumDetailsComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
