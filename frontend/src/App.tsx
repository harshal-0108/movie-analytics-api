import { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { api } from "./api/moviesApi";
import { getAnalytics } from "./api/moviesApi";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

function App() {
  const [movies, setMovies] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

  // ---------------- ANALYTICS DATA ----------------
  const chartData = analytics?.genreStats
    ? Object.entries(analytics.genreStats).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  // ---------------- FETCH MOVIES ----------------
  const fetchMovies = async (customSearch = "", customGenre = "") => {
    try {
      const response = await api.get("/movies", {
        params: {
          page: 1,
          limit: 10,
          title: customSearch,
          genre: customGenre,
        },
      });

      setMovies(response.data.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // ---------------- FETCH ANALYTICS ----------------
  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Analytics error:", error);
    }
  };

  // ---------------- RUN ON LOAD ----------------
  useEffect(() => {
    fetchMovies();
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-6">
        🎬 Movie Analytics Dashboard
      </h1>

      {/* CHART */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Genre Chart</h2>

        {chartData.length > 0 && (
          <PieChart width={400} height={300}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {chartData.map((_, index) => (
                <Cell key={index} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        )}
      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <Card>
          <CardContent>
            <Typography>Total Movies</Typography>
            <Typography variant="h4">
              {analytics?.totalMovies ?? 0}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography>Average Rating</Typography>
            <Typography variant="h4">
              {analytics?.averageRating ?? 0}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography>Top Movie</Typography>
            <Typography variant="h6">
              {analytics?.highestRatedMovie || "No data"}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography>Genres</Typography>

            <div className="text-sm mt-2">
              {analytics?.genreStats
                ? Object.entries(analytics.genreStats).map(([g, c]) => (
                    <div key={g}>
                      {g}: {c}
                    </div>
                  ))
                : "No data"}
            </div>

          </CardContent>
        </Card>

      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-4 mb-6">

        <input
          className="p-2 border rounded w-1/2"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchMovies(e.target.value, genre);
          }}
        />

        <select
          className="p-2 border rounded"
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            fetchMovies(search, e.target.value);
          }}
        >
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Drama">Drama</option>
          <option value="Sci-Fi">Sci-Fi</option>
        </select>

      </div>

      {/* MOVIES LIST */}
      <Card>
        <CardContent>

          <Typography variant="h5" gutterBottom>
            Movies List
          </Typography>

          <div className="divide-y">
            {movies?.length > 0 ? (
              movies.map((movie) => (
                <div key={movie._id} className="py-3">
                  <h3 className="font-semibold">{movie.title}</h3>
                  <p>Genre: {movie.genre}</p>
                  <p>Rating: ⭐ {movie.rating}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No movies found</p>
            )}
          </div>

        </CardContent>
      </Card>

    </div>
  );
}

export default App;