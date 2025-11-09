import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private router = inject(Router);

  currentRoute = signal<string>('Home');

  constructor() {
    // Set initial route
    this.updateCurrentRoute(this.router.url);

    // Listen to route changes
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        untilDestroyed(this)
      )
      .subscribe((event: NavigationEnd) => {
        this.updateCurrentRoute(event.urlAfterRedirects);
      });
  }

  private updateCurrentRoute(url: string): void {
    if (url.includes('/album/')) {
      this.currentRoute.set('Album Details');
    } else if (url.includes('/registration')) {
      this.currentRoute.set('User Registration');
    } else {
      this.currentRoute.set('Home');
    }
  }

  navigateHome(): void {
    this.router.navigate(['/']);
  }
}
