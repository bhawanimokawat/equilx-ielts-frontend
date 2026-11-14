import React, { useMemo, useState } from "react";
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
  Phone,
  MapPin,
  CalendarDays,
  Download,
  RefreshCw,
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const initialUsers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    role: "Institute Admin",
    institute: "RIT College",
    location: "Jaipur, Rajasthan",
    status: "Active",
    joined: "20 Oct 2026",
  },
  {
    id: 2,
    name: "Priya Verma",
    email: "priya.verma@example.com",
    phone: "+91 98765 43211",
    role: "Principal",
    institute: "Arya College",
    location: "Jaipur, Rajasthan",
    status: "Active",
    joined: "18 Oct 2026",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    phone: "+91 98765 43212",
    role: "Teacher",
    institute: "RIT College",
    location: "Jaipur, Rajasthan",
    status: "Active",
    joined: "16 Oct 2026",
  },
  {
    id: 4,
    name: "Neha Singh",
    email: "neha.singh@example.com",
    phone: "+91 98765 43213",
    role: "Student",
    institute: "Purnima College",
    location: "Jaipur, Rajasthan",
    status: "Inactive",
    joined: "14 Oct 2026",
  },
  {
    id: 5,
    name: "Vikas Meena",
    email: "vikas.meena@example.com",
    phone: "+91 98765 43214",
    role: "HOD",
    institute: "Arya College",
    location: "Jaipur, Rajasthan",
    status: "Active",
    joined: "12 Oct 2026",
  },
  {
    id: 6,
    name: "Anjali Gupta",
    email: "anjali.gupta@example.com",
    phone: "+91 98765 43215",
    role: "Student",
    institute: "RIT College",
    location: "Jaipur, Rajasthan",
    status: "Pending",
    joined: "10 Oct 2026",
  },
  {
    id: 7,
    name: "Suresh Patel",
    email: "suresh.patel@example.com",
    phone: "+91 98765 43216",
    role: "Director",
    institute: "Purnima College",
    location: "Jaipur, Rajasthan",
    status: "Active",
    joined: "08 Oct 2026",
  },
];

const initialInstitutes = [
  {
    id: 101,
    name: "RIT College",
    code: "INST-001",
    admin: "Rahul Sharma",
    email: "rit.admin@example.com",
    plan: "Institute 12M",
    users: 245,
    status: "Active",
    joined: "12 Jan 2026",
  },
  {
    id: 102,
    name: "Arya College",
    code: "INST-002",
    admin: "Priya Verma",
    email: "arya.admin@example.com",
    plan: "Institute 6M",
    users: 182,
    status: "Active",
    joined: "05 Mar 2026",
  },
  {
    id: 103,
    name: "Purnima College",
    code: "INST-003",
    admin: "Suresh Patel",
    email: "purnima.admin@example.com",
    plan: "Free",
    users: 96,
    status: "Pending",
    joined: "17 Sep 2026",
  },
  {
    id: 104,
    name: "Global IELTS Academy",
    code: "INST-004",
    admin: "Mohit Jain",
    email: "global.admin@example.com",
    plan: "Institute 12M",
    users: 320,
    status: "Active",
    joined: "22 Feb 2026",
  },
];

const roles = [
  "All Roles",
  "Super Admin",
  "Institute Admin",
  "Director",
  "Principal",
  "HOD",
  "Teacher",
  "Student",
];

const statusOptions = ["All Status", "Active", "Inactive", "Pending"];

const emptyUser = {
  name: "",
  email: "",
  phone: "",
  role: "Student",
  institute: "RIT College",
  location: "",
  status: "Active",
};

const emptyInstitute = {
  name: "",
  code: "",
  admin: "",
  email: "",
  plan: "Free",
  users: 0,
  status: "Active",
};

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700",
    Inactive: "bg-slate-100 text-slate-600",
    Pending: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${
        styles[status] || styles.Inactive
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Active"
            ? "bg-emerald-500"
            : status === "Pending"
              ? "bg-amber-500"
              : "bg-slate-400"
        }`}
      />
      {status}
    </span>
  );
}

export default function UserInstituteManagement() {
  const [activeTab, setActiveTab] = useState("Users");
  const [users, setUsers] = useState(initialUsers);
  const [institutes, setInstitutes] = useState(initialInstitutes);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [instituteFilter, setInstituteFilter] = useState("All Institutes");
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingInstitute, setEditingInstitute] = useState(false);
  const [userForm, setUserForm] = useState(emptyUser);
  const [instituteForm, setInstituteForm] = useState(emptyInstitute);
  const [notice, setNotice] = useState("");

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch = [
        user.name,
        user.email,
        user.role,
        user.institute,
        user.phone,
      ].some((value) => String(value || "").toLowerCase().includes(term));

      return (
        matchesSearch &&
        (roleFilter === "All Roles" || user.role === roleFilter) &&
        (statusFilter === "All Status" || user.status === statusFilter) &&
        (instituteFilter === "All Institutes" ||
          user.institute === instituteFilter)
      );
    });
  }, [users, search, roleFilter, statusFilter, instituteFilter]);

  const filteredInstitutes = useMemo(() => {
    const term = search.toLowerCase().trim();

    return institutes.filter((institute) => {
      const matchesSearch = [
        institute.name,
        institute.code,
        institute.admin,
        institute.email,
        institute.plan,
      ].some((value) => String(value || "").toLowerCase().includes(term));

      return (
        matchesSearch &&
        (statusFilter === "All Status" ||
          institute.status === statusFilter)
      );
    });
  }, [institutes, search, statusFilter]);

  const activeUsers = users.filter((user) => user.status === "Active").length;

  const activeInstitutes = institutes.filter(
    (institute) => institute.status === "Active"
  ).length;

  const pendingUsers = users.filter(
    (user) => user.status === "Pending"
  ).length;

  const openAddUser = () => {
    setEditingId(null);
    setEditingInstitute(false);
    setUserForm({
      ...emptyUser,
      institute: institutes[0]?.name || "",
    });
    setShowModal(true);
  };

  const openEditUser = (user) => {
    setEditingId(user.id);
    setEditingInstitute(false);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      institute: user.institute,
      location: user.location,
      status: user.status,
    });
    setShowModal(true);
  };

  const openAddInstitute = () => {
    setEditingId(null);
    setEditingInstitute(true);
    setInstituteForm({
      ...emptyInstitute,
      code: `INST-${String(institutes.length + 1).padStart(3, "0")}`,
    });
    setShowModal(true);
  };

  const openEditInstitute = (institute) => {
    setEditingId(institute.id);
    setEditingInstitute(true);
    setInstituteForm({
      name: institute.name,
      code: institute.code,
      admin: institute.admin,
      email: institute.email,
      plan: institute.plan,
      users: institute.users,
      status: institute.status,
    });
    setShowModal(true);
  };

  const handleSaveUser = (event) => {
    event.preventDefault();

    if (
      users.some(
        (user) =>
          user.email.toLowerCase() === userForm.email.toLowerCase() &&
          user.id !== editingId
      )
    ) {
      setNotice("A user with this email already exists.");
      return;
    }

    if (!institutes.some((item) => item.name === userForm.institute)) {
      setNotice("Please select a valid institute.");
      return;
    }

    const newUser = {
      ...userForm,
      id: editingId || Date.now(),
      joined: users.find((user) => user.id === editingId)?.joined ||
        new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    };

    setUsers((previous) =>
      editingId
        ? previous.map((user) => (user.id === editingId ? newUser : user))
        : [newUser, ...previous]
    );

    setShowModal(false);
    setNotice(
      editingId ? "User updated successfully." : "User added successfully."
    );
  };

  const handleSaveInstitute = (event) => {
    event.preventDefault();

    if (
      institutes.some(
        (institute) =>
          (institute.name.toLowerCase() === instituteForm.name.toLowerCase() ||
            institute.code.toLowerCase() === instituteForm.code.toLowerCase()) &&
          institute.id !== editingId
      )
    ) {
      setNotice("Institute name or code already exists.");
      return;
    }

    const newInstitute = {
      ...instituteForm,
      id: editingId || Date.now(),
      joined: institutes.find((item) => item.id === editingId)?.joined ||
        new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    };

    setInstitutes((previous) =>
      editingId
        ? previous.map((item) =>
            item.id === editingId ? newInstitute : item
          )
        : [newInstitute, ...previous]
    );

    setShowModal(false);
    setNotice(
      editingId
        ? "Institute updated successfully."
        : "Institute added successfully."
    );
  };

  const toggleUserStatus = (user) => {
    const nextStatus = user.status === "Active" ? "Inactive" : "Active";

    setUsers((previous) =>
      previous.map((item) =>
        item.id === user.id ? { ...item, status: nextStatus } : item
      )
    );

    setNotice(`${user.name} is now ${nextStatus.toLowerCase()}.`);
  };

  const toggleInstituteStatus = (institute) => {
    const nextStatus =
      institute.status === "Active" ? "Inactive" : "Active";

    setInstitutes((previous) =>
      previous.map((item) =>
        item.id === institute.id
          ? { ...item, status: nextStatus }
          : item
      )
    );

    setNotice(`${institute.name} is now ${nextStatus.toLowerCase()}.`);
  };

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("All Roles");
    setStatusFilter("All Status");
    setInstituteFilter("All Institutes");
  };

  const exportCSV = () => {
    const rows =
      activeTab === "Users"
        ? [
            ["Name", "Email", "Phone", "Role", "Institute", "Status"],
            ...filteredUsers.map((user) => [
              user.name,
              user.email,
              user.phone,
              user.role,
              user.institute,
              user.status,
            ]),
          ]
        : [
            ["Institute", "Code", "Admin", "Email", "Plan", "Users", "Status"],
            ...filteredInstitutes.map((institute) => [
              institute.name,
              institute.code,
              institute.admin,
              institute.email,
              institute.plan,
              institute.users,
              institute.status,
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
        html.dark .user-institute-management select,
        html.dark .user-institute-management textarea {
          background-color: #211E27 !important;
          color: #FFFFFF !important;
          border-color: #3B3441 !important;
          color-scheme: dark;
        }

        html.dark .user-institute-management input::placeholder,
        html.dark .user-institute-management textarea::placeholder {
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
                Manage accounts, institute access, roles and account status.
              </p>
            </div>

            <button
              onClick={activeTab === "Users" ? openAddUser : openAddInstitute}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e91d49]"
            >
              <Plus size={18} />
              {activeTab === "Users" ? "Add New User" : "Add Institute"}
            </button>
          </div>

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
                Across all institutes
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
                  Review needed
                </span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Pending Users</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {pendingUsers}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Accounts awaiting review
              </p>
            </div>
          </div>

          {/* Tabs */}
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:px-6">
              <div className="flex gap-2">
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
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/60 p-4 sm:grid-cols-2 xl:grid-cols-4">
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
                      ? "Search name, email, role..."
                      : "Search institute, code, admin..."
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
                    {roles.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              )}

              {activeTab === "Users" && (
                <div className="relative">
                  <select
                    value={instituteFilter}
                    onChange={(event) =>
                      setInstituteFilter(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-600 outline-none focus:border-[#10265F]"
                  >
                    <option>All Institutes</option>
                    {institutes.map((institute) => (
                      <option key={institute.id} value={institute.name}>
                        {institute.name}
                      </option>
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

            {/* Users table */}
            {activeTab === "Users" && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left">
                  <thead className="bg-white text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-5 py-4 font-semibold">User</th>
                      <th className="px-5 py-4 font-semibold">Role</th>
                      <th className="px-5 py-4 font-semibold">Institute</th>
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
                                .join("")}
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
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {user.institute}
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
                              onClick={() =>
                                setShowDetails({ ...user, entityType: "user" })
                              }
                              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              title="Edit user"
                              onClick={() => openEditUser(user)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-[#10265F]"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              title={
                                user.status === "Active"
                                  ? "Deactivate account"
                                  : "Activate account"
                              }
                              onClick={() => toggleUserStatus(user)}
                              className={`rounded-lg p-2 ${
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
                <table className="w-full min-w-[950px] text-left">
                  <thead className="bg-white text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Institute</th>
                      <th className="px-5 py-4 font-semibold">Administrator</th>
                      <th className="px-5 py-4 font-semibold">Plan</th>
                      <th className="px-5 py-4 font-semibold">Users</th>
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
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#10265F]">
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
                          <p className="text-sm font-medium text-slate-700">
                            {institute.admin}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {institute.email}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                              institute.plan === "Free"
                                ? "bg-slate-100 text-slate-600"
                                : "bg-purple-50 text-purple-700"
                            }`}
                          >
                            {institute.plan}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                            <Users size={15} className="text-slate-400" />
                            {institute.users}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={institute.status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              title="View details"
                              onClick={() =>
                                setShowDetails({
                                  ...institute,
                                  entityType: "institute",
                                })
                              }
                              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              title="Edit institute"
                              onClick={() => openEditInstitute(institute)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-[#10265F]"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              title={
                                institute.status === "Active"
                                  ? "Deactivate institute"
                                  : "Activate institute"
                              }
                              onClick={() => toggleInstituteStatus(institute)}
                              className={`rounded-lg p-2 ${
                                institute.status === "Active"
                                  ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
                                  : "text-emerald-600 hover:bg-emerald-50"
                              }`}
                            >
                              {institute.status === "Active" ? (
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

            {((activeTab === "Users" && filteredUsers.length === 0) ||
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

      {/* Add/edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#10265F]">
                  {editingInstitute
                    ? editingId
                      ? "Edit Institute"
                      : "Add Institute"
                    : editingId
                      ? "Edit User"
                      : "Add New User"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Enter the account information below.
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

            {editingInstitute ? (
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
                    value={instituteForm.name}
                    onChange={(event) =>
                      setInstituteForm({
                        ...instituteForm,
                        name: event.target.value,
                      })
                    }
                    placeholder="Enter institute name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Institute Code *
                    </label>
                    <input
                      required
                      value={instituteForm.code}
                      onChange={(event) =>
                        setInstituteForm({
                          ...instituteForm,
                          code: event.target.value,
                        })
                      }
                      placeholder="INST-005"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Plan
                    </label>
                    <select
                      value={instituteForm.plan}
                      onChange={(event) =>
                        setInstituteForm({
                          ...instituteForm,
                          plan: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                    >
                      <option>Free</option>
                      <option>Institute 6M</option>
                      <option>Institute 12M</option>
                      <option>Pro</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Administrator Name *
                    </label>
                    <input
                      required
                      value={instituteForm.admin}
                      onChange={(event) =>
                        setInstituteForm({
                          ...instituteForm,
                          admin: event.target.value,
                        })
                      }
                      placeholder="Admin name"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Administrator Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={instituteForm.email}
                      onChange={(event) =>
                        setInstituteForm({
                          ...instituteForm,
                          email: event.target.value,
                        })
                      }
                      placeholder="admin@institute.com"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Current User Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={instituteForm.users}
                      onChange={(event) =>
                        setInstituteForm({
                          ...instituteForm,
                          users: Number(event.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Account Status
                    </label>
                    <select
                      value={instituteForm.status}
                      onChange={(event) =>
                        setInstituteForm({
                          ...instituteForm,
                          status: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#FF2454] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e91d49]"
                  >
                    {editingId ? "Save Changes" : "Create Institute"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveUser} className="space-y-4 p-5 sm:p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name *
                  </label>
                  <input
                    required
                    value={userForm.name}
                    onChange={(event) =>
                      setUserForm({ ...userForm, name: event.target.value })
                    }
                    placeholder="Enter full name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={userForm.email}
                      onChange={(event) =>
                        setUserForm({ ...userForm, email: event.target.value })
                      }
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Phone Number
                    </label>
                    <input
                      value={userForm.phone}
                      onChange={(event) =>
                        setUserForm({ ...userForm, phone: event.target.value })
                      }
                      placeholder="+91"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Role
                    </label>
                    <select
                      value={userForm.role}
                      onChange={(event) =>
                        setUserForm({ ...userForm, role: event.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                    >
                      {roles.slice(1).map((role) => (
                        <option key={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Institute
                    </label>
                    <select
                      value={userForm.institute}
                      onChange={(event) =>
                        setUserForm({
                          ...userForm,
                          institute: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                    >
                      {institutes.map((institute) => (
                        <option key={institute.id} value={institute.name}>
                          {institute.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Location
                    </label>
                    <input
                      value={userForm.location}
                      onChange={(event) =>
                        setUserForm({
                          ...userForm,
                          location: event.target.value,
                        })
                      }
                      placeholder="City, State"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Account Status
                    </label>
                    <select
                      value={userForm.status}
                      onChange={(event) =>
                        setUserForm({ ...userForm, status: event.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#FF2454] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e91d49]"
                  >
                    {editingId ? "Save Changes" : "Create User"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Details modal */}
      {showDetails && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
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
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#10265F]">
                  {showDetails.entityType === "user" ? (
                    <Users size={25} />
                  ) : (
                    <Building2 size={25} />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-[#10265F]">
                    {showDetails.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {showDetails.role || showDetails.code}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <Mail size={17} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-700">
                      {showDetails.email}
                    </p>
                  </div>
                </div>

                {showDetails.phone && (
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <Phone size={17} className="mt-0.5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {showDetails.phone}
                      </p>
                    </div>
                  </div>
                )}

                {showDetails.location && (
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <MapPin size={17} className="mt-0.5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Location</p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {showDetails.location}
                      </p>
                    </div>
                  </div>
                )}

                {showDetails.institute && (
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <Building2 size={17} className="mt-0.5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Institute</p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {showDetails.institute}
                      </p>
                    </div>
                  </div>
                )}

                {showDetails.plan && (
                  <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <ShieldCheck size={17} className="mt-0.5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Subscription Plan</p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {showDetails.plan}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <CalendarDays size={17} className="mt-0.5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">Joined</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {showDetails.joined}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <span className="text-sm font-medium text-slate-600">
                    Account Status
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
        <div className="fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#10265F] shadow-lg">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>{notice}</span>
          <button
            onClick={() => setNotice("")}
            className="ml-2 text-slate-400 hover:text-slate-700"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}