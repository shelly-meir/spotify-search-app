import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  SpotifyAlbum,
  SpotifySearchResponse,
  SpotifyAuthResponse,
} from '../models/spotify.model';
import { environment } from '../../environments/environment';
import { SearchHistoryService } from './search-history.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private http = inject(HttpClient);
  private searchHistoryService = inject(SearchHistoryService);

  // Signals for state management
  private accessTokenSignal = signal<string | null>(null);
  private searchResultsSignal = signal<SpotifyAlbum[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Public readonly signals
  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly searchResults = this.searchResultsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // Expose search history from the dedicated service
  readonly lastFiveQueries = this.searchHistoryService.lastFiveQueries;

  private readonly SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
  private readonly SPOTIFY_API_URL = 'https://api.spotify.com/v1';

  // Get access token
  getAccessToken(): Observable<string> {
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', environment.spotify.clientId);
    body.set('client_secret', environment.spotify.clientSecret);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post<SpotifyAuthResponse>(this.SPOTIFY_AUTH_URL, body.toString(), { headers })
      .pipe(
        tap(response => {
          this.accessTokenSignal.set(response.access_token);
          this.errorSignal.set(null);
        }),
        map(response => response.access_token),
        catchError(() => {
          this.errorSignal.set('Failed to authenticate with Spotify');
          return of('');
        })
      );
  }

  // Search albums
  searchAlbums(query: string): Observable<SpotifyAlbum[]> {
    if (!query.trim()) {
      this.searchResultsSignal.set([]);
      return of([]);
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const token = this.accessTokenSignal();
    if (!token) {
      this.errorSignal.set('Not authenticated. Please refresh the page.');
      this.loadingSignal.set(false);
      return of([]);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const params = new HttpParams().set('q', query).set('type', 'album').set('limit', '20');

    return this.http
      .get<SpotifySearchResponse>(`${this.SPOTIFY_API_URL}/search`, { headers, params })
      .pipe(
        tap(response => {
          this.searchResultsSignal.set(response.albums.items);
          this.searchHistoryService.addSearchQuery(query);
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
        }),
        map(response => response.albums.items),
        catchError(error => {
          this.loadingSignal.set(false);
          if (error.status === 401) {
            this.errorSignal.set('Authentication expired. Please refresh the page.');
          } else {
            this.errorSignal.set('Failed to search albums. Please try again.');
          }
          this.searchResultsSignal.set([]);
          return of([]);
        })
      );
  }

  // Get album by ID
  getAlbumById(id: string): Observable<SpotifyAlbum | null> {
    const token = this.accessTokenSignal();
    if (!token) {
      this.errorSignal.set('Not authenticated.');
      return of(null);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<SpotifyAlbum>(`${this.SPOTIFY_API_URL}/albums/${id}`, { headers }).pipe(
      catchError(() => {
        this.errorSignal.set('Failed to load album details.');
        return of(null);
      })
    );
  }

  // Clear error
  clearError(): void {
    this.errorSignal.set(null);
  }
}
