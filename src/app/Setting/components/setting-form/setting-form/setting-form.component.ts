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
  isEdit: boolean = false;
  settingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpReqService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.settingId = +id;
        this.loadSetting(this.settingId);
      }
    });
  }

  initForm(): void {
    this.settingForm = this.fb.group({
      shippingToVillageCost: [null, [Validators.required]],
      deliveryAutoAccept: [null, Validators.required]
    });
  }

  loadSetting(id: number): void {
    this.http.getById('Setting', id).subscribe({
      next: (data: ISettingCreateDTOS) => {
        this.settingForm.patchValue(data);
      },
      error: err => {
        console.error(err);
        swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to load setting data.',
        });
      }
    });
  }

  onSubmit(): void {
    if (this.settingForm.invalid) {
      swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
      });
      return;
    }

    const settingData = this.settingForm.value;

    if (this.isEdit && this.settingId) {
      // Update existing setting
      this.http.editById('Setting', this.settingId, settingData).subscribe({
        next: res => {
          swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Setting updated successfully!',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/settings']);
        },
        error: err => {
          console.error(err);
          swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'Something went wrong while updating setting.',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      // Create new setting
      this.http.create('Setting', settingData).subscribe({
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
            text: 'Something went wrong while adding setting. ,setting already Exits',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }

  fc = (control: string) => this.settingForm.get(control);
  isInvalid = (control: string): boolean => {
    const controlInstance = this.fc(control);
    return controlInstance ? controlInstance.invalid && (controlInstance.touched || controlInstance.dirty) : false;
  };
}