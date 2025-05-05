import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  public orderCreated$ = new Subject<any>();
  public orderAssigned$ = new Subject<any>();
  public statusChange$ = new Subject<any>();
  public cancelAssignOrder$ = new Subject<any>();
  public deleteOrder$ = new Subject<any>();
  public editOrder$ = new Subject<any>();

  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5050/orderHub', {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.log('SignalR Error: ', err));

    this.hubConnection.on('CreateOrder', (orderGetDTO) => {
      this.orderCreated$.next(orderGetDTO);
    });

    this.hubConnection.on('AssignOrder', (orderGetDTO) => {
      this.orderAssigned$.next(orderGetDTO);
    });

    this.hubConnection.on('ChangeStatus', (orderGetDTO) => {
      this.statusChange$.next(orderGetDTO);
    });

    this.hubConnection.on('CancelAssignOrder', (orderGetDTO) => {
      this.cancelAssignOrder$.next(orderGetDTO);
    });

    this.hubConnection.on('DeleteOrder', (orderGetDTO) => {
      this.deleteOrder$.next(orderGetDTO);
    });

    this.hubConnection.on('OrderEdit', (orderGetDTO) => {
      this.editOrder$.next(orderGetDTO);
    });
  }
}
