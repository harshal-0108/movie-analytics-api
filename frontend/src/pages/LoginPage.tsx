import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { Alert, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, InputAdornment, Paper, Stack, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => /.+@.+\..+/.test(email) && password.length >= 6, [email, password]);

  const featureHighlights = [
    "Real-time movie portfolio insights",
    "Flexible search, filters, and focus views",
    "Review-driven analytics in one place",
  ];

  const handleSubmit = async () => {
    if (!isValid) {
      setError("Enter a valid email and a password with at least 6 characters.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (submitError) {
      setError((submitError as Error).message || "Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#ffe4e6,_#f8fafc_45%,_#e2e8f0)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.25)]">
        <div className="hidden flex-1 flex-col justify-between bg-slate-950 p-8 text-white lg:flex lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-red-200">
              <AutoAwesomeRoundedIcon fontSize="small" />
              MovieIQ Studio
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight">
              Bring your movie intelligence into sharp focus.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-300">
              A modern workspace for tracking catalog performance, audience sentiment, and review health in one polished dashboard.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-inner shadow-black/30">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/20 text-red-300">
                <LockRoundedIcon />
              </div>
              <div>
                <p className="text-sm font-black text-white">Secure demo access</p>
                <p className="text-sm text-slate-400">Use the requested credentials to continue.</p>
              </div>
            </div>

            <Stack spacing={2}>
              {featureHighlights.map((item) => (
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-200" key={item}>
                  {item}
                </div>
              ))}
            </Stack>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center bg-white p-6 sm:p-8 lg:p-10">
          <Paper className="w-full max-w-md rounded-[2rem] border border-slate-200 p-6 shadow-none sm:p-8" elevation={0}>
            <div className="mb-6">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-red-500">Welcome back</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Sign in to your workspace</h2>
              <p className="mt-2 text-sm text-slate-500">Use the demo account to explore the dashboard experience.</p>
            </div>

            {error && (
              <Alert className="mb-4" severity="error">
                {error}
              </Alert>
            )}

            <div className="space-y-4">
              <TextField
                autoComplete="email"
                fullWidth
                label="Email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="harshal@gmail.com"
                value={email}
              />
              <TextField
                autoComplete="current-password"
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" edge="end" onClick={() => setShowPassword((value) => !value)}>
                          {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                label="Password"
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                value={password}
              />

              <div className="flex items-center justify-between gap-3">
                <FormControlLabel
                  control={<Checkbox checked={rememberMe} onChange={(_, checked) => setRememberMe(checked)} />}
                  label="Remember me"
                />
                <Button color="inherit" size="small" sx={{ textTransform: "none" }}>
                  Forgot password?
                </Button>
              </div>

              <Button
                disabled={loading}
                fullWidth
                onClick={handleSubmit}
                size="large"
                sx={{ borderRadius: "16px", fontWeight: 900, py: 1.3, textTransform: "none" }}
                variant="contained"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <CircularProgress color="inherit" size={18} />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <Button color="inherit" sx={{ borderRadius: "16px", fontWeight: 800, textTransform: "none" }} variant="outlined">
                  Continue with Google
                </Button>
                <Button color="inherit" sx={{ borderRadius: "16px", fontWeight: 800, textTransform: "none" }} variant="outlined">
                  Continue with GitHub
                </Button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Demo credentials: <span className="font-semibold text-slate-900">Harshal</span> / <span className="font-semibold text-slate-900">harshal@gmail.com</span> / <span className="font-semibold text-slate-900">harshal123</span>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
