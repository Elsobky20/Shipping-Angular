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
import { OrdersComponent } from './Orders/components/orders/orders.component';
import { EmployeeListComponent } from './employees/components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './employees/components/employee-form/employee-form.component';
import { RoleListComponent } from './Roles/components/role-list/role-list.component';
import { AddRoleComponent } from './Roles/components/add-role/add-role.component';
import { OrderDetailsComponent } from './Orders/components/order-details/order-details.component';
import { OrderFormComponent } from './Orders/components/order-form/order-form.component';

export const routes: Routes = [
  {path: '', redirectTo: 'order', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'city', component: CitiesComponent},
  {path: 'city/:id', component: CityFormComponent},
  {path: 'merchant', component: MerchantsComponent},
  {path: 'merchant/:id', component: MerchantDetailsComponent},
  {path: 'order', component: OrdersComponent},
  {path: 'order/:id', component: OrderDetailsComponent},
  {path: 'order/:id/edit', component: OrderFormComponent},
  {path: 'merchant/:id/edit', component: MerchantFormComponent},
  {path: 'deliveries', component: AllDeliveryComponent },
  {path: 'delivery/add', component: AddDeliveryComponent },
  {path: 'delivery/edit/:id', component: AddDeliveryComponent },
  {path: 'delivery/details/:id', component: AddDeliveryComponent},
  {path: 'login', component: LoginComponent},
  {path: 'employee', component: EmployeeListComponent},
  {path: 'employee/add', component: EmployeeFormComponent},
  {path:'role',component:RoleListComponent},
  {path:'role/add',component:AddRoleComponent},
  {path: '**', component: NotFoundComponent}
];
