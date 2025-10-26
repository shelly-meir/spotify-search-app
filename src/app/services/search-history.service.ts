import { Injectable, signal, computed } from '@angular/core';
import { SearchQuery } from '../models/spotify.model';

@Injectable({
  providedIn: 'root',
})
export class SearchHistoryService {
  private readonly STORAGE_KEY = 'spotify_search_queries';
  private searchQueriesSignal = signal<SearchQuery[]>([]);

  // Computed signal for last 5 queries
  readonly lastFiveQueries = computed(() => {
    return this.searchQueriesSignal().slice(-5).reverse();
  });

  constructor() {
    this.loadSearchQueriesFromStorage();
  }

  // Add search query to history
  addSearchQuery(query: string): void {
    const queries = this.searchQueriesSignal();
    const newQuery: SearchQuery = {
      query: query.trim(),
      timestamp: new Date(),
    };

    // Avoid duplicates
    const filtered = queries.filter(
      q => q.query.toLowerCase() !== newQuery.query.toLowerCase()
    );
    const updated = [...filtered, newQuery];

    this.searchQueriesSignal.set(updated);
    this.saveSearchQueriesToStorage(updated);
  }

  // Save queries to localStorage
  private saveSearchQueriesToStorage(queries: SearchQuery[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queries));
    } catch {
      // Silently fail - localStorage might be disabled
    }
  }

  // Load queries from localStorage
  private loadSearchQueriesFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const queries: SearchQuery[] = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const parsedQueries = queries.map(q => ({
          ...q,
          timestamp: new Date(q.timestamp),
        }));
        this.searchQueriesSignal.set(parsedQueries);
      }
    } catch {
      // Silently fail - localStorage might be corrupted
    }
  }
}
