import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from './Layout/side-bar/side-bar.component';
import { Router } from '@angular/router';
import { ChatComponent } from './ChatBox/chat/chat.component';
// import { ChatComponent } from "./chat/component/chat.component";
// import { ChatComponent_1 as ChatComponent } from "./ChatBox/chat/chat.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SideBarComponent, ChatComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Shipping-Angular';
  constructor(private router: Router) {}
  shouldShowLayout(): boolean {
    return !this.router.url.includes('/login');
  }
}
