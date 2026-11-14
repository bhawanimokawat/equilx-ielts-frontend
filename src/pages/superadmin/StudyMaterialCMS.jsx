import React, { useMemo, useRef, useState } from "react";

import {
  Search,
  Plus,
  Upload,
  FileText,
  FileAudio,
  FileVideo,
  FileImage,
  Download,
  Eye,
  Pencil,
  Trash2,
  X,
  BookOpen,
  CheckCircle2,
  Clock3,
  Filter,
  MoreVertical,
  FolderOpen,
  File,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const initialMaterials = [
  {
    id: 1,
    title: "IELTS Academic Writing Task 1 Guide",
    description: "A guide to charts, graphs, maps and process diagrams.",
    category: "Writing",
    level: "Intermediate",
    type: "PDF",
    size: "2.4 MB",
    status: "Published",
    updated: "26 Oct 2026",
    fileName: "writing-task-1-guide.pdf",
  },
  {
    id: 2,
    title: "Listening Practice: Daily Conversations",
    description: "Listening exercises with practice questions.",
    category: "Listening",
    level: "Beginner",
    type: "Audio",
    size: "8.1 MB",
    status: "Published",
    updated: "25 Oct 2026",
    fileName: "listening-practice.mp3",
  },
  {
    id: 3,
    title: "Academic Reading Vocabulary",
    description: "Common academic words with examples and meanings.",
    category: "Reading",
    level: "Intermediate",
    type: "PDF",
    size: "1.8 MB",
    status: "Draft",
    updated: "24 Oct 2026",
    fileName: "academic-vocabulary.pdf",
  },
  {
    id: 4,
    title: "Speaking Part 2: Cue Card Practice",
    description: "Cue card topics with useful answer structures.",
    category: "Speaking",
    level: "Advanced",
    type: "Document",
    size: "940 KB",
    status: "Published",
    updated: "23 Oct 2026",
    fileName: "speaking-cue-cards.docx",
  },
  {
    id: 5,
    title: "IELTS Grammar Essentials",
    description: "Grammar concepts for improving IELTS responses.",
    category: "Grammar",
    level: "Beginner",
    type: "PDF",
    size: "3.2 MB",
    status: "Draft",
    updated: "22 Oct 2026",
    fileName: "grammar-essentials.pdf",
  },
  {
    id: 6,
    title: "Writing Task 2 Essay Structure",
    description: "Essay planning, paragraph structure and examples.",
    category: "Writing",
    level: "Advanced",
    type: "Video",
    size: "45 MB",
    status: "Published",
    updated: "21 Oct 2026",
    fileName: "essay-structure.mp4",
  },
];

const categories = [
  "All Categories",
  "Listening",
  "Reading",
  "Writing",
  "Speaking",
  "Grammar",
  "Vocabulary",
  "General English",
];

const emptyForm = {
  title: "",
  description: "",
  category: "Writing",
  level: "Intermediate",
  type: "PDF",
  status: "Draft",
};

function getFileIcon(type) {
  if (type === "Audio") return FileAudio;
  if (type === "Video") return FileVideo;
  if (type === "Image") return FileImage;
  if (type === "Document") return FileText;
  return File;
}

function formatSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function StudyMaterialCMS() {
  const [materials, setMaterials] = useState(initialMaterials);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [type, setType] = useState("All Types");
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef(null);

  const filteredMaterials = useMemo(() => {
    const term = search.toLowerCase().trim();

    return materials.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);

      const matchesCategory =
        category === "All Categories" || item.category === category;

      const matchesStatus =
        status === "All Status" || item.status === status;

      const matchesType = type === "All Types" || item.type === type;

      return (
        matchesSearch && matchesCategory && matchesStatus && matchesType
      );
    });
  }, [materials, search, category, status, type]);

  const publishedCount = materials.filter(
    (item) => item.status === "Published"
  ).length;

  const draftCount = materials.filter(
    (item) => item.status === "Draft"
  ).length;

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedFile(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      category: item.category,
      level: item.level,
      type: item.type,
      status: item.status,
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    let detectedType = "Document";

    if (["pdf"].includes(extension)) detectedType = "PDF";
    else if (["mp3", "wav", "m4a", "ogg"].includes(extension))
      detectedType = "Audio";
    else if (["mp4", "mov", "webm"].includes(extension))
      detectedType = "Video";
    else if (["png", "jpg", "jpeg", "webp"].includes(extension))
      detectedType = "Image";

    setSelectedFile(file);
    setForm((previous) => ({ ...previous, type: detectedType }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setNotice("Please enter a material title.");
      return;
    }

    const now = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const existingItem = materials.find((item) => item.id === editingId);

    const newItem = {
      id: editingId || Date.now(),
      ...form,
      description: form.description.trim() || "No description added.",
      size: selectedFile
        ? formatSize(selectedFile.size)
        : existingItem?.size || "—",
      fileName: selectedFile
        ? selectedFile.name
        : existingItem?.fileName || "No file attached",
      updated: now,
    };

    setMaterials((previous) =>
      editingId
        ? previous.map((item) => (item.id === editingId ? newItem : item))
        : [newItem, ...previous]
    );

    setShowModal(false);
    setForm(emptyForm);
    setSelectedFile(null);
    setEditingId(null);
    setNotice(editingId ? "Material updated." : "Material added.");
  };

  const togglePublish = (item) => {
    const nextStatus =
      item.status === "Published" ? "Draft" : "Published";

    setMaterials((previous) =>
      previous.map((material) =>
        material.id === item.id
          ? { ...material, status: nextStatus }
          : material
      )
    );

    setNotice(`Material moved to ${nextStatus.toLowerCase()}.`);
  };

  const deleteMaterial = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this material?"
    );

    if (!confirmed) return;

    setMaterials((previous) => previous.filter((item) => item.id !== id));
    setNotice("Material deleted.");
  };

  const exportCSV = () => {
    const header = [
      "Title",
      "Category",
      "Level",
      "Type",
      "Status",
      "Updated",
      "File",
    ];

    const rows = filteredMaterials.map((item) => [
      item.title,
      item.category,
      item.level,
      item.type,
      item.status,
      item.updated,
      item.fileName,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [header, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "study-materials.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setStatus("All Status");
    setType("All Types");
  };

  return (
    <div className="study-material-cms min-h-screen bg-[#F5F7FF] text-[#172554]">
      <style>{`
        html.dark .study-material-cms {
          background: #17151B !important;
          color: #FFFFFF !important;
        }

        html.dark .study-material-cms [class~="bg-white"] {
          background-color: #211E27 !important;
        }

        html.dark .study-material-cms [class~="bg-slate-50"],
        html.dark .study-material-cms [class~="bg-slate-50/60"] {
          background-color: #19171E !important;
        }

        html.dark .study-material-cms [class~="bg-slate-100"] {
          background-color: #302A35 !important;
        }

        html.dark .study-material-cms [class~="border-slate-100"],
        html.dark .study-material-cms [class~="border-slate-200"] {
          border-color: #3B3441 !important;
        }

        html.dark .study-material-cms [class~="divide-slate-100"] > * + * {
          border-color: #3B3441 !important;
        }

        html.dark .study-material-cms [class~="text-[#10265F]"],
        html.dark .study-material-cms [class~="text-[#172554]"] {
          color: #FFFFFF !important;
        }

        html.dark .study-material-cms [class~="text-slate-700"],
        html.dark .study-material-cms [class~="text-slate-600"] {
          color: #D4CCDA !important;
        }

        html.dark .study-material-cms [class~="text-slate-500"],
        html.dark .study-material-cms [class~="text-slate-400"] {
          color: #B0A5BD !important;
        }

        html.dark .study-material-cms input,
        html.dark .study-material-cms textarea,
        html.dark .study-material-cms select {
          background-color: #211E27 !important;
          color: #FFFFFF !important;
          border-color: #3B3441 !important;
          color-scheme: dark;
        }

        html.dark .study-material-cms input::placeholder,
        html.dark .study-material-cms textarea::placeholder {
          color: #8F8498 !important;
        }

        html.dark .study-material-cms option {
          background: #211E27;
          color: #FFFFFF;
        }

        html.dark .study-material-cms [class~="hover:bg-slate-50"]:hover,
        html.dark .study-material-cms [class~="hover:bg-slate-50/70"]:hover,
        html.dark .study-material-cms [class~="hover:bg-slate-100"]:hover {
          background-color: #302A35 !important;
        }

        html.dark .study-material-cms [class~="hover:bg-blue-50"]:hover {
          background-color: #26334B !important;
        }

        html.dark .study-material-cms [class~="bg-blue-50"] {
          background-color: #26334B !important;
        }

        html.dark .study-material-cms [class~="text-blue-700"] {
          color: #A9C7FF !important;
        }

        html.dark .study-material-cms [class~="bg-pink-50"] {
          background-color: #3A202B !important;
        }

        html.dark .study-material-cms [class~="bg-slate-50"] {
          background-color: #19171E !important;
        }

        html.dark .study-material-cms [class~="border-dashed"] {
          border-color: #554653 !important;
        }

        html.dark .study-material-cms [class~="hover:border-[#10265F]"]:hover {
          border-color: #9BAED8 !important;
        }

        html.dark .study-material-cms [class~="hover:text-[#10265F]"]:hover {
          color: #FFFFFF !important;
        }

        html.dark .study-material-cms table thead {
          background-color: #211E27 !important;
        }

        html.dark .study-material-cms tr:hover {
          background-color: #29242F !important;
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
                <span className="text-[#FF2454]">Study Material CMS</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#10265F] sm:text-3xl">
                Study Material CMS
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Create, organize and publish IELTS learning resources for
                students and institutes.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2454] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e91d49]"
            >
              <Plus size={18} />
              Add Study Material
            </button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <BookOpen size={21} />
                </div>
                <span className="text-xs font-medium text-slate-400">
                  All resources
                </span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Total Materials</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {materials.length}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Available in the content library
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <CheckCircle2 size={21} />
                </div>
                <span className="text-xs font-medium text-emerald-600">
                  Live content
                </span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Published</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {publishedCount}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Visible to learners
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Clock3 size={21} />
                </div>
                <span className="text-xs font-medium text-amber-600">
                  Needs review
                </span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Draft Materials</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {draftCount}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Not yet published
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-pink-50 p-3 text-[#FF2454]">
                  <FolderOpen size={21} />
                </div>
                <span className="text-xs font-medium text-slate-400">
                  Categories
                </span>
              </div>
              <p className="mt-5 text-sm text-slate-500">Content Categories</p>
              <h2 className="mt-1 text-3xl font-bold text-[#10265F]">
                {categories.length - 1}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                IELTS and English learning
              </p>
            </div>
          </div>

          {/* Category quick filters */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold text-[#10265F]">
                  Browse by Category
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Quickly find resources by IELTS skill.
                </p>
              </div>
              <span className="text-xs text-slate-400">
                {filteredMaterials.length} resources shown
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((item) => {
                const selected = category === item;

                return (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      selected
                        ? "bg-[#10265F] text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-[#10265F] hover:text-[#10265F]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Main library */}
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-bold text-[#10265F]">Resource Library</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Manage learning content and publication status.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Download size={16} />
                  Export CSV
                </button>

                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <RefreshCw size={15} />
                  Reset filters
                </button>
              </div>
            </div>

            {/* Search and filters */}
            <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/60 p-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search materials..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#10265F] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="relative">
                <Filter
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-600 outline-none focus:border-[#10265F]"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
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

              <div className="relative">
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-600 outline-none focus:border-[#10265F]"
                >
                  <option>All Types</option>
                  <option>PDF</option>
                  <option>Audio</option>
                  <option>Video</option>
                  <option>Image</option>
                  <option>Document</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-white text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Material</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Level</th>
                    <th className="px-5 py-4 font-semibold">File Size</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Last Updated</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredMaterials.map((item) => {
                    const FileIcon = getFileIcon(item.type);

                    return (
                      <tr
                        key={item.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex min-w-[260px] items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#10265F]">
                              <FileIcon size={20} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#10265F]">
                                {item.title}
                              </p>
                              <p className="mt-1 truncate text-xs text-slate-400">
                                {item.fileName}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                            {item.category}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.level}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {item.size}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${
                              item.status === "Published"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.status === "Published"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            {item.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {item.updated}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              title="Preview"
                              onClick={() => setShowPreview(item)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              title="Edit"
                              onClick={() => openEditModal(item)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-[#10265F]"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              title={
                                item.status === "Published"
                                  ? "Move to draft"
                                  : "Publish"
                              }
                              onClick={() => togglePublish(item)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              {item.status === "Published" ? (
                                <Clock3 size={16} />
                              ) : (
                                <CheckCircle2 size={16} />
                              )}
                            </button>
                            <button
                              title="Delete"
                              onClick={() => deleteMaterial(item.id)}
                              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile resource cards */}
            <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
              {filteredMaterials.map((item) => {
                const FileIcon = getFileIcon(item.type);

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-100 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-[#10265F]">
                        <FileIcon size={21} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-[#10265F]">
                          {item.title}
                        </h3>
                        <p className="mt-1 break-all text-xs text-slate-400">
                          {item.fileName}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600">
                            {item.category}
                          </span>
                          <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600">
                            {item.level}
                          </span>
                          <span
                            className={`rounded-lg px-2 py-1 text-xs font-medium ${
                              item.status === "Published"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => openEditModal(item)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        aria-label="Edit material"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xs text-slate-400">
                        {item.size} · {item.updated}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setShowPreview(item)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                          aria-label="Preview material"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => togglePublish(item)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                          aria-label="Change publication status"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteMaterial(item.id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete material"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredMaterials.length === 0 && (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Search size={24} />
                </div>
                <h3 className="mt-4 font-semibold text-[#10265F]">
                  No materials found
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
                Showing {filteredMaterials.length} of {materials.length} materials
              </span>
              <span>Study Material Content Management</span>
            </div>
          </section>

          {notice && (
            <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#10265F] shadow-lg">
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
        </main>
      </div>

      {/* Add / edit material modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#10265F]">
                  {editingId ? "Edit Study Material" : "Add Study Material"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Add the resource details and choose a file.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 p-5 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Material Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="e.g. IELTS Reading Practice Guide"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Briefly describe this learning resource..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#10265F] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                  >
                    {categories.slice(1).map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Difficulty Level
                  </label>
                  <select
                    value={form.level}
                    onChange={(event) =>
                      setForm({ ...form, level: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>All Levels</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    File Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(event) =>
                      setForm({ ...form, type: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#10265F]"
                  >
                    <option>PDF</option>
                    <option>Audio</option>
                    <option>Video</option>
                    <option>Image</option>
                    <option>Document</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Publication Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
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
                  Upload Resource File
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.mp3,.wav,.m4a,.ogg,.mp4,.mov,.webm,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-4 py-7 text-center transition hover:border-[#FF2454] hover:bg-pink-50/30"
                >
                  <div className="rounded-xl bg-pink-50 p-3 text-[#FF2454]">
                    <Upload size={22} />
                  </div>
                  <span className="mt-3 text-sm font-semibold text-[#10265F]">
                    {selectedFile
                      ? selectedFile.name
                      : "Click to upload a resource"}
                  </span>
                  <span className="mt-1 text-xs text-slate-400">
                    PDF, documents, audio, video or image
                  </span>
                  {selectedFile && (
                    <span className="mt-2 text-xs text-emerald-600">
                      {formatSize(selectedFile.size)} selected
                    </span>
                  )}
                </button>

                <p className="mt-2 text-xs text-slate-400">
                  File selection is a frontend demo. Connect a backend or
                  storage service to save files permanently.
                </p>
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
                  className="rounded-xl bg-[#FF2454] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e91d49]"
                >
                  {editingId ? "Save Changes" : "Add Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-[#10265F]">Material Details</h2>
              <button
                onClick={() => setShowPreview(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close preview"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#10265F]">
                {React.createElement(getFileIcon(showPreview.type), {
                  size: 30,
                })}
              </div>

              <h3 className="mt-4 text-xl font-bold text-[#10265F]">
                {showPreview.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {showPreview.description}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ["Category", showPreview.category],
                  ["Level", showPreview.level],
                  ["File type", showPreview.type],
                  ["File size", showPreview.size],
                  ["Status", showPreview.status],
                  ["Updated", showPreview.updated],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl bg-slate-50 p-3"
                  >
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 break-words text-sm font-semibold text-[#10265F]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-slate-100 p-3">
                <p className="text-xs text-slate-400">Attached file</p>
                <p className="mt-1 break-all text-sm font-medium text-slate-700">
                  {showPreview.fileName}
                </p>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                This preview displays resource metadata. Actual file preview
                requires a saved file URL or a connected storage service.
              </p>

              <button
                onClick={() => {
                  openEditModal(showPreview);
                  setShowPreview(null);
                }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#10265F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#193778]"
              >
                <Pencil size={16} />
                Edit Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}