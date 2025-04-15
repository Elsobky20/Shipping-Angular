import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../AllModel/api-response';
import { IProfileDto } from '../Interfaces/iprofile-get';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  baseUrl: string = "http://localhost:5050/api/Profile";
  
  constructor(private http: HttpClient) {}
  getUserById(id: string): Observable<APIResponse<IProfileDto>> {
    return this.http.get<APIResponse<IProfileDto>>(`${this.baseUrl}/${id}`);
  }

  uploadProfileImage(id: string, file: File): Observable<APIResponse<string>> {
    const formData = new FormData();
    formData.append('imageFile', file);

    return this.http.post<APIResponse<string>>(`${this.baseUrl}/${id}/upload-profile-image`, formData);
  }
}

