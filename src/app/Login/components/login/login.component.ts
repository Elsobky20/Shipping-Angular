import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../../services/services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,  IonIcon],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  // Email validation pattern
  emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(form: NgForm): void {
    if (form.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
            this.isLoading = false;
            // Handle both normal response and token string case
            const token = response.token || response;
            if (token) {
                this.authService.storeAuthData(token);
                this.router.navigate(['/dashboard']);
            }
        },
        error: (error) => {
            this.isLoading = false;
            
            // Handle special success case with token string
            if (error.message === 'success' && error.token) {
                this.authService.storeAuthData(error.token);
                this.router.navigate(['/dashboard']);
                return;
            }
            
            // Show user-friendly message
            this.errorMessage = error.userMessage || 'Login failed. Please try again.';
            
            // Log technical details for debugging
            console.error('Login error:', error.technicalMessage || error);
        }
    });
}
  // Handle backend errors with English messages
  private handleBackendError(error: any): void {
    console.error('Login error:', error);
    
    if (error.status === 401) {
      this.errorMessage = 'Invalid email or password';
    } else if (error.status === 403) {
      this.errorMessage = 'Account not activated. Please check your email';
    } else if (error.status === 0) {
      this.errorMessage = 'Network error. Please check your connection';
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again';
    }
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}