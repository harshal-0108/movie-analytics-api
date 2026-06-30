import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Avatar, Badge, Chip, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { AppNotification } from "../types/auth";

interface NavbarProps {
  search: string;
  title: string;
  onMenuClick: () => void;
  onSearchChange: (value: string) => void;
  notifications: AppNotification[];
  onClearNotifications: () => void;
  onMarkAllRead: () => void;
  onMarkNotificationRead: (id: string) => void;
}

function Navbar({
  notifications,
  onClearNotifications,
  onMarkAllRead,
  onMarkNotificationRead,
  onMenuClick,
  onSearchChange,
  search,
  title,
}: NavbarProps) {
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-slate-50/85 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <IconButton className="lg:!hidden" onClick={onMenuClick}>
          <MenuRoundedIcon />
        </IconButton>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">Movie Analytics</p>
          <h1 className="truncate text-xl font-black tracking-normal text-slate-950 sm:text-2xl">{title}</h1>
        </div>

        <label className="hidden h-12 min-w-72 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-red-300 focus-within:ring-4 focus-within:ring-red-100 md:flex">
          <SearchRoundedIcon className="text-slate-400" />
          <input
            className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search movies, genres..."
            value={search}
          />
        </label>

        <Tooltip title="Notifications">
          <IconButton className="!bg-white !shadow-sm" onClick={(event) => setAnchorEl(event.currentTarget)}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {user ? (
          <button
            className="hidden rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-red-200 hover:text-red-600 sm:inline-flex"
            onClick={() => logout()}
            type="button"
          >
            Logout
          </button>
        ) : (
          <button
            className="hidden rounded-full bg-slate-950 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:inline-flex"
            type="button"
          >
            Login
          </button>
        )}

        <Menu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} open={Boolean(anchorEl)}>
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-sm font-black text-slate-950">Notifications</p>
            <div className="flex gap-2">
              <Chip color="primary" label={`${unreadCount} unread`} size="small" />
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-500">You are all caught up.</p>
            ) : (
              notifications.map((item) => (
                <MenuItem key={item.id} onClick={() => onMarkNotificationRead(item.id)} sx={{ alignItems: "flex-start", display: "block", py: 1.5 }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-sm font-black ${item.read ? "text-slate-500" : "text-slate-950"}`}>{item.title}</p>
                      <p className="text-xs text-slate-500">{item.message}</p>
                    </div>
                    {!item.read && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-500" />}
                  </div>
                </MenuItem>
              ))
            )}
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2">
            <button className="text-sm font-semibold text-slate-500" onClick={onMarkAllRead} type="button">
              Mark all read
            </button>
            <button className="text-sm font-semibold text-red-500" onClick={onClearNotifications} type="button">
              Clear all
            </button>
          </div>
        </Menu>

        <Avatar sx={{ bgcolor: "#0f172a", width: 42, height: 42 }}>H</Avatar>
      </div>

      <div className="px-4 pb-4 md:hidden">
        <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
          <SearchRoundedIcon className="text-slate-400" />
          <input
            className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search movies, genres..."
            value={search}
          />
        </label>
      </div>
    </header>
  );
}

export default Navbar;
