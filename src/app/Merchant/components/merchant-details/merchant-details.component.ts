import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';

@Component({
  selector: 'app-merchant-details',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './merchant-details.component.html',
  styleUrl: './merchant-details.component.css'
})
export class MerchantDetailsComponent implements OnInit {
  merchantId!:number;
  mySubscribe!:any;
  constructor(
      private httpReqService:HttpReqService,
      private activatedRoute: ActivatedRoute,
    ) {}

  merchantForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
    createdDate: new FormControl(''),
    government: new FormControl(''),
    city: new FormControl(''),
    storeName: new FormControl(''),
    pickupCost: new FormControl(''),
    rejectedOrderPercentage: new FormControl(''),
    branchsNames: new FormControl('')
  })

  get getName() {
    return this.merchantForm.controls['name'];
  }
  get getEmail() {
    return this.merchantForm.controls['email'];
  }
  get getPhone() {
    return this.merchantForm.controls['phone'];
  }
  get getAddress() {
    return this.merchantForm.controls['address'];
  }
  get getCreatedDate() {
    return this.merchantForm.controls['createdDate'];
  }
  get getGovernment() {
    return this.merchantForm.controls['government'];
  }
  get getCity() {
    return this.merchantForm.controls['city'];
  }
  get getStoreName() {
    return this.merchantForm.controls['storeName'];
  }
  get getPickupCost() {
    return this.merchantForm.controls['pickupCost'];
  }
  get getRejectedOrder() {
    return this.merchantForm.controls['rejectedOrderPercentage'];
  }
  get getBranchNames() {
    return this.merchantForm.controls['branchsNames'];
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.merchantId = Number(params.get('id'));
        this.mySubscribe = this.httpReqService.getById('merchant', this.merchantId).subscribe({
          next: (response) => {
            this.getName.setValue(response.data.name);
            this.getEmail.setValue(response.data.email);
            this.getPhone.setValue(response.data.phone);
            this.getAddress.setValue(response.data.address);
            const formattedDate = new Date(response.data.createdDate).toISOString().split('T')[0];
            this.getCreatedDate.setValue(formattedDate);
            this.getGovernment.setValue(response.data.government);
            this.getCity.setValue(response.data.city);
            this.getStoreName.setValue(response.data.storeName);
            this.getPickupCost.setValue(response.data.pickupCost);
            this.getRejectedOrder.setValue(response.data.rejectedOrderPercentage);
            this.getBranchNames.setValue(response.data.branchsNames);
            console.log(this.getBranchNames.value)
          },
          error: (error) => {
            console.log(error)
          },
        })
      }
    })
  }
}
