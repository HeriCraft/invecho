import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ThemeToggleComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  authService = inject(AuthService);
  private router = inject(Router);

  isSidebarOpen = signal(false);

  currentRoute = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  pageTitle = computed(() => {
    const route = this.currentRoute();
    if (route.includes('/dashboard/users')) return 'Gestion des utilisateurs';
    if (route.includes('/dashboard/settings')) return 'Paramètres de la plateforme';
    return 'Dashboard';
  });

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }
}
