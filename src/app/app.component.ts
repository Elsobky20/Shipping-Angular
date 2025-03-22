import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeFormComponent } from './employees/components/employee-form/employee-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,CommonModule , EmployeeFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Shipping-Angular';
}
