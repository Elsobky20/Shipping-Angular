import { Component, OnInit } from '@angular/core';
import { CityService } from '../../services/city.service';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from 'express';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-city-form',
  imports: [ReactiveFormsModule],
  templateUrl: './city-form.component.html',
  styleUrl: './city-form.component.css'
})
export class CityFormComponent implements OnInit {
  cityId!:number;
  constructor(private cityService:CityService,
    private httpReqService:HttpReqService,
    private router: Router,
    private activatedRoute: ActivatedRoute)
  {}

  cityForm = new FormGroup({
    city: new FormControl('', [Validators.required, Validators.minLength(3)]),
    governrate: new FormControl('', [Validators.required]),
    standard: new FormControl('0', [Validators.required]),
    pickup: new FormControl('0', [Validators.required])
  })

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.cityId = Number(params.get('id'));
        this.getCity.setValue('');
        this.getGovernrate.setValue('');
        this.getStandard.setValue('');
        this.getPickup.setValue('');
      }
    })
  }

  get getCity() {
    return this.cityForm.controls['city'];
  }
  get getGovernrate() {
    return this.cityForm.controls['governrate'];
  }
  get getStandard() {
    return this.cityForm.controls['standard'];
  }
  get getPickup() {
    return this.cityForm.controls['pickup'];
  }

  cityHandler() {
    if (this.cityForm.status == 'VALID') {
      if (this.cityId == 0) {
        console.log("add City")
        // this.productService.addNewProduct(this.productForm.value).subscribe({
        //   next: (response) => {
        //     this.router.navigate(['/products'], {
        //       queryParams: { category: 'phones' },
        //     });
        //   },
        // });
      } else {
        //edit
        console.log("edit City")

        // this.productService
        //   .editProduct(this.productId, this.productForm.value)
        //   .subscribe({
        //     next: () => {
        //       this.router.navigate(['/products']);
        //     },
        //   });
      }
    } else {
      console.log('Errorrrrrrrrrr');
    }
  }

}
