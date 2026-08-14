import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-sm">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {}

@Component({
  selector: 'app-card-header',
  standalone: true,
  template: `
    <div class="flex flex-col space-y-1.5 p-6 pb-4">
      <ng-content></ng-content>
    </div>
  `
})
export class CardHeaderComponent {}

@Component({
  selector: 'app-card-title',
  standalone: true,
  template: `
    <h3 class="font-semibold leading-none tracking-tight text-lg text-[var(--foreground)]">
      <ng-content></ng-content>
    </h3>
  `
})
export class CardTitleComponent {}

@Component({
  selector: 'app-card-content',
  standalone: true,
  template: `
    <div class="p-6 pt-0">
      <ng-content></ng-content>
    </div>
  `
})
export class CardContentComponent {}

@Component({
  selector: 'app-card-footer',
  standalone: true,
  template: `
    <div class="flex items-center p-6 pt-0">
      <ng-content></ng-content>
    </div>
  `
})
export class CardFooterComponent {}
