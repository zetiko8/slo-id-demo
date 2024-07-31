import { Route } from '@angular/router';
import { HomeView } from './views/home/home.view';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeView,
  },
];
