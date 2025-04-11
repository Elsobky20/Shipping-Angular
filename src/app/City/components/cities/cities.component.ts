import { Component, OnDestroy, OnInit } from '@angular/core';
import { CityService } from '../../services/city.service';
import { ICityGetDTO } from '../../Interfaces/icity-get';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cities',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css'
})
export class CitiesComponent implements OnInit {
  constructor(private cityService:CityService, private httpReqervice:HttpReqService){}

  cities!:ICityGetDTO[];
  mySubsribe:any;
  ngOnInit(): void {
    this.mySubsribe = this.httpReqervice.getAll('City','all').subscribe({
      next: (response) => {
        this.cities = response.data.cities.sort((a: { governmentName: string; }, b: { governmentName: any; }) =>
          a.governmentName.localeCompare(b.governmentName));
      },
      error: (error) => {
        console.log(error);
      }
    })
  }


  // ngOnDestroy(): void {
  //   this.mySubsribe.unsubsribe();
  // }

  selectedValue: string = '10';
  values: number[] = [5, 10, 20];
  selectValue(val: number) {
    this.selectedValue = val.toString();
  }

  deleteCity(id:number): void{
    const city = this.cities.find(c => c.id === id);
    if (city?.isDeleted) {
      Swal.fire({
        title: "Can't delete city.",
        text: 'This city is already deleted!',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
    // تأكيد الحذف للمدينة النشطة
    this.httpReqervice.confirmAndDelete('city', id).subscribe({
      next: (response) => {
        // عند نجاح الحذف
        Swal.fire({
          title: 'Deleted successfully!',
          text: 'City deleted successfully!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        
        const index = this.cities.findIndex(c => c.id === id);
        if (index !== -1) {
          // 2. إنشاء نسخة جديدة من المصفوفة
          this.cities = [...this.cities];
          this.cities[index].isDeleted = true;
          this.cities.sort((a, b) => a.governmentName.localeCompare(b.governmentName));
        }
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed deleting city.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }
}
