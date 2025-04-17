import { Component, OnInit } from '@angular/core';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { WieghPriceService } from '../../services/wiegh-price.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wiegh-price-form',
  imports: [FormsModule],
  templateUrl: './wiegh-price-form.component.html',
  styleUrl: './wiegh-price-form.component.css'
})
export class WieghPriceFormComponent implements OnInit {
 
  formData = {
    defaultWeight: 0,
    additionalKgPrice: 0
  };

  constructor(private weightService: WieghPriceService) { }

  ngOnInit(): void {
  }

  
  createWeightPricing(): void {
    const newWeight = {
      defaultWeight: this.formData.defaultWeight,
      additionalKgPrice: this.formData.additionalKgPrice
    };
  
    this.weightService.create(newWeight).subscribe({
      next: (res) =>  Swal.fire({
                title: 'Created successfully!',
                text: 'wiegh Price Setting Created successfully!',
                icon: 'success',
                confirmButtonText: 'Ok'
              }),
      error: (err) =>   Swal.fire({
              title: "Can't add Wiegh Price Setting",
              text: 'This Setting is already Added!',
              icon: 'error',
              confirmButtonText: 'Ok'
            })
    });
  }
  updateWeightPricing(): void {
    const updatedWeight = {
      defaultWeight: this.formData.defaultWeight,
      additionalKgPrice: this.formData.additionalKgPrice
    };
  
    this.weightService.update(updatedWeight).subscribe({
      next: (res) =>  Swal.fire({
        title: 'Updated successfully!',
        text: 'wiegh Price Setting Updated successfully!',
        icon: 'success',
        confirmButtonText: 'Ok'
      }),
error: (err) =>   Swal.fire({
      title: "Can't Updated Wiegh Price Setting",
      text: 'This Setting Does not Exist!',
      icon: 'error',
      confirmButtonText: 'Ok'
    })
    });
  }
}
