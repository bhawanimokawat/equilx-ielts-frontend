import React, { useState } from "react";

import {
  Settings,
  User,
  ShieldCheck,
  Bell,
  Globe,
  LockKeyhole,
  Save,
  Eye,
  EyeOff,
  Check,
  Camera,
  Mail,
  Smartphone,
  Clock,
  Database,
  KeyRound,
  RefreshCw,
} from "lucide-react";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const initialSettings = {
  fullName: "Super Administrator",
  email: "admin@equilx.com",
  phone: "+91 98765 43210",
  timezone: "Asia/Kolkata",
  language: "English",
  emailNotifications: true,
  securityAlerts: true,
  paymentAlerts: true,
  weeklyReports: false,
  maintenanceMode: false,
  allowRegistration: true,
  sessionTimeout: "30",
};

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-[#2454A6] dark:bg-[#FF2454]" : "bg-slate-300 dark:bg-[#51495B]"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function SettingRow({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0 dark:border-[#3B3441]">
      <div>
        <p className="text-sm font-semibold text-[#10265F] dark:text-white">
          {title}
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-[#B0A5BD]">
          {description}
        </p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="rounded-xl bg-blue-50 p-2.5 text-[#2454A6] dark:bg-blue-950/40 dark:text-blue-300">
        <Icon size={20} />
      </div>
      <div>
        <h2 className="font-bold text-[#10265F] dark:text-white">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
          {description}
        </p>
      </div>
    </div>
  );
}

const cardClass =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27] sm:p-6";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700 dark:text-[#E7E1EC]";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:placeholder:text-[#82778D] dark:focus:border-[#FF2454] dark:focus:ring-[#FF2454]/10";

const selectClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-400 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:focus:border-[#FF2454]";

export default function SuperAdminSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("Profile");
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const update = (key, value) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
  };

  const saveSettings = (event) => {
    event.preventDefault();
    setNotice("Settings saved in this demo session.");
    setError("");
  };

  const tabs = [
    { label: "Profile", icon: User },
    { label: "Security", icon: ShieldCheck },
    { label: "Notifications", icon: Bell },
    { label: "Platform", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FF] text-slate-800 dark:bg-[#17151B] dark:text-white">
      <Sidebar />

      <div className="min-h-screen min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500 dark:text-[#B0A5BD]">
              <span>Super Admin</span>
              <span>/</span>
              <span className="text-[#10265F] dark:text-white">
                Settings
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#10265F] dark:text-white sm:text-3xl">
              Platform Settings
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-[#B0A5BD]">
              Manage your account, security preferences and platform
              configuration.
            </p>
          </div>

          {/* Success Message */}
          {notice && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
              <span className="flex items-center gap-2">
                <Check size={17} />
                {notice}
              </span>

              <button
                onClick={() => setNotice("")}
                aria-label="Dismiss"
                className="text-lg"
              >
                ×
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[250px_minmax(0,1fr)]">
            {/* Settings Sidebar */}
            <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
              <div className="border-b border-slate-100 px-3 pb-4 pt-2 dark:border-[#3B3441]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10265F] text-lg font-bold text-white dark:bg-[#FF2454]">
                    SA
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-[#10265F] dark:text-white">
                      {settings.fullName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-[#B0A5BD]">
                      Super Admin
                    </p>
                  </div>
                </div>
              </div>

              <nav className="mt-3 space-y-1">
                {tabs.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => {
                      setActiveTab(label);
                      setNotice("");
                      setError("");
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                      activeTab === label
                        ? "bg-[#10265F] text-white dark:bg-[#FF2454]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#10265F] dark:text-[#B0A5BD] dark:hover:bg-[#292530] dark:hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </nav>

              <div className="mt-5 rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
                <ShieldCheck
                  size={22}
                  className="text-[#2454A6] dark:text-blue-300"
                />

                <p className="mt-3 text-sm font-bold text-[#10265F] dark:text-white">
                  Account protection
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-[#B0A5BD]">
                  Keep your credentials secure and review access regularly.
                </p>
              </div>
            </aside>

            {/* Settings Form */}
            <form onSubmit={saveSettings} className="space-y-6">
              {/* PROFILE TAB */}
              {activeTab === "Profile" && (
                <>
                  <section className={cardClass}>
                    <SectionHeading
                      icon={User}
                      title="Profile Information"
                      description="Update the information associated with your administrator account."
                    />

                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-[#2454A6] dark:bg-blue-950/40 dark:text-blue-300">
                        SA
                      </div>

                      <div>
                        <p className="font-semibold text-[#10265F] dark:text-white">
                          Profile avatar
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-[#B0A5BD]">
                          Avatar upload can be connected to your storage
                          service.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            setNotice(
                              "Avatar upload requires storage integration."
                            )
                          }
                          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#10265F] hover:bg-slate-50 dark:border-[#3B3441] dark:text-white dark:hover:bg-[#292530]"
                        >
                          <Camera size={15} />
                          Change avatar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className={labelClass}>Full name</span>
                        <input
                          value={settings.fullName}
                          onChange={(e) =>
                            update("fullName", e.target.value)
                          }
                          required
                          className={inputClass}
                        />
                      </label>

                      <label className="block">
                        <span className={labelClass}>Email address</span>

                        <span className="relative block">
                          <Mail
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            type="email"
                            value={settings.email}
                            onChange={(e) =>
                              update("email", e.target.value)
                            }
                            required
                            className={`${inputClass} pl-10`}
                          />
                        </span>
                      </label>

                      <label className="block">
                        <span className={labelClass}>Phone number</span>

                        <span className="relative block">
                          <Smartphone
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            value={settings.phone}
                            onChange={(e) =>
                              update("phone", e.target.value)
                            }
                            className={`${inputClass} pl-10`}
                          />
                        </span>
                      </label>

                      <label className="block">
                        <span className={labelClass}>Time zone</span>

                        <select
                          value={settings.timezone}
                          onChange={(e) =>
                            update("timezone", e.target.value)
                          }
                          className={selectClass}
                        >
                          <option value="Asia/Kolkata">
                            India Standard Time (IST)
                          </option>
                          <option value="UTC">UTC</option>
                          <option value="Europe/London">London</option>
                          <option value="America/New_York">
                            New York
                          </option>
                        </select>
                      </label>

                      <label className="block sm:col-span-2">
                        <span className={labelClass}>Language</span>

                        <select
                          value={settings.language}
                          onChange={(e) =>
                            update("language", e.target.value)
                          }
                          className={selectClass}
                        >
                          <option>English</option>
                          <option>Hindi</option>
                        </select>
                      </label>
                    </div>
                  </section>
                </>
              )}

              {/* SECURITY TAB */}
              {activeTab === "Security" && (
                <>
                  <section className={cardClass}>
                    <SectionHeading
                      icon={LockKeyhole}
                      title="Change Password"
                      description="Use a strong password to protect your administrator account."
                    />

                    <div className="space-y-4">
                      {[
                        {
                          label: "Current password",
                          value: currentPassword,
                          setValue: setCurrentPassword,
                        },
                        {
                          label: "New password",
                          value: newPassword,
                          setValue: setNewPassword,
                        },
                        {
                          label: "Confirm new password",
                          value: confirmPassword,
                          setValue: setConfirmPassword,
                        },
                      ].map((field) => (
                        <label key={field.label} className="block">
                          <span className={labelClass}>{field.label}</span>

                          <span className="relative block">
                            <KeyRound
                              size={17}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                              type={showPassword ? "text" : "password"}
                              value={field.value}
                              onChange={(e) =>
                                field.setValue(e.target.value)
                              }
                              minLength={8}
                              required
                              className={`${inputClass} pl-10 pr-12`}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setShowPassword(!showPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                              aria-label={
                                showPassword
                                  ? "Hide passwords"
                                  : "Show passwords"
                              }
                            >
                              {showPassword ? (
                                <EyeOff size={17} />
                              ) : (
                                <Eye size={17} />
                              )}
                            </button>
                          </span>
                        </label>
                      ))}
                    </div>

                    <p className="mt-4 text-xs text-slate-500 dark:text-[#B0A5BD]">
                      Password changes must be validated and saved by your
                      backend.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        if (!currentPassword) {
                          setError("Please enter your current password.");
                          setNotice("");
                        } else if (newPassword.length < 8) {
                          setError(
                            "New password must contain at least 8 characters."
                          );
                          setNotice("");
                        } else if (newPassword !== confirmPassword) {
                          setError(
                            "New password and confirmation do not match."
                          );
                          setNotice("");
                        } else {
                          setError("");
                          setNotice(
                            "Password form validated. Connect the password API to apply the change."
                          );
                        }
                      }}
                      className="mt-5 rounded-xl bg-[#10265F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1B397D] dark:bg-[#FF2454] dark:hover:bg-[#E51E49]"
                    >
                      Validate password change
                    </button>
                  </section>

                  <section className={cardClass}>
                    <SectionHeading
                      icon={ShieldCheck}
                      title="Session Security"
                      description="Configure how long an administrator session can remain inactive."
                    />

                    <label className="block max-w-sm">
                      <span className={labelClass}>Session timeout</span>

                      <select
                        value={settings.sessionTimeout}
                        onChange={(e) =>
                          update("sessionTimeout", e.target.value)
                        }
                        className={selectClass}
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="120">2 hours</option>
                      </select>
                    </label>
                  </section>
                </>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === "Notifications" && (
                <section className={cardClass}>
                  <SectionHeading
                    icon={Bell}
                    title="Notification Preferences"
                    description="Choose which platform updates you want to receive."
                  />

                  <SettingRow
                    title="Email notifications"
                    description="Receive important platform updates by email."
                    checked={settings.emailNotifications}
                    onChange={(v) => update("emailNotifications", v)}
                  />

                  <SettingRow
                    title="Security alerts"
                    description="Get alerts for suspicious activity and repeated login failures."
                    checked={settings.securityAlerts}
                    onChange={(v) => update("securityAlerts", v)}
                  />

                  <SettingRow
                    title="Payment alerts"
                    description="Receive notifications for payments, refunds and subscription issues."
                    checked={settings.paymentAlerts}
                    onChange={(v) => update("paymentAlerts", v)}
                  />

                  <SettingRow
                    title="Weekly platform report"
                    description="Receive a weekly summary of users, institutes and usage."
                    checked={settings.weeklyReports}
                    onChange={(v) => update("weeklyReports", v)}
                  />
                </section>
              )}

              {/* PLATFORM TAB */}
              {activeTab === "Platform" && (
                <>
                  <section className={cardClass}>
                    <SectionHeading
                      icon={Globe}
                      title="Platform Configuration"
                      description="Manage selected global settings for the Equilx IELTS platform."
                    />

                    <SettingRow
                      title="Maintenance mode"
                      description="When enabled, restrict normal platform access during maintenance."
                      checked={settings.maintenanceMode}
                      onChange={(v) => update("maintenanceMode", v)}
                    />

                    <SettingRow
                      title="Allow new registrations"
                      description="Allow new users and institutes to register."
                      checked={settings.allowRegistration}
                      onChange={(v) => update("allowRegistration", v)}
                    />
                  </section>

                  <section className={cardClass}>
                    <SectionHeading
                      icon={Database}
                      title="Platform Operations"
                      description="Review operational tools available to administrators."
                    />

                    <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 p-4 dark:border-[#3B3441] sm:flex-row sm:items-center">
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-blue-50 p-2.5 text-[#2454A6] dark:bg-blue-950/40 dark:text-blue-300">
                          <RefreshCw size={20} />
                        </div>

                        <div>
                          <p className="font-semibold text-[#10265F] dark:text-white">
                            Refresh configuration
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-[#B0A5BD]">
                            Recheck the settings currently shown in this
                            page.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSettings({ ...settings });
                          setNotice(
                            "Current settings refreshed in this demo."
                          );
                          setError("");
                        }}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#10265F] hover:bg-slate-50 dark:border-[#3B3441] dark:text-white dark:hover:bg-[#292530]"
                      >
                        Refresh
                      </button>
                    </div>

                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                      <ShieldCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300"
                      />

                      <p className="text-xs leading-5 text-amber-800 dark:text-amber-200">
                        Maintenance mode and registration settings should
                        only be enforced after server-side authorization
                        and validation.
                      </p>
                    </div>
                  </section>
                </>
              )}

              {/* SAVE SETTINGS */}
              <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#3B3441] dark:bg-[#211E27] sm:flex-row sm:items-center sm:px-6">
                <p className="text-xs text-slate-500 dark:text-[#B0A5BD]">
                  <Clock size={14} className="mr-1 inline" />
                  Changes in this demo are held in component state only.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSettings(initialSettings);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setNotice("");
                      setError("");
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-[#3B3441] dark:text-[#D0C7D8] dark:hover:bg-[#292530]"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10265F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1B397D] dark:bg-[#FF2454] dark:hover:bg-[#E51E49]"
                  >
                    <Save size={16} />
                    Save changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}