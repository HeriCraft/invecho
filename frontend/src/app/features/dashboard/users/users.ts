import { Component, ChangeDetectionStrategy, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Page Header & Actions -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 class="text-base font-semibold leading-6 text-slate-900 dark:text-white">Utilisateurs</h2>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Liste de tous les utilisateurs de la plateforme avec leurs rôles et statuts.
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button type="button" class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors">
            Ajouter un utilisateur
          </button>
        </div>
      </div>

      <!-- Filters & Search (Mock) -->
      <div class="flex gap-4 mb-4">
        <div class="relative max-w-sm flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input type="text" [value]="searchQuery()" (input)="updateSearch($event)" placeholder="Rechercher..."
            class="block w-full pl-10 sm:text-sm rounded-md border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm">
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 sm:rounded-lg overflow-hidden transition-colors duration-200">
        
        <!-- Skeleton Loading State -->
        <div *ngIf="isLoading()" class="animate-pulse p-6 space-y-4">
          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div class="space-y-3">
            <div class="h-8 bg-slate-100 dark:bg-slate-800 rounded"></div>
            <div class="h-8 bg-slate-100 dark:bg-slate-800 rounded"></div>
            <div class="h-8 bg-slate-100 dark:bg-slate-800 rounded"></div>
          </div>
        </div>

        <!-- Table -->
        <table *ngIf="!isLoading()" class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead class="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">Nom</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Rôle</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Statut</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Dernière connexion</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
            
            <tr *ngFor="let user of filteredUsers()" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                    {{ user.name[0] }}
                  </div>
                  <div class="ml-4">
                    <div class="font-medium text-slate-900 dark:text-white">{{ user.name }}</div>
                    <div class="text-slate-500 dark:text-slate-400">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-300">
                <div class="inline-flex items-center rounded-md bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 ring-1 ring-inset ring-slate-500/10 dark:ring-slate-400/20">
                  {{ user.role }}
                </div>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                      [ngClass]="{
                        'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20': user.status === 'Active',
                        'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20': user.status === 'Inactive'
                      }">
                  {{ user.status }}
                </span>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{{ user.lastLogin }}</td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Modifier<span class="sr-only">, {{ user.name }}</span></button>
              </td>
            </tr>

            <!-- Empty State -->
            <tr *ngIf="filteredUsers().length === 0">
              <td colspan="5" class="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class Users implements OnInit {
  isLoading = signal(true);
  searchQuery = signal('');
  
  users = signal<User[]>([]);

  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.users().filter(u => 
      u.name.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    // Mock loading data
    setTimeout(() => {
      this.users.set([
        { id: '1', name: 'Granix Admin', email: 'granix@yopmail.com', role: 'SUPER_ADMIN', status: 'Active', lastLogin: 'Il y a 2 heures' },
        { id: '2', name: 'Alice Dupont', email: 'alice@example.com', role: 'MANAGER', status: 'Active', lastLogin: 'Hier' },
        { id: '3', name: 'Bob Martin', email: 'bob@example.com', role: 'USER', status: 'Inactive', lastLogin: 'Le mois dernier' },
      ]);
      this.isLoading.set(false);
    }, 800);
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
