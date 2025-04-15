import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../../AllModel/api-response';
import { ISettingCreateDTOS, ISettingEditDTO, ISettingResponseData } from '../Interfaces/isetting-get';
import { ISettingDTO } from '../Interfaces/isetting-get';


@Injectable({
  providedIn: 'root'
})
export class SettingService {

 constructor(private http:HttpClient) { }

  baseURL:string = "http://localhost:5050/api/Setting";

  getAllSetting(): Observable<APIResponse<ISettingDTO[]>> {
    return this.http.get<APIResponse<ISettingDTO[]>>(this.baseURL);
  }

  // getAllSetting():Observable<APIResponse<ISettingResponseData>>{
  //   return this.http.get<APIResponse<ISettingResponseData>>(this.baseURL);
  // }

  getSettingById(id:number):Observable<APIResponse<ISettingResponseData>>{
    return this.http.get<APIResponse<ISettingResponseData>>(this.baseURL);
  }


}
