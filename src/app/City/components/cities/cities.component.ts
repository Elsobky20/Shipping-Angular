import { Component, OnInit } from '@angular/core';
import { CityService } from '../../services/city.service';
import { ICity } from '../../Interfaces/ICity';

@Component({
  selector: 'app-cities',
  imports: [],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css'
})
export class CitiesComponent implements OnInit {
  constructor(private cityService:CityService){}

  cities!:ICity[];

  ngOnInit(): void {
    this.cityService.getAllCities().subscribe({
      next: (response) => {
        this.cities = response.data.cities;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
