import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Users,
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  X,
  CheckCircle2,
  Clock3,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  Receipt,
  CalendarDays,
  Wallet,
  ShieldCheck,
  Ban,
  Loader2,
  RotateCcw,
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import {
  listAdminPlans,
  getAdminPlanById,
  createPlan,
  updatePlan,
  updatePlanStatus,
  createPlanVersion,
  getPaymentHistory,
  getPaymentById,
  createRefund,
} from "../../services/super-admin/billing.service.js";

const PLAN_CODES = ["FREE", "STUDENT_PRO", "INSTITUTE_6_MONTH", "INSTITUTE_12_MONTH"];
const EMPTY_PLAN = {
  code: "STUDENT_PRO",
  name: "",
  ownerType: "INDIVIDUAL",
  description: "",
  price: "",
  durationMonths: "1",
  isLifetime: false,
  gstRate: "18",
  currency: "INR",
};

const money = (value, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0) || 0);

const unwrap = (response) => response?.data?.data ?? response?.data ?? response;
const asArray = (value) => (Array.isArray(value) ? value : value?.plans ?? value?.payments ?? value?.history ?? value?.refunds ?? value?.items ?? value?.results ?? value?.records ?? []);
const dateLabel = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
const humanize = (value = "") =>
  String(value).toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

function normalizePlan(raw) {
  const version = raw?.versions?.[0] ?? raw?.currentVersion ?? raw?.version ?? {};
  return {
    id: raw.id,
    code: raw.code,
    name: raw.name ?? raw.code ?? "Unnamed plan",
    ownerType: raw.ownerType ?? "INDIVIDUAL",
    audience: raw.ownerType === "INSTITUTE" ? "Institutes" : "Individual students",
    description: raw.description ?? "",
    price: Number(version.priceInclGst ?? version.price ?? 0),
    currency: version.currency ?? "INR",
    durationMonths: version.durationMonths ?? null,
    isLifetime: Boolean(version.isLifetime),
    gstRate: Number(version.gstRate ?? 18),
    versionId: version.id,
    versionNumber: version.version ?? 1,
    subscribers: Number(raw._count?.subscriptions ?? raw.subscriberCount ?? 0),
    status: raw.isActive ? "Active" : "Inactive",
  };
}

function normalizePayment(raw) {
  const subscription = raw.subscription ?? {};
  const plan = subscription.plan ?? raw.plan ?? {};
  const user = raw.user ?? raw.customer ?? subscription.user ?? {};
  const institute = raw.institute ?? subscription.institute ?? {};
  const amount = raw.amount ?? raw.amountInclGst ?? raw.priceInclGst ?? raw.totalAmount ?? 0;
  const rawStatus = String(raw.status ?? "UNKNOWN").toUpperCase();
  const statusMap = {
    CAPTURED: "Success",
    SUCCESS: "Success",
    PAID: "Success",
    ORDER_PAID: "Success",
    CREATED: "Pending",
    PENDING: "Pending",
    PENDING_PAYMENT: "Pending",
    FAILED: "Failed",
    EXPIRED: "Failed",
    REFUNDED: "Refunded",
    PARTIALLY_REFUNDED: "Partially refunded",
  };
  return {
    id: raw.id ?? raw.paymentId ?? raw.razorpayPaymentId ?? "—",
    reference: raw.razorpayOrderId ?? raw.orderId ?? raw.transactionId ?? raw.id ?? "—",
    customer: institute.name ?? user.name ?? user.fullName ?? raw.customerName ?? "—",
    email: user.email ?? raw.email ?? "—",
    plan: plan.name ?? plan.code ?? subscription.planName ?? "—",
    amount: Number(amount) || 0,
    currency: raw.currency ?? subscription.currency ?? "INR",
    date: raw.paidAt ?? raw.createdAt ?? raw.updatedAt,
    method: raw.method ?? raw.paymentMethod ?? raw.razorpayMethod ?? "—",
    status: statusMap[rawStatus] ?? humanize(raw.status ?? "Unknown"),
    rawStatus,
    invoiceId: raw.invoice?.id ?? raw.invoiceId ?? null,
    reason: raw.failureReason ?? raw.description ?? "",
    raw,
  };
}

function StatusPill({ status }) {
  const normalized = String(status ?? "").toLowerCase();
  const tone =
    ["success", "approved", "active", "captured", "processed"].includes(normalized)
      ? "bg-emerald-50 text-emerald-700"
      : ["failed", "rejected", "inactive", "expired"].includes(normalized)
        ? "bg-red-50 text-red-700"
        : ["refunded", "partially refunded"].includes(normalized)
          ? "bg-blue-50 text-blue-700"
          : "bg-amber-50 text-amber-700";
  const Icon = ["success", "approved", "active", "captured", "processed"].includes(normalized)
    ? CheckCircle2
    : ["failed", "rejected", "inactive", "expired"].includes(normalized)
      ? AlertCircle
      : Clock3;
  return (
    <span className={`inline-flex whitespace-nowrap items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${tone}`}>
      <Icon size={13} /> {status || "Unknown"}
    </span>
  );
}

function LoadingState({ label = "Loading records…" }) {
  return (
    <div className="flex items-center justify-center gap-2 px-5 py-14 text-sm text-slate-500">
      <Loader2 size={18} className="animate-spin" /> {label}
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="px-6 py-14 text-center">
      <CreditCard className="mx-auto text-slate-300" size={30} />
      <h3 className="mt-4 font-semibold text-[#10265F]">No records found</h3>
      <p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>
      <button onClick={onReset} className="mt-4 text-sm font-semibold text-[#FF2454] hover:underline">
        Clear filters
      </button>
    </div>
  );
}

export default function PlansPaymentsRefunds() {
  const [activeTab, setActiveTab] = useState("Payments");
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState(EMPTY_PLAN);
  const [showDetails, setShowDetails] = useState(null);
  const [refundTarget, setRefundTarget] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4500);
  };

  const loadPlans = useCallback(async () => {
    setLoadingPlans(true);
    try {
      const result = unwrap(await listAdminPlans());
      setPlans(asArray(result).map(normalizePlan));
    } catch (error) {
      setPageError(error?.response?.data?.message || error.message || "Unable to load plans.");
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  const loadPayments = useCallback(async () => {
    setLoadingPayments(true);
    try {
      const result = unwrap(await getPaymentHistory());
      const rows = asArray(result?.payments ?? result?.history ?? result);
      const normalized = rows.map(normalizePayment);
      setPayments(normalized);
      // Refund rows are displayed only when the API actually returns refund data.
      const refundRows = rows.flatMap((payment) => {
        const related = payment.refunds ?? payment.refundRequests ?? (payment.refund ? [payment.refund] : []);
        return (Array.isArray(related) ? related : []).map((refund) => ({
          id: refund.id ?? refund.providerRefundId ?? "—",
          customer: payment.institute?.name ?? payment.user?.name ?? payment.customer?.name ?? "—",
          paymentId: payment.id ?? payment.paymentId ?? "—",
          amount: Number(refund.amount ?? payment.amount ?? 0),
          reason: refund.reason ?? refund.notes?.reason ?? "—",
          date: refund.createdAt,
          status: humanize(refund.status ?? "Pending"),
          raw: refund,
        }));
      });
      setRefunds(refundRows);
    } catch (error) {
      setPageError(error?.response?.data?.message || error.message || "Unable to load payment history.");
    } finally {
      setLoadingPayments(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    setPageError("");
    await Promise.all([loadPlans(), loadPayments()]);
    setRefreshing(false);
  }, [loadPlans, loadPayments]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const successfulPayments = payments.filter((payment) => payment.status === "Success");
  const totalRevenue = successfulPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingPayments = payments.filter((payment) => payment.status === "Pending").length;
  const pendingRefunds = refunds.filter((refund) => refund.status.toLowerCase() === "pending").length;

  const filteredPayments = useMemo(() => {
    const term = search.toLowerCase().trim();
    return payments.filter((payment) => {
      const matchesSearch = [payment.id, payment.reference, payment.customer, payment.email, payment.plan]
        .some((value) => String(value ?? "").toLowerCase().includes(term));
      return matchesSearch && (statusFilter === "All Status" || payment.status === statusFilter) &&
        (planFilter === "All Plans" || payment.plan === planFilter);
    });
  }, [payments, search, statusFilter, planFilter]);

  const filteredRefunds = useMemo(() => {
    const term = search.toLowerCase().trim();
    return refunds.filter((refund) => [refund.id, refund.customer, refund.paymentId, refund.reason]
      .some((value) => String(value ?? "").toLowerCase().includes(term)) &&
      (statusFilter === "All Status" || refund.status === statusFilter));
  }, [refunds, search, statusFilter]);

  const filteredPlans = useMemo(() => {
    const term = search.toLowerCase().trim();
    return plans.filter((plan) => [plan.name, plan.code, plan.audience, plan.description]
      .some((value) => String(value ?? "").toLowerCase().includes(term)));
  }, [plans, search]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setPlanFilter("All Plans");
  };

  const openCreatePlan = () => {
    setEditingPlanId(null);
    setPlanForm(EMPTY_PLAN);
    setShowPlanModal(true);
  };

  const openEditPlan = async (plan) => {
    setSaving(true);
    try {
      const result = unwrap(await getAdminPlanById(plan.id));
      const fresh = normalizePlan(result?.plan ?? result);
      setEditingPlanId(plan.id);
      setPlanForm({
        code: fresh.code,
        name: fresh.name,
        ownerType: fresh.ownerType,
        description: fresh.description,
        price: String(fresh.price),
        durationMonths: fresh.durationMonths == null ? "" : String(fresh.durationMonths),
        isLifetime: fresh.isLifetime,
        gstRate: String(fresh.gstRate),
        currency: fresh.currency || "INR",
      });
      setShowPlanModal(true);
    } catch (error) {
      notify(error?.response?.data?.message || error.message || "Unable to load plan details.");
    } finally {
      setSaving(false);
    }
  };

  const savePlan = async (event) => {
    event.preventDefault();
    if (saving) return;
    const price = Number(planForm.price);
    if (!Number.isFinite(price) || price < 0) return notify("Enter a valid plan price.");
    const versionPayload = {
      priceInclGst: price,
      currency: planForm.currency || "INR",
      gstRate: Number(planForm.gstRate || 18),
      durationMonths: planForm.isLifetime || planForm.durationMonths === "" ? null : Number(planForm.durationMonths),
      isLifetime: Boolean(planForm.isLifetime),
    };
    setSaving(true);
    try {
      if (!editingPlanId) {
        await createPlan({
          code: planForm.code,
          name: planForm.name.trim(),
          ownerType: planForm.ownerType,
          description: planForm.description.trim() || null,
          version: versionPayload,
        });
        notify("Plan created successfully.");
      } else {
        const existing = plans.find((item) => item.id === editingPlanId);
        const metadataChanged = existing && (existing.name !== planForm.name.trim() || existing.description !== planForm.description.trim());
        const pricingChanged = existing && (Number(existing.price) !== price || Number(existing.durationMonths ?? 0) !== Number(versionPayload.durationMonths ?? 0) || existing.isLifetime !== versionPayload.isLifetime || Number(existing.gstRate) !== versionPayload.gstRate);
        if (metadataChanged) {
          await updatePlan(editingPlanId, {
            name: planForm.name.trim(),
            description: planForm.description.trim() || null,
          });
        }
        if (pricingChanged) await createPlanVersion(editingPlanId, versionPayload);
        if (!metadataChanged && !pricingChanged) notify("No changes to save.");
        else notify("Plan updated. Pricing changes were saved as a new immutable version.");
      }
      setShowPlanModal(false);
      await loadPlans();
    } catch (error) {
      notify(error?.response?.data?.message || error.message || "Unable to save plan.");
    } finally {
      setSaving(false);
    }
  };

  const togglePlanStatus = async (plan) => {
    if (saving) return;
    setSaving(true);
    try {
      await updatePlanStatus(plan.id, plan.status !== "Active");
      notify(`${plan.name} is now ${plan.status === "Active" ? "inactive" : "active"}.`);
      await loadPlans();
    } catch (error) {
      notify(error?.response?.data?.message || error.message || "Unable to update plan status.");
    } finally {
      setSaving(false);
    }
  };

  const openPaymentDetails = async (payment) => {
    setShowDetails({ ...payment, entityType: "payment", loading: true });
    try {
      const result = unwrap(await getPaymentById(payment.id));
      const raw = result?.payment ?? result;
      setShowDetails({ ...normalizePayment(raw), ...raw, entityType: "payment", amount: Number(raw.amount ?? raw.amountInclGst ?? payment.amount) });
    } catch {
      setShowDetails({ ...payment, entityType: "payment", loading: false });
    }
  };

  const submitRefund = async (event) => {
    event.preventDefault();
    if (!refundTarget || !refundReason.trim() || saving) return;
    setSaving(true);
    try {
      await createRefund(refundTarget.raw.id ?? refundTarget.id, { reason: refundReason.trim() });
      setRefundTarget(null);
      setRefundReason("");
      notify("Refund request submitted successfully.");
      await loadPayments();
    } catch (error) {
      notify(error?.response?.data?.message || error.message || "Unable to submit refund request.");
    } finally {
      setSaving(false);
    }
  };

  const exportCSV = () => {
    let rows = [];
    if (activeTab === "Plans") {
      rows = [["Plan", "Code", "Audience", "Price INR", "Duration months", "Subscribers", "Status"],
        ...filteredPlans.map((plan) => [plan.name, plan.code, plan.audience, plan.price, plan.durationMonths ?? "Lifetime", plan.subscribers, plan.status])];
    } else if (activeTab === "Refunds") {
      rows = [["Refund ID", "Customer", "Payment ID", "Amount", "Reason", "Status"],
        ...filteredRefunds.map((refund) => [refund.id, refund.customer, refund.paymentId, refund.amount, refund.reason, refund.status])];
    } else {
      rows = [["Payment ID", "Customer", "Email", "Plan", "Amount", "Date", "Method", "Status"],
        ...filteredPayments.map((payment) => [payment.id, payment.customer, payment.email, payment.plan, payment.amount, dateLabel(payment.date), payment.method, payment.status])];
    }
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeTab.toLowerCase()}-report.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const noRows = activeTab === "Payments" ? filteredPayments.length === 0 : activeTab === "Refunds" ? filteredRefunds.length === 0 : filteredPlans.length === 0;
  const tabLoading = activeTab === "Plans" ? loadingPlans : activeTab === "Payments" || activeTab === "Refunds" ? loadingPayments : false;

  return (
    <div className="plans-payments-refunds min-h-screen bg-[#F5F7FF] text-[#172554] transition-colors">
      <style>{`
        html.dark .plans-payments-refunds { background-color: #17151B !important; color: #fff !important; }
        html.dark .plans-payments-refunds .surface { background-color: #211E27 !important; border-color: #3B3441 !important; }
        html.dark .plans-payments-refunds input, html.dark .plans-payments-refunds select, html.dark .plans-payments-refunds textarea { background:#19171E !important; color:#fff !important; border-color:#3B3441 !important; }
        html.dark .plans-payments-refunds .ink { color:#fff !important; }
        html.dark .plans-payments-refunds .muted { color:#B0A5BD !important; }
        .plans-payments-refunds { min-width:0; }
        .plans-payments-refunds table { border-collapse:collapse; }
        @media (max-width: 767px) { .plans-payments-refunds .desktop-table { display:none; } }
        @media (min-width: 768px) { .plans-payments-refunds .mobile-records { display:none; } }
      `}</style>

      <Sidebar />
      <div className="min-h-screen min-w-0 md:ml-[260px]">
        <Navbar />
        <main className="mx-auto w-full max-w-[1600px] space-y-5 p-3 sm:space-y-6 sm:p-5 lg:p-8">
          <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500"><span>Super Admin</span><span>/</span><span className="text-[#FF2454]">Plans & Payments</span></div>
              <h1 className="break-words text-2xl font-bold tracking-tight text-[#10265F] sm:text-3xl ink">Plans, Payments & Refunds</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 muted">Manage subscription plans, monitor transactions and submit refund requests.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={refreshAll} disabled={refreshing} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 surface"><RefreshCw size={16} className={refreshing ? "animate-spin" : ""}/> Refresh</button>
              <button onClick={activeTab === "Plans" ? openCreatePlan : exportCSV} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e91d49]">
                {activeTab === "Plans" ? <Plus size={18}/> : <Download size={17}/>} {activeTab === "Plans" ? "Create New Plan" : "Export Report"}
              </button>
            </div>
          </div>

          {pageError && <div className="flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"><span>{pageError}</span><button onClick={() => { setPageError(""); refreshAll(); }} className="font-semibold underline">Retry</button></div>}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
            <div className="surface rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-center justify-between"><div className="rounded-xl bg-blue-50 p-3 text-blue-700"><Wallet size={21}/></div><span className="text-xs text-slate-400">Live API data</span></div><p className="mt-4 text-sm text-slate-500">Successful payment volume</p><h2 className="mt-1 break-words text-2xl font-bold text-[#10265F] sm:text-3xl ink">{money(totalRevenue)}</h2><p className="mt-2 text-xs text-slate-400">From loaded payment history</p></div>
            <div className="surface rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-center justify-between"><div className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><CreditCard size={21}/></div><span className="text-xs text-slate-400">Transactions</span></div><p className="mt-4 text-sm text-slate-500">Successful Payments</p><h2 className="mt-1 text-2xl font-bold text-[#10265F] sm:text-3xl ink">{successfulPayments.length}</h2><p className="mt-2 text-xs text-slate-400">Completed transactions returned by API</p></div>
            <div className="surface rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-center justify-between"><div className="rounded-xl bg-amber-50 p-3 text-amber-600"><Clock3 size={21}/></div><span className="text-xs font-medium text-amber-600">Requires attention</span></div><p className="mt-4 text-sm text-slate-500">Pending Payments</p><h2 className="mt-1 text-2xl font-bold text-[#10265F] sm:text-3xl ink">{pendingPayments}</h2><p className="mt-2 text-xs text-slate-400">Awaiting confirmation</p></div>
            <div className="surface rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-center justify-between"><div className="rounded-xl bg-pink-50 p-3 text-[#FF2454]"><RotateCcw size={21}/></div><span className="text-xs text-slate-400">Returned by API</span></div><p className="mt-4 text-sm text-slate-500">Refund Records</p><h2 className="mt-1 text-2xl font-bold text-[#10265F] sm:text-3xl ink">{refunds.length}</h2><p className="mt-2 text-xs text-slate-400">{pendingRefunds} pending in returned refund data</p></div>
          </div>

          <section className="surface rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div><h2 className="font-bold text-[#10265F] ink">Subscription Plans</h2><p className="mt-1 text-xs text-slate-500 muted">Configure plan pricing and availability. Pricing edits create a new plan version.</p></div>
              <button onClick={openCreatePlan} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#10265F] hover:bg-slate-50 sm:w-auto ink"><Plus size={16}/> Add Plan</button>
            </div>
            {loadingPlans ? <LoadingState label="Loading subscription plans…"/> : plans.length === 0 ? <p className="py-10 text-center text-sm text-slate-500">No plans returned by the API.</p> : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
                {plans.map((plan, index) => <div key={plan.id} className={`surface relative flex min-w-0 flex-col rounded-2xl border p-4 sm:p-5 ${index === 1 ? "border-[#FF2454]/30 bg-pink-50/30" : "border-slate-200 bg-white"}`}>
                  {index === 1 && <span className="absolute right-3 top-3 rounded-full bg-pink-100 px-2 py-1 text-[10px] font-bold text-[#FF2454]">POPULAR</span>}
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#10265F]">{plan.ownerType === "INSTITUTE" ? <ShieldCheck size={21}/> : <Users size={21}/>}</div>
                  <h3 className="mt-4 break-words font-bold text-[#10265F] ink">{plan.name}</h3><p className="mt-1 text-xs text-slate-500 muted">{plan.audience} · {plan.code}</p>
                  <div className="mt-4 flex flex-wrap items-baseline gap-1"><span className="text-2xl font-bold text-[#10265F] ink">{money(plan.price, plan.currency)}</span><span className="text-xs text-slate-400">/ {plan.isLifetime ? "Lifetime" : plan.durationMonths ? `${plan.durationMonths} month(s)` : "No fixed duration"}</span></div>
                  <p className="mt-3 min-h-10 break-words text-xs leading-5 text-slate-500 muted">{plan.description || "No description provided."}</p>
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4"><div><p className="text-lg font-bold text-[#10265F] ink">{plan.subscribers}</p><p className="text-xs text-slate-400">Subscribers</p></div><StatusPill status={plan.status}/></div>
                  <div className="mt-4 flex gap-2"><button onClick={() => openEditPlan(plan)} disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-[#10265F] hover:bg-slate-50 disabled:opacity-50 ink"><Pencil size={15}/> Edit</button><button onClick={() => togglePlanStatus(plan)} disabled={saving} title={plan.status === "Active" ? "Deactivate plan" : "Activate plan"} className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-500 hover:bg-slate-50 disabled:opacity-50">{plan.status === "Active" ? <Ban size={16}/> : <CheckCircle2 size={16}/>}</button></div>
                </div>)}
              </div>
            )}
          </section>

          <section className="surface overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:px-6">
              <div className="flex flex-wrap gap-2">{[{ name: "Payments", icon: CreditCard }, { name: "Refunds", icon: RotateCcw }, { name: "Plans", icon: ShieldCheck }].map(({ name, icon: Icon }) => <button key={name} onClick={() => { setActiveTab(name); resetFilters(); }} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${activeTab === name ? "bg-[#10265F] text-white" : "text-slate-500 hover:bg-slate-100"}`}><Icon size={16}/>{name}</button>)}</div>
              <button onClick={exportCSV} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"><Download size={16}/> Export CSV</button>
            </div>
            <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/60 p-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="relative"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${activeTab.toLowerCase()}…`} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#10265F] focus:ring-2 focus:ring-blue-100"/></div>
              {activeTab !== "Plans" && <div className="relative"><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-600 outline-none focus:border-[#10265F]"><option>All Status</option>{(activeTab === "Payments" ? ["Success", "Pending", "Failed", "Refunded", "Partially refunded"] : [...new Set(refunds.map((item) => item.status))]).map((status) => <option key={status}>{status}</option>)}</select><ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/></div>}
              {activeTab === "Payments" && <div className="relative"><select value={planFilter} onChange={(event) => setPlanFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-600 outline-none focus:border-[#10265F]"><option>All Plans</option>{[...new Set(payments.map((payment) => payment.plan).filter((value) => value && value !== "—"))].map((name) => <option key={name}>{name}</option>)}</select><ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/></div>}
              <button onClick={resetFilters} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"><RefreshCw size={15}/> Reset filters</button>
            </div>

            {tabLoading ? <LoadingState/> : noRows ? <EmptyState onReset={resetFilters}/> : <>
              {activeTab === "Payments" && <>
                <div className="desktop-table overflow-x-auto"><table className="w-full min-w-[980px] text-left"><thead className="bg-white text-xs uppercase tracking-wide text-slate-400"><tr>{["Transaction", "Customer", "Plan", "Amount", "Date / Method", "Status", "Actions"].map((heading) => <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filteredPayments.map((payment) => <tr key={payment.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><p className="text-sm font-semibold text-[#10265F]">{payment.id}</p><p className="mt-1 text-xs text-slate-400">{payment.reference}</p></td><td className="px-5 py-4"><p className="text-sm font-semibold text-slate-700">{payment.customer}</p><p className="mt-1 text-xs text-slate-400">{payment.email}</p></td><td className="px-5 py-4 text-sm">{payment.plan}</td><td className="px-5 py-4 text-sm font-bold text-[#10265F]">{money(payment.amount, payment.currency)}</td><td className="px-5 py-4"><p className="flex items-center gap-1.5 text-sm text-slate-600"><CalendarDays size={14}/>{dateLabel(payment.date)}</p><p className="mt-1 text-xs text-slate-400">{humanize(payment.method)}</p></td><td className="px-5 py-4"><StatusPill status={payment.status}/></td><td className="px-5 py-4"><div className="flex items-center justify-end gap-1"><button title="View payment" onClick={() => openPaymentDetails(payment)} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"><Eye size={17}/></button>{payment.status === "Success" && <button title="Request refund" onClick={() => { setRefundTarget(payment); setRefundReason(""); }} className="rounded-lg p-2 text-slate-500 hover:bg-pink-50 hover:text-[#FF2454]"><RefreshCw size={16}/></button>}</div></td></tr>)}</tbody></table></div>
                <div className="mobile-records divide-y divide-slate-100">{filteredPayments.map((payment) => <article key={payment.id} className="space-y-3 p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="break-all text-sm font-bold text-[#10265F]">{payment.id}</p><p className="mt-1 break-words text-sm text-slate-600">{payment.customer}</p><p className="text-xs text-slate-400">{payment.email}</p></div><StatusPill status={payment.status}/></div><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-slate-400">Plan</p><p className="mt-1 break-words font-medium">{payment.plan}</p></div><div><p className="text-xs text-slate-400">Amount</p><p className="mt-1 font-bold">{money(payment.amount, payment.currency)}</p></div><div><p className="text-xs text-slate-400">Date</p><p className="mt-1">{dateLabel(payment.date)}</p></div><div><p className="text-xs text-slate-400">Method</p><p className="mt-1">{humanize(payment.method)}</p></div></div><div className="flex justify-end gap-2"><button onClick={() => openPaymentDetails(payment)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"><Eye size={14}/> Details</button>{payment.status === "Success" && <button onClick={() => { setRefundTarget(payment); setRefundReason(""); }} className="inline-flex items-center gap-1 rounded-lg border border-pink-200 px-3 py-2 text-xs font-semibold text-[#FF2454]"><RefreshCw size={14}/> Refund</button>}</div></article>)}</div>
              </>}

              {activeTab === "Refunds" && <>
                {refunds.length === 0 && <div className="px-6 py-12 text-center"><RotateCcw className="mx-auto text-slate-300" size={30}/><h3 className="mt-3 font-semibold text-[#10265F]">No refund records returned</h3><p className="mx-auto mt-1 max-w-lg text-sm text-slate-500">The current payment-history response did not include refund records. A dedicated Super Admin refunds-list endpoint is not present in the routes shared so far.</p></div>}
                {refunds.length > 0 && <><div className="desktop-table overflow-x-auto"><table className="w-full min-w-[780px] text-left"><thead className="bg-white text-xs uppercase tracking-wide text-slate-400"><tr>{["Refund ID", "Customer", "Payment ID", "Amount", "Reason", "Date", "Status"].map((heading) => <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filteredRefunds.map((refund) => <tr key={refund.id} className="hover:bg-slate-50/70"><td className="px-5 py-4 text-sm font-semibold">{refund.id}</td><td className="px-5 py-4 text-sm">{refund.customer}</td><td className="px-5 py-4 text-sm">{refund.paymentId}</td><td className="px-5 py-4 text-sm font-bold">{money(refund.amount)}</td><td className="px-5 py-4 text-sm">{refund.reason}</td><td className="px-5 py-4 text-sm">{dateLabel(refund.date)}</td><td className="px-5 py-4"><StatusPill status={refund.status}/></td></tr>)}</tbody></table></div><div className="mobile-records divide-y divide-slate-100">{filteredRefunds.map((refund) => <article key={refund.id} className="space-y-2 p-4"><div className="flex items-center justify-between gap-2"><p className="break-all text-sm font-bold">{refund.id}</p><StatusPill status={refund.status}/></div><p className="text-sm">{refund.customer}</p><p className="text-xs text-slate-500">Payment: {refund.paymentId}</p><div className="flex justify-between gap-3 text-sm"><span className="text-slate-500">{refund.reason}</span><strong>{money(refund.amount)}</strong></div></article>)}</div></>}
              </>}

              {activeTab === "Plans" && <><div className="desktop-table overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-white text-xs uppercase tracking-wide text-slate-400"><tr>{["Plan", "Audience", "Price", "Duration", "Subscribers", "Status", "Actions"].map((heading) => <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filteredPlans.map((plan) => <tr key={plan.id} className="hover:bg-slate-50/70"><td className="px-5 py-4 text-sm font-semibold">{plan.name}<p className="text-xs font-normal text-slate-400">{plan.code}</p></td><td className="px-5 py-4 text-sm">{plan.audience}</td><td className="px-5 py-4 text-sm font-bold">{money(plan.price, plan.currency)}</td><td className="px-5 py-4 text-sm">{plan.isLifetime ? "Lifetime" : `${plan.durationMonths ?? "—"} months`}</td><td className="px-5 py-4 text-sm">{plan.subscribers}</td><td className="px-5 py-4"><StatusPill status={plan.status}/></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button onClick={() => openEditPlan(plan)} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50"><Pencil size={16}/></button><button onClick={() => togglePlanStatus(plan)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">{plan.status === "Active" ? <Ban size={16}/> : <CheckCircle2 size={16}/>}</button></div></td></tr>)}</tbody></table></div><div className="mobile-records divide-y divide-slate-100">{filteredPlans.map((plan) => <article key={plan.id} className="space-y-3 p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words font-bold">{plan.name}</h3><p className="text-xs text-slate-500">{plan.code} · {plan.audience}</p></div><StatusPill status={plan.status}/></div><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-slate-400">Price</p><strong>{money(plan.price, plan.currency)}</strong></div><div><p className="text-xs text-slate-400">Subscribers</p><strong>{plan.subscribers}</strong></div></div><div className="flex justify-end gap-2"><button onClick={() => openEditPlan(plan)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"><Pencil size={14}/> Edit</button><button onClick={() => togglePlanStatus(plan)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">{plan.status === "Active" ? "Deactivate" : "Activate"}</button></div></article>)}</div></>}
            </>}
            <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-5"><span>{activeTab === "Payments" ? `${filteredPayments.length} payment records` : activeTab === "Refunds" ? `${filteredRefunds.length} refund records` : `${filteredPlans.length} subscription plans`}</span><span>Equilx Billing Management · Live API</span></div>
          </section>
        </main>
      </div>

      {showPlanModal && <div className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"><div className="my-auto max-h-[95dvh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6"><div><h2 className="text-lg font-bold text-[#10265F]">{editingPlanId ? "Edit Subscription Plan" : "Create Subscription Plan"}</h2><p className="mt-1 text-xs text-slate-500">Pricing changes create a new immutable version.</p></div><button onClick={() => setShowPlanModal(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close modal"><X size={20}/></button></div>
        <form onSubmit={savePlan} className="space-y-4 p-5 sm:p-6">
          {!editingPlanId && <div><label className="mb-2 block text-sm font-semibold text-slate-700">Plan Code *</label><select required value={planForm.code} onChange={(event) => setPlanForm({ ...planForm, code: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">{PLAN_CODES.map((code) => <option key={code} value={code}>{code}</option>)}</select><p className="mt-1 text-xs text-slate-400">The backend currently supports these four plan codes.</p></div>}
          <div><label className="mb-2 block text-sm font-semibold text-slate-700">Plan Name *</label><input required minLength={2} maxLength={100} value={planForm.name} onChange={(event) => setPlanForm({ ...planForm, name: event.target.value })} placeholder="e.g. Student Pro" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"/></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className="mb-2 block text-sm font-semibold text-slate-700">Audience *</label><select disabled={Boolean(editingPlanId)} value={planForm.ownerType} onChange={(event) => setPlanForm({ ...planForm, ownerType: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"><option value="INDIVIDUAL">Individual students</option><option value="INSTITUTE">Institutes</option></select></div><div><label className="mb-2 block text-sm font-semibold text-slate-700">Price incl. GST (INR) *</label><input required type="number" min="0" step="0.01" value={planForm.price} onChange={(event) => setPlanForm({ ...planForm, price: event.target.value })} placeholder="999" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"/></div><div><label className="mb-2 block text-sm font-semibold text-slate-700">Duration (months)</label><input type="number" min="1" step="1" disabled={planForm.isLifetime} value={planForm.durationMonths} onChange={(event) => setPlanForm({ ...planForm, durationMonths: event.target.value })} placeholder="1" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm disabled:opacity-50"/></div><div><label className="mb-2 block text-sm font-semibold text-slate-700">GST Rate (%)</label><input required type="number" min="0" max="100" step="0.01" value={planForm.gstRate} onChange={(event) => setPlanForm({ ...planForm, gstRate: event.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"/></div></div>
          <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={planForm.isLifetime} onChange={(event) => setPlanForm({ ...planForm, isLifetime: event.target.checked, durationMonths: event.target.checked ? "" : "1" })} className="h-4 w-4 rounded border-slate-300"/> Lifetime plan</label>
          <div><label className="mb-2 block text-sm font-semibold text-slate-700">Description</label><textarea rows={3} maxLength={2000} value={planForm.description} onChange={(event) => setPlanForm({ ...planForm, description: event.target.value })} placeholder="Describe this plan…" className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm"/></div>
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={() => setShowPlanModal(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e91d49] disabled:opacity-60">{saving && <Loader2 size={16} className="animate-spin"/>}{editingPlanId ? "Save Changes" : "Create Plan"}</button></div>
        </form></div></div>}

      {showDetails && <div className="fixed inset-0 z-[70] flex items-end justify-center overflow-y-auto bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"><div className="my-auto max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-2xl"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-[#10265F]">Payment Details</h2><button onClick={() => setShowDetails(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close details"><X size={20}/></button></div><div className="p-5 sm:p-6"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#10265F]"><Receipt size={25}/></div><h3 className="mt-4 break-all text-xl font-bold text-[#10265F]">{showDetails.id}</h3><p className="mt-1 text-sm text-slate-500">{showDetails.customer}</p>{showDetails.loading ? <LoadingState label="Loading payment details…"/> : <div className="mt-5 space-y-3">{Object.entries(showDetails).filter(([key, value]) => !["entityType", "raw", "loading"].includes(key) && value !== undefined && value !== null && typeof value !== "object").map(([key, value]) => <div key={key} className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 p-3"><span className="text-sm capitalize text-slate-500">{key.replace(/([A-Z])/g, " $1")}</span><span className="max-w-[60%] break-words text-right text-sm font-semibold text-[#10265F]">{key === "amount" ? money(value) : String(value)}</span></div>)}</div>}<button onClick={() => setShowDetails(null)} className="mt-5 w-full rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#193778]">Close</button></div></div></div>}

      {refundTarget && <div className="fixed inset-0 z-[75] flex items-end justify-center overflow-y-auto bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"><div className="my-auto w-full max-w-md rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-[#10265F]">Submit Refund Request</h2><button onClick={() => setRefundTarget(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={19}/></button></div><p className="mt-2 text-sm text-slate-500">Payment {refundTarget.id} · {money(refundTarget.amount, refundTarget.currency)}</p><form onSubmit={submitRefund} className="mt-5 space-y-4"><div><label className="mb-2 block text-sm font-semibold text-slate-700">Reason *</label><textarea required minLength={3} maxLength={500} rows={3} value={refundReason} onChange={(event) => setRefundReason(event.target.value)} placeholder="Enter the reason for this refund request" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"/></div><p className="text-xs leading-5 text-slate-400">The server validates refund eligibility and amount. This action submits a refund request; it does not locally mark the payment as refunded.</p><div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setRefundTarget(null)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" disabled={saving || !refundReason.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving && <Loader2 size={16} className="animate-spin"/>}Submit Request</button></div></form></div></div>}

      {notice && <div role="status" className="fixed bottom-4 left-3 right-3 z-[90] mx-auto flex max-w-md items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#10265F] shadow-lg sm:bottom-5 sm:left-auto sm:right-5"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600"/><span className="min-w-0 flex-1 break-words">{notice}</span><button onClick={() => setNotice("")} className="text-slate-400 hover:text-slate-700" aria-label="Dismiss notification"><X size={16}/></button></div>}
    </div>
  );
}
