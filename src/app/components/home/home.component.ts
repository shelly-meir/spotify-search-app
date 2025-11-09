import { Component, inject, signal, effect, OnInit, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SpotifyService } from '../../services/spotify.service';
import { AlbumItemComponent } from '../album-item/album-item.component';
import { SpotifyAlbum } from '../../models/spotify.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    ScrollingModule,
    AlbumItemComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private spotifyService = inject(SpotifyService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  searchQuery = signal<string>('');
  itemsPerRow = signal<number>(3);
  itemHeight = 320;

  searchResults = this.spotifyService.searchResults;
  loading = this.spotifyService.loading;
  lastFiveQueries = this.spotifyService.lastFiveQueries;
  apiError = this.spotifyService.error;

  constructor() {
    effect(() => {
      const error = this.spotifyService.error();
      if (error) {
        this.snackBar.open(error, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.spotifyService.clearError();
      }
    });
    this.updateItemsPerRow();
  }

  ngOnInit(): void {
    this.spotifyService
      .getAccessToken()
      .pipe(untilDestroyed(this))
      .subscribe({
        error: () => {
          this.snackBar.open('Failed to connect to Spotify. Please check your credentials.', 'Close', {
            duration: 5000,
          });
        },
      });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateItemsPerRow();
  }

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.spotifyService
        .searchAlbums(query)
        .pipe(untilDestroyed(this))
        .subscribe();
    }
  }

  onQueryChipClick(query: string): void {
    this.searchQuery.set(query);
    this.onSearch();
  }

  onAlbumClick(albumId: string): void {
    this.router.navigate(['/album', albumId]);
  }

  onRetry(): void {
    this.spotifyService.clearError();
    if (this.searchQuery().trim()) {
      this.onSearch();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  getRowIndices(): number[] {
    const totalRows = Math.ceil(this.searchResults().length / this.itemsPerRow());
    return Array.from({ length: totalRows }, (_, i) => i);
  }

  getAlbumsForRow(rowIndex: number): SpotifyAlbum[] {
    const start = rowIndex * this.itemsPerRow();
    const end = start + this.itemsPerRow();
    return this.searchResults().slice(start, end);
  }

  private updateItemsPerRow(): void {
    const width = window.innerWidth;
    if (width < 768) {
      this.itemsPerRow.set(1);
    } else if (width < 1024) {
      this.itemsPerRow.set(3);
    } else if (width < 1400) {
      this.itemsPerRow.set(4);
    } else {
      this.itemsPerRow.set(5);
    }
  }
}
