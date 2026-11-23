
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar";
import  AuthContext  from "../../context/AuthContext";
import crmService from "../../services/insitute/crmService";
import toast from "react-hot-toast";

import {
  Search,
  Plus,
  Users,
  UserPlus,
  TrendingUp,
  Phone,
  Mail,
  CalendarDays,
  Clock,
  Download,
  X,
  Eye,
  Pencil,
  Filter,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "DEMO_BOOKED",
  "NEGOTIATION",
  "ENROLLED",
  "LOST",
];

const STATUS_LABELS = {
  NEW: "New",
  CONTACTED: "Contacted",
  DEMO_BOOKED: "Demo Booked",
  NEGOTIATION: "Negotiation",
  ENROLLED: "Enrolled",
  LOST: "Lost",
};

const STATUS_STYLES = {
  NEW: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  CONTACTED:
    "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  DEMO_BOOKED:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  NEGOTIATION:
    "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  ENROLLED:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  LOST: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

const PIPELINE_STAGES = [
  { name: "NEW", color: "bg-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  {
    name: "CONTACTED",
    color: "bg-purple-500",
    bg: "bg-purple-50 dark:bg-purple-500/10",
  },
  {
    name: "DEMO_BOOKED",
    color: "bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  {
    name: "NEGOTIATION",
    color: "bg-orange-500",
    bg: "bg-orange-50 dark:bg-orange-500/10",
  },
  {
    name: "ENROLLED",
    color: "bg-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  { name: "LOST", color: "bg-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
];

const PAGE_LIMIT = 20;

function getErrorMessage(error) {
  return error?.message || "Something went wrong. Please try again.";
}

function getUserName(user) {
  return user?.profile?.name || user?.name || user?.email || "Unassigned";
}

function formatDate(value) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDateInputValue(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatCard({ title, value, change, icon: Icon, color }) {
  const styles = {
    pink: "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    green:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-[#B0A5BD]">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-[#10265F] dark:text-white">
            {value}
          </h2>

          <p className="mt-2 text-xs font-semibold text-slate-400 dark:text-[#91899B]">
            {change}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles[color]}`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function LeadModal({
  lead,
  sources,
  assignableUsers,
  currentUserId,
  isTrainer,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    interestedIn: lead?.interestedIn || "",
    sourceId: lead?.sourceId || lead?.source?.id || "",
    status: lead?.status || "NEW",
    ownerId:
      lead?.ownerId ||
      (isTrainer ? currentUserId : ""),
    nextFollowUpAt: getDateInputValue(lead?.nextFollowUpAt),
    notes: lead?.notes || "",
  });

  const [saving, setSaving] = useState(false);

  const update = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter the lead's name.");
      return;
    }

    if (!form.email.trim() && !form.phone.trim()) {
      toast.error("Enter at least an email address or phone number.");
      return;
    }

    setSaving(true);

    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#10265F] outline-none transition focus:border-[#FF4778] dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:placeholder:text-[#91899B] dark:[color-scheme:dark]";

  const labelClass =
    "text-sm font-semibold text-[#10265F] dark:text-slate-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10265F]/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:border dark:border-[#3B3441] dark:bg-[#211E27]">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-[#3B3441]">
          <div>
            <h2 className="text-xl font-bold text-[#10265F] dark:text-white">
              {lead ? "Edit Lead" : "Add New Lead"}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
              Enter the prospective student's details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Full Name *
              <input
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                className={fieldClass}
                placeholder="Enter full name"
              />
            </label>

            <label className={labelClass}>
              Email Address
              <input
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                className={fieldClass}
                placeholder="name@example.com"
              />
            </label>

            <label className={labelClass}>
              Phone Number
              <input
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                className={fieldClass}
                placeholder="+91 XXXXX XXXXX"
              />
            </label>

            <label className={labelClass}>
              Interested In
              <input
                value={form.interestedIn}
                onChange={(event) =>
                  update("interestedIn", event.target.value)
                }
                className={fieldClass}
                placeholder="e.g. IELTS Academic"
              />
            </label>

            <label className={labelClass}>
              Lead Source
              <select
                value={form.sourceId}
                onChange={(event) => update("sourceId", event.target.value)}
                className={fieldClass}
              >
                <option value="">Select source</option>
                {sources
                  .filter((source) => source.isActive)
                  .map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.name}
                    </option>
                  ))}
              </select>
            </label>

            <label className={labelClass}>
              Lead Status
              <select
                value={form.status}
                onChange={(event) => update("status", event.target.value)}
                className={fieldClass}
              >
                {LEAD_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Next Follow-up
              <input
                type="date"
                value={form.nextFollowUpAt}
                onChange={(event) =>
                  update("nextFollowUpAt", event.target.value)
                }
                className={fieldClass}
              />
            </label>

            <label className={labelClass}>
              Assigned To
              <select
                value={form.ownerId}
                onChange={(event) => update("ownerId", event.target.value)}
                className={fieldClass}
                disabled={isTrainer}
              >
                <option value="">Unassigned</option>
                {assignableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {getUserName(user)} ({user.membershipRole})
                  </option>
                ))}
              </select>
              {isTrainer && (
                <span className="mt-1 block text-xs font-normal text-slate-400">
                  Trainer accounts can manage their own assigned leads.
                </span>
              )}
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Notes
              <textarea
                rows={3}
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
                className={fieldClass}
                placeholder="Add lead notes..."
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-[#3B3441]">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <LoaderCircle size={16} className="animate-spin" />}
              {lead ? "Save Changes" : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CRM() {
  const { user } = useContext(AuthContext);

  const activeMembership = user?.memberships?.find(
    (membership) =>
      ["INSTITUTE_ADMIN", "TRAINER"].includes(membership.role) &&
      membership.status === "ACTIVE"
  );

  const instituteId = activeMembership?.instituteId || null;
  const currentUserId = user?.id || null;
  const isTrainer = activeMembership?.role === "TRAINER";

  const [leads, setLeads] = useState([]);
  const [sources, setSources] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [followUps, setFollowUps] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    NEW: 0,
    CONTACTED: 0,
    DEMO_BOOKED: 0,
    NEGOTIATION: 0,
    ENROLLED: 0,
    LOST: 0,
    pendingFollowUps: 0,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [savingStatusId, setSavingStatusId] = useState(null);
  const [completingFollowUpId, setCompletingFollowUpId] = useState(null);

  const [listRefreshKey, setListRefreshKey] = useState(0);

  const loadLeads = useCallback(
    async (showLoader = true) => {
      if (!instituteId) {
        setLeads([]);
        setLoading(false);
        return;
      }

      if (showLoader) setLoading(true);
      else setRefreshing(true);

      try {
        const response = await crmService.getLeads(instituteId, {
          page,
          limit: PAGE_LIMIT,
          ...(search.trim() ? { search: search.trim() } : {}),
          ...(statusFilter ? { status: statusFilter } : {}),
        });

        setLeads(response.data || []);
        setPagination(
          response.pagination || {
            page: 1,
            limit: PAGE_LIMIT,
            total: 0,
            totalPages: 1,
          }
        );
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [instituteId, page, search, statusFilter]
  );

  const loadReferenceData = useCallback(async () => {
    if (!instituteId) return;

    try {
      const [sourceResponse, usersResponse, followUpResponse] =
        await Promise.all([
          crmService.getLeadSources(instituteId),
          crmService.getAssignableUsers(instituteId),
          crmService.getFollowUps(instituteId, {
            page: 1,
            limit: 100,
            status: "PENDING",
          }),
        ]);

      setSources(sourceResponse.data || []);
      setAssignableUsers(usersResponse.data || []);
      setFollowUps(followUpResponse.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, [instituteId]);

  const loadStats = useCallback(async () => {
    if (!instituteId) return;

    try {
      const statusResponses = await Promise.all(
        LEAD_STATUSES.map((status) =>
          crmService.getLeads(instituteId, {
            page: 1,
            limit: 1,
            status,
          })
        )
      );

      const nextStats = {};

      LEAD_STATUSES.forEach((status, index) => {
        nextStats[status] = statusResponses[index].pagination?.total || 0;
      });

      nextStats.total = LEAD_STATUSES.reduce(
        (total, status) => total + nextStats[status],
        0
      );

      const followUpResponse = await crmService.getFollowUps(instituteId, {
        page: 1,
        limit: 1,
        status: "PENDING",
      });

      nextStats.pendingFollowUps =
        followUpResponse.pagination?.total || 0;

      setStats(nextStats);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, [instituteId]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads, listRefreshKey]);

  useEffect(() => {
    loadReferenceData();
    loadStats();
  }, [loadReferenceData, loadStats]);

  const filteredLeads = useMemo(() => {
    if (!sourceFilter) return leads;

    return leads.filter(
      (lead) => (lead.source?.id || lead.sourceId || "") === sourceFilter
    );
  }, [leads, sourceFilter]);

  const conversionRate = stats.total
    ? Math.round((stats.ENROLLED / stats.total) * 100)
    : 0;

  const refreshAll = async () => {
    await Promise.all([
      loadLeads(false),
      loadReferenceData(),
      loadStats(),
    ]);
  };

  const closeLeadModal = () => {
    setModalOpen(false);
    setEditingLead(null);
  };

  const saveLead = async (form) => {
    const payload = {
      name: form.name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      interestedIn: form.interestedIn.trim() || null,
      sourceId: form.sourceId || null,
      nextFollowUpAt: form.nextFollowUpAt
        ? new Date(`${form.nextFollowUpAt}T00:00:00.000Z`).toISOString()
        : null,
      notes: form.notes.trim() || null,
    };

    try {
      if (editingLead) {
        await crmService.updateLead(instituteId, editingLead.id, payload);

        if (
          form.ownerId &&
          form.ownerId !== editingLead.ownerId
        ) {
          await crmService.assignLead(
            instituteId,
            editingLead.id,
            form.ownerId
          );
        }

        if (form.status !== editingLead.status) {
          await crmService.updateLeadStatus(
            instituteId,
            editingLead.id,
            form.status
          );
        }

        toast.success("Lead updated successfully.");
      } else {
        const response = await crmService.createLead(instituteId, {
          ...payload,
          ownerId: form.ownerId || null,
        });

        const createdLead = response.data;

        if (createdLead?.id && form.status !== "NEW") {
          await crmService.updateLeadStatus(
            instituteId,
            createdLead.id,
            form.status
          );
        }

        toast.success("Lead created successfully.");
      }

      closeLeadModal();
      setPage(1);
      setListRefreshKey((value) => value + 1);
      await Promise.all([loadStats(), loadReferenceData()]);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const changeLeadStatus = async (lead, newStatus) => {
    if (newStatus === lead.status) return;

    setSavingStatusId(lead.id);

    try {
      await crmService.updateLeadStatus(
        instituteId,
        lead.id,
        newStatus
      );

      toast.success("Lead status updated.");

      setListRefreshKey((value) => value + 1);
      await loadStats();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingStatusId(null);
    }
  };

  const openLeadDetails = async (lead) => {
    setSelectedLead(lead);
    setDetailsLoading(true);

    try {
      const response = await crmService.getLeadById(
        instituteId,
        lead.id
      );

      setSelectedLead(response.data || lead);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDetailsLoading(false);
    }
  };

  const completeFollowUp = async (followUpId) => {
    setCompletingFollowUpId(followUpId);

    try {
      await crmService.completeFollowUp(instituteId, followUpId);

      toast.success("Follow-up marked as completed.");

      await Promise.all([loadReferenceData(), loadStats()]);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setCompletingFollowUpId(null);
    }
  };

  const exportCSV = async () => {
    try {
      const blob = await crmService.exportLeads(instituteId);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "equilx-crm-leads.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      toast.success("Leads exported successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const inputClass =
    "h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs text-[#10265F] outline-none transition focus:border-pink-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-slate-200 dark:[color-scheme:dark]";

  if (!instituteId) {
    return (
      <div className="min-h-screen bg-[#F5F7FF] dark:bg-[#17151B]">
        <Sidebar />

        <div className="ml-[260px] flex min-h-screen flex-col">
          <Navbar />

          <main className="flex flex-1 items-center justify-center p-6">
            <div className="max-w-md rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]">
              <Users
                size={36}
                className="mx-auto text-slate-400"
              />

              <h2 className="mt-4 text-xl font-bold text-[#10265F] dark:text-white">
                Institute access required
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-[#B0A5BD]">
                An active institute admin or trainer membership is required
                to access CRM and Leads.
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

        <main className="min-w-0 flex-1 space-y-5 overflow-x-hidden p-4 md:p-6">
          {/* Page heading */}

          <section className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#6B7FA8] dark:text-[#B0A5BD]">
                Institute <span className="mx-1">›</span> CRM & Leads
              </p>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#10265F] dark:text-white">
                CRM & <span className="text-[#FF2454]">Leads</span>
              </h1>

              <p className="mt-2 text-sm text-[#7183A7] dark:text-[#B0A5BD]">
                Manage enquiries, follow-ups and student admission conversions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={refreshAll}
                disabled={refreshing}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#10265F] transition hover:bg-slate-50 disabled:opacity-60 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-slate-200 dark:hover:bg-[#302B36]"
              >
                <LoaderCircle
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingLead(null);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
              >
                <Plus size={18} />
                Add New Lead
              </button>
            </div>
          </section>

          {/* Summary cards */}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Leads"
              value={stats.total}
              change="All institute leads"
              icon={Users}
              color="pink"
            />

            <StatCard
              title="New Enquiries"
              value={stats.NEW}
              change="New lead records"
              icon={UserPlus}
              color="blue"
            />

            <StatCard
              title="Conversion Rate"
              value={`${conversionRate}%`}
              change="Enrolled leads"
              icon={TrendingUp}
              color="green"
            />

            <StatCard
              title="Pending Follow-ups"
              value={stats.pendingFollowUps}
              change="Tasks awaiting completion"
              icon={CalendarDays}
              color="purple"
            />
          </section>

          {/* Lead pipeline */}

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27] xl:col-span-2">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-[#10265F] dark:text-slate-100">
                    Lead Pipeline
                  </h2>

                  <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                    Current distribution of prospective students
                  </p>
                </div>

                <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  {stats.total} Total Leads
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PIPELINE_STAGES.map((stage) => {
                  const count = stats[stage.name] || 0;
                  const percent = stats.total
                    ? (count / stats.total) * 100
                    : 0;

                  return (
                    <div
                      key={stage.name}
                      className={`rounded-xl p-4 ${stage.bg}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {STATUS_LABELS[stage.name]}
                        </span>

                        <span
                          className={`h-2 w-2 rounded-full ${stage.color}`}
                        />
                      </div>

                      <p className="mt-3 text-2xl font-extrabold text-[#10265F] dark:text-white">
                        {count}
                      </p>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/80 dark:bg-[#19171E]">
                        <div
                          className={`h-full rounded-full ${stage.color}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-[#10265F] p-5 text-white shadow-sm dark:bg-[#29233A]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100 dark:text-[#C5B8DC]">
                    Admission Overview
                  </p>

                  <h2 className="mt-2 text-3xl font-extrabold">
                    {conversionRate}%
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <TrendingUp size={24} />
                </div>
              </div>

              <p className="mt-2 text-xs text-blue-100 dark:text-[#C5B8DC]">
                Leads enrolled into the institute
              </p>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[#FF4778]"
                  style={{ width: `${conversionRate}%` }}
                />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
                <div>
                  <p className="text-xs text-blue-100 dark:text-[#C5B8DC]">
                    Enrolled
                  </p>
                  <p className="mt-1 text-xl font-bold">
                    {stats.ENROLLED}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-blue-100 dark:text-[#C5B8DC]">
                    Other Leads
                  </p>
                  <p className="mt-1 text-xl font-bold">
                    {stats.total - stats.ENROLLED}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Leads table */}

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#10265F] dark:text-slate-100">
                  All Leads
                </h2>

                <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                  Review prospective students and manage their next steps.
                </p>
              </div>

              <button
                type="button"
                onClick={exportCSV}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-[#10265F] transition hover:bg-slate-50 dark:border-[#3B3441] dark:text-slate-200 dark:hover:bg-[#302B36]"
              >
                <Download size={15} />
                Export CSV
              </button>
            </div>

            {/* Filters */}

            <div className="mt-5 flex flex-col gap-3 lg:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#91899B]"
                />

                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name, email or phone..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-[#10265F] outline-none transition placeholder:text-slate-400 focus:border-pink-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:placeholder:text-[#91899B]"
                />
              </div>

              <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 dark:border-[#3B3441] dark:bg-[#19171E]">
                <Filter
                  size={15}
                  className="text-slate-400 dark:text-[#91899B]"
                />

                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setPage(1);
                  }}
                  className="min-w-0 bg-transparent text-xs text-[#10265F] outline-none dark:text-slate-200 dark:[color-scheme:dark]"
                >
                  <option value="">All Statuses</option>
                  {LEAD_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </label>

              <select
                value={sourceFilter}
                onChange={(event) => setSourceFilter(event.target.value)}
                className={inputClass}
              >
                <option value="">All Sources</option>
                {sources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="bg-slate-50 text-[11px] text-slate-500 dark:bg-[#19171E] dark:text-[#B0A5BD]">
                    {[
                      "Lead / Contact",
                      "Interested In",
                      "Source",
                      "Status",
                      "Next Follow-up",
                      "Assigned To",
                      "Actions",
                    ].map((heading) => (
                      <th key={heading} className="px-3 py-3 font-semibold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-14 text-center">
                        <LoaderCircle
                          size={25}
                          className="mx-auto animate-spin text-[#FF2454]"
                        />
                        <p className="mt-3 text-sm text-slate-400">
                          Loading leads...
                        </p>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {filteredLeads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="border-b border-slate-100 text-xs transition hover:bg-slate-50/70 dark:border-[#3B3441] dark:hover:bg-[#302B36]/60"
                        >
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                {getInitials(lead.name)}
                              </span>

                              <div>
                                <p className="whitespace-nowrap font-bold text-[#10265F] dark:text-slate-100">
                                  {lead.name}
                                </p>

                                {lead.email && (
                                  <p className="mt-1 flex items-center gap-1 text-slate-400 dark:text-[#91899B]">
                                    <Mail size={11} />
                                    {lead.email}
                                  </p>
                                )}

                                {lead.phone && (
                                  <p className="mt-1 flex items-center gap-1 text-slate-400 dark:text-[#91899B]">
                                    <Phone size={11} />
                                    {lead.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-4 text-slate-600 dark:text-slate-300">
                            {lead.interestedIn || "—"}
                          </td>

                          <td className="px-3 py-4 text-slate-500 dark:text-[#B0A5BD]">
                            {lead.source?.name || "—"}
                          </td>

                          <td className="px-3 py-4">
                            <select
                              value={lead.status}
                              disabled={savingStatusId === lead.id}
                              onChange={(event) =>
                                changeLeadStatus(lead, event.target.value)
                              }
                              className={`rounded-full border-0 px-2.5 py-1.5 text-[10px] font-semibold outline-none disabled:opacity-60 dark:[color-scheme:dark] ${
                                STATUS_STYLES[lead.status] ||
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {LEAD_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {STATUS_LABELS[status]}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="px-3 py-4">
                            <span className="flex items-center gap-1.5 whitespace-nowrap text-slate-500 dark:text-[#B0A5BD]">
                              <CalendarDays size={13} />
                              {formatDate(lead.nextFollowUpAt)}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-3 py-4 text-slate-600 dark:text-slate-300">
                            {getUserName(lead.owner)}
                          </td>

                          <td className="px-3 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openLeadDetails(lead)}
                                title="View lead"
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:text-[#B0A5BD] dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                              >
                                <Eye size={15} />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingLead(lead);
                                  setModalOpen(true);
                                }}
                                title="Edit lead"
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-[#B0A5BD] dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                              >
                                <Pencil size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredLeads.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-3 py-12 text-center text-sm text-slate-400 dark:text-[#B0A5BD]"
                          >
                            No leads found. Try changing your filters.
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-[#3B3441]">
              <p className="text-xs text-slate-400 dark:text-[#91899B]">
                Showing {filteredLeads.length} of {pagination.total} leads
                {sourceFilter ? " matching this source on this page" : ""}
              </p>

              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#10265F] dark:text-slate-200">
                  Page {pagination.page || page} of{" "}
                  {Math.max(pagination.totalPages || 1, 1)}
                </span>

                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  type="button"
                  disabled={
                    page >= (pagination.totalPages || 1) || loading
                  }
                  onClick={() =>
                    setPage((value) =>
                      Math.min(pagination.totalPages || 1, value + 1)
                    )
                  }
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* Follow-up reminders */}

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                <Clock size={20} />
              </div>

              <div>
                <h2 className="font-bold text-[#10265F] dark:text-slate-100">
                  Follow-up Reminders
                </h2>

                <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                  Pending follow-up tasks assigned to institute staff.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {followUps.slice(0, 6).map((followUp) => (
                <div
                  key={followUp.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 transition-colors dark:border-[#3B3441] dark:bg-[#19171E]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#10265F] dark:text-slate-100">
                      {followUp.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-[#B0A5BD]">
                      {followUp.lead?.name || "Lead"}
                    </p>

                    <p className="mt-2 flex items-center gap-1 text-xs text-orange-500 dark:text-orange-400">
                      <CalendarDays size={13} />
                      {formatDate(followUp.dueAt)}
                    </p>

                    <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                      Assigned to: {getUserName(followUp.assignedTo)}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={completingFollowUpId === followUp.id}
                    onClick={() => completeFollowUp(followUp.id)}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                  >
                    {completingFollowUpId === followUp.id ? (
                      <LoaderCircle size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    Complete
                  </button>
                </div>
              ))}

              {followUps.length === 0 && (
                <p className="text-sm text-slate-400 dark:text-[#B0A5BD]">
                  No pending follow-up tasks.
                </p>
              )}
            </div>
          </section>

          <footer className="pb-2 text-center text-xs text-slate-400 dark:text-[#91899B]">
            Equilx IELTS · Institute Admin Portal
          </footer>
        </main>
      </div>

      {/* Add / Edit Lead Modal */}

      {modalOpen && (
        <LeadModal
          lead={editingLead}
          sources={sources}
          assignableUsers={assignableUsers}
          currentUserId={currentUserId}
          isTrainer={isTrainer}
          onClose={closeLeadModal}
          onSave={saveLead}
        />
      )}

      {/* Lead Details Modal */}

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10265F]/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:border dark:border-[#3B3441] dark:bg-[#211E27]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#10265F] dark:text-white">
                  Lead Details
                </h2>

                <p className="mt-1 text-sm text-slate-400 dark:text-[#91899B]">
                  Prospective student information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
                aria-label="Close details"
              >
                <X size={19} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="py-10 text-center">
                <LoaderCircle
                  size={25}
                  className="mx-auto animate-spin text-[#FF2454]"
                />
                <p className="mt-3 text-sm text-slate-400">
                  Loading lead details...
                </p>
              </div>
            ) : (
              <>
                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-[#91899B]">
                      Name
                    </p>
                    <p className="mt-1 font-semibold text-[#10265F] dark:text-slate-100">
                      {selectedLead.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 dark:text-[#91899B]">
                      Email
                    </p>
                    <p className="mt-1 break-all text-sm text-[#10265F] dark:text-slate-200">
                      {selectedLead.email || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 dark:text-[#91899B]">
                      Phone
                    </p>
                    <p className="mt-1 text-sm text-[#10265F] dark:text-slate-200">
                      {selectedLead.phone || "—"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 dark:text-[#91899B]">
                        Interested In
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#10265F] dark:text-slate-100">
                        {selectedLead.interestedIn || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 dark:text-[#91899B]">
                        Status
                      </p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                          STATUS_STYLES[selectedLead.status] || ""
                        }`}
                      >
                        {STATUS_LABELS[selectedLead.status] ||
                          selectedLead.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 dark:text-[#91899B]">
                        Lead Source
                      </p>
                      <p className="mt-1 text-sm text-[#10265F] dark:text-slate-200">
                        {selectedLead.source?.name || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 dark:text-[#91899B]">
                        Assigned To
                      </p>
                      <p className="mt-1 text-sm text-[#10265F] dark:text-slate-200">
                        {getUserName(selectedLead.owner)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 dark:text-[#91899B]">
                        Next Follow-up
                      </p>
                      <p className="mt-1 text-sm text-[#10265F] dark:text-slate-200">
                        {formatDate(selectedLead.nextFollowUpAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 dark:text-[#91899B]">
                        Created
                      </p>
                      <p className="mt-1 text-sm text-[#10265F] dark:text-slate-200">
                        {formatDate(selectedLead.createdAt)}
                      </p>
                    </div>
                  </div>

                  {selectedLead.notes && (
                    <div>
                      <p className="text-xs text-slate-400 dark:text-[#91899B]">
                        Notes
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-[#10265F] dark:text-slate-200">
                        {selectedLead.notes}
                      </p>
                    </div>
                  )}

                  {selectedLead.activities?.length > 0 && (
                    <div className="border-t border-slate-100 pt-4 dark:border-[#3B3441]">
                      <h3 className="font-semibold text-[#10265F] dark:text-slate-100">
                        Recent Activities
                      </h3>

                      <div className="mt-3 space-y-3">
                        {selectedLead.activities.slice(0, 5).map((activity) => (
                          <div
                            key={activity.id}
                            className="rounded-lg bg-slate-50 p-3 dark:bg-[#19171E]"
                          >
                            <p className="text-xs font-semibold text-[#10265F] dark:text-slate-100">
                              {activity.subject || activity.type}
                            </p>

                            {activity.description && (
                              <p className="mt-1 text-xs text-slate-500 dark:text-[#B0A5BD]">
                                {activity.description}
                              </p>
                            )}

                            <p className="mt-1 text-[11px] text-slate-400">
                              {formatDate(activity.createdAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => setSelectedLead(null)}
              className="mt-6 w-full rounded-xl bg-[#10265F] py-3 text-sm font-semibold text-white transition hover:bg-[#18377E] dark:bg-[#39304D] dark:hover:bg-[#4A3D63]"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
