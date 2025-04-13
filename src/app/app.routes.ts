import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employees/components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './employees/components/employee-form/employee-form.component'; // لو عندك الكومبوننت دي

export const routes: Routes = [
    { path: 'employees', component: EmployeeListComponent },
    { path: 'employees/add', component: EmployeeFormComponent },
    { path: 'employees/edit/:id', component: EmployeeFormComponent },
    { path: '', redirectTo: '/employees', pathMatch: 'full' }
  ];