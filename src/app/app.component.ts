import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeFormComponent } from './employees/components/employee-form/employee-form.component';
import { RoleListComponent } from "./Roles/components/role-list/role-list.component";
import { LoginComponent } from './Login/components/login/login.component';
import { CitiesComponent } from './City/components/cities/cities.component';
import { SideBarComponent } from './Layout/side-bar/side-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, EmployeeFormComponent, RoleListComponent, CitiesComponent, SideBarComponent,LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Shipping-Angular';
}
