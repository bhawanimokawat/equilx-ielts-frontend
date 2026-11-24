import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "../src/components/ProtectedRoute";

// Landing Page
import LandingPage from "./pages/LandingPage";

// Authentication Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyLoginOtp from "./pages/auth/VerifyLoginOtp";

// Student Pages
import Dashboard from "./pages/student/Dashboard";
import PracticePage from "./pages/student/PracticePage";
import MockTestsPage from "./pages/student/MockTestsPage";
import MockTestAttemptPage from "./pages/student/MockTestAttemptPage";
import StudyResourcesPage from "./pages/student/StudyResourcesPage";
import MyProgressPage from "./pages/student/MyProgressPage";
import AIFeedbackPage from "./pages/student/AIFeedbackPage";
import LiveSpeakingPage from "./pages/student/LiveSpeakingPage";
import ChatPage from "./pages/student/ChatPage";
import SubscriptionPlansPage from "./pages/student/SubscriptionPlansPage";
import SettingsPage from "./pages/student/SettingsPage";

// Institute Pages
import InstituteDashboardPage from "./pages/institute/Dashboard";
import Students from "./pages/institute/Students";
import Trainers from "./pages/institute/Trainers";
import Batches from "./pages/institute/Batches";
import Assignments from "./pages/institute/Assignments";
import ReportsAnalytics from "./pages/institute/ReportsAnalytics";
import CRM from "./pages/institute/CRM";
import StudyResources from "./pages/institute/StudyResources";
import Billing from "./pages/institute/Billing";
import InstituteSettings from "./pages/institute/Settings";

// Super Admin Pages
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import CambridgeContentManager from "./pages/superadmin/CambridgeContentManager";
import StudyMaterialCMS from "./pages/superadmin/StudyMaterialCMS";
import UserInstituteManagement from "./pages/superadmin/UserInstituteManagement";
import PlansPaymentsRefunds from "./pages/superadmin/PlansPaymentsRefunds";
import AISettingsUsage from "./pages/superadmin/AISettingsUsage";
import SystemHealth from "./pages/superadmin/SystemHealth";
import AuditLogs from "./pages/superadmin/AuditLogs";
import SuperAdminSettings from "./pages/superadmin/SuperAdminSettings";

// Trainer Pages
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import StudentList from "./pages/trainer/StudentList";
import StudentReports from "./pages/trainer/StudentReports";
import AssignmentsTrainer from "./pages/trainer/Assignments";
import WritingGradingQueue from "./pages/trainer/WritingGradingQueue";
import LiveSpeakingTest from "./pages/trainer/LiveSpeakingTest";
import Messaging from "./pages/trainer/Messaging";
import LeadsCRM from "./pages/trainer/LeadsCRM";

// Role names must match user.platformRole from your backend.
const ROLES = {
  STUDENT: "STUDENT",
  TRAINER: "TRAINER",
  INSTITUTE: "INSTITUTE_ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
};

// Old / alternate URLs that should keep working: [from, to]
const REDIRECTS = [
  ["/student", "/student/dashboard"],
  ["/student/resources", "/student/study-resources"],
  ["/student/my-progress", "/student/progress"],
  ["/student/my-plan", "/student/plan"],
  ["/dashboard", "/student/dashboard"],
  ["/practice", "/student/practice"],
  ["/mock-tests", "/student/mock-tests"],
  ["/study-resources", "/student/study-resources"],
  ["/progress", "/student/progress"],
  ["/ai-feedback", "/student/ai-feedback"],
  ["/live-speaking", "/student/live-speaking"],
  ["/chat", "/student/chat"],
  ["/plan", "/student/plan"],
  ["/my-plan", "/student/plan"],
  ["/settings", "/student/settings"],
  ["/institute", "/institute/dashboard"],
  ["/superadmin", "/superadmin/dashboard"],
  ["/trainer", "/trainer/dashboard"],
];

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          error: { duration: 5000 },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-login-otp" element={<VerifyLoginOtp />} />

        {/* Redirects (old URLs keep working) */}
        {REDIRECTS.map(([from, to]) => (
          <Route
            key={from}
            path={from}
            element={<Navigate to={to} replace />}
          />
        ))}

        {/* Student Portal */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
          <Route path="/student/dashboard" element={<Dashboard />} />
          <Route path="/student/practice" element={<PracticePage />} />
          <Route path="/student/mock-tests" element={<MockTestsPage />} />
          <Route
            path="/student/mock-test/attempt/:attemptId"
            element={<MockTestAttemptPage />}
          />
          <Route path="/student/study-resources" element={<StudyResourcesPage />} />
          <Route path="/student/progress" element={<MyProgressPage />} />
          <Route path="/student/ai-feedback" element={<AIFeedbackPage />} />
          <Route path="/student/live-speaking" element={<LiveSpeakingPage />} />
          <Route path="/student/chat" element={<ChatPage />} />
          <Route path="/student/plan" element={<SubscriptionPlansPage />} />
          <Route path="/student/settings" element={<SettingsPage />} />
        </Route>

        {/* Institute Portal */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.INSTITUTE]} />}>
          <Route path="/institute/dashboard" element={<InstituteDashboardPage />} />
          <Route path="/institute/students" element={<Students />} />
          <Route path="/institute/trainers" element={<Trainers />} />
          <Route path="/institute/batches" element={<Batches />} />
          <Route path="/institute/assignments" element={<Assignments />} />
          <Route path="/institute/reports" element={<ReportsAnalytics />} />
          <Route path="/institute/crm" element={<CRM />} />
          <Route path="/institute/study-resources" element={<StudyResources />} />
          <Route path="/institute/billing" element={<Billing />} />
          <Route path="/institute/settings" element={<InstituteSettings />} />
        </Route>

        {/* Super Admin Portal */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}>
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
          <Route
            path="/superadmin/cambridge-content"
            element={<CambridgeContentManager />}
          />
          <Route path="/superadmin/study-materials" element={<StudyMaterialCMS />} />
          <Route
            path="/superadmin/users-institutes"
            element={<UserInstituteManagement />}
          />
          <Route
            path="/superadmin/plans-payments"
            element={<PlansPaymentsRefunds />}
          />
          <Route path="/superadmin/ai-settings" element={<AISettingsUsage />} />
          <Route path="/superadmin/system-health" element={<SystemHealth />} />
          <Route path="/superadmin/audit-logs" element={<AuditLogs />} />
          <Route path="/superadmin/settings" element={<SuperAdminSettings />} />
        </Route>

        {/* Trainer Portal */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.TRAINER]} />}>
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          <Route path="/trainer/students" element={<StudentList />} />
          <Route path="/trainer/reports" element={<StudentReports />} />
          <Route path="/trainer/student-reports" element={<StudentReports />} />
          <Route path="/trainer/assignments" element={<AssignmentsTrainer />} />
          <Route path="/trainer/writing-grading" element={<WritingGradingQueue />} />
          <Route path="/trainer/live-speaking" element={<LiveSpeakingTest />} />
          <Route path="/trainer/messaging" element={<Messaging />} />
          <Route path="/trainer/leads" element={<LeadsCRM />} />
        </Route>

        {/* Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
