
import React, { useCallback, useEffect, useState } from "react";
import StudentLayout from "./StudentLayout";
import {
  UserRound,
  Bell,
  ShieldCheck,
  Eye,
  EyeOff,
  Camera,
  Mail,
  Phone,
  Globe,
  Clock,
  Save,
  Check,
  ChevronRight,
  ChevronDown,
  Monitor,
  Moon,
  Sun,
  Laptop,
  LogOut,
  Trash2,
  Languages,
  CircleHelp,
  AlertTriangle,
  X,
  Settings as SettingsIcon,
  CheckCircle2,
  Palette,
  LoaderCircle,
} from "lucide-react";
import settingsService from "../../services/settingsService";

// ======================================================
// LOCAL PREFERENCES
// These settings have no persistence API in the backend.
// ======================================================

const initialNotifications = {
  emailUpdates: true,
  practiceReminders: true,
  progressReports: true,
  courseAnnouncements: true,
  speakingReminders: false,
  promotionalEmails: false,
};

const initialPreferences = {
  appearance: "Light",
  dashboardDensity: "Comfortable",
  soundEffects: false,
  weeklyGoal: "5 hours",
};

const sections = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "preferences", label: "Preferences", icon: SettingsIcon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
];

// ======================================================
// SMALL COMPONENTS
// ======================================================

function SettingsToggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
        checked ? "bg-[#FF2454]" : "bg-[#D9E0ED]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SettingsRow({
  title,
  description,
  checked,
  onChange,
  last = false,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-4 ${
        last ? "" : "border-b border-[#EEF1F8] dark:border-[#49333D]"
      }`}
    >
      <div className="min-w-0">
        <p className="text-xs font-bold text-[#10265F] dark:text-[#FFF8FA]">
          {title}
        </p>
        <p className="mt-1 text-[11px] leading-5 text-[#8290AA] dark:text-[#C1B5C0]">
          {description}
        </p>
      </div>

      <SettingsToggle
        checked={checked}
        onChange={onChange}
        label={title}
      />
    </div>
  );
}

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF2454]">
        <Icon size={19} />
      </span>

      <div>
        <h2 className="text-base font-black text-[#10265F] dark:text-[#FFF8FA]">
          {title}
        </h2>
        <p className="mt-1 text-[11px] leading-5 text-[#8290AA] dark:text-[#C1B5C0]">
          {description}
        </p>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#E4EAF5] bg-white px-3 py-3 text-xs text-[#10265F] outline-none transition focus:border-[#FF8199] focus:ring-2 focus:ring-[#FF8199]/10 dark:border-[#49333D] dark:bg-[#211e27] dark:text-[#FFF8FA]";

const labelClass =
  "mb-2 block text-xs font-bold text-[#10265F] dark:text-[#FFF8FA]";

// ======================================================
// MAIN SETTINGS PAGE
// ======================================================

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatarUrl: "",
  });

  const [notifications, setNotifications] = useState(initialNotifications);
  const [preferences, setPreferences] = useState(initialPreferences);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [security, setSecurity] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [passwordError, setPasswordError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ----------------------------------------------------
  // NOTIFICATIONS AND PREFERENCES
  // ----------------------------------------------------

  const updateProfile = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateNotification = (field, value) => {
    setNotifications((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updatePreference = (field, value) => {
    setPreferences((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const showNotice = (text, type = "success") => {
    setNotice(text);
    setNoticeType(type);
  };

  // ----------------------------------------------------
  // LOAD PROFILE AND SECURITY FROM BACKEND
  // ----------------------------------------------------

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setNotice("");

    try {
      const [profileResponse, securityResponse] = await Promise.all([
        settingsService.getProfile(),
        settingsService.getSecurity(),
      ]);

      const user = profileResponse?.data?.user;
      const profileData = user?.profile || {};

      if (user) {
        setProfile({
          fullName: profileData.name || "",
          email: user.email || "",
          phone: profileData.phone || "",
          avatarUrl: profileData.avatarUrl || "",
        });

        setAvatarPreview(profileData.avatarUrl || "");
      }

      setSecurity(securityResponse?.data?.security || null);
    } catch (error) {
      showNotice(
        error.message || "Unable to load your account settings.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // ----------------------------------------------------
  // PROFILE PHOTO PREVIEW
  // Backend currently accepts avatarUrl, not file upload.
  // ----------------------------------------------------

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotice("Please select a valid image file.", "error");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showNotice("Image size must be 3 MB or less.", "error");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatarPreview(String(reader.result));
      showNotice(
        "Photo preview updated. This backend does not currently provide a photo upload endpoint.",
        "error"
      );
    };

    reader.readAsDataURL(file);
  };

  // ----------------------------------------------------
  // SAVE PROFILE
  // Only supported fields are sent to the backend.
  // ----------------------------------------------------

  const saveProfile = async () => {
    if (!profile.fullName.trim()) {
      showNotice("Please enter your full name.", "error");
      return;
    }

    if (profile.fullName.trim().length < 2) {
      showNotice("Name must contain at least 2 characters.", "error");
      return;
    }

    if (
      profile.phone.trim() &&
      !/^[+\d\s().-]{7,20}$/.test(profile.phone.trim())
    ) {
      showNotice("Please enter a valid phone number.", "error");
      return;
    }

    const payload = {
      name: profile.fullName.trim(),
      phone: profile.phone.trim() || null,
    };

    setSaving(true);

    try {
      const response = await settingsService.updateProfile(payload);
      const updatedUser = response?.data?.user;

      if (updatedUser) {
        setProfile((previous) => ({
          ...previous,
          fullName: updatedUser.profile?.name || previous.fullName,
          email: updatedUser.email || previous.email,
          phone: updatedUser.profile?.phone || "",
          avatarUrl: updatedUser.profile?.avatarUrl || "",
        }));
      }

      showNotice("Your profile has been updated successfully.");
    } catch (error) {
      showNotice(
        error.message || "Unable to update your profile.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------------------
  // SAVE LOCAL-ONLY SETTINGS
  // ----------------------------------------------------

  const saveLocalSettings = () => {
    showNotice(
      "Your selections are updated in this page only. The backend does not currently provide APIs to persist preferences or notification settings.",
      "error"
    );
  };

  // ----------------------------------------------------
  // CHANGE PASSWORD
  // ----------------------------------------------------

  const savePassword = async () => {
    setPasswordError("");

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError(
        "New password must contain at least 8 characters."
      );
      return;
    }

    if (passwordForm.newPassword.length > 128) {
      setPasswordError(
        "New password must not exceed 128 characters."
      );
      return;
    }

    if (
      passwordForm.newPassword !== passwordForm.confirmPassword
    ) {
      setPasswordError(
        "New password and confirmation do not match."
      );
      return;
    }

    if (
      passwordForm.currentPassword === passwordForm.newPassword
    ) {
      setPasswordError(
        "New password must be different from your current password."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await settingsService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      showNotice(
        response?.message ||
          "Password changed successfully. Please log in again."
      );

      // Backend clears the refresh cookie after password change.
      // The user should sign in again to establish a new session.
    } catch (error) {
      setPasswordError(
        error.message || "Unable to change your password."
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await settingsService.logout();
      window.location.assign("/login");
    } catch (error) {
      setLoggingOut(false);
      setShowLogoutModal(false);
      showNotice(
        error.message || "Unable to sign out. Please try again.",
        "error"
      );
    }
  };

  // ----------------------------------------------------
  // PASSWORD INPUT
  // ----------------------------------------------------

  const renderPasswordField = (label, field, visibilityKey) => {
    const visible = showPasswords[visibilityKey];

    return (
      <div>
        <label htmlFor={field} className={labelClass}>
          {label}
        </label>

        <div className="relative">
          <input
            id={field}
            type={visible ? "text" : "password"}
            autoComplete="new-password"
            value={passwordForm[field]}
            onChange={(event) =>
              setPasswordForm((previous) => ({
                ...previous,
                [field]: event.target.value,
              }))
            }
            placeholder={`Enter ${label.toLowerCase()}`}
            className={`${inputClass} pr-11`}
          />

          <button
            type="button"
            onClick={() =>
              setShowPasswords((previous) => ({
                ...previous,
                [visibilityKey]: !previous[visibilityKey],
              }))
            }
            aria-label={visible ? `Hide ${label}` : `Show ${label}`}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA8C2] hover:text-[#FF2454]"
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // PROFILE SECTION
  // ----------------------------------------------------

  const renderProfile = () => (
    <section>
      <SectionHeading
        icon={UserRound}
        title="Profile information"
        description="Manage the personal information associated with your account."
      />

      <div className="mb-7 flex flex-col items-start gap-4 rounded-2xl bg-[#F8FAFF] p-4 dark:bg-[#30232B] sm:flex-row sm:items-center">
        <div className="relative">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Profile preview"
              className="h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#E9EDFF] text-2xl font-black text-[#3449A8]">
              {profile.fullName
                .split(/\s+/)
                .filter(Boolean)
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "U"}
            </div>
          )}

          <label
            htmlFor="profile-photo"
            className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-[#FF2454] text-white shadow-sm"
          >
            <Camera size={14} />
          </label>

          <input
            id="profile-photo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-[#10265F] dark:text-[#FFF8FA]">
            Profile photo
          </h3>
          <p className="mt-1 text-[11px] text-[#8290AA] dark:text-[#C1B5C0]">
            JPG, PNG or another supported image format.
          </p>
          <p className="mt-1 text-[10px] text-[#A1ACC0]">
            Maximum file size: 3 MB
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full name
          </label>
          <div className="relative">
            <UserRound
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA8C2]"
            />
            <input
              id="fullName"
              value={profile.fullName}
              onChange={(event) =>
                updateProfile("fullName", event.target.value)
              }
              placeholder="Your full name"
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA8C2]"
            />
            <input
              id="email"
              type="email"
              value={profile.email}
              readOnly
              className={`${inputClass} cursor-not-allowed bg-[#F8FAFF] pl-9 dark:bg-[#30232B]`}
            />
          </div>
          <p className="mt-1 text-[10px] text-[#9AA8C2]">
            Email is managed through your account authentication.
          </p>
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone number
          </label>
          <div className="relative">
            <Phone
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA8C2]"
            />
            <input
              id="phone"
              type="tel"
              value={profile.phone}
              onChange={(event) =>
                updateProfile("phone", event.target.value)
              }
              placeholder="Enter phone number"
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[#E7ECF6] bg-[#F8FAFF] p-4 dark:border-[#49333D] dark:bg-[#30232B]">
        <p className="text-xs font-bold text-[#10265F] dark:text-[#FFF8FA]">
          Profile data
        </p>
        <p className="mt-1 text-[11px] leading-5 text-[#8290AA] dark:text-[#C1B5C0]">
          Your name and phone number are saved to your Equilx account.
          Country, timezone, language and bio are not currently part
          of the profile update API.
        </p>
      </div>
    </section>
  );

  // ----------------------------------------------------
  // PREFERENCES SECTION
  // ----------------------------------------------------

  const renderPreferences = () => (
    <section>
      <SectionHeading
        icon={Palette}
        title="App preferences"
        description="Customise how Equilx looks and fits into your routine."
      />

      <div>
        <h3 className="text-xs font-extrabold text-[#10265F] dark:text-[#FFF8FA]">
          Appearance
        </h3>
        <p className="mt-1 text-[11px] text-[#8290AA] dark:text-[#C1B5C0]">
          Choose your preferred interface theme.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { name: "Light", icon: Sun, description: "Bright and clear" },
            { name: "Dark", icon: Moon, description: "Low-light interface" },
            { name: "System", icon: Monitor, description: "Follow device" },
          ].map((item) => {
            const Icon = item.icon;
            const selected = preferences.appearance === item.name;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() =>
                  updatePreference("appearance", item.name)
                }
                className={`rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  selected
                    ? "border-[#FF8199] bg-[#FFF7F9] dark:bg-[#30232B]"
                    : "border-[#E7ECF6] bg-white hover:border-[#CAD5E8] dark:border-[#49333D] dark:bg-[#211e27]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      selected
                        ? "bg-[#FF2454] text-white"
                        : "bg-[#F0F3FA] text-[#71809D]"
                    }`}
                  >
                    <Icon size={19} />
                  </span>
                  {selected && (
                    <CheckCircle2 size={17} className="text-[#FF2454]" />
                  )}
                </div>
                <p className="mt-4 text-xs font-extrabold text-[#10265F] dark:text-[#FFF8FA]">
                  {item.name}
                </p>
                <p className="mt-1 text-[10px] text-[#8290AA] dark:text-[#C1B5C0]">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-[10px] leading-5 text-[#9AA8C2]">
          Appearance selection is local to this page. Application-wide
          theme persistence is not connected.
        </p>
      </div>

      <div className="mt-7 border-t border-[#EEF1F8] pt-6 dark:border-[#49333D]">
        <h3 className="text-xs font-extrabold text-[#10265F] dark:text-[#FFF8FA]">
          Learning preferences
        </h3>

        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="density" className={labelClass}>
              Dashboard layout
            </label>
            <select
              id="density"
              value={preferences.dashboardDensity}
              onChange={(event) =>
                updatePreference("dashboardDensity", event.target.value)
              }
              className={inputClass}
            >
              <option>Comfortable</option>
              <option>Compact</option>
            </select>
          </div>

          <div>
            <label htmlFor="weeklyGoal" className={labelClass}>
              Weekly study goal
            </label>
            <select
              id="weeklyGoal"
              value={preferences.weeklyGoal}
              onChange={(event) =>
                updatePreference("weeklyGoal", event.target.value)
              }
              className={inputClass}
            >
              <option>2 hours</option>
              <option>5 hours</option>
              <option>7 hours</option>
              <option>10 hours</option>
              <option>15 hours</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <SettingsRow
            title="Sound effects"
            description="Play interface sounds where supported."
            checked={preferences.soundEffects}
            onChange={(value) =>
              updatePreference("soundEffects", value)
            }
            last
          />
        </div>
      </div>
    </section>
  );

  // ----------------------------------------------------
  // NOTIFICATIONS SECTION
  // ----------------------------------------------------

  const renderNotifications = () => (
    <section>
      <SectionHeading
        icon={Bell}
        title="Notification settings"
        description="Choose which updates you want to receive."
      />

      <div className="mb-5 rounded-xl border border-[#E7ECF6] bg-[#F8FAFF] p-4 dark:border-[#49333D] dark:bg-[#30232B]">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#4561B5] dark:bg-[#211e27]">
            <Mail size={17} />
          </span>
          <div>
            <p className="text-xs font-extrabold text-[#10265F] dark:text-[#FFF8FA]">
              Email notifications
            </p>
            <p className="mt-1 text-[11px] leading-5 text-[#8290AA] dark:text-[#C1B5C0]">
              These controls are currently local preferences. Actual
              notification delivery and saved preferences require
              backend support.
            </p>
          </div>
        </div>
      </div>

      <SettingsRow
        title="Account and product updates"
        description="Important updates about your Equilx account."
        checked={notifications.emailUpdates}
        onChange={(value) => updateNotification("emailUpdates", value)}
      />

      <SettingsRow
        title="Practice reminders"
        description="Reminders to keep your IELTS practice consistent."
        checked={notifications.practiceReminders}
        onChange={(value) =>
          updateNotification("practiceReminders", value)
        }
      />

      <SettingsRow
        title="Weekly progress reports"
        description="A summary of your practice activity and progress."
        checked={notifications.progressReports}
        onChange={(value) =>
          updateNotification("progressReports", value)
        }
      />

      <SettingsRow
        title="Course announcements"
        description="News about courses, study material and learning sessions."
        checked={notifications.courseAnnouncements}
        onChange={(value) =>
          updateNotification("courseAnnouncements", value)
        }
      />

      <SettingsRow
        title="Speaking session reminders"
        description="Reminders for scheduled speaking practice."
        checked={notifications.speakingReminders}
        onChange={(value) =>
          updateNotification("speakingReminders", value)
        }
      />

      <SettingsRow
        title="Promotional emails"
        description="Occasional offers and product announcements."
        checked={notifications.promotionalEmails}
        onChange={(value) =>
          updateNotification("promotionalEmails", value)
        }
        last
      />
    </section>
  );

  // ----------------------------------------------------
  // SECURITY SECTION
  // ----------------------------------------------------

  const renderSecurity = () => (
    <section>
      <SectionHeading
        icon={ShieldCheck}
        title="Security & account access"
        description="Manage your password and review account security options."
      />

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#DCEEE7] bg-[#F3FBF7] p-4 dark:border-[#315C4D] dark:bg-[#1F302B]">
        <ShieldCheck
          size={20}
          className="mt-0.5 shrink-0 text-[#00A879]"
        />
        <div>
          <p className="text-xs font-extrabold text-[#176B51] dark:text-[#78D6B3]">
            Keep your account secure
          </p>
          <p className="mt-1 text-[11px] leading-5 text-[#548B79] dark:text-[#A3C9BA]">
            Use a strong, unique password and never share your login details.
          </p>
        </div>
      </div>

      <h3 className="text-sm font-extrabold text-[#10265F] dark:text-[#FFF8FA]">
        Change password
      </h3>
      <p className="mt-1 text-[11px] text-[#8290AA] dark:text-[#C1B5C0]">
        Choose a password with at least 8 characters.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {renderPasswordField(
          "Current password",
          "currentPassword",
          "current"
        )}

        <div className="hidden sm:block" />

        {renderPasswordField("New password", "newPassword", "new")}

        {renderPasswordField(
          "Confirm new password",
          "confirmPassword",
          "confirm"
        )}
      </div>

      {passwordError && (
        <p className="mt-3 rounded-lg bg-[#FFF0F3] px-3 py-2 text-xs text-[#C51F48]">
          {passwordError}
        </p>
      )}

      <button
        type="button"
        onClick={savePassword}
        disabled={saving}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#E81745] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <LoaderCircle size={16} className="animate-spin" />
        ) : (
          <Save size={16} />
        )}
        Update password
      </button>

      <div className="mt-7 border-t border-[#EEF1F8] pt-6 dark:border-[#49333D]">
        <h3 className="text-sm font-extrabold text-[#10265F] dark:text-[#FFF8FA]">
          Account security
        </h3>

        <p className="mt-1 text-[11px] text-[#8290AA] dark:text-[#C1B5C0]">
          Security information retrieved from your account.
        </p>

        {security ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E7ECF6] p-4 dark:border-[#49333D]">
              <p className="text-[10px] text-[#8290AA]">Account status</p>
              <p className="mt-2 text-sm font-bold text-[#10265F] dark:text-white">
                {security.accountActive ? "Active" : "Inactive"}
              </p>
            </div>

            <div className="rounded-xl border border-[#E7ECF6] p-4 dark:border-[#49333D]">
              <p className="text-[10px] text-[#8290AA]">Email verification</p>
              <p className="mt-2 text-sm font-bold text-[#10265F] dark:text-white">
                {security.emailVerified ? "Verified" : "Not verified"}
              </p>
            </div>

            <div className="rounded-xl border border-[#E7ECF6] p-4 dark:border-[#49333D] sm:col-span-2">
              <p className="text-[10px] text-[#8290AA]">
                Active login sessions
              </p>
              <p className="mt-2 text-sm font-bold text-[#10265F] dark:text-white">
                {security.activeRefreshSessions ?? 0}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-xs text-[#8290AA]">
            Security details are not available.
          </p>
        )}

        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#E7ECF6] px-4 py-3 text-xs font-bold text-[#506995] transition hover:bg-[#F8FAFF] dark:border-[#49333D] dark:text-[#C1B5C0] dark:hover:bg-[#30232B]"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>

      <div className="mt-7 rounded-2xl border border-[#F4D5DD] p-4 dark:border-[#69404C] sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF2454]">
            <Trash2 size={19} />
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-extrabold text-[#10265F] dark:text-[#FFF8FA]">
              Delete account
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-[#8290AA] dark:text-[#C1B5C0]">
              Self-service account deletion is not available in the
              current backend API. Contact support for account-related
              requests.
            </p>

            <button
              type="button"
              onClick={() =>
                showNotice(
                  "Self-service account deletion is not currently supported by the backend.",
                  "error"
                )
              }
              className="mt-3 rounded-lg border border-[#F4D5DD] px-3 py-2 text-[11px] font-bold text-[#D9284F] transition hover:bg-[#FFF0F3]"
            >
              Account deletion information
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  // ----------------------------------------------------
  // ACTIVE SECTION
  // ----------------------------------------------------

  const renderActiveSection = () => {
    switch (activeSection) {
      case "profile":
        return renderProfile();
      case "preferences":
        return renderPreferences();
      case "notifications":
        return renderNotifications();
      case "security":
        return renderSecurity();
      default:
        return renderProfile();
    }
  };

  // ----------------------------------------------------
  // SAVE ACTION
  // ----------------------------------------------------

  const handleSave = () => {
    if (activeSection === "profile") {
      saveProfile();
      return;
    }

    if (activeSection === "security") {
      savePassword();
      return;
    }

    saveLocalSettings();
  };

  // ----------------------------------------------------
  // MAIN UI
  // ----------------------------------------------------

  return (
    <StudentLayout>
      <div className="mx-auto w-full max-w-[1800px] space-y-6 pb-8">

        {/* PAGE HEADER */}

        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#FF2454]">
              <SettingsIcon size={14} />
              Account configuration
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#10265F] dark:text-[#FFF8FA] sm:text-3xl">
              Settings
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-[#71809D] dark:text-[#C1B5C0] sm:text-sm">
              Manage your profile, customise your learning experience
              and control your account preferences.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-[#E7ECF6] bg-white px-3 py-2.5 dark:border-[#49333D] dark:bg-[#211e27] sm:self-auto">
            <ShieldCheck size={17} className="text-[#00A879]" />
            <span className="text-[10px] font-bold text-[#506995] dark:text-[#C1B5C0]">
              Account settings
            </span>
          </div>
        </section>

        {/* SETTINGS HERO */}

        <section className="relative grid min-h-[210px] overflow-hidden rounded-2xl border border-[#E7ECF6] dark:border-[#49333D] lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="relative z-10 flex flex-col justify-center bg-gradient-to-r from-white via-[#F5F7FF] to-[#FFF0F4] p-5 dark:from-[#211e27] dark:via-[#29232D] dark:to-[#30232B] sm:p-7 lg:p-9">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF2454]">
              Your account, your way
            </p>

            <h2 className="mt-2 text-xl font-black text-[#10265F] dark:text-[#FFF8FA] sm:text-2xl">
              Make Equilx work for you
            </h2>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-[#506995] dark:text-[#C1B5C0] sm:text-sm">
              Personalise your account and choose how you want to learn,
              receive updates and manage security.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF2454] dark:bg-[#402630]">
                <UserRound size={20} />
              </span>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-[#10265F] dark:text-[#FFF8FA]">
                  {profile.fullName || "Your profile"}
                </p>
                <p className="mt-1 text-[10px] text-[#71809D] dark:text-[#C1B5C0]">
                  Student account
                </p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[190px] overflow-hidden sm:min-h-[230px] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85"
              className="absolute inset-0 h-full w-full object-cover object-center"
              alt="Students studying together"

            />
          </div>
        </section>

        {/* STATUS MESSAGE */}

        {notice && (
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              noticeType === "error"
                ? "border-[#F4D5DD] bg-[#FFF5F7] text-[#C51F48]"
                : "border-[#CDEBDD] bg-[#F3FBF7] text-[#176B51]"
            }`}
          >
            {noticeType === "error" ? (
              <AlertTriangle size={17} className="mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            )}

            <p className="flex-1 text-xs leading-5">{notice}</p>

            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* MAIN SETTINGS LAYOUT */}

        <div className="grid items-start gap-5 lg:grid-cols-[245px_minmax(0,1fr)]">

          {/* LEFT NAVIGATION */}

          <aside className="rounded-2xl border border-[#E7ECF6] bg-white p-3 dark:border-[#49333D] dark:bg-[#211e27]">
            <p className="px-3 pb-3 pt-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#9AA8C2]">
              Settings menu
            </p>

            <nav className="flex gap-2 overflow-x-auto lg:flex-col">
              {sections.map((section) => {
                const Icon = section.icon;
                const active = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(section.id);
                      setNotice("");
                      setPasswordError("");
                    }}
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left transition lg:w-full ${
                      active
                        ? "bg-[#FFF0F3] text-[#FF2454] dark:bg-[#402630]"
                        : "text-[#71809D] hover:bg-[#F8FAFF] hover:text-[#10265F] dark:text-[#C1B5C0] dark:hover:bg-[#30232B]"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-xs font-bold">
                      {section.label}
                    </span>

                    {active && (
                      <ChevronRight
                        size={16}
                        className="ml-auto hidden lg:block"
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-5 hidden rounded-xl bg-[#F8FAFF] p-4 dark:bg-[#30232B] lg:block">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#4561B5] dark:bg-[#211e27]">
                <CircleHelp size={18} />
              </span>

              <h3 className="mt-3 text-xs font-extrabold text-[#10265F] dark:text-[#FFF8FA]">
                Need help?
              </h3>

              <p className="mt-2 text-[10px] leading-5 text-[#8290AA] dark:text-[#C1B5C0]">
                Contact your institute support team if you need help
                managing your account.
              </p>
            </div>
          </aside>

          {/* RIGHT CONTENT */}

          <div className="min-w-0 rounded-2xl border border-[#E7ECF6] bg-white p-4 dark:border-[#49333D] dark:bg-[#211e27] sm:p-6 lg:p-7">
            {loading ? (
              <div className="flex min-h-[350px] flex-col items-center justify-center">
                <LoaderCircle
                  size={30}
                  className="animate-spin text-[#FF2454]"
                />
                <p className="mt-3 text-xs font-semibold text-[#71809D]">
                  Loading your account settings...
                </p>
              </div>
            ) : (
              <>
                {renderActiveSection()}

                <div className="mt-7 flex flex-col-reverse justify-between gap-3 border-t border-[#EEF1F8] pt-5 dark:border-[#49333D] sm:flex-row sm:items-center">
                  <p className="text-[10px] leading-5 text-[#9AA8C2]">
                    {activeSection === "profile"
                      ? "Profile changes are saved to your account."
                      : activeSection === "security"
                        ? "Password changes are handled securely by the backend."
                        : "These settings are currently local to this page."}
                  </p>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-xs font-extrabold text-white transition-colors hover:bg-[#E81745] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {activeSection === "profile"
                      ? "Save profile"
                      : activeSection === "security"
                        ? "Update password"
                        : "Save changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION */}

      {showLogoutModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#081633]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-[#211e27] sm:p-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#1680E8]">
              <LogOut size={22} />
            </span>

            <h2 className="mt-4 text-lg font-black text-[#10265F] dark:text-[#FFF8FA]">
              Sign out of Equilx?
            </h2>

            <p className="mt-2 text-xs leading-6 text-[#71809D] dark:text-[#C1B5C0]">
              You will need to log in again to access your account.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex-1 rounded-xl border border-[#E4EAF5] px-4 py-3 text-xs font-bold text-[#506995] dark:border-[#49333D] dark:text-[#C1B5C0]"
              >
                Stay signed in
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#10265F] px-4 py-3 text-xs font-bold text-white disabled:opacity-60"
              >
                {loggingOut && (
                  <LoaderCircle size={15} className="animate-spin" />
                )}
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
