import BookmarkAddRoundedIcon from "@mui/icons-material/BookmarkAddRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { Button, Chip, IconButton, Rating, Tooltip } from "@mui/material";
import type { Movie } from "../types/movie";
import { getDescription, getMovieId, getMovieYear, getReviewCount } from "../utils/movieUtils";

interface MovieCardProps {
  favorite: boolean;
  movie: Movie;
  watchlisted: boolean;
  onDetails: (movie: Movie) => void;
  onDelete?: (movie: Movie) => void;
  onEdit?: (movie: Movie) => void;
  onFavorite: (movie: Movie) => void;
  onShare: (movie: Movie) => void;
  onWatchlist: (movie: Movie) => void;
}

function MovieCard({
  favorite,
  movie,
  watchlisted,
  onDelete,
  onDetails,
  onEdit,
  onFavorite,
  onShare,
  onWatchlist,
}: MovieCardProps) {
  const gradientId = getMovieId(movie).charCodeAt(0) % 5;
  const gradients = [
    "from-red-500 via-slate-900 to-slate-950",
    "from-teal-400 via-slate-800 to-slate-950",
    "from-amber-400 via-red-600 to-slate-950",
    "from-indigo-500 via-slate-800 to-slate-950",
    "from-emerald-400 via-teal-700 to-slate-950",
  ];

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200">
      <div className={`relative aspect-[4/3] bg-gradient-to-br ${gradients[gradientId]} p-4 text-white`}>
        <div className="absolute right-4 top-4 flex gap-2">
          <Tooltip title={favorite ? "Remove favorite" : "Add favorite"}>
            <IconButton className="!bg-white/15 !text-white backdrop-blur" onClick={() => onFavorite(movie)}>
              {favorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={watchlisted ? "In watchlist" : "Add to watchlist"}>
            <IconButton className="!bg-white/15 !text-white backdrop-blur" onClick={() => onWatchlist(movie)}>
              {watchlisted ? <BookmarkRoundedIcon /> : <BookmarkAddRoundedIcon />}
            </IconButton>
          </Tooltip>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Chip
            label={movie.genre}
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "white", fontWeight: 800 }}
          />
          <h3 className="mt-3 text-2xl font-black tracking-normal">{movie.title}</h3>
          <p className="mt-1 text-sm font-semibold text-white/75">{getMovieYear(movie)}</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <StarRoundedIcon className="text-amber-400" />
              <span className="text-lg font-black text-slate-950">{movie.rating.toFixed(1)}</span>
              <span className="text-sm font-bold text-slate-400">/ 5</span>
            </div>
            <Rating precision={0.5} readOnly size="small" value={movie.rating} />
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-slate-950">{getReviewCount(movie)}</p>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Reviews</p>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-500">{getDescription(movie)}</p>

        <div className="flex items-center gap-2">
          <Button
            fullWidth
            onClick={() => onDetails(movie)}
            startIcon={<VisibilityRoundedIcon />}
            sx={{ borderRadius: "16px", fontWeight: 900, textTransform: "none" }}
            variant="contained"
          >
            Details
          </Button>
          <Tooltip title="Share movie">
            <IconButton className="!rounded-2xl !border !border-slate-200" onClick={() => onShare(movie)}>
              <ShareRoundedIcon />
            </IconButton>
          </Tooltip>
          {onEdit && (
            <Tooltip title="Edit movie">
              <IconButton className="!rounded-2xl !border !border-slate-200" onClick={() => onEdit(movie)}>
                <EditRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete movie">
              <IconButton
                className="!rounded-2xl !border !border-red-100 !text-red-500"
                onClick={() => onDelete(movie)}
              >
                <DeleteRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
