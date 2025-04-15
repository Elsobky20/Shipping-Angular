import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeFormComponent } from './employees/components/employee-form/employee-form.component';
import { RoleListComponent } from "./Roles/components/role-list/role-list.component";
import { LoginComponent } from './Login/components/login/login.component';
import { SideBarComponent } from './Layout/side-bar/side-bar.component';
import { CitiesComponent } from './City/components/cities/cities.component';
import { AllDeliveryComponent } from "./Delivery/components/all-delivery/all-delivery.component";
import { AddDeliveryComponent } from "./Delivery/components/add-delivery/add-delivery.component";
import { DashboardComponent } from "./Dashboard/dashboard.component";
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SideBarComponent ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Shipping-Angular';
  constructor(private router: Router) {}
  shouldShowLayout(): boolean {
    return !this.router.url.includes('/login');
  }
}
