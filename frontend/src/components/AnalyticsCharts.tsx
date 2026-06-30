import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ReactNode } from "react";
import type { Analytics, Movie } from "../types/movie";
import { getRatingDistribution, getTrendData } from "../utils/movieUtils";

interface AnalyticsChartsProps {
  analytics: Analytics | null;
  movies: Movie[];
}

const colors = ["#ef4444", "#0f172a", "#14b8a6", "#f59e0b", "#6366f1", "#84cc16"];

function ChartCard({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">{eyebrow}</p>
      <h2 className="mt-1 text-lg font-black text-slate-950">{title}</h2>
      <div className="mt-5 h-72">{children}</div>
    </section>
  );
}

function AnalyticsCharts({ analytics, movies }: AnalyticsChartsProps) {
  const genreData = Object.entries(analytics?.genreStats ?? {}).map(([name, value]) => ({ name, value }));
  const trendData = getTrendData(movies);
  const ratingData = getRatingDistribution(movies);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <ChartCard eyebrow="Genre split" title="Genre distribution">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={genreData}
              dataKey="value"
              innerRadius={62}
              nameKey="name"
              outerRadius={96}
              paddingAngle={4}
            >
              {genreData.map((entry, index) => (
                <Cell fill={colors[index % colors.length]} key={entry.name} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard eyebrow="Performance" title="Rating by movie">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={trendData}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="rating" fill="#ef4444" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard eyebrow="Reviews" title="Review momentum">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={trendData}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="index" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip />
            <Line dataKey="reviews" dot={{ r: 4 }} stroke="#0f172a" strokeWidth={3} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard eyebrow="Audience" title="Rating distribution">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={ratingData}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="rating" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip />
            <Area dataKey="count" fill="#fee2e2" stroke="#ef4444" strokeWidth={3} type="monotone" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

export default AnalyticsCharts;
