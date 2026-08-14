import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors"
      [ngClass]="classes()">
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  @Input() set variant(val: BadgeVariant) {
    this._variant.set(val);
  }

  private _variant = signal<BadgeVariant>('default');

  classes = computed(() => {
    switch (this._variant()) {
      case 'success':
        return 'bg-[var(--success)] text-[var(--success-foreground)]';
      case 'warning':
        return 'bg-[var(--warning)] text-[var(--warning-foreground)]';
      case 'destructive':
        return 'bg-[var(--destructive)] text-[var(--destructive-foreground)]';
      case 'default':
      default:
        return 'bg-[var(--primary)] text-[var(--primary-foreground)]';
    }
  });
}
