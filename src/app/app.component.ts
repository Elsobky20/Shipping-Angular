import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from './Layout/side-bar/side-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SideBarComponent  ],

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
