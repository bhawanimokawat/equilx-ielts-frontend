
import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar";
import {
  CreditCard,
  Users,
  CalendarDays,
  Download,
  Check,
  Zap,
  Crown,
  Building2,
  Receipt,
  Clock,
  X,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const initialInvoices = [
  {
    id: "INV-2026-104",
    date: "Oct 15, 2026",
    description: "Pro Plan - Monthly Subscription",
    amount: 4999,
    status: "Paid",
  },
  {
    id: "INV-2026-089",
    date: "Sep 15, 2026",
    description: "Pro Plan - Monthly Subscription",
    amount: 4999,
    status: "Paid",
  },
  {
    id: "INV-2026-072",
    date: "Aug 15, 2026",
    description: "Pro Plan - Monthly Subscription",
    amount: 4999,
    status: "Paid",
  },
  {
    id: "INV-2026-061",
    date: "Jul 15, 2026",
    description: "Pro Plan - Monthly Subscription",
    amount: 4999,
    status: "Pending",
  },
];

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Explore the platform with essential tools.",
    icon: Zap,
    seats: 10,
    features: [
      "Up to 10 students",
      "Basic student management",
      "Limited study resources",
      "Basic performance reports",
      "Email support",
    ],
  },
  {
    name: "Paid",
    price: 2499,
    period: "/ month",
    description: "For growing IELTS training institutes.",
    icon: Building2,
    seats: 50,
    features: [
      "Up to 50 students",
      "Student and batch management",
      "Study resources management",
      "Detailed performance reports",
      "Standard support",
    ],
  },
  {
    name: "Pro",
    price: 4999,
    period: "/ month",
    description: "Advanced tools for established institutes.",
    icon: Crown,
    seats: 200,
    features: [
      "Up to 200 students",
      "Complete student management",
      "Advanced reports and analytics",
      "Trainer workload tracking",
      "Priority support",
    ],
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function StatCard({ title, value, note, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    pink: "bg-rose-50 text-rose-500",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-[#3B3441] bg-white dark:bg-[#211E27] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-[#B0A5BD]">{title}</p>
          <h2 className="mt-2 text-2xl font-extrabold text-[#10265F] dark:text-[#E8E2EF]">
            {value}
          </h2>
          <p className="mt-2 text-xs text-slate-400 dark:text-[#91899B]">{note}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function PlanCard({ plan, currentPlan, onSelect }) {
  const Icon = plan.icon;
  const isCurrent = currentPlan === plan.name;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white dark:bg-[#211E27] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
        plan.name === "Pro"
          ? "border-[#FF4778] ring-1 ring-[#FF4778]/20"
          : "border-slate-100 dark:border-[#3B3441]"
      }`}
    >
      {plan.name === "Pro" && (
        <span className="absolute right-4 top-4 rounded-full bg-rose-50 dark:bg-rose-950/40 px-3 py-1 text-[10px] font-bold text-[#FF2454]">
          POPULAR
        </span>
      )}

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
          plan.name === "Pro"
            ? "bg-rose-50 text-[#FF2454]"
            : plan.name === "Paid"
              ? "bg-purple-50 text-purple-600"
              : "bg-blue-50 text-blue-600"
        }`}
      >
        <Icon size={24} />
      </div>

      <h3 className="mt-4 text-xl font-extrabold text-[#10265F] dark:text-[#E8E2EF]">
        {plan.name}
      </h3>
      <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500 dark:text-[#B0A5BD]">
        {plan.description}
      </p>

      <div className="mt-5 flex items-end gap-1">
        <span className="text-3xl font-extrabold text-[#10265F] dark:text-[#E8E2EF]">
          {formatCurrency(plan.price)}
        </span>
        <span className="pb-1 text-xs text-slate-400 dark:text-[#91899B]">
          {plan.period}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-[#19171E] p-3">
        <Users size={17} className="text-[#FF4778]" />
        <span className="text-sm font-semibold text-[#10265F] dark:text-[#E8E2EF]">
          Up to {plan.seats} students
        </span>
      </div>

      <div className="my-5 h-px bg-slate-100 dark:bg-[#3B3441]" />

      <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#91899B]">
        What's included
      </p>

      <ul className="flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-xs text-slate-600 dark:text-[#B0A5BD]"
          >
            <Check size={15} className="mt-0.5 shrink-0 text-emerald-500" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        type="button"
        disabled={isCurrent}
        onClick={() => onSelect(plan)}
        className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold transition ${
          isCurrent
            ? "cursor-default border border-emerald-200 bg-emerald-50 text-emerald-600"
            : plan.name === "Pro"
              ? "bg-[#FF2454] text-white hover:bg-rose-600"
              : "border border-slate-200 dark:border-[#3B3441] text-[#10265F] dark:text-[#E8E2EF] hover:bg-slate-50 dark:hover:bg-[#302B36]"
        }`}
      >
        {isCurrent ? "Current Plan" : plan.price === 0 ? "Switch to Free" : "Choose Plan"}
      </button>
    </div>
  );
}

function PlanModal({ plan, onClose, onConfirm }) {
  if (!plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10265F]/40 dark:bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 dark:border-[#3B3441] bg-white dark:bg-[#211E27] p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#10265F] dark:text-[#E8E2EF]">
              Change Subscription
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
              Review your selected plan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 dark:text-[#B0A5BD] hover:bg-slate-100 dark:hover:bg-[#302B36]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-slate-100 dark:border-[#3B3441] bg-slate-50 dark:bg-[#19171E] p-4">
          <p className="text-sm font-semibold text-[#10265F] dark:text-[#E8E2EF]">
            {plan.name} Plan
          </p>
          <p className="mt-2 text-2xl font-extrabold text-[#10265F] dark:text-[#E8E2EF]">
            {formatCurrency(plan.price)}
            <span className="ml-1 text-xs font-normal text-slate-400 dark:text-[#91899B]">
              {plan.period}
            </span>
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-[#B0A5BD]">
            Student capacity: up to {plan.seats} students
          </p>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-[#B0A5BD]">
          This is a frontend demo. Confirming updates the displayed plan only;
          it does not charge your payment method or change a real subscription.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 dark:border-[#3B3441] py-3 text-sm font-semibold text-slate-600 dark:text-[#B0A5BD] hover:bg-slate-50 dark:hover:bg-[#302B36]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(plan)}
            className="flex-1 rounded-xl bg-[#FF2454] py-3 text-sm font-semibold text-white hover:bg-rose-600"
          >
            Confirm Plan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlanBilling() {
  const [currentPlan, setCurrentPlan] = useState("Pro");
  const [planModal, setPlanModal] = useState(null);
  const [notice, setNotice] = useState("");
  const [invoices, setInvoices] = useState(initialInvoices);
  const [invoiceFilter, setInvoiceFilter] = useState("All");
  const [autoRenew, setAutoRenew] = useState(true);

  const activePlan = plans.find((plan) => plan.name === currentPlan) || plans[2];
  const usedSeats = 124;

  const seatPercentage = Math.min(
    100,
    Math.round((usedSeats / activePlan.seats) * 100)
  );

  const filteredInvoices = invoices.filter(
    (invoice) => invoiceFilter === "All" || invoice.status === invoiceFilter
  );

  const exportInvoice = (invoice) => {
    const csv = [
      ["Invoice ID", "Date", "Description", "Amount (INR)", "Status"],
      [invoice.id, invoice.date, invoice.description, invoice.amount, invoice.status],
    ]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.id}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAllInvoices = () => {
    const headers = ["Invoice ID", "Date", "Description", "Amount (INR)", "Status"];

    const rows = filteredInvoices.map((invoice) => [
      invoice.id,
      invoice.date,
      invoice.description,
      invoice.amount,
      invoice.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "equilx-invoices.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const confirmPlan = (plan) => {
    setCurrentPlan(plan.name);
    setPlanModal(null);
    setNotice(`Displayed subscription plan changed to ${plan.name}. No payment was processed.`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] transition-colors duration-300 dark:bg-[#17151B]">
  <Sidebar />

  <div className="ml-[260px] flex min-h-screen min-w-0 flex-col">
    <Navbar />

        <main className="min-w-0 flex-1 space-y-6 overflow-x-hidden p-4 md:p-6">
          {/* Heading */}
          <section className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#6B7FA8] dark:text-[#B0A5BD]">
                Institute <span className="mx-1">›</span> Plan & Billing
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#10265F] dark:text-[#E8E2EF]">
                Plan & <span className="text-[#FF2454]">Billing</span>
              </h1>
              <p className="mt-2 text-sm text-[#7183A7] dark:text-[#B0A5BD]">
                Manage your subscription, student seats, invoices and renewals.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Subscription Active
                </p>
                <p className="mt-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                  Demo account status
                </p>
              </div>
            </div>
          </section>

          {notice && (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
              <p>{notice}</p>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss notification"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Summary */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Current Plan"
              value={currentPlan}
              note="Your selected subscription"
              icon={Crown}
              color="purple"
            />
            <StatCard
              title="Monthly Billing"
              value={formatCurrency(activePlan.price)}
              note={activePlan.price === 0 ? "Free plan" : "Indicative demo amount"}
              icon={CreditCard}
              color="pink"
            />
            <StatCard
              title="Student Seats"
              value={`${usedSeats}/${activePlan.seats}`}
              note="Demo usage figures"
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Next Renewal"
              value="Nov 15, 2026"
              note="Demo renewal date"
              icon={CalendarDays}
              color="green"
            />
          </section>

          {/* Current subscription */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl bg-[#10265F] p-6 text-white shadow-sm xl:col-span-2">
              <div className="pointer-events-none absolute -right-10 -top-14 h-56 w-56 rounded-full border-[35px] border-white/5" />
              <div className="pointer-events-none absolute -bottom-20 right-40 h-48 w-48 rounded-full bg-[#FF4778]/10 blur-2xl" />

              <div className="relative">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Crown size={20} className="text-[#FF7897]" />
                      <span className="text-sm font-semibold text-blue-100">
                        Current Subscription
                      </span>
                    </div>
                    <h2 className="mt-3 text-3xl font-extrabold">{currentPlan} Plan</h2>
                    <p className="mt-2 text-sm text-blue-100">
                      {activePlan.description}
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                    Active
                  </span>
                </div>

                <div className="mt-7 flex flex-wrap items-end gap-2">
                  <span className="text-4xl font-extrabold">
                    {formatCurrency(activePlan.price)}
                  </span>
                  <span className="pb-1 text-sm text-blue-200">{activePlan.period}</span>
                </div>

                <div className="mt-7 max-w-xl">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-blue-100">Student seat usage</span>
                    <span className="font-bold">
                      {usedSeats} / {activePlan.seats}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-[#FF4778] transition-all"
                      style={{ width: `${seatPercentage}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-blue-200">
                    {usedSeats > activePlan.seats
                      ? `Capacity exceeded by ${usedSeats - activePlan.seats} seats in this demo.`
                      : `${activePlan.seats - usedSeats} student seats available.`}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNotice("");
                      setPlanModal(plans.find((plan) => plan.name !== currentPlan));
                    }}
                    className="flex items-center gap-2 rounded-xl bg-[#FF4778] px-4 py-3 text-sm font-semibold text-white hover:bg-rose-500"
                  >
                    <ArrowUpRight size={17} />
                    Change Plan
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNotice("Renewal date and billing settings are demo-only. Connect the billing API to manage real renewals.");
                    }}
                    className="rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Manage Renewal
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 dark:border-[#3B3441] bg-white dark:bg-[#211E27] p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CalendarDays size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-[#10265F] dark:text-[#E8E2EF]">
                    Billing Settings
                  </h2>
                  <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                    Manage renewal preferences
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 dark:bg-[#19171E] p-4">
                <p className="text-xs text-slate-400 dark:text-[#91899B]">
                  Next billing date
                </p>
                <p className="mt-2 text-lg font-extrabold text-[#10265F] dark:text-[#E8E2EF]">
                  15 November 2026
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#B0A5BD]">
                  Expected amount: {formatCurrency(activePlan.price)}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#10265F] dark:text-[#E8E2EF]">
                    Auto-renewal
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                    Demo preference only
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={autoRenew}
                  onClick={() => {
                    setAutoRenew((previous) => !previous);
                    setNotice(`Auto-renewal display preference turned ${autoRenew ? "off" : "on"}. No real billing setting changed.`);
                  }}
                  className={`relative h-6 w-11 rounded-full transition ${
                    autoRenew ? "bg-emerald-500" : "bg-slate-300 dark:bg-[#62596B]"
                  }`}
                  aria-label="Toggle auto-renewal"
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      autoRenew ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber-100 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/25 p-3">
                <AlertCircle size={17} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-xs leading-5 text-amber-700 dark:text-amber-300">
                  Real payment processing and automatic renewals require a connected billing provider.
                </p>
              </div>
            </div>
          </section>

          {/* Available plans */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-extrabold text-[#10265F] dark:text-[#E8E2EF]">
                Available Plans
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-[#B0A5BD]">
                Compare the available subscription tiers for your institute.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.name}
                  plan={plan}
                  currentPlan={currentPlan}
                  onSelect={setPlanModal}
                />
              ))}
            </div>
          </section>

          {/* Invoices */}
          <section className="rounded-2xl border border-slate-100 dark:border-[#3B3441] bg-white dark:bg-[#211E27] p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#10265F] dark:text-[#E8E2EF]">
                  Billing History
                </h2>
                <p className="mt-1 text-xs text-slate-400 dark:text-[#91899B]">
                  Review your previous invoices and payment records.
                </p>
              </div>

              <button
                type="button"
                onClick={exportAllInvoices}
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-[#3B3441] px-3 py-2.5 text-xs font-semibold text-[#10265F] dark:text-[#E8E2EF] hover:bg-slate-50 dark:hover:bg-[#302B36]"
              >
                <Download size={15} />
                Export Invoices
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["All", "Paid", "Pending"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setInvoiceFilter(filter)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    invoiceFilter === filter
                      ? "bg-[#10265F] text-white"
                      : "border border-slate-200 dark:border-[#3B3441] text-slate-500 dark:text-[#B0A5BD] hover:bg-slate-50 dark:hover:bg-[#302B36]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#19171E] text-[11px] text-slate-500 dark:text-[#B0A5BD]">
                    {["Invoice", "Date", "Description", "Amount", "Status", "Action"].map((heading) => (
                      <th key={heading} className="px-4 py-3 font-semibold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-slate-100 dark:border-[#3B3441] text-xs hover:bg-slate-50/70 dark:hover:bg-[#302B36]"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Receipt size={17} />
                          </div>
                          <span className="font-bold text-[#10265F] dark:text-[#E8E2EF]">
                            {invoice.id}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-slate-500 dark:text-[#B0A5BD]">
                        {invoice.date}
                      </td>

                      <td className="px-4 py-4 text-slate-600 dark:text-[#B0A5BD]">
                        {invoice.description}
                      </td>

                      <td className="px-4 py-4 font-bold text-[#10265F] dark:text-[#E8E2EF]">
                        {formatCurrency(invoice.amount)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${
                            invoice.status === "Paid"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {invoice.status === "Paid" ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {invoice.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => exportInvoice(invoice)}
                          title="Export invoice details as CSV"
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-[#252D3D]"
                        >
                          <Download size={14} />
                          Export
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-10 text-center text-sm text-slate-400 dark:text-[#91899B]"
                      >
                        No invoices found for this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-[#3B3441] pt-4">
              <p className="text-xs text-slate-400 dark:text-[#91899B]">
                Showing {filteredInvoices.length} of {invoices.length} invoices
              </p>
              <p className="text-xs font-semibold text-[#10265F] dark:text-[#E8E2EF]">
                Total listed:{" "}
                {formatCurrency(
                  filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)
                )}
              </p>
            </div>
          </section>

          <footer className="pb-2 text-center text-xs text-slate-400 dark:text-[#91899B]">
            Equilx IELTS · Institute Admin Portal
          </footer>
        </main>
      </div>

      {planModal && (
        <PlanModal
          plan={planModal}
          onClose={() => setPlanModal(null)}
          onConfirm={confirmPlan}
        />
      )}
    </div>
  );
}
