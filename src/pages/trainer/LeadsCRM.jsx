
import React, { useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {
  Search, Plus, Users, UserPlus, Phone, Mail, CalendarDays,
  Clock, Filter, Download, MoreHorizontal, X, Eye, Pencil,
  Trash2, MessageSquare, ArrowUpRight, CheckCircle2, CircleDot,
  ChevronDown, MapPin, GraduationCap, FileText, TrendingUp, Send,
} from "lucide-react";

const initialLeads = [
  {
    id: "LD-1001", name: "Aarav Sharma", email: "aarav.sharma@example.com",
    phone: "+91 98765 43210", course: "IELTS Academic", source: "Website",
    status: "New", score: "Beginner", assignedTo: "You",
    date: "2026-10-28", followUp: "2026-10-29",
    location: "Jaipur, Rajasthan",
    notes: "Interested in IELTS preparation for higher studies in Canada.",
  },
  {
    id: "LD-1002", name: "Priya Verma", email: "priya.verma@example.com",
    phone: "+91 98765 12345", course: "IELTS General", source: "Referral",
    status: "Contacted", score: "Intermediate", assignedTo: "You",
    date: "2026-10-27", followUp: "2026-10-29",
    location: "Ajmer, Rajasthan",
    notes: "Discussed course timings. Needs evening classes.",
  },
  {
    id: "LD-1003", name: "Rohan Mehta", email: "rohan.mehta@example.com",
    phone: "+91 99887 77665", course: "IELTS Academic",
    source: "Social Media", status: "Interested", score: "Intermediate",
    assignedTo: "You", date: "2026-10-26", followUp: "2026-10-30",
    location: "Jodhpur, Rajasthan",
    notes: "Wants a trial class before enrolling.",
  },
  {
    id: "LD-1004", name: "Sneha Gupta", email: "sneha.gupta@example.com",
    phone: "+91 91234 56780", course: "IELTS Academic",
    source: "Website", status: "Converted", score: "Advanced",
    assignedTo: "You", date: "2026-10-24", followUp: "",
    location: "Jaipur, Rajasthan",
    notes: "Successfully enrolled in the IELTS Academic batch.",
  },
  {
    id: "LD-1005", name: "Karan Singh", email: "karan.singh@example.com",
    phone: "+91 90123 45678", course: "IELTS General",
    source: "Advertisement", status: "New", score: "Beginner",
    assignedTo: "You", date: "2026-10-25", followUp: "2026-10-31",
    location: "Kota, Rajasthan",
    notes: "Asked about fees and course duration.",
  },
  {
    id: "LD-1006", name: "Ananya Jain", email: "ananya.jain@example.com",
    phone: "+91 98760 11223", course: "IELTS Academic",
    source: "Referral", status: "Lost", score: "Beginner",
    assignedTo: "You", date: "2026-10-21", followUp: "",
    location: "Udaipur, Rajasthan",
    notes: "Not proceeding currently due to scheduling constraints.",
  },
  {
    id: "LD-1007", name: "Vikram Patel", email: "vikram.patel@example.com",
    phone: "+91 97654 32109", course: "IELTS General",
    source: "Website", status: "Interested", score: "Intermediate",
    assignedTo: "You", date: "2026-10-22", followUp: "2026-10-28",
    location: "Jaipur, Rajasthan",
    notes: "Interested in weekend batches and mock tests.",
  },
];

const statusStyles = {
  New: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20",
  Contacted: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
  Interested: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20",
  Converted: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
  Lost: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20",
};

const statusOptions = ["New", "Contacted", "Interested", "Converted", "Lost"];

const emptyLead = {
  name: "",
  email: "",
  phone: "",
  course: "IELTS Academic",
  source: "Website",
  status: "New",
  score: "Beginner",
  followUp: "",
  location: "",
  notes: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#10265F] focus:ring-4 focus:ring-blue-900/5 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-gray-100 dark:placeholder:text-[#91899B] dark:focus:border-[#8B80D8]";

const cardClass =
  "rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-[#3B3441] dark:bg-[#211E27]";

const mutedText = "text-slate-500 dark:text-[#B0A5BD]";
const headingText = "text-[#10265F] dark:text-gray-100";

function Avatar({ name, size = "md" }) {
  const colors = [
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
    "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  ];

  const index = (name || "A").charCodeAt(0) % colors.length;

  return (
    <div
      className={`${colors[index]} ${
        size === "lg" ? "h-14 w-14 text-lg" : "h-10 w-10 text-sm"
      } flex shrink-0 items-center justify-center rounded-full font-bold`}
    >
      {(name || "A")
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()}
    </div>
  );
}

function formatDate(value) {
  if (!value) return "Not scheduled";

  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Leads() {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newLead, setNewLead] = useState(emptyLead);
  const [noteText, setNoteText] = useState("");
  const [toast, setToast] = useState("");
  const [menuLead, setMenuLead] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        [lead.name, lead.email, lead.phone, lead.id, lead.course].some(
          (value) => (value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;

      const matchesSource =
        sourceFilter === "All" || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, search, statusFilter, sourceFilter]);

  const counts = useMemo(
    () => ({
      total: leads.length,
      new: leads.filter((lead) => lead.status === "New").length,
      interested: leads.filter((lead) => lead.status === "Interested").length,
      converted: leads.filter((lead) => lead.status === "Converted").length,
      conversion:
        leads.length === 0
          ? 0
          : Math.round(
              (leads.filter((lead) => lead.status === "Converted").length /
                leads.length) *
                100
            ),
    }),
    [leads]
  );

  const openAddForm = () => {
    setEditingId(null);
    setNewLead(emptyLead);
    setShowForm(true);
  };

  const openEditForm = (lead) => {
    setEditingId(lead.id);
    setNewLead({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      course: lead.course,
      source: lead.source,
      status: lead.status,
      score: lead.score,
      followUp: lead.followUp,
      location: lead.location,
      notes: lead.notes,
    });
    setShowForm(true);
    setMenuLead(null);
  };

  const handleSaveLead = (event) => {
    event.preventDefault();

    if (
      !newLead.name.trim() ||
      !newLead.email.trim() ||
      !newLead.phone.trim()
    ) {
      notify("Please complete the required fields.");
      return;
    }

    if (editingId) {
      setLeads((current) =>
        current.map((lead) =>
          lead.id === editingId ? { ...lead, ...newLead } : lead
        )
      );

      if (selectedLead?.id === editingId) {
        setSelectedLead((current) => ({ ...current, ...newLead }));
      }

      notify("Lead updated successfully.");
    } else {
      const lead = {
        ...newLead,
        id: `LD-${Date.now().toString().slice(-6)}`,
        assignedTo: "You",
        date: new Date().toISOString().slice(0, 10),
      };

      setLeads((current) => [lead, ...current]);
      notify("New lead added successfully.");
    }

    setShowForm(false);
    setEditingId(null);
    setNewLead(emptyLead);
  };

  const changeStatus = (leadId, status) => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId ? { ...lead, status } : lead
      )
    );

    setSelectedLead((current) =>
      current?.id === leadId ? { ...current, status } : current
    );

    setMenuLead(null);
    notify(`Lead status changed to ${status}.`);
  };

  const addNote = () => {
    if (!noteText.trim() || !selectedLead) return;

    const updatedNotes = selectedLead.notes
      ? `${selectedLead.notes}\n\nFollow-up: ${noteText.trim()}`
      : `Follow-up: ${noteText.trim()}`;

    setLeads((current) =>
      current.map((lead) =>
        lead.id === selectedLead.id
          ? { ...lead, notes: updatedNotes }
          : lead
      )
    );

    setSelectedLead((current) => ({
      ...current,
      notes: updatedNotes,
    }));

    setNoteText("");
    notify("Follow-up note added.");
  };

  const deleteLead = (leadId) => {
    setLeads((current) =>
      current.filter((lead) => lead.id !== leadId)
    );

    if (selectedLead?.id === leadId) setSelectedLead(null);

    setMenuLead(null);
    notify("Lead deleted.");
  };

  const exportCSV = () => {
    const columns = [
      "id", "name", "email", "phone", "course",
      "source", "status", "date", "followUp",
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = [
      columns.join(","),
      ...filteredLeads.map((lead) =>
        columns.map((column) => escapeCSV(lead[column])).join(",")
      ),
    ];

    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "equilx-leads.csv";
    anchor.click();
    URL.revokeObjectURL(url);

    notify("Leads exported.");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setSourceFilter("All");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] text-slate-800 transition-colors dark:bg-[#17151B] dark:text-gray-100">
      <Sidebar />

      <main className="min-w-0 lg:ml-[260px]">
        <Navbar />

        <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 xl:p-8">
          {/* Page heading */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className={`mb-2 flex items-center gap-2 text-sm ${mutedText}`}>
                <span>Trainer Portal</span>
                <span>/</span>
                <span className="font-medium text-[#10265F] dark:text-[#B0A5BD]">
                  CRM & Leads
                </span>
              </div>

              <h1 className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${headingText}`}>
                CRM & Leads
              </h1>

              <p className={`mt-2 text-sm ${mutedText}`}>
                Manage prospective students, follow-ups, and enrolments.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-gray-200 dark:hover:bg-[#302B36]"
              >
                <Download size={17} />
                Export CSV
              </button>

              <button
                onClick={openAddForm}
                className="inline-flex items-center gap-2 rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#19377f] dark:bg-[#5141A8] dark:hover:bg-[#6251BB]"
              >
                <Plus size={18} />
                Add New Lead
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Total Leads",
                value: counts.total,
                icon: Users,
                iconBg: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
                detail: "All prospective students",
              },
              {
                label: "New Leads",
                value: counts.new,
                icon: UserPlus,
                iconBg: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
                detail: "Awaiting first contact",
              },
              {
                label: "Interested",
                value: counts.interested,
                icon: TrendingUp,
                iconBg: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
                detail: "Potential enrolments",
              },
              {
                label: "Converted",
                value: counts.converted,
                icon: CheckCircle2,
                iconBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
                detail: `${counts.conversion}% conversion rate`,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className={`${cardClass} p-5`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-sm font-medium ${mutedText}`}>
                        {item.label}
                      </p>
                      <h2 className={`mt-3 text-3xl font-extrabold ${headingText}`}>
                        {item.value}
                      </h2>
                    </div>

                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}>
                      <Icon size={22} />
                    </div>
                  </div>

                  <p className={`mt-3 text-xs ${mutedText}`}>
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Pipeline */}
          <section className={`${cardClass} p-5 sm:p-6`}>
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className={`font-bold ${headingText}`}>Lead Pipeline</h2>
                <p className={`mt-1 text-sm ${mutedText}`}>
                  Track each prospective student through the enrolment journey.
                </p>
              </div>

              <button
                onClick={clearFilters}
                className="self-start text-sm font-semibold text-[#10265F] hover:underline dark:text-[#B8AEFF] sm:self-auto"
              >
                Reset filters
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              {statusOptions.map((status) => {
                const count = leads.filter(
                  (lead) => lead.status === status
                ).length;

                const active = statusFilter === status;

                return (
                  <button
                    key={status}
                    onClick={() =>
                      setStatusFilter((current) =>
                        current === status ? "All" : status
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-[#10265F] bg-blue-50 ring-1 ring-[#10265F]/10 dark:border-[#8274D8] dark:bg-[#5141A8]/15 dark:ring-[#8274D8]/20"
                        : "border-slate-100 bg-slate-50/70 hover:border-slate-200 hover:bg-white dark:border-[#3B3441] dark:bg-[#19171E] dark:hover:bg-[#302B36]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-semibold ${mutedText}`}>
                        {status}
                      </span>
                      <CircleDot
                        size={16}
                        className={
                          active
                            ? "text-[#10265F] dark:text-[#B8AEFF]"
                            : "text-slate-300 dark:text-[#655D70]"
                        }
                      />
                    </div>

                    <p className={`mt-3 text-2xl font-extrabold ${headingText}`}>
                      {count}
                    </p>
                    <p className={`mt-1 text-xs ${mutedText}`}>Leads</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Leads table */}
          <section className={`${cardClass} overflow-hidden`}>
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-[#3B3441] sm:p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className={`font-bold ${headingText}`}>All Leads</h2>
                  <p className={`mt-1 text-sm ${mutedText}`}>
                    Showing {filteredLeads.length} of {leads.length} leads
                  </p>
                </div>

                <button
                  onClick={() => setShowFilters((current) => !current)}
                  className={`inline-flex items-center justify-center gap-2 self-start rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    showFilters
                      ? "border-[#10265F] bg-blue-50 text-[#10265F] dark:border-[#8274D8] dark:bg-[#5141A8]/15 dark:text-[#C5BDFF]"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
                  }`}
                >
                  <Filter size={16} />
                  Filters
                  <ChevronDown
                    size={15}
                    className={`transition ${showFilters ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name, email, phone, ID..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#10265F] focus:bg-white focus:ring-4 focus:ring-blue-900/5 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-gray-100 dark:placeholder:text-[#91899B] dark:focus:border-[#8274D8] dark:focus:bg-[#19171E]"
                  />
                </div>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 dark:bg-[#19171E] sm:grid-cols-3">
                  <div>
                    <label className={`mb-2 block text-xs font-semibold ${mutedText}`}>
                      Lead Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                      className={inputClass}
                    >
                      <option value="All">All statuses</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`mb-2 block text-xs font-semibold ${mutedText}`}>
                      Lead Source
                    </label>
                    <select
                      value={sourceFilter}
                      onChange={(event) => setSourceFilter(event.target.value)}
                      className={inputClass}
                    >
                      <option value="All">All sources</option>
                      {["Website", "Referral", "Social Media", "Advertisement"].map(
                        (source) => (
                          <option key={source} value={source}>
                            {source}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-[#3B3441] dark:bg-[#211E27] dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-slate-50/80 dark:bg-[#19171E]">
                  <tr className="text-xs uppercase tracking-wide text-slate-500 dark:text-[#B0A5BD]">
                    <th className="px-6 py-4 font-semibold">Prospective Student</th>
                    <th className="px-5 py-4 font-semibold">Course</th>
                    <th className="px-5 py-4 font-semibold">Source</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Follow-up</th>
                    <th className="px-5 py-4 font-semibold">Added On</th>
                    <th className="px-5 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-[#3B3441]">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="transition hover:bg-slate-50/70 dark:hover:bg-[#302B36]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={lead.name} />
                          <div className="min-w-0">
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setNoteText("");
                              }}
                              className="block max-w-[220px] truncate text-sm font-bold text-[#10265F] hover:underline dark:text-[#C5BDFF]"
                            >
                              {lead.name}
                            </button>
                            <p className={`mt-1 max-w-[220px] truncate text-xs ${mutedText}`}>
                              {lead.email}
                            </p>
                            <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                              {lead.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700 dark:text-gray-200">
                          {lead.course}
                        </p>
                        <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                          {lead.score}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:bg-[#302B36] dark:text-[#B0A5BD]">
                          {lead.source}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          aria-label={`Change status for ${lead.name}`}
                          value={lead.status}
                          onChange={(event) =>
                            changeStatus(lead.id, event.target.value)
                          }
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none ${statusStyles[lead.status]}`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-[#B0A5BD]">
                          <CalendarDays size={15} className="text-slate-400" />
                          <span>{formatDate(lead.followUp)}</span>
                        </div>
                        {lead.followUp &&
                          lead.followUp < new Date().toISOString().slice(0, 10) &&
                          !["Converted", "Lost"].includes(lead.status) && (
                            <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                              Follow-up overdue
                            </p>
                          )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-[#B0A5BD]">
                        {formatDate(lead.date)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setNoteText("");
                            }}
                            title="View lead"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-[#10265F] dark:text-[#B0A5BD] dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            onClick={() => openEditForm(lead)}
                            title="Edit lead"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-700 dark:text-[#B0A5BD] dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
                          >
                            <Pencil size={17} />
                          </button>

                          <div className="relative">
                            <button
                              onClick={() =>
                                setMenuLead((current) =>
                                  current === lead.id ? null : lead.id
                                )
                              }
                              title="More actions"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
                            >
                              <MoreHorizontal size={18} />
                            </button>

                            {menuLead === lead.id && (
                              <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-slate-100 bg-white p-2 shadow-xl dark:border-[#3B3441] dark:bg-[#211E27]">
                                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-[#91899B]">
                                  Change status
                                </p>

                                {statusOptions.map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => changeStatus(lead.id, status)}
                                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50 dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
                                  >
                                    {status}
                                  </button>
                                ))}

                                <div className="my-1 border-t border-slate-100 dark:border-[#3B3441]" />

                                <button
                                  onClick={() => deleteLead(lead.id)}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                >
                                  <Trash2 size={15} />
                                  Delete lead
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-[#302B36] dark:text-[#91899B]">
                          <Search size={24} />
                        </div>
                        <p className={`mt-4 font-bold ${headingText}`}>
                          No leads found
                        </p>
                        <p className={`mt-1 text-sm ${mutedText}`}>
                          Try another search or clear your filters.
                        </p>
                        <button
                          onClick={clearFilters}
                          className="mt-4 text-sm font-semibold text-[#10265F] hover:underline dark:text-[#B8AEFF]"
                        >
                          Clear filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className={`flex flex-col justify-between gap-2 border-t border-slate-100 px-6 py-4 text-xs dark:border-[#3B3441] sm:flex-row sm:items-center ${mutedText}`}>
              <span>
                {filteredLeads.length} result{filteredLeads.length === 1 ? "" : "s"}
              </span>
              <span>Lead data shown here is sample data.</span>
            </div>
          </section>

          {/* Follow-up reminder */}
          <section className="flex flex-col justify-between gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5 dark:border-[#3B3441] dark:from-[#211E27] dark:to-[#19171E] sm:flex-row sm:items-center sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#10265F] shadow-sm dark:bg-[#302B36] dark:text-[#B8AEFF]">
                <Clock size={21} />
              </div>
              <div>
                <h3 className="font-bold text-[#10265F] dark:text-gray-100">
                  Follow-up reminder
                </h3>
                <p className={`mt-1 max-w-2xl text-sm leading-6 ${mutedText}`}>
                  Keep your lead pipeline moving by contacting new and interested
                  students on time.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setStatusFilter("Interested");
                setShowFilters(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#19377f] dark:bg-[#5141A8] dark:hover:bg-[#6251BB]"
            >
              View interested leads
              <ArrowUpRight size={16} />
            </button>
          </section>
        </div>
      </main>

      {/* Add / edit lead modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6">
          <div className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#211E27]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-[#3B3441] sm:px-6">
              <div>
                <h2 className={`text-lg font-extrabold ${headingText}`}>
                  {editingId ? "Edit Lead" : "Add New Lead"}
                </h2>
                <p className={`mt-1 text-sm ${mutedText}`}>
                  Enter the prospective student's details.
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="overflow-y-auto p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Full Name *">
                  <input
                    required
                    value={newLead.name}
                    onChange={(event) =>
                      setNewLead({ ...newLead, name: event.target.value })
                    }
                    placeholder="Enter full name"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Email Address *">
                  <input
                    required
                    type="email"
                    value={newLead.email}
                    onChange={(event) =>
                      setNewLead({ ...newLead, email: event.target.value })
                    }
                    placeholder="student@example.com"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Phone Number *">
                  <input
                    required
                    type="tel"
                    value={newLead.phone}
                    onChange={(event) =>
                      setNewLead({ ...newLead, phone: event.target.value })
                    }
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Location">
                  <input
                    value={newLead.location}
                    onChange={(event) =>
                      setNewLead({ ...newLead, location: event.target.value })
                    }
                    placeholder="City, State"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Course">
                  <select
                    value={newLead.course}
                    onChange={(event) =>
                      setNewLead({ ...newLead, course: event.target.value })
                    }
                    className={inputClass}
                  >
                    <option>IELTS Academic</option>
                    <option>IELTS General</option>
                    <option>Speaking Practice</option>
                    <option>Writing Practice</option>
                  </select>
                </FormField>

                <FormField label="Lead Source">
                  <select
                    value={newLead.source}
                    onChange={(event) =>
                      setNewLead({ ...newLead, source: event.target.value })
                    }
                    className={inputClass}
                  >
                    <option>Website</option>
                    <option>Referral</option>
                    <option>Social Media</option>
                    <option>Advertisement</option>
                  </select>
                </FormField>

                <FormField label="Lead Status">
                  <select
                    value={newLead.status}
                    onChange={(event) =>
                      setNewLead({ ...newLead, status: event.target.value })
                    }
                    className={inputClass}
                  >
                    {statusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Current Level">
                  <select
                    value={newLead.score}
                    onChange={(event) =>
                      setNewLead({ ...newLead, score: event.target.value })
                    }
                    className={inputClass}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </FormField>

                <div className="sm:col-span-2">
                  <FormField label="Follow-up Date">
                    <input
                      type="date"
                      value={newLead.followUp}
                      onChange={(event) =>
                        setNewLead({ ...newLead, followUp: event.target.value })
                      }
                      className={inputClass}
                    />
                  </FormField>
                </div>

                <div className="sm:col-span-2">
                  <FormField label="Notes">
                    <textarea
                      rows={3}
                      value={newLead.notes}
                      onChange={(event) =>
                        setNewLead({ ...newLead, notes: event.target.value })
                      }
                      placeholder="Add requirements, discussion summary, or follow-up details..."
                      className={`${inputClass} resize-y`}
                    />
                  </FormField>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-[#3B3441] sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-[#3B3441] dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10265F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#19377f] dark:bg-[#5141A8] dark:hover:bg-[#6251BB]"
                >
                  <CheckCircle2 size={17} />
                  {editingId ? "Save Changes" : "Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead details drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-[2px]">
          <button
            aria-label="Close lead details"
            onClick={() => setSelectedLead(null)}
            className="absolute inset-0 cursor-default"
          />

          <aside className="relative z-10 flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl dark:bg-[#211E27]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-[#3B3441] sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#91899B]">
                  Lead details
                </p>
                <h2 className={`mt-1 text-lg font-extrabold ${headingText}`}>
                  {selectedLead.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-[#B0A5BD] dark:hover:bg-[#302B36]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-6 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <Avatar name={selectedLead.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <h3 className={`text-xl font-extrabold ${headingText}`}>
                    {selectedLead.name}
                  </h3>
                  <p className={`mt-1 break-all text-sm ${mutedText}`}>
                    {selectedLead.email}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[selectedLead.status]}`}>
                      {selectedLead.status}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-[#302B36] dark:text-[#B0A5BD]">
                      {selectedLead.course}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-[#3B3441] dark:hover:bg-blue-500/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    <Phone size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs ${mutedText}`}>Phone</p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-700 dark:text-gray-200">
                      {selectedLead.phone}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${selectedLead.email}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-[#3B3441] dark:hover:bg-blue-500/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs ${mutedText}`}>Email</p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-700 dark:text-gray-200">
                      Send email
                    </p>
                  </div>
                </a>
              </div>

              <div className="rounded-xl border border-slate-100 p-4 dark:border-[#3B3441]">
                <h4 className={`mb-4 font-bold ${headingText}`}>
                  Lead information
                </h4>

                <div className="space-y-4">
                  <DetailRow
                    icon={<GraduationCap size={18} />}
                    label="Course interest"
                    value={selectedLead.course}
                  />
                  <DetailRow
                    icon={<MapPin size={18} />}
                    label="Location"
                    value={selectedLead.location || "Not provided"}
                  />
                  <DetailRow
                    icon={<UserPlus size={18} />}
                    label="Lead source"
                    value={selectedLead.source}
                  />
                  <DetailRow
                    icon={<CalendarDays size={18} />}
                    label="Follow-up date"
                    value={formatDate(selectedLead.followUp)}
                  />
                  <DetailRow
                    icon={<FileText size={18} />}
                    label="Notes"
                    value={selectedLead.notes || "No notes added yet."}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 p-4 dark:border-[#3B3441]">
                <div className="mb-3 flex items-center gap-2">
                  <MessageSquare size={18} className="text-[#10265F] dark:text-[#B8AEFF]" />
                  <h4 className={`font-bold ${headingText}`}>
                    Add follow-up note
                  </h4>
                </div>

                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  placeholder="Write a call summary or next action..."
                  className={`${inputClass} resize-y`}
                />

                <button
                  onClick={addNote}
                  disabled={!noteText.trim()}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#19377f] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#5141A8] dark:hover:bg-[#6251BB]"
                >
                  <Send size={16} />
                  Save Follow-up Note
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 p-5 dark:border-[#3B3441] sm:px-6">
              <button
                onClick={() => openEditForm(selectedLead)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-[#3B3441] dark:text-gray-200 dark:hover:bg-[#302B36]"
              >
                <Pencil size={16} />
                Edit Lead
              </button>
              <button
                onClick={() => changeStatus(selectedLead.id, "Converted")}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <CheckCircle2 size={16} />
                Mark Converted
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[70] flex max-w-sm items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl dark:bg-[#302B36]">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-200">
        {label}
      </label>
      {children}
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate-400 dark:text-[#91899B]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-[#B0A5BD]">
          {label}
        </p>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm font-semibold text-slate-700 dark:text-gray-200">
          {value}
        </p>
      </div>
    </div>
  );
}
