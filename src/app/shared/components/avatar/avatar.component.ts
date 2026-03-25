import { Component, input, computed } from '@angular/core';

const COLORS = [
  'bg-violet-500','bg-blue-500','bg-emerald-500','bg-rose-500',
  'bg-amber-500','bg-cyan-500','bg-pink-500','bg-indigo-500',
];

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    <div class="relative inline-flex shrink-0" [style.width.px]="px()" [style.height.px]="px()">
      @if (imageUrl()) {
        <img [src]="imageUrl()" [alt]="name()"
          class="rounded-full object-cover w-full h-full" />
      } @else {
        <div class="rounded-full w-full h-full flex items-center justify-center text-white font-semibold select-none"
          [class]="bgColor()" [style.fontSize.px]="px() * 0.38">
          {{ initials() }}
        </div>
      }
      @if (showOnline()) {
        <span class="absolute bottom-0 right-0 block rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-900"
          [style.width.px]="px() * 0.28" [style.height.px]="px() * 0.28"></span>
      }
    </div>
  `
})
export class AvatarComponent {
  imageUrl = input<string | undefined>();
  name = input.required<string>();
  size = input<'sm' | 'md' | 'lg'>('md');
  showOnline = input<boolean>(false);

  px = computed(() => ({ sm: 32, md: 40, lg: 56 }[this.size()]));

  initials = computed(() => {
    const parts = this.name().trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : (parts[0][0] ?? '?').toUpperCase();
  });

  bgColor = computed(() => {
    let hash = 0;
    for (const c of this.name()) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
    return COLORS[Math.abs(hash) % COLORS.length];
  });
}
