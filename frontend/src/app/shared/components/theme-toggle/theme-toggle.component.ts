import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button 
      (click)="themeService.toggleTheme()" 
      class="relative inline-flex items-center justify-center p-2 rounded-full transition-colors duration-200 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label="Basculer le thème">
      
      <!-- Sun Icon (Light Mode) -->
      <svg 
        *ngIf="themeService.currentTheme() === 'light'"
        xmlns="http://www.w3.org/2000/svg" 
        class="h-6 w-6 animate-spin-slow" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>

      <!-- Moon Icon (Dark Mode) -->
      <svg 
        *ngIf="themeService.currentTheme() === 'dark'"
        xmlns="http://www.w3.org/2000/svg" 
        class="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  `,
  styles: [`
    .animate-spin-slow {
      animation: spin 8s linear infinite;
    }
  `]
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
