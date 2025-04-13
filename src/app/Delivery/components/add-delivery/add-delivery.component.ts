import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import {DeliveryCreateDTO} from '../../Interfaces/delivery.model';
@Component({
  selector: 'app-add-delivery',
  templateUrl: './add-delivery.component.html',
  styleUrls: ['./add-delivery.component.css'],
  imports: [CommonModule,ReactiveFormsModule, FormsModule]
})
export class AddDeliveryComponent implements OnInit {
  deliveryForm!: FormGroup;
  branches: any[] = [];
  governments: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpReqService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadBranches();
    this.loadGovernments();
  }

  initForm(): void {
    this.deliveryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],
      branchId: ['', Validators.required],
      governmentsId: [[], Validators.required],
      discountType: ['', Validators.required],
      companyPercentage: ['', Validators.required]
    });
  }

  loadBranches(): void {
    this.http.getAll('Branch','all').subscribe(res => {
      this.branches = res.data.branches.sort((a: { name: string; }, b: { name: any; }) =>
        a.name.localeCompare(b.name));
      console.log(this.branches);
    });
  }

  loadGovernments(): void {
    this.http.getAll('Government','all').subscribe(res => {
      this.governments = res.governments.sort((a: { name: string; }, b: { name: any; }) =>
        a.name.localeCompare(b.name));
    });
  }

  onSubmit(): void {
    if (this.deliveryForm.invalid)
      {
      swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
      });
      return;
    }

    this.http.create('Delivery', this.deliveryForm.value).subscribe({
      next: res => {
        swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Delivery added successfully!',
          confirmButtonText: 'OK'
        });
        this.deliveryForm.reset();
      },
      error: err => {
        console.error(err);
        swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Something went wrong while adding delivery.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  fc = (control: string) => this.deliveryForm.get(control);
  isInvalid = (control: string): boolean => {
    const controlInstance = this.fc(control); // حفظ المرجعية للمتحكم (control) في متغير
    return controlInstance ? !!controlInstance.invalid && (controlInstance.touched || controlInstance.dirty) : false;
  };
  

}
