import { Routes } from '@angular/router';
import { DashboardComponent } from './Dashboard/dashboard.component';
import { CitiesComponent } from './City/components/cities/cities.component';
import { NotFoundComponent } from './NotFound/not-found.component';
import { CityFormComponent } from './City/components/city-form/city-form.component';
import { EmployeeListComponent } from '../app/employees/components/employee-list/employee-list.component';
import { EmployeeFormComponent } from '../app/employees/components/employee-form/employee-form.component';
import { ShippingTypeListComponent } from '../app/ShippingType/components/shipping-type-list/shipping-type-list.component';
import { ShippingTypeFormComponent } from '../app/ShippingType/components/shipping-type-form/shipping-type-form.component';
import { RoleListComponent } from '../app/Roles/components/role-list/role-list.component'; 
import { AddRoleComponent } from '../app/Roles/components/add-role/add-role.component';
import { PermissionFormComponent } from './permissions/componnent/permissions-form/permission-form.component';
import { PermissionListComponent } from './permissions/componnent/permissions-list/permission-list.component';
import { FormComponent } from './role-permissions/form/form.component';
import { RolePermissionListComponent } from './role-permissions/list/list.component';
import { AllDeliveryComponent } from './Delivery/components/all-delivery/all-delivery.component';
import { AddDeliveryComponent } from './Delivery/components/add-delivery/add-delivery.component';
import { LoginComponent } from './Login/components/login/login.component';
import { MerchantsComponent } from './Merchant/components/merchants/merchants.component';
import { MerchantFormComponent } from './Merchant/components/merchant-form/merchant-form.component';
import { MerchantDetailsComponent } from './Merchant/components/merchant-details/merchant-details.component';

export 

const routes: Routes = [
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
  { path: 'Roles', component: RoleListComponent },
  { path: 'Roles/add', component: AddRoleComponent },
  { path: 'Roles/edit/:id', component: AddRoleComponent },
  { path: 'permissions/add', component: PermissionFormComponent },
  { path: 'permissions/edit/:id', component: PermissionFormComponent },
  { path: 'permissions', component: PermissionListComponent },
  { path: 'role-permissions', component: RolePermissionListComponent },
  { path: 'role-permissions/:roleId/:permissionId', component: FormComponent },
  { path: 'merchant', component: MerchantsComponent },
  { path: 'merchant/:id', component: MerchantDetailsComponent },
  { path: 'merchant/:id/edit', component: MerchantFormComponent },
  { path: 'deliveries', component: AllDeliveryComponent },
  { path: 'delivery/add', component: AddDeliveryComponent },
  { path: 'delivery/edit/:id', component: AddDeliveryComponent },
  { path: 'delivery/details/:id', component: AddDeliveryComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent }
];
