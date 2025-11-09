import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { SpotifyService } from '../../services/spotify.service';
import { SpotifyAlbum } from '../../models/spotify.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-album-details',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './album-details.component.html',
  styleUrl: './album-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumDetailsComponent implements OnInit {
  private spotifyService = inject(SpotifyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  album = signal<SpotifyAlbum | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const albumId = this.route.snapshot.paramMap.get('id');

    if (albumId) {
      this.loadAlbum(albumId);
    } else {
      this.error.set('Invalid album ID');
      this.loading.set(false);
    }
  }

  private loadAlbum(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.spotifyService
      .getAlbumById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: album => {
          if (album) {
            this.album.set(album);
          } else {
            this.error.set('Album not found');
          }
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load album details');
          this.loading.set(false);
        },
      });
  }

  getAlbumImage(): string {
    const currentAlbum = this.album();
    if (currentAlbum && currentAlbum.images && currentAlbum.images.length > 0) {
      return currentAlbum.images[0].url;
    }
    return 'assets/placeholder-album.png';
  }

  getArtistNames(): string {
    const currentAlbum = this.album();
    if (currentAlbum) {
      return currentAlbum.artists.map(artist => artist.name).join(', ');
    }
    return '';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  openSpotify(): void {
    const currentAlbum = this.album();
    if (currentAlbum && currentAlbum.external_urls.spotify) {
      window.open(currentAlbum.external_urls.spotify, '_blank');
    }
  }
}
