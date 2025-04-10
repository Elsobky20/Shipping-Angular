import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  iat: number;
  sub?: string;
  email?: string;
  roles?: string | string[];
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5050/api/Account';

  constructor(private http: HttpClient) {}

  // Store token data with decoding
   storeAuthData(token: string): void {
    const decoded = this.decodeToken(token);
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenExpiration', decoded.exp.toString());
    
    // Store any additional claims
    if (decoded['sub']) {
      localStorage.setItem('userId', decoded['sub']);
    }
    if (decoded['email']) {
      localStorage.setItem('userEmail', decoded['email']);
    }
    if (decoded['roles']) {
      localStorage.setItem('userRoles', JSON.stringify(decoded['roles']));
    }
  }
  // Decode JWT token
  private decodeToken(token: string): DecodedToken {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Invalid token format');
    }
  }

  // Get decoded token data
  getDecodedToken(): DecodedToken | null {
    const token = this.getAuthToken();
    if (!token) return null;
    
    try {
      return this.decodeToken(token);
    } catch (error) {
      this.logout();
      return null;
    }
  }

  // Check if user has specific role
  hasRole(requiredRole: string): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded['roles']) return false;
    
    const roles = decoded['roles'];
    if (Array.isArray(roles)) {
      return roles.includes(requiredRole);
    }
    return roles === requiredRole;
  }

  // Get user ID from token
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Login method
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    return this.http.post<any>(`${this.apiUrl}`, body, { headers }).pipe(
      tap(response => {
        // Handle both JSON response and plain token response
        const token = response?.token || response;
        if (token) {
          this.storeAuthData(token);
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Full error details:', error);
    
    let userMessage = 'An error occurred during login';
    let technicalMessage = '';
    
    if (error.error instanceof ErrorEvent) {
        // Client-side error
        technicalMessage = `Client error: ${error.error.message}`;
        userMessage = 'Network error - please check your connection';
    } else {
        // Server-side error
        technicalMessage = `Server error: ${error.message}`;
        
        // Handle JSON parsing error
        if (error.status === 200 && error.error instanceof ProgressEvent) {
            userMessage = 'Invalid response from server - please contact support';
        } 
        // Handle JWT token response
        else if (typeof error.error === 'string' && error.error.startsWith('eyJ')) {
            // This means the server returned a raw JWT token
            return throwError(() => ({
                message: 'success', // Special case for token response
                token: error.error
            }));
        }
        else {
            switch (error.status) {
                case 400:
                    userMessage = 'Invalid request data';
                    break;
                case 401:
                    userMessage = 'Invalid email or password';
                    break;
                case 403:
                    userMessage = 'Account not authorized';
                    break;
                case 404:
                    userMessage = 'Service not available';
                    break;
                case 500:
                    userMessage = 'Server error - please try again later';
                    break;
                default:
                    userMessage = 'Unexpected error occurred';
            }
        }
    }
    
    return throwError(() => ({
        userMessage,
        technicalMessage,
        status: error.status
    }));
}

  // Logout method
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('user');
  }

  // Get auth token
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    const expiration = localStorage.getItem('tokenExpiration');
    
    if (!token || !expiration) return false;
    
    // Check if token is expired
    return Date.now() < parseInt(expiration) * 1000;
  }
}