import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators, ValidationErrors, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { AllBranches, } from '../../Interfaces/imerchnt-all';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { OrderService } from '../../../Orders/services/order.service';
import { ICityGetDTO } from '../../../City/Interfaces/icity-get';

@Component({
  selector: 'app-merchant-form',
  imports: [RouterLink, ReactiveFormsModule, NgSelectModule, CommonModule],
  templateUrl: './merchant-form.component.html',
  styleUrl: './merchant-form.component.css'
})
export class MerchantFormComponent implements OnInit {
  merchantId!:number;
  mySubscribe!:any;
  allBranches!: AllBranches[];
  theBranches!:number[];
  allGovernrates!:any[];
  allCities!:any[];
  filteredCities!:any[];
  filteredCitiesList: ICityGetDTO[][] = [];

  constructor(
      private httpReqService:HttpReqService,
      private activatedRoute:ActivatedRoute,
      private router:Router,
      private orderService:OrderService
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
    isDeleted: new FormControl(false),
    specialShippingRates: new FormArray([])
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
  get getSpecialShippingRates(): FormArray<FormGroup> {
    return this.merchantForm.get('specialShippingRates') as unknown as FormArray<FormGroup>;
  }

  addSpecialShippingRate(): void {
    const rateGroup = new FormGroup({
      governrateId: new FormControl('', Validators.required),
      city_Id: new FormControl('', Validators.required),
      specialRate: new FormControl('', Validators.required),
      standardShipping: new FormControl<number | null>(null)
 // read-only input
    });

    this.getSpecialShippingRates.push(rateGroup);
    const index = this.getSpecialShippingRates.length - 1;

    // ✅ أول مره، مفيش مدن للعنصر ده
    this.filteredCitiesList[index] = [];

    // ✅ عند تغيير المحافظة
    rateGroup.get('governrateId')?.valueChanges.subscribe(govName => {
      if (govName) {
        const filtered = this.allCities.filter(city => city.governmentName === govName);
        this.filteredCitiesList[index] = filtered;
        rateGroup.get('city_Id')?.reset();
        rateGroup.get('standardShipping')?.reset();
      } else {
        this.filteredCitiesList[index] = [];
        rateGroup.get('city_Id')?.reset();
        rateGroup.get('standardShipping')?.reset();
      }
    });

    // ✅ عند اختيار المدينة
    rateGroup.get('city_Id')?.valueChanges.subscribe(cityId => {
      if (cityId) {
        const selectedCity = this.filteredCitiesList[index].find(city => city.id === Number(cityId));
        if (selectedCity) {
          rateGroup.get('standardShipping')?.setValue(selectedCity.standardShipping);
        }
      } else {
        rateGroup.get('standardShipping')?.reset();
      }
    });
  }

  removeProduct(index: number) {
    this.getSpecialShippingRates.removeAt(index);
  }

  ngOnInit(): void {
    // ✅ Step 1: تحميل كل البيانات (فروع، محافظات، مدن)
    forkJoin({
      branches: this.orderService.getExistingBranches(),
      governments: this.orderService.getExistingGovernments(),
      cities: this.orderService.getExistingCities(),
    }).subscribe({
      next: ({ branches, governments, cities }) => {
        this.allBranches = branches.data.branches;
        this.allGovernrates = governments.governments;
        this.allCities = cities.data.cities;

        this.activatedRoute.paramMap.subscribe({
          next: (params) => {
            this.merchantId = Number(params.get('id'));

    /* ================================================ */
            // ✅ Step 2: تهيئة الفورم
            this.merchantForm = new FormGroup({
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
              isDeleted: new FormControl(false),
              specialShippingRates: new FormArray([])
            }, { validators: this.passwordMatchValidator });

            // ✅ عند تغيير محافظة الشحن
            this.getSpecialShippingRates.controls.forEach((rate, index) => {
              rate.get('governrateId')?.valueChanges.subscribe(govName => {

                if (govName) {
                  // فلترة المدن بناءً على اسم المحافظة
                  this.filteredCities = this.allCities.filter(city => city.governmentName === govName);
                  rate.get('city_Id')?.reset(); // إعادة تعيين المدينة عند تغيير المحافظة
                } else {
                  this.filteredCities = [];
                  rate.get('city_Id')?.reset();
                }
              });
            });

            if (this.merchantId != 0) {
              this.mySubscribe = this.httpReqService.getById('merchant', this.merchantId).subscribe({
                next: (response) => {
                  const data = response.data;
                  console.log(data);

                  // Set main form values
                  this.getName.setValue(data.name);
                  this.getEmail.setValue(data.email);
                  this.getPhone.setValue(data.phone);
                  this.getPassword.setValue('');
                  this.getConfirmPassword.setValue('');
                  this.getAddress.setValue(data.address);
                  this.getGovernment.setValue(data.government);
                  this.getCity.setValue(data.city);
                  this.getStoreName.setValue(data.storeName);
                  this.getPickupCost.setValue(data.pickupCost);
                  this.getRejectedOrder.setValue(data.rejectedOrderPercentage);
                  this.getIsDeleted.setValue(!data.isDeleted);

                  // Set branches
                  const branchsNamesStr: string = data.branchsNames;
                  if (branchsNamesStr) {
                    const branchNamesArray = branchsNamesStr.split(/\r?\n/).map(name => name.trim());
                    const selectedBranches = this.allBranches.filter(branch => branchNamesArray.includes(branch.name));
                    const selectedBranchIds:any = selectedBranches.map(branch => branch.id);
                    this.getBranchesId.setValue(selectedBranchIds);
                  }

                  // Handle specialShippingRates
                  if (data.specialShippingRates?.length) {
                    this.getSpecialShippingRates.clear();
                    this.filteredCitiesList = [];

                    data.specialShippingRates.forEach((rate: any, index: number) => {
                      // Push empty array for cities (to be updated on valueChange)
                      this.filteredCitiesList.push([]);

                      const group = new FormGroup({
                        governrateId: new FormControl(rate.governrateId || '', Validators.required),
                        city_Id: new FormControl(rate.city_Id || '', Validators.required),
                        specialRate: new FormControl(rate.specialRate || '', Validators.required),
                        standardShipping: new FormControl({ value: rate.standardShipping || '', disabled: true })
                      });

                      this.getSpecialShippingRates.push(group);

                      // Set initial filtered cities for the existing governorate
                      const initialCities = this.allCities.filter(city => city.governmentName === rate.governrateId);
                      this.filteredCitiesList[index] = initialCities;

                      // Re-bind governorate & city valueChanges
                      group.get('governrateId')?.valueChanges.subscribe(govName => {
                        const cities = this.allCities.filter(city => city.governmentName === govName);
                        this.filteredCitiesList[index] = cities;
                        group.get('city_Id')?.reset();
                      });

                      group.get('city_Id')?.valueChanges.subscribe(cityId => {
                        const selectedCity = this.filteredCitiesList[index]?.find(city => city.id == +cityId);
                        if (selectedCity) {
                          group.get('standardShipping')?.setValue(selectedCity.standardShipping);
                        } else {
                          group.get('standardShipping')?.reset();
                        }
                      });
                    });
                  }
                },
                error: (error) => {
                  console.log(error);
                },
              });
            }
          }
        })
      },
      error: (err) => console.error('Error loading initial data', err)
      });
  }


  merchantHandler():void {
      if (this.merchantForm.status == 'VALID') {
        if (this.merchantId == 0) {

          const specialShippingRatesToSend = this.getSpecialShippingRates.controls.map(control => ({
            city_Id: control.get('city_Id')?.value,
            specialRate: control.get('specialRate')?.value
          }));

          // تحضير البيانات النهائية
          const merchantData: any = {
            ...this.merchantForm.getRawValue(),
            specialShippingRates: specialShippingRatesToSend
          };
          delete merchantData.confirmPassword;

          this.httpReqService.create('Merchant', merchantData).subscribe({
            next: (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Merchant added!',
                text: `"${this.getName.value}" has been added successfully✔.`,
                confirmButtonColor: '#28a745'
              });
              this.router.navigate(['/merchant'])
            },
            error: (error) => {
              if (error.error.error === "Merchant is already exist❌.") {
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
                  text: 'Something went wrong while adding the Merchant🙄.',
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
        specialShippingRates: []
      });
    }
    else
      this.router.navigate(['merchant'])
  }
}