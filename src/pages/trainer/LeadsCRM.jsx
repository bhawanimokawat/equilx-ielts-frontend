
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search, Plus, Users, UserPlus, Phone, Mail,
  CalendarDays, Clock, Filter, Download, MoreHorizontal,
  X, Eye, Pencil, Trash2, MessageSquare, ArrowUpRight,
  CheckCircle2, CircleDot, ChevronDown, GraduationCap,
  FileText, TrendingUp, Send, RefreshCw, LoaderCircle,
  AlertCircle, Upload, Save, History, UserRound,
  CalendarPlus, ListChecks, Check, Ban,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import leadCRMService from "../../services/Trainer/leadCRMService.js";

const STATUSES = [
  { id: "NEW", label: "New" },
  { id: "CONTACTED", label: "Contacted" },
  { id: "DEMO_BOOKED", label: "Demo Booked" },
  { id: "NEGOTIATION", label: "Negotiation" },
  { id: "ENROLLED", label: "Enrolled" },
  { id: "LOST", label: "Lost" },
];

const STATUS_COLORS = {
  NEW: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  CONTACTED:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  DEMO_BOOKED:
    "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  NEGOTIATION:
    "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  ENROLLED:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  LOST: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
};

const BORDER = "border-slate-100 dark:border-[#3B3441]";
const MUTED = "text-slate-500 dark:text-[#B0A5BD]";
const PINK = "bg-[#FF2454] text-white hover:bg-[#e91d49]";

const INPUT =
  "w-full rounded-xl border border-slate-200 bg-white " +
  "px-3.5 py-3 text-sm text-slate-800 outline-none " +
  "transition focus:border-[#10265F] focus:ring-4 " +
  "focus:ring-blue-900/5 dark:border-[#3B3441] " +
  "dark:bg-[#19171E] dark:text-gray-100";

const EMPTY_LEAD = {
  name: "",
  email: "",
  phone: "",
  interestedIn: "",
  sourceId: "",
  ownerId: "",
  notes: "",
  targetBand: "",
  examDate: "",
  nextFollowUpAt: "",
  tags: "",
};

const EMPTY_FOLLOWUP = {
  title: "",
  notes: "",
  dueAt: "",
  assignedToId: "",
};

function displayDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function displayDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function localInputDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const local = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return local.toISOString().slice(0, 16);
}

function dateOnly(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const local = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return local.toISOString().slice(0, 10);
}

function isoOrNull(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Please enter a valid date.");
  }

  return date.toISOString();
}

function nameOf(user) {
  if (!user) return "—";

  if (typeof user === "string") return user;

  return (
    user.profile?.name ||
    user.profile?.fullName ||
    user.name ||
    user.email ||
    "—"
  );
}

function statusLabel(status) {
  return (
    STATUSES.find((item) => item.id === status)?.label ||
    status ||
    "—"
  );
}

function leadSource(lead, sources) {
  if (lead.source?.name) return lead.source.name;

  return (
    sources.find((item) => item.id === lead.sourceId)?.name ||
    "—"
  );
}

function leadOwner(lead, users) {
  const assignedId =
    lead.assignedToId ||
    lead.ownerId ||
    lead.owner?.id ||
    lead.assignedTo?.id;

  if (lead.owner) return nameOf(lead.owner);
  if (lead.assignedTo) return nameOf(lead.assignedTo);

  return (
    users.find((user) => user.id === assignedId)
      ? nameOf(users.find((user) => user.id === assignedId))
      : "—"
  );
}

function Badge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
        STATUS_COLORS[status] ||
        "bg-gray-100 text-gray-600 dark:bg-[#302B37]"
      }`}
    >
      {statusLabel(status)}
    </span>
  );
}

function Avatar({ name, size = "md" }) {
  const initials = String(name || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full
        bg-indigo-100 font-bold text-indigo-700
        dark:bg-indigo-500/20 dark:text-indigo-300 ${
          size === "lg"
            ? "h-14 w-14 text-lg"
            : "h-10 w-10 text-sm"
        }`}
    >
      {initials}
    </span>
  );
}

function HoverCard({ children, className = "" }) {
  return (
    <div className={`group relative isolate h-full pb-2 ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0
          top-2 rounded-2xl bg-pink-100 opacity-0 transition-opacity
          duration-300 group-hover:opacity-100 dark:bg-[#4A2538]"
      />
      <div
        className={`relative z-10 flex h-full flex-col rounded-2xl
          border ${BORDER} bg-white shadow-sm transition-transform
          duration-300 group-hover:-translate-y-1.5
          dark:bg-[#211E27]`}
      >
        {children}
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <HoverCard>
      <div className="flex h-full min-h-[190px] flex-col p-5">
        <div className="flex items-start justify-between">
          <span
            className={`flex h-12 w-12 items-center
              justify-center rounded-xl ${color}`}
          >
            <Icon size={23} />
          </span>
          <ArrowUpRight size={18} className={MUTED} />
        </div>

        <p className={`mt-5 text-sm font-semibold ${MUTED}`}>
          {title}
        </p>

        <p className="mt-2 text-3xl font-extrabold">{value}</p>

        <p className={`mt-auto pt-3 text-xs ${MUTED}`}>
          {subtitle}
        </p>
      </div>
    </HoverCard>
  );
}

function Modal({ title, children, onClose, wide = false }) {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center
        justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[90vh] w-full overflow-y-auto
          rounded-2xl border ${BORDER} bg-white shadow-2xl
          dark:bg-[#211E27] ${
            wide ? "max-w-4xl" : "max-w-xl"
          }`}
      >
        <header
          className={`sticky top-0 z-10 flex items-center
            justify-between border-b ${BORDER} bg-white
            px-5 py-4 dark:bg-[#211E27]`}
        >
          <h2 className="text-lg font-bold">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 hover:bg-gray-100
              dark:hover:bg-[#302B37]"
          >
            <X size={20} />
          </button>
        </header>

        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">
        {label}
      </span>
      {children}
    </label>
  );
}

function DetailRow({ label, value, icon: Icon }) {
  return (
    <div
      className={`flex flex-col gap-2 border-b ${BORDER}
        py-3 last:border-0 sm:flex-row sm:items-center
        sm:justify-between`}
    >
      <span className={`flex items-center gap-2 text-sm ${MUTED}`}>
        {Icon && <Icon size={16} />}
        {label}
      </span>

      <span className="break-words text-sm font-semibold">
        {value === null || value === undefined || value === ""
          ? "—"
          : value}
      </span>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="px-5 py-14 text-center">
      <Users size={35} className="mx-auto text-gray-300" />
      <p className="mt-4 font-bold">{title}</p>
      <p className={`mx-auto mt-2 max-w-md text-sm ${MUTED}`}>
        {description}
      </p>
    </div>
  );
}

export default function LeadsCRM() {
  const [leads, setLeads] = useState([]);
  const [sources, setSources] = useState([]);
  const [users, setUsers] = useState([]);
  const [followUps, setFollowUps] = useState([]);

  const [leadsComplete, setLeadsComplete] = useState(false);
  const [followUpsComplete, setFollowUpsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedLead, setSelectedLead] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [leadForm, setLeadForm] = useState(EMPTY_LEAD);

  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpForm, setFollowUpForm] =
    useState(EMPTY_FOLLOWUP);

  const [showActivity, setShowActivity] = useState(false);
  const [activityForm, setActivityForm] = useState({
    type: "NOTE",
    subject: "",
    description: "",
    outcome: "",
  });

  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  const [menuLead, setMenuLead] = useState(null);
  const [detailsTab, setDetailsTab] = useState("Overview");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    const results = await Promise.allSettled([
      leadCRMService.getAllLeads(),
      leadCRMService.listSources(),
      leadCRMService.getAssignableUsers(),
      leadCRMService.getAllFollowUps(),
    ]);

    const failures = [];

    if (results[0].status === "fulfilled") {
      setLeads(results[0].value.leads);
      setLeadsComplete(results[0].value.complete);
    } else {
      failures.push(
        `Leads: ${results[0].reason?.message || "Failed"}`
      );
    }

    if (results[1].status === "fulfilled") {
      setSources(results[1].value);
    } else {
      failures.push(
        `Sources: ${results[1].reason?.message || "Failed"}`
      );
    }

    if (results[2].status === "fulfilled") {
      setUsers(results[2].value);
    } else {
      failures.push(
        `Assignable users: ${results[2].reason?.message || "Failed"}`
      );
    }

    if (results[3].status === "fulfilled") {
      setFollowUps(results[3].value.followUps);
      setFollowUpsComplete(results[3].value.complete);
    } else {
      failures.push(
        `Follow-ups: ${results[3].reason?.message || "Failed"}`
      );
    }

    if (failures.length) setError(failures.join(" | "));

    setLoading(false);

    return failures.length === 0;
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const text = [
        lead.name,
        lead.email,
        lead.phone,
        lead.interestedIn,
        lead.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || text.includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        lead.status === statusFilter;

      const matchesSource =
        sourceFilter === "All" ||
        lead.sourceId === sourceFilter ||
        lead.source?.id === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, search, statusFilter, sourceFilter]);

  const counts = useMemo(() => {
    const count = (status) =>
      leads.filter((lead) => lead.status === status).length;

    const enrolled = count("ENROLLED");

    return {
      total: leads.length,
      new: count("NEW"),
      active:
        count("CONTACTED") +
        count("DEMO_BOOKED") +
        count("NEGOTIATION"),
      enrolled,
      conversion: leads.length
        ? Math.round((enrolled / leads.length) * 100)
        : 0,
    };
  }, [leads]);

  const pendingFollowUps = useMemo(
    () =>
      followUps.filter((item) => item.status === "PENDING"),
    [followUps]
  );

  const todayFollowUps = useMemo(() => {
    const now = new Date();
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return pendingFollowUps.filter((item) => {
      const date = new Date(item.dueAt);
      return date >= start && date < end;
    });
  }, [pendingFollowUps]);

  const runAction = async (action, successMessage) => {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      await action();
      const refreshed = await load();

      if (!refreshed) {
        setNotice(
          "Action completed, but some CRM data could not be refreshed."
        );
      } else {
        setNotice(successMessage);
      }

      return true;
    } catch (err) {
      setError(err.message || "CRM action failed.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setLeadForm(EMPTY_LEAD);
    setShowForm(true);
  };

  const openEdit = async (lead) => {
    setError("");

    try {
      const full = await leadCRMService.getLead(lead.id);

      setEditingId(lead.id);
      setLeadForm({
        name: full.name || "",
        email: full.email || "",
        phone: full.phone || "",
        interestedIn: full.interestedIn || "",
        sourceId: full.sourceId || "",
        ownerId: full.ownerId || "",
        notes: full.notes || "",
        targetBand: full.targetBand ?? "",
        examDate: dateOnly(full.examDate),
        nextFollowUpAt: localInputDate(full.nextFollowUpAt),
        tags: Array.isArray(full.tags)
          ? full.tags.join(", ")
          : "",
      });
      setShowForm(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const changeLeadForm = (event) => {
    const { name, value } = event.target;

    setLeadForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveLead = async (event) => {
    event.preventDefault();

    if (!leadForm.name.trim()) {
      setError("Lead name is required.");
      return;
    }

    if (!leadForm.email.trim() && !leadForm.phone.trim()) {
      setError("Provide an email address or phone number.");
      return;
    }

    let payload;

    try {
      payload = {
        name: leadForm.name.trim(),
        email: leadForm.email.trim() || null,
        phone: leadForm.phone.trim() || null,
        interestedIn: leadForm.interestedIn.trim() || null,
        sourceId: leadForm.sourceId || null,
        ownerId: leadForm.ownerId || null,
        notes: leadForm.notes.trim() || null,
        targetBand:
          leadForm.targetBand === ""
            ? null
            : Number(leadForm.targetBand),
        examDate: leadForm.examDate
          ? isoOrNull(`${leadForm.examDate}T12:00`)
          : null,
        nextFollowUpAt: isoOrNull(
          leadForm.nextFollowUpAt
        ),
        tags: [
          ...new Set(
            leadForm.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          ),
        ],
      };
    } catch (err) {
      setError(err.message);
      return;
    }

    const ok = await runAction(
      () =>
        editingId
          ? leadCRMService.updateLead(editingId, payload)
          : leadCRMService.createLead(payload),
      editingId
        ? "Lead updated successfully."
        : "Lead created successfully."
    );

    if (ok) {
      setShowForm(false);
      setEditingId(null);
    }
  };

  const changeStatus = async (lead, status) => {
    if (lead.status === status) return;

    const reason =
      status === "LOST"
        ? window.prompt("Reason for losing this lead:")
        : null;

    if (status === "LOST" && reason === null) return;

    const ok = await runAction(
      () =>
        leadCRMService.updateStatus(
          lead.id,
          status,
          reason || null
        ),
      `Lead moved to ${statusLabel(status)}.`
    );

    if (ok && selectedLead?.id === lead.id) {
      setSelectedLead((previous) => ({
        ...previous,
        status,
      }));
    }
  };

  const deleteLead = async (lead) => {
    if (!window.confirm(`Delete ${lead.name}?`)) return;

    const ok = await runAction(
      () => leadCRMService.deleteLead(lead.id),
      "Lead deleted successfully."
    );

    if (ok) {
      setSelectedLead(null);
      setMenuLead(null);
    }
  };

  const openDetails = async (lead) => {
    setError("");
    setDetailsTab("Overview");
    setActivities([]);

    try {
      const full = await leadCRMService.getLead(lead.id);
      setSelectedLead(full);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadActivities = async (leadId) => {
    setActivitiesLoading(true);

    try {
      const result = await leadCRMService.getActivities(leadId);
      setActivities(result.activities);
    } catch (err) {
      setError(err.message);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const switchDetailsTab = (tab) => {
    setDetailsTab(tab);

    if (tab === "Activity" && selectedLead) {
      loadActivities(selectedLead.id);
    }
  };

  const saveActivity = async (event) => {
    event.preventDefault();
    if (!selectedLead) return;

    const ok = await runAction(
      () =>
        leadCRMService.createActivity(selectedLead.id, {
          type: activityForm.type,
          subject: activityForm.subject.trim() || null,
          description:
            activityForm.description.trim() || null,
          outcome: activityForm.outcome.trim() || null,
        }),
      "Lead activity added."
    );

    if (ok) {
      setShowActivity(false);
      setActivityForm({
        type: "NOTE",
        subject: "",
        description: "",
        outcome: "",
      });
      await loadActivities(selectedLead.id);
    }
  };

  const saveFollowUp = async (event) => {
    event.preventDefault();
    if (!selectedLead) return;

    let dueAt;

    try {
      dueAt = isoOrNull(followUpForm.dueAt);
      if (!dueAt) throw new Error("Due date is required.");
    } catch (err) {
      setError(err.message);
      return;
    }

    const payload = {
      title: followUpForm.title.trim(),
      notes: followUpForm.notes.trim() || null,
      dueAt,
      ...(followUpForm.assignedToId
        ? { assignedToId: followUpForm.assignedToId }
        : {}),
    };

    const ok = await runAction(
      () =>
        leadCRMService.createFollowUp(
          selectedLead.id,
          payload
        ),
      "Follow-up scheduled successfully."
    );

    if (ok) {
      setShowFollowUp(false);
      setFollowUpForm(EMPTY_FOLLOWUP);
    }
  };

  const completeFollowUp = (item) =>
    runAction(
      () => leadCRMService.completeFollowUp(item.id),
      "Follow-up completed."
    );

  const cancelFollowUp = (item) =>
    runAction(
      () => leadCRMService.cancelFollowUp(item.id),
      "Follow-up cancelled."
    );

  const exportCsv = async () => {
    setSaving(true);
    setError("");

    try {
      const blob = await leadCRMService.exportCsv();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "equilx-crm-leads.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
      setNotice("CSV export downloaded.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const importCsv = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const csv = await file.text();

      await runAction(
        () => leadCRMService.importCsv(csv),
        "CSV import completed."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      event.target.value = "";
    }
  };

  const countText = (value) =>
    loading ? "…" : leadsComplete ? value : "—";

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#F5F7FF]
        text-[#10265F] dark:bg-[#17151B] dark:text-gray-100"
    >
      <Sidebar />

      <div className="min-w-0 lg:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* HEADER */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className={`mb-2 text-sm ${MUTED}`}>
                Trainer Portal / Leads & CRM
              </p>

              <h1 className="text-2xl font-extrabold sm:text-3xl">
                Leads & CRM
              </h1>

              <p className={`mt-2 text-sm ${MUTED}`}>
                Track prospective students, manage your pipeline
                and schedule follow-ups.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={load}
                disabled={loading}
                className={`flex items-center gap-2 rounded-xl
                  border ${BORDER} bg-white px-4 py-3
                  text-sm font-semibold disabled:opacity-50
                  dark:bg-[#211E27]`}
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={openAdd}
                className={`flex items-center gap-2 rounded-xl
                  px-5 py-3 text-sm font-semibold ${PINK}`}
              >
                <Plus size={18} />
                Add New Lead
              </button>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border
                border-red-200 bg-red-50 p-4 text-sm text-red-700
                dark:bg-red-500/10 dark:text-red-300"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span className="flex-1 break-words">{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="flex items-center justify-between gap-3
                rounded-xl bg-blue-50 p-4 text-sm text-blue-700
                dark:bg-blue-500/10 dark:text-blue-300"
            >
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss notice"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* FOUR EQUAL STAT CARDS */}
          <section className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Leads"
              value={countText(counts.total)}
              subtitle="Prospective students in CRM"
              icon={Users}
              color="bg-blue-50 text-blue-600 dark:bg-[#202B3B]"
            />

            <StatCard
              title="New Leads"
              value={countText(counts.new)}
              subtitle="Leads awaiting first contact"
              icon={UserPlus}
              color="bg-violet-50 text-violet-600 dark:bg-[#30263D]"
            />

            <StatCard
              title="Active Pipeline"
              value={countText(counts.active)}
              subtitle="Contacted, demo booked and negotiation"
              icon={TrendingUp}
              color="bg-orange-50 text-orange-600 dark:bg-[#3B3020]"
            />

            <StatCard
              title="Conversion Rate"
              value={countText(`${counts.conversion}%`)}
              subtitle={`${counts.enrolled} enrolled leads`}
              icon={CheckCircle2}
              color="bg-emerald-50 text-emerald-600 dark:bg-[#1F352E]"
            />
          </section>

          {/* PIPELINE */}
          <section
            className={`rounded-2xl border ${BORDER}
              bg-white p-5 shadow-sm dark:bg-[#211E27] sm:p-6`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Lead Pipeline</h2>
                <p className={`mt-1 text-sm ${MUTED}`}>
                  Current leads at each CRM stage.
                </p>
              </div>

              <span className={`text-xs ${MUTED}`}>
                {leadsComplete
                  ? "Based on all loaded leads"
                  : "Totals unavailable or partial"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              {STATUSES.map((status) => {
                const count = leads.filter(
                  (lead) => lead.status === status.id
                ).length;

                return (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => setStatusFilter(status.id)}
                    className={`rounded-xl border ${BORDER}
                      bg-gray-50 p-4 text-left transition
                      hover:-translate-y-1 hover:border-pink-200
                      hover:bg-pink-50 dark:bg-[#302B37]
                      dark:hover:bg-[#3B2C3B]`}
                  >
                    <Badge status={status.id} />

                    <p className="mt-4 text-3xl font-extrabold">
                      {loading ? "…" : leadsComplete ? count : "—"}
                    </p>

                    <p className={`mt-2 text-xs ${MUTED}`}>
                      {status.label} leads
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* FOLLOW-UPS */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <HoverCard>
              <div className="flex h-full flex-col p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Follow-ups Due Today</h3>
                    <p className={`mt-1 text-sm ${MUTED}`}>
                      Tasks scheduled for today
                    </p>
                  </div>
                  <CalendarDays
                    size={23}
                    className="text-[#FF2454]"
                  />
                </div>

                <p className="mt-5 text-3xl font-extrabold">
                  {loading
                    ? "…"
                    : followUpsComplete
                      ? todayFollowUps.length
                      : "—"}
                </p>

                <p className={`mt-auto pt-3 text-xs ${MUTED}`}>
                  {followUpsComplete
                    ? "Calculated from pending follow-ups"
                    : "Follow-up data may be incomplete"}
                </p>
              </div>
            </HoverCard>

            <HoverCard>
              <div className="flex h-full flex-col p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Pending Follow-ups</h3>
                    <p className={`mt-1 text-sm ${MUTED}`}>
                      Outstanding CRM tasks
                    </p>
                  </div>
                  <Clock
                    size={23}
                    className="text-orange-500"
                  />
                </div>

                <p className="mt-5 text-3xl font-extrabold">
                  {loading
                    ? "…"
                    : followUpsComplete
                      ? pendingFollowUps.length
                      : "—"}
                </p>

                <p className={`mt-auto pt-3 text-xs ${MUTED}`}>
                  {followUpsComplete
                    ? "Tasks not yet completed or cancelled"
                    : "Follow-up data may be incomplete"}
                </p>
              </div>
            </HoverCard>
          </section>

          {/* SEARCH AND FILTERS */}
          <section
            className={`rounded-2xl border ${BORDER}
              bg-white p-5 shadow-sm dark:bg-[#211E27]`}
          >
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2
                    -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, email, phone or course..."
                  className={`${INPUT} pl-10`}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
                className={`flex items-center justify-center gap-2
                  rounded-xl border ${BORDER} px-5 py-3
                  text-sm font-semibold`}
              >
                <Filter size={17} />
                Filters
                <ChevronDown size={15} />
              </button>

              <button
                type="button"
                onClick={exportCsv}
                disabled={saving}
                className={`flex items-center justify-center gap-2
                  rounded-xl border ${BORDER} px-5 py-3
                  text-sm font-semibold disabled:opacity-50`}
              >
                <Download size={17} />
                Export CSV
              </button>

              <label
                className={`flex cursor-pointer items-center
                  justify-center gap-2 rounded-xl border ${BORDER}
                  px-5 py-3 text-sm font-semibold`}
              >
                <Upload size={17} />
                Import CSV

                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={importCsv}
                  className="hidden"
                  disabled={saving}
                />
              </label>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className={INPUT}
                >
                  <option value="All">All Statuses</option>
                  {STATUSES.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>

                <select
                  value={sourceFilter}
                  onChange={(event) =>
                    setSourceFilter(event.target.value)
                  }
                  className={INPUT}
                >
                  <option value="All">All Sources</option>
                  {sources.map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setSourceFilter("All");
                  }}
                  className={`rounded-xl border ${BORDER}
                    px-4 py-3 text-sm font-semibold`}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </section>

          {/* LEADS TABLE */}
          <section
            className={`overflow-hidden rounded-2xl border ${BORDER}
              bg-white shadow-sm dark:bg-[#211E27]`}
          >
            <div
              className={`flex flex-wrap items-center justify-between
                gap-3 border-b ${BORDER} p-5 sm:p-6`}
            >
              <div>
                <h2 className="text-lg font-bold">All Leads</h2>
                <p className={`mt-1 text-sm ${MUTED}`}>
                  Manage prospective students and their progress.
                </p>
              </div>

              <span className={`text-sm ${MUTED}`}>
                {filteredLeads.length} displayed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] text-left">
                <thead className="bg-gray-50 dark:bg-[#302B37]">
                  <tr
                    className={`text-xs uppercase tracking-wide ${MUTED}`}
                  >
                    <th className="px-5 py-4">Lead</th>
                    <th className="px-5 py-4">Interested Course</th>
                    <th className="px-5 py-4">Source</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Assigned To</th>
                    <th className="px-5 py-4">Follow-up</th>
                    <th className="px-5 py-4">Created</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-[#3B3441]">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-14 text-center">
                        <LoaderCircle
                          size={28}
                          className="mx-auto animate-spin
                            text-[#FF2454]"
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="transition hover:bg-pink-50/40
                          dark:hover:bg-[#302632]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={lead.name} />

                            <div className="min-w-0">
                              <p className="font-semibold">
                                {lead.name}
                              </p>

                              <p className={`mt-1 text-xs ${MUTED}`}>
                                {lead.email || lead.phone || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {lead.interestedIn || "—"}
                        </td>

                        <td className={`px-5 py-4 text-sm ${MUTED}`}>
                          {leadSource(lead, sources)}
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={lead.status || "NEW"}
                            onChange={(event) =>
                              changeStatus(lead, event.target.value)
                            }
                            disabled={saving}
                            aria-label={`Status for ${lead.name}`}
                            className={`max-w-[160px] rounded-lg
                              border ${BORDER} bg-transparent px-2
                              py-2 text-xs font-semibold outline-none`}
                          >
                            {STATUSES.map((status) => (
                              <option
                                key={status.id}
                                value={status.id}
                                className="text-gray-900"
                              >
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className={`px-5 py-4 text-sm ${MUTED}`}>
                          {leadOwner(lead, users)}
                        </td>

                        <td className={`px-5 py-4 text-sm ${MUTED}`}>
                          {displayDateTime(lead.nextFollowUpAt)}
                        </td>

                        <td className={`px-5 py-4 text-sm ${MUTED}`}>
                          {displayDate(lead.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openDetails(lead)}
                              title="View details"
                              className="rounded-lg p-2 hover:bg-blue-50
                                dark:hover:bg-[#302B37]"
                            >
                              <Eye size={18} />
                            </button>

                            <button
                              type="button"
                              onClick={() => openEdit(lead)}
                              title="Edit lead"
                              className="rounded-lg p-2 hover:bg-blue-50
                                dark:hover:bg-[#302B37]"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteLead(lead)}
                              title="Delete lead"
                              className="rounded-lg p-2 text-red-500
                                hover:bg-red-50 dark:hover:bg-[#39232F]"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!loading && filteredLeads.length === 0 && (
              <EmptyState
                title="No leads found"
                description={
                  leads.length === 0
                    ? "No CRM lead records are available. New leads will appear here after they are added."
                    : "No leads match the current search and filters."
                }
              />
            )}

            <div
              className={`border-t ${BORDER} px-5 py-4
                text-sm ${MUTED}`}
            >
              Showing {filteredLeads.length} leads
              {!leadsComplete && " · Data may be incomplete"}
            </div>
          </section>

          {/* FOLLOW-UP TASK LIST */}
          <section
            className={`overflow-hidden rounded-2xl border ${BORDER}
              bg-white shadow-sm dark:bg-[#211E27]`}
          >
            <div className={`border-b ${BORDER} p-5 sm:p-6`}>
              <h2 className="text-lg font-bold">Follow-up Tasks</h2>
              <p className={`mt-1 text-sm ${MUTED}`}>
                Pending calls, meetings and counselling follow-ups.
              </p>
            </div>

            {pendingFollowUps.length === 0 ? (
              <EmptyState
                title="No pending follow-ups"
                description="Follow-up tasks will appear when they are scheduled."
              />
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-[#3B3441]">
                {pendingFollowUps
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(a.dueAt) - new Date(b.dueAt)
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 p-5
                        sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold">
                          {item.title}
                        </p>

                        <p className={`mt-1 text-sm ${MUTED}`}>
                          Due: {displayDateTime(item.dueAt)}
                        </p>

                        {item.notes && (
                          <p className={`mt-2 text-sm ${MUTED}`}>
                            {item.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => completeFollowUp(item)}
                          disabled={saving}
                          className="flex items-center gap-2
                            rounded-lg bg-emerald-50 px-3 py-2
                            text-xs font-semibold text-emerald-700
                            disabled:opacity-50"
                        >
                          <Check size={15} />
                          Complete
                        </button>

                        <button
                          type="button"
                          onClick={() => cancelFollowUp(item)}
                          disabled={saving}
                          className="flex items-center gap-2
                            rounded-lg bg-red-50 px-3 py-2
                            text-xs font-semibold text-red-600
                            disabled:opacity-50"
                        >
                          <Ban size={15} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ADD / EDIT LEAD */}
      {showForm && (
        <Modal
          title={editingId ? "Edit Lead" : "Add New Lead"}
          onClose={() => !saving && setShowForm(false)}
          wide
        >
          <form onSubmit={saveLead} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name *">
                <input
                  name="name"
                  value={leadForm.name}
                  onChange={changeLeadForm}
                  required
                  maxLength={150}
                  className={INPUT}
                />
              </Field>

              <Field label="Email Address">
                <input
                  type="email"
                  name="email"
                  value={leadForm.email}
                  onChange={changeLeadForm}
                  className={INPUT}
                />
              </Field>

              <Field label="Phone Number">
                <input
                  type="tel"
                  name="phone"
                  value={leadForm.phone}
                  onChange={changeLeadForm}
                  maxLength={30}
                  className={INPUT}
                />
              </Field>

              <Field label="Interested Course">
                <input
                  name="interestedIn"
                  value={leadForm.interestedIn}
                  onChange={changeLeadForm}
                  placeholder="IELTS Academic, IELTS General..."
                  maxLength={150}
                  className={INPUT}
                />
              </Field>

              <Field label="Lead Source">
                <select
                  name="sourceId"
                  value={leadForm.sourceId}
                  onChange={changeLeadForm}
                  className={INPUT}
                >
                  <option value="">Select source</option>
                  {sources.map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Assigned Owner">
                <select
                  name="ownerId"
                  value={leadForm.ownerId}
                  onChange={changeLeadForm}
                  className={INPUT}
                >
                  <option value="">Default owner</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {nameOf(user)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Target IELTS Band">
                <input
                  type="number"
                  name="targetBand"
                  value={leadForm.targetBand}
                  onChange={changeLeadForm}
                  min="0"
                  max="9"
                  step="0.5"
                  className={INPUT}
                />
              </Field>

              <Field label="Exam Date">
                <input
                  type="date"
                  name="examDate"
                  value={leadForm.examDate}
                  onChange={changeLeadForm}
                  className={INPUT}
                />
              </Field>

              <Field label="Next Follow-up">
                <input
                  type="datetime-local"
                  name="nextFollowUpAt"
                  value={leadForm.nextFollowUpAt}
                  onChange={changeLeadForm}
                  className={INPUT}
                />
              </Field>

              <Field label="Tags (comma separated)">
                <input
                  name="tags"
                  value={leadForm.tags}
                  onChange={changeLeadForm}
                  placeholder="High priority, Weekend batch"
                  className={INPUT}
                />
              </Field>
            </div>

            <Field label="Notes">
              <textarea
                name="notes"
                value={leadForm.notes}
                onChange={changeLeadForm}
                rows={4}
                maxLength={5000}
                placeholder="Add counselling notes..."
                className={INPUT}
              />
            </Field>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={saving}
                className={`flex-1 rounded-xl border ${BORDER}
                  px-4 py-3 text-sm font-semibold`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`flex flex-1 items-center justify-center
                  gap-2 rounded-xl px-4 py-3 text-sm
                  font-semibold disabled:opacity-50 ${PINK}`}
              >
                <Save size={17} />
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Lead"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* LEAD DETAILS */}
      {selectedLead && !showFollowUp && !showActivity && (
        <Modal
          title="Lead Details"
          onClose={() => setSelectedLead(null)}
          wide
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar name={selectedLead.name} size="lg" />

              <div className="flex-1">
                <h3 className="text-xl font-bold">
                  {selectedLead.name}
                </h3>

                <p className={`mt-1 text-sm ${MUTED}`}>
                  {selectedLead.email ||
                    selectedLead.phone ||
                    "No contact information"}
                </p>
              </div>

              <Badge status={selectedLead.status} />
            </div>

            <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4 dark:border-[#3B3441]">
              {["Overview", "Activity"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => switchDetailsTab(tab)}
                  className={`rounded-lg px-4 py-2.5
                    text-sm font-semibold ${
                      detailsTab === tab
                        ? PINK
                        : "bg-gray-50 text-gray-500 dark:bg-[#302B37]"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {detailsTab === "Overview" ? (
              <>
                <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                  <DetailRow
                    icon={UserRound}
                    label="Full Name"
                    value={selectedLead.name}
                  />

                  <DetailRow
                    icon={Mail}
                    label="Email"
                    value={selectedLead.email}
                  />

                  <DetailRow
                    icon={Phone}
                    label="Phone"
                    value={selectedLead.phone}
                  />

                  <DetailRow
                    icon={GraduationCap}
                    label="Interested Course"
                    value={selectedLead.interestedIn}
                  />

                  <DetailRow
                    icon={CircleDot}
                    label="Source"
                    value={leadSource(selectedLead, sources)}
                  />

                  <DetailRow
                    icon={Users}
                    label="Assigned To"
                    value={leadOwner(selectedLead, users)}
                  />

                  <DetailRow
                    icon={TrendingUp}
                    label="Target Band"
                    value={selectedLead.targetBand}
                  />

                  <DetailRow
                    icon={CalendarDays}
                    label="Exam Date"
                    value={displayDate(selectedLead.examDate)}
                  />

                  <DetailRow
                    icon={Clock}
                    label="Next Follow-up"
                    value={displayDateTime(
                      selectedLead.nextFollowUpAt
                    )}
                  />

                  <DetailRow
                    icon={CalendarDays}
                    label="Created"
                    value={displayDate(selectedLead.createdAt)}
                  />
                </div>

                <section>
                  <h4 className="mb-3 font-bold">Lead Notes</h4>
                  <p
                    className={`whitespace-pre-wrap rounded-xl border
                      ${BORDER} p-4 text-sm leading-7 ${MUTED}`}
                  >
                    {selectedLead.notes || "No notes available."}
                  </p>
                </section>

                {Array.isArray(selectedLead.tags) &&
                  selectedLead.tags.length > 0 && (
                    <section>
                      <h4 className="mb-3 font-bold">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedLead.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-pink-50
                              px-3 py-1.5 text-xs font-semibold
                              text-[#FF2454] dark:bg-[#4A2538]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                <section>
                  <h4 className="mb-3 font-bold">
                    Update Pipeline Status
                  </h4>

                  <select
                    value={selectedLead.status || "NEW"}
                    onChange={(event) =>
                      changeStatus(
                        selectedLead,
                        event.target.value
                      )
                    }
                    disabled={saving}
                    className={INPUT}
                  >
                    {STATUSES.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </section>
              </>
            ) : (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-bold">Activity Timeline</h4>

                  <button
                    type="button"
                    onClick={() => setShowActivity(true)}
                    className={`flex items-center gap-2 rounded-lg
                      px-3 py-2 text-sm font-semibold ${PINK}`}
                  >
                    <Plus size={16} />
                    Add Activity
                  </button>
                </div>

                {activitiesLoading ? (
                  <LoaderCircle
                    className="mx-auto animate-spin text-[#FF2454]"
                  />
                ) : activities.length === 0 ? (
                  <EmptyState
                    title="No activities"
                    description="Calls, notes and meetings will appear in the activity timeline."
                  />
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className={`rounded-xl border ${BORDER} p-4`}
                      >
                        <div className="flex flex-wrap justify-between gap-2">
                          <p className="font-semibold">
                            {activity.subject ||
                              activity.type ||
                              "Activity"}
                          </p>

                          <span className={`text-xs ${MUTED}`}>
                            {displayDateTime(activity.createdAt)}
                          </span>
                        </div>

                        <p className={`mt-2 text-sm ${MUTED}`}>
                          {activity.description ||
                            activity.outcome ||
                            "No description"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  setFollowUpForm(EMPTY_FOLLOWUP);
                  setShowFollowUp(true);
                }}
                className={`flex items-center justify-center gap-2
                  rounded-xl px-4 py-3 text-sm font-semibold ${PINK}`}
              >
                <CalendarPlus size={17} />
                Schedule Follow-up
              </button>

              <button
                type="button"
                onClick={() => setShowActivity(true)}
                className={`flex items-center justify-center gap-2
                  rounded-xl border ${BORDER} px-4 py-3
                  text-sm font-semibold`}
              >
                <MessageSquare size={17} />
                Add Activity
              </button>

              <button
                type="button"
                onClick={() => {
                  const lead = selectedLead;
                  setSelectedLead(null);
                  openEdit(lead);
                }}
                className={`flex items-center justify-center gap-2
                  rounded-xl border ${BORDER} px-4 py-3
                  text-sm font-semibold`}
              >
                <Pencil size={17} />
                Edit Lead
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* SCHEDULE FOLLOW-UP */}
      {showFollowUp && selectedLead && (
        <Modal
          title="Schedule Follow-up"
          onClose={() => setShowFollowUp(false)}
        >
          <form onSubmit={saveFollowUp} className="space-y-4">
            <p className={`text-sm ${MUTED}`}>
              Lead: <strong>{selectedLead.name}</strong>
            </p>

            <Field label="Follow-up Title">
              <input
                value={followUpForm.title}
                onChange={(event) =>
                  setFollowUpForm((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
                maxLength={200}
                required
                className={INPUT}
              />
            </Field>

            <Field label="Due Date & Time">
              <input
                type="datetime-local"
                value={followUpForm.dueAt}
                onChange={(event) =>
                  setFollowUpForm((previous) => ({
                    ...previous,
                    dueAt: event.target.value,
                  }))
                }
                required
                className={INPUT}
              />
            </Field>

            <Field label="Assigned To">
              <select
                value={followUpForm.assignedToId}
                onChange={(event) =>
                  setFollowUpForm((previous) => ({
                    ...previous,
                    assignedToId: event.target.value,
                  }))
                }
                className={INPUT}
              >
                <option value="">Default assignee</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {nameOf(user)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Notes">
              <textarea
                rows={4}
                maxLength={5000}
                value={followUpForm.notes}
                onChange={(event) =>
                  setFollowUpForm((previous) => ({
                    ...previous,
                    notes: event.target.value,
                  }))
                }
                className={INPUT}
              />
            </Field>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowFollowUp(false)}
                className={`flex-1 rounded-xl border ${BORDER}
                  px-4 py-3 text-sm font-semibold`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`flex-1 rounded-xl px-4 py-3
                  text-sm font-semibold disabled:opacity-50 ${PINK}`}
              >
                {saving ? "Saving..." : "Schedule"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ADD ACTIVITY */}
      {showActivity && selectedLead && (
        <Modal
          title="Add Lead Activity"
          onClose={() => setShowActivity(false)}
        >
          <form onSubmit={saveActivity} className="space-y-4">
            <Field label="Activity Type">
              <select
                value={activityForm.type}
                onChange={(event) =>
                  setActivityForm((previous) => ({
                    ...previous,
                    type: event.target.value,
                  }))
                }
                className={INPUT}
              >
                {[
                  "CALL",
                  "EMAIL",
                  "MEETING",
                  "NOTE",
                  "FOLLOW_UP",
                  "OTHER",
                ].map((type) => (
                  <option key={type} value={type}>
                    {type.replace("_", " ")}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Subject">
              <input
                value={activityForm.subject}
                onChange={(event) =>
                  setActivityForm((previous) => ({
                    ...previous,
                    subject: event.target.value,
                  }))
                }
                maxLength={200}
                className={INPUT}
              />
            </Field>

            <Field label="Description">
              <textarea
                value={activityForm.description}
                onChange={(event) =>
                  setActivityForm((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                rows={4}
                maxLength={5000}
                className={INPUT}
              />
            </Field>

            <Field label="Outcome">
              <input
                value={activityForm.outcome}
                onChange={(event) =>
                  setActivityForm((previous) => ({
                    ...previous,
                    outcome: event.target.value,
                  }))
                }
                maxLength={1000}
                className={INPUT}
              />
            </Field>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowActivity(false)}
                className={`flex-1 rounded-xl border ${BORDER}
                  px-4 py-3 text-sm font-semibold`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`flex-1 rounded-xl px-4 py-3
                  text-sm font-semibold disabled:opacity-50 ${PINK}`}
              >
                {saving ? "Saving..." : "Save Activity"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
