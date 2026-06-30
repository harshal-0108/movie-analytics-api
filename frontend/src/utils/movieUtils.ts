import type { Analytics, Movie } from "../types/movie";

export const getMovieId = (movie: Movie) => String(movie._id ?? movie.id ?? movie.title);

export const getMovieYear = (movie: Movie) =>
  movie.year ?? movie.releaseYear ?? (movie.createdAt ? new Date(movie.createdAt).getFullYear() : 2026);

export const getReviewCount = (movie: Movie) =>
  movie.reviewCount ?? Math.max(8, Math.round(movie.rating * 12 + movie.title.length));

export const getDescription = (movie: Movie) =>
  movie.description ??
  `${movie.title} is a ${movie.genre.toLowerCase()} title with a ${movie.rating.toFixed(
    1,
  )} audience rating, highlighted here for quick analytics review.`;

export const getGenres = (movies: Movie[]) =>
  Array.from(new Set(movies.map((movie) => movie.genre).filter(Boolean))).sort();

export const getHighestRatedMovie = (movies: Movie[], analytics: Analytics | null) => {
  if (analytics?.highestRatedMovie) return analytics.highestRatedMovie;
  return [...movies].sort((a, b) => b.rating - a.rating)[0]?.title ?? "No data";
};

export const getLowestRatedMovie = (movies: Movie[], analytics: Analytics | null) => {
  if (analytics?.lowestRatedMovie) return analytics.lowestRatedMovie;
  return [...movies].sort((a, b) => a.rating - b.rating)[0]?.title ?? "No data";
};

export const getRatingDistribution = (movies: Movie[]) =>
  [5, 4, 3, 2, 1].map((rating) => ({
    rating: `${rating} star`,
    count: movies.filter((movie) => Math.round(movie.rating) === rating).length,
  }));

export const getTrendData = (movies: Movie[]) =>
  movies.slice(0, 8).map((movie, index) => ({
    name: movie.title.length > 12 ? `${movie.title.slice(0, 12)}...` : movie.title,
    rating: Number(movie.rating.toFixed(1)),
    reviews: getReviewCount(movie),
    index: index + 1,
  }));
