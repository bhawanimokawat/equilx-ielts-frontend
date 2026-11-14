import React, { useMemo, useState } from "react";
import {
  BrainCircuit,
  Sparkles,
  Cpu,
  DollarSign,
  Activity,
  Search,
  Plus,
  Settings2,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  X,
  Save,
  RefreshCw,
  ChevronDown,
  Eye,
  Pencil,
  Power,
  SlidersHorizontal,
  ShieldCheck,
  Zap,
  BarChart3,
  FileText,
  Download,
} from "lucide-react";


import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const initialModels = [
  {
    id: 1,
    name: "GPT-4.1",
    provider: "OpenAI",
    purpose: "Writing Evaluation",
    status: "Active",
    latency: 2.4,
    accuracy: 94.8,
    cost: 12.4,
  },
  {
    id: 2,
    name: "GPT-4.1 mini",
    provider: "OpenAI",
    purpose: "Speaking Feedback",
    status: "Active",
    latency: 1.2,
    accuracy: 91.6,
    cost: 5.8,
  },
  {
    id: 3,
    name: "Embedding Model",
    provider: "OpenAI",
    purpose: "Content Search",
    status: "Active",
    latency: 0.4,
    accuracy: 96.2,
    cost: 1.6,
  },
];

const initialPrompts = [
  {
    id: 1,
    name: "IELTS Writing Evaluation",
    module: "Writing",
    version: "v2.4",
    updated: "26 Oct 2026",
    status: "Published",
    description:
      "Evaluates task response, coherence, lexical resource and grammar.",
  },
  {
    id: 2,
    name: "Speaking Band Feedback",
    module: "Speaking",
    version: "v1.8",
    updated: "24 Oct 2026",
    status: "Published",
    description:
      "Provides speaking feedback using fluency, vocabulary and pronunciation criteria.",
  },
  {
    id: 3,
    name: "Reading Explanation Generator",
    module: "Reading",
    version: "v1.3",
    updated: "22 Oct 2026",
    status: "Draft",
    description:
      "Creates explanations for reading questions and answer choices.",
  },
  {
    id: 4,
    name: "Study Assistant",
    module: "General",
    version: "v1.5",
    updated: "20 Oct 2026",
    status: "Published",
    description:
      "Answers IELTS study questions using configured learning resources.",
  },
];

const initialUsage = [
  {
    id: 1,
    account: "RIT College",
    type: "Institute",
    model: "GPT-4.1",
    requests: 1842,
    tokens: "2.4M",
    cost: 1240,
    status: "Within Limit",
  },
  {
    id: 2,
    account: "Arya College",
    type: "Institute",
    model: "GPT-4.1 mini",
    requests: 1326,
    tokens: "1.8M",
    cost: 760,
    status: "Within Limit",
  },
  {
    id: 3,
    account: "Purnima College",
    type: "Institute",
    model: "GPT-4.1",
    requests: 2150,
    tokens: "3.1M",
    cost: 1980,
    status: "Near Limit",
  },
  {
    id: 4,
    account: "Student Pro Accounts",
    type: "Students",
    model: "GPT-4.1 mini",
    requests: 4280,
    tokens: "4.6M",
    cost: 2160,
    status: "Within Limit",
  },
  {
    id: 5,
    account: "Free Accounts",
    type: "Students",
    model: "GPT-4.1 mini",
    requests: 820,
    tokens: "0.9M",
    cost: 340,
    status: "Within Limit",
  },
];

const initialSettings = {
  defaultModel: "GPT-4.1",
  writingModel: "GPT-4.1",
  speakingModel: "GPT-4.1 mini",
  readingModel: "GPT-4.1 mini",
  assistantModel: "GPT-4.1 mini",
  dailyLimit: "100",
  monthlyBudget: "50000",
  freeDailyLimit: "5",
  proDailyLimit: "100",
  instituteDailyLimit: "500",
  temperature: "0.3",
  maxTokens: "2000",
  alertsEnabled: true,
  evaluationEnabled: true,
  loggingEnabled: true,
};

const initialQuality = [
  { label: "Writing Evaluation", score: 94.8, target: 90 },
  { label: "Speaking Feedback", score: 91.6, target: 90 },
  { label: "Reading Explanations", score: 96.2, target: 90 },
  { label: "Answer Matching", score: 98.1, target: 95 },
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700",
    Published: "bg-emerald-50 text-emerald-700",
    Draft: "bg-amber-50 text-amber-700",
    "Within Limit": "bg-emerald-50 text-emerald-700",
    "Near Limit": "bg-amber-50 text-amber-700",
    Inactive: "bg-slate-100 text-slate-600",
    Disabled: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Active" ||
          status === "Published" ||
          status === "Within Limit"
            ? "bg-emerald-500"
            : status === "Near Limit" || status === "Draft"
              ? "bg-amber-500"
              : "bg-slate-400"
        }`}
      />
      {status}
    </span>
  );
}

export default function AISettingsUsage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [models, setModels] = useState(initialModels);
  const [prompts, setPrompts] = useState(initialPrompts);
  const [usage] = useState(initialUsage);
  const [settings, setSettings] = useState(initialSettings);
  const [quality] = useState(initialQuality);

  const [search, setSearch] = useState("");
  const [promptFilter, setPromptFilter] = useState("All Status");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState(null);

  const [promptForm, setPromptForm] = useState({
    name: "",
    module: "Writing",
    version: "v1.0",
    description: "",
    content: "",
    status: "Draft",
  });

  const [notice, setNotice] = useState("");

  const totalRequests = usage.reduce(
    (sum, item) => sum + item.requests,
    0
  );

  const totalCost = usage.reduce(
    (sum, item) => sum + item.cost,
    0
  );

  const activeModels = models.filter(
    (model) => model.status === "Active"
  ).length;

  const averageQuality =
    quality.reduce((sum, item) => sum + item.score, 0) /
    quality.length;

  const filteredUsage = useMemo(() => {
    const term = search.toLowerCase().trim();

    return usage.filter((item) =>
      [item.account, item.type, item.model, item.status].some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );
  }, [usage, search]);

  const filteredPrompts = useMemo(() => {
    const term = search.toLowerCase().trim();

    return prompts.filter((item) => {
      const matchesSearch = [
        item.name,
        item.module,
        item.version,
        item.description,
      ].some((value) =>
        String(value || "").toLowerCase().includes(term)
      );

      return (
        matchesSearch &&
        (promptFilter === "All Status" || item.status === promptFilter)
      );
    });
  }, [prompts, search, promptFilter]);

  const filteredModels = useMemo(() => {
    const term = search.toLowerCase().trim();

    return models.filter((item) =>
      [item.name, item.provider, item.purpose, item.status].some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );
  }, [models, search]);

  const resetSearch = () => {
    setSearch("");
    setPromptFilter("All Status");
  };

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const toggleModel = (model) => {
    const nextStatus =
      model.status === "Active" ? "Inactive" : "Active";

    setModels((previous) =>
      previous.map((item) =>
        item.id === model.id
          ? { ...item, status: nextStatus }
          : item
      )
    );

    setNotice(`${model.name} is now ${nextStatus.toLowerCase()}.`);
  };

  const openCreatePrompt = () => {
    setEditingPromptId(null);

    setPromptForm({
      name: "",
      module: "Writing",
      version: "v1.0",
      description: "",
      content: "",
      status: "Draft",
    });

    setShowPromptModal(true);
  };

  const openEditPrompt = (prompt) => {
    setEditingPromptId(prompt.id);

    setPromptForm({
      ...prompt,
      content: prompt.content || "",
    });

    setShowPromptModal(true);
  };

  const savePrompt = (event) => {
    event.preventDefault();

    if (
      prompts.some(
        (prompt) =>
          prompt.name.toLowerCase() ===
            promptForm.name.trim().toLowerCase() &&
          prompt.id !== editingPromptId
      )
    ) {
      setNotice("A prompt with this name already exists.");
      return;
    }

    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const nextPrompt = {
      ...promptForm,
      name: promptForm.name.trim(),
      id: editingPromptId || Date.now(),
      updated: today,
    };

    setPrompts((previous) =>
      editingPromptId
        ? previous.map((prompt) =>
            prompt.id === editingPromptId
              ? nextPrompt
              : prompt
          )
        : [nextPrompt, ...previous]
    );

    setShowPromptModal(false);

    setNotice(
      editingPromptId ? "Prompt updated." : "Prompt created."
    );
  };

  const togglePromptStatus = (prompt) => {
    const nextStatus =
      prompt.status === "Published" ? "Draft" : "Published";

    setPrompts((previous) =>
      previous.map((item) =>
        item.id === prompt.id
          ? { ...item, status: nextStatus }
          : item
      )
    );

    setNotice(`Prompt moved to ${nextStatus.toLowerCase()}.`);
  };

  const exportUsageCSV = () => {
    const rows = [
      [
        "Account",
        "Type",
        "Model",
        "Requests",
        "Tokens",
        "Cost INR",
        "Status",
      ],
      ...filteredUsage.map((item) => [
        item.account,
        item.type,
        item.model,
        item.requests,
        item.tokens,
        item.cost,
        item.status,
      ]),
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const blob = new Blob(
      [
        rows
          .map((row) => row.map(escapeCSV).join(","))
          .join("\n"),
      ],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ai-usage-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const saveSettings = (event) => {
    event.preventDefault();

    setShowSettingsModal(false);
    setNotice("Settings updated in this demo session.");
  };

  return (
    <div className="ai-settings-usage min-h-screen bg-[#F5F7FF] text-[#172554] transition-colors">
      <style>{`
        html.dark .ai-settings-usage {
          background: #17151B !important;
          color: #FFFFFF !important;
        }

        html.dark .ai-settings-usage [class*="bg-white"],
        html.dark .ai-settings-usage [class*="bg-[#F5F7FF]"],
        html.dark .ai-settings-usage [class*="bg-slate-50"],
        html.dark .ai-settings-usage [class*="bg-slate-100"] {
          background-color: #211E27 !important;
        }

        html.dark .ai-settings-usage [class*="border-slate-100"],
        html.dark .ai-settings-usage [class*="border-slate-200"],
        html.dark .ai-settings-usage [class*="border-[#E9EEFA]"] {
          border-color: #3B3441 !important;
        }

        html.dark .ai-settings-usage [class*="text-[#10265F]"],
        html.dark .ai-settings-usage [class*="text-[#172554]"],
        html.dark .ai-settings-usage [class*="text-slate-700"],
        html.dark .ai-settings-usage [class*="text-slate-800"],
        html.dark .ai-settings-usage [class*="text-slate-900"] {
          color: #FFFFFF !important;
        }

        html.dark .ai-settings-usage [class*="text-slate-500"],
        html.dark .ai-settings-usage [class*="text-slate-400"],
        html.dark .ai-settings-usage [class*="text-slate-600"] {
          color: #B0A5BD !important;
        }

        html.dark .ai-settings-usage input,
        html.dark .ai-settings-usage select,
        html.dark .ai-settings-usage textarea {
          background-color: #19171E !important;
          color: #FFFFFF !important;
          border-color: #3B3441 !important;
        }

        html.dark .ai-settings-usage input::placeholder,
        html.dark .ai-settings-usage textarea::placeholder {
          color: #8F849A !important;
        }

        html.dark .ai-settings-usage [class*="hover:bg-slate-50"]:hover,
        html.dark .ai-settings-usage [class*="hover:bg-slate-100"]:hover {
          background-color: #302B36 !important;
        }
      `}</style>

      <Sidebar />

      <div className="min-h-screen md:ml-[260px]">
        <Navbar />

        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Page heading */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>Super Admin</span>
                <span>/</span>
                <span className="text-[#FF2454]">AI Settings & Usage</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#10265F] sm:text-3xl">
                AI Settings & Usage
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Configure AI models, manage prompts, monitor costs and review
                evaluation quality.
              </p>
            </div>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e91d49]"
            >
              <Settings2 size={18} />
              AI Configuration
            </button>
          </div>

          {/* AI status banner */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl bg-[#10265F] p-5 text-white shadow-sm sm:flex-row sm:items-center sm:p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white/10 p-3">
                <BrainCircuit size={27} />
              </div>

              <div>
                <h2 className="font-bold">AI Platform Overview</h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-blue-100/80">
                  Monitor model activity, usage budgets and the quality of
                  AI-powered IELTS evaluations.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 self-start rounded-full bg-emerald-400/15 px-3 py-2 text-xs font-semibold text-emerald-200 sm:self-center">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Demo monitoring status
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <Activity size={21} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <TrendingUp size={14} />
                  Requests
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-500">Total AI Requests</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {totalRequests.toLocaleString("en-IN")}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Across configured account groups
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-pink-50 p-3 text-[#FF2454]">
                  <DollarSign size={21} />
                </div>
                <span className="text-xs text-slate-400">Sample values</span>
              </div>

              <p className="mt-5 text-sm text-slate-500">Estimated AI Cost</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {money(totalCost)}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Cost shown from demo records
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <Cpu size={21} />
                </div>
                <StatusBadge status="Active" />
              </div>

              <p className="mt-5 text-sm text-slate-500">Active Models</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {activeModels}/{models.length}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Configured AI model entries
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <ShieldCheck size={21} />
                </div>
                <span className="text-xs font-medium text-emerald-600">
                  Demo metrics
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-500">
                Average Quality Score
              </p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {averageQuality.toFixed(1)}%
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Sample evaluation scores
              </p>
            </div>
          </div>

          {/* Tabs */}
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-wrap gap-2 border-b border-slate-100 p-4 sm:px-6">
              {[
                { name: "Overview", icon: BarChart3 },
                { name: "Models", icon: Cpu },
                { name: "Prompts", icon: FileText },
                { name: "Usage & Cost", icon: DollarSign },
                { name: "Quality", icon: ShieldCheck },
              ].map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => {
                    setActiveTab(name);
                    resetSearch();
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

            {/* Overview */}
            {activeTab === "Overview" && (
              <div className="grid grid-cols-1 gap-6 p-5 xl:grid-cols-2 sm:p-6">
                <div className="rounded-2xl border border-slate-100 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#10265F]">
                        Model Configuration
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Currently configured models
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab("Models")}
                      className="text-xs font-semibold text-[#FF2454] hover:underline"
                    >
                      View all
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {models.map((model) => (
                      <div
                        key={model.id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="rounded-xl bg-blue-50 p-2.5 text-[#10265F]">
                            <Cpu size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#10265F]">
                              {model.name}
                            </p>
                            <p className="mt-1 truncate text-xs text-slate-400">
                              {model.purpose}
                            </p>
                          </div>
                        </div>

                        <StatusBadge status={model.status} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#10265F]">
                        Evaluation Quality
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Sample performance indicators
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab("Quality")}
                      className="text-xs font-semibold text-[#FF2454] hover:underline"
                    >
                      Details
                    </button>
                  </div>

                  <div className="mt-5 space-y-5">
                    {quality.map((item) => (
                      <div key={item.label}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-slate-600">
                            {item.label}
                          </span>
                          <span className="text-sm font-bold text-[#10265F]">
                            {item.score}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-[#10265F]"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 p-5 xl:col-span-2">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-bold text-[#10265F]">
                        Usage by Account
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Compare AI request volume by account group.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab("Usage & Cost")}
                      className="text-left text-xs font-semibold text-[#FF2454] hover:underline"
                    >
                      View usage report
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {usage.slice(0, 4).map((item) => {
                      const percentage = Math.min(
                        100,
                        (item.requests /
                          Math.max(...usage.map((x) => x.requests))) *
                          100
                      );

                      return (
                        <div key={item.id}>
                          <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                            <span className="text-sm font-medium text-slate-600">
                              {item.account}
                            </span>
                            <span className="text-xs text-slate-500">
                              {item.requests.toLocaleString("en-IN")} requests
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-[#FF2454]"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 xl:col-span-2 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-white p-3 text-[#10265F] shadow-sm">
                      <SlidersHorizontal size={20} />
                    </div>

                    <div>
                      <h3 className="font-bold text-[#10265F]">
                        Usage Limits & AI Controls
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Configure daily limits, model selection, token limits
                        and monitoring preferences.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="shrink-0 rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#193778]"
                  >
                    Open Configuration
                  </button>
                </div>
              </div>
            )}

            {/* Models */}
            {activeTab === "Models" && (
              <div>
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:px-6">
                  <div>
                    <h3 className="font-bold text-[#10265F]">AI Models</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      View configured models and toggle demo availability.
                    </p>
                  </div>

                  <div className="relative w-full sm:max-w-xs">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search models..."
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#10265F]"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left">
                    <thead className="text-xs uppercase tracking-wide text-slate-400">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Model</th>
                        <th className="px-5 py-4 font-semibold">Provider</th>
                        <th className="px-5 py-4 font-semibold">Purpose</th>
                        <th className="px-5 py-4 font-semibold">Latency</th>
                        <th className="px-5 py-4 font-semibold">Quality</th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                        <th className="px-5 py-4 text-right font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredModels.map((model) => (
                        <tr
                          key={model.id}
                          className="hover:bg-slate-50/70"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="rounded-xl bg-blue-50 p-2.5 text-[#10265F]">
                                <Cpu size={19} />
                              </div>
                              <span className="text-sm font-semibold text-[#10265F]">
                                {model.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {model.provider}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {model.purpose}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {model.latency}s
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-[#10265F]">
                            {model.accuracy}%
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge status={model.status} />
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => toggleModel(model)}
                              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                                model.status === "Active"
                                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            >
                              <Power size={14} />
                              {model.status === "Active" ? "Disable" : "Enable"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredModels.length === 0 && (
                  <p className="p-10 text-center text-sm text-slate-500">
                    No models found.
                  </p>
                )}
              </div>
            )}            {/* Prompts */}
            {activeTab === "Prompts" && (
              <div>
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:px-6">
                  <div>
                    <h3 className="font-bold text-[#10265F]">
                      Prompt Library
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Manage prompt templates and publication status.
                    </p>
                  </div>

                  <button
                    onClick={openCreatePrompt}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#e91d49]"
                  >
                    <Plus size={16} />
                    New Prompt
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/60 p-4 sm:grid-cols-2">
                  <div className="relative">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search prompts..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#10265F]"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={promptFilter}
                      onChange={(event) => setPromptFilter(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-600 outline-none focus:border-[#10265F]"
                    >
                      <option>All Status</option>
                      <option>Published</option>
                      <option>Draft</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2 sm:p-6">
                  {filteredPrompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="rounded-2xl border border-slate-100 p-5 transition hover:border-blue-100 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="rounded-xl bg-blue-50 p-3 text-[#10265F]">
                            <FileText size={20} />
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-bold text-[#10265F]">
                              {prompt.name}
                            </h4>
                            <p className="mt-1 text-xs text-slate-400">
                              {prompt.module} · {prompt.version}
                            </p>
                          </div>
                        </div>

                        <StatusBadge status={prompt.status} />
                      </div>

                      <p className="mt-4 min-h-10 text-sm leading-6 text-slate-500">
                        {prompt.description}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <span className="text-xs text-slate-400">
                          Updated {prompt.updated}
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditPrompt(prompt)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            onClick={() => togglePromptStatus(prompt)}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#10265F] hover:bg-blue-100"
                          >
                            {prompt.status === "Published"
                              ? "Unpublish"
                              : "Publish"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPrompts.length === 0 && (
                  <p className="p-10 text-center text-sm text-slate-500">
                    No prompts found.
                  </p>
                )}
              </div>
            )}

            {/* Usage & Cost */}
            {activeTab === "Usage & Cost" && (
              <div>
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:px-6">
                  <div>
                    <h3 className="font-bold text-[#10265F]">
                      AI Usage & Cost
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Review requests and estimated costs by account.
                    </p>
                  </div>

                  <button
                    onClick={exportUsageCSV}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Download size={16} />
                    Export usage
                  </button>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-blue-50/70 p-4">
                      <p className="text-xs text-slate-500">
                        Total requests
                      </p>
                      <p className="mt-2 text-2xl font-bold text-[#10265F]">
                        {totalRequests.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="rounded-xl bg-pink-50/70 p-4">
                      <p className="text-xs text-slate-500">
                        Estimated cost
                      </p>
                      <p className="mt-2 text-2xl font-bold text-[#10265F]">
                        {money(totalCost)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50/70 p-4">
                      <p className="text-xs text-slate-500">
                        Monthly budget
                      </p>
                      <p className="mt-2 text-2xl font-bold text-[#10265F]">
                        {money(settings.monthlyBudget)}
                      </p>
                    </div>
                  </div>

                  <div className="relative mb-4 max-w-sm">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search accounts or models..."
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#10265F]"
                    />
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full min-w-[800px] text-left">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                        <tr>
                          <th className="px-4 py-4 font-semibold">
                            Account
                          </th>
                          <th className="px-4 py-4 font-semibold">
                            Model
                          </th>
                          <th className="px-4 py-4 font-semibold">
                            Requests
                          </th>
                          <th className="px-4 py-4 font-semibold">
                            Tokens
                          </th>
                          <th className="px-4 py-4 font-semibold">
                            Cost
                          </th>
                          <th className="px-4 py-4 font-semibold">
                            Usage Status
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {filteredUsage.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50/70"
                          >
                            <td className="px-4 py-4">
                              <p className="text-sm font-semibold text-[#10265F]">
                                {item.account}
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                {item.type}
                              </p>
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {item.model}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {item.requests.toLocaleString("en-IN")}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {item.tokens}
                            </td>

                            <td className="px-4 py-4 text-sm font-bold text-[#10265F]">
                              {money(item.cost)}
                            </td>

                            <td className="px-4 py-4">
                              <StatusBadge status={item.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredUsage.length === 0 && (
                    <p className="p-8 text-center text-sm text-slate-500">
                      No usage records found.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Quality */}
            {activeTab === "Quality" && (
              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <h3 className="font-bold text-[#10265F]">
                    AI Evaluation Quality
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Review sample quality scores against configured targets.
                    These values are illustrative, not live evaluation results.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {quality.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-100 p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="rounded-xl bg-blue-50 p-3 text-[#10265F]">
                          <ShieldCheck size={20} />
                        </div>

                        <StatusBadge
                          status={
                            item.score >= item.target ? "Active" : "Draft"
                          }
                        />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-slate-600">
                        {item.label}
                      </p>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#10265F]">
                          {item.score}%
                        </span>
                        <span className="text-xs text-slate-400">
                          Target: {item.target}%
                        </span>
                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#10265F]"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>

                      <p className="mt-3 text-xs text-slate-400">
                        {item.score >= item.target
                          ? "Above the configured target."
                          : "Below the configured target; review required."}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={21}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />
                    <div>
                      <h4 className="font-bold text-amber-900">
                        Evaluation monitoring
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-amber-800/80">
                        To measure real IELTS grading quality, connect
                        evaluation outputs to reviewed benchmark answers,
                        calibration checks and human-review outcomes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* AI configuration modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#10265F]">
                  AI Configuration
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Configure model routing and usage limits.
                </p>
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close configuration"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveSettings} className="space-y-5 p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["defaultModel", "Default AI Model"],
                  ["writingModel", "Writing Evaluation Model"],
                  ["speakingModel", "Speaking Feedback Model"],
                  ["readingModel", "Reading Explanation Model"],
                  ["assistantModel", "Study Assistant Model"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      {label}
                    </label>

                    <select
                      value={settings[key]}
                      onChange={(event) =>
                        updateSetting(key, event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                    >
                      <option>GPT-4.1</option>
                      <option>GPT-4.1 mini</option>
                      <option>Embedding Model</option>
                    </select>
                  </div>
                ))}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Temperature
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(event) =>
                      updateSetting("temperature", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Maximum Output Tokens
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={settings.maxTokens}
                    onChange={(event) =>
                      updateSetting("maxTokens", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Default Daily Request Limit
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.dailyLimit}
                    onChange={(event) =>
                      updateSetting("dailyLimit", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Monthly Budget (INR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.monthlyBudget}
                    onChange={(event) =>
                      updateSetting("monthlyBudget", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-bold text-[#10265F]">
                  Account Usage Limits
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    ["freeDailyLimit", "Free / day"],
                    ["proDailyLimit", "Pro / day"],
                    ["instituteDailyLimit", "Institute / day"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="mb-2 block text-xs font-semibold text-slate-600">
                        {label}
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={settings[key]}
                        onChange={(event) =>
                          updateSetting(key, event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-xl bg-slate-50 p-4">
                {[
                  ["alertsEnabled", "Usage budget alerts"],
                  ["evaluationEnabled", "AI evaluation enabled"],
                  ["loggingEnabled", "AI request logging"],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center justify-between gap-4"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {label}
                    </span>

                    <input
                      type="checkbox"
                      checked={settings[key]}
                      onChange={(event) =>
                        updateSetting(key, event.target.checked)
                      }
                      className="h-4 w-4 accent-[#FF2454]"
                    />
                  </label>
                ))}
              </div>

              <p className="text-xs leading-5 text-slate-400">
                Demo settings only. Production changes must be validated and
                saved securely on the backend before affecting live AI requests.
              </p>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e91d49]"
                >
                  <Save size={16} />
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create/edit prompt modal */}
      {showPromptModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#10265F]">
                  {editingPromptId ? "Edit Prompt" : "Create Prompt"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Configure the prompt template and version.
                </p>
              </div>

              <button
                onClick={() => setShowPromptModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close prompt editor"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={savePrompt} className="space-y-4 p-5 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Prompt Name *
                </label>

                <input
                  required
                  value={promptForm.name}
                  onChange={(event) =>
                    setPromptForm({
                      ...promptForm,
                      name: event.target.value,
                    })
                  }
                  placeholder="e.g. IELTS Writing Evaluation"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Module
                  </label>

                  <select
                    value={promptForm.module}
                    onChange={(event) =>
                      setPromptForm({
                        ...promptForm,
                        module: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                  >
                    <option>Writing</option>
                    <option>Speaking</option>
                    <option>Reading</option>
                    <option>Listening</option>
                    <option>General</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Version
                  </label>

                  <input
                    required
                    value={promptForm.version}
                    onChange={(event) =>
                      setPromptForm({
                        ...promptForm,
                        version: event.target.value,
                      })
                    }
                    placeholder="v1.0"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Status
                  </label>

                  <select
                    value={promptForm.status}
                    onChange={(event) =>
                      setPromptForm({
                        ...promptForm,
                        status: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                  >
                    <option>Draft</option>
                    <option>Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <input
                  value={promptForm.description}
                  onChange={(event) =>
                    setPromptForm({
                      ...promptForm,
                      description: event.target.value,
                    })
                  }
                  placeholder="Explain the purpose of this prompt"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Prompt Instructions
                </label>

                <textarea
                  rows={6}
                  value={promptForm.content}
                  onChange={(event) =>
                    setPromptForm({
                      ...promptForm,
                      content: event.target.value,
                    })
                  }
                  placeholder="Write the system instructions or evaluation criteria..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm leading-6 outline-none focus:border-[#10265F]"
                />
              </div>

              <p className="text-xs leading-5 text-slate-400">
                This editor stores prompt text in local component state only.
                Connect the backend to version and deploy production prompts.
              </p>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowPromptModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#FF2454] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e91d49]"
                >
                  {editingPromptId ? "Save Changes" : "Create Prompt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {notice && (
        <div className="fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#10265F] shadow-lg">
          <CheckCircle2
            size={18}
            className="shrink-0 text-emerald-600"
          />

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