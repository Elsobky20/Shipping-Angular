import { Routes } from '@angular/router';

import { DashboardComponent } from './Dashboard/dashboard.component';
import { NotFoundComponent } from './NotFound/not-found.component';
import { LoginComponent } from './Login/components/login/login.component';

// City
import { CitiesComponent } from './City/components/cities/cities.component';
import { CityFormComponent } from './City/components/city-form/city-form.component';
import { WieghPriceFormComponent } from './WeightPricing/components/wiegh-price-form/wiegh-price-form.component';

// Employees
import { EmployeeListComponent } from './employees/components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './employees/components/employee-form/employee-form.component';

// Shipping Types
import { ShippingTypeListComponent } from './ShippingType/components/shipping-type-list/shipping-type-list.component';
import { ShippingTypeFormComponent } from './ShippingType/components/shipping-type-form/shipping-type-form.component';

// Roles
import { RoleListComponent } from './Roles/components/role-list/role-list.component'; 
import { AddRoleComponent } from './Roles/components/add-role/add-role.component';

// Permissions
import { PermissionFormComponent } from './permissions/componnent/permissions-form/permission-form.component';
import { PermissionListComponent } from './permissions/componnent/permissions-list/permission-list.component';

// Role-Permissions
import { FormComponent } from './role-permissions/form/form.component';
import { RolePermissionListComponent } from './role-permissions/list/list.component';

// Merchant
import { MerchantsComponent } from './Merchant/components/merchants/merchants.component';
import { MerchantFormComponent } from './Merchant/components/merchant-form/merchant-form.component';
import { MerchantDetailsComponent } from './Merchant/components/merchant-details/merchant-details.component';

// Orders
import { OrdersComponent } from './Orders/components/orders/orders.component';
import { OrderDetailsComponent } from './Orders/components/order-details/order-details.component';
import { OrderFormComponent } from './Orders/components/order-form/order-form.component';

// Delivery
import { AllDeliveryComponent } from './Delivery/components/all-delivery/all-delivery.component';
import { AddDeliveryComponent } from './Delivery/components/add-delivery/add-delivery.component';

// Branch
import { BranchesComponent } from './Branch/components/branches/branches.component';

// Setting
import { SettingComponent } from './Setting/components/setting/setting.component';
import { SettingFormComponent } from './Setting/components/setting-form/setting-form/setting-form.component';

import { BranchFormComponent } from './Branch/components/branch-form/branch-form.component';
import { ProfileComponent } from './Profile/components/profile/profile.component';
import { UserOrderComponent } from './UserOrder/components/user-order/user-order.component';
import { GovernmentListComponent } from './governments/components/list-government/government-list.component';
import { GovernmentFormComponent } from './governments/components/form-government/government-form.component';

export const routes: Routes = [

  // Login & Dashboard
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },

  // City
  { path: 'city', component: CitiesComponent },
  { path: 'city/:id', component: CityFormComponent },
  
  { path: 'weight', component: WieghPriceFormComponent },

  // Employees
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/add', component: EmployeeFormComponent },
  { path: 'employees/edit/:id', component: EmployeeFormComponent },

  // Shipping Types
  { path: 'shipping-types', component: ShippingTypeListComponent },
  { path: 'shipping-types/add', component: ShippingTypeFormComponent },
  { path: 'shipping-types/edit/:id', component: ShippingTypeFormComponent },

  // Roles
  { path: 'Roles', component: RoleListComponent },
  { path: 'Roles/add', component: AddRoleComponent },
  { path: 'Roles/edit/:id', component: AddRoleComponent },

  // Permissions
  { path: 'permissions', component: PermissionListComponent },
  { path: 'permissions/add', component: PermissionFormComponent },
  { path: 'permissions/edit/:id', component: PermissionFormComponent },

  // Role-Permissions
  { path: 'role-permissions', component: RolePermissionListComponent },
  { path: 'role-permissions/:roleId/:permissionId', component: FormComponent },

  // Merchant
  { path: 'merchant', component: MerchantsComponent },
  { path: 'merchant/:id', component: MerchantDetailsComponent },
  { path: 'merchant/:id/edit', component: MerchantFormComponent },

  // Orders
  {path: 'order', component: OrdersComponent},
  {path: 'order/:id', component: OrderDetailsComponent},
  {path: 'order/:id/edit', component: OrderFormComponent},

  // Delivery
  { path: 'deliveries', component: AllDeliveryComponent },
  { path: 'delivery/add', component: AddDeliveryComponent },
  { path: 'delivery/edit/:id', component: AddDeliveryComponent },
  {path: 'delivery/details/:id', component: AddDeliveryComponent},

  {path:'profile',component:ProfileComponent},
  // Branch
  { path: 'branch', component: BranchesComponent },
  { path: 'branch/add', component: BranchFormComponent },
  { path: 'branch/:id', component: BranchFormComponent },
  // Setting
  { path: 'setting', component: SettingComponent },
  { path: 'setting/add', component: SettingFormComponent },
  { path: 'seting/edit/:id', component: SettingFormComponent }, // تم الإبقاء على "seting" زي ما هو
  //Government
  {path:'government', component: GovernmentListComponent},
  {path:'government/add', component: GovernmentFormComponent},
  {path:'government/edit/:id',component:GovernmentFormComponent},
  // Not Found
  { path: '**', component: NotFoundComponent }
];
