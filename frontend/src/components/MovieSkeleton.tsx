import { Skeleton } from "@mui/material";

function MovieSkeleton() {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <Skeleton height={230} variant="rectangular" />
      <div className="space-y-4 p-5">
        <Skeleton height={30} width="70%" />
        <Skeleton height={24} width="45%" />
        <Skeleton height={64} variant="rounded" />
        <Skeleton height={44} variant="rounded" />
      </div>
    </article>
  );
}

export default MovieSkeleton;
