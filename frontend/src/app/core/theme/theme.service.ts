import { Injectable, signal, effect, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly currentTheme = signal<Theme>('dark');
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.initTheme();

      // Listen to OS preference changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('invecho_theme')) {
          this.setTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    }

    // Effect to apply theme changes to DOM and save to localStorage
    effect(() => {
      const theme = this.currentTheme();
      if (this.isBrowser) {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
  }

  private initTheme() {
    const savedTheme = localStorage.getItem('invecho_theme') as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      this.currentTheme.set(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme.set(prefersDark ? 'dark' : 'light');
    }
  }

  setTheme(theme: Theme, save: boolean = true) {
    this.currentTheme.set(theme);
    if (this.isBrowser && save) {
      localStorage.setItem('invecho_theme', theme);
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
}
