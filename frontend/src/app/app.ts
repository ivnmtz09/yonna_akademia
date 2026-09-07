import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { LoginModalComponent } from './features/auth/components/login-modal/login-modal.component';
import { RegisterModalComponent } from './features/auth/components/register-modal/register-modal.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProgressBarComponent } from './shared/components/progress-bar/progress-bar.component';
import { UiService } from './core/services/ui.service';
import { TokenService } from './core/services/token.service';
import { NavigationProgressService } from './core/services/navigation-progress.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    ProgressBarComponent,
    FooterComponent,
    LoginModalComponent,
    RegisterModalComponent,
    SidebarComponent
  ],
  templateUrl: './app.html',
})
export class AppComponent {
  ui = inject(UiService);
  tokenService = inject(TokenService);
  navProgress = inject(NavigationProgressService);
  title = 'yonna-frontend';
}
