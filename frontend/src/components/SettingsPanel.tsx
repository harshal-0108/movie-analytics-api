import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { Avatar, Button, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Switch, Tab, Tabs, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { AppearancePreferences, NotificationPreferences, ThemeMode, UserProfile } from "../types/auth";

interface SettingsPanelProps {
  appearancePreferences: AppearancePreferences;
  notificationsPreferences: NotificationPreferences;
  onAppearanceChange: (key: keyof AppearancePreferences, value: AppearancePreferences[keyof AppearancePreferences]) => void;
  onLogout: () => void;
  onNotificationPreferenceChange: (key: keyof NotificationPreferences, value: boolean) => void;
  onSaveSettings: (settings: { appearance: AppearancePreferences; notifications: NotificationPreferences; theme: ThemeMode }) => Promise<void>;
  onThemeModeChange: (mode: ThemeMode) => void;
  onUpdatePassword: (password: string) => void;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
  themeMode: ThemeMode;
  user: UserProfile | null;
}

function SettingsPanel({
  appearancePreferences,
  notificationsPreferences,
  onAppearanceChange,
  onLogout,
  onNotificationPreferenceChange,
  onSaveSettings,
  onThemeModeChange,
  onUpdatePassword,
  onUpdateProfile,
  themeMode,
  user,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState("account");
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [localAppearance, setLocalAppearance] = useState(appearancePreferences);
  const [localThemeMode, setLocalThemeMode] = useState(themeMode);
  const [localNotifications, setLocalNotifications] = useState(notificationsPreferences);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  useEffect(() => {
    setLocalAppearance(appearancePreferences);
  }, [appearancePreferences]);

  useEffect(() => {
    setLocalThemeMode(themeMode);
  }, [themeMode]);

  useEffect(() => {
    setLocalNotifications(notificationsPreferences);
  }, [notificationsPreferences]);

  const resolvedTheme = useMemo(() => {
    if (typeof window === "undefined") return "light";
    if (localThemeMode === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return localThemeMode;
  }, [localThemeMode]);

  const isDarkTheme = resolvedTheme === "dark";
  const fontSizeMap = { large: "1.02rem", medium: "0.95rem", small: "0.85rem" } as const;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdateProfile({ email, name });
      if (password.trim()) {
        await onUpdatePassword(password);
      }
      onThemeModeChange(localThemeMode);
      onAppearanceChange("compactMode", localAppearance.compactMode);
      onAppearanceChange("animations", localAppearance.animations);
      onAppearanceChange("fontSize", localAppearance.fontSize);
      Object.entries(localNotifications).forEach(([key, value]) => {
        if (value !== notificationsPreferences[key as keyof NotificationPreferences]) {
          onNotificationPreferenceChange(key as keyof NotificationPreferences, value);
        }
      });
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      await onSaveSettings({ appearance: localAppearance, notifications: localNotifications, theme: localThemeMode });
      setPassword("");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setPassword("");
    setLocalAppearance(appearancePreferences);
    setLocalThemeMode(themeMode);
    setLocalNotifications(notificationsPreferences);
  };

  const renderAccount = () => (
    <Paper className="rounded-[2rem] border border-slate-200 p-6 shadow-sm" elevation={0} style={{ backgroundColor: isDarkTheme ? "#0f172a" : "#ffffff", color: isDarkTheme ? "#f8fafc" : "#0f172a" }}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Account</p>
          <h2 className="mt-2 text-2xl font-black">Profile details</h2>
          <p className="mt-2 text-sm" style={{ color: isDarkTheme ? "#cbd5e1" : "#64748b" }}>Keep your identity, password, and workspace profile current.</p>
        </div>
        <div className="flex items-center gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3" style={{ backgroundColor: isDarkTheme ? "#111827" : "#f8fafc", borderColor: isDarkTheme ? "#334155" : "#e2e8f0" }}>
          <Avatar sx={{ bgcolor: "#ef4444", width: 46, height: 46 }}>{user?.avatar ?? "H"}</Avatar>
          <div>
            <p className="font-black">{user?.name ?? "Harshal"}</p>
            <p className="text-sm" style={{ color: isDarkTheme ? "#cbd5e1" : "#64748b" }}>{user?.role ?? "Portfolio Admin"}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <TextField color="primary" fullWidth label="Name" onChange={(event) => setName(event.target.value)} value={name} />
        <TextField color="primary" fullWidth label="Email" onChange={(event) => setEmail(event.target.value)} value={email} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
        <TextField color="primary" fullWidth label="New password" onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} disabled={saving} sx={{ borderRadius: "16px", fontWeight: 900, textTransform: "none" }} variant="contained">
            {saving ? <CircularProgress color="inherit" size={18} /> : "Save changes"}
          </Button>
          <Button onClick={handleCancel} sx={{ borderRadius: "16px", fontWeight: 800, textTransform: "none" }} variant="outlined">
            Cancel
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button color="error" onClick={onLogout} startIcon={<LogoutRoundedIcon />} sx={{ borderRadius: "16px", fontWeight: 900, textTransform: "none" }} variant="contained">
          Logout
        </Button>
      </div>
    </Paper>
  );

  const renderTheme = () => (
    <Paper className="rounded-[2rem] border border-slate-200 p-6 shadow-sm" elevation={0} style={{ backgroundColor: isDarkTheme ? "#0f172a" : "#ffffff", color: isDarkTheme ? "#f8fafc" : "#0f172a" }}>
      <div className="flex items-center gap-3">
        <PaletteRoundedIcon className="text-red-500" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Theme</p>
          <h2 className="text-xl font-black">Appearance mode</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { label: "Light theme", value: "light" as ThemeMode },
          { label: "Dark theme", value: "dark" as ThemeMode },
          { label: "System theme", value: "system" as ThemeMode },
        ].map((item) => (
          <button
            className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${localThemeMode === item.value ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`}
            key={item.value}
            onClick={() => setLocalThemeMode(item.value)}
            type="button"
          >
            <p className="font-black text-slate-950">{item.label}</p>
            <p className="mt-1 text-sm text-slate-500">{item.value === "system" ? "Match your device preference" : `Use the ${item.value} palette`}</p>
          </button>
        ))}
      </div>
    </Paper>
  );

  const renderNotifications = () => (
    <Paper className="rounded-[2rem] border border-slate-200 p-6 shadow-sm" elevation={0} style={{ backgroundColor: isDarkTheme ? "#0f172a" : "#ffffff", color: isDarkTheme ? "#f8fafc" : "#0f172a" }}>
      <div className="flex items-center gap-3">
        <NotificationsRoundedIcon className="text-red-500" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Notifications</p>
          <h2 className="text-xl font-black">Preference center</h2>
        </div>
      </div>

      <Stack className="mt-6" spacing={2}>
        {[
          { key: "email", label: "Email notifications" },
          { key: "push", label: "Push notifications" },
          { key: "movieUpdates", label: "Movie updates" },
          { key: "reviewUpdates", label: "Review notifications" },
        ].map((item) => (
          <Paper className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 px-4 py-3" elevation={0} key={item.key} style={{ backgroundColor: isDarkTheme ? "#111827" : "#f8fafc", borderColor: isDarkTheme ? "#334155" : "#e2e8f0" }}>
            <div>
              <p className="font-black">{item.label}</p>
              <p className="text-sm" style={{ color: isDarkTheme ? "#cbd5e1" : "#64748b" }}>Manage updates for your movie workspace.</p>
            </div>
            <Switch
              checked={localNotifications[item.key as keyof NotificationPreferences]}
              onChange={(_, checked) => setLocalNotifications((current) => ({ ...current, [item.key]: checked }))}
            />
          </Paper>
        ))}
      </Stack>
    </Paper>
  );

  const renderAppearance = () => (
    <Paper className="rounded-[2rem] border border-slate-200 p-6 shadow-sm" elevation={0} style={{ backgroundColor: isDarkTheme ? "#0f172a" : "#ffffff", color: isDarkTheme ? "#f8fafc" : "#0f172a" }}>
      <div className="flex items-center gap-3">
        <TuneRoundedIcon className="text-red-500" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Appearance</p>
          <h2 className="text-xl font-black">Workspace feel</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Paper className="rounded-[1.5rem] border border-slate-200 p-4" elevation={0} style={{ backgroundColor: isDarkTheme ? "#111827" : "#f8fafc", borderColor: isDarkTheme ? "#334155" : "#e2e8f0" }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-black">Compact mode</p>
              <p className="text-sm" style={{ color: isDarkTheme ? "#cbd5e1" : "#64748b" }}>Reduce spacing for a denser workspace.</p>
            </div>
            <Switch checked={localAppearance.compactMode} onChange={(_, checked) => setLocalAppearance((current) => ({ ...current, compactMode: checked }))} />
          </div>
        </Paper>

        <Paper className="rounded-[1.5rem] border border-slate-200 p-4" elevation={0} style={{ backgroundColor: isDarkTheme ? "#111827" : "#f8fafc", borderColor: isDarkTheme ? "#334155" : "#e2e8f0" }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-black">Animations</p>
              <p className="text-sm" style={{ color: isDarkTheme ? "#cbd5e1" : "#64748b" }}>Enable subtle motion in the UI.</p>
            </div>
            <Switch checked={localAppearance.animations} onChange={(_, checked) => setLocalAppearance((current) => ({ ...current, animations: checked }))} />
          </div>
        </Paper>
      </div>

      <div className="mt-4 max-w-md">
        <FormControl fullWidth>
          <InputLabel>Font size</InputLabel>
          <Select label="Font size" onChange={(event) => setLocalAppearance((current) => ({ ...current, fontSize: event.target.value as AppearancePreferences["fontSize"] }))} value={localAppearance.fontSize}>
            <MenuItem value="small">Small</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="large">Large</MenuItem>
          </Select>
        </FormControl>
      </div>
    </Paper>
  );

  return (
    <div className="space-y-6" style={{ fontSize: fontSizeMap[localAppearance.fontSize] }}>
      <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6" style={{ backgroundColor: isDarkTheme ? "#020617" : "#ffffff" }}>
        <div className="flex items-center gap-3">
          <SettingsRoundedIcon className="text-red-500" />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Workspace settings</p>
            <h2 className="text-2xl font-black">Personalize your dashboard</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[220px_1fr]">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-2" style={{ backgroundColor: isDarkTheme ? "#111827" : "#f8fafc", borderColor: isDarkTheme ? "#334155" : "#e2e8f0" }}>
            <Tabs
              orientation="vertical"
              onChange={(_, value) => setActiveTab(value)}
              scrollButtons="auto"
              value={activeTab}
              variant="scrollable"
            >
              <Tab label="Account" value="account" />
              <Tab label="Theme" value="theme" />
              <Tab label="Notifications" value="notifications" />
              <Tab label="Appearance" value="appearance" />
            </Tabs>
          </div>

          <div className="space-y-4">
            {activeTab === "account" && renderAccount()}
            {activeTab === "theme" && renderTheme()}
            {activeTab === "notifications" && renderNotifications()}
            {activeTab === "appearance" && renderAppearance()}
          </div>
        </div>
      </section>
    </div>
  );
}

export default SettingsPanel;
