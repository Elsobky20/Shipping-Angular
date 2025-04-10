import { Component, OnInit } from '@angular/core';
import { CityService } from '../../services/city.service';
import { ICity } from '../../Interfaces/icity-get';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';

@Component({
  selector: 'app-cities',
  imports: [],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css'
})
export class CitiesComponent implements OnInit {
  constructor(private cityService:CityService, private httpReqervice:HttpReqService){}

  cities!:ICity[];

  ngOnInit(): void {
    this.httpReqervice.getAll('City','all').subscribe({
      next: (response) => {
        this.cities = response.data.cities;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
