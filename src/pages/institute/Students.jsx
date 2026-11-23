
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar";
import {
  Users,
  UserRound,
  GraduationCap,
  UserX,
  Search,
  Upload,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  SlidersHorizontal,
  X,
  Mail,
  RefreshCw,
  Check,
  Ban,
  Eye,
  Clock,
} from "lucide-react";

import  AuthContext  from "../../context/AuthContext";
import studentService from "../../services/insitute/studentService";
import studentInvitationService from "../../services/insitute/studentInvitationService";

const PAGE_SIZE = 8;
const FETCH_LIMIT = 100;

const MEMBERSHIP_STATUSES = [
  "All Status",
  "ACTIVE",
  "PENDING_APPROVAL",
  "SUSPENDED",
  "REVOKED",
];

const INVITATION_STATUSES = [
  "All Status",
  "PENDING",
  "ACCEPTED_PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
  "CANCELLED",
];

const avatarColors = [
  "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
  "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
  "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
];

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name) {
  if (!name) return "S";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function getMembershipStatusLabel(status) {
  const labels = {
    ACTIVE: "Active",
    PENDING_APPROVAL: "Pending Approval",
    SUSPENDED: "Suspended",
    REVOKED: "Revoked",
  };

  return labels[status] || status || "Unknown";
}

function getInvitationStatusLabel(status) {
  const labels = {
    PENDING: "Pending",
    ACCEPTED_PENDING_APPROVAL: "Awaiting Approval",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    EXPIRED: "Expired",
    CANCELLED: "Cancelled",
  };

  return labels[status] || status || "Unknown";
}

function getMembershipStatusClass(status) {
  const styles = {
    ACTIVE:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    PENDING_APPROVAL:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    SUSPENDED:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
    REVOKED:
      "bg-rose-50 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400",
  };

  return styles[status] || "bg-slate-100 text-slate-600 dark:bg-[#302A36] dark:text-[#B0A5BD]";
}

function getInvitationStatusClass(status) {
  const styles = {
    PENDING:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    ACCEPTED_PENDING_APPROVAL:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    APPROVED:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    REJECTED:
      "bg-rose-50 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400",
    EXPIRED:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
    CANCELLED:
      "bg-slate-100 text-slate-600 dark:bg-[#302A36] dark:text-[#B0A5BD]",
  };

  return styles[status] || "bg-slate-100 text-slate-600 dark:bg-[#302A36] dark:text-[#B0A5BD]";
}

// Statistics Card
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}) {
  const styles = {
    rose: {
      icon: "bg-rose-50 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400",
      line: "#FF3864",
    },
    green: {
      icon: "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-400",
      line: "#08C99A",
    },
    purple: {
      icon: "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
      line: "#A044FF",
    },
    orange: {
      icon: "bg-orange-50 text-orange-500 dark:bg-orange-500/15 dark:text-orange-400",
      line: "#FF962E",
    },
  };

  const style = styles[color];

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${style.icon}`}
        >
          <Icon size={27} strokeWidth={2.4} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#10265F] dark:text-white">
            {title}
          </p>

          <div className="mt-1">
            <span className="text-3xl font-extrabold tracking-tight text-[#10265F] dark:text-white">
              {value}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-[#91899B]">
            {subtitle}
          </p>
        </div>
      </div>

      <svg
        viewBox="0 0 250 40"
        preserveAspectRatio="none"
        className="mt-3 h-9 w-full"
      >
        <defs>
          <linearGradient
            id={`fill-${color}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={style.line} stopOpacity=".2" />
            <stop offset="100%" stopColor={style.line} stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M0 33 C18 27 22 32 40 26 S68 10 86 17 S116 28 135 19 S164 23 185 12 S222 15 250 3 L250 40 L0 40 Z"
          fill={`url(#fill-${color})`}
        />

        <path
          d="M0 33 C18 27 22 32 40 26 S68 10 86 17 S116 28 135 19 S164 23 185 12 S222 15 250 3"
          fill="none"
          stroke={style.line}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </section>
  );
}

function FilterSelect({ value, onChange, options, label }) {
  return (
    <div className="relative min-w-0">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-xs font-medium text-[#10265F] outline-none transition focus:border-pink-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:focus:border-[#FF2454]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "All Status"
              ? option
              : option === "All Batches"
              ? option
              : option === "All Trainers"
              ? option
              : option.includes("_")
              ? getMembershipStatusLabel(option)
              : option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-3 text-slate-500 dark:text-[#91899B]"
      />
    </div>
  );
}

function StudentAvatar({ name, index }) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
        avatarColors[index % avatarColors.length]
      }`}
    >
      {getInitials(name)}
    </span>
  );
}

// Add Student / Invitation Modal
function AddStudentModal({ onClose, onAdd, saving }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const update = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!form.email.trim()) return;

    const result = await onAdd({
      email: form.email.trim(),
      ...(form.name.trim() ? { name: form.name.trim() } : {}),
      ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
    });

    if (result) onClose();
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#10265F] outline-none focus:border-pink-400 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:placeholder:text-[#91899B]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <form
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-colors duration-300 dark:border dark:border-[#3B3441] dark:bg-[#211E27]"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#10265F] dark:text-white">
              Invite Student
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
              An invitation link will be sent to the student's email.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {[
            { label: "Full Name", name: "name", type: "text", required: false },
            { label: "Email Address", name: "email", type: "email", required: true },
            { label: "Phone Number", name: "phone", type: "tel", required: false },
          ].map((field) => (
            <label key={field.name} className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#10265F] dark:text-[#E8E1ED]">
                {field.label}
                {field.required ? " *" : ""}
              </span>

              <input
                required={field.required}
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={update}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className={inputClass}
              />
            </label>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          Students invited by an Institute Admin can join directly. Invitations
          sent by trainers require Institute Admin approval after acceptance.
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <RefreshCw size={15} className="animate-spin" />}
            {saving ? "Sending..." : "Send Invitation"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Main Students Page
export default function Students() {
  const { user } = useContext(AuthContext);

  const instituteId =
    user?.memberships?.find(
      (membership) =>
        membership.role === "INSTITUTE_ADMIN" &&
        membership.status === "ACTIVE"
    )?.instituteId || null;

  const [students, setStudents] = useState([]);
  const [invitations, setInvitations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [invitationStatus, setInvitationStatus] = useState("All Status");

  const [page, setPage] = useState(1);
  const [invitationPage, setInvitationPage] = useState(1);

  const [activeTab, setActiveTab] = useState("students");
  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selected, setSelected] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!instituteId) {
      setStudents([]);
      setInvitations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [studentResponse, invitationResponse] = await Promise.all([
        studentService.getStudents(instituteId, {
          page: 1,
          limit: FETCH_LIMIT,
        }),
        studentInvitationService.getInvitations(instituteId, {
          page: 1,
          limit: FETCH_LIMIT,
        }),
      ]);

      const membershipResult = studentResponse?.data;
      const invitationResult = invitationResponse?.data;

      setStudents(
        Array.isArray(membershipResult?.data)
          ? membershipResult.data
          : []
      );

      setInvitations(
        Array.isArray(invitationResult?.invitations)
          ? invitationResult.invitations
          : []
      );
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "Unable to load student information.")
      );
    } finally {
      setLoading(false);
    }
  }, [instituteId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((membership) => {
      const name = membership.user?.profile?.name || "";
      const email = membership.user?.email || "";
      const membershipId = membership.id || "";
      const userId = membership.userId || "";

      const matchesSearch =
        !query ||
        [name, email, membershipId, userId].some((value) =>
          String(value).toLowerCase().includes(query)
        );

      const matchesStatus =
        status === "All Status" || membership.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [students, search, status]);

  const filteredInvitations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return invitations.filter((invitation) => {
      const matchesSearch =
        !query ||
        [
          invitation.inviteeName,
          invitation.inviteeEmail,
          invitation.inviteePhone,
          invitation.id,
          invitation.invitedBy?.profile?.name,
          invitation.invitedBy?.email,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        invitationStatus === "All Status" ||
        invitation.status === invitationStatus;

      return matchesSearch && matchesStatus;
    });
  }, [invitations, search, invitationStatus]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const visibleStudents = filteredStudents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const invitationTotalPages = Math.max(
    1,
    Math.ceil(filteredInvitations.length / PAGE_SIZE)
  );

  const currentInvitationPage = Math.min(
    invitationPage,
    invitationTotalPages
  );

  const visibleInvitations = filteredInvitations.slice(
    (currentInvitationPage - 1) * PAGE_SIZE,
    currentInvitationPage * PAGE_SIZE
  );

  const activeStudents = students.filter(
    (student) => student.status === "ACTIVE"
  ).length;

  const inactiveStudents = students.filter((student) =>
    ["SUSPENDED", "REVOKED"].includes(student.status)
  ).length;

  const newEnrollments = students.filter((student) => {
    const date = student.joinedAt || student.createdAt;

    if (!date) return false;

    const joinedDate = new Date(date);
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return (
      !Number.isNaN(joinedDate.getTime()) &&
      joinedDate >= thirtyDaysAgo
    );
  }).length;

  const pendingInvitations = invitations.filter((invitation) =>
    ["PENDING", "ACCEPTED_PENDING_APPROVAL"].includes(invitation.status)
  ).length;

  const sendInvitation = async (form) => {
    if (!instituteId) return false;

    setSaving(true);

    try {
      await studentInvitationService.createInvitation(instituteId, form);

      setNotice(`Invitation sent successfully to ${form.email}.`);
      setError("");
      await loadData();

      return true;
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to send invitation."));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateStudentStatus = async (membership, nextStatus) => {
    if (!instituteId || !membership?.id) return;

    setActionId(membership.id);
    setActiveMenu(null);

    try {
      await studentService.updateStudentStatus(
        instituteId,
        membership.id,
        nextStatus
      );

      setNotice(
        `${membership.user?.profile?.name || "Student"} status updated to ${getMembershipStatusLabel(nextStatus)}.`
      );

      setSelected((previous) =>
        previous.filter((id) => id !== membership.id)
      );

      await loadData();
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "Unable to update student status.")
      );
    } finally {
      setActionId(null);
    }
  };

  const handleInvitationAction = async (invitation, action) => {
    if (!instituteId || !invitation?.id) return;

    const actionLabels = {
      resend: "resend",
      cancel: "cancel",
      approve: "approve",
      reject: "reject",
    };

    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabels[action]} this invitation?`
    );

    if (!confirmed) return;

    setActionId(invitation.id);

    try {
      if (action === "resend") {
        await studentInvitationService.resendInvitation(
          instituteId,
          invitation.id
        );
      } else if (action === "cancel") {
        await studentInvitationService.cancelInvitation(
          instituteId,
          invitation.id
        );
      } else if (action === "approve") {
        await studentInvitationService.approveInvitation(
          instituteId,
          invitation.id
        );
      } else if (action === "reject") {
        await studentInvitationService.rejectInvitation(
          instituteId,
          invitation.id
        );
      }

      setNotice(`Invitation ${action} action completed successfully.`);
      setError("");

      await loadData();
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          `Unable to ${action} this invitation.`
        )
      );
    } finally {
      setActionId(null);
    }
  };

  const toggleAll = (checked) => {
    setSelected(
      checked ? visibleStudents.map((student) => student.id) : []
    );
  };

  const toggleOne = (id, checked) => {
    setSelected((previous) =>
      checked
        ? [...previous, id]
        : previous.filter((item) => item !== id)
    );
  };

  const bulkSuspend = async () => {
    const selectedMemberships = students.filter(
      (student) =>
        selected.includes(student.id) && student.status === "ACTIVE"
    );

    if (!selectedMemberships.length) {
      setNotice("Select at least one active student to suspend.");
      return;
    }

    if (
      !window.confirm(
        `Suspend ${selectedMemberships.length} selected active student(s)?`
      )
    ) {
      return;
    }

    setSaving(true);

    try {
      const results = await Promise.allSettled(
        selectedMemberships.map((membership) =>
          studentService.updateStudentStatus(
            instituteId,
            membership.id,
            "SUSPENDED"
          )
        )
      );

      const succeeded = results.filter(
        (result) => result.status === "fulfilled"
      ).length;

      const failed = results.length - succeeded;

      setSelected([]);
      setNotice(
        `${succeeded} student(s) suspended.${failed ? ` ${failed} update(s) failed.` : ""}`
      );

      await loadData();
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "Unable to update selected students.")
      );
    } finally {
      setSaving(false);
    }
  };

  const exportStudents = () => {
    const headers = [
      "Membership ID",
      "User ID",
      "Name",
      "Email",
      "Membership Role",
      "Status",
      "Joined Date",
      "Created Date",
    ];

    const rows = filteredStudents.map((membership) => [
      membership.id,
      membership.userId,
      membership.user?.profile?.name || "",
      membership.user?.email || "",
      membership.role,
      membership.status,
      membership.joinedAt || "",
      membership.createdAt || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "institute-students.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const exportInvitations = () => {
    const headers = [
      "Invitation ID",
      "Student Name",
      "Email",
      "Phone",
      "Status",
      "Approval Required",
      "Invited By",
      "Created Date",
      "Expires At",
    ];

    const rows = filteredInvitations.map((invitation) => [
      invitation.id,
      invitation.inviteeName || "",
      invitation.inviteeEmail || "",
      invitation.inviteePhone || "",
      invitation.status,
      invitation.approvalRequired ? "Yes" : "No",
      invitation.invitedBy?.profile?.name ||
        invitation.invitedBy?.email ||
        "",
      invitation.createdAt || "",
      invitation.expiresAt || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "student-invitations.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const inputClass =
    "w-full min-w-0 bg-transparent text-xs text-[#10265F] outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-[#91899B]";

  if (!instituteId && !loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FF] dark:bg-[#17151B]">
        <Sidebar />

        <div className="ml-[260px] flex min-h-screen flex-col">
          <Navbar />

          <main className="flex flex-1 items-center justify-center p-6">
            <div className="max-w-md rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
              <Users
                size={36}
                className="mx-auto mb-4 text-slate-400"
              />

              <h2 className="text-xl font-bold text-[#10265F] dark:text-white">
                Institute membership not found
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-[#B0A5BD]">
                An active Institute Admin membership is required to manage
                students.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FF] transition-colors duration-300 dark:bg-[#17151B]">
      <Sidebar />

      <div className="ml-[260px] flex min-h-screen min-w-0 flex-col">
        <Navbar />

        <main className="min-w-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {/* Page Heading */}
          <section className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#6B7FA8] dark:text-[#B0A5BD]">
                Students <span className="mx-1">›</span> Manage Students
              </p>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#10265F] dark:text-white">
                Students{" "}
                <span className="text-[#FF2454]">Management</span>
              </h1>

              <p className="mt-2 text-sm text-[#7183A7] dark:text-[#91899B]">
                Manage institute memberships and student invitations.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={activeTab === "students" ? exportStudents : exportInvitations}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#10265F] shadow-sm transition hover:border-blue-200 disabled:opacity-50 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-white dark:hover:border-blue-400"
              >
                <Upload size={18} />
                Export {activeTab === "students" ? "Students" : "Invitations"}
              </button>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
              >
                <Plus size={19} />
                Invite Student
              </button>
            </div>
          </section>

          {/* Notifications */}
          {notice && (
            <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
              <span>{notice}</span>

              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <StatCard
              title="Total Students"
              value={students.length}
              icon={Users}
              color="rose"
              subtitle="Loaded student memberships"
            />

            <StatCard
              title="Active Students"
              value={activeStudents}
              icon={UserRound}
              color="green"
              subtitle="Active memberships"
            />

            <StatCard
              title="New Enrollments"
              value={newEnrollments}
              icon={GraduationCap}
              color="purple"
              subtitle="Joined in the last 30 days"
            />

            <StatCard
              title="Inactive Students"
              value={inactiveStudents}
              icon={UserX}
              color="orange"
              subtitle="Suspended or revoked"
            />
          </section>

          {/* Tabs */}
          <section className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("students");
                setSelected([]);
                setPage(1);
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === "students"
                  ? "bg-[#FF2454] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-[#506995] hover:bg-slate-50 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
              }`}
            >
              <Users size={17} />
              Students
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {students.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("invitations");
                setSelected([]);
                setInvitationPage(1);
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === "invitations"
                  ? "bg-[#FF2454] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-[#506995] hover:bg-slate-50 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
              }`}
            >
              <Mail size={17} />
              Invitations
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {pendingInvitations}
              </span>
            </button>

            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="ml-auto flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#506995] hover:bg-slate-50 disabled:opacity-50 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </section>

          {/* Search and Filters */}
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-[#3B3441] dark:bg-[#211E27]">
            <div
              className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${
                activeTab === "students"
                  ? "xl:grid-cols-[minmax(220px,1.8fr)_minmax(160px,0.8fr)_auto]"
                  : "xl:grid-cols-[minmax(220px,1.8fr)_minmax(180px,0.8fr)_auto]"
              }`}
            >
              <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-pink-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:focus-within:border-[#FF2454]">
                <Search
                  size={18}
                  className="shrink-0 text-slate-400 dark:text-[#91899B]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                    setInvitationPage(1);
                  }}
                  placeholder={
                    activeTab === "students"
                      ? "Search by name, email or ID..."
                      : "Search by name, email or invitation ID..."
                  }
                  className={inputClass}
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={15} className="text-slate-400" />
                  </button>
                )}
              </div>

              <FilterSelect
                label="Filter by status"
                value={activeTab === "students" ? status : invitationStatus}
                onChange={(value) => {
                  if (activeTab === "students") {
                    setStatus(value);
                    setPage(1);
                  } else {
                    setInvitationStatus(value);
                    setInvitationPage(1);
                  }
                }}
                options={
                  activeTab === "students"
                    ? MEMBERSHIP_STATUSES
                    : INVITATION_STATUSES
                }
              />

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus("All Status");
                  setInvitationStatus("All Status");
                  setPage(1);
                  setInvitationPage(1);
                }}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-[#10265F] hover:bg-slate-50 dark:border-[#3B3441] dark:text-white dark:hover:bg-[#302A36]"
              >
                <SlidersHorizontal size={16} />
                Reset
              </button>
            </div>

            {/* Selected Row Actions */}
            {activeTab === "students" && selected.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-rose-50 px-4 py-3 dark:border dark:border-rose-500/20 dark:bg-rose-500/10">
                <p className="text-sm font-semibold text-[#10265F] dark:text-white">
                  {selected.length} student(s) selected
                </p>

                <button
                  type="button"
                  disabled={saving}
                  onClick={bulkSuspend}
                  className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-50 dark:border-rose-500/30 dark:bg-[#211E27] dark:hover:bg-rose-500/10"
                >
                  Suspend Selected
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500 dark:text-[#B0A5BD]">
                <RefreshCw size={19} className="animate-spin" />
                Loading {activeTab === "students" ? "students" : "invitations"}...
              </div>
            )}

            {/* Students Table */}
            {!loading && activeTab === "students" && (
              <>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[950px] border-collapse text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-semibold text-[#62769C] dark:bg-[#19171E] dark:text-[#B0A5BD]">
                        <th className="w-10 rounded-l-lg px-3 py-3">
                          <input
                            type="checkbox"
                            checked={
                              visibleStudents.length > 0 &&
                              visibleStudents.every((student) =>
                                selected.includes(student.id)
                              )
                            }
                            onChange={(event) =>
                              toggleAll(event.target.checked)
                            }
                            aria-label="Select all visible students"
                            className="h-4 w-4 accent-rose-500"
                          />
                        </th>

                        <th className="px-3 py-3">#</th>
                        <th className="px-3 py-3">Student</th>
                        <th className="px-3 py-3">Email</th>
                        <th className="px-3 py-3">Joined On</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="rounded-r-lg px-3 py-3 text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleStudents.map((membership, index) => {
                        const name =
                          membership.user?.profile?.name || "Unnamed Student";
                        const email = membership.user?.email || "—";
                        const isUpdating = actionId === membership.id;

                        return (
                          <tr
                            key={membership.id}
                            className="border-b border-slate-100 text-xs transition hover:bg-slate-50/70 dark:border-[#3B3441] dark:hover:bg-[#302A36]/50"
                          >
                            <td className="px-3 py-3">
                              <input
                                type="checkbox"
                                checked={selected.includes(membership.id)}
                                onChange={(event) =>
                                  toggleOne(membership.id, event.target.checked)
                                }
                                aria-label={`Select ${name}`}
                                className="h-4 w-4 accent-rose-500"
                              />
                            </td>

                            <td className="px-3 py-3 text-slate-400 dark:text-[#91899B]">
                              {(currentPage - 1) * PAGE_SIZE + index + 1}
                            </td>

                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2.5">
                                <StudentAvatar name={name} index={index} />

                                <div>
                                  <p className="whitespace-nowrap font-bold text-[#10265F] dark:text-white">
                                    {name}
                                  </p>

                                  <p className="mt-1 text-[10px] text-slate-400 dark:text-[#91899B]">
                                    Membership ID: {membership.id}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-3 py-3">
                              <p className="whitespace-nowrap text-[#506995] dark:text-[#B0A5BD]">
                                {email}
                              </p>

                              <p className="mt-1 text-[10px] text-slate-400 dark:text-[#91899B]">
                                User ID: {membership.userId}
                              </p>
                            </td>

                            <td className="whitespace-nowrap px-3 py-3 text-slate-500 dark:text-[#B0A5BD]">
                              {formatDate(membership.joinedAt)}
                            </td>

                            <td className="px-3 py-3">
                              <span
                                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ${getMembershipStatusClass(membership.status)}`}
                              >
                                {getMembershipStatusLabel(membership.status)}
                              </span>
                            </td>

                            <td className="relative px-3 py-3 text-center">
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() =>
                                  setActiveMenu(
                                    activeMenu === membership.id
                                      ? null
                                      : membership.id
                                  )
                                }
                                aria-label={`Actions for ${name}`}
                                className="rounded-lg p-2 text-[#506995] hover:bg-slate-100 disabled:opacity-50 dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
                              >
                                {isUpdating ? (
                                  <RefreshCw
                                    size={17}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <MoreVertical size={17} />
                                )}
                              </button>

                              {activeMenu === membership.id && (
                                <div className="absolute right-8 top-10 z-20 w-44 rounded-xl border border-slate-100 bg-white p-1 text-left shadow-xl dark:border-[#3B3441] dark:bg-[#211E27]">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedStudent(membership);
                                      setActiveMenu(null);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#10265F] hover:bg-slate-50 dark:text-white dark:hover:bg-[#302A36]"
                                  >
                                    <Eye size={14} />
                                    View Details
                                  </button>

                                  {membership.status === "ACTIVE" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateStudentStatus(
                                          membership,
                                          "SUSPENDED"
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                                    >
                                      <Ban size={14} />
                                      Suspend Student
                                    </button>
                                  )}

                                  {membership.status === "SUSPENDED" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateStudentStatus(
                                          membership,
                                          "ACTIVE"
                                        )
                                      }
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                                    >
                                      <Check size={14} />
                                      Activate Student
                                    </button>
                                  )}

                                  {membership.status === "PENDING_APPROVAL" && (
                                    <p className="px-3 py-2 text-[11px] leading-4 text-amber-600">
                                      Approval must be completed from the
                                      invitation record.
                                    </p>
                                  )}

                                  {membership.status === "REVOKED" && (
                                    <p className="px-3 py-2 text-[11px] leading-4 text-slate-500">
                                      This membership has been revoked.
                                    </p>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {visibleStudents.length === 0 && (
                        <tr>
                          <td colSpan="7" className="px-4 py-12 text-center">
                            <Users
                              size={30}
                              className="mx-auto mb-3 text-slate-300 dark:text-[#554D5D]"
                            />

                            <p className="font-semibold text-[#10265F] dark:text-white">
                              No students found
                            </p>

                            <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                              Try changing your search or filters, or invite a
                              student.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Student Pagination */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-[#3B3441]">
                  <p className="text-xs text-slate-500 dark:text-[#B0A5BD]">
                    Showing{" "}
                    {filteredStudents.length === 0
                      ? 0
                      : (currentPage - 1) * PAGE_SIZE + 1}
                    {" "}to{" "}
                    {Math.min(
                      currentPage * PAGE_SIZE,
                      filteredStudents.length
                    )}
                    {" "}of {filteredStudents.length} loaded students
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setPage((value) => Math.max(1, value - 1))
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={17} />
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    )
                      .slice(0, 5)
                      .map((number) => (
                        <button
                          key={number}
                          type="button"
                          onClick={() => setPage(number)}
                          className={`h-9 min-w-9 rounded-lg border px-2 text-xs font-semibold ${
                            currentPage === number
                              ? "border-[#FF2454] bg-[#FF2454] text-white"
                              : "border-slate-200 text-[#506995] hover:bg-slate-50 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
                          }`}
                        >
                          {number}
                        </button>
                      ))}

                    {totalPages > 5 && (
                      <>
                        <span className="px-1 text-slate-400">...</span>

                        <button
                          type="button"
                          onClick={() => setPage(totalPages)}
                          className={`h-9 min-w-9 rounded-lg border px-2 text-xs ${
                            currentPage === totalPages
                              ? "border-[#FF2454] bg-[#FF2454] text-white"
                              : "border-slate-200 text-[#506995] dark:border-[#3B3441] dark:text-[#B0A5BD]"
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setPage((value) =>
                          Math.min(totalPages, value + 1)
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
                      aria-label="Next page"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Invitations Table */}
            {!loading && activeTab === "invitations" && (
              <>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[1050px] border-collapse text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-semibold text-[#62769C] dark:bg-[#19171E] dark:text-[#B0A5BD]">
                        <th className="rounded-l-lg px-3 py-3">#</th>
                        <th className="px-3 py-3">Student</th>
                        <th className="px-3 py-3">Email / Phone</th>
                        <th className="px-3 py-3">Invited By</th>
                        <th className="px-3 py-3">Approval</th>
                        <th className="px-3 py-3">Expires On</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="rounded-r-lg px-3 py-3 text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleInvitations.map((invitation, index) => {
                        const name = invitation.inviteeName || "Student";
                        const isUpdating = actionId === invitation.id;

                        return (
                          <tr
                            key={invitation.id}
                            className="border-b border-slate-100 text-xs transition hover:bg-slate-50/70 dark:border-[#3B3441] dark:hover:bg-[#302A36]/50"
                          >
                            <td className="px-3 py-3 text-slate-400 dark:text-[#91899B]">
                              {(currentInvitationPage - 1) * PAGE_SIZE +
                                index +
                                1}
                            </td>

                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2.5">
                                <StudentAvatar name={name} index={index} />

                                <div>
                                  <p className="whitespace-nowrap font-bold text-[#10265F] dark:text-white">
                                    {name}
                                  </p>

                                  <p className="mt-1 text-[10px] text-slate-400 dark:text-[#91899B]">
                                    ID: {invitation.id}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-3 py-3">
                              <p className="whitespace-nowrap text-[#506995] dark:text-[#B0A5BD]">
                                {invitation.inviteeEmail}
                              </p>

                              <p className="mt-1 text-slate-400 dark:text-[#91899B]">
                                {invitation.inviteePhone || "Phone not provided"}
                              </p>
                            </td>

                            <td className="px-3 py-3">
                              <p className="whitespace-nowrap text-[#506995] dark:text-[#B0A5BD]">
                                {invitation.invitedBy?.profile?.name ||
                                  invitation.invitedBy?.email ||
                                  "—"}
                              </p>
                            </td>

                            <td className="px-3 py-3">
                              <span
                                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                                  invitation.approvalRequired
                                    ? "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
                                    : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                                }`}
                              >
                                {invitation.approvalRequired
                                  ? "Required"
                                  : "Not Required"}
                              </span>
                            </td>

                            <td className="whitespace-nowrap px-3 py-3 text-slate-500 dark:text-[#B0A5BD]">
                              {formatDate(invitation.expiresAt)}
                            </td>

                            <td className="px-3 py-3">
                              <span
                                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ${getInvitationStatusClass(invitation.status)}`}
                              >
                                {getInvitationStatusLabel(invitation.status)}
                              </span>
                            </td>

                            <td className="px-3 py-3">
                              <div className="flex min-w-[160px] flex-wrap justify-center gap-1.5">
                                {["PENDING", "EXPIRED"].includes(
                                  invitation.status
                                ) && (
                                  <button
                                    type="button"
                                    disabled={isUpdating}
                                    onClick={() =>
                                      handleInvitationAction(
                                        invitation,
                                        "resend"
                                      )
                                    }
                                    title="Resend invitation"
                                    className="rounded-lg border border-blue-100 p-2 text-blue-600 hover:bg-blue-50 disabled:opacity-50 dark:border-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/10"
                                  >
                                    <RefreshCw
                                      size={15}
                                      className={
                                        isUpdating ? "animate-spin" : ""
                                      }
                                    />
                                  </button>
                                )}

                                {invitation.status === "PENDING" && (
                                  <button
                                    type="button"
                                    disabled={isUpdating}
                                    onClick={() =>
                                      handleInvitationAction(
                                        invitation,
                                        "cancel"
                                      )
                                    }
                                    title="Cancel invitation"
                                    className="rounded-lg border border-rose-100 p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                  >
                                    <X size={15} />
                                  </button>
                                )}

                                {invitation.status ===
                                  "ACCEPTED_PENDING_APPROVAL" && (
                                  <>
                                    <button
                                      type="button"
                                      disabled={isUpdating}
                                      onClick={() =>
                                        handleInvitationAction(
                                          invitation,
                                          "approve"
                                        )
                                      }
                                      title="Approve student"
                                      className="rounded-lg border border-emerald-100 p-2 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                                    >
                                      <Check size={15} />
                                    </button>

                                    <button
                                      type="button"
                                      disabled={isUpdating}
                                      onClick={() =>
                                        handleInvitationAction(
                                          invitation,
                                          "reject"
                                        )
                                      }
                                      title="Reject student"
                                      className="rounded-lg border border-rose-100 p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                    >
                                      <X size={15} />
                                    </button>
                                  </>
                                )}

                                {isUpdating && (
                                  <RefreshCw
                                    size={15}
                                    className="animate-spin text-slate-400"
                                  />
                                )}

                                {!isUpdating &&
                                  !["PENDING", "EXPIRED", "ACCEPTED_PENDING_APPROVAL"].includes(
                                    invitation.status
                                  ) && (
                                    <span className="text-[11px] text-slate-400">
                                      No actions
                                    </span>
                                  )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {visibleInvitations.length === 0 && (
                        <tr>
                          <td colSpan="8" className="px-4 py-12 text-center">
                            <Mail
                              size={30}
                              className="mx-auto mb-3 text-slate-300 dark:text-[#554D5D]"
                            />

                            <p className="font-semibold text-[#10265F] dark:text-white">
                              No invitations found
                            </p>

                            <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                              Send a student invitation to get started.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Invitation Pagination */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-[#3B3441]">
                  <p className="text-xs text-slate-500 dark:text-[#B0A5BD]">
                    Showing{" "}
                    {filteredInvitations.length === 0
                      ? 0
                      : (currentInvitationPage - 1) * PAGE_SIZE + 1}
                    {" "}to{" "}
                    {Math.min(
                      currentInvitationPage * PAGE_SIZE,
                      filteredInvitations.length
                    )}
                    {" "}of {filteredInvitations.length} loaded invitations
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentInvitationPage === 1}
                      onClick={() =>
                        setInvitationPage((value) => Math.max(1, value - 1))
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
                      aria-label="Previous invitation page"
                    >
                      <ChevronLeft size={17} />
                    </button>

                    {Array.from(
                      { length: invitationTotalPages },
                      (_, index) => index + 1
                    )
                      .slice(0, 5)
                      .map((number) => (
                        <button
                          key={number}
                          type="button"
                          onClick={() => setInvitationPage(number)}
                          className={`h-9 min-w-9 rounded-lg border px-2 text-xs font-semibold ${
                            currentInvitationPage === number
                              ? "border-[#FF2454] bg-[#FF2454] text-white"
                              : "border-slate-200 text-[#506995] hover:bg-slate-50 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
                          }`}
                        >
                          {number}
                        </button>
                      ))}

                    <button
                      type="button"
                      disabled={
                        currentInvitationPage === invitationTotalPages
                      }
                      onClick={() =>
                        setInvitationPage((value) =>
                          Math.min(invitationTotalPages, value + 1)
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
                      aria-label="Next invitation page"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>

          <footer className="pb-2 text-center text-xs text-slate-400 dark:text-[#91899B]">
            Equilx IELTS · Institute Admin Portal
          </footer>
        </main>
      </div>

      {/* Invitation Modal */}
      {showModal && (
        <AddStudentModal
          onClose={() => setShowModal(false)}
          onAdd={sendInvitation}
          saving={saving}
        />
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:border dark:border-[#3B3441] dark:bg-[#211E27]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#10265F] dark:text-white">
                  Student Details
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
                  Institute membership information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                aria-label="Close details"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#302A36]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 flex items-center gap-3">
              <StudentAvatar
                name={
                  selectedStudent.user?.profile?.name || "Student"
                }
                index={0}
              />

              <div>
                <p className="font-bold text-[#10265F] dark:text-white">
                  {selectedStudent.user?.profile?.name || "Unnamed Student"}
                </p>

                <p className="text-xs text-slate-500 dark:text-[#B0A5BD]">
                  {selectedStudent.user?.email || "—"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                ["Membership ID", selectedStudent.id],
                ["User ID", selectedStudent.userId],
                ["Institute ID", selectedStudent.instituteId],
                ["Role", selectedStudent.role],
                ["Status", getMembershipStatusLabel(selectedStudent.status)],
                ["Joined On", formatDate(selectedStudent.joinedAt)],
                ["Created On", formatDate(selectedStudent.createdAt)],
                ["Last Updated", formatDate(selectedStudent.updatedAt)],
                [
                  "User Account",
                  selectedStudent.user?.isActive ? "Active" : "Inactive",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-2 text-sm dark:border-[#3B3441]"
                >
                  <span className="text-slate-500 dark:text-[#B0A5BD]">
                    {label}
                  </span>

                  <span className="max-w-[65%] break-all text-right font-medium text-[#10265F] dark:text-white">
                    {value || "—"}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
