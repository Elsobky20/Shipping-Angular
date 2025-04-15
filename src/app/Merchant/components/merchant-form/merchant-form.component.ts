import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { AllBranches, } from '../../Interfaces/imerchnt-all';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-merchant-form',
  imports: [RouterLink, ReactiveFormsModule, NgSelectModule],
  templateUrl: './merchant-form.component.html',
  styleUrl: './merchant-form.component.css'
})
export class MerchantFormComponent implements OnInit {
  merchantId!:number;
  mySubscribe!:any;
  allBranches!: AllBranches[];
  theBranches!:number[];
  constructor(
      private httpReqService:HttpReqService,
      private activatedRoute:ActivatedRoute,
      private router:Router
    ) {}
  /* ========================================================================================================= */

  /* ========================================================================================================= */
  passwordMatchValidator = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  merchantForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    confirmPassword: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')]),
    address: new FormControl(''),
    government: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    storeName: new FormControl('', [Validators.required]),
    pickupCost: new FormControl('0', [Validators.required]),
    rejectedOrderPercentage: new FormControl('0', [Validators.required]),
    branches_Id: new FormControl('', [Validators.required]),
    isDeleted: new FormControl(false)
  }, { validators: this.passwordMatchValidator })

  get getName() {
    return this.merchantForm.controls['name'];
  }
  get getEmail() {
    return this.merchantForm.controls['email'];
  }
  get getPassword() {
    return this.merchantForm.controls['password'];
  }
  get getConfirmPassword() {
    return this.merchantForm.controls['confirmPassword'];
  }
  get getPhone() {
    return this.merchantForm.controls['phone'];
  }
  get getAddress() {
    return this.merchantForm.controls['address'];
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
  get getBranchesId() {
    return this.merchantForm.controls['branches_Id'];
  }
  get getIsDeleted() {
    return this.merchantForm.controls['isDeleted'];
  }

  ngOnInit(): void {
    // Step 1: Load Governrates From Json File
    this.httpReqService.getAll('Branch', 'exist').subscribe({
      next: (response) => {
        this.allBranches = response.data.branches;
        console.log(this.allBranches)
      },
      error: (error) => {
        console.log(error)
      }
    })
    /* ================================================ */
    // Step 2: Load city info if editing
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.merchantId = Number(params.get('id'));
        this.getName.setValue('');
        this.getEmail.setValue('');
        this.getPhone.setValue('');
        this.getPassword.setValue('');
        this.getConfirmPassword.setValue('');
        this.getAddress.setValue('');
        this.getGovernment.setValue('');
        this.getCity.setValue('');
        this.getStoreName.setValue('');
        this.getPickupCost.setValue('');
        this.getRejectedOrder.setValue('');
        this.getBranchesId.setValue('');
        if (this.merchantId != 0) {
          this.mySubscribe = this.httpReqService.getById('merchant', this.merchantId).subscribe({
            next: (response) => {
              console.log(response.data)
              this.getName.setValue(response.data.name);
              this.getEmail.setValue(response.data.email);
              this.getPhone.setValue(response.data.phone);
              this.getPassword.setValue('');
              this.getConfirmPassword.setValue('');
              this.getAddress.setValue(response.data.address);
              this.getGovernment.setValue(response.data.government);
              this.getCity.setValue(response.data.city);
              this.getStoreName.setValue(response.data.storeName);
              this.getPickupCost.setValue(response.data.pickupCost);
              this.getRejectedOrder.setValue(response.data.rejectedOrderPercentage);
              this.getIsDeleted.setValue(!response.data.isDeleted);

              const branchsNamesStr: string = response.data.branchsNames;
              console.log('branchsNamesStr:', branchsNamesStr);

              if (branchsNamesStr) {
                const branchNamesArray: string[] = branchsNamesStr.split(/\r?\n/).map((name: string) => name.trim());
                console.log('branchNamesArray:', branchNamesArray);

                const selectedBranches = this.allBranches.filter(branch =>
                  branchNamesArray.includes(branch.name)
                );
                console.log('selectedBranches:', selectedBranches);

                const selectedBranchIds = selectedBranches.map(branch => branch.id);
                console.log('selectedBranchIds:', selectedBranchIds);

                this.getBranchesId.setValue('');
            }
          },
            error: (error) => {
              console.log(error)
            },
        })
        }
      }
    })
  }

  merchantHandler():void {
      if (this.merchantForm.status == 'VALID') {
        if (this.merchantId == 0) {
          this.httpReqService.create('Merchant', this.merchantForm.value).subscribe({
            next: (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Merchant added!',
                text: `"${this.getName.value}" has been added successfully.`,
                confirmButtonColor: '#28a745'
              });
              this.router.navigate(['/merchant'])
            },
            error: (error) => {
              if (error.error.error === "Merchant is already exist.") {
                Swal.fire({
                  icon: 'warning',
                  title: 'Duplicate Merchant',
                  text: `The merchant "${this.getName.value}" already exists.`,
                  confirmButtonColor: '#f27474'
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Something went wrong while adding the Merchant.',
                  confirmButtonColor: '#dc3545'
                });
              }
            }
          });
        } else {
          const newEditParam = {
            ...this.merchantForm.value,
            isDeleted: !this.getIsDeleted.value
          }
          this.httpReqService.editById('merchant', this.merchantId, newEditParam).subscribe({
            next: (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Merchant updated!',
                text: `"${this.getName.value}" has been updated successfully.`,
                confirmButtonColor: '#28a745'
              });
              this.router.navigate(['merchant'])
            },
            error: (error) => {
              if (error.error.error === "Merchant is already exist.") {
                Swal.fire({
                  icon: 'warning',
                  title: 'Duplicate Merchant',
                  text: `The merchant "${this.getName.value}" already exists.`,
                  confirmButtonColor: '#f27474'
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Something went wrong while adding the merchant.',
                  confirmButtonColor: '#dc3545'
                });
              }
            }
          })
        }
      }
      console.log(this.merchantForm)
    }

  cancelHandeler():void {
    if (this.merchantId == 0) {
      this.merchantForm.reset({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        government: '',
        city: '',
        storeName: '',
        pickupCost: '0',
        rejectedOrderPercentage: '0',
        branches_Id: '',
      });
    }
    else
      this.router.navigate(['merchant'])
  }

  addSpecialPrice() {
    console.log("add")
  }
}
