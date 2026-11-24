
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  BookOpen,
  FileText,
  Headphones,
  Mic,
  PlayCircle,
  ArrowRight,
  Clock,
  Bookmark,
  BookmarkCheck,
  GraduationCap,
  Target,
  X,
  CheckCircle2,
  ExternalLink,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import StudentLayout from "./StudentLayout";
import resourceService from "../../services/resourceService";

// =====================================================
// CONSTANTS
// =====================================================

const PAGE_LIMIT = 12;

const categories = [
  { name: "All Resources", icon: BookOpen },
  { name: "Grammar", icon: FileText },
  { name: "Vocabulary", icon: BookOpen },
  { name: "Exam Strategies", icon: Target },
  { name: "Sample Essays", icon: FileText },
  { name: "Video Lessons", icon: PlayCircle },
  { name: "Audio Library", icon: Headphones },
];

const resourceImages = [
  "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=85",
];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1000&q=85";

const colorStyles = {
  rose: {
    badge:
      "bg-[#FFE8EE] text-[#FF2454] dark:bg-[#49232F] dark:text-[#FF8CA5]",
    icon:
      "bg-[#FFF0F3] text-[#FF2454] dark:bg-[#49232F] dark:text-[#FF8CA5]",
  },
  purple: {
    badge:
      "bg-[#F1E8FF] text-[#873BFA] dark:bg-[#382747] dark:text-[#C59AFF]",
    icon:
      "bg-[#F3EAFF] text-[#873BFA] dark:bg-[#382747] dark:text-[#C59AFF]",
  },
  green: {
    badge:
      "bg-[#DDF8EE] text-[#009A69] dark:bg-[#203C34] dark:text-[#65D6AB]",
    icon:
      "bg-[#E5F9F1] text-[#00A879] dark:bg-[#203C34] dark:text-[#65D6AB]",
  },
  blue: {
    badge:
      "bg-[#E3F0FF] text-[#1680E8] dark:bg-[#20354C] dark:text-[#82BFFF]",
    icon:
      "bg-[#EAF4FF] text-[#1680E8] dark:bg-[#20354C] dark:text-[#82BFFF]",
  },
};

// =====================================================
// API RESPONSE HELPERS
// =====================================================

const getResponseData = (response) =>
  response?.data?.data ?? response?.data ?? response ?? {};

const getResourceList = (response) => {
  const data = getResponseData(response);

  if (Array.isArray(data)) return data;

  const list =
    data?.materials ??
    data?.resources ??
    data?.items ??
    data?.results ??
    [];

  return Array.isArray(list) ? list : [];
};

const getPagination = (response, currentPage) => {
  const data = getResponseData(response);
  const pagination = data?.pagination ?? data?.meta ?? {};

  const total = Number(
    pagination.total ?? pagination.totalItems ?? 0
  );

  const limit = Number(pagination.limit ?? PAGE_LIMIT);

  return {
    page: Number(
      pagination.page ?? pagination.currentPage ?? currentPage
    ),
    totalPages: Math.max(
      1,
      Number(
        pagination.totalPages ??
          pagination.pages ??
          (limit > 0 ? Math.ceil(total / limit) : 1)
      )
    ),
    total,
  };
};

const getResourceId = (resource) =>
  resource?.id ?? resource?._id ?? resource?.resourceId;

const getResourceTitle = (resource) =>
  resource?.title || resource?.name || "Untitled resource";

const getResourceDescription = (resource) =>
  resource?.description ||
  resource?.summary ||
  "Open this resource to view its details.";

const getResourceCategory = (resource) => {
  const category = resource?.category;
  return typeof category === "object"
    ? category?.name || "General"
    : category || "General";
};

const getResourceImage = (resource, index = 0) =>
  resource?.imageUrl ||
  resource?.image ||
  resource?.thumbnail ||
  resource?.thumbnailUrl ||
  resourceImages[index % resourceImages.length];

const getResourceColor = (category = "") => {
  const value = String(category).toLowerCase();

  if (
    value.includes("vocabulary") ||
    value.includes("speaking")
  ) {
    return "purple";
  }

  if (
    value.includes("audio") ||
    value.includes("grammar")
  ) {
    return "green";
  }

  if (
    value.includes("essay") ||
    value.includes("writing")
  ) {
    return "blue";
  }

  return "rose";
};

const getResourceCount = (resource) =>
  resource?.count ??
  resource?.lessonCount ??
  resource?.totalLessons ??
  resource?.totalItems ??
  resource?.type ??
  resource?.format ??
  "Study material";

const getResourceDuration = (resource) =>
  resource?.duration ??
  resource?.estimatedDuration ??
  resource?.readingTime ??
  "—";

const getResourceLevel = (resource) =>
  resource?.level || resource?.difficulty || "All levels";

const getResourceUrl = (resource) =>
  resource?.resourceUrl ||
  resource?.contentUrl ||
  resource?.fileUrl ||
  resource?.downloadUrl ||
  resource?.url ||
  "";

const getResourceIcon = (resource) => {
  const category = getResourceCategory(resource).toLowerCase();
  const type = String(resource?.type || "").toLowerCase();
  const value = `${category} ${type}`;

  if (
    value.includes("audio") ||
    value.includes("listening")
  ) {
    return Headphones;
  }

  if (value.includes("video")) return PlayCircle;
  if (value.includes("speaking")) return Mic;

  if (
    value.includes("essay") ||
    value.includes("writing")
  ) {
    return FileText;
  }

  if (value.includes("strategy")) return Target;

  return BookOpen;
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

// =====================================================
// REUSABLE COMPONENTS
// =====================================================

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#E7ECF6] bg-white p-4 shadow-[0_3px_14px_rgba(16,38,95,0.035)] dark:border-[#49333D] dark:bg-[#211e27] sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function LoadingCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[#E7ECF6] bg-white dark:border-[#49333D] dark:bg-[#211e27]">
      <div className="h-40 bg-[#EEF1F8] dark:bg-[#30232B]" />

      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 rounded bg-[#EEF1F8] dark:bg-[#30232B]" />
        <div className="h-4 w-4/5 rounded bg-[#EEF1F8] dark:bg-[#30232B]" />
        <div className="h-3 w-full rounded bg-[#EEF1F8] dark:bg-[#30232B]" />
        <div className="h-9 w-full rounded-xl bg-[#EEF1F8] dark:bg-[#30232B]" />
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#F3B7C3] bg-white px-5 py-12 text-center dark:border-[#71404D] dark:bg-[#211e27]">
      <AlertCircle
        size={32}
        className="mx-auto text-[#FF456C]"
      />

      <h3 className="mt-3 text-base font-extrabold">
        Unable to load resources
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#71809D] dark:text-[#AFA2AE]">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FF456C] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#E81745]"
      >
        <RefreshCw size={15} />
        Try again
      </button>
    </div>
  );
}

function EmptyState({
  onReset,
  savedOnly = false,
  hasFilters = false,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#DCE4F3] bg-white px-5 py-14 text-center dark:border-[#49333D] dark:bg-[#211e27]">
      {savedOnly ? (
        <Bookmark
          size={30}
          className="mx-auto text-[#8A9ABB]"
        />
      ) : (
        <Search
          size={30}
          className="mx-auto text-[#8A9ABB]"
        />
      )}

      <h3 className="mt-3 text-base font-extrabold">
        {savedOnly
          ? "No saved resources found"
          : "No resources found"}
      </h3>

      <p className="mt-2 text-sm text-[#71809D] dark:text-[#AFA2AE]">
        {savedOnly
          ? "Save a study resource to find it here later."
          : hasFilters
            ? "Try another search or category."
            : "No published study materials are available yet."}
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-xl bg-[#FF456C] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#E81745]"
      >
        {savedOnly ? "Browse resources" : "Reset filters"}
      </button>
    </div>
  );
}

function BookmarkButton({
  saved,
  busy,
  onClick,
  variant = "icon",
}) {
  const Icon = saved ? BookmarkCheck : Bookmark;

  if (variant === "featured") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        aria-label={saved ? "Remove bookmark" : "Save resource"}
        aria-pressed={saved}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#10265F] shadow-sm transition hover:text-[#FF456C] disabled:cursor-wait disabled:opacity-60 dark:bg-[#211e27]/95 dark:text-[#FFF8FA]"
      >
        {busy ? (
          <LoaderCircle size={17} className="animate-spin" />
        ) : (
          <Icon
            size={17}
            className={saved ? "text-[#FF456C]" : ""}
          />
        )}
      </button>
    );
  }

  if (variant === "modal") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        aria-pressed={saved}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#DCE4F3] px-4 py-3 text-sm font-bold text-[#506995] transition hover:bg-[#F5F7FF] disabled:cursor-wait disabled:opacity-60 dark:border-[#49333D] dark:text-[#C1B5C0] dark:hover:bg-[#30232B]"
      >
        {busy ? (
          <LoaderCircle size={17} className="animate-spin" />
        ) : (
          <Icon size={17} />
        )}
        {busy
          ? "Saving..."
          : saved
            ? "Saved"
            : "Save resource"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label={
        saved ? "Remove saved resource" : "Save resource"
      }
      aria-pressed={saved}
      className="shrink-0 text-[#71809D] transition hover:text-[#FF456C] disabled:cursor-wait disabled:opacity-60 dark:text-[#AFA2AE] dark:hover:text-[#FF8CA5]"
    >
      {busy ? (
        <LoaderCircle size={17} className="animate-spin" />
      ) : (
        <Icon
          size={17}
          className={saved ? "text-[#FF456C]" : ""}
        />
      )}
    </button>
  );
}

// =====================================================
// MAIN PAGE
// =====================================================

export default function StudyResourcesPage() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] =
    useState("All Resources");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [resources, setResources] = useState([]);
  const [savedResources, setSavedResources] =
    useState([]);
  const [savedIds, setSavedIds] = useState([]);

  const [selectedResource, setSelectedResource] =
    useState(null);

  const [showSavedOnly, setShowSavedOnly] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [bookmarksLoading, setBookmarksLoading] =
    useState(true);
  const [detailLoading, setDetailLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [bookmarkError, setBookmarkError] =
    useState("");
  const [detailError, setDetailError] =
    useState("");

  const [bookmarkBusyIds, setBookmarkBusyIds] =
    useState([]);

  const bookmarkBusyRef = useRef(new Set());
  const resourceRequestRef = useRef(0);
  const detailRequestRef = useRef(0);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // ===================================================
  // SEARCH DEBOUNCE
  // ===================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // ===================================================
  // FETCH BOOKMARKS FROM DATABASE
  // ===================================================

  const fetchBookmarks = useCallback(async () => {
    try {
      setBookmarksLoading(true);
      setBookmarkError("");

      const response =
        await resourceService.getBookmarks();

      const list = getResourceList(response);

      setSavedResources(list);

      setSavedIds(
        list
          .map(getResourceId)
          .filter(Boolean)
          .map(String)
      );

      return list;
    } catch (err) {
      console.error("Bookmarks API error:", err);

      setBookmarkError(
        getErrorMessage(
          err,
          "Unable to load saved resources."
        )
      );

      return null;
    } finally {
      setBookmarksLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // ===================================================
  // FETCH MATERIALS FROM DATABASE
  // ===================================================

  const fetchResources = useCallback(async () => {
    const requestId = ++resourceRequestRef.current;

    try {
      setLoading(true);
      setError("");

      const filters = {
        search: debouncedSearch,
        category:
          activeCategory === "All Resources"
            ? ""
            : activeCategory,
      };

      const response =
        await resourceService.getResources(
          page,
          PAGE_LIMIT,
          filters
        );

      if (requestId !== resourceRequestRef.current) {
        return;
      }

      setResources(getResourceList(response));
      setPagination(getPagination(response, page));
    } catch (err) {
      if (requestId !== resourceRequestRef.current) {
        return;
      }

      console.error("Study resources API error:", err);

      setResources([]);

      setError(
        getErrorMessage(
          err,
          "Something went wrong while loading study resources."
        )
      );
    } finally {
      if (requestId === resourceRequestRef.current) {
        setLoading(false);
      }
    }
  }, [page, debouncedSearch, activeCategory]);

  useEffect(() => {
    fetchResources();

    return () => {
      resourceRequestRef.current += 1;
    };
  }, [fetchResources]);

  // ===================================================
  // FILTERS AND FEATURED RESOURCES
  // ===================================================

  const filteredResources = useMemo(() => {
    if (!showSavedOnly) {
      return resources;
    }

    const keyword = debouncedSearch.toLowerCase();

    return savedResources.filter((resource) => {
      const categoryMatches =
        activeCategory === "All Resources" ||
        getResourceCategory(resource).toLowerCase() ===
          activeCategory.toLowerCase();

      const searchableText = [
        getResourceTitle(resource),
        getResourceDescription(resource),
        getResourceCategory(resource),
        resource?.type || "",
      ]
        .join(" ")
        .toLowerCase();

      return (
        categoryMatches &&
        (!keyword || searchableText.includes(keyword))
      );
    });
  }, [
    resources,
    savedResources,
    showSavedOnly,
    activeCategory,
    debouncedSearch,
  ]);

  const featuredResources = useMemo(
    () =>
      resources.filter(
        (resource) => resource?.featured === true
      ),
    [resources]
  );

  const displayedLoading = showSavedOnly
    ? bookmarksLoading
    : loading;

  const displayedError = showSavedOnly
    ? bookmarkError
    : error;

  const hasFilters =
    activeCategory !== "All Resources" ||
    Boolean(debouncedSearch);

  // ===================================================
  // CATEGORY AND RESET
  // ===================================================

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setActiveCategory("All Resources");
    setShowSavedOnly(false);
    setPage(1);
  };

  // ===================================================
  // REAL DATABASE BOOKMARK TOGGLE
  // ===================================================

  const toggleSaved = async (resource) => {
    const resourceId = getResourceId(resource);

    if (!resourceId) return;

    const id = String(resourceId);

    if (bookmarkBusyRef.current.has(id)) {
      return;
    }

    bookmarkBusyRef.current.add(id);

    setBookmarkBusyIds((previous) => [
      ...previous,
      id,
    ]);

    const wasSaved = savedIds.includes(id);

    setBookmarkError("");

    try {
      if (wasSaved) {
        await resourceService.removeBookmark(id);
      } else {
        await resourceService.addBookmark(id);
      }

      // Update the visible bookmark immediately after
      // the server confirms the write.
      setSavedIds((previous) =>
        wasSaved
          ? previous.filter((item) => item !== id)
          : previous.includes(id)
            ? previous
            : [...previous, id]
      );

      setSavedResources((previous) =>
        wasSaved
          ? previous.filter(
              (item) =>
                String(getResourceId(item)) !== id
            )
          : previous.some(
                (item) =>
                  String(getResourceId(item)) === id
              )
            ? previous
            : [...previous, resource]
      );

      // Reconcile with the actual database records.
      await fetchBookmarks();
    } catch (err) {
      console.error("Bookmark update error:", err);

      setBookmarkError(
        getErrorMessage(
          err,
          "Unable to update bookmark."
        )
      );

      await fetchBookmarks();
    } finally {
      bookmarkBusyRef.current.delete(id);

      setBookmarkBusyIds((previous) =>
        previous.filter((item) => item !== id)
      );
    }
  };

  // ===================================================
  // RESOURCE DETAILS
  // ===================================================

  const closeResource = () => {
    detailRequestRef.current += 1;
    setSelectedResource(null);
    setDetailError("");
    setDetailLoading(false);
  };

  
const openResource = async (resource) => {
  console.log("EXPLORE BUTTON CLICKED:", resource);

  const resourceId = getResourceId(resource);

  setSelectedResource(resource);
  setDetailError("");

  if (!resourceId) {
    setDetailError("Resource ID is missing.");
    return;
  }

  const requestId = ++detailRequestRef.current;

  try {
    setDetailLoading(true);

    const response =
      await resourceService.getResourceById(resourceId);

    console.log("RESOURCE DETAIL API RESPONSE:", response);

    if (requestId !== detailRequestRef.current) {
      return;
    }

    const data = getResponseData(response);

    const resourceDetail =
      data?.material || data?.resource || data;

    if (
      resourceDetail &&
      typeof resourceDetail === "object"
    ) {
      setSelectedResource((previous) => ({
        ...previous,
        ...resourceDetail,
      }));
    }
  } catch (err) {
    if (requestId !== detailRequestRef.current) {
      return;
    }

    console.error("Resource detail API error:", err);

    setDetailError(
      getErrorMessage(
        err,
        "Unable to load complete resource details."
      )
    );
  } finally {
    if (requestId === detailRequestRef.current) {
      setDetailLoading(false);
    }
  }
};

  // ===================================================
  // OPEN RESOURCE CONTENT
  // ===================================================

  const handleStartLearning = (resource) => {
    const resourceUrl = getResourceUrl(resource);

    if (resourceUrl) {
      // Permit ordinary web links, not javascript: URLs.
      try {
        const parsedUrl = new URL(
          resourceUrl,
          window.location.origin
        );

        if (
          parsedUrl.protocol === "https:" ||
          parsedUrl.protocol === "http:"
        ) {
          window.open(
            parsedUrl.href,
            "_blank",
            "noopener,noreferrer"
          );
          return;
        }
      } catch {
        // Invalid URLs are not opened.
      }

      setDetailError(
        "This resource has an invalid content URL."
      );
      return;
    }

    if (resource?.route?.startsWith("/")) {
      navigate(resource.route);
      return;
    }

    if (resource?.content) {
      document
        .getElementById("resource-inline-content")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      return;
    }

    setDetailError(
      "This material does not have a resource URL or content yet."
    );
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <StudentLayout>
      <div className="mx-auto max-w-[1800px] space-y-5 text-[#10265F] dark:text-[#FFF8FA]">

        {/* ============================================
            HERO
        ============================================ */}

        <section className="relative grid min-h-[220px] overflow-hidden rounded-2xl border border-[#E7ECF6] bg-gradient-to-r from-white via-[#F5F7FF] to-[#FFF0F4] dark:border-[#49333D] dark:from-[#211B22] dark:via-[#292029] dark:to-[#30232B] lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="relative z-10 p-5 sm:p-7">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF456C]">
              Study resources
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Learn. Practise.{" "}
              <span className="text-[#FF456C]">
                Improve.
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#506995] dark:text-[#C1B5C0] sm:text-base">
              Access study materials to support your
              IELTS preparation.
            </p>

            <div className="mt-5 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#49232F]">
                  <BookOpen size={19} />
                </span>

                <div>
                  <p className="text-xs font-extrabold">
                    Learn concepts
                  </p>
                  <p className="mt-1 text-[10px] text-[#71809D] dark:text-[#AFA2AE]">
                    Clear explanations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1E8FF] text-[#873BFA] dark:bg-[#382747] dark:text-[#C59AFF]">
                  <GraduationCap size={19} />
                </span>

                <div>
                  <p className="text-xs font-extrabold">
                    Build skills
                  </p>
                  <p className="mt-1 text-[10px] text-[#71809D] dark:text-[#AFA2AE]">
                    IELTS-focused content
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden min-h-[220px] lg:block">
            <img
              src={HERO_IMAGE}
              alt="Books and study resources"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#F5F7FF] via-[#F5F7FF]/15 to-transparent dark:from-[#211B22] dark:via-[#211B22]/30" />

            <div className="absolute bottom-4 right-4 rounded-xl border border-white bg-white/95 p-3 shadow-lg dark:border-[#49333D] dark:bg-[#211e27]/95">
              <p className="text-xs font-extrabold">
                Your learning library
              </p>
              <p className="mt-1 text-[10px] text-[#71809D] dark:text-[#C1B5C0]">
                Read, listen and practise
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
            BOOKMARK ERROR
        ============================================ */}

        {bookmarkError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          >
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />
            <span className="flex-1">
              {bookmarkError}
            </span>

            <button
              type="button"
              onClick={fetchBookmarks}
              aria-label="Retry loading bookmarks"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        )}

        {/* ============================================
            SEARCH AND CATEGORIES
        ============================================ */}

        <Panel className="space-y-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9ABB] dark:text-[#AFA2AE]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search study materials, grammar, vocabulary..."
              className="w-full rounded-xl border border-[#E1E7F3] bg-[#FAFBFF] py-3 pl-11 pr-4 text-sm text-[#10265F] outline-none transition placeholder:text-[#91A0BA] focus:border-[#FF8199] focus:bg-white dark:border-[#49333D] dark:bg-[#30232B] dark:text-[#FFF8FA] dark:placeholder:text-[#AFA2AE]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const active =
                activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() =>
                    handleCategoryChange(category.name)
                  }
                  className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold transition ${
                    active
                      ? "border-[#FF456C] bg-[#FF456C] text-white shadow-sm"
                      : "border-[#E7ECF6] bg-white text-[#506995] hover:border-[#FF9BAF] hover:text-[#FF456C] dark:border-[#49333D] dark:bg-[#30232B] dark:text-[#C1B5C0] dark:hover:text-[#FF8CA5]"
                  }`}
                >
                  <Icon size={16} />
                  {category.name}
                </button>
              );
            })}
          </div>
        </Panel>

        {/* ============================================
            FEATURED RESOURCES
        ============================================ */}

        {!showSavedOnly &&
          activeCategory === "All Resources" &&
          !debouncedSearch &&
          featuredResources.length > 0 && (
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-black">
                  Featured resources
                </h2>
                <p className="mt-1 text-xs text-[#71809D] dark:text-[#AFA2AE]">
                  Start with these learning materials.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {featuredResources.map(
                  (resource, index) => {
                    const id = String(
                      getResourceId(resource)
                    );
                    const saved = savedIds.includes(id);
                    const busy =
                      bookmarkBusyIds.includes(id);
                    const category =
                      getResourceCategory(resource);
                    const color =
                      getResourceColor(category);
                    const styles = colorStyles[color];

                    return (
                      <article
                        key={id}
                        className="group overflow-hidden rounded-2xl border border-[#E7ECF6] bg-white shadow-[0_3px_14px_rgba(16,38,95,0.035)] transition hover:-translate-y-1 hover:shadow-lg dark:border-[#49333D] dark:bg-[#211e27]"
                      >
                        <div className="relative h-40 overflow-hidden bg-[#F2F5FD] dark:bg-[#30232B]">
                          <img
                            src={getResourceImage(
                              resource,
                              index
                            )}
                            alt={getResourceTitle(
                              resource
                            )}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                          <div className="absolute left-3 top-3">
                            <span
                              className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${styles.badge}`}
                            >
                              {category}
                            </span>
                          </div>

                          <BookmarkButton
                            variant="featured"
                            saved={saved}
                            busy={busy}
                            onClick={() =>
                              toggleSaved(resource)
                            }
                          />
                        </div>

                        <div className="p-4">
                          <h3 className="text-sm font-extrabold leading-5">
                            {getResourceTitle(resource)}
                          </h3>

                          <p className="mt-2 min-h-[40px] text-xs leading-5 text-[#71809D] dark:text-[#AFA2AE]">
                            {getResourceDescription(
                              resource
                            )}
                          </p>

                          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#71809D] dark:text-[#AFA2AE]">
                            <FileText size={14} />
                            {getResourceCount(resource)}

                            <span className="ml-auto flex items-center gap-1">
                              <Clock size={13} />
                              {getResourceDuration(
                                resource
                              )}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              openResource(resource)
                            }
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#FF9BAF] bg-[#FFF7F9] py-2.5 text-xs font-bold text-[#FF456C] transition hover:bg-[#FF456C] hover:text-white dark:border-[#71404D] dark:bg-[#30232B] dark:text-[#FF8CA5] dark:hover:bg-[#FF456C] dark:hover:text-white"
                          >
                            Explore resource
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </section>
          )}

        {/* ============================================
            RESOURCE LIBRARY AND SIDEBAR
        ============================================ */}

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">
                  {showSavedOnly
                    ? "Saved resources"
                    : "Browse resources"}
                </h2>

                <p className="mt-1 text-xs text-[#71809D] dark:text-[#AFA2AE]">
                  {displayedLoading
                    ? "Loading resources..."
                    : `${filteredResources.length} resources ${
                        showSavedOnly
                          ? "found"
                          : "on this page"
                      }`}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowSavedOnly((value) => !value)
                }
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                  showSavedOnly
                    ? "border-[#FF456C] bg-[#FFF0F3] text-[#FF456C] dark:bg-[#49232F] dark:text-[#FF8CA5]"
                    : "border-[#DCE4F3] bg-white text-[#506995] hover:border-[#FF9BAF] dark:border-[#49333D] dark:bg-[#211e27] dark:text-[#C1B5C0]"
                }`}
              >
                {showSavedOnly ? (
                  <BookmarkCheck size={15} />
                ) : (
                  <Bookmark size={15} />
                )}

                {showSavedOnly
                  ? "Show all"
                  : "Saved"}
              </button>
            </div>

            {displayedError ? (
              <ErrorState
                message={displayedError}
                onRetry={
                  showSavedOnly
                    ? fetchBookmarks
                    : fetchResources
                }
              />
            ) : displayedLoading ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map(
                  (_, index) => (
                    <LoadingCard key={index} />
                  )
                )}
              </div>
            ) : filteredResources.length === 0 ? (
              <EmptyState
                onReset={resetFilters}
                savedOnly={showSavedOnly}
                hasFilters={hasFilters}
              />
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredResources.map(
                    (resource, index) => {
                      const id = String(
                        getResourceId(resource)
                      );

                      const category =
                        getResourceCategory(resource);

                      const color =
                        getResourceColor(category);

                      const styles =
                        colorStyles[color];

                      const Icon =
                        getResourceIcon(resource);

                      const saved =
                        savedIds.includes(id);

                      const busy =
                        bookmarkBusyIds.includes(id);

                      return (
                        <article
                          key={id}
                          className="flex gap-3 rounded-2xl border border-[#E7ECF6] bg-white p-3 transition hover:border-[#FFB4C2] hover:shadow-md dark:border-[#49333D] dark:bg-[#211e27] dark:hover:border-[#71404D] sm:p-4"
                        >
                          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F2F5FD] dark:bg-[#30232B] sm:h-28 sm:w-28">
                            <img
                              src={getResourceImage(
                                resource,
                                index
                              )}
                              alt={getResourceTitle(
                                resource
                              )}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className={`w-fit rounded-full px-2 py-1 text-[10px] font-bold ${styles.badge}`}
                              >
                                {category}
                              </span>

                              <BookmarkButton
                                saved={saved}
                                busy={busy}
                                onClick={() =>
                                  toggleSaved(resource)
                                }
                              />
                            </div>

                            <h3 className="mt-2 text-xs font-extrabold leading-5 sm:text-sm">
                              {getResourceTitle(
                                resource
                              )}
                            </h3>

                            <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#71809D] dark:text-[#AFA2AE]">
                              {getResourceDescription(
                                resource
                              )}
                            </p>

                            <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                              <span className="flex items-center gap-1 text-[10px] text-[#71809D] dark:text-[#AFA2AE]">
                                <Icon size={12} />
                                {getResourceCount(
                                  resource
                                )}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  openResource(resource)
                                }
                                className="flex items-center gap-1 text-[11px] font-bold text-[#FF456C] transition hover:text-[#E81745] dark:text-[#FF8CA5]"
                              >
                                Open
                                <ArrowRight size={13} />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>

                {/* PAGINATION */}

                {!showSavedOnly &&
                  pagination.totalPages > 1 && (
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-[#71809D] dark:text-[#AFA2AE]">
                        Page {pagination.page} of{" "}
                        {pagination.totalPages}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={
                            page <= 1 || loading
                          }
                          onClick={() =>
                            setPage((current) =>
                              Math.max(
                                1,
                                current - 1
                              )
                            )
                          }
                          className="flex items-center gap-1 rounded-lg border border-[#DCE4F3] px-3 py-2 text-xs font-bold transition hover:border-[#FF9BAF] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#49333D]"
                        >
                          <ChevronLeft size={15} />
                          Previous
                        </button>

                        <button
                          type="button"
                          disabled={
                            page >=
                              pagination.totalPages ||
                            loading
                          }
                          onClick={() =>
                            setPage((current) =>
                              current + 1
                            )
                          }
                          className="flex items-center gap-1 rounded-lg bg-[#FF456C] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#E81745] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Next
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  )}
              </>
            )}
          </section>

          {/* ==========================================
              RIGHT SIDEBAR
          ========================================== */}

          <aside className="space-y-4">
            <Panel>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#FF456C] dark:bg-[#49232F]">
                  <BookOpen size={19} />
                </span>

                <h3 className="text-sm font-extrabold">
                  Your resource library
                </h3>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                Browse the available learning materials
                and save resources that you want to
                revisit.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#F5F7FF] p-3 dark:bg-[#30232B]">
                  <p className="text-xl font-black">
                    {pagination.total}
                  </p>
                  <p className="mt-1 text-[10px] text-[#71809D] dark:text-[#AFA2AE]">
                    Available resources
                  </p>
                </div>

                <div className="rounded-xl bg-[#FFF0F3] p-3 dark:bg-[#49232F]">
                  <p className="text-xl font-black text-[#FF456C]">
                    {bookmarksLoading
                      ? "—"
                      : savedIds.length}
                  </p>
                  <p className="mt-1 text-[10px] text-[#71809D] dark:text-[#AFA2AE]">
                    Saved resources
                  </p>
                </div>
              </div>
            </Panel>

            <Panel className="border-[#FFE0E6] bg-gradient-to-br from-white to-[#FFF0F3] dark:border-[#71404D] dark:from-[#211e27] dark:to-[#30232B]">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFE1E8] text-[#FF456C] dark:bg-[#49232F] dark:text-[#FF8CA5]">
                  <Target size={19} />
                </span>

                <h3 className="text-sm font-extrabold">
                  Explore by category
                </h3>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                Select a category to find the study
                material you need.
              </p>

              <div className="mt-3 space-y-1">
                {categories.slice(1).map((category) => {
                  const Icon = category.icon;

                  return (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() =>
                        handleCategoryChange(
                          category.name
                        )
                      }
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white dark:hover:bg-[#30232B]"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#FF456C] dark:bg-[#30232B]">
                        <Icon size={17} />
                      </span>

                      <span className="min-w-0 flex-1 text-xs font-bold">
                        {category.name}
                      </span>

                      <ArrowRight
                        size={14}
                        className="text-[#8A9ABB] dark:text-[#AFA2AE]"
                      />
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel className="bg-gradient-to-br from-white to-[#F1F7FF] dark:from-[#211e27] dark:to-[#202D3A]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#1680E8] dark:bg-[#20354C] dark:text-[#82BFFF]">
                <GraduationCap size={21} />
              </div>

              <h3 className="mt-3 text-sm font-extrabold">
                Keep learning every day
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                Small, regular practice sessions can
                help you build confidence.
              </p>

              <button
                type="button"
                onClick={() => navigate("/practice")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF456C] py-3 text-xs font-bold text-white transition hover:bg-[#E81745]"
              >
                Start practice
                <ArrowRight size={15} />
              </button>
            </Panel>
          </aside>
        </div>

        <p className="pb-2 text-center text-[11px] text-[#9AA8C2] dark:text-[#807580]">
          Equilx IELTS · Learn. Practise. Improve.
        </p>
      </div>

      {/* ============================================
          RESOURCE DETAIL MODAL
      ============================================ */}

      {selectedResource && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#081633]/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeResource();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="resource-detail-title"
            className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl dark:border dark:border-[#49333D] dark:bg-[#211e27]"
          >
            <div className="relative h-52 bg-[#F2F5FD] dark:bg-[#30232B]">
              <img
                src={getResourceImage(
                  selectedResource
                )}
                alt={getResourceTitle(
                  selectedResource
                )}
                loading="lazy"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#10265F]/80 to-transparent" />

              <button
                type="button"
                onClick={closeResource}
                aria-label="Close resource details"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#10265F] transition hover:bg-[#FFF0F3] dark:bg-[#211e27] dark:text-white"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-4 left-5 right-5">
                <span
                  className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                    colorStyles[
                      getResourceColor(
                        getResourceCategory(
                          selectedResource
                        )
                      )
                    ].badge
                  }`}
                >
                  {getResourceCategory(
                    selectedResource
                  )}
                </span>

                <h2
                  id="resource-detail-title"
                  className="mt-3 text-xl font-black text-white"
                >
                  {getResourceTitle(
                    selectedResource
                  )}
                </h2>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-sm leading-6 text-[#506995] dark:text-[#C1B5C0]">
                {detailLoading
                  ? "Loading resource details..."
                  : getResourceDescription(
                      selectedResource
                    )}
              </p>

              {detailLoading && (
                <div className="mt-3 flex items-center gap-2 text-xs text-[#71809D]">
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />
                  Fetching resource details
                </div>
              )}

              {detailError && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
                >
                  {detailError}
                </div>
              )}

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-[#F5F7FF] p-3 text-center dark:bg-[#30232B]">
                  <FileText
                    size={18}
                    className="mx-auto text-[#FF456C]"
                  />
                  <p className="mt-2 break-words text-[11px] font-extrabold">
                    {getResourceCount(
                      selectedResource
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F5F7FF] p-3 text-center dark:bg-[#30232B]">
                  <Clock
                    size={18}
                    className="mx-auto text-[#873BFA]"
                  />
                  <p className="mt-2 break-words text-[11px] font-extrabold">
                    {getResourceDuration(
                      selectedResource
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F5F7FF] p-3 text-center dark:bg-[#30232B]">
                  <GraduationCap
                    size={18}
                    className="mx-auto text-[#00A879]"
                  />
                  <p className="mt-2 break-words text-[11px] font-extrabold">
                    {getResourceLevel(
                      selectedResource
                    )}
                  </p>
                </div>
              </div>

              {/* INLINE CONTENT FROM BACKEND */}

              {!detailLoading &&
                selectedResource?.content && (
                  <section
                    id="resource-inline-content"
                    className="mt-5 rounded-xl border border-[#E7ECF6] bg-[#FAFBFF] p-4 dark:border-[#49333D] dark:bg-[#30232B]"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <BookOpen
                        size={17}
                        className="text-[#FF456C]"
                      />

                      <h3 className="text-sm font-extrabold">
                        Study content
                      </h3>
                    </div>

                    <div className="whitespace-pre-wrap break-words text-sm leading-7 text-[#506995] dark:text-[#C1B5C0]">
                      {selectedResource.content}
                    </div>
                  </section>
                )}

              <div className="mt-5 rounded-xl border border-[#E7ECF6] bg-[#FAFBFF] p-3 dark:border-[#49333D] dark:bg-[#30232B]">
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-[#00A879]"
                  />

                  <p className="text-xs leading-5 text-[#506995] dark:text-[#C1B5C0]">
                    Resource information is loaded
                    from the Equilx API. Open the
                    resource to access its content
                    or linked learning material.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <BookmarkButton
                  variant="modal"
                  saved={savedIds.includes(
                    String(
                      getResourceId(
                        selectedResource
                      )
                    )
                  )}
                  busy={bookmarkBusyIds.includes(
                    String(
                      getResourceId(
                        selectedResource
                      )
                    )
                  )}
                  onClick={() =>
                    toggleSaved(
                      selectedResource
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    handleStartLearning(
                      selectedResource
                    )
                  }
                  disabled={
                    detailLoading ||
                    !(
                      getResourceUrl(
                        selectedResource
                      ) ||
                      selectedResource?.content ||
                      selectedResource?.route
                    )
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF456C] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#E81745] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Open resource
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
