
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Users,
  Building2,
  UserCheck,
  ShieldCheck,
  Filter,
  Eye,
  Pencil,
  Ban,
  CheckCircle2,
  X,
  ChevronDown,
  Mail,
  CalendarDays,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

import {
  getUsers,
  updateUserStatus,
  getOrganizations,
  createOrganization,
  updateOrganization,
  getOrganizationById,
  getOrganizationMembers,
} from "../../services/super-admin/userInstitute.service.js";

const emptyInstitute = {
  name: "",
  code: "",
};

const roleOptions = ["All Roles", "Super Admin", "User"];
const statusOptions = ["All Status", "Active", "Inactive"];

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

const normalizeUser = (user) => ({
  id: user.id,
  name: user.profile?.name || "Unnamed User",
  email: user.email || "—",
  phone: user.profile?.phone || "",
  role: user.platformRole === "SUPER_ADMIN" ? "Super Admin" : "User",
  status: user.isActive ? "Active" : "Inactive",
  joined: formatDate(user.createdAt),
  raw: user,
});

const normalizeInstitute = (institute) => ({
  id: institute.id,
  name: institute.name || "Unnamed Institute",
  code: institute.slug || "—",
  users: institute._count?.memberships ?? 0,
  status: institute.status || "UNKNOWN",
  joined: formatDate(institute.createdAt),
  raw: institute,
});

const normalizeStatus = (status) => {
  const value = String(status || "").toUpperCase();

  if (value === "ACTIVE") return "Active";
  if (value === "INACTIVE") return "Inactive";
  if (value === "SUSPENDED") return "Suspended";
  if (value === "PENDING_APPROVAL") return "Pending";
  if (value === "REVOKED") return "Revoked";

  return status || "Unknown";
};

function StatusBadge({ status }) {
  const normalized = normalizeStatus(status);

  const styles = {
    Active: "bg-emerald-50 text-emerald-700",
    Inactive: "bg-slate-100 text-slate-600",
    Pending: "bg-amber-50 text-amber-700",
    Suspended: "bg-red-50 text-red-700",
    Revoked: "bg-red-50 text-red-700",
    Unknown: "bg-slate-100 text-slate-600",
  };

  const dotStyles = {
    Active: "bg-emerald-500",
    Inactive: "bg-slate-400",
    Pending: "bg-amber-500",
    Suspended: "bg-red-500",
    Revoked: "bg-red-500",
    Unknown: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${
        styles[normalized] || styles.Unknown
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          dotStyles[normalized] || dotStyles.Unknown
        }`}
      />
      {normalized}
    </span>
  );
}

export default function UserInstituteManagement() {
  const [activeTab, setActiveTab] = useState("Users");

  const [users, setUsers] = useState([]);
  const [institutes, setInstitutes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [instituteForm, setInstituteForm] = useState(emptyInstitute);

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [usersResponse, institutesResponse] = await Promise.all([
        getUsers({ page: 1, limit: 100 }),
        getOrganizations({ page: 1, limit: 100 }),
      ]);

      // User API response: { success, data: { users, pagination } }
      const userPayload = usersResponse?.data;
      const userList = Array.isArray(userPayload)
        ? userPayload
        : userPayload?.users || [];

      // Organization response may expose the list as data or nested data.
      const organizationPayload = institutesResponse?.data;
      const organizationList = Array.isArray(organizationPayload)
        ? organizationPayload
        : organizationPayload?.data ||
          organizationPayload?.organizations ||
          [];

      setUsers(userList.map(normalizeUser));
      setInstitutes(organizationList.map(normalizeInstitute));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch = [
        user.name,
        user.email,
        user.phone,
        user.role,
      ].some((value) =>
        String(value || "").toLowerCase().includes(term)
      );

      return (
        matchesSearch &&
        (roleFilter === "All Roles" || user.role === roleFilter) &&
        (statusFilter === "All Status" || user.status === statusFilter)
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  const filteredInstitutes = useMemo(() => {
    const term = search.toLowerCase().trim();

    return institutes.filter((institute) => {
      const matchesSearch = [
        institute.name,
        institute.code,
      ].some((value) =>
        String(value || "").toLowerCase().includes(term)
      );

      return (
        matchesSearch &&
        (statusFilter === "All Status" ||
          normalizeStatus(institute.status) === statusFilter)
      );
    });
  }, [institutes, search, statusFilter]);

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const activeInstitutes = institutes.filter(
    (institute) =>
      normalizeStatus(institute.status) === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("All Roles");
    setStatusFilter("All Status");
  };

  const openAddInstitute = () => {
    setEditingId(null);
    setInstituteForm(emptyInstitute);
    setShowModal(true);
  };

  const openEditInstitute = (institute) => {
    setEditingId(institute.id);
    setInstituteForm({
      name: institute.name,
      code: institute.code === "—" ? "" : institute.code,
    });
    setShowModal(true);
  };

  const handleSaveInstitute = async (event) => {
    event.preventDefault();

    const name = instituteForm.name.trim();
    const slug = instituteForm.code.trim().toLowerCase();

    if (!name || !slug) {
      setNotice("Institute name and slug are required.");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      setNotice(
        "Slug can contain only lowercase letters, numbers and hyphens."
      );
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      if (editingId) {
        await updateOrganization(editingId, { name, slug });
        setNotice("Institute updated successfully.");
      } else {
        await createOrganization({ name, slug });
        setNotice("Institute created successfully.");
      }

      setShowModal(false);
      await loadData(true);
    } catch (err) {
      setNotice(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleUserStatus = async (user) => {
    const isActive = user.status !== "Active";

    const confirmed = window.confirm(
      `Are you sure you want to ${
        isActive ? "activate" : "deactivate"
      } ${user.name}'s account?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await updateUserStatus(user.id, isActive);

      setUsers((previous) =>
        previous.map((item) =>
          item.id === user.id
            ? {
                ...item,
                status: isActive ? "Active" : "Inactive",
              }
            : item
        )
      );

      setNotice(
        `${user.name} is now ${
          isActive ? "active" : "inactive"
        }.`
      );

      if (showDetails?.id === user.id) {
        setShowDetails((previous) => ({
          ...previous,
          status: isActive ? "Active" : "Inactive",
        }));
      }
    } catch (err) {
      setNotice(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewInstitute = async (institute) => {
    try {
      setActionLoading(true);

      const [detailsResponse, membersResponse] = await Promise.all([
        getOrganizationById(institute.id),
        getOrganizationMembers(institute.id, {
          page: 1,
          limit: 100,
        }),
      ]);

      const details = detailsResponse?.data;
      const membersPayload = membersResponse?.data;

      const members = Array.isArray(membersPayload)
        ? membersPayload
        : membersPayload?.data || [];

      setShowDetails({
        ...institute,
        entityType: "institute",
        rawDetails: details,
        members,
        memberCount:
          membersResponse?.pagination?.total ??
          membersPayload?.pagination?.total ??
          institute.users,
      });
    } catch (err) {
      setNotice(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setShowDetails({
      ...user,
      entityType: "user",
    });
  };

  const exportCSV = () => {
    const rows =
      activeTab === "Users"
        ? [
            ["Name", "Email", "Phone", "Platform Role", "Status", "Joined"],
            ...filteredUsers.map((user) => [
              user.name,
              user.email,
              user.phone,
              user.role,
              user.status,
              user.joined,
            ]),
          ]
        : [
            ["Institute", "Slug", "Memberships", "Status", "Created"],
            ...filteredInstitutes.map((institute) => [
              institute.name,
              institute.code,
              institute.users,
              normalizeStatus(institute.status),
              institute.joined,
            ]),
          ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = rows
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      activeTab === "Users"
        ? "users-management.csv"
        : "institutes-management.csv";

    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="user-institute-management min-h-screen bg-[#F5F7FF] text-[#172554]">
      <style>{`
        html.dark .user-institute-management {
          background: #17151B !important;
          color: #FFFFFF !important;
        }

        html.dark .user-institute-management [class~="bg-white"] {
          background-color: #211E27 !important;
        }

        html.dark .user-institute-management [class~="bg-slate-50"],
        html.dark .user-institute-management [class~="bg-slate-50/60"] {
          background-color: #19171E !important;
        }

        html.dark .user-institute-management [class~="bg-slate-100"] {
          background-color: #302A35 !important;
        }

        html.dark .user-institute-management [class~="border-slate-100"],
        html.dark .user-institute-management [class~="border-slate-200"] {
          border-color: #3B3441 !important;
        }

        html.dark .user-institute-management [class~="divide-slate-100"] > * + * {
          border-color: #3B3441 !important;
        }

        html.dark .user-institute-management [class~="text-[#10265F]"],
        html.dark .user-institute-management [class~="text-[#172554]"] {
          color: #FFFFFF !important;
        }

        html.dark .user-institute-management [class~="text-slate-700"],
        html.dark .user-institute-management [class~="text-slate-600"] {
          color: #D4CCDA !important;
        }

        html.dark .user-institute-management [class~="text-slate-500"],
        html.dark .user-institute-management [class~="text-slate-400"] {
          color: #B0A5BD !important;
        }

        html.dark .user-institute-management input,
        html.dark .user-institute-management select {
          background-color: #211E27 !important;
          color: #FFFFFF !important;
          border-color: #3B3441 !important;
          color-scheme: dark;
        }

        html.dark .user-institute-management input::placeholder {
          color: #8F8498 !important;
        }

        html.dark .user-institute-management option {
          background: #211E27;
          color: #FFFFFF;
        }

        html.dark .user-institute-management [class~="hover:bg-slate-50"]:hover,
        html.dark .user-institute-management [class~="hover:bg-slate-50/70"]:hover,
        html.dark .user-institute-management [class~="hover:bg-slate-100"]:hover {
          background-color: #302A35 !important;
        }

        html.dark .user-institute-management [class~="hover:bg-blue-50"]:hover,
        html.dark .user-institute-management [class~="bg-blue-50"] {
          background-color: #26334B !important;
        }

        html.dark .user-institute-management [class~="text-blue-700"] {
          color: #A9C7FF !important;
        }

        html.dark .user-institute-management [class~="bg-pink-50"] {
          background-color: #3A202B !important;
        }

        html.dark .user-institute-management table thead {
          background-color: #211E27 !important;
        }

        html.dark .user-institute-management tr:hover {
          background-color: #29242F !important;
        }
      `}</style>

      <Sidebar />

      <div className="min-h-screen md:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Heading */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>Super Admin</span>
                <span>/</span>
                <span className="text-[#FF2454]">Management</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#10265F] sm:text-3xl">
                Users & Institutes
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage platform accounts, organizations and account access.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => loadData(true)}
                disabled={refreshing || loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

              {activeTab === "Institutes" && (
                <button
                  onClick={openAddInstitute}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e91d49]"
                >
                  <Plus size={18} />
                  Add Institute
                </button>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <button
                onClick={() => loadData(true)}
                className="font-semibold underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <Users size={21} />
                </div>
                <span className="text-xs text-slate-400">All accounts</span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Total Users</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {users.length}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Loaded platform accounts
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <UserCheck size={21} />
                </div>
                <span className="text-xs font-medium text-emerald-600">
                  Active
                </span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Active Users</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {activeUsers}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Accounts currently enabled
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-pink-50 p-3 text-[#FF2454]">
                  <Building2 size={21} />
                </div>
                <span className="text-xs text-slate-400">Organizations</span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Total Institutes</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {institutes.length}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                {activeInstitutes} active institutes
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <ShieldCheck size={21} />
                </div>
                <span className="text-xs font-medium text-amber-600">
                  Account review
                </span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Inactive Users</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {inactiveUsers}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Accounts currently disabled
              </p>
            </div>
          </div>

          {/* Main section */}
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {/* Tabs */}
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:px-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setActiveTab("Users");
                    resetFilters();
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    activeTab === "Users"
                      ? "bg-[#10265F] text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Users size={17} />
                  Users
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      activeTab === "Users"
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {users.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("Institutes");
                    resetFilters();
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    activeTab === "Institutes"
                      ? "bg-[#10265F] text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Building2 size={17} />
                  Institutes
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      activeTab === "Institutes"
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {institutes.length}
                  </span>
                </button>
              </div>

              <button
                onClick={exportCSV}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/60 p-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={
                    activeTab === "Users"
                      ? "Search name, email, phone..."
                      : "Search institute or slug..."
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#10265F] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {activeTab === "Users" && (
                <div className="relative">
                  <Filter
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-600 outline-none focus:border-[#10265F]"
                  >
                    {roleOptions.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              )}

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-600 outline-none focus:border-[#10265F]"
                >
                  {statusOptions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 size={30} className="animate-spin text-[#FF2454]" />
                <p className="text-sm">Loading management data...</p>
              </div>
            ) : (
              <>
                {/* Users table */}
                {activeTab === "Users" && (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left">
                      <thead className="bg-white text-xs uppercase tracking-wide text-slate-400">
                        <tr>
                          <th className="px-5 py-4 font-semibold">User</th>
                          <th className="px-5 py-4 font-semibold">Platform Role</th>
                          <th className="px-5 py-4 font-semibold">Joined</th>
                          <th className="px-5 py-4 font-semibold">Status</th>
                          <th className="px-5 py-4 text-right font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="transition hover:bg-slate-50/70"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#10265F]">
                                  {user.name
                                    .split(" ")
                                    .map((part) => part[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-[#10265F]">
                                    {user.name}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-400">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700">
                                {user.role}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-500">
                              {user.joined}
                            </td>

                            <td className="px-5 py-4">
                              <StatusBadge status={user.status} />
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  title="View details"
                                  onClick={() => handleViewUser(user)}
                                  className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                                >
                                  <Eye size={17} />
                                </button>

                                <button
                                  title={
                                    user.status === "Active"
                                      ? "Deactivate account"
                                      : "Activate account"
                                  }
                                  disabled={actionLoading}
                                  onClick={() =>
                                    handleToggleUserStatus(user)
                                  }
                                  className={`rounded-lg p-2 disabled:opacity-50 ${
                                    user.status === "Active"
                                      ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
                                      : "text-emerald-600 hover:bg-emerald-50"
                                  }`}
                                >
                                  {user.status === "Active" ? (
                                    <Ban size={16} />
                                  ) : (
                                    <CheckCircle2 size={16} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Institutes table */}
                {activeTab === "Institutes" && (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left">
                      <thead className="bg-white text-xs uppercase tracking-wide text-slate-400">
                        <tr>
                          <th className="px-5 py-4 font-semibold">Institute</th>
                          <th className="px-5 py-4 font-semibold">Memberships</th>
                          <th className="px-5 py-4 font-semibold">Created</th>
                          <th className="px-5 py-4 font-semibold">Status</th>
                          <th className="px-5 py-4 text-right font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {filteredInstitutes.map((institute) => (
                          <tr
                            key={institute.id}
                            className="transition hover:bg-slate-50/70"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#10265F]">
                                  <Building2 size={20} />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-[#10265F]">
                                    {institute.name}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-400">
                                    {institute.code}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                                <Users size={15} className="text-slate-400" />
                                {institute.users}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-500">
                              {institute.joined}
                            </td>

                            <td className="px-5 py-4">
                              <StatusBadge status={institute.status} />
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  title="View details and members"
                                  onClick={() =>
                                    handleViewInstitute(institute)
                                  }
                                  className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                                >
                                  <Eye size={17} />
                                </button>

                                <button
                                  title="Edit institute"
                                  onClick={() =>
                                    openEditInstitute(institute)
                                  }
                                  className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-[#10265F]"
                                >
                                  <Pencil size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Empty state */}
                {((activeTab === "Users" &&
                  filteredUsers.length === 0) ||
                  (activeTab === "Institutes" &&
                    filteredInstitutes.length === 0)) && (
                  <div className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      {activeTab === "Users" ? (
                        <Users size={24} />
                      ) : (
                        <Building2 size={24} />
                      )}
                    </div>

                    <h3 className="mt-4 font-semibold text-[#10265F]">
                      No {activeTab.toLowerCase()} found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or filters.
                    </p>

                    <button
                      onClick={resetFilters}
                      className="mt-4 text-sm font-semibold text-[#FF2454] hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing{" "}
                {activeTab === "Users"
                  ? filteredUsers.length
                  : filteredInstitutes.length}{" "}
                records
              </span>
              <span>Super Admin · Account Management</span>
            </div>
          </section>
        </main>
      </div>

      {/* Add / edit institute modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#10265F]">
                  {editingId ? "Edit Institute" : "Add Institute"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Enter the institute name and unique URL slug.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSaveInstitute}
              className="space-y-4 p-5 sm:p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Institute Name *
                </label>
                <input
                  required
                  minLength={2}
                  maxLength={150}
                  value={instituteForm.name}
                  onChange={(event) =>
                    setInstituteForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter institute name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Institute Slug *
                </label>
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  value={instituteForm.code}
                  onChange={(event) =>
                    setInstituteForm((previous) => ({
                      ...previous,
                      code: event.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-"),
                    }))
                  }
                  placeholder="e.g. rit-college"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Use lowercase letters, numbers and hyphens only.
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-700">
                Plan, administrator, member count and institute status are
                managed separately. This form updates only the fields
                supported by the organization API.
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={actionLoading}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e91d49] disabled:opacity-60"
                >
                  {actionLoading && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  {editingId ? "Save Changes" : "Create Institute"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details modal */}
      {showDetails && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-[#10265F]">
                {showDetails.entityType === "user"
                  ? "User Details"
                  : "Institute Details"}
              </h2>

              <button
                onClick={() => setShowDetails(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#10265F]">
                  {showDetails.entityType === "user" ? (
                    <Users size={25} />
                  ) : (
                    <Building2 size={25} />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="break-words text-lg font-bold text-[#10265F]">
                    {showDetails.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {showDetails.role || showDetails.code}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {showDetails.email && (
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <Mail size={17} className="mt-0.5 shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="mt-1 break-all text-sm font-medium text-slate-700">
                        {showDetails.email}
                      </p>
                    </div>
                  </div>
                )}

                {showDetails.phone && (
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {showDetails.phone}
                      </p>
                    </div>
                  </div>
                )}

                {showDetails.entityType === "institute" && (
                  <>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">Institute slug</p>
                      <p className="mt-1 break-all text-sm font-medium text-slate-700">
                        {showDetails.code}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">Membership count</p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {showDetails.memberCount ?? showDetails.users}
                      </p>
                    </div>

                    {showDetails.members?.length > 0 && (
                      <div className="rounded-xl border border-slate-100 p-3">
                        <h4 className="mb-3 text-sm font-semibold text-[#10265F]">
                          Institute Members
                        </h4>

                        <div className="max-h-48 space-y-3 overflow-y-auto">
                          {showDetails.members.map((membership) => (
                            <div
                              key={membership.id}
                              className="flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-700">
                                  {membership.user?.profile?.name ||
                                    membership.user?.email ||
                                    "Member"}
                                </p>
                                <p className="truncate text-xs text-slate-400">
                                  {membership.user?.email}
                                </p>
                              </div>

                              <div className="shrink-0 text-right">
                                <p className="text-xs font-medium text-blue-700">
                                  {membership.role}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                  {normalizeStatus(membership.status)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <CalendarDays
                    size={17}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />
                  <div>
                    <p className="text-xs text-slate-400">Joined / Created</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {showDetails.joined}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <span className="text-sm font-medium text-slate-600">
                    {showDetails.entityType === "user"
                      ? "Account Status"
                      : "Institute Status"}
                  </span>
                  <StatusBadge status={showDetails.status} />
                </div>
              </div>

              <button
                onClick={() => setShowDetails(null)}
                className="mt-5 w-full rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#193778]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {notice && (
        <div className="fixed bottom-5 right-5 z-[80] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#10265F] shadow-lg sm:max-w-sm">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span className="break-words">{notice}</span>
          <button
            onClick={() => setNotice("")}
            className="ml-2 shrink-0 text-slate-400 hover:text-slate-700"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
