import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LocalMoviesRoundedIcon from "@mui/icons-material/LocalMoviesRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import type { ReactNode } from "react";
import type { Section } from "../types/movie";

interface SidebarProps {
  activeSection: Section;
  collapsed: boolean;
  mobile?: boolean;
  onNavigate: (section: Section) => void;
  onToggle: () => void;
}

const navItems: Array<{ label: Section; icon: ReactNode }> = [
  { label: "Dashboard", icon: <DashboardRoundedIcon /> },
  { label: "Movies", icon: <LocalMoviesRoundedIcon /> },
  { label: "Reviews", icon: <RateReviewRoundedIcon /> },
  { label: "Analytics", icon: <BarChartRoundedIcon /> },
  { label: "Favorites", icon: <FavoriteRoundedIcon /> },
  { label: "Watchlist", icon: <WatchLaterRoundedIcon /> },
  { label: "Settings", icon: <SettingsRoundedIcon /> },
];

function Sidebar({ activeSection, collapsed, mobile = false, onNavigate, onToggle }: SidebarProps) {
  return (
    <aside
      className={`border-r border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 ${
        mobile ? "flex h-full w-full flex-col" : "fixed inset-y-0 left-0 z-30 hidden lg:flex lg:flex-col"
      } ${collapsed ? "w-24" : "w-72"
      }`}
    >
      <div className="flex h-20 items-center justify-between px-5">
        <button
          className="flex min-w-0 items-center gap-3 text-left"
          onClick={() => onNavigate("Dashboard")}
          type="button"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-lg font-black text-white shadow-lg shadow-slate-900/20">
            M
          </span>
          {!collapsed && (
            <span>
              <span className="block text-lg font-black tracking-normal text-slate-950">MovieIQ</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
                Analytics
              </span>
            </span>
          )}
        </button>

        {!mobile && (
          <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <IconButton onClick={onToggle} size="small">
              <MenuOpenRoundedIcon className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
            </IconButton>
          </Tooltip>
        )}
      </div>

      <nav className="flex-1 space-y-2 px-4 py-3">
        {navItems.map((item) => {
          const active = activeSection === item.label;

          return (
            <Tooltip key={item.label} title={collapsed ? item.label : ""} placement="right">
              <button
                className={`group flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-sm font-bold transition-all duration-200 ${
                  active
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-900/20"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                } ${collapsed ? "justify-center px-0" : ""}`}
                onClick={() => onNavigate(item.label)}
                type="button"
              >
                <span className={active ? "text-red-400" : "text-slate-400 group-hover:text-red-500"}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            </Tooltip>
          );
        })}
      </nav>

      <div className="m-4 rounded-3xl bg-slate-950 p-4 text-white">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <Avatar sx={{ bgcolor: "#ef4444", width: 42, height: 42 }}>H</Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-black">Harshal</p>
              <p className="truncate text-xs text-slate-300">Portfolio Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
