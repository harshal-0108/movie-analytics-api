import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Drawer, IconButton } from "@mui/material";
import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import type { AppNotification } from "../types/auth";
import type { Section } from "../types/movie";

interface DashboardLayoutProps {
  activeSection: Section;
  children: ReactNode;
  collapsed: boolean;
  mobileOpen: boolean;
  notifications: AppNotification[];
  search: string;
  onNavigate: (section: Section) => void;
  onSearchChange: (value: string) => void;
  onSidebarToggle: () => void;
  onMobileClose: () => void;
  onMobileOpen: () => void;
  onClearNotifications: () => void;
  onMarkAllRead: () => void;
  onMarkNotificationRead: (id: string) => void;
}

function DashboardLayout({
  activeSection,
  children,
  collapsed,
  mobileOpen,
  search,
  notifications,
  onNavigate,
  onSearchChange,
  onSidebarToggle,
  onMobileClose,
  onMobileOpen,
  onClearNotifications,
  onMarkAllRead,
  onMarkNotificationRead,
}: DashboardLayoutProps) {
  const offset = collapsed ? "lg:pl-24" : "lg:pl-72";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Sidebar
        activeSection={activeSection}
        collapsed={collapsed}
        onNavigate={onNavigate}
        onToggle={onSidebarToggle}
      />

      <Drawer anchor="left" onClose={onMobileClose} open={mobileOpen}>
        <div className="relative h-full w-80 bg-white">
          <div className="absolute right-4 top-4 z-10">
            <IconButton onClick={onMobileClose}>
              <CloseRoundedIcon />
            </IconButton>
          </div>
          <Sidebar
            activeSection={activeSection}
            collapsed={false}
            mobile
            onNavigate={(section) => {
              onNavigate(section);
              onMobileClose();
            }}
            onToggle={onMobileClose}
          />
        </div>
      </Drawer>

      <div className={`min-h-screen transition-all duration-300 ${offset}`}>
        <Navbar
          notifications={notifications}
          onClearNotifications={onClearNotifications}
          onMarkAllRead={onMarkAllRead}
          onMarkNotificationRead={onMarkNotificationRead}
          onMenuClick={onMobileOpen}
          onSearchChange={onSearchChange}
          search={search}
          title={activeSection}
        />
        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
