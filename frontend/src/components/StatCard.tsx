import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import type { ReactNode } from "react";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";

interface StatCardProps {
  accent: string;
  icon: ReactNode;
  label: string;
  suffix?: string;
  value: number | string;
}

function StatCard({ accent, icon, label, suffix = "", value }: StatCardProps) {
  const numericValue = typeof value === "number" ? value : Number.NaN;
  const animatedValue = useAnimatedNumber(Number.isNaN(numericValue) ? 0 : numericValue);
  const displayValue =
    typeof value === "number"
      ? `${Number.isInteger(value) ? Math.round(animatedValue) : animatedValue.toFixed(1)}${suffix}`
      : value;

  return (
    <article className="group rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
      <div className="mb-5 flex items-start justify-between gap-4">
        <span
          className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg"
          style={{ backgroundColor: accent }}
        >
          {icon}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-600">
          <TrendingUpRoundedIcon sx={{ fontSize: 16 }} />
          Live
        </span>
      </div>
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <h3 className="mt-2 line-clamp-2 text-3xl font-black tracking-normal text-slate-950">{displayValue}</h3>
    </article>
  );
}

export default StatCard;
