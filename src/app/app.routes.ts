import { Routes } from '@angular/router';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { CitiesComponent } from './City/components/cities/cities.component';
import { NotFoundComponent } from './NotFound/not-found.component';
import { CityFormComponent } from './City/components/city-form/city-form.component';
import { AllDeliveryComponent } from './Delivery/components/all-delivery/all-delivery.component';
import { AddDeliveryComponent } from './Delivery/components/add-delivery/add-delivery.component';
import { LoginComponent } from './Login/components/login/login.component';
import { MerchantsComponent } from './Merchant/components/merchants/merchants.component';
import { MerchantFormComponent } from './Merchant/components/merchant-form/merchant-form.component';
import { MerchantDetailsComponent } from './Merchant/components/merchant-details/merchant-details.component';

export const routes: Routes = [
  {path: '', redirectTo: 'merchant', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'city', component: CitiesComponent},
  {path: 'city/:id', component: CityFormComponent},
  {path: 'merchant', component: MerchantsComponent},
  {path: 'merchant/:id', component: MerchantDetailsComponent},
  {path: 'merchant/:id/edit', component: MerchantFormComponent},
  { path: 'deliveries', component: AllDeliveryComponent },
  { path: 'delivery/add', component: AddDeliveryComponent },
  { path: 'delivery/edit/:id', component: AddDeliveryComponent },
  {path: 'login', component: LoginComponent},
  {path: '**', component: NotFoundComponent}
];
