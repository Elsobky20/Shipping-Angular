import { Component, OnInit } from '@angular/core';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { WieghPriceService } from '../../services/wiegh-price.service';

@Component({
  selector: 'app-wiegh-price-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './wiegh-price-form.component.html',
  styleUrl: './wiegh-price-form.component.css'
})
export class WieghPriceFormComponent implements OnInit {
  weightObject!: any;

  constructor(
    private httpReqService:HttpReqService,
    private wieghPriceService:WieghPriceService
  ) {}

  weightForm = new FormGroup({
    defaultWeight: new FormControl('0', [Validators.required]),
    additionalKgPrice: new FormControl('0', [Validators.required]),
  })

  get getDefaultWeight() {
    return this.weightForm.controls['defaultWeight'];
  }
  get getAdditionalKgPrice() {
    return this.weightForm.controls['additionalKgPrice'];
  }

  ngOnInit(): void {
    // Step 1: Get Weight Price Object
    this.httpReqService.getById('WeightPricing', 1).subscribe({
      next: (response) => {
        this.weightObject = response;
        this.getDefaultWeight.setValue(response.defaultWeight);
        this.getAdditionalKgPrice.setValue(response.additionalKgPrice);
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  weightHandler(){
    this.wieghPriceService.edit(this.weightForm.value).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Weight Setting updated!',
          text: `Weight Setting has been updated successfully✔.`,
          confirmButtonColor: '#28a745'
        });
      },
      error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong while updating the weight setting.',
            confirmButtonColor: '#dc3545'
          });
        }
    })
  }

  cancelHandeler():void {
    this.getDefaultWeight.setValue(this.weightObject.defaultWeight);
    this.getAdditionalKgPrice.setValue(this.weightObject.additionalKgPrice);
  }
}
