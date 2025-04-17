import { Component, OnInit } from '@angular/core';
import { CityService } from '../../services/city.service';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-city-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './city-form.component.html',
  styleUrl: './city-form.component.css'
})
export class CityFormComponent implements OnInit {
  cityId!:number;
  allGovernrates!: any[];
  theGovern!: any;
  checkCityDeleted!:boolean;
  constructor(
    private httpReqService:HttpReqService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  cityForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    government_Id: new FormControl('', [Validators.required]),
    standardShipping: new FormControl('', [Validators.required]),
    isDeleted: new FormControl(false)
  })

  get getCity() {
    return this.cityForm.controls['name'];
  }
  get getGovernrate() {
    return this.cityForm.controls['government_Id'];
  }
  get getStandard() {
    return this.cityForm.controls['standardShipping'];
  }
  get getIsDeleted() {
    return this.cityForm.controls['isDeleted'];
  }

  ngOnInit(): void {
    // Step 1: Load Governrates
    this.httpReqService.getAll('Government', 'exist').subscribe({
      next: (response) => {
        this.allGovernrates = response.governments;
      },
      error: (error) => {
        console.log(error)
      }
    })
    /* ================================================ */
    // Step 2: Load city info if editing
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.cityId = Number(params.get('id'));
        this.getCity.setValue('');
        this.getGovernrate.setValue('');
        this.getStandard.setValue('0');

        if (this.cityId != 0) {
          this.httpReqService.getById('city',this.cityId).subscribe({
            next: (response) => {
              this.getCity.setValue(response.data.name);
              this.getStandard.setValue(response.data.pickupShipping.toString());

              this.theGovern = this.allGovernrates.find(c => c.name === response.data.governmentName);
              this.getGovernrate.setValue(this.theGovern.id || '');

              this.getIsDeleted.setValue(!response.data.isDeleted);
            },
            error: () => {},
          });
        }
      }
    })
  }

  cityHandler():void {
    if (this.cityForm.status == 'VALID') {
      if (this.cityId == 0) {
        console.log(this.cityForm)
        this.httpReqService.create('city', this.cityForm.value).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'City added!',
              text: `"${this.getCity.value}" has been added successfully.`,
              confirmButtonColor: '#28a745'
            });
            this.router.navigate(['/city'])
          },
          error: (error) => {
            if (error.error.error === "City is already exist.") {
              Swal.fire({
                icon: 'warning',
                title: 'Duplicate City',
                text: `The city "${this.getCity.value}" already exists.`,
                confirmButtonColor: '#f27474'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong while adding the city.',
                confirmButtonColor: '#dc3545'
              });
            }
          }
        });
      } else {
        const newEditParam = {
          ...this.cityForm.value,
          isDeleted: !this.getIsDeleted.value
        }
        this.httpReqService.editById('city', this.cityId, newEditParam).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'City updated!',
              text: `"${this.getCity.value}" has been updated successfully.`,
              confirmButtonColor: '#28a745'
            });
            this.router.navigate(['/city'])
          },
          error: (error) => {
            if (error.error.error === "City is already exist.") {
              Swal.fire({
                icon: 'warning',
                title: 'Duplicate City',
                text: `The city "${this.getCity.value}" already exists.`,
                confirmButtonColor: '#f27474'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong while adding the city.',
                confirmButtonColor: '#dc3545'
              });
            }
          }
        })
      }
    }
  }

  cancelHandeler():void {
    if (this.cityId == 0) {
      this.cityForm.reset({
        name: '',
        government_Id: '',
        standardShipping: '0',
      });
    }
    else
      this.router.navigate(['city'])
  }
}
