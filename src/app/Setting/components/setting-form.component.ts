import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpReqService } from '../../GeneralSrevices/http-req.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-setting-form',
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './setting-form.component.html',
  styleUrl: './setting-form.component.css'
})
export class SettingFormComponent implements OnInit {
  shippingObject!: any;
  deliveryAcceptArr:string[] = ["Yes", "No"];
  deliveryAcceptObj:{[key: string]: boolean} = {
    "Yes": true,
    "No": false
  };
  constructor(
    private httpReqService:HttpReqService,
  ) {}

  shippingForm = new FormGroup({
    shippingToVillageCost: new FormControl('0', [Validators.required]),
    deliveryAutoAccept: new FormControl('', [Validators.required]),
  })

  get getShippingToVillageCost() {
    return this.shippingForm.controls['shippingToVillageCost'];
  }
  get getDeliveryAutoAccept() {
    return this.shippingForm.controls['deliveryAutoAccept'];
  }

  ngOnInit(): void {
    // Step 1: Get Weight Price Object
    this.httpReqService.getById('Setting', 1).subscribe({
      next: (response) => {
        this.shippingObject = response.data;
        console.log(this.shippingObject)
        this.getShippingToVillageCost.setValue(response.data.shippingToVillageCost);
        this.getDeliveryAutoAccept.setValue(response.data.deliveryAutoAccept);
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  shippingHandler(){
    console.log(this.shippingForm.value)
    const shippingFormValues = {
      ...this.shippingForm.value,
      deliveryAutoAccept: Boolean(this.getDeliveryAutoAccept)
    }
    this.httpReqService.editById('Setting', 1, shippingFormValues).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Shipping Setting updated!',
          text: `Shipping Setting has been updated successfully✔.`,
          confirmButtonColor: '#28a745'
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong while updating the Shipping setting❌.',
          confirmButtonColor: '#dc3545'
        });
      }
    })
  }

  cancelHandeler():void {
    this.httpReqService.editById('Setting', 1, this.shippingObject).subscribe({
      next: (response) => {
        this.getShippingToVillageCost.setValue(this.shippingObject.shippingToVillageCost);
        this.getDeliveryAutoAccept.setValue(this.shippingObject.deliveryAutoAccept);
      },
      error: (error) => {
          console.log(error)
        }
    });
  }
}
