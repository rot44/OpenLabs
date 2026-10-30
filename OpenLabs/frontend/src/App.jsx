import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { NavigationHeader } from "./components/common/NavigationHeader";
import { ResourceCatalog } from "./components/catalog/ResourceCatalog";
import { MyBookingsList } from "./components/custody/MyBookingsList";
import { ManagerDashboard } from "./components/dashboard/ManagerDashboard";
import { AuditAndFairnessView } from "./components/audit/AuditAndFairnessView";
import { InstitutionalAccessGate } from "./components/common/InstitutionalAccessGate";
import { AuthModal } from "./components/auth/AuthModal";
import { VideoWalkthroughModal } from "./components/video/VideoWalkthroughModal";

function MainContent() {
  const {
    activeTab,
    bannerNotice,
    isAuthenticated,
    activePersona,
    authSession,
    isVideoModalOpen,
    closeVideoModal,
  } = useApp();

  const isPendingClearance = authSession?.status === "pending_clearance";

  return (
    <div className="min-h-screen bg-sandstone text-earthInk flex flex-col font-sans">
      {/* Sticky Main Navigation Header with Embedded Logo & Profile Menu */}
      <NavigationHeader />

      {/* System Banner Notice */}
      {bannerNotice && (
        <div className="bg-weathered/40 border-b border-sandstone-border px-4 py-1.5 text-center text-xs text-earthInk animate-in fade-in">
          <span>{bannerNotice}</span>
        </div>
      )}

      {/* Main Tab Router View with RBAC Clearance Enforcement */}
      <main className="flex-1 pb-16">
        {activeTab === "catalog" && <ResourceCatalog />}

        {activeTab === "custody" &&
          (isPendingClearance ? (
            <InstitutionalAccessGate
              type="clearance_pending"
              tabName="My Custody & Active Bookings"
            />
          ) : !isAuthenticated ? (
            <InstitutionalAccessGate
              type="auth_required"
              tabName="My Custody & Active Bookings"
            />
          ) : (
            <MyBookingsList />
          ))}

        {activeTab === "manager" &&
          (isPendingClearance ? (
            <InstitutionalAccessGate
              type="clearance_pending"
              tabName="Lab Director Control Center"
            />
          ) : !isAuthenticated ? (
            <InstitutionalAccessGate
              type="auth_required"
              tabName="Lab Director Control Center"
            />
          ) : activePersona.role === "requester" ? (
            <InstitutionalAccessGate
              type="faculty_required"
              tabName="Lab Director Hub"
            />
          ) : (
            <ManagerDashboard />
          ))}

        {activeTab === "audit" &&
          (isPendingClearance ? (
            <InstitutionalAccessGate
              type="clearance_pending"
              tabName="Campus Safety & Fairness Ledger"
            />
          ) : !isAuthenticated ? (
            <InstitutionalAccessGate
              type="auth_required"
              tabName="Campus Safety & Fairness Ledger"
            />
          ) : activePersona.role === "requester" ? (
            <InstitutionalAccessGate
              type="admin_required"
              tabName="Audit & Fairness Ledger"
            />
          ) : (
            <AuditAndFairnessView />
          ))}
      </main>

      {/* Institutional SSO & Auth Modal */}
      <AuthModal />

      {/* 3-Minute Interactive AI Video Walkthrough & Voiceover Demo */}
      <VideoWalkthroughModal isOpen={isVideoModalOpen} onClose={closeVideoModal} />

      {/* Institutional Footer */}
      <footer className="border-t border-sandstone-border bg-limestone/60 px-4 py-6 text-center text-xs text-earthInk-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cobalt" />
            <span className="text-earthInk font-semibold">OpenLabs AI</span>
            <span>— Institutional Resource & Equipment Sharing Platform</span>
          </div>
          <div className="text-[11px] font-mono text-earthInk-muted">
            Institutional Equipment & Core Facility Ledger • OpenLabs Protocol v2.4
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

