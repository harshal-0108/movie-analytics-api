import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import LocalMoviesRoundedIcon from "@mui/icons-material/LocalMoviesRounded";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createMovie, deleteMovie, getAnalytics, getMovie, getMovies, updateCurrentUserPreferences, updateMovie } from "../api/moviesApi";
import SettingsPanel from "../components/SettingsPanel";
import AnalyticsCharts from "../components/AnalyticsCharts";
import MovieCard from "../components/MovieCard";
import MovieSkeleton from "../components/MovieSkeleton";
import ReviewSection from "../components/ReviewSection";
import StatCard from "../components/StatCard";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import type { Analytics, Movie, Review, Section } from "../types/movie";
import type { AppearancePreferences, AppNotification, NotificationPreferences, ThemeMode } from "../types/auth";
import {
  getDescription,
  getGenres,
  getHighestRatedMovie,
  getLowestRatedMovie,
  getMovieId,
  getMovieYear,
  getReviewCount,
} from "../utils/movieUtils";

const pageSize = 6;

function MovieDashboard() {
  const { logout, updatePassword, updateProfile, user } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>("Dashboard");
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [genreFilter, setGenreFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [movieForm, setMovieForm] = useState({ genre: "", rating: "4", title: "" });
  const [movieFormMode, setMovieFormMode] = useState<"create" | "edit" | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState("All");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [sort, setSort] = useState("rating-desc");
  const [toast, setToast] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";
    return (window.localStorage.getItem("movie-analytics-theme") as ThemeMode | null) ?? "system";
  });
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem("movie-analytics-notifications") ?? "[]") as AppNotification[];
    } catch {
      return [];
    }
  });
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    if (typeof window === "undefined") return { email: true, movieUpdates: true, push: true, reviewUpdates: true };
    try {
      return JSON.parse(window.localStorage.getItem("movie-analytics-notifications-preferences") ?? "null") as NotificationPreferences;
    } catch {
      return { email: true, movieUpdates: true, push: true, reviewUpdates: true };
    }
  });
  const [appearancePreferences, setAppearancePreferences] = useState<AppearancePreferences>(() => {
    if (typeof window === "undefined") return { animations: true, compactMode: false, fontSize: "medium" };
    try {
      return JSON.parse(window.localStorage.getItem("movie-analytics-appearance") ?? "null") as AppearancePreferences;
    } catch {
      return { animations: true, compactMode: false, fontSize: "medium" };
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("movie-analytics-theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("movie-analytics-notifications-preferences", JSON.stringify(notificationPreferences));
  }, [notificationPreferences]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("movie-analytics-notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("movie-analytics-appearance", JSON.stringify(appearancePreferences));
  }, [appearancePreferences]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.remove("theme-dark", "theme-light");
    document.documentElement.classList.add(themeMode === "dark" ? "theme-dark" : "theme-light");
  }, [themeMode]);

  const sortParams = useMemo(() => {
    if (sort === "rating-asc") return { sort: "rating", order: "asc" as const };
    if (sort === "alpha") return { sort: "title", order: "asc" as const };
    if (sort === "newest") return { sort: "_id", order: "desc" as const };
    return { sort: "rating", order: "desc" as const };
  }, [sort]);

  const pushNotification = useCallback((type: AppNotification["type"], title: string, message: string) => {
    const entry: AppNotification = {
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
      message,
      read: false,
      title,
      type,
    };

    setNotifications((current) => [entry, ...current]);
    setToast(title);
  }, []);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [movieResponse, analyticsResponse] = await Promise.all([
        getMovies({
          page,
          limit: pageSize,
          title: search,
          genre: genreFilter === "All" ? "" : genreFilter,
          ...sortParams,
        }),
        getAnalytics(),
      ]);
      setMovies(movieResponse.data);
      setTotalPages(Math.max(1, movieResponse.totalPages || 1));
      setAnalytics(analyticsResponse);
    } catch (loadError) {
      setError("Could not load movies. Please make sure the NestJS API is running on port 3000.");
      console.error(loadError);
    } finally {
      setLoading(false);
    }
  }, [genreFilter, page, search, sortParams]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    if (reviews.length || !movies.length) return;

    setReviews(
      movies.slice(0, 3).map((movie, index) => ({
        id: `${getMovieId(movie)}-${index}`,
        movieTitle: movie.title,
        reviewer: ["Harshal", "Priya", "Aarav"][index] ?? "Viewer",
        rating: Math.min(5, movie.rating + 0.2),
        content: `Strong ${movie.genre.toLowerCase()} pick with clear portfolio value. The pacing, rating profile, and audience signal make ${movie.title} worth tracking.`,
        createdAt: new Date(Date.now() - index * 86400000).toISOString(),
        helpful: 8 + index,
        likes: 12 + index * 3,
      })),
    );
  }, [movies, reviews.length]);

  const genres = useMemo(() => getGenres(movies), [movies]);
  const genreOptions = useMemo(() => {
    const analyticsGenres = Object.keys(analytics?.genreStats ?? {});
    return Array.from(new Set([...analyticsGenres, ...genres])).sort();
  }, [analytics?.genreStats, genres]);

  const visibleMovies = useMemo(() => {
    const minRating = ratingFilter === "All" ? 0 : Number(ratingFilter);
    return movies.filter((movie) => movie.rating >= minRating);
  }, [movies, ratingFilter]);

  const totalReviews =
    reviews.length || analytics?.totalReviews || movies.reduce((sum, movie) => sum + getReviewCount(movie), 0);

  const toggleSet = (
    setter: Dispatch<SetStateAction<Set<string>>>,
    movie: Movie,
    successText: string,
    removeText: string,
  ) => {
    const id = getMovieId(movie);
    setter((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
        setToast(removeText);
      } else {
        next.add(id);
        setToast(successText);
      }
      return next;
    });
  };

  const openCreateMovie = () => {
    setMovieForm({ genre: genreOptions[0] ?? "", rating: "4", title: "" });
    setSelectedMovie(null);
    setMovieFormMode("create");
  };

  const openEditMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setMovieForm({ genre: movie.genre, rating: String(movie.rating), title: movie.title });
    setMovieFormMode("edit");
  };

  const handleMovieSubmit = async () => {
    const payload = {
      genre: movieForm.genre.trim(),
      rating: Number(movieForm.rating),
      title: movieForm.title.trim(),
    };

    if (!payload.title || !payload.genre || Number.isNaN(payload.rating)) {
      setToast("Movie title, genre, and rating are required");
      return;
    }

    try {
      if (movieFormMode === "edit" && selectedMovie) {
        await updateMovie(getMovieId(selectedMovie), payload);
        pushNotification("movieUpdated", "Movie updated", `${payload.title} was updated.`);
        setToast("Movie updated");
      } else {
        await createMovie(payload);
        pushNotification("movieAdded", "Movie added", `${payload.title} was added to the catalog.`);
        setToast("Movie added");
      }

      setMovieFormMode(null);
      setSelectedMovie(null);
      await loadDashboardData();
    } catch (submitError) {
      setError("Movie save failed. Please check the API and try again.");
      console.error(submitError);
    }
  };

  const handleMovieDetails = async (movie: Movie) => {
    try {
      const freshMovie = await getMovie(getMovieId(movie));
      setSelectedMovie(freshMovie ?? movie);
    } catch (detailsError) {
      console.error(detailsError);
      setSelectedMovie(movie);
    }
  };

  const handleMovieDelete = async () => {
    if (!movieToDelete) return;

    try {
      await deleteMovie(getMovieId(movieToDelete));
      pushNotification("movieDeleted", "Movie deleted", `${movieToDelete.title} was removed.`);
      setToast("Movie deleted");
      setMovieToDelete(null);
      await loadDashboardData();
    } catch (deleteError) {
      setError("Movie delete failed. Please check the API and try again.");
      console.error(deleteError);
    }
  };

  const renderHero = () => (
    <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-200">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
        <div className="flex flex-col justify-between gap-10">
          <div>
            <Chip label="Production dashboard" sx={{ bgcolor: "#ef4444", color: "white", fontWeight: 900 }} />
            <h2 className="mt-5 max-w-3xl text-4xl font-black tracking-normal sm:text-5xl">
              Movie intelligence with executive-level clarity.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Track ratings, genres, reviews, favorites, and watchlist signals in one polished portfolio-ready interface.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Fast insights", "Clean charts", "Movie cards", "Review UX"].map((item) => (
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3" key={item}>
                <p className="text-sm font-black">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-red-300">Top rated</p>
          <h3 className="mt-4 text-3xl font-black">{getHighestRatedMovie(movies, analytics)}</h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Lowest rated title: <span className="font-black text-white">{getLowestRatedMovie(movies, analytics)}</span>
          </p>
          <div className="mt-8 rounded-2xl bg-white p-4 text-slate-950">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Average score</p>
            <p className="mt-2 text-5xl font-black">{(analytics?.averageRating ?? 0).toFixed(1)}</p>
          </div>
        </div>
      </div>
    </section>
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        accent="#ef4444"
        icon={<LocalMoviesRoundedIcon />}
        label="Total Movies"
        value={analytics?.totalMovies ?? movies.length}
      />
      <StatCard
        accent="#0f172a"
        icon={<StarRoundedIcon />}
        label="Average Rating"
        suffix="/5"
        value={analytics?.averageRating ?? 0}
      />
      <StatCard accent="#14b8a6" icon={<RateReviewRoundedIcon />} label="Total Reviews" value={totalReviews} />
      <StatCard
        accent="#f59e0b"
        icon={<AnalyticsRoundedIcon />}
        label="Highest Rated"
        value={getHighestRatedMovie(movies, analytics)}
      />
    </div>
  );

  const renderFilters = () => (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Movie catalog</p>
          <h2 className="text-xl font-black text-slate-950">Search, filter, and manage movies</h2>
        </div>
        <Button
          onClick={openCreateMovie}
          startIcon={<AddRoundedIcon />}
          sx={{ borderRadius: "16px", fontWeight: 900, textTransform: "none" }}
          variant="contained"
        >
          Add Movie
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <TextField
          label="Search movies"
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          value={search}
        />
        <FormControl fullWidth>
          <InputLabel>Genre</InputLabel>
          <Select
            label="Genre"
            onChange={(event) => {
              setGenreFilter(event.target.value);
              setPage(1);
            }}
            value={genreFilter}
          >
            <MenuItem value="All">All genres</MenuItem>
            {genreOptions.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Rating</InputLabel>
          <Select label="Rating" onChange={(event) => setRatingFilter(event.target.value)} value={ratingFilter}>
            <MenuItem value="All">All ratings</MenuItem>
            <MenuItem value="4">4 stars and above</MenuItem>
            <MenuItem value="3">3 stars and above</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Sort</InputLabel>
          <Select label="Sort" onChange={(event) => setSort(event.target.value)} value={sort}>
            <MenuItem value="rating-desc">Rating high to low</MenuItem>
            <MenuItem value="rating-asc">Rating low to high</MenuItem>
            <MenuItem value="alpha">Alphabetically</MenuItem>
            <MenuItem value="newest">Newest by database id</MenuItem>
          </Select>
        </FormControl>
      </div>
    </section>
  );

  const handleNotificationPreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setNotificationPreferences((current) => ({ ...current, [key]: value }));
    setToast("Preferences saved locally");
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const handleAppearanceChange = (key: keyof AppearancePreferences, value: AppearancePreferences[keyof AppearancePreferences]) => {
    setAppearancePreferences((current) => ({ ...current, [key]: value }));
  };

  const handleSaveSettings = async (settings: { appearance: AppearancePreferences; notifications: NotificationPreferences; theme: ThemeMode }) => {
    setThemeMode(settings.theme);
    setAppearancePreferences(settings.appearance);
    setNotificationPreferences(settings.notifications);

    try {
      await updateCurrentUserPreferences({ appearance: settings.appearance, notifications: settings.notifications, theme: settings.theme });
      setToast("Settings saved successfully");
    } catch (saveError) {
      console.error(saveError);
      setToast("Settings saved locally");
    }
  };

  const handleNotificationRead = (id: string) => {
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const handleMarkAllRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const renderMovies = (items = visibleMovies) => (
    <section className="space-y-5">
      {renderFilters()}
      {loading && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <MovieSkeleton key={index} />
          ))}
        </div>
      )}
      {!loading && items.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((movie) => (
              <MovieCard
                favorite={favorites.has(getMovieId(movie))}
                key={getMovieId(movie)}
                movie={movie}
                onDelete={setMovieToDelete}
                onDetails={handleMovieDetails}
                onEdit={openEditMovie}
                onFavorite={(selected) =>
                  toggleSet(setFavorites, selected, `${selected.title} added to favorites`, `${selected.title} removed`)
                }
                onShare={(selected) => setToast(`Share link prepared for ${selected.title}`)}
                onWatchlist={(selected) =>
                  toggleSet(setWatchlist, selected, `${selected.title} added to watchlist`, `${selected.title} removed`)
                }
                watchlisted={watchlist.has(getMovieId(movie))}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Pagination color="primary" count={totalPages} onChange={(_, value) => setPage(value)} page={page} />
          </div>
        </>
      )}
      {!loading && !items.length && (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
          <AutoAwesomeRoundedIcon className="text-red-500" sx={{ fontSize: 48 }} />
          <h3 className="mt-3 text-2xl font-black">No movies found</h3>
          <p className="mt-2 text-slate-500">Try another search, genre, or rating filter.</p>
        </div>
      )}
    </section>
  );

  const favoriteMovies = visibleMovies.filter((movie) => favorites.has(getMovieId(movie)));
  const watchlistMovies = visibleMovies.filter((movie) => watchlist.has(getMovieId(movie)));

  const content = {
    Dashboard: (
      <div className="space-y-6">
        {renderHero()}
        {renderStats()}
        <AnalyticsCharts analytics={analytics} movies={movies} />
        {renderMovies(visibleMovies.slice(0, 3))}
      </div>
    ),
    Movies: renderMovies(),
    Reviews: (
      <ReviewSection
        movies={movies}
        onCreate={(review) => {
          setReviews((current) => [
            {
              ...review,
              createdAt: new Date().toISOString(),
              helpful: 0,
              id: crypto.randomUUID(),
              likes: 0,
            },
            ...current,
          ]);
          setToast("Review published");
        }}
        onDelete={(id) => {
          setReviews((current) => current.filter((review) => review.id !== id));
          setToast("Review deleted");
        }}
        onEdit={(review) => {
          setReviews((current) => current.map((item) => (item.id === review.id ? review : item)));
          setToast("Review updated");
        }}
        onHelpful={(id) =>
          setReviews((current) =>
            current.map((review) => (review.id === id ? { ...review, helpful: review.helpful + 1 } : review)),
          )
        }
        onLike={(id) =>
          setReviews((current) =>
            current.map((review) => (review.id === id ? { ...review, likes: review.likes + 1 } : review)),
          )
        }
        reviews={reviews}
      />
    ),
    Analytics: (
      <div className="space-y-6">
        {renderStats()}
        <AnalyticsCharts analytics={analytics} movies={movies} />
      </div>
    ),
    Favorites: renderMovies(favoriteMovies),
    Watchlist: renderMovies(watchlistMovies),
    Settings: (
      <SettingsPanel
        appearancePreferences={appearancePreferences}
        notificationsPreferences={notificationPreferences}
        onAppearanceChange={handleAppearanceChange}
        onLogout={() => {
          logout();
          setToast("Logged out");
        }}
        onNotificationPreferenceChange={handleNotificationPreferenceChange}
        onSaveSettings={handleSaveSettings}
        onThemeModeChange={handleThemeChange}
        onUpdatePassword={updatePassword}
        onUpdateProfile={updateProfile}
        themeMode={themeMode}
        user={user}
      />
    ),
  } satisfies Record<Section, ReactNode>;

  return (
    <DashboardLayout
      activeSection={activeSection}
      collapsed={collapsed}
      mobileOpen={mobileOpen}
      notifications={notifications}
      onClearNotifications={handleClearNotifications}
      onMarkAllRead={handleMarkAllRead}
      onMarkNotificationRead={handleNotificationRead}
      onMobileClose={() => setMobileOpen(false)}
      onMobileOpen={() => setMobileOpen(true)}
      onNavigate={setActiveSection}
      onSearchChange={(value) => {
        setSearch(value);
        setPage(1);
      }}
      onSidebarToggle={() => setCollapsed((value) => !value)}
      search={search}
    >
      {error && (
        <Alert className="mb-5" severity="error">
          {error}
        </Alert>
      )}
      {content[activeSection]}

      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={() => setSelectedMovie(null)}
        open={Boolean(selectedMovie) && !movieFormMode}
      >
        {selectedMovie && (
          <>
            <DialogTitle sx={{ fontWeight: 900 }}>{selectedMovie.title}</DialogTitle>
            <DialogContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Chip label={selectedMovie.genre} />
                  <Chip label={getMovieYear(selectedMovie)} />
                  <Chip color="warning" label={`${selectedMovie.rating.toFixed(1)} stars`} />
                  <Chip label={`${getReviewCount(selectedMovie)} reviews`} />
                </div>
                <p className="leading-7 text-slate-600">{getDescription(selectedMovie)}</p>
                <Button
                  onClick={() => setSelectedMovie(null)}
                  sx={{ borderRadius: "16px", fontWeight: 900, textTransform: "none" }}
                  variant="contained"
                >
                  Done
                </Button>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={() => {
          setMovieFormMode(null);
          setSelectedMovie(null);
        }}
        open={Boolean(movieFormMode)}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>
          {movieFormMode === "edit" ? "Edit Movie" : "Add Movie"}
        </DialogTitle>
        <DialogContent className="!space-y-4 !pt-2">
          <TextField
            fullWidth
            label="Title"
            onChange={(event) => setMovieForm((current) => ({ ...current, title: event.target.value }))}
            value={movieForm.title}
          />
          <TextField
            fullWidth
            label="Genre"
            onChange={(event) => setMovieForm((current) => ({ ...current, genre: event.target.value }))}
            value={movieForm.genre}
          />
          <TextField
            fullWidth
            label="Rating"
            onChange={(event) => setMovieForm((current) => ({ ...current, rating: event.target.value }))}
            slotProps={{ htmlInput: { max: 5, min: 0, step: 0.1 } }}
            type="number"
            value={movieForm.rating}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setMovieFormMode(null);
              setSelectedMovie(null);
            }}
            sx={{ borderRadius: "14px", fontWeight: 800 }}
          >
            Cancel
          </Button>
          <Button onClick={handleMovieSubmit} sx={{ borderRadius: "14px", fontWeight: 900 }} variant="contained">
            {movieFormMode === "edit" ? "Save Changes" : "Create Movie"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth maxWidth="xs" onClose={() => setMovieToDelete(null)} open={Boolean(movieToDelete)}>
        <DialogTitle sx={{ fontWeight: 900 }}>Delete movie?</DialogTitle>
        <DialogContent>
          <p className="text-slate-600">
            This will call the existing <span className="font-black">DELETE /movies/:id</span> API for{" "}
            <span className="font-black">{movieToDelete?.title}</span>.
          </p>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setMovieToDelete(null)} sx={{ borderRadius: "14px", fontWeight: 800 }}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={handleMovieDelete}
            sx={{ borderRadius: "14px", fontWeight: 900 }}
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar autoHideDuration={2600} onClose={() => setToast("")} open={Boolean(toast)}>
        <Alert severity="success" variant="filled">
          {toast}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default MovieDashboard;
