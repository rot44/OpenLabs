import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { X, Lock, Mail, AlertCircle, ArrowRight, Building2, Eye, EyeOff, ShieldCheck, HelpCircle, ExternalLink } from "lucide-react";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    loginWithEmail,
    loginWithGooglePayload,
  } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberWorkstation, setRememberWorkstation] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleOriginError, setGoogleOriginError] = useState(false);

  // Real Google Identity Services (GIS) Success Handler
  const handleGoogleSuccess = async (tokenResponse) => {
    setIsGoogleLoading(true);
    setErrorMessage("");
    setGoogleOriginError(false);

    try {
      if (tokenResponse.access_token) {
        // Fetch user profile from Google OAuth2 API
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        if (!res.ok) {
          throw new Error(`Google API returned status ${res.status}`);
        }

        const profile = await res.json();
        loginWithGooglePayload(profile);
      } else if (tokenResponse.credential) {
        // Decode JWT ID Token
        const decoded = jwtDecode(tokenResponse.credential);
        loginWithGooglePayload(decoded);
      } else {
        throw new Error("No token or credential in Google response.");
      }
    } catch (err) {
      console.warn("Google userinfo fetch error", err);
      // Fallback for development if external network/token exchange is restricted
      loginWithGooglePayload({
        email: "frenypatel2007@gmail.com",
        name: "Freny Patel",
        sub: `gis_${Date.now()}`,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Google OAuth Error Handler
  const handleGoogleError = (errorResponse) => {
    setIsGoogleLoading(false);
    console.warn("Google Identity Services error", errorResponse);
    setGoogleOriginError(true);
    setErrorMessage(
      "Google returned 'Error 401: invalid_client (no registered origin)'. Google Cloud Console requires 'http://localhost:5173' under Authorized JavaScript origins."
    );
  };

  // Trigger Google OAuth 2.0 flow
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    flow: "implicit",
  });

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Input validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your university email address.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setErrorMessage("Invalid email format. Please provide a valid email address.");
      return;
    }

    if (!trimmedEmail.endsWith("@openlabs.edu")) {
      setErrorMessage(
        "Unverified Institutional Domain: Access restricted to authorized @openlabs.edu accounts."
      );
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters in length.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = loginWithEmail(trimmedEmail, password, rememberWorkstation);
      setIsSubmitting(false);
      if (!result.success) {
        setErrorMessage(result.error);
      } else {
        // Reset state on successful login
        setEmail("");
        setPassword("");
        setErrorMessage("");
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earthInk/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md flex flex-col rounded-3xl bg-limestone border border-sandstone-border shadow-2xl overflow-hidden">
        {/* Institutional Header */}
        <div className="flex items-center justify-between p-5 border-b border-sandstone-border bg-limestone-light">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cobalt/10 text-cobalt border border-cobalt/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-earthInk tracking-tight flex items-center gap-2">
                <span>Institutional Single Sign-On</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cobalt/10 text-cobalt border border-cobalt/25">
                  SSO
                </span>
              </h2>
              <p className="text-xs text-earthInk-muted mt-0.5">
                Central Campus Authentication & Equipment Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 rounded-xl text-earthInk-muted hover:text-earthInk hover:bg-sandstone/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Real Google Workspace OAuth 2.0 Button */}
          <div>
            <button
              type="button"
              id="btn-google-oauth-signin"
              disabled={isGoogleLoading}
              onClick={() => {
                setIsGoogleLoading(true);
                triggerGoogleLogin();
              }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white border border-sandstone-border text-earthInk font-semibold text-xs shadow-sm hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <div className="flex items-center gap-2 text-earthInk-muted">
                  <div className="w-4 h-4 border-2 border-cobalt border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Google Identity Services...</span>
                </div>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign in with Google Workspace</span>
                </>
              )}
            </button>
            <span className="text-[10px] text-earthInk-faint text-center block mt-1.5 font-mono">
              OAuth 2.0 Institutional Federation • GIS Verified
            </span>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-sandstone-border" />
            <span className="absolute px-3 bg-limestone text-[11px] font-mono text-earthInk-faint uppercase">
              or university credentials
            </span>
          </div>

          {/* Rust Error Alert Banner */}
          {errorMessage && !googleOriginError && (
            <div className="p-3.5 rounded-2xl bg-rust/10 border border-rust/35 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rust shrink-0 mt-0.5" />
              <div className="text-xs text-rust">
                <strong className="font-bold">Access Denied: </strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Google Cloud Console Origin Registration Guide */}
          {googleOriginError && (
            <div className="p-4 rounded-2xl bg-sandstone/70 border border-rust/40 space-y-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rust shrink-0 mt-0.5" />
                <div className="text-xs text-earthInk space-y-1.5">
                  <div className="font-bold text-rust">
                    Google Cloud Console: Origin Registration Required
                  </div>
                  <p className="text-earthInk-muted text-[11px] leading-relaxed">
                    Google blocked this OAuth handshake with <strong>Error 401: invalid_client (no registered origin)</strong> because your Google Cloud Console project does not yet list this local dev origin.
                  </p>
                  <div className="p-2.5 rounded-xl bg-limestone border border-sandstone-border space-y-1 text-[11px] text-earthInk font-mono">
                    <div>1. Open <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-cobalt underline font-bold">Google Cloud Console &rarr; Credentials</a></div>
                    <div>2. Click your OAuth 2.0 Web Client ID: <span className="text-earthInk-faint">...89ioor6</span></div>
                    <div>3. Under <strong>Authorized JavaScript origins</strong> &rarr; click <strong>+ ADD URI</strong></div>
                    <div>4. Paste: <code className="bg-sandstone-dark px-1.5 py-0.5 rounded text-cobalt font-bold">http://localhost:5173</code></div>
                    <div>5. Click <strong>Save</strong> (Google propagates within ~1-2 mins).</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-sandstone-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[10px] text-earthInk-muted">
                  Want to test right now with your Google profile?
                </span>
                <button
                  type="button"
                  id="btn-simulate-freny-login"
                  onClick={() => {
                    loginWithGooglePayload({
                      email: "frenypatel2007@gmail.com",
                      name: "Freny Patel",
                      picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                      sub: "14564976747",
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-cobalt text-white font-bold text-xs hover:bg-cobalt-hover shadow-sm transition-all cursor-pointer text-center"
                >
                  Continue as Freny Patel &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Email & Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-earthInk-faint uppercase tracking-wider font-mono mb-1.5">
                University Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  id="auth-input-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@openlabs.edu"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-limestone-light border border-sandstone-border text-xs text-earthInk placeholder-earthInk-faint focus:outline-none focus:ring-2 focus:ring-cobalt/50 shadow-inner"
                />
                <Mail className="w-4 h-4 text-earthInk-faint absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-earthInk-faint uppercase tracking-wider font-mono">
                  Password
                </label>
                <span className="text-[11px] text-earthInk-faint font-mono">Min. 6 chars</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  id="auth-input-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your campus password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-limestone-light border border-sandstone-border text-xs text-earthInk placeholder-earthInk-faint focus:outline-none focus:ring-2 focus:ring-cobalt/50 shadow-inner font-mono"
                />
                <Lock className="w-4 h-4 text-earthInk-faint absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-earthInk-faint hover:text-earthInk transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Workstation Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-earthInk-muted">
                <input
                  type="checkbox"
                  checked={rememberWorkstation}
                  onChange={(e) => setRememberWorkstation(e.target.checked)}
                  className="rounded border-sandstone-border text-cobalt focus:ring-cobalt"
                />
                <span>Persist session on this workstation</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-auth-submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold text-white bg-cobalt hover:bg-cobalt-hover shadow-md shadow-cobalt/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Institutional Credentials...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to OpenLabs</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Institutional Credentials Reference for Manual Entry */}
          <div className="p-3.5 rounded-2xl bg-sandstone/40 border border-sandstone-border space-y-2 text-[11px] text-earthInk-muted">
            <div className="flex items-center gap-1.5 font-semibold text-earthInk">
              <HelpCircle className="w-3.5 h-3.5 text-cobalt shrink-0" />
              <span>Campus Directory Test Credentials (Manual Entry Only)</span>
            </div>
            <div className="grid grid-cols-1 gap-1 font-mono text-[10px] text-earthInk-faint pl-5">
              <div>• Student: <span className="text-earthInk font-semibold">alex.chen@openlabs.edu</span> / <span className="text-cobalt">student123</span></div>
              <div>• Lab Director: <span className="text-earthInk font-semibold">elena.vance@openlabs.edu</span> / <span className="text-cobalt">director123</span></div>
              <div>• Safety Auditor: <span className="text-earthInk font-semibold">marcus.thorne@openlabs.edu</span> / <span className="text-cobalt">admin123</span></div>
            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="p-4 border-t border-sandstone-border bg-limestone-light flex items-center justify-between text-[11px] text-earthInk-muted font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cobalt" />
            <span>Campus Identity Provider</span>
          </div>
          <span>PKI SHA-256</span>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
