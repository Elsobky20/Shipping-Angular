import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { OrderService } from '../../services/order.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-order-add',
  imports: [ReactiveFormsModule, RouterLink, NgSelectModule, CommonModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent implements OnInit{
  //tableForm!: FormGroup;

  newEditParam:any;
  userId!:any;
  userRole!:any;
  specificId!:any;

  orderId!:number;
  mySubscribe!:any;
  allBranches!: any[];
  allGovernrates!:any[];
  allCities!:any[];
  filteredCities!:any[];
  allShippingTypes!:any[];
  allMerchants!:any[];

  allPaymentTypes = [
    { label: 'Prepaid', value: 'Prepaid' },
    { label: 'Package Swap', value: 'PackageSwap' },
    { label: 'Cash On Delivery', value: 'CashOnDelivery' }
  ];
  allOrderTypes = [
    { label: 'Pickup From Branch', value: 'PickupFromBranch' },
    { label: 'Pickup From Merchant', value: 'PickupFromMerchant' }
  ];

  constructor(
      private httpReqService:HttpReqService,
      private activatedRoute:ActivatedRoute,
      private router:Router,
      private orderService:OrderService,
      private fb: FormBuilder
    ) {}
  /* ========================================================================================================= */
  orderForm = new FormGroup({
    orderType: new FormControl('', [Validators.required]),
    merchant_Id: new FormControl(''),
    branch_Id: new FormControl('', [Validators.required]),
    government_Id: new FormControl('', [Validators.required]),
    shippingType_Id: new FormControl('', [Validators.required]),
    city_Id: new FormControl('', [Validators.required]),
    clientName: new FormControl('', [Validators.required, Validators.maxLength(5)]),
    clientPhone1: new FormControl('', [Validators.required, Validators.pattern(/^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/)]),
    clientPhone2: new FormControl('', [Validators.pattern(/^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/)]),
    clientEmail: new FormControl('', [Validators.required, Validators.email]),
    clientAddress: new FormControl(''),
    deliverToVillage: new FormControl(false),
    paymentType: new FormControl('', [Validators.required]),
    orderCost: new FormControl('', [Validators.required, Validators.min(0)]),
    orderTotalWeight: new FormControl(0, [Validators.min(0)]),
    merchantNotes: new FormControl('', { nonNullable: true }),
    employeeNotes: new FormControl(''),
    products: new FormArray([])
  });

  // getters
  get getBranchId() {
    return this.orderForm.controls['branch_Id'];
  }
  get getMerchantId() {
    return this.orderForm.controls['merchant_Id'];
  }
  get getGovernmentId() {
    return this.orderForm.controls['government_Id'];
  }
  get getShippingTypeId() {
    return this.orderForm.controls['shippingType_Id'];
  }
  get getCityId() {
    return this.orderForm.controls['city_Id'];
  }
  get getOrderType() {
    return this.orderForm.controls['orderType'];
  }
  get getClientName() {
    return this.orderForm.controls['clientName'];
  }
  get getClientPhone1() {
    return this.orderForm.controls['clientPhone1'];
  }
  get getClientPhone2() {
    return this.orderForm.controls['clientPhone2'];
  }
  get getClientEmail() {
    return this.orderForm.controls['clientEmail'];
  }
  get getClientAddress() {
    return this.orderForm.controls['clientAddress'];
  }
  get getDeliverToVillage() {
    return this.orderForm.controls['deliverToVillage'];
  }
  get getPaymentType() {
    return this.orderForm.controls['paymentType'];
  }
  get getOrderCost() {
    return this.orderForm.controls['orderCost'];
  }
  get getOrderTotalWeight() {
    return this.orderForm.controls['orderTotalWeight'];
  }
  get getMerchantNotes() {
    return this.orderForm.controls['merchantNotes'];
  }
  get getEmployeeNotes() {
    return this.orderForm.controls['employeeNotes'];
  }
  get products(): FormArray<FormGroup> {
    return this.orderForm.get('products') as unknown as FormArray<FormGroup>;
  }

  addProduct(): void {
    const productGroup = new FormGroup({
      name:     new FormControl('', Validators.required),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
      itemWeight:   new FormControl(0, [Validators.required, Validators.min(0)])  // ← هنا
    });

    productGroup.get('weight')?.valueChanges.subscribe(()   => this.updateTotalWeight());
    productGroup.get('quantity')?.valueChanges.subscribe(() => this.updateTotalWeight());

    this.products.push(productGroup);
    this.updateTotalWeight();
  }


  updateTotalWeight(): void {
    const total = this.products.controls.reduce((sum, grp) => {
      const w = grp.get('itemWeight')?.value || 0;
      const q = grp.get('quantity')?.value || 1;
      return sum + w * q;
    }, 0);
    this.orderForm.get('orderTotalWeight')?.setValue(total, { emitEvent: false });
  }

  removeProduct(index: number): void {
    this.products.removeAt(index);
    this.updateTotalWeight();
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.userRole = localStorage.getItem('userRoles');

    if (this.userId && this.userRole) {
      this.mySubscribe = this.orderService.getUserByRole(this.userId, this.userRole).subscribe({
        next: (response) => {
          this.userId = response.userId;
        },
        error: (error) => console.log(error)
      });
    }

    if (this.userRole === 'merchant' || this.userRole === 'delivery') {
      this.orderForm.get('merchant_Id')?.clearValidators();
      this.orderForm.get('merchant_Id')?.updateValueAndValidity();
    } else {
      this.orderForm.get('merchant_Id')?.setValidators([Validators.required]);
      this.orderForm.get('merchant_Id')?.updateValueAndValidity();
    }

    // تحميل المحافظات والمدن والشحن والفروع والتجار مرة واحدة
    forkJoin({
      governments: this.orderService.getExistingGovernments(),
      cities: this.orderService.getExistingCities(),
      shippingTypes: this.orderService.getExistingShippingTypes(),
      branches: this.orderService.getExistingBranches(),
      merchants: this.orderService.getExistingMerchants(),
    }).subscribe({
      next: ({ governments, cities, shippingTypes, branches, merchants }) => {
        this.allGovernrates = governments.governments;
        this.allCities = cities.data.cities;
        this.allShippingTypes = shippingTypes;
        this.allBranches = branches.data.branches;
        this.allMerchants = merchants.data.merchants;

        this.activatedRoute.paramMap.subscribe({
          next: (params) => {
            this.orderId = Number(params.get('id'));

            this.orderForm = new FormGroup({
              orderType: new FormControl('', [Validators.required]),
              merchant_Id: new FormControl(''),
              branch_Id: new FormControl('', [Validators.required]),
              government_Id: new FormControl('', [Validators.required]),
              shippingType_Id: new FormControl('', [Validators.required]),
              city_Id: new FormControl('', [Validators.required]),
              clientName: new FormControl('', [Validators.required, Validators.minLength(5)]),
              clientPhone1: new FormControl('', [Validators.required, Validators.pattern(/^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/)]),
              clientPhone2: new FormControl('', [Validators.pattern(/^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/)]),
              clientEmail: new FormControl('', [Validators.required, Validators.email]),
              clientAddress: new FormControl(''),
              deliverToVillage: new FormControl(false),
              paymentType: new FormControl('', [Validators.required]),
              orderCost: new FormControl('', [Validators.required, Validators.min(0)]),
              orderTotalWeight: new FormControl(0, [Validators.min(0)]),
              merchantNotes: new FormControl('', { nonNullable: true }),
              employeeNotes: new FormControl(''),
              products: new FormArray([])
            });

            // ربط تغيير المحافظة بالمدن
            this.orderForm.get('government_Id')?.valueChanges.subscribe((selectedGovId: number | string | null) => {
              const govName = this.allGovernrates.find(g => g.id === Number(selectedGovId))?.name;
              this.filteredCities = this.allCities.filter(city => city.governmentName === govName);
              this.orderForm.get('city_Id')?.reset();
            });

            if (this.orderId !== 0) {
              this.orderService.getOrderById(this.orderId).subscribe({
                next: ({ data: orderData }) => {
                  // 1. نعبي باقي الحقول
                  this.orderForm.patchValue({
                    branch_Id:    orderData.branch_Id,
                    merchant_Id:  orderData.merchant_Id,
                    government_Id:orderData.government_Id,
                    shippingType_Id: orderData.shippingType_Id,
                    city_Id:      orderData.city_Id,
                    orderType:    orderData.orderType,
                    clientName:   orderData.clientName,
                    clientPhone1: orderData.clientPhone1,
                    clientPhone2: orderData.clientPhone2,
                    clientEmail:  orderData.clientEmail,
                    clientAddress:orderData.clientAddress,
                    deliverToVillage: orderData.deliverToVillage,
                    paymentType:  orderData.paymentType,
                    orderCost:    orderData.orderCost,
                    orderTotalWeight: orderData.orderTotalWeight,
                    merchantNotes: orderData.merchantNotes,
                    employeeNotes: orderData.employeeNotes,
                  });

                  // 2. نظف أي منتجات موجودة مسبقاً
                  const productsArray = this.orderForm.get('products') as FormArray;
                  productsArray.clear();

                  // 3. عبّي الـ FormArray بالمنتجات القديمة
                  orderData.products.forEach((prod: any) => {
                    const fg = new FormGroup({
                      name:     new FormControl(prod.name,     Validators.required),
                      quantity: new FormControl(prod.quantity, [Validators.required, Validators.min(1)]),
                      itemWeight:   new FormControl(prod.itemWeight, [Validators.required, Validators.min(0)]) // استخدم weight
                    });

                    fg.get('itemWeight')?.valueChanges.subscribe(()   => this.updateTotalWeight());
                    fg.get('quantity')?.valueChanges.subscribe(() => this.updateTotalWeight());
                    productsArray.push(fg);
                  });
                  this.updateTotalWeight();

                  // 5. صفي المدن بناءً على المحافظة
                  const govName = this.allGovernrates
                    .find(g => g.id === Number(orderData.government_Id))?.name;
                  this.filteredCities = this.allCities
                    .filter(city => city.governmentName === govName);
                },
                error: err => console.error(err)
              });
            }
          }
        });
      },
      error: (error) => {
        console.log('Error loading initial data:', error);
      }
    });
  }

  orderHandler(): void {
    if(this.userRole == "merchant"){
      this.newEditParam = {
        ...this.orderForm.value,
        merchant_Id: this.userId
      };
    }
    else {
      this.newEditParam = this.orderForm.value;
    }

    if (this.orderForm.status === 'VALID') {
      if (this.orderId === 0) {
        this.httpReqService.create('Order', this.newEditParam).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Order added!',
              text: `"${this.orderForm.get('clientName')?.value}" has been added successfully✔.`,
              confirmButtonColor: '#28a745'
            });
            this.router.navigate(['/order']);
          },
          error: (error) => {
            if (error.error.error === "Order is already exist.") {
              Swal.fire({
                icon: 'warning',
                title: 'Duplicate Order',
                text: `An order for "${this.orderForm.get('clientName')?.value}" already exists❌.`,
                confirmButtonColor: '#f27474'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong while adding the order🙄.',
                confirmButtonColor: '#dc3545'
              });
            }
          }
        });
      } else {
        this.newEditParam = {
          ...this.orderForm.value,
          merchant_Id: this.userId,
        }

        this.httpReqService.editById('Order', this.orderId, this.newEditParam).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Order updated!',
              text: `"${this.orderForm.get('clientName')?.value}" has been updated successfully✔.`,
              confirmButtonColor: '#28a745'
            });
            this.router.navigate(['/order']);
          },
          error: (error) => {
            if (error.error.error === "Order is already exist.") {
              Swal.fire({
                icon: 'warning',
                title: 'Duplicate Order',
                text: `An order for "${this.orderForm.get('clientName')?.value}" already exists❌.`,
                confirmButtonColor: '#f27474'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong while updating the order🙄.',
                confirmButtonColor: '#dc3545'
              });
            }
          }
        });
      }
    }
  }

  cancelHandeler(): void {
    if (this.orderId === 0) {
      this.orderForm.reset({
        branch_Id: '',
        merchant_Id: '',
        government_Id: '',
        shippingType_Id: '',
        city_Id: '',
        orderType: '',
        clientName: '',
        clientPhone1: '',
        clientPhone2: '',
        clientEmail: '',
        clientAddress: '',
        deliverToVillage: false,
        paymentType: '',
        orderCost: '',
        orderTotalWeight: 0,
        merchantNotes: '',
        products: []
      });
      (this.orderForm.get('products') as FormArray).clear();
    } else {
      this.router.navigate(['order']);
    }
  }
}
