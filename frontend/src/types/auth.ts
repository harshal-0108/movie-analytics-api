export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export type ThemeMode = "light" | "dark" | "system";

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  movieUpdates: boolean;
  reviewUpdates: boolean;
}

export interface AppearancePreferences {
  compactMode: boolean;
  animations: boolean;
  fontSize: "small" | "medium" | "large";
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "movieAdded" | "movieUpdated" | "movieDeleted" | "reviewAdded";
  read: boolean;
  createdAt: string;
}
