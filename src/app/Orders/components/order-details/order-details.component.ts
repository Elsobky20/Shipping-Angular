import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpReqService } from '../../../GeneralSrevices/http-req.service';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-details',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent {
  orderId!:number;
  mySubscribe!:any;
  constructor(
      private activatedRoute: ActivatedRoute,
      private orderService: OrderService
    ) {}

    orderForm = new FormGroup({
      serialNumber: new FormControl(''),
      merchant: new FormControl(''),
      branch: new FormControl(''),
      shippingType: new FormControl(''),
      delivery: new FormControl(''),
      government: new FormControl(''),
      city: new FormControl(''),
      orderType: new FormControl(''),
      clientName: new FormControl(''),
      clientPhone1: new FormControl(''),
      clientPhone2: new FormControl(''),
      clientEmail: new FormControl(''),
      clientAddress: new FormControl(''),
      deliverToVillage: new FormControl(''),
      orderStatus: new FormControl(''),
      paymentType: new FormControl(''),
      createdDate: new FormControl(''),
      orderCost: new FormControl(0),
      shippingCost: new FormControl(0),
      orderTotalWeight: new FormControl(0),
      merchantNotes: new FormControl(''),
      employeeNotes: new FormControl(''),
      deliveryNotes: new FormControl(''),
    });


    get serialNumber() { return this.orderForm.controls['serialNumber']; }
    get merchant() { return this.orderForm.controls['merchant']; }
    get branch() { return this.orderForm.controls['branch']; }
    get shippingType() { return this.orderForm.controls['shippingType']; }
    get delivery() { return this.orderForm.controls['delivery']; }
    get government() { return this.orderForm.controls['government']; }
    get city() { return this.orderForm.controls['city']; }
    get orderType() { return this.orderForm.controls['orderType']; }
    get clientName() { return this.orderForm.controls['clientName']; }
    get clientPhone1() { return this.orderForm.controls['clientPhone1']; }
    get clientPhone2() { return this.orderForm.controls['clientPhone2']; }
    get clientEmail() { return this.orderForm.controls['clientEmail']; }
    get clientAddress() { return this.orderForm.controls['clientAddress']; }
    get deliverToVillage() { return this.orderForm.controls['deliverToVillage']; }
    get orderStatus() { return this.orderForm.controls['orderStatus']; }
    get paymentType() { return this.orderForm.controls['paymentType']; }
    get createdDate() { return this.orderForm.controls['createdDate']; }
    get orderCost() { return this.orderForm.controls['orderCost']; }
    get shippingCost() { return this.orderForm.controls['shippingCost']; }
    get orderTotalWeight() { return this.orderForm.controls['orderTotalWeight']; }
    get merchantNotes() { return this.orderForm.controls['merchantNotes']; }
    get employeeNotes() { return this.orderForm.controls['employeeNotes']; }
    get deliveryNotes() { return this.orderForm.controls['deliveryNotes']; }


    ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe({
        next: (params) => {
          this.orderId = Number(params.get('id'));
          this.mySubscribe = this.orderService.getOrderDetails(this.orderId).subscribe({
            next: (response) => {
              const order = response.data;
              this.orderForm.patchValue({
                serialNumber: order.serialNumber,
                merchant: order.merchant,
                branch: order.branch,
                shippingType: order.shippingType,
                delivery: order.delivery,
                government: order.government,
                city: order.city,
                orderType: order.orderType,
                clientName: order.clientName,
                clientPhone1: order.clientPhone1,
                clientPhone2: order.clientPhone2,
                clientEmail: order.clientEmail,
                clientAddress: order.clientAddress,
                deliverToVillage: order.deliverToVillage,
                orderStatus: order.orderStatus,
                paymentType: order.paymentType,
                createdDate: new Date(order.createdDate).toISOString().split('T')[0],
                orderCost: order.orderCost,
                shippingCost: order.shippingCost,
                orderTotalWeight: order.orderTotalWeight,
                merchantNotes: order.merchantNotes,
                employeeNotes: order.employeeNotes,
                deliveryNotes: order.deliveryNotes
              });
            },
            error: (error) => {
              console.log(error);
            },
          });
        }
      });
    }

}
