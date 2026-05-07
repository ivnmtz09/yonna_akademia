import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { LoginModalComponent } from './features/auth/components/login-modal/login-modal.component';
import { RegisterModalComponent } from './features/auth/components/register-modal/register-modal.component';
import { MobileMenuComponent } from './shared/components/mobile-menu/mobile-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, LoginModalComponent, RegisterModalComponent, MobileMenuComponent],
  templateUrl: './app.html',
})
export class AppComponent {
  title = 'yonna-frontend';
}
