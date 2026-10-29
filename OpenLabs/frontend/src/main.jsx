import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "14564976747-q976l8lsa1384k080j0eg686n89ioor6.apps.googleusercontent.com";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("OpenLabs App ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#E9DFCE] text-[#332F29] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#F6F1E8] border border-[#C8B89E] shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#B65D3F]/15 border border-[#B65D3F]/30 flex items-center justify-center mx-auto text-[#B65D3F] font-bold text-xl">
              !
            </div>
            <h2 className="text-xl font-black text-[#332F29]">Application Exception Recovered</h2>
            <p className="text-xs text-[#332F29]/70 leading-relaxed font-mono bg-[#E9DFCE] p-3 rounded-xl break-words text-left">
              {this.state.error?.message || "Unknown rendering exception"}
            </p>
            <button
              onClick={() => {
                localStorage.removeItem("openlabs_auth_session");
                window.location.reload();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#2547A8] hover:bg-[#1e3a8a] transition-all cursor-pointer shadow-md"
            >
              Reset Session & Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

