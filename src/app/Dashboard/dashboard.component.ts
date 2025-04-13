import { Component } from '@angular/core';
import { SideBarComponent } from '../Layout/side-bar/side-bar.component';

@Component({
  selector: 'app-dashboard',
  imports: [SideBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
