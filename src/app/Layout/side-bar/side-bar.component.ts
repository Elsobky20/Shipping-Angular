import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Login/services/services/auth.service';
@Component({
  selector: 'app-side-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  constructor(private authService: AuthService) { }
  dropdownStates: { [key: string]: boolean } = {};
  isSidebarMinimized: boolean = false;

  toggleDropdown(key: string): void {
    this.dropdownStates[key] = !this.dropdownStates[key];
  }
 

toggleSidebar() {
  this.isSidebarMinimized = !this.isSidebarMinimized;
}
  
  isDropdownOpen(key: string): boolean {
    return this.dropdownStates[key];
  }
  getUserName(): string 
  {
    if (typeof window !== 'undefined' && localStorage.getItem('name')) {
      return localStorage.getItem('name') || 'User';
    }
    return 'User';
  }
  getRolUser(): string {
    if (typeof window !== 'undefined' && localStorage.getItem('userRoles')) {
      return localStorage.getItem('userRoles') || 'User';
      
    }
    return 'Role';
  }
  logout() {
    this.authService.logout();
  }
}
