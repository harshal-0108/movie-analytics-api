export interface Movie {
  _id?: string;
  id?: string | number;
  title: string;
  genre: string;
  rating: number;
  year?: number;
  releaseYear?: number;
  description?: string;
  reviewCount?: number;
  createdAt?: string;
}

export interface MoviesResponse {
  data: Movie[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MoviePayload {
  title: string;
  genre: string;
  rating: number;
}

export interface MovieQueryParams {
  page?: number;
  limit?: number;
  title?: string;
  genre?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface Analytics {
  totalMovies: number;
  averageRating: number;
  highestRatedMovie?: string | null;
  lowestRatedMovie?: string | null;
  totalReviews?: number;
  genreStats?: Record<string, number>;
}

export interface Review {
  id: string;
  movieTitle: string;
  reviewer: string;
  rating: number;
  content: string;
  createdAt: string;
  likes: number;
  helpful: number;
}

export type Section =
  | "Dashboard"
  | "Movies"
  | "Reviews"
  | "Analytics"
  | "Favorites"
  | "Watchlist"
  | "Settings";
