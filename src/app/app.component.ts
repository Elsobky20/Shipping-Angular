import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeFormComponent } from './employees/components/employee-form/employee-form.component';
import { RoleListComponent } from "./Roles/components/role-list/role-list.component";
import { LoginComponent } from './Login/components/login/login.component';
import { SideBarComponent } from './Layout/side-bar/side-bar.component';
import { CitiesComponent } from './City/components/cities/cities.component';
import { BranchesComponent } from './Branch/components/branches/branches.component';
import { SettingComponent } from './Setting/components/setting/setting.component';
import { ProfileComponent } from './Profile/components/profile/profile.component';
import { SettingFormComponent } from './Setting/components/setting-form/setting-form/setting-form.component';
import { BranchFormComponent } from './Branch/components/branch-form/branch-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, EmployeeFormComponent, RoleListComponent, CitiesComponent, SideBarComponent,LoginComponent ,BranchesComponent,SettingComponent ,ProfileComponent ,SettingFormComponent,BranchFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Shipping-Angular';
}
