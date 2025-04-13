import { Routes } from '@angular/router';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { CitiesComponent } from './City/components/cities/cities.component';
import { NotFoundComponent } from './NotFound/not-found.component';
import { CityFormComponent } from './City/components/city-form/city-form.component';

export const routes: Routes = [
  {path: '', redirectTo: 'city', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'city', component: CitiesComponent},
  {path: 'city/:id', component: CityFormComponent},
  {path: '**', component: NotFoundComponent}
];