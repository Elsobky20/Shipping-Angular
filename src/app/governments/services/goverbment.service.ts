import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Government, GovernmentCreateDTO } from '../Interfaces/government.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GovernmentService {
  private apiUrl = 'http://localhost:5050/api/Government'; 

  constructor(private http: HttpClient) {}

  getAll(page: number = 1, pageSize: number = 10, searchTerm: string = ''): Observable<any> {
    // إضافة searchTerm إلى الـ URL إذا كانت موجودة
    return this.http.get<any>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}`);
  }
  

  getById(id: number): Observable<Government> {
    return this.http.get<Government>(`${this.apiUrl}/${id}`);
  }

  create(government: GovernmentCreateDTO): Observable<any> {
    return this.http.post(this.apiUrl, government);
  }

  update(id: number, government: GovernmentCreateDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, government);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
