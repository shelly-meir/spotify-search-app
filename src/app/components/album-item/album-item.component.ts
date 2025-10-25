import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SpotifyAlbum } from '../../models/spotify.model';

@Component({
  selector: 'app-album-item',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './album-item.component.html',
  styleUrl: './album-item.component.scss',
})
export class AlbumItemComponent {
  album = input.required<SpotifyAlbum>();
  albumClick = output<string>();

  getAlbumImage(): string {
    const images = this.album().images;
    return images && images.length > 0 ? images[0].url : 'assets/placeholder-album.png';
  }

  getArtistNames(): string {
    return this.album()
      .artists.map(artist => artist.name)
      .join(', ');
  }

  onAlbumClick(): void {
    this.albumClick.emit(this.album().id);
  }
}
