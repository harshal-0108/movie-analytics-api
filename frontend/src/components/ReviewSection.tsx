import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { Movie, Review } from "../types/movie";

interface ReviewSectionProps {
  movies: Movie[];
  reviews: Review[];
  onCreate: (review: Omit<Review, "id" | "createdAt" | "helpful" | "likes">) => void;
  onDelete: (id: string) => void;
  onEdit: (review: Review) => void;
  onHelpful: (id: string) => void;
  onLike: (id: string) => void;
}

const today = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });

function ReviewSection({ movies, reviews, onCreate, onDelete, onEdit, onHelpful, onLike }: ReviewSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [movieTitle, setMovieTitle] = useState("");
  const [reviewer, setReviewer] = useState("Harshal");
  const [rating, setRating] = useState(4);
  const [content, setContent] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  const averageScore = useMemo(
    () => reviews.reduce((sum, review) => sum + review.rating, 0) / (reviews.length || 1),
    [reviews],
  );

  const openCreate = () => {
    setEditing(null);
    setMovieTitle(movies[0]?.title ?? "");
    setReviewer("Harshal");
    setRating(4);
    setContent("");
    setDialogOpen(true);
  };

  const openEdit = (review: Review) => {
    setEditing(review);
    setMovieTitle(review.movieTitle);
    setReviewer(review.reviewer);
    setRating(review.rating);
    setContent(review.content);
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!movieTitle || !content.trim()) return;

    if (editing) {
      onEdit({ ...editing, movieTitle, reviewer, rating, content });
    } else {
      onCreate({ movieTitle, reviewer, rating, content });
    }

    setDialogOpen(false);
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 rounded-[2rem] bg-slate-950 p-6 text-white sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">Review studio</p>
          <h2 className="mt-2 text-2xl font-black tracking-normal">Audience feedback</h2>
          <p className="mt-2 text-sm text-slate-300">
            {reviews.length} reviews with an average score of {averageScore.toFixed(1)}.
          </p>
        </div>
        <Button
          onClick={openCreate}
          startIcon={<AddRoundedIcon />}
          sx={{ borderRadius: "16px", bgcolor: "white", color: "#0f172a", fontWeight: 900, textTransform: "none" }}
          variant="contained"
        >
          Add Review
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {reviews.map((review) => (
          <article
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200"
            key={review.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar sx={{ bgcolor: "#ef4444" }}>{review.reviewer.charAt(0).toUpperCase()}</Avatar>
                <div className="min-w-0">
                  <h3 className="truncate font-black text-slate-950">{review.reviewer}</h3>
                  <p className="truncate text-sm font-bold text-slate-500">{review.movieTitle}</p>
                </div>
              </div>
              <p className="shrink-0 text-xs font-bold text-slate-400">
                {today.format(new Date(review.createdAt))}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Rating precision={0.5} readOnly size="small" value={review.rating} />
              <span className="text-sm font-black text-slate-700">{review.rating.toFixed(1)}</span>
            </div>

            <p className="mt-4 leading-7 text-slate-600">{review.content}</p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <Button
                  onClick={() => onLike(review.id)}
                  size="small"
                  startIcon={<ThumbUpRoundedIcon />}
                  sx={{ borderRadius: "14px", fontWeight: 800, textTransform: "none" }}
                  variant="outlined"
                >
                  {review.likes}
                </Button>
                <Button
                  onClick={() => onHelpful(review.id)}
                  size="small"
                  sx={{ borderRadius: "14px", fontWeight: 800, textTransform: "none" }}
                  variant="outlined"
                >
                  Helpful {review.helpful}
                </Button>
              </div>
              <div>
                <Tooltip title="Edit review">
                  <IconButton onClick={() => openEdit(review)}>
                    <EditRoundedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete review">
                  <IconButton color="error" onClick={() => setDeleteTarget(review)}>
                    <DeleteRoundedIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Dialog fullWidth maxWidth="sm" onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <DialogTitle sx={{ fontWeight: 900 }}>{editing ? "Edit Review" : "Write Review"}</DialogTitle>
        <DialogContent className="!space-y-4 !pt-2">
          {movies.length > 0 ? (
            <FormControl fullWidth>
              <InputLabel>Movie title</InputLabel>
              <Select
                label="Movie title"
                onChange={(event) => setMovieTitle(event.target.value)}
                value={movieTitle}
              >
                {movies.map((movie) => (
                  <MenuItem key={movie._id ?? movie.title} value={movie.title}>
                    {movie.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              label="Movie title"
              onChange={(event) => setMovieTitle(event.target.value)}
              value={movieTitle}
            />
          )}
          <TextField fullWidth label="Reviewer" onChange={(event) => setReviewer(event.target.value)} value={reviewer} />
          <div>
            <p className="mb-2 text-sm font-bold text-slate-600">Score</p>
            <Rating onChange={(_, value) => setRating(value ?? 1)} precision={0.5} value={rating} />
          </div>
          <TextField
            fullWidth
            label="Review"
            minRows={4}
            multiline
            onChange={(event) => setContent(event.target.value)}
            value={content}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: "14px", fontWeight: 800 }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} sx={{ borderRadius: "14px", fontWeight: 900 }} variant="contained">
            {editing ? "Save" : "Publish"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth maxWidth="xs" onClose={() => setDeleteTarget(null)} open={Boolean(deleteTarget)}>
        <DialogTitle sx={{ fontWeight: 900 }}>Delete review?</DialogTitle>
        <DialogContent>
          <p className="text-slate-600">
            This removes the review for <span className="font-black">{deleteTarget?.movieTitle}</span> from the current
            dashboard session.
          </p>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ borderRadius: "14px", fontWeight: 800 }}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={() => {
              if (deleteTarget) onDelete(deleteTarget.id);
              setDeleteTarget(null);
            }}
            sx={{ borderRadius: "14px", fontWeight: 900 }}
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}

export default ReviewSection;
