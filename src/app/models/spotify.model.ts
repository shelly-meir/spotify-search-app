export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
  release_date: string;
  total_tracks: number;
  album_type: string;
  external_urls: {
    spotify: string;
  };
  uri: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifySearchResponse {
  albums: {
    items: SpotifyAlbum[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SearchQuery {
  query: string;
  timestamp: Date;
}
