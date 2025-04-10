import { Component } from '@angular/core';
import { AuthService } from '../../services/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true, // مهم جدًا علشان تعرفي إن الكومبوننت ده مستقل
  imports: [CommonModule, FormsModule], // هنا بنضيف FormsModule علشان ngModel
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(form: NgForm) {
    if (form.valid) {
      // تمرير البريد الإلكتروني وكلمة المرور كمعاملين منفصلين
      this.authService.login(this.email, this.password).subscribe({
       next: (response) => {
          console.log('Login successful');
          // إعادة التوجيه عند النجاح
          this.router.navigate(['/dashboard']);
        },
       error: (error) => {
          this.errorMessage = 'Login failed. Please try again.';
          console.error('Login failed', error);
        }

    });
    }
  }
  
}
