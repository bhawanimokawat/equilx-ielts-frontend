
import React, { useCallback, useEffect, useMemo, useState } from "react";
import StudentLayout from "./StudentLayout";
import {
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  Brain,
  BookOpen,
  Headphones,
  BarChart3,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  HelpCircle,
  ChevronDown,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import subscriptionService from "../../services/subscriptionService";

// ======================================================
// STATIC PRESENTATION CONTENT
// Plan information itself comes from the backend.
// ======================================================

const benefits = [
  {
    icon: Brain,
    title: "AI-powered feedback",
    description: "Understand your strengths and areas to improve.",
    bg: "bg-[#FFF0F3]",
    color: "text-[#FF2454]",
  },
  {
    icon: BarChart3,
    title: "Track your progress",
    description: "Monitor your practice performance over time.",
    bg: "bg-[#EAF4FF]",
    color: "text-[#1680E8]",
  },
  {
    icon: Headphones,
    title: "Speaking practice",
    description: "Build confidence with structured speaking practice.",
    bg: "bg-[#E5F9F1]",
    color: "text-[#00A879]",
  },
  {
    icon: BookOpen,
    title: "Learning resources",
    description: "Access resources to support IELTS preparation.",
    bg: "bg-[#F1EAFE]",
    color: "text-[#8653D6]",
  },
];

const faqs = [
  {
    question: "What is included in the Free plan?",
    answer:
      "The Free plan is a starting point for IELTS preparation. Your available mock tests, practice tests and study materials are determined by the features enabled for your account.",
  },
  {
    question: "What is included in Student Pro?",
    answer:
      "Student Pro is the paid individual plan. Its features and duration are displayed from the active plan configuration.",
  },
  {
    question: "How do I upgrade my plan?",
    answer:
      "Choose Student Pro and continue to secure checkout. Your subscription is updated after the payment process is confirmed by the payment provider.",
  },
  {
    question: "Can I purchase an institute plan here?",
    answer:
      "Institute plans are intended for coaching institutes. Contact the Equilx team to discuss institute subscriptions and setup.",
  },
];

// ======================================================
// HELPERS
// ======================================================

const formatPrice = (value) => {
  const amount = Number(value || 0);

  if (!Number.isFinite(amount)) return "₹0";

  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

const getPlanCode = (plan) => String(plan?.code || "").toUpperCase();

const getPlanDuration = (plan) => {
  const months = Number(plan?.version?.durationMonths || 0);

  if (!months) return "No expiry";
  if (months === 1) return "1 month";

  return `${months} months`;
};

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), {
        once: true,
      });
      existingScript.addEventListener("error", () => resolve(false), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });

const getApiErrorMessage = (error) =>
  error?.message || "Something went wrong. Please try again.";

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingPlan, setProcessingPlan] = useState("");

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [openFaq, setOpenFaq] = useState(0);

  // ----------------------------------------------------
  // LOAD PLANS AND CURRENT SUBSCRIPTION
  // ----------------------------------------------------

  const loadSubscriptionData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [plansResponse, subscriptionResponse] = await Promise.all([
        subscriptionService.getPlans(),
        subscriptionService.getMySubscription(),
      ]);

      const receivedPlans = Array.isArray(plansResponse?.data)
        ? plansResponse.data
        : [];

      setPlans(receivedPlans);
      setCurrentSubscription(subscriptionResponse?.data || null);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSubscriptionData();
  }, [loadSubscriptionData]);

  // ----------------------------------------------------
  // CURRENT PLAN
  // ----------------------------------------------------

  const currentPlanCode = useMemo(() => {
    const subscriptionCode = currentSubscription?.plan?.code;

    // The subscription endpoint returns null when no active
    // paid personal subscription exists. In that case the
    // page treats the user's starting tier as Free.
    return subscriptionCode
      ? String(subscriptionCode).toUpperCase()
      : "FREE";
  }, [currentSubscription]);

  const isCurrentPlan = (plan) =>
    getPlanCode(plan) === currentPlanCode;

  // ----------------------------------------------------
  // NORMALIZE API PLAN DATA
  // ----------------------------------------------------

  const normalizedPlans = useMemo(() => {
    const freePlan = plans.find(
      (plan) => getPlanCode(plan) === "FREE"
    );

    const studentProPlan = plans.find(
      (plan) => getPlanCode(plan) === "STUDENT_PRO"
    );

    const freeCard = freePlan
      ? {
          ...freePlan,
          displayName: "Free",
          displayDescription:
            "A simple way to start building your IELTS routine.",
          displayFeatures: [
            "2 full mock tests",
            "8 practice tests",
            "All available study materials",
          ],
          displayPrice: freePlan.version?.priceInclGst ?? 0,
          displayDuration: "No expiry",
          cardType: "free",
        }
      : null;

    const studentProCard = studentProPlan
      ? {
          ...studentProPlan,
          displayName: "Student Pro",
          displayDescription:
            "For independent learners ready to go deeper.",
          displayFeatures: [
            "Full test library",
            "AI Writing feedback",
            "AI Speaking feedback",
            "Progress reports",
          ],
          displayPrice: studentProPlan.version?.priceInclGst ?? 0,
          displayDuration: getPlanDuration(studentProPlan),
          cardType: "student",
        }
      : null;

    const institute6 = {
      id: "institute-6m-display",
      code: "INSTITUTE_6_MONTH",
      displayName: "Institute 6M",
      displayDescription:
        "A connected workspace for coaching institutes.",
      displayPrice: 12000,
      displayDuration: "6 months",
      displayFeatures: [
        "Trainer and student management",
        "Batches and assignments",
        "Human Writing grading",
        "Live Speaking, chat and CRM",
      ],
      cardType: "institute",
    };

    const institute12 = {
      id: "institute-12m-display",
      code: "INSTITUTE_12_MONTH",
      displayName: "Institute 12M",
      displayDescription:
        "Institute workflows for a full year.",
      displayPrice: 17000,
      displayDuration: "12 months",
      displayFeatures: [
        "Everything in Institute 6M",
        "Trainer and batch workflows",
        "Institute reports",
        "CRM and communication tools",
      ],
      cardType: "institute",
    };

    return [
      freeCard,
      studentProCard,
      institute6,
      institute12,
    ].filter(Boolean);
  }, [plans]);

  // ----------------------------------------------------
  // PAYMENT FLOW - STUDENT PRO
  // ----------------------------------------------------

  const handleStudentProPurchase = async (plan) => {
    if (!plan?.version?.id) {
      setNotice(
        "The Student Pro plan version is not available right now. Please refresh and try again."
      );
      return;
    }

    if (isCurrentPlan(plan)) {
      setNotice("You are already using this plan.");
      return;
    }

    setProcessingPlan(plan.id);
    setNotice("");
    setError("");

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error(
          "Unable to load secure payment checkout. Please check your internet connection."
        );
      }

      const idempotencyKey =
        window.crypto?.randomUUID?.() ||
        `equilx-${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const orderResponse =
        await subscriptionService.createPaymentOrder(
          plan.version.id,
          idempotencyKey
        );

      const order = orderResponse?.data;

      if (!order?.orderId || !order?.paymentId || !order?.keyId) {
        throw new Error(
          "The payment order response is incomplete. Please contact support."
        );
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: Math.round(Number(order.amount) * 100),
        currency: order.currency || "INR",
        name: "Equilx IELTS",
        description: `${plan.displayName} subscription`,
        order_id: order.orderId,

        handler: async (response) => {
          try {
            await subscriptionService.verifyPayment({
              paymentId: order.paymentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setNotice(
              "Payment verification submitted successfully. Your subscription will be activated after the payment confirmation webhook is processed."
            );

            await loadSubscriptionData(true);
          } catch (verificationError) {
            setError(
              `Payment verification could not be completed: ${getApiErrorMessage(
                verificationError
              )}`
            );
          } finally {
            setProcessingPlan("");
          }
        },

        modal: {
          ondismiss: () => {
            setProcessingPlan("");
          },
        },

        theme: {
          color: "#F04462",
        },
      });

      checkout.on("payment.failed", (response) => {
        setProcessingPlan("");
        setError(
          response?.error?.description ||
            "Payment could not be completed. Please try again."
        );
      });

      checkout.open();
    } catch (err) {
      setProcessingPlan("");
      setError(getApiErrorMessage(err));
    }
  };

  // ----------------------------------------------------
  // PLAN ACTIONS
  // ----------------------------------------------------

  const handlePlanAction = (plan) => {
    setNotice("");
    setError("");

    if (isCurrentPlan(plan)) {
      setNotice("You’re currently using this plan. Enjoy your IELTS preparation!");
      return;
    }

    if (plan.cardType === "free") {
      setNotice(
        "The Free plan is your starting point. You can continue practising with the features available in your account."
      );
      return;
    }

    if (plan.cardType === "student") {
      handleStudentProPurchase(plan);
      return;
    }

    if (plan.cardType === "institute") {
      setNotice(
        "Interested in an institute plan? Please contact the Equilx team for institute subscription assistance."
      );
    }
  };

  // ----------------------------------------------------
  // SCROLL
  // ----------------------------------------------------

  const scrollToPlans = () => {
    document.getElementById("available-plans")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------

  return (
    <StudentLayout>
      <div className="mx-auto w-full max-w-[1800px] space-y-7 pb-10">

        {/* PAGE HEADER */}

        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#F04462]">
              <Crown size={14} />
              Plans & Membership
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#10265F] dark:text-[#FFF8FA] sm:text-3xl">
              Choose your learning plan
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-[#71809D] dark:text-[#C1B5C0] sm:text-sm">
              Find the right plan for your IELTS preparation and
              work towards your target band score at your own pace.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-[#E7ECF6] bg-white px-3 py-2.5 dark:border-[#49333D] dark:bg-[#211e27] sm:self-auto">
            <ShieldCheck size={17} className="text-[#00A879]" />
            <span className="text-[10px] font-bold text-[#506995] dark:text-[#C1B5C0]">
              Secure subscription options
            </span>
          </div>
        </section>

        {/* HERO BANNER */}

        <section className="relative overflow-hidden rounded-2xl border border-[#E7ECF6] dark:border-[#49333D]">
          <div className="grid min-h-[210px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="relative z-10 flex flex-col justify-center bg-gradient-to-r from-white via-[#F5F7FF] to-[#FFF0F4] p-5 dark:from-[#211e27] dark:via-[#29232D] dark:to-[#30232B] sm:p-7 lg:p-9">
              <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#F04462]">
                <Sparkles size={14} />
                Your IELTS Journey
              </p>

              <h2 className="mt-3 max-w-2xl text-2xl font-black leading-tight tracking-tight text-[#10265F] dark:text-[#FFF8FA] sm:text-3xl lg:text-4xl">
                Invest in your preparation.
                <span className="text-[#F04462]">
                  {" "}Grow your confidence.
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-xs leading-6 text-[#506995] dark:text-[#C1B5C0] sm:text-sm">
                Practise each IELTS module, understand your performance
                and choose the level of support that fits your learning goals.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToPlans}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#F04462] px-5 py-3 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#DF3152] hover:shadow-lg hover:shadow-[#F04462]/20"
                >
                  Explore plans
                  <ArrowRight size={15} />
                </button>

                <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#71809D] dark:text-[#C1B5C0]">
                  <LockKeyhole size={14} />
                  Secure subscription options
                </span>
              </div>
            </div>

            <div className="relative min-h-[190px] overflow-hidden sm:min-h-[230px] lg:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1100&q=90"
                alt="Students collaborating and studying together"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* PLANS HEADING */}

        <section
          id="available-plans"
          className="scroll-mt-6"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-[#10265F] dark:text-[#FFF8FA]">
                Plans that fit your goals
              </h2>
              <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">
                Compare features and choose the right level of support.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadSubscriptionData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-[#E7ECF6] bg-white px-3 py-2 text-xs font-semibold text-[#40516F] transition hover:border-[#F04462] hover:text-[#F04462] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#49333D] dark:bg-[#211e27] dark:text-[#D5CAD2]"
            >
              <RefreshCw
                size={13}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh plans
            </button>
          </div>
        </section>

        {/* API ERROR */}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-red-700 dark:text-red-300">
                Something needs attention
              </p>
              <p className="mt-1 break-words text-xs leading-5 text-red-600 dark:text-red-300/80">
                {error}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-xs font-bold text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-[#E7ECF6] bg-white dark:border-[#49333D] dark:bg-[#211e27]">
            <LoaderCircle
              size={32}
              className="animate-spin text-[#F04462]"
            />
            <p className="mt-4 text-sm font-semibold text-[#40516F] dark:text-[#D5CAD2]">
              Loading available plans...
            </p>
            <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">
              Fetching your subscription details
            </p>
          </div>
        ) : normalizedPlans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DCE2EE] bg-white px-5 py-14 text-center dark:border-[#49333D] dark:bg-[#211e27]">
            <Crown size={30} className="mx-auto text-[#F04462]" />
            <h3 className="mt-3 text-base font-bold text-[#10265F] dark:text-white">
              No plans available
            </h3>
            <p className="mt-2 text-xs text-[#71809D] dark:text-[#C1B5C0]">
              We could not find any currently available individual plans.
            </p>
            <button
              type="button"
              onClick={() => loadSubscriptionData(true)}
              className="mt-5 rounded-xl bg-[#F04462] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#DF3152]"
            >
              Try again
            </button>
          </div>
        ) : (
          /* PLAN CARDS */

          <section className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {normalizedPlans.map((plan) => {
              const current = isCurrentPlan(plan);
              const isStudent = plan.cardType === "student";
              const isFree = plan.cardType === "free";
              const isInstitute = plan.cardType === "institute";
              const isProcessing = processingPlan === plan.id;

              return (
                <article
                  key={plan.id}
                  className={[
                    "group relative flex min-h-[490px] flex-col overflow-hidden rounded-[26px] border bg-white p-6",
                    "transition-all duration-300 ease-out",
                    "hover:-translate-y-2 hover:shadow-[0_24px_55px_rgba(35,48,91,0.12)]",
                    "dark:bg-[#211e27]",
                    isStudent
                      ? "border-[#FF8299] shadow-[0_14px_38px_rgba(240,68,98,0.09)] hover:border-[#F04462] hover:shadow-[0_24px_55px_rgba(240,68,98,0.18)] dark:border-[#F04462]"
                      : "border-[#E8DFE3] shadow-[0_4px_18px_rgba(35,48,91,0.025)] hover:border-[#F7A6B5] dark:border-[#49333D]",
                  ].join(" ")}
                >
                  {/* SUBTLE HOVER GLOW */}

                  <div
                    className={[
                      "pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
                      isStudent
                        ? "bg-[#F04462]"
                        : "bg-[#FF9BAC]",
                    ].join(" ")}
                  />

                  {/* PLAN TOP AREA */}

                  <div className="flex min-h-[35px] items-center justify-between gap-2">
                    {isStudent ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF0F3] px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide text-[#E93659] dark:bg-[#402630] dark:text-[#FF9AAC]">
                        <Sparkles size={13} />
                        For independent learners
                      </span>
                    ) : (
                      <h3 className="text-lg font-extrabold text-[#303B70] dark:text-[#FFF8FA]">
                        {plan.displayName}
                      </h3>
                    )}

                    {!isStudent && (
                      <span className="shrink-0 rounded-full bg-[#F7F4F5] px-3 py-2 text-[10px] font-medium text-[#50617F] dark:bg-[#302B35] dark:text-[#D5CAD2]">
                        {plan.displayDuration}
                      </span>
                    )}
                  </div>

                  {isStudent && (
                    <div className="mt-5 flex items-center justify-between gap-2">
                      <h3 className="text-lg font-extrabold text-[#303B70] dark:text-[#FFF8FA]">
                        {plan.displayName}
                      </h3>
                      <span className="shrink-0 rounded-full bg-[#F7F4F5] px-3 py-2 text-[10px] font-medium text-[#50617F] dark:bg-[#302B35] dark:text-[#D5CAD2]">
                        {plan.displayDuration}
                      </span>
                    </div>
                  )}

                  {/* PRICE */}

                  <div className="mt-7">
                    <p className="text-[38px] font-black tracking-tight text-[#303B70] dark:text-[#FFF8FA]">
                      {formatPrice(plan.displayPrice)}
                    </p>
                  </div>

                  {/* DESCRIPTION */}

                  <p className="mt-4 min-h-[48px] text-sm leading-6 text-[#61718F] dark:text-[#C1B5C0]">
                    {plan.displayDescription}
                  </p>

                  {/* FREE CURRENT PLAN MESSAGE */}

                  {isFree && current && (
                    <div className="mt-4 rounded-xl border border-[#BDEBD8] bg-[#F0FBF6] px-3 py-3 dark:border-[#245D49] dark:bg-[#183329]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          size={16}
                          className="shrink-0 text-[#0A9A68]"
                        />
                        <p className="text-xs font-bold text-[#087B56] dark:text-[#7AE0B7]">
                          You’re currently on the Free plan
                        </p>
                      </div>
                      <p className="mt-1 pl-6 text-[11px] leading-5 text-[#39866C] dark:text-[#A5DCC6]">
                        Your learning journey has already started. Keep
                        practising and upgrade whenever you’re ready.
                      </p>
                    </div>
                  )}

                  {/* OTHER CURRENT PLAN MESSAGE */}

                  {!isFree && current && (
                    <div className="mt-4 rounded-xl border border-[#BDEBD8] bg-[#F0FBF6] px-3 py-2.5 dark:border-[#245D49] dark:bg-[#183329]">
                      <p className="flex items-center gap-2 text-xs font-bold text-[#087B56] dark:text-[#7AE0B7]">
                        <CheckCircle2 size={15} />
                        Your current plan
                      </p>
                    </div>
                  )}

                  {/* DIVIDER */}

                  <div className="my-6 border-t border-[#E9E0E4] dark:border-[#49333D]" />

                  {/* FEATURES */}

                  <ul className="space-y-5">
                    {plan.displayFeatures.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3"
                      >
                        <Check
                          size={18}
                          strokeWidth={2.2}
                          className="mt-0.5 shrink-0 text-[#F04462]"
                        />
                        <span className="text-sm leading-6 text-[#40516F] dark:text-[#D5CAD2]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* BUTTON */}

                  <div className="mt-auto pt-9">
                    {current ? (
                      <div className="flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl border border-[#BDEBD8] bg-[#F0FBF6] px-4 py-3 text-sm font-bold text-[#087B56] dark:border-[#245D49] dark:bg-[#183329] dark:text-[#7AE0B7]">
                        <CheckCircle2 size={17} />
                        Current plan
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePlanAction(plan)}
                        disabled={Boolean(processingPlan)}
                        className={[
                          "flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold",
                          "transition-all duration-300",
                          "disabled:cursor-not-allowed disabled:opacity-60",
                          isStudent
                            ? "border-[#F04462] bg-[#F04462] text-white shadow-[0_10px_22px_rgba(240,68,98,0.18)] hover:-translate-y-0.5 hover:bg-[#DF3152] hover:shadow-[0_14px_28px_rgba(240,68,98,0.28)]"
                            : "border-[#E9D5DC] bg-white text-[#303B70] hover:-translate-y-0.5 hover:border-[#F04462] hover:bg-[#FFF7F8] hover:text-[#E93659] dark:border-[#49333D] dark:bg-[#211e27] dark:text-[#FFF8FA] dark:hover:bg-[#30232B]",
                        ].join(" ")}
                      >
                        {isProcessing ? (
                          <>
                            <LoaderCircle
                              size={17}
                              className="animate-spin"
                            />
                            Preparing checkout...
                          </>
                        ) : (
                          <>
                            {isFree
                              ? "Start for free"
                              : isInstitute
                                ? "Enquire about plan"
                                : "Explore plan"}
                            <ArrowRight size={17} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* PLAN NOTICE */}

        {notice && (
          <div className="flex items-start gap-3 rounded-xl border border-[#FFCCD6] bg-[#FFF5F7] p-4 dark:border-[#69404C] dark:bg-[#30232B]">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-[#F04462]"
            />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#10265F] dark:text-[#FFF8FA]">
                Plan update
              </p>
              <p className="mt-1 text-xs leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                {notice}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNotice("")}
              className="text-xs font-bold text-[#71809D] transition hover:text-[#F04462]"
            >
              Close
            </button>
          </div>
        )}

        {/* BENEFITS */}

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-[#10265F] dark:text-[#FFF8FA]">
              More than just practice
            </h2>
            <p className="mt-1 text-xs text-[#71809D] dark:text-[#C1B5C0]">
              Tools designed to support your preparation.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="group rounded-2xl border border-[#E7ECF6] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#F7A6B5] hover:shadow-[0_16px_35px_rgba(35,48,91,0.08)] dark:border-[#49333D] dark:bg-[#211e27]"
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${benefit.bg} ${benefit.color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon size={21} />
                  </span>

                  <h3 className="mt-4 text-sm font-extrabold text-[#10265F] dark:text-[#FFF8FA]">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-[#71809D] dark:text-[#C1B5C0]">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}

        <section className="rounded-2xl border border-[#E7ECF6] bg-white p-5 dark:border-[#49333D] dark:bg-[#211e27] sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3] text-[#F04462]">
              <HelpCircle size={21} />
            </span>

            <div>
              <h2 className="text-lg font-black text-[#10265F] dark:text-[#FFF8FA]">
                Frequently asked questions
              </h2>
              <p className="mt-1 text-[11px] text-[#71809D] dark:text-[#C1B5C0]">
                A few things to know before choosing a plan.
              </p>
            </div>
          </div>

          <div className="mt-5 divide-y divide-[#EEF1F8] dark:divide-[#49333D]">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <span className="text-xs font-bold text-[#10265F] dark:text-[#FFF8FA] sm:text-sm">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={17}
                      className={`shrink-0 text-[#71809D] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <p className="max-w-3xl pb-4 pr-6 text-xs leading-6 text-[#71809D] dark:text-[#C1B5C0]">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SUPPORT BANNER */}

        <section className="relative overflow-hidden rounded-2xl bg-[#10265F] p-6 sm:p-8">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#FF2454]/20 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#FF8DA5]">
                <MessageCircle size={14} />
                Need assistance?
              </span>

              <h2 className="mt-2 text-xl font-black text-white">
                Not sure which plan is right for you?
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-6 text-white/65">
                Contact our team and get help choosing the right IELTS
                subscription for your learning requirements.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setNotice(
                  "Please contact the Equilx team for subscription assistance."
                )
              }
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#F04462] px-5 py-3 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#DF3152] hover:shadow-lg hover:shadow-[#F04462]/20"
            >
              Contact our team
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      </div>
    </StudentLayout>
  );
}
