import axios from "axios";
import type { AppearancePreferences, NotificationPreferences, ThemeMode, UserProfile } from "../types/auth";
import type { Analytics, Movie, MoviePayload, MovieQueryParams, MoviesResponse } from "../types/movie";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

export interface UserPreferencesPayload {
  theme?: ThemeMode;
  notifications?: NotificationPreferences;
  appearance?: AppearancePreferences;
}

export interface UserProfilePayload {
  name?: string;
  email?: string;
  password?: string;
}

export const getAnalytics = async () => {
  const res = await api.get<Analytics>("/movies/analytics");
  return res.data;
};

export const getMovies = async (params?: MovieQueryParams) => {
  const res = await api.get<MoviesResponse>("/movies", { params });
  return res.data;
};

export const getMovie = async (id: string) => {
  const res = await api.get<Movie>(`/movies/${id}`);
  return res.data;
};

export const createMovie = async (payload: MoviePayload) => {
  const res = await api.post<Movie>("/movies", payload);
  return res.data;
};

export const updateMovie = async (id: string, payload: MoviePayload) => {
  const res = await api.put<Movie>(`/movies/${id}`, payload);
  return res.data;
};

export const deleteMovie = async (id: string) => {
  const res = await api.delete<Movie>(`/movies/${id}`);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get<UserProfile>("/users/me");
  return res.data;
};

export const updateCurrentUserProfile = async (payload: UserProfilePayload) => {
  const res = await api.put<UserProfile>("/users/me", payload);
  return res.data;
};

export const updateCurrentUserPreferences = async (payload: UserPreferencesPayload) => {
  const res = await api.put<UserProfile>("/users/me/preferences", payload);
  return res.data;
};
