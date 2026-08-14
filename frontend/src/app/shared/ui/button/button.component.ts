import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type"
      [disabled]="disabled"
      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:opacity-50 disabled:pointer-events-none ring-offset-[var(--background)] px-4 py-2"
      [ngClass]="classes()">
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  
  @Input() set variant(val: ButtonVariant) {
    this._variant.set(val);
  }

  private _variant = signal<ButtonVariant>('primary');

  classes = computed(() => {
    switch (this._variant()) {
      case 'secondary':
        return 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]';
      case 'outline':
        return 'border border-[var(--border)] bg-transparent hover:bg-[var(--muted)] text-[var(--foreground)]';
      case 'ghost':
        return 'bg-transparent hover:bg-[var(--muted)] text-[var(--foreground)]';
      case 'destructive':
        return 'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:opacity-90';
      case 'primary':
      default:
        return 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90';
    }
  });
}
