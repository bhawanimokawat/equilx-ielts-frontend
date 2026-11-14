import React, { useMemo, useState } from "react";
import { CreditCard, IndianRupee, Users, TrendingUp, Search, Plus, Download, Eye, Pencil, X, CheckCircle2, Clock3, AlertCircle, RefreshCw, ChevronDown, Receipt, CalendarDays, ArrowUpRight, ArrowDownRight, Wallet, ShieldCheck, Ban } from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const initialPlans = [
  {
    id: 1,
    name: "Free",
    audience: "Individual students",
    price: 0,
    duration: "Forever",
    features: "Basic practice, limited AI feedback",
    subscribers: 420,
    status: "Active",
  },
  {
    id: 2,
    name: "Student Pro",
    audience: "Individual students",
    price: 999,
    duration: "Monthly",
    features: "Unlimited practice, AI feedback, mock tests",
    subscribers: 186,
    status: "Active",
  },
  {
    id: 3,
    name: "Institute 6M",
    audience: "Institutes",
    price: 14999,
    duration: "6 Months",
    features: "Institute dashboard, trainers, student analytics",
    subscribers: 24,
    status: "Active",
  },
  {
    id: 4,
    name: "Institute 12M",
    audience: "Institutes",
    price: 24999,
    duration: "12 Months",
    features: "All institute features, extended subscription",
    subscribers: 18,
    status: "Active",
  },
];

const initialPayments = [
  {
    id: "PAY-10284",
    customer: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    plan: "Student Pro",
    amount: 999,
    date: "26 Oct 2026",
    method: "UPI",
    status: "Success",
    invoice: "INV-10284",
  },
  {
    id: "PAY-10283",
    customer: "RIT College",
    email: "rit.admin@example.com",
    plan: "Institute 12M",
    amount: 24999,
    date: "25 Oct 2026",
    method: "Net Banking",
    status: "Success",
    invoice: "INV-10283",
  },
  {
    id: "PAY-10282",
    customer: "Priya Verma",
    email: "priya.verma@example.com",
    plan: "Student Pro",
    amount: 999,
    date: "25 Oct 2026",
    method: "Card",
    status: "Pending",
    invoice: "INV-10282",
  },
  {
    id: "PAY-10281",
    customer: "Arya College",
    email: "arya.admin@example.com",
    plan: "Institute 6M",
    amount: 14999,
    date: "24 Oct 2026",
    method: "UPI",
    status: "Success",
    invoice: "INV-10281",
  },
  {
    id: "PAY-10280",
    customer: "Amit Kumar",
    email: "amit.kumar@example.com",
    plan: "Student Pro",
    amount: 999,
    date: "23 Oct 2026",
    method: "Card",
    status: "Failed",
    invoice: "INV-10280",
  },
  {
    id: "PAY-10279",
    customer: "Purnima College",
    email: "purnima.admin@example.com",
    plan: "Free",
    amount: 0,
    date: "22 Oct 2026",
    method: "—",
    status: "Success",
    invoice: "INV-10279",
  },
];

const initialRefunds = [
  {
    id: "REF-3001",
    customer: "Amit Kumar",
    paymentId: "PAY-10280",
    amount: 999,
    reason: "Duplicate payment",
    date: "23 Oct 2026",
    status: "Pending",
  },
  {
    id: "REF-3002",
    customer: "Arya College",
    paymentId: "PAY-10281",
    amount: 14999,
    reason: "Subscription cancellation",
    date: "24 Oct 2026",
    status: "Approved",
  },
];

const emptyPlan = {
  name: "",
  audience: "Individual students",
  price: "",
  duration: "Monthly",
  features: "",
  subscribers: 0,
  status: "Active",
};

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function PaymentStatus({ status }) {
  const styles = {
    Success: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-red-50 text-red-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-red-50 text-red-700",
    Refunded: "bg-blue-50 text-blue-700",
  };

  const Icon =
    status === "Success" || status === "Approved"
      ? CheckCircle2
      : status === "Failed" || status === "Rejected"
        ? AlertCircle
        : Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

export default function PlansPaymentsRefunds() {
  const [activeTab, setActiveTab] = useState("Payments");
  const [plans, setPlans] = useState(initialPlans);
  const [payments, setPayments] = useState(initialPayments);
  const [refunds, setRefunds] = useState(initialRefunds);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [planFilter, setPlanFilter] = useState("All Plans");

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState(emptyPlan);

  const [showDetails, setShowDetails] = useState(null);
  const [notice, setNotice] = useState("");

  const successfulPayments = payments.filter(
    (payment) => payment.status === "Success"
  );

  const totalRevenue = successfulPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const pendingPayments = payments.filter(
    (payment) => payment.status === "Pending"
  ).length;

  const pendingRefunds = refunds.filter(
    (refund) => refund.status === "Pending"
  ).length;

  const filteredPayments = useMemo(() => {
    const term = search.toLowerCase().trim();

    return payments.filter((payment) => {
      const matchesSearch = [
        payment.id,
        payment.customer,
        payment.email,
        payment.invoice,
        payment.plan,
      ].some((value) => String(value || "").toLowerCase().includes(term));

      return (
        matchesSearch &&
        (statusFilter === "All Status" ||
          payment.status === statusFilter) &&
        (planFilter === "All Plans" || payment.plan === planFilter)
      );
    });
  }, [payments, search, statusFilter, planFilter]);

  const filteredRefunds = useMemo(() => {
    const term = search.toLowerCase().trim();

    return refunds.filter((refund) => {
      const matchesSearch = [
        refund.id,
        refund.customer,
        refund.paymentId,
        refund.reason,
      ].some((value) => String(value || "").toLowerCase().includes(term));

      return (
        matchesSearch &&
        (statusFilter === "All Status" ||
          refund.status === statusFilter)
      );
    });
  }, [refunds, search, statusFilter]);

  const filteredPlans = useMemo(() => {
    const term = search.toLowerCase().trim();

    return plans.filter((plan) =>
      [plan.name, plan.audience, plan.duration, plan.features].some(
        (value) => String(value || "").toLowerCase().includes(term)
      )
    );
  }, [plans, search]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setPlanFilter("All Plans");
  };

  const openCreatePlan = () => {
    setEditingPlanId(null);
    setPlanForm(emptyPlan);
    setShowPlanModal(true);
  };

  const openEditPlan = (plan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      name: plan.name,
      audience: plan.audience,
      price: String(plan.price),
      duration: plan.duration,
      features: plan.features,
      subscribers: plan.subscribers,
      status: plan.status,
    });
    setShowPlanModal(true);
  };

  const savePlan = (event) => {
    event.preventDefault();

    if (
      plans.some(
        (plan) =>
          plan.name.toLowerCase() === planForm.name.trim().toLowerCase() &&
          plan.id !== editingPlanId
      )
    ) {
      setNotice("A plan with this name already exists.");
      return;
    }

    const nextPlan = {
      ...planForm,
      name: planForm.name.trim(),
      price: Number(planForm.price) || 0,
      subscribers: Number(planForm.subscribers) || 0,
      id: editingPlanId || Date.now(),
    };

    setPlans((previous) =>
      editingPlanId
        ? previous.map((plan) =>
            plan.id === editingPlanId ? nextPlan : plan
          )
        : [nextPlan, ...previous]
    );

    setShowPlanModal(false);
    setNotice(editingPlanId ? "Plan updated." : "Plan created.");
  };

  const togglePlanStatus = (plan) => {
    const nextStatus = plan.status === "Active" ? "Inactive" : "Active";

    setPlans((previous) =>
      previous.map((item) =>
        item.id === plan.id ? { ...item, status: nextStatus } : item
      )
    );

    setNotice(`${plan.name} plan is now ${nextStatus.toLowerCase()}.`);
  };

  const updateRefund = (refund, nextStatus) => {
    setRefunds((previous) =>
      previous.map((item) =>
        item.id === refund.id ? { ...item, status: nextStatus } : item
      )
    );

    setNotice(`Refund ${refund.id} marked ${nextStatus.toLowerCase()}.`);
  };

  const exportCSV = () => {
    let rows;

    if (activeTab === "Plans") {
      rows = [
        ["Plan", "Audience", "Price INR", "Duration", "Subscribers", "Status"],
        ...filteredPlans.map((plan) => [
          plan.name,
          plan.audience,
          plan.price,
          plan.duration,
          plan.subscribers,
          plan.status,
        ]),
      ];
    } else if (activeTab === "Refunds") {
      rows = [
        ["Refund ID", "Customer", "Payment ID", "Amount", "Reason", "Status"],
        ...filteredRefunds.map((refund) => [
          refund.id,
          refund.customer,
          refund.paymentId,
          refund.amount,
          refund.reason,
          refund.status,
        ]),
      ];
    } else {
      rows = [
        ["Payment ID", "Customer", "Plan", "Amount", "Date", "Method", "Status"],
        ...filteredPayments.map((payment) => [
          payment.id,
          payment.customer,
          payment.plan,
          payment.amount,
          payment.date,
          payment.method,
          payment.status,
        ]),
      ];
    }

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
    link.download = `${activeTab.toLowerCase()}-report.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const markPaymentRefunded = (payment) => {
    const confirmed = window.confirm(
      `Mark payment ${payment.id} as refunded? This demo will only update the displayed status.`
    );

    if (!confirmed) return;

    setPayments((previous) =>
      previous.map((item) =>
        item.id === payment.id ? { ...item, status: "Refunded" } : item
      )
    );

    setNotice("Payment status updated to Refunded (demo only).");
  };

  return (
    <div className="plans-payments-refunds min-h-screen bg-[#F5F7FF] text-[#172554] transition-colors">
      <style>{`
        html.dark .plans-payments-refunds {
          background-color: #17151B !important;
          color: #FFFFFF !important;
        }

        html.dark .plans-payments-refunds [class*="bg-white"],
        html.dark .plans-payments-refunds [class*="bg-[#F5F7FF]"],
        html.dark .plans-payments-refunds [class*="bg-slate-50"],
        html.dark .plans-payments-refunds [class*="bg-slate-100"] {
          background-color: #211E27 !important;
        }

        html.dark .plans-payments-refunds [class*="border-slate-100"],
        html.dark .plans-payments-refunds [class*="border-slate-200"] {
          border-color: #3B3441 !important;
        }

        html.dark .plans-payments-refunds [class*="text-[#10265F]"],
        html.dark .plans-payments-refunds [class*="text-[#172554]"],
        html.dark .plans-payments-refunds [class*="text-slate-700"],
        html.dark .plans-payments-refunds [class*="text-slate-800"],
        html.dark .plans-payments-refunds [class*="text-slate-900"] {
          color: #FFFFFF !important;
        }

        html.dark .plans-payments-refunds [class*="text-slate-500"],
        html.dark .plans-payments-refunds [class*="text-slate-400"],
        html.dark .plans-payments-refunds [class*="text-slate-600"] {
          color: #B0A5BD !important;
        }

        html.dark .plans-payments-refunds input,
        html.dark .plans-payments-refunds select,
        html.dark .plans-payments-refunds textarea {
          background-color: #19171E !important;
          color: #FFFFFF !important;
          border-color: #3B3441 !important;
        }

        html.dark .plans-payments-refunds input::placeholder,
        html.dark .plans-payments-refunds textarea::placeholder {
          color: #8F849A !important;
        }

        html.dark .plans-payments-refunds [class*="hover:bg-slate-50"]:hover,
        html.dark .plans-payments-refunds [class*="hover:bg-slate-100"]:hover {
          background-color: #302B36 !important;
        }
      `}</style>

      <Sidebar />

      <div className="min-h-screen md:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">          {/* Heading */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>Super Admin</span>
                <span>/</span>
                <span className="text-[#FF2454]">Plans & Payments</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#10265F] sm:text-3xl">
                Plans, Payments & Refunds
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage subscription plans, monitor transactions and review
                refund requests.
              </p>
            </div>
            <button
              onClick={activeTab === "Plans" ? openCreatePlan : exportCSV}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e91d49]"
            >
              {activeTab === "Plans" ? <Plus size={18} /> : <Download size={17} />}
              {activeTab === "Plans" ? "Create New Plan" : "Export Report"}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <Wallet size={21} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <ArrowUpRight size={14} />
                  Demo data
                </span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Total Revenue</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {money(totalRevenue)}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Successful sample payments
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <CreditCard size={21} />
                </div>
                <span className="text-xs text-slate-400">Transactions</span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Successful Payments</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {successfulPayments.length}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Completed transactions
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Clock3 size={21} />
                </div>
                <span className="text-xs font-medium text-amber-600">
                  Requires attention
                </span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Pending Payments</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {pendingPayments}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Awaiting confirmation
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-pink-50 p-3 text-[#FF2454]">
                  <RefreshCw size={21} />
                </div>
                <span className="text-xs font-medium text-[#FF2454]">
                  Refund queue
                </span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Pending Refunds</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {pendingRefunds}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Requests awaiting review
              </p>
            </div>
          </div>

          {/* Plans overview */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold text-[#10265F]">Subscription Plans</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Configure plan pricing and availability.
                </p>
              </div>
              <button
                onClick={openCreatePlan}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#10265F] hover:bg-slate-50"
              >
                <Plus size={16} />
                Add Plan
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border p-5 ${
                    index === 1
                      ? "border-[#FF2454]/30 bg-pink-50/30"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {index === 1 && (
                    <span className="absolute right-4 top-4 rounded-full bg-pink-100 px-2 py-1 text-[10px] font-bold text-[#FF2454]">
                      POPULAR
                    </span>
                  )}

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#10265F]">
                    {plan.audience === "Institutes" ? (
                      <ShieldCheck size={21} />
                    ) : (
                      <Users size={21} />
                    )}
                  </div>

                  <h3 className="mt-4 font-bold text-[#10265F]">{plan.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{plan.audience}</p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#10265F]">
                      {money(plan.price)}
                    </span>
                    <span className="text-xs text-slate-400">
                      / {plan.duration}
                    </span>
                  </div>

                  <p className="mt-3 min-h-10 text-xs leading-5 text-slate-500">
                    {plan.features}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-lg font-bold text-[#10265F]">
                        {plan.subscribers}
                      </p>
                      <p className="text-xs text-slate-400">Subscribers</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        plan.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {plan.status}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => openEditPlan(plan)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-[#10265F] hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <button
                      onClick={() => togglePlanStatus(plan)}
                      title={
                        plan.status === "Active"
                          ? "Deactivate plan"
                          : "Activate plan"
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-500 hover:bg-slate-50"
                    >
                      {plan.status === "Active" ? (
                        <Ban size={16} />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payments / refunds / plans tabs */}
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:px-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Payments", icon: CreditCard },
                  { name: "Refunds", icon: RefreshCw },
                  { name: "Plans", icon: ShieldCheck },
                ].map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    onClick={() => {
                      setActiveTab(name);
                      resetFilters();
                    }}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      activeTab === name
                        ? "bg-[#10265F] text-white"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <Icon size={16} />
                    {name}
                  </button>
                ))}
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
            <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/60 p-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Search ${activeTab.toLowerCase()}...`}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#10265F] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {activeTab !== "Plans" && (
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-600 outline-none focus:border-[#10265F]"
                  >
                    <option>All Status</option>
                    {activeTab === "Payments" ? (
                      <>
                        <option>Success</option>
                        <option>Pending</option>
                        <option>Failed</option>
                        <option>Refunded</option>
                      </>
                    ) : (
                      <>
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                      </>
                    )}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              )}

              {activeTab === "Payments" && (
                <div className="relative">
                  <select
                    value={planFilter}
                    onChange={(event) => setPlanFilter(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-600 outline-none focus:border-[#10265F]"
                  >
                    <option>All Plans</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.name}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              )}

              <button
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:col-span-2 xl:col-span-1"
              >
                <RefreshCw size={15} />
                Reset filters
              </button>
            </div>

            {/* Payments table */}
            {activeTab === "Payments" && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left">
                  <thead className="bg-white text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Transaction</th>
                      <th className="px-5 py-4 font-semibold">Customer</th>
                      <th className="px-5 py-4 font-semibold">Plan</th>
                      <th className="px-5 py-4 font-semibold">Amount</th>
                      <th className="px-5 py-4 font-semibold">Date / Method</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-[#10265F]">
                            {payment.id}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {payment.invoice}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-slate-700">
                            {payment.customer}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {payment.email}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700">
                            {payment.plan}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-[#10265F]">
                          {money(payment.amount)}
                        </td>
                        <td className="px-5 py-4">
                          <p className="flex items-center gap-1.5 text-sm text-slate-600">
                            <CalendarDays
                              size={14}
                              className="text-slate-400"
                            />
                            {payment.date}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {payment.method}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <PaymentStatus status={payment.status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              title="View payment"
                              onClick={() =>
                                setShowDetails({
                                  ...payment,
                                  entityType: "payment",
                                })
                              }
                              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              title="Mark refunded (demo)"
                              disabled={
                                payment.status === "Refunded" ||
                                payment.status !== "Success"
                              }
                              onClick={() => markPaymentRefunded(payment)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-pink-50 hover:text-[#FF2454] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <RefreshCw size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Refunds table */}
            {activeTab === "Refunds" && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-white text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Refund ID</th>
                      <th className="px-5 py-4 font-semibold">Customer</th>
                      <th className="px-5 py-4 font-semibold">Payment ID</th>
                      <th className="px-5 py-4 font-semibold">Amount</th>
                      <th className="px-5 py-4 font-semibold">Reason</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRefunds.map((refund) => (
                      <tr
                        key={refund.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4 text-sm font-semibold text-[#10265F]">
                          {refund.id}
                          <p className="mt-1 text-xs font-normal text-slate-400">
                            {refund.date}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-slate-700">
                          {refund.customer}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-500">
                          {refund.paymentId}
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-[#10265F]">
                          {money(refund.amount)}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-500">
                          {refund.reason}
                        </td>
                        <td className="px-5 py-4">
                          <PaymentStatus status={refund.status} />
                        </td>
                        <td className="px-5 py-4">
                          {refund.status === "Pending" ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  updateRefund(refund, "Approved")
                                }
                                className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  updateRefund(refund, "Rejected")
                                }
                                className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="text-right">
                              <button
                                onClick={() =>
                                  setShowDetails({
                                    ...refund,
                                    entityType: "refund",
                                  })
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                              >
                                <Eye size={17} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Plans table */}
            {activeTab === "Plans" && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead className="bg-white text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Plan</th>
                      <th className="px-5 py-4 font-semibold">Audience</th>
                      <th className="px-5 py-4 font-semibold">Price</th>
                      <th className="px-5 py-4 font-semibold">Duration</th>
                      <th className="px-5 py-4 font-semibold">Subscribers</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPlans.map((plan) => (
                      <tr
                        key={plan.id}
                        className="hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4 text-sm font-semibold text-[#10265F]">
                          {plan.name}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {plan.audience}
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-[#10265F]">
                          {money(plan.price)}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {plan.duration}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {plan.subscribers}
                        </td>
                        <td className="px-5 py-4">
                          <PaymentStatus status={plan.status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditPlan(plan)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-[#10265F]"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => togglePlanStatus(plan)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                            >
                              {plan.status === "Active" ? (
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

            {((activeTab === "Payments" && filteredPayments.length === 0) ||
              (activeTab === "Refunds" && filteredRefunds.length === 0) ||
              (activeTab === "Plans" && filteredPlans.length === 0)) && (
              <div className="px-6 py-16 text-center">
                <CreditCard
                  className="mx-auto text-slate-300"
                  size={30}
                />
                <h3 className="mt-4 font-semibold text-[#10265F]">
                  No records found
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
                {activeTab === "Payments"
                  ? `${filteredPayments.length} payment records`
                  : activeTab === "Refunds"
                    ? `${filteredRefunds.length} refund requests`
                    : `${filteredPlans.length} subscription plans`}
              </span>
              <span>Equilx Billing Management · Demo data</span>
            </div>
          </section>
        </main>
      </div>

      {/* Create/edit plan modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#10265F]">
                  {editingPlanId
                    ? "Edit Subscription Plan"
                    : "Create Subscription Plan"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Configure pricing and included features.
                </p>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={savePlan} className="space-y-4 p-5 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Plan Name *
                </label>
                <input
                  required
                  value={planForm.name}
                  onChange={(event) =>
                    setPlanForm({ ...planForm, name: event.target.value })
                  }
                  placeholder="e.g. Student Pro"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Audience
                  </label>
                  <select
                    value={planForm.audience}
                    onChange={(event) =>
                      setPlanForm({
                        ...planForm,
                        audience: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                  >
                    <option>Individual students</option>
                    <option>Institutes</option>
                    <option>Teachers</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Price (INR) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={planForm.price}
                    onChange={(event) =>
                      setPlanForm({ ...planForm, price: event.target.value })
                    }
                    placeholder="999"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Billing Duration
                  </label>
                  <select
                    value={planForm.duration}
                    onChange={(event) =>
                      setPlanForm({
                        ...planForm,
                        duration: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                  >
                    <option>Forever</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>6 Months</option>
                    <option>12 Months</option>
                    <option>Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Subscribers
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={planForm.subscribers}
                    onChange={(event) =>
                      setPlanForm({
                        ...planForm,
                        subscribers: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Included Features
                  </label>
                  <textarea
                    rows={3}
                    value={planForm.features}
                    onChange={(event) =>
                      setPlanForm({
                        ...planForm,
                        features: event.target.value,
                      })
                    }
                    placeholder="Describe the features included in this plan..."
                    className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Plan Status
                  </label>
                  <select
                    value={planForm.status}
                    onChange={(event) =>
                      setPlanForm({ ...planForm, status: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FF2454] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e91d49]"
                >
                  {editingPlanId ? "Save Changes" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction / refund detail modal */}
      {showDetails && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-[#10265F]">
                {showDetails.entityType === "refund"
                  ? "Refund Details"
                  : "Payment Details"}
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
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#10265F]">
                {showDetails.entityType === "refund" ? (
                  <RefreshCw size={25} />
                ) : (
                  <Receipt size={25} />
                )}
              </div>

              <h3 className="mt-4 text-xl font-bold text-[#10265F]">
                {showDetails.id}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {showDetails.customer}
              </p>

              <div className="mt-5 space-y-3">
                {Object.entries(showDetails)
                  .filter(
                    ([key, value]) =>
                      !["entityType", "id"].includes(key) &&
                      value !== undefined &&
                      value !== null &&
                      typeof value !== "object"
                  )
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 p-3"
                    >
                      <span className="text-sm capitalize text-slate-500">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="max-w-[60%] break-words text-right text-sm font-semibold text-[#10265F]">
                        {key === "amount" ? money(value) : String(value)}
                      </span>
                    </div>
                  ))}
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                This is a demo record. Actual payment and refund operations
                require verified payment-provider integration and server-side
                authorization.
              </p>

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