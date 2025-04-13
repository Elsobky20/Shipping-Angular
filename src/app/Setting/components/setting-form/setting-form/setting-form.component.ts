import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpReqService } from '../../../../GeneralSrevices/http-req.service';
import swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { ISettingCreateDTOS } from '../../../Interfaces/isetting-get';

import { ActivatedRoute, Router ,RouterModule} from '@angular/router';
@Component({
  selector: 'app-setting-form',
  imports: [CommonModule,ReactiveFormsModule, FormsModule,RouterModule],
  templateUrl: './setting-form.component.html',
  styleUrl: './setting-form.component.css'
})
export class SettingFormComponent implements OnInit {
  settingForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpReqService,private router:Router,private rout:ActivatedRoute) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.settingForm = this.fb.group({
      shippingToVillageCost: [Number, [Validators.required]],
      deliveryAutoAccept: [Boolean, Validators.required]
      // isDeleted: ['false', Validators.required]
    });
    console.log(this.settingForm.value);
  }

  onSubmit(): void {
    console.log(this.settingForm.value)
    if (this.settingForm.invalid) {
      swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
      });
      return;
    }

    console.log('Form values:', this.settingForm.value); // تأكد من أن القيم صحيحة

    this.http.create('Setting', this.settingForm.value).subscribe({
      next: res => {
        swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Setting added successfully!',
          confirmButtonText: 'OK'
        });
        this.settingForm.reset();
      },
      error: err => {
        console.error(err);
        swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Something went wrong while adding setting.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  fc = (control: string) => this.settingForm.get(control);
  isInvalid = (control: string): boolean => {
    const controlInstance = this.fc(control);
    return controlInstance ? !!controlInstance.invalid && (controlInstance.touched || controlInstance.dirty) : false;
  };

}


