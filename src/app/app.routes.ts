import { Routes } from '@angular/router';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { CitiesComponent } from './City/components/cities/cities.component';
import { NotFoundComponent } from './NotFound/not-found.component';
import { CityFormComponent } from './City/components/city-form/city-form.component';
import { EmployeeListComponent } from '../app/employees/components/employee-list/employee-list.component';
import { EmployeeFormComponent } from '../app/employees/components/employee-form/employee-form.component';
import { ShippingTypeListComponent } from '../app/ShippingType/components/shipping-type-list/shipping-type-list.component';
import { ShippingTypeFormComponent } from '../app/ShippingType/components/shipping-type-form/shipping-type-form.component'; 

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' }, 
  { path: 'dashboard', component: DashboardComponent },
  { path: 'city', component: CitiesComponent },
  { path: 'city/:id', component: CityFormComponent },
  { path: 'employees', component: EmployeeListComponent }, 
  { path: 'employees/add', component: EmployeeFormComponent }, 
  { path: 'employees/edit/:id', component: EmployeeFormComponent }, 
  { path: 'shipping-types', component: ShippingTypeListComponent },
  { path: 'shipping-types/add', component: ShippingTypeFormComponent },
  { path: 'shipping-types/edit/:id', component: ShippingTypeFormComponent },
  { path: '**', component: NotFoundComponent }
];