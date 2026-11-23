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
import trainerService from "../../services/insitute/trainerService";

import {
  Users,
  UserRound,
  UserCheck,
  UserX,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ArrowUpRight,
  X,
  Eye,
  UserPlus,
  RefreshCw,
} from "lucide-react";

const PAGE_SIZE = 5;
const API_PAGE_SIZE = 100;

const palette = [
  "bg-purple-100 text-purple-600",
  "bg-blue-100 text-blue-600",
  "bg-rose-100 text-rose-600",
  "bg-emerald-100 text-emerald-600",
  "bg-violet-100 text-violet-600",
];

const STATUS_LABELS = {
  ACTIVE: "Active",
  PENDING_APPROVAL: "Pending Approval",
  SUSPENDED: "Suspended",
  REVOKED: "Revoked",
};

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function getTrainerName(trainer) {
  return (
    trainer?.user?.profile?.name ||
    trainer?.user?.email ||
    "Unnamed Trainer"
  );
}

function getInitials(name) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "TR"
  );
}

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatCard({ title, value, icon: Icon, color, description }) {
  const styles = {
    rose: "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400",
    blue: "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    green:
      "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27]">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${styles[color]}`}
        >
          <Icon size={27} strokeWidth={2.4} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#10265F] dark:text-slate-100">
            {title}
          </p>

          <p className="mt-1 text-3xl font-extrabold text-[#10265F] dark:text-white">
            {value}
          </p>

          <p className="text-[11px] text-slate-400 dark:text-[#91899B]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

function Panel({ title, children, action, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors dark:border-[#3B3441] dark:bg-[#211E27] ${className}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold text-[#10265F] dark:text-slate-100">
          {title}
        </h2>

        {action}
      </div>

      {children}
    </section>
  );
}

function TrainerAvatar({ trainer, index, size = "h-9 w-9" }) {
  const name = getTrainerName(trainer);

  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center rounded-full text-xs font-bold ${
        palette[index % palette.length]
      }`}
    >
      {getInitials(name)}
    </span>
  );
}

function InviteTrainerModal({ onClose, onInvite, submitting }) {
  const [userId, setUserId] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    if (!userId.trim()) return;

    await onInvite(userId.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:border dark:border-[#3B3441] dark:bg-[#211E27]"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#10265F] dark:text-white">
              Add Trainer
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
              Add an existing user to your institute as a trainer.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            disabled={submitting}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#302B36]"
          >
            <X size={20} />
          </button>
        </div>

        <div>
          <label
            htmlFor="trainer-user-id"
            className="mb-1.5 block text-sm font-medium text-[#10265F] dark:text-slate-200"
          >
            Existing User ID
          </label>

          <input
            id="trainer-user-id"
            name="userId"
            type="text"
            required
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="Enter existing user's UUID"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-pink-400 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:placeholder:text-[#91899B]"
          />

          <p className="mt-2 text-xs text-slate-400 dark:text-[#91899B]">
            The user must already have an account on Equilx. This action
            creates a TRAINER membership; it does not send an email invitation.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting || !userId.trim()}
            className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Add Trainer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Trainers() {
  const { user } = useContext(AuthContext);

  const instituteId =
    user?.memberships?.find(
      (membership) =>
        membership.role === "INSTITUTE_ADMIN" &&
        membership.status === "ACTIVE"
    )?.instituteId || null;

  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Trainers");

  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  const showNotice = useCallback((message, type = "success") => {
    setNotice(message);
    setNoticeType(type);
  }, []);

  // Fetch all trainer memberships using backend pagination.
  const fetchTrainers = useCallback(
    async ({ showLoader = true } = {}) => {
      if (!instituteId) {
        setTrainers([]);
        setPagination({ total: 0, totalPages: 1 });
        setLoading(false);

        showNotice(
          "Active institute administrator membership was not found.",
          "error"
        );

        return;
      }

      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      try {
        const firstResponse = await trainerService.getTrainers(
          instituteId,
          {
            page: 1,
            limit: API_PAGE_SIZE,
          }
        );

        const firstPage = firstResponse?.data || [];
        const totalPages = firstResponse?.pagination?.totalPages || 1;
        const total = firstResponse?.pagination?.total ?? firstPage.length;

        let allTrainers = [...firstPage];

        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          const response = await trainerService.getTrainers(instituteId, {
            page: currentPage,
            limit: API_PAGE_SIZE,
          });

          allTrainers = allTrainers.concat(response?.data || []);
        }

        setTrainers(allTrainers);
        setPagination({
          total,
          totalPages,
        });
      } catch (error) {
        showNotice(getErrorMessage(error), "error");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [instituteId, showNotice]
  );

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  // Client-side search and status filtering.
  const filteredTrainers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return trainers.filter((trainer) => {
      const name = getTrainerName(trainer);
      const email = trainer.user?.email || "";
      const userId = trainer.userId || "";

      const matchesSearch =
        !query ||
        [name, email, userId].some((value) =>
          value.toLowerCase().includes(query)
        );

      const matchesStatus =
        status === "All Trainers" ||
        (status === "Active" && trainer.status === "ACTIVE") ||
        (status === "Inactive" && trainer.status !== "ACTIVE");

      return matchesSearch && matchesStatus;
    });
  }, [trainers, search, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTrainers.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const visibleTrainers = filteredTrainers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Membership statistics derived from real API data.
  const activeCount = trainers.filter(
    (trainer) => trainer.status === "ACTIVE"
  ).length;

  const inactiveCount = trainers.length - activeCount;

  const pendingCount = trainers.filter(
    (trainer) => trainer.status === "PENDING_APPROVAL"
  ).length;

  // Add an existing user as an institute trainer.
  const addTrainer = async (userId) => {
    if (!instituteId) {
      showNotice("Institute information is unavailable.", "error");
      return;
    }

    setSubmitting(true);

    try {
      await trainerService.createTrainer(instituteId, userId);

      setShowModal(false);
      setSearch("");
      setStatus("All Trainers");
      setPage(1);

      showNotice("Trainer membership created successfully.");

      await fetchTrainers({ showLoader: false });
    } catch (error) {
      showNotice(getErrorMessage(error), "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Change actual membership status through the backend.
  const toggleStatus = async (trainer) => {
    if (!instituteId) return;

    const nextStatus =
      trainer.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    setUpdatingId(trainer.id);
    setActiveMenu(null);

    try {
      await trainerService.updateTrainerStatus(
        instituteId,
        trainer.id,
        nextStatus
      );

      showNotice(
        `Trainer status changed to ${STATUS_LABELS[nextStatus]}.`
      );

      await fetchTrainers({ showLoader: false });
    } catch (error) {
      showNotice(getErrorMessage(error), "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRefresh = () => {
    fetchTrainers({ showLoader: false });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] transition-colors duration-300 dark:bg-[#17151B]">
      <Sidebar />

      <div className="ml-[260px] flex min-h-screen min-w-0 flex-col">
        <Navbar />

        <main className="min-w-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {/* Heading */}
          <section className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#6B7FA8] dark:text-[#B0A5BD]">
                Trainers <span className="mx-1">›</span> Manage Trainers
              </p>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#10265F] dark:text-white">
                Trainer <span className="text-[#FF2454]">Management</span>
              </h1>

              <p className="mt-2 text-sm text-[#7183A7] dark:text-[#B0A5BD]">
                Manage trainer memberships and monitor their institute
                access.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#10265F] transition hover:bg-slate-50 disabled:opacity-50 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-slate-200 dark:hover:bg-[#302B36]"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
              >
                <Plus size={19} />
                Add Trainer
              </button>
            </div>
          </section>

          {/* Notice */}
          {notice && (
            <div
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                noticeType === "error"
                  ? "border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
              }`}
            >
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

          {/* Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <StatCard
              title="Total Trainers"
              value={loading ? "—" : trainers.length}
              description="Total institute memberships"
              icon={Users}
              color="rose"
            />

            <StatCard
              title="Active Trainers"
              value={loading ? "—" : activeCount}
              description="Currently active memberships"
              icon={UserRound}
              color="blue"
            />

            <StatCard
              title="Inactive Trainers"
              value={loading ? "—" : inactiveCount}
              description="Non-active memberships"
              icon={UserX}
              color="purple"
            />

            <StatCard
              title="Pending Approval"
              value={loading ? "—" : pendingCount}
              description="Awaiting membership approval"
              icon={UserCheck}
              color="green"
            />
          </section>

          {/* Trainer table */}
          <Panel
            title="All Trainers"
            action={
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-slate-400 dark:text-[#91899B]">
                  {filteredTrainers.length} trainers
                </span>

                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-[#FF2454] transition hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20"
                >
                  <UserPlus size={15} />
                  Add Trainer
                </button>
              </div>
            }
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-4">
                {["All Trainers", "Active", "Inactive"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setStatus(tab);
                      setPage(1);
                    }}
                    className={`border-b-2 pb-2 text-sm transition ${
                      status === tab
                        ? "border-[#FF2454] font-bold text-[#FF2454]"
                        : "border-transparent text-slate-500 hover:text-[#10265F] dark:text-[#B0A5BD] dark:hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex h-10 min-w-[220px] items-center gap-2 rounded-xl border border-slate-200 px-3 dark:border-[#3B3441] dark:bg-[#19171E]">
                  <Search
                    size={17}
                    className="shrink-0 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Search by name, email or user ID..."
                    className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-[#91899B]"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setPage(1);
                      }}
                      aria-label="Clear search"
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatus("All Trainers");
                    setPage(1);
                  }}
                  className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-[#10265F] transition hover:bg-slate-50 dark:border-[#3B3441] dark:text-slate-200 dark:hover:bg-[#302B36]"
                >
                  <SlidersHorizontal size={15} />
                  Reset
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="bg-slate-50 text-[11px] text-slate-500 dark:bg-[#19171E] dark:text-[#B0A5BD]">
                    {[
                      "#",
                      "Trainer",
                      "Email",
                      "Membership Date",
                      "Status",
                      "Membership ID",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-3 py-3 font-semibold"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-12 text-center text-sm text-slate-500 dark:text-[#B0A5BD]"
                      >
                        <span className="inline-flex items-center gap-2">
                          <RefreshCw size={16} className="animate-spin" />
                          Loading trainers...
                        </span>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {visibleTrainers.map((trainer, index) => {
                        const name = getTrainerName(trainer);
                        const isActive = trainer.status === "ACTIVE";

                        return (
                          <tr
                            key={trainer.id}
                            className="border-b border-slate-100 text-xs transition hover:bg-slate-50/70 dark:border-[#3B3441] dark:hover:bg-[#302B36]/60"
                          >
                            <td className="px-3 py-3 text-slate-400 dark:text-[#91899B]">
                              {(currentPage - 1) * PAGE_SIZE + index + 1}
                            </td>

                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2.5">
                                <TrainerAvatar
                                  trainer={trainer}
                                  index={index}
                                />

                                <div>
                                  <p className="whitespace-nowrap font-bold text-[#10265F] dark:text-slate-100">
                                    {name}
                                  </p>

                                  <p className="mt-1 text-[10px] text-slate-400 dark:text-[#91899B]">
                                    Trainer
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-3 py-3">
                              <p className="whitespace-nowrap text-[#506995] dark:text-slate-300">
                                {trainer.user?.email || "—"}
                              </p>
                            </td>

                            <td className="whitespace-nowrap px-3 py-3 text-slate-500 dark:text-[#B0A5BD]">
                              {formatDate(
                                trainer.joinedAt || trainer.createdAt
                              )}
                            </td>

                            <td className="px-3 py-3">
                              <span
                                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                                  isActive
                                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                    : "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400"
                                }`}
                              >
                                {STATUS_LABELS[trainer.status] ||
                                  trainer.status}
                              </span>
                            </td>

                            <td className="px-3 py-3 font-mono text-[10px] text-slate-500 dark:text-[#B0A5BD]">
                              <span title={trainer.id}>
                                {trainer.id.slice(0, 8)}...
                              </span>
                            </td>

                            <td className="relative px-3 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    showNotice(
                                      `${name} · ${trainer.user?.email || "No email"} · User ID: ${trainer.userId}`
                                    )
                                  }
                                  aria-label={`View ${name}`}
                                  className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-[#10265F] transition hover:bg-slate-50 dark:border-[#3B3441] dark:text-slate-200 dark:hover:bg-[#302B36]"
                                >
                                  <Eye size={15} />
                                </button>

                                <button
                                  type="button"
                                  disabled={updatingId === trainer.id}
                                  onClick={() =>
                                    setActiveMenu(
                                      activeMenu === trainer.id
                                        ? null
                                        : trainer.id
                                    )
                                  }
                                  aria-label={`More actions for ${name}`}
                                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50 dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
                                >
                                  {updatingId === trainer.id ? (
                                    <RefreshCw
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <MoreVertical size={17} />
                                  )}
                                </button>
                              </div>

                              {activeMenu === trainer.id && (
                                <div className="absolute right-8 top-10 z-20 w-40 rounded-xl border border-slate-100 bg-white p-1 shadow-xl dark:border-[#3B3441] dark:bg-[#211E27]">
                                  <button
                                    type="button"
                                    onClick={() => toggleStatus(trainer)}
                                    className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#10265F] transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-[#302B36]"
                                  >
                                    {isActive
                                      ? "Deactivate"
                                      : "Activate"}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {visibleTrainers.length === 0 && (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-4 py-12 text-center text-sm text-slate-500 dark:text-[#B0A5BD]"
                          >
                            No trainers found. Try changing your search or
                            status filter.
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
              <p className="text-xs text-slate-500 dark:text-[#B0A5BD]">
                Showing{" "}
                {filteredTrainers.length
                  ? (currentPage - 1) * PAGE_SIZE + 1
                  : 0}{" "}
                to{" "}
                {Math.min(
                  currentPage * PAGE_SIZE,
                  filteredTrainers.length
                )}{" "}
                of {filteredTrainers.length} trainers
                {!loading && pagination.total > trainers.length
                  ? ` (loaded ${trainers.length} of ${pagination.total})`
                  : ""}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1 || loading}
                  onClick={() =>
                    setPage((value) => Math.max(1, value - 1))
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={17} />
                </button>

                <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#FF2454] px-3 text-xs font-bold text-white">
                  {currentPage}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages || loading}
                  onClick={() =>
                    setPage((value) =>
                      Math.min(totalPages, value + 1)
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
                  aria-label="Next page"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </Panel>

          <footer className="pb-2 text-center text-xs text-slate-400 dark:text-[#91899B]">
            Equilx IELTS · Institute Admin Portal
          </footer>
        </main>
      </div>

      {showModal && (
        <InviteTrainerModal
          onClose={() => setShowModal(false)}
          onInvite={addTrainer}
          submitting={submitting}
        />
      )}
    </div>
  );
}
