import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 class="text-base font-semibold leading-6 text-slate-900 dark:text-white">Paramètres de la plateforme</h2>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Gérez les paramètres globaux et les configurations système.
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-slate-200 dark:border-slate-800">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button *ngFor="let tab of tabs" 
                  (click)="activeTab.set(tab.id)"
                  [class.border-indigo-500]="activeTab() === tab.id"
                  [class.text-indigo-600]="activeTab() === tab.id"
                  [class.dark:text-indigo-400]="activeTab() === tab.id"
                  [class.border-transparent]="activeTab() !== tab.id"
                  [class.text-slate-500]="activeTab() !== tab.id"
                  [class.hover:border-slate-300]="activeTab() !== tab.id"
                  [class.hover:text-slate-700]="activeTab() !== tab.id"
                  [class.dark:text-slate-400]="activeTab() !== tab.id"
                  [class.dark:hover:text-slate-300]="activeTab() !== tab.id"
                  class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors">
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- General Settings Tab -->
      <div *ngIf="activeTab() === 'general'" class="space-y-6">
        <div class="bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 sm:rounded-lg transition-colors">
          <div class="px-4 py-6 sm:p-8">
            <div class="max-w-2xl space-y-6">
              
              <div>
                <label for="company-name" class="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Nom de l'entreprise</label>
                <div class="mt-2">
                  <input type="text" id="company-name" [ngModel]="companyName()" (ngModelChange)="companyName.set($event)"
                    class="block w-full rounded-md border-0 py-1.5 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white dark:bg-slate-800 transition-colors">
                </div>
              </div>

              <div>
                <label for="support-email" class="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Email de support</label>
                <div class="mt-2">
                  <input type="email" id="support-email" [ngModel]="supportEmail()" (ngModelChange)="supportEmail.set($event)"
                    class="block w-full rounded-md border-0 py-1.5 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white dark:bg-slate-800 transition-colors">
                </div>
              </div>

              <div class="flex items-center gap-x-3">
                <input id="maintenance-mode" type="checkbox" [ngModel]="maintenanceMode()" (ngModelChange)="maintenanceMode.set($event)"
                  class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 transition-colors">
                <label for="maintenance-mode" class="text-sm font-medium leading-6 text-slate-900 dark:text-white">Activer le mode maintenance</label>
              </div>

            </div>
          </div>
          <div class="flex items-center justify-end gap-x-6 border-t border-slate-200 dark:border-slate-800 px-4 py-4 sm:px-8">
            <button type="button" class="text-sm font-semibold leading-6 text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-slate-300">Annuler</button>
            <button type="button" (click)="saveSettings()" [disabled]="isSaving()"
              class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-colors">
              <span *ngIf="!isSaving()">Enregistrer</span>
              <span *ngIf="isSaving()">Enregistrement...</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Security Tab (Empty State) -->
      <div *ngIf="activeTab() === 'security'" class="text-center py-12 bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 sm:rounded-lg transition-colors">
        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <h3 class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">Sécurité avancée</h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Les paramètres de sécurité (SSO, 2FA) seront bientôt disponibles.</p>
      </div>

      <!-- Toast Notification -->
      <div *ngIf="showToast()" class="fixed bottom-4 right-4 z-50 animate-fade-in-up">
        <div class="rounded-md bg-green-50 dark:bg-green-500/10 p-4 ring-1 ring-green-600/20 dark:ring-green-500/20 shadow-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800 dark:text-green-400">
                Paramètres enregistrés avec succès
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class Settings {
  tabs = [
    { id: 'general', name: 'Général' },
    { id: 'security', name: 'Sécurité' },
  ];

  activeTab = signal('general');
  isSaving = signal(false);
  showToast = signal(false);

  companyName = signal('Invecho Inc.');
  supportEmail = signal('support@invecho.com');
  maintenanceMode = signal(false);

  saveSettings() {
    this.isSaving.set(true);
    
    setTimeout(() => {
      this.isSaving.set(false);
      this.showToast.set(true);
      
      setTimeout(() => {
        this.showToast.set(false);
      }, 3000);
    }, 1000);
  }
}
