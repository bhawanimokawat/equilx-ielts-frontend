
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BrainCircuit,
  Cpu,
  DollarSign,
  Activity,
  Search,
  Plus,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  X,
  Save,
  ChevronDown,
  Pencil,
  Power,
  SlidersHorizontal,
  ShieldCheck,
  BarChart3,
  FileText,
  Download,
  RefreshCw,
} from "lucide-react";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

// Adjust this relative path if your page is stored in a different folder.
import aiAdminService from "../../services/super-admin/aiAdmin.service.js";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const unwrap = (response) => response?.data ?? response;

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong.";

const getArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.models)) return value.models;
  if (Array.isArray(value?.prompts)) return value.prompts;
  if (Array.isArray(value?.rows)) return value.rows;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const formatTokens = (value) => {
  const tokens = Number(value || 0);

  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(2)}M`;
  }

  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}K`;
  }

  return formatNumber(tokens);
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Usage costs can be returned in different currencies.
// Never assume that an AI provider cost is INR.
const formatMoney = (amount, currency = "USD") => {
  if (amount === null || amount === undefined) return "—";

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch {
    return `${currency || "USD"} ${Number(amount).toFixed(2)}`;
  }
};

const getPromptKey = (module, name) => {
  const prefix = String(module || "WRITING")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "_");

  const suffix = String(name || "PROMPT")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `${prefix}_${suffix}`.slice(0, 80);
};

const parsePromptContent = (content) => {
  if (!content) {
    return {
      systemInstruction: "",
      promptTemplate: "",
    };
  }

  if (typeof content === "object") {
    return {
      systemInstruction: content.systemInstruction || "",
      promptTemplate: content.promptTemplate || "",
    };
  }

  try {
    const parsed = JSON.parse(content);

    return {
      systemInstruction: parsed.systemInstruction || "",
      promptTemplate: parsed.promptTemplate || "",
    };
  } catch {
    return {
      systemInstruction: String(content),
      promptTemplate: "",
    };
  }
};

const getPromptVersion = (prompt) =>
  prompt?.versionNumber ??
  prompt?.version ??
  prompt?.latestVersion?.versionNumber ??
  prompt?.latestVersion?.version ??
  "—";

const getPromptId = (prompt) =>
  prompt?.id ??
  prompt?.latestVersion?.id ??
  prompt?.activeVersion?.id ??
  null;

// --------------------------------------------------
// Status badge
// --------------------------------------------------

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700",
    Published: "bg-emerald-50 text-emerald-700",
    Draft: "bg-amber-50 text-amber-700",
    Inactive: "bg-slate-100 text-slate-600",
    Disabled: "bg-red-50 text-red-700",
    Completed: "bg-emerald-50 text-emerald-700",
    FAILED: "bg-red-50 text-red-700",
    PROCESSING: "bg-blue-50 text-blue-700",
    PENDING: "bg-amber-50 text-amber-700",
  };

  const normalized = status || "Unknown";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${
        styles[normalized] || "bg-slate-100 text-slate-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          ["Active", "Published", "Completed"].includes(normalized)
            ? "bg-emerald-500"
            : ["Draft", "PENDING"].includes(normalized)
              ? "bg-amber-500"
              : normalized === "FAILED"
                ? "bg-red-500"
                : "bg-slate-400"
        }`}
      />
      {normalized}
    </span>
  );
}

// --------------------------------------------------
// Main component
// --------------------------------------------------

export default function AISettingsUsage() {
  const [activeTab, setActiveTab] = useState("Overview");

  // Backend data
  const [models, setModels] = useState([]);
  const [prompts, setPrompts] = useState([]);

  const [usageSummary, setUsageSummary] = useState(null);
  const [usageBreakdown, setUsageBreakdown] = useState([]);
  const [usageTrends, setUsageTrends] = useState([]);

  const [qualitySummary, setQualitySummary] = useState(null);
  const [qualityBreakdown, setQualityBreakdown] = useState(null);
  const [qualityTrends, setQualityTrends] = useState([]);

  const [settings, setSettings] = useState(null);
  const [limits, setLimits] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [promptFilter, setPromptFilter] = useState("All Status");

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState(null);

  const [promptForm, setPromptForm] = useState({
    name: "",
    module: "Writing",
    description: "",
    content: "",
    promptTemplate: "",
    promptKey: "",
  });

  // --------------------------------------------------
  // Models API
  // --------------------------------------------------

  
const loadModels = useCallback(async () => {
  const response = unwrap(await aiAdminService.getModels());

  const records = getArray(response?.models ?? response);

  setModels(
    records.map((model) => {
      const routes = model.routes || [];

      // Backend field is isActive, while the UI uses active.
      const isActive = Boolean(model.isActive);

      return {
        ...model,
        id: model.id,
        name: model.modelName || model.name || "Unnamed model",
        provider: model.provider || "—",
        active: isActive,
        purpose:
          routes
            .map((route) => route.purpose)
            .filter(Boolean)
            .join(", ") || "Not assigned",
        status: isActive ? "Active" : "Inactive",
      };
    })
  );
}, []);

  // Persist model activation state through the backend.
  const toggleModel = async (model) => {
    try {
      setSaving(true);

      await aiAdminService.updateModel(model.id, {
        isActive: !model.active,
      });

      await loadModels();

      setNotice(
        `${model.name} ${model.active ? "disabled" : "enabled"} successfully.`
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Prompts API
  // --------------------------------------------------

  const loadPrompts = useCallback(async () => {
    const response = unwrap(await aiAdminService.getPrompts());

    const records = getArray(response?.prompts ?? response);

    const normalized = records.map((item) => {
      const versions = item.versions || [];
      const latest =
        item.latestVersion ||
        versions[0] ||
        item.activeVersion ||
        item;

      const published =
        item.activeVersion ||
        versions.find((version) => version.isActive || version.status === "PUBLISHED");

      const selected = published || latest;

      return {
        ...item,
        id: getPromptId(selected) || item.id,
        promptKey: item.promptKey || selected.promptKey,
        name:
          item.name ||
          item.title ||
          item.promptName ||
          item.promptKey ||
          "Untitled prompt",
        module:
          item.module ||
          item.purpose ||
          selected.purpose ||
          "Writing",
        version: `v${getPromptVersion(selected)}`,
        description:
          selected.description ||
          item.description ||
          "",
        status:
          published || selected.isActive
            ? "Published"
            : "Draft",
        updated:
          formatDate(
            selected.updatedAt ||
            selected.createdAt ||
            item.updatedAt
          ),
        content: selected.content || selected.promptContent || "",
        versionRecord: selected,
        versions,
      };
    });

    setPrompts(normalized);
  }, []);

  // Load prompt history when opening an existing prompt.
  const openEditPrompt = async (prompt) => {
    try {
      setSaving(true);
      setError("");

      const response = unwrap(
        await aiAdminService.getPromptHistory(prompt.promptKey)
      );

      const history = getArray(
        response?.versions ??
        response?.history ??
        response
      );

      const selected =
        history.find((item) => item.id === prompt.id) ||
        history[0] ||
        prompt.versionRecord ||
        prompt;

      const parsed = parsePromptContent(
        selected.content || selected.promptContent
      );

      setEditingPromptId(selected.id || prompt.id);

      setPromptForm({
        name: prompt.name,
        module: prompt.module,
        description: selected.description || prompt.description || "",
        content: parsed.systemInstruction,
        promptTemplate: parsed.promptTemplate,
        promptKey: prompt.promptKey,
      });

      setShowPromptModal(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const openCreatePrompt = () => {
    setEditingPromptId(null);

    setPromptForm({
      name: "",
      module: "Writing",
      description: "",
      content: "",
      promptTemplate: "",
      promptKey: "",
    });

    setShowPromptModal(true);
  };

  // Create a new draft or update an existing draft.
  const savePrompt = async (event) => {
    event.preventDefault();

    if (!promptForm.name.trim()) {
      setError("Prompt name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const promptKey =
        promptForm.promptKey ||
        getPromptKey(promptForm.module, promptForm.name);

      const payload = {
        promptKey,
        description: promptForm.description.trim(),
        systemInstruction: promptForm.content,
        promptTemplate: promptForm.promptTemplate,
      };

      if (editingPromptId) {
        await aiAdminService.updatePrompt(editingPromptId, payload);
      } else {
        await aiAdminService.createPrompt(payload);
      }

      await loadPrompts();

      setShowPromptModal(false);
      setNotice(
        editingPromptId
          ? "Prompt draft updated successfully."
          : "Prompt draft created successfully."
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // Publish a prompt or roll back to a previous version.
  const togglePromptStatus = async (prompt) => {
    try {
      setSaving(true);
      setError("");

      const promptId = getPromptId(prompt.versionRecord || prompt);

      if (!promptId) {
        throw new Error("A valid prompt version ID was not found.");
      }

      if (prompt.status === "Published") {
        const olderVersion = (prompt.versions || [])
          .filter((version) => version.id !== promptId)
          .sort(
            (a, b) =>
              Number(b.versionNumber || b.version || 0) -
              Number(a.versionNumber || a.version || 0)
          )[0];

        if (!olderVersion?.id) {
          throw new Error(
            "No previous prompt version is available for rollback."
          );
        }

        await aiAdminService.rollbackPrompt(olderVersion.id);
      } else {
        await aiAdminService.publishPrompt(promptId);
      }

      await loadPrompts();

      setNotice(
        prompt.status === "Published"
          ? "Prompt rolled back successfully."
          : "Prompt published successfully."
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Settings and limits API
  // --------------------------------------------------

  const loadSettings = useCallback(async () => {
    const [configResponse, limitsResponse] = await Promise.all([
      aiAdminService.getConfig(),
      aiAdminService.getLimits(),
    ]);

    const config = unwrap(configResponse);
    const limitData = unwrap(limitsResponse);

    setSettings({
      defaultProvider: config.defaultProvider || "gemini",
      defaultModel: config.defaultModel || "",
      writingModel: config.writingModel || "",
      speakingModel: config.speakingModel || "",
      transcriptionModel: config.transcriptionModel || "",
      temperature: String(config.temperature ?? 0.2),
      maxTokens: String(config.maxOutputTokens ?? 4096),
      alertsEnabled: Boolean(config.alertsEnabled),
      evaluationEnabled: Boolean(config.evaluationEnabled),
      loggingEnabled: Boolean(config.loggingEnabled),
    });

    setLimits({
      dailyBudget: String(limitData.dailyBudget ?? 0),
      monthlyBudget: String(limitData.monthlyBudget ?? 0),
      freeDailyLimit: String(limitData.freeDailyLimit ?? 0),
      proDailyLimit: String(limitData.proDailyLimit ?? 0),
      instituteDailyLimit: String(limitData.instituteDailyLimit ?? 0),
      alertsEnabled: Boolean(limitData.alertsEnabled),
    });
  }, []);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateLimit = (key, value) => {
    setLimits((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  // Save supported configuration and limit fields separately.
  const saveSettings = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const configPayload = {
        defaultProvider: settings.defaultProvider,
        defaultModel: settings.defaultModel,
        writingModel: settings.writingModel,
        speakingModel: settings.speakingModel,
        transcriptionModel: settings.transcriptionModel,
        temperature: Number(settings.temperature),
        maxOutputTokens: Number(settings.maxTokens),
        alertsEnabled: Boolean(settings.alertsEnabled),
        evaluationEnabled: Boolean(settings.evaluationEnabled),
        loggingEnabled: Boolean(settings.loggingEnabled),
      };

      const limitsPayload = {
        dailyBudget: Number(limits.dailyBudget),
        monthlyBudget: Number(limits.monthlyBudget),
        freeDailyLimit: Number(limits.freeDailyLimit),
        proDailyLimit: Number(limits.proDailyLimit),
        instituteDailyLimit: Number(limits.instituteDailyLimit),
        alertsEnabled: Boolean(settings.alertsEnabled),
      };

      await aiAdminService.updateConfig(configPayload);
      await aiAdminService.updateLimits(limitsPayload);

      await loadSettings();

      setShowSettingsModal(false);
      setNotice("AI configuration saved successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Usage API
  // --------------------------------------------------

  const loadUsage = useCallback(async () => {
    const [summaryResponse, breakdownResponse, trendsResponse] =
      await Promise.all([
        aiAdminService.getUsageSummary(),
        aiAdminService.getUsageBreakdown(),
        aiAdminService.getUsageTrends(),
      ]);

    const summary = unwrap(summaryResponse);
    const breakdown = unwrap(breakdownResponse);
    const trends = unwrap(trendsResponse);

    setUsageSummary(summary);
    setUsageBreakdown(
      getArray(breakdown?.breakdown ?? breakdown?.items ?? breakdown)
    );
    setUsageTrends(
      getArray(trends?.trends ?? trends?.items ?? trends)
    );
  }, []);

  // Download the CSV generated by the backend.
  const exportUsageCSV = async () => {
    try {
      setSaving(true);

      const blob = await aiAdminService.exportUsage();

      const fileBlob =
        blob instanceof Blob
          ? blob
          : new Blob([blob], { type: "text/csv;charset=utf-8;" });

      const url = URL.createObjectURL(fileBlob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "equilx-ai-usage-report.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setNotice("Usage report exported successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Quality API
  // --------------------------------------------------

  const loadQuality = useCallback(async () => {
    const [summaryResponse, breakdownResponse, trendsResponse] =
      await Promise.all([
        aiAdminService.getQualitySummary(),
        aiAdminService.getQualityBreakdown(),
        aiAdminService.getQualityTrends(),
      ]);

    const summary = unwrap(summaryResponse);
    const breakdown = unwrap(breakdownResponse);
    const trends = unwrap(trendsResponse);

    setQualitySummary(summary);
    setQualityBreakdown(breakdown);
    setQualityTrends(
      getArray(trends?.trends ?? trends?.items ?? trends)
    );
  }, []);

  // --------------------------------------------------
  // Initial loading and refresh
  // --------------------------------------------------

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError("");

    // Load independent sections separately so one failed API
    // does not prevent the other sections from displaying data.
    const tasks = [
      loadModels(),
      loadPrompts(),
      loadSettings(),
      loadUsage(),
      loadQuality(),
    ];

    const results = await Promise.allSettled(tasks);

    const failed = results.find(
      (result) => result.status === "rejected"
    );

    if (failed) {
      setError(getErrorMessage(failed.reason));
    }

    setLoading(false);
  }, [
    loadModels,
    loadPrompts,
    loadSettings,
    loadUsage,
    loadQuality,
  ]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const refreshActiveTab = async () => {
    setLoading(true);
    setError("");

    try {
      if (activeTab === "Models") await loadModels();
      else if (activeTab === "Prompts") await loadPrompts();
      else if (activeTab === "Usage & Cost") await loadUsage();
      else if (activeTab === "Quality") await loadQuality();
      else await loadInitialData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Derived data
  // --------------------------------------------------

  const totalRequests = Number(usageSummary?.totalRequests || 0);

  const totalTokens = Number(
    usageSummary?.totalTokens ||
    (
      Number(usageSummary?.totalInputTokens || 0) +
      Number(usageSummary?.totalOutputTokens || 0)
    )
  );

  const currencies = usageSummary?.currencies || [];

  const activeModels = models.filter((model) => model.active).length;

  const writingAverage =
    qualityBreakdown?.writing?.averageOverallBand ??
    qualityBreakdown?.writing?.overallAverage ??
    null;

  const speakingAverage =
    qualityBreakdown?.speaking?.averageOverallBand ??
    qualityBreakdown?.speaking?.overallAverage ??
    null;

  const qualityValues = [
    writingAverage,
    speakingAverage,
  ].filter((value) => value !== null && value !== undefined);

  const averageQuality =
    qualityValues.length > 0
      ? qualityValues.reduce((sum, value) => sum + Number(value), 0) /
        qualityValues.length
      : null;

  const filteredUsage = useMemo(() => {
    const term = search.toLowerCase().trim();

    return usageBreakdown.filter((item) => {
      const modelName =
        item.model?.modelName ||
        item.modelName ||
        "";

      return [
        item.jobType,
        item.currency,
        modelName,
        item.model?.provider,
      ].some((value) =>
        String(value || "").toLowerCase().includes(term)
      );
    });
  }, [usageBreakdown, search]);

  const filteredPrompts = useMemo(() => {
    const term = search.toLowerCase().trim();

    return prompts.filter((item) => {
      const matchesSearch = [
        item.name,
        item.module,
        item.version,
        item.description,
        item.promptKey,
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
      [
        item.name,
        item.provider,
        item.purpose,
        item.status,
      ].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [models, search]);

  const resetSearch = () => {
    setSearch("");
    setPromptFilter("All Status");
  };

  const modelOptions = useMemo(
    () => models.map((model) => model.name).filter(Boolean),
    [models]
  );

  const costCurrencies = currencies.length
    ? currencies
    : [];

  const getCostLabel = (currencyItem) =>
    formatMoney(
      currencyItem.estimatedCost ?? currencyItem.cost,
      currencyItem.currency
    );

  const totalCostLabel =
    costCurrencies.length > 0
      ? costCurrencies.map(getCostLabel).join(" · ")
      : formatMoney(usageSummary?.estimatedCost, "USD");

  const qualityCards = [
    {
      label: "Writing Evaluation",
      score: writingAverage,
    },
    {
      label: "Speaking Evaluation",
      score: speakingAverage,
    },
  ];

  const getBreakdownMetric = (key) =>
    qualityBreakdown?.[key] || {};

  const criterionCards = [
    {
      label: "Task Achievement",
      value:
        getBreakdownMetric("writing").averageTaskAchievement ??
        getBreakdownMetric("writing").taskAchievement,
    },
    {
      label: "Coherence & Cohesion",
      value:
        getBreakdownMetric("writing").averageCoherenceCohesion ??
        getBreakdownMetric("writing").coherenceCohesion,
    },
    {
      label: "Lexical Resource",
      value:
        getBreakdownMetric("writing").averageLexicalResource ??
        getBreakdownMetric("writing").lexicalResource,
    },
    {
      label: "Grammar",
      value:
        getBreakdownMetric("writing").averageGrammar ??
        getBreakdownMetric("writing").grammaticalRangeAccuracy,
    },
    {
      label: "Fluency & Coherence",
      value:
        getBreakdownMetric("speaking").averageFluencyCoherence ??
        getBreakdownMetric("speaking").fluencyCoherence,
    },
    {
      label: "Pronunciation",
      value:
        getBreakdownMetric("speaking").averagePronunciation ??
        getBreakdownMetric("speaking").pronunciation,
    },
  ];

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

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

            <div className="flex flex-wrap gap-2">
              <button
                onClick={refreshActiveTab}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>

              <button
                onClick={() => setShowSettingsModal(true)}
                disabled={!settings || !limits}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e91d49] disabled:opacity-50"
              >
                <Settings2 size={18} />
                AI Configuration
              </button>
            </div>
          </div>

          {/* API error */}
          {error && (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <div className="flex items-start gap-2">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={17} />
              </button>
            </div>
          )}

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
              Backend monitoring
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
                  Live data
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-500">Total AI Requests</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {formatNumber(totalRequests)}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Recorded AI usage requests
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-pink-50 p-3 text-[#FF2454]">
                  <DollarSign size={21} />
                </div>
                <span className="text-xs text-slate-400">Recorded cost</span>
              </div>

              <p className="mt-5 text-sm text-slate-500">Estimated AI Cost</p>
              <h2 className="mt-1 break-words text-2xl font-bold text-[#10265F]">
                {totalCostLabel}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Recorded provider cost
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
                Registered model entries
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <ShieldCheck size={21} />
                </div>
                <span className="text-xs font-medium text-slate-400">
                  IELTS band
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-500">
                Average Quality Score
              </p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {averageQuality === null
                  ? "—"
                  : `${averageQuality.toFixed(2)}/9`}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Writing and speaking evaluation average
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

            {loading && (
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3 text-xs text-slate-500">
                <RefreshCw size={14} className="animate-spin" />
                Loading backend data...
              </div>
            )}

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
                        Models registered in the backend
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
                    {models.slice(0, 5).map((model) => (
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

                    {models.length === 0 && (
                      <p className="text-sm text-slate-400">
                        No model records available.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#10265F]">
                        Evaluation Quality
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Average IELTS evaluation bands
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
                    {qualityCards.map((item) => (
                      <div key={item.label}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-slate-600">
                            {item.label}
                          </span>
                          <span className="text-sm font-bold text-[#10265F]">
                            {item.score === null || item.score === undefined
                              ? "—"
                              : `${Number(item.score).toFixed(2)}/9`}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-[#10265F]"
                            style={{
                              width: `${
                                item.score == null
                                  ? 0
                                  : Math.min(100, Number(item.score) / 9 * 100)
                              }%`,
                            }}
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
                        Usage by Model and Job Type
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Compare recorded AI request volume.
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
                    {usageBreakdown.slice(0, 5).map((item, index) => {
                      const maxRequests = Math.max(
                        1,
                        ...usageBreakdown.map((entry) =>
                          Number(entry.requests || entry.totalRequests || 0)
                        )
                      );

                      const requests = Number(
                        item.requests || item.totalRequests || 0
                      );

                      const percentage = Math.min(
                        100,
                        (requests / maxRequests) * 100
                      );

                      const modelName =
                        item.model?.modelName ||
                        item.modelName ||
                        "Unknown model";

                      return (
                        <div key={`${modelName}-${item.jobType}-${index}`}>
                          <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                            <span className="text-sm font-medium text-slate-600">
                              {modelName} · {item.jobType || "Other"}
                            </span>
                            <span className="text-xs text-slate-500">
                              {formatNumber(requests)} requests
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

                    {usageBreakdown.length === 0 && (
                      <p className="text-sm text-slate-400">
                        No usage breakdown available.
                      </p>
                    )}
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
                        Configure model selection, output token limits,
                        budgets and monitoring preferences.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowSettingsModal(true)}
                    disabled={!settings || !limits}
                    className="shrink-0 rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#193778] disabled:opacity-50"
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
                      View registered models and manage activation.
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
                            —
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-[#10265F]">
                            —
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge status={model.status} />
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => toggleModel(model)}
                              disabled={saving}
                              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                                model.active
                                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            >
                              <Power size={14} />
                              {model.active ? "Disable" : "Enable"}
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
            )}

            {/* Prompts */}
            {activeTab === "Prompts" && (
              <div>
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:px-6">
                  <div>
                    <h3 className="font-bold text-[#10265F]">
                      Prompt Library
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Manage prompt drafts, versions and publication status.
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
                      key={prompt.id || prompt.promptKey}
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
                        {prompt.description || "No description provided."}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <span className="text-xs text-slate-400">
                          Updated {prompt.updated}
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditPrompt(prompt)}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            onClick={() => togglePromptStatus(prompt)}
                            disabled={saving}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#10265F] hover:bg-blue-100 disabled:opacity-50"
                          >
                            {prompt.status === "Published"
                              ? "Rollback"
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
                      Review recorded usage by model, job type and currency.
                    </p>
                  </div>

                  <button
                    onClick={exportUsageCSV}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
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
                        {formatNumber(totalRequests)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-pink-50/70 p-4">
                      <p className="text-xs text-slate-500">
                        Total tokens
                      </p>
                      <p className="mt-2 text-2xl font-bold text-[#10265F]">
                        {formatTokens(totalTokens)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50/70 p-4">
                      <p className="text-xs text-slate-500">
                        Monthly budget
                      </p>
                      <p className="mt-2 text-2xl font-bold text-[#10265F]">
                        {limits?.monthlyBudget
                          ? Number(limits.monthlyBudget).toLocaleString("en-IN")
                          : "—"}
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
                      placeholder="Search job type or model..."
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#10265F]"
                    />
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full min-w-[800px] text-left">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                        <tr>
                          <th className="px-4 py-4 font-semibold">
                            Job Type
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
                            Currency
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {filteredUsage.map((item, index) => {
                          const inputTokens = Number(
                            item.inputTokens ||
                            item.totalInputTokens ||
                            0
                          );

                          const outputTokens = Number(
                            item.outputTokens ||
                            item.totalOutputTokens ||
                            0
                          );

                          const tokens = Number(
                            item.totalTokens ||
                            inputTokens + outputTokens
                          );

                          const modelName =
                            item.model?.modelName ||
                            item.modelName ||
                            "Unknown model";

                          return (
                            <tr
                              key={`${modelName}-${item.jobType}-${item.currency}-${index}`}
                              className="hover:bg-slate-50/70"
                            >
                              <td className="px-4 py-4">
                                <p className="text-sm font-semibold text-[#10265F]">
                                  {item.jobType || "Other"}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                  {item.model?.provider || item.provider || "—"}
                                </p>
                              </td>

                              <td className="px-4 py-4 text-sm text-slate-600">
                                {modelName}
                              </td>

                              <td className="px-4 py-4 text-sm text-slate-600">
                                {formatNumber(
                                  item.requests || item.totalRequests
                                )}
                              </td>

                              <td className="px-4 py-4 text-sm text-slate-600">
                                {formatTokens(tokens)}
                              </td>

                              <td className="px-4 py-4 text-sm font-bold text-[#10265F]">
                                {formatMoney(
                                  item.estimatedCost ?? item.cost,
                                  item.currency || "USD"
                                )}
                              </td>

                              <td className="px-4 py-4 text-sm text-slate-600">
                                {item.currency || "USD"}
                              </td>
                            </tr>
                          );
                        })}
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
                    Actual writing and speaking evaluation band averages.
                    IELTS band scores are measured from 0 to 9.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {qualityCards.map((item) => (
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
                            item.score === null ||
                            item.score === undefined
                              ? "Draft"
                              : "Active"
                          }
                        />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-slate-600">
                        {item.label}
                      </p>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#10265F]">
                          {item.score === null ||
                          item.score === undefined
                            ? "—"
                            : Number(item.score).toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400">
                          out of 9
                        </span>
                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#10265F]"
                          style={{
                            width: `${
                              item.score == null
                                ? 0
                                : Math.min(100, Number(item.score) / 9 * 100)
                            }%`,
                          }}
                        />
                      </div>

                      <p className="mt-3 text-xs text-slate-400">
                        {item.score == null
                          ? "No completed evaluations available."
                          : "Average overall IELTS band from recorded evaluations."}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-slate-100 p-5">
                  <h4 className="font-bold text-[#10265F]">
                    Criterion Breakdown
                  </h4>

                  <p className="mt-1 text-xs text-slate-500">
                    Average criterion bands returned by the evaluation service.
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {criterionCards.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl bg-slate-50 p-4"
                      >
                        <p className="text-sm font-medium text-slate-600">
                          {item.label}
                        </p>
                        <p className="mt-2 text-2xl font-bold text-[#10265F]">
                          {item.value == null
                            ? "—"
                            : `${Number(item.value).toFixed(2)}/9`}
                        </p>
                      </div>
                    ))}
                  </div>
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
                        These metrics represent recorded evaluation scores.
                        Measuring AI grading accuracy requires comparison
                        against reviewed benchmark answers and human-review
                        outcomes.
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
      {showSettingsModal && settings && limits && (
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
                  ["transcriptionModel", "Transcription Model"],
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
                      <option value="">Select a model</option>
                      {modelOptions.map((modelName) => (
                        <option key={modelName} value={modelName}>
                          {modelName}
                        </option>
                      ))}
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
                    max="32768"
                    value={settings.maxTokens}
                    onChange={(event) =>
                      updateSetting("maxTokens", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Daily Budget
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={limits.dailyBudget}
                    onChange={(event) =>
                      updateLimit("dailyBudget", event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Monthly Budget
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={limits.monthlyBudget}
                    onChange={(event) =>
                      updateLimit("monthlyBudget", event.target.value)
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
                        value={limits[key]}
                        onChange={(event) =>
                          updateLimit(key, event.target.value)
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
                      checked={Boolean(settings[key])}
                      onChange={(event) =>
                        updateSetting(key, event.target.checked)
                      }
                      className="h-4 w-4 accent-[#FF2454]"
                    />
                  </label>
                ))}
              </div>

              <p className="text-xs leading-5 text-slate-400">
                Configuration is saved through the AI administration APIs.
                Only fields supported by the backend are included.
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
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e91d49] disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Configuration"}
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
                  {editingPromptId ? "Edit Prompt Draft" : "Create Prompt"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Configure the prompt instructions and template.
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

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Module
                </label>

                <select
                  value={promptForm.module}
                  disabled={Boolean(editingPromptId)}
                  onChange={(event) =>
                    setPromptForm({
                      ...promptForm,
                      module: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F] disabled:opacity-60"
                >
                  <option>Writing</option>
                  <option>Speaking</option>
                  <option>Transcription</option>
                </select>
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
                  System Instructions
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
                  placeholder="Write system instructions or evaluation criteria..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm leading-6 outline-none focus:border-[#10265F]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Prompt Template
                </label>

                <textarea
                  rows={4}
                  value={promptForm.promptTemplate}
                  onChange={(event) =>
                    setPromptForm({
                      ...promptForm,
                      promptTemplate: event.target.value,
                    })
                  }
                  placeholder="Write the prompt template..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm leading-6 outline-none focus:border-[#10265F]"
                />
              </div>

              <p className="text-xs leading-5 text-slate-400">
                New prompts are saved as drafts. The backend manages version
                numbers and publication status.
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
                  disabled={saving}
                  className="rounded-xl bg-[#FF2454] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e91d49] disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingPromptId
                      ? "Save Changes"
                      : "Create Prompt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {(notice || error) && (
        <div className="fixed bottom-5 right-5 z-[80] flex max-w-sm items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#10265F] shadow-lg">
          {error ? (
            <AlertTriangle
              size={18}
              className="shrink-0 text-red-600"
            />
          ) : (
            <CheckCircle2
              size={18}
              className="shrink-0 text-emerald-600"
            />
          )}

          <span>{error || notice}</span>

          <button
            onClick={() => {
              setNotice("");
              setError("");
            }}
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
