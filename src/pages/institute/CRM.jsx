
import React, { useMemo, useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar";
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
} from "lucide-react";

const initialLeads = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "+91 98765 43210",
    course: "IELTS Academic",
    source: "Website",
    status: "New",
    priority: "High",
    followUp: "2026-10-29",
    owner: "Aman Sharma",
  },
  {
    id: 2,
    name: "Priya Verma",
    email: "priya.verma@gmail.com",
    phone: "+91 98765 43211",
    course: "IELTS General",
    source: "Instagram",
    status: "Contacted",
    priority: "Medium",
    followUp: "2026-10-28",
    owner: "Neha Singh",
  },
  {
    id: 3,
    name: "Aarav Gupta",
    email: "aarav.gupta@gmail.com",
    phone: "+91 98765 43212",
    course: "IELTS Academic",
    source: "Referral",
    status: "Interested",
    priority: "High",
    followUp: "2026-10-30",
    owner: "Aman Sharma",
  },
  {
    id: 4,
    name: "Ananya Singh",
    email: "ananya.singh@gmail.com",
    phone: "+91 98765 43213",
    course: "IELTS Academic",
    source: "Walk-in",
    status: "Converted",
    priority: "Low",
    followUp: "2026-10-27",
    owner: "Pooja Gupta",
  },
  {
    id: 5,
    name: "Kabir Mehta",
    email: "kabir.mehta@gmail.com",
    phone: "+91 98765 43214",
    course: "IELTS General",
    source: "Facebook",
    status: "Follow-up",
    priority: "Medium",
    followUp: "2026-10-27",
    owner: "Neha Singh",
  },
  {
    id: 6,
    name: "Meera Joshi",
    email: "meera.joshi@gmail.com",
    phone: "+91 98765 43215",
    course: "IELTS Academic",
    source: "Website",
    status: "Interested",
    priority: "High",
    followUp: "2026-10-31",
    owner: "Pooja Gupta",
  },
];

const statusStyles = {
  New: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  Contacted:
    "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  Interested:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  "Follow-up":
    "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  Converted:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  Lost: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

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

          <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp size={14} />
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

function LeadModal({ lead, onClose, onSave }) {
  const [form, setForm] = useState(
    lead || {
      name: "",
      email: "",
      phone: "",
      course: "IELTS Academic",
      source: "Website",
      status: "New",
      priority: "Medium",
      followUp: "",
      owner: "Aman Sharma",
    }
  );

  const update = (key, value) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      return;
    }

    onSave(form);
  };

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#10265F] outline-none transition focus:border-[#FF4778] dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:placeholder:text-[#91899B] dark:[color-scheme:dark]";

  const labelClass = "text-sm font-semibold text-[#10265F] dark:text-slate-200";

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
                onChange={(e) => update("name", e.target.value)}
                className={fieldClass}
                placeholder="Enter full name"
              />
            </label>

            <label className={labelClass}>
              Email Address *
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={fieldClass}
                placeholder="name@example.com"
              />
            </label>

            <label className={labelClass}>
              Phone Number *
              <input
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={fieldClass}
                placeholder="+91 XXXXX XXXXX"
              />
            </label>

            <label className={labelClass}>
              Course
              <select
                value={form.course}
                onChange={(e) => update("course", e.target.value)}
                className={fieldClass}
              >
                <option>IELTS Academic</option>
                <option>IELTS General</option>
                <option>IELTS Speaking</option>
                <option>IELTS Intensive</option>
              </select>
            </label>

            <label className={labelClass}>
              Lead Source
              <select
                value={form.source}
                onChange={(e) => update("source", e.target.value)}
                className={fieldClass}
              >
                {[
                  "Website",
                  "Instagram",
                  "Facebook",
                  "Referral",
                  "Walk-in",
                  "Other",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Lead Status
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className={fieldClass}
              >
                {[
                  "New",
                  "Contacted",
                  "Interested",
                  "Follow-up",
                  "Converted",
                  "Lost",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Priority
              <select
                value={form.priority}
                onChange={(e) => update("priority", e.target.value)}
                className={fieldClass}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>

            <label className={labelClass}>
              Next Follow-up
              <input
                type="date"
                value={form.followUp}
                onChange={(e) => update("followUp", e.target.value)}
                className={fieldClass}
              />
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Assigned To
              <select
                value={form.owner}
                onChange={(e) => update("owner", e.target.value)}
                className={fieldClass}
              >
                <option>Aman Sharma</option>
                <option>Neha Singh</option>
                <option>Pooja Gupta</option>
                <option>Rahul Kumar</option>
              </select>
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-[#3B3441]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-[#3B3441] dark:text-slate-300 dark:hover:bg-[#302B36]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-[#FF2454] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600"
            >
              {lead ? "Save Changes" : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CRM() {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const term = search.toLowerCase();

      const matchesSearch =
        lead.name.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.phone.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All Statuses" || lead.status === statusFilter;

      const matchesSource =
        sourceFilter === "All Sources" || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, search, statusFilter, sourceFilter]);

  const convertedCount = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  const conversionRate = leads.length
    ? Math.round((convertedCount / leads.length) * 100)
    : 0;

  const followUpsDue = leads.filter(
    (lead) => lead.status === "Follow-up" || lead.status === "Interested"
  ).length;

  const saveLead = (form) => {
    if (form.id) {
      setLeads((previous) =>
        previous.map((lead) =>
          lead.id === form.id ? { ...form, id: lead.id } : lead
        )
      );
    } else {
      setLeads((previous) => [
        { ...form, id: Date.now() },
        ...previous,
      ]);
    }

    setModalOpen(false);
    setEditingLead(null);
  };

  const exportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Course",
      "Source",
      "Status",
      "Priority",
      "Follow-up",
      "Assigned To",
    ];

    const rows = filteredLeads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone,
      lead.course,
      lead.source,
      lead.status,
      lead.priority,
      lead.followUp,
      lead.owner,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "equilx-crm-leads.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const inputClass =
    "h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs text-[#10265F] outline-none transition focus:border-pink-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-slate-200 dark:[color-scheme:dark]";

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
          </section>

          {/* Summary cards */}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Leads"
              value={leads.length}
              change="+12.5% this month"
              icon={Users}
              color="pink"
            />

            <StatCard
              title="New Enquiries"
              value={leads.filter((lead) => lead.status === "New").length}
              change="Recently received"
              icon={UserPlus}
              color="blue"
            />

            <StatCard
              title="Conversion Rate"
              value={`${conversionRate}%`}
              change="Converted leads"
              icon={TrendingUp}
              color="green"
            />

            <StatCard
              title="Follow-ups"
              value={followUpsDue}
              change="Require attention"
              icon={CalendarDays}
              color="purple"
            />
          </section>

          {/* Lead funnel */}

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
                  {leads.length} Total Leads
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { name: "New", color: "bg-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                  { name: "Contacted", color: "bg-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
                  { name: "Interested", color: "bg-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                  { name: "Follow-up", color: "bg-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
                  { name: "Converted", color: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                  { name: "Lost", color: "bg-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
                ].map((stage) => {
                  const count = leads.filter(
                    (lead) => lead.status === stage.name
                  ).length;

                  const percent = leads.length
                    ? (count / leads.length) * 100
                    : 0;

                  return (
                    <div
                      key={stage.name}
                      className={`rounded-xl p-4 ${stage.bg}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {stage.name}
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
                Leads converted into admissions
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
                    Converted
                  </p>
                  <p className="mt-1 text-xl font-bold">{convertedCount}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-blue-100 dark:text-[#C5B8DC]">
                    Remaining Leads
                  </p>
                  <p className="mt-1 text-xl font-bold">
                    {leads.length - convertedCount}
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
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email or phone..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-[#10265F] outline-none transition placeholder:text-slate-400 focus:border-pink-300 dark:border-[#3B3441] dark:bg-[#19171E] dark:text-white dark:placeholder:text-[#91899B]"
                />
              </div>

              <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 dark:border-[#3B3441] dark:bg-[#19171E]">
                <Filter size={15} className="text-slate-400 dark:text-[#91899B]" />

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="min-w-0 bg-transparent text-xs text-[#10265F] outline-none dark:text-slate-200 dark:[color-scheme:dark]"
                >
                  <option>All Statuses</option>
                  {[
                    "New",
                    "Contacted",
                    "Interested",
                    "Follow-up",
                    "Converted",
                    "Lost",
                  ].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>

              <select
                value={sourceFilter}
                onChange={(event) => setSourceFilter(event.target.value)}
                className={inputClass}
              >
                <option>All Sources</option>
                {[
                  "Website",
                  "Instagram",
                  "Facebook",
                  "Referral",
                  "Walk-in",
                  "Other",
                ].map((source) => (
                  <option key={source}>{source}</option>
                ))}
              </select>
            </div>

            {/* Leads table */}

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="bg-slate-50 text-[11px] text-slate-500 dark:bg-[#19171E] dark:text-[#B0A5BD]">
                    {[
                      "Lead / Contact",
                      "Course",
                      "Source",
                      "Status",
                      "Priority",
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
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-slate-100 text-xs transition hover:bg-slate-50/70 dark:border-[#3B3441] dark:hover:bg-[#302B36]/60"
                    >
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            {lead.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")}
                          </span>

                          <div>
                            <p className="whitespace-nowrap font-bold text-[#10265F] dark:text-slate-100">
                              {lead.name}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-slate-400 dark:text-[#91899B]">
                              <Mail size={11} />
                              {lead.email}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-slate-400 dark:text-[#91899B]">
                              <Phone size={11} />
                              {lead.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4 text-slate-600 dark:text-slate-300">
                        {lead.course}
                      </td>

                      <td className="px-3 py-4 text-slate-500 dark:text-[#B0A5BD]">
                        {lead.source}
                      </td>

                      <td className="px-3 py-4">
                        <select
                          value={lead.status}
                          onChange={(event) =>
                            setLeads((previous) =>
                              previous.map((item) =>
                                item.id === lead.id
                                  ? { ...item, status: event.target.value }
                                  : item
                              )
                            )
                          }
                          className={`rounded-full border-0 px-2.5 py-1.5 text-[10px] font-semibold outline-none dark:[color-scheme:dark] ${statusStyles[lead.status] || "bg-slate-100 text-slate-600"}`}
                        >
                          {[
                            "New",
                            "Contacted",
                            "Interested",
                            "Follow-up",
                            "Converted",
                            "Lost",
                          ].map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
                            lead.priority === "High"
                              ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                              : lead.priority === "Medium"
                                ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                                : "bg-slate-100 text-slate-500 dark:bg-[#302B36] dark:text-slate-300"
                          }`}
                        >
                          {lead.priority}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <span className="flex items-center gap-1.5 whitespace-nowrap text-slate-500 dark:text-[#B0A5BD]">
                          <CalendarDays size={13} />
                          {lead.followUp || "Not scheduled"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-slate-600 dark:text-slate-300">
                        {lead.owner}
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedLead(lead)}
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
                        colSpan="8"
                        className="px-3 py-12 text-center text-sm text-slate-400 dark:text-[#B0A5BD]"
                      >
                        No leads found. Try changing your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-[#3B3441]">
              <p className="text-xs text-slate-400 dark:text-[#91899B]">
                Showing {filteredLeads.length} of {leads.length} leads
              </p>

              <span className="text-xs font-medium text-[#10265F] dark:text-slate-200">
                {leads.length} total records
              </span>
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
                  Leads that need another contact or a status update.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {leads
                .filter(
                  (lead) =>
                    lead.status === "Follow-up" ||
                    lead.status === "Interested"
                )
                .slice(0, 3)
                .map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 transition-colors dark:border-[#3B3441] dark:bg-[#19171E]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#10265F] dark:text-slate-100">
                        {lead.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-[#B0A5BD]">
                        {lead.course}
                      </p>

                      <p className="mt-2 flex items-center gap-1 text-xs text-orange-500 dark:text-orange-400">
                        <CalendarDays size={13} />
                        {lead.followUp || "Date not set"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingLead(lead);
                        setModalOpen(true);
                      }}
                      className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#10265F] transition hover:bg-slate-50 dark:border-[#3B3441] dark:text-slate-200 dark:hover:bg-[#302B36]"
                    >
                      Update
                    </button>
                  </div>
                ))}

              {followUpsDue === 0 && (
                <p className="text-sm text-slate-400 dark:text-[#B0A5BD]">
                  No pending follow-ups.
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
          onClose={() => {
            setModalOpen(false);
            setEditingLead(null);
          }}
          onSave={saveLead}
        />
      )}

      {/* Lead Details Modal */}

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10265F]/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:border dark:border-[#3B3441] dark:bg-[#211E27]">
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
                  {selectedLead.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 dark:text-[#91899B]">
                  Phone
                </p>
                <p className="mt-1 text-sm text-[#10265F] dark:text-slate-200">
                  {selectedLead.phone}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 dark:text-[#91899B]">
                    Course
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#10265F] dark:text-slate-100">
                    {selectedLead.course}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 dark:text-[#91899B]">
                    Status
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[selectedLead.status]}`}
                  >
                    {selectedLead.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-400 dark:text-[#91899B]">
                    Lead Source
                  </p>
                  <p className="mt-1 text-sm text-[#10265F] dark:text-slate-200">
                    {selectedLead.source}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 dark:text-[#91899B]">
                    Assigned To
                  </p>
                  <p className="mt-1 text-sm text-[#10265F] dark:text-slate-200">
                    {selectedLead.owner}
                  </p>
                </div>
              </div>
            </div>

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
