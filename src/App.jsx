import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";

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

export default function App() {
  useEffect(() => {
  toast.error("Test error message");
  toast.success("Test success message");
}, []);
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
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-login-otp" element={<VerifyLoginOtp />} />

        {/* Student Portal */}
        <Route
          path="/student"
          element={<Navigate to="/student/dashboard" replace />}
        />

        <Route
          path="/student/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/student/practice"
          element={<PracticePage />}
        />

        <Route
          path="/student/mock-tests"
          element={<MockTestsPage />}
        />

        <Route
          path="/student/study-resources"
          element={<StudyResourcesPage />}
        />

        <Route
          path="/student/resources"
          element={<Navigate to="/student/study-resources" replace />}
        />

        <Route
          path="/student/progress"
          element={<MyProgressPage />}
        />

        <Route
          path="/student/my-progress"
          element={<Navigate to="/student/progress" replace />}
        />

        <Route
          path="/student/ai-feedback"
          element={<AIFeedbackPage />}
        />

        <Route
          path="/student/live-speaking"
          element={<LiveSpeakingPage />}
        />

        <Route
          path="/student/chat"
          element={<ChatPage />}
        />

        <Route
          path="/student/plan"
          element={<SubscriptionPlansPage />}
        />

        <Route
          path="/student/my-plan"
          element={<Navigate to="/student/plan" replace />}
        />

        <Route
          path="/student/settings"
          element={<SettingsPage />}
        />

        {/* Old Student URLs: keep working */}
        <Route
          path="/dashboard"
          element={<Navigate to="/student/dashboard" replace />}
        />

        <Route
          path="/practice"
          element={<Navigate to="/student/practice" replace />}
        />

        <Route
          path="/mock-tests"
          element={<Navigate to="/student/mock-tests" replace />}
        />

        <Route
          path="/study-resources"
          element={<Navigate to="/student/study-resources" replace />}
        />

        <Route
          path="/progress"
          element={<Navigate to="/student/progress" replace />}
        />

        <Route
          path="/ai-feedback"
          element={<Navigate to="/student/ai-feedback" replace />}
        />

        <Route
          path="/live-speaking"
          element={<Navigate to="/student/live-speaking" replace />}
        />

        <Route
          path="/chat"
          element={<Navigate to="/student/chat" replace />}
        />

        <Route
          path="/plan"
          element={<Navigate to="/student/plan" replace />}
        />

        <Route
          path="/my-plan"
          element={<Navigate to="/student/plan" replace />}
        />

        <Route
          path="/settings"
          element={<Navigate to="/student/settings" replace />}
        />

        {/* Institute Portal */}
        <Route
          path="/institute"
          element={<Navigate to="/institute/dashboard" replace />}
        />

        <Route
          path="/institute/dashboard"
          element={<InstituteDashboardPage />}
        />

        <Route path="/institute/students" element={<Students />} />
        <Route path="/institute/trainers" element={<Trainers />} />
        <Route path="/institute/batches" element={<Batches />} />
        <Route path="/institute/assignments" element={<Assignments />} />
        <Route path="/institute/reports" element={<ReportsAnalytics />} />
        <Route path="/institute/crm" element={<CRM />} />

        <Route
          path="/institute/study-resources"
          element={<StudyResources />}
        />

        <Route path="/institute/billing" element={<Billing />} />

        <Route
          path="/institute/settings"
          element={<InstituteSettings />}
        />

        {/* Super Admin Portal */}
        <Route
          path="/superadmin"
          element={<Navigate to="/superadmin/dashboard" replace />}
        />

        <Route
          path="/superadmin/dashboard"
          element={<SuperAdminDashboard />}
        />

        <Route
          path="/superadmin/cambridge-content"
          element={<CambridgeContentManager />}
        />

        <Route
          path="/superadmin/study-materials"
          element={<StudyMaterialCMS />}
        />

        <Route
          path="/superadmin/users-institutes"
          element={<UserInstituteManagement />}
        />

        <Route
          path="/superadmin/plans-payments"
          element={<PlansPaymentsRefunds />}
        />

        <Route
          path="/superadmin/ai-settings"
          element={<AISettingsUsage />}
        />

        <Route
          path="/superadmin/system-health"
          element={<SystemHealth />}
        />

        <Route
          path="/superadmin/audit-logs"
          element={<AuditLogs />}
        />

        <Route
          path="/superadmin/settings"
          element={<SuperAdminSettings />}
        />

        {/* Trainer Portal */}
        <Route
          path="/trainer"
          element={<Navigate to="/trainer/dashboard" replace />}
        />

        <Route
          path="/trainer/dashboard"
          element={<TrainerDashboard />}
        />

        <Route path="/trainer/students" element={<StudentList />} />

        <Route path="/trainer/reports" element={<StudentReports />} />

        <Route
          path="/trainer/student-reports"
          element={<StudentReports />}
        />

        <Route
          path="/trainer/assignments"
          element={<AssignmentsTrainer />}
        />

        <Route
          path="/trainer/writing-grading"
          element={<WritingGradingQueue />}
        />

        <Route
          path="/trainer/live-speaking"
          element={<LiveSpeakingTest />}
        />

        <Route path="/trainer/messaging" element={<Messaging />} />
        <Route path="/trainer/leads" element={<LeadsCRM />} />

        {/* Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
